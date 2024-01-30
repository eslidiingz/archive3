// SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
interface IERC20 {
    function mint(address to, uint256 amount) external;
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external;
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender)
        external
        returns (uint256);
}

interface IERC1155 {
    function balanceOf(address account, uint256 id) external returns (uint256);

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;

    function isApprovedForAll(address account, address operator)
        external
        returns (bool);

    function supportsInterface(bytes4 interfaceId) external returns (bool);
}

interface IERC721 {
    function balanceOf(address owner) external returns (uint256);

    function ownerOf(uint256 tokenId) external returns (address);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function isApprovedForAll(address account, address operator)
        external
        returns (bool);

    function supportsInterface(bytes4 interfaceId) external returns (bool);
}

interface ITOKEN {
    function getFee(uint256 price) external view returns (uint256);
}

interface ILAND {
    function lockToken(uint256 _tokenId, bool _isLocked) external;
}
struct Item {
    address _item;
    TokenType _itemType;
    address _owner;
    uint256 _tokenId;
    uint256 _amount;
    uint256 _price;
    uint256 _startPrice;
    uint256 _expiration;
    uint256 _acceptTime;
    address _buyer;
    bool _available;
    address _lockedBuyer;
    uint256 _marketId;
    uint256 _terminatePrice;
    StatusType _status;
    address _token;
    uint256 _refundPrice;
}
enum TokenType {
    CLOSED,
    ERC1155,
    ERC721
}
enum StatusType {
    BIDDING,
    WAIT_WINNER,
    REFUND_DEPOSIT,
    WINNER_ACCEPT,
    WINNER_CANCEL,
    CLOSE_AUCTION,
    SOLD
}

interface IAUCTION {
    function _getItemInfo(uint256 marketId)
        external
        returns (bool, Item memory);

    function setItem(
        uint256 marketId,
        uint256 amount,
        uint256 price,
        uint256 acceptTime,
        address buyer,
        bool available,
        address lockedBuyer,
        StatusType statusType
    ) external;

    function getAdminWallet() external returns (address);
}

contract BidStorage is AccessControl, Pausable {
    IAUCTION public auctionStorage;
    ITOKEN public wlToken;
    address public auctionStorageAddress;
    bytes32 public constant ACTIVE_SETTER_ROLE =
        keccak256("ACTIVE_SETTER_ROLE");
    mapping(uint256 => Bid[]) public bidders;
    mapping(uint256 => mapping(address => RefundStruct)) public refundStruct; // marketId => struct

    constructor(address tokenWhitelist) {
        wlToken = ITOKEN(tokenWhitelist);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ACTIVE_SETTER_ROLE, msg.sender);
    }

    struct RefundStruct {
        bool isBid;
        bool isRefund;
    }
    struct Bid {
        address _buyer;
        uint256 _price;
        uint256 _time;
        uint256 bidId;
        bool _isAccept;
        bool _active;
        bool _cancel;
    }

    function setAuction(address auction) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(auction != address(0), "Address is incorrect");
        auctionStorage = IAUCTION(auction);
        auctionStorageAddress = auction;
    }

    function bidItem(uint256 marketId, uint256 bidPrice) public {
        (bool found, Item memory itemData) = auctionStorage._getItemInfo(
            marketId
        );
        (Bid memory latestBid, ) = _getBidWinner(marketId);
        RefundStruct memory refundData = getRefundData(marketId, msg.sender);
        require(
            found &&
                itemData._expiration >= block.timestamp &&
                itemData._available &&
                itemData._price < bidPrice &&
                itemData._status == StatusType.BIDDING &&
                itemData._owner != msg.sender &&
                latestBid._price < bidPrice &&
                refundData.isBid && refundData.isRefund == false &&
                itemData._lockedBuyer == address(0),
            "Auction isn't available"
        );
        auctionStorage.setItem(
            marketId,
            itemData._amount,
            bidPrice,
            itemData._acceptTime,
            itemData._buyer, // buyer
            itemData._available, // available
            itemData._lockedBuyer, // locked
            itemData._status
        );
        bidders[marketId].push(
            Bid(
                msg.sender,
                bidPrice,
                block.timestamp,
                bidders[marketId].length,
                false,
                true,
                false
            )
        );
    }

    function winnerAcceptBid(uint256 marketId) public {
        (Bid memory winner, uint256 bidId) = _getBidWinner(marketId);
        (bool found, Item memory itemData) = auctionStorage._getItemInfo(
            marketId
        );
        require(
            found &&
                winner._buyer != address(0) &&
                winner._buyer != itemData._owner,
            "You can't accept this bid"
        );
        require(
            itemData._status == StatusType.WAIT_WINNER,
            "Auction isn't available"
        );
        require(
            itemData._acceptTime >= block.timestamp,
            "Accept time is expired"
        );
        bidders[marketId][bidId]._isAccept = true;
        bidders[marketId][bidId]._active = false;
        ILAND(itemData._item).lockToken(itemData._tokenId, false);
        auctionStorage.setItem(
            marketId,
            itemData._amount,
            itemData._price,
            itemData._acceptTime,
            msg.sender, // buyer
            false, // available
            msg.sender, // locked
            StatusType.WINNER_ACCEPT
        );
        IERC20(itemData._token).transferFrom(
            msg.sender,
            itemData._owner,
            winner._price
        );
        tranferItem(itemData);
    }

    function cancelBid(uint256 marketId, uint256 bidId) public {
        Bid memory bidData = bidders[marketId][bidId];
        require(bidData._buyer == msg.sender, "You can't cancel this bid");
        (bool found, Item memory itemData) = auctionStorage._getItemInfo(
            marketId
        );
        require(
            found && itemData._status == StatusType.BIDDING,
            "Auction isn't available"
        );
        IERC20(itemData._token).transferFrom(
            msg.sender,
            auctionStorage.getAdminWallet(),
            wlToken.getFee(bidData._price)
        );
        (Bid memory bidWinner, ) = _getBidWinner(marketId);
        if (bidWinner._price == bidders[marketId][bidId]._price) {
            for (uint256 i = bidId - 1; i >= 0; i--) {
                if (
                    bidders[marketId][i]._active &&
                    bidders[marketId][i]._cancel == false
                ) {
                    auctionStorage.setItem(
                        marketId,
                        itemData._amount,
                        bidders[marketId][i]._price, // set current price
                        itemData._acceptTime,
                        itemData._buyer, // buyer
                        itemData._available, // available
                        itemData._lockedBuyer, // locked
                        StatusType.BIDDING
                    );
                    break;
                }
            }
        }
        bidders[marketId][bidId]._active = false;
        bidders[marketId][bidId]._cancel = true;
    }
    function initialBid(uint256 marketId, address owner, uint256 price) public onlyRole(ACTIVE_SETTER_ROLE){
        bidders[marketId].push(
            Bid(    
                owner,
                price,
                block.timestamp,
                0,
                false,
                true,
                false
            )
        );
    }

    function getAllBids(uint256 marketId) public view returns (Bid[] memory) {
        return bidders[marketId];
    }

    function _getBidWinner(uint256 marketId)
        public
        view
        returns (Bid memory, uint256 index)
    {
        require(bidders[marketId].length >= 1, "Auction isn't start");
        for (uint256 i = bidders[marketId].length - 1; i >= 0; i--) {
            if (bidders[marketId][i]._active) return (bidders[marketId][i], i);
        }
        return (Bid(address(0), 0, 0, 0, false, false, false), 0);
    }

    function getSpecificBid(uint256 marketId, uint256 bidId)
        public
        view
        returns (Bid memory)
    {
        return bidders[marketId][bidId];
    }

    function depositCash(uint256 marketId) public {
        RefundStruct memory refundData = getRefundData(marketId, msg.sender);
        require(
            refundData.isBid == false && refundData.isRefund == false,
            "You can't deposit for auction"
        );
        (bool found, Item memory itemData) = auctionStorage._getItemInfo(
            marketId
        );
        require(
            found && itemData._expiration >= block.timestamp &&
            itemData._status == StatusType.BIDDING,
            "Item isn't available"
        );
        IERC20(itemData._token).transferFrom(
            msg.sender,
            address(this),
            itemData._refundPrice
        );
        refundStruct[marketId][msg.sender].isBid = true;
    }

    function getRefundData(uint256 marketId, address bidder)
        public
        view
        returns (RefundStruct memory)
    {
        return refundStruct[marketId][bidder];
    }

    function buyAuction(uint256 marketId) public {
        (, Item memory itemData) = auctionStorage._getItemInfo(marketId);
        require(msg.sender != itemData._owner, "You already owned this item");
        require(
            itemData._terminatePrice > 0,
            "This item available for bidding"
        );
        require(
            itemData._status == StatusType.BIDDING &&
                itemData._lockedBuyer == address(0),
            "Auction isn't available"
        );
        require(
            IERC20(itemData._token).balanceOf(msg.sender) >=
                itemData._terminatePrice,
            "Balance is not enough"
        );
        auctionStorage.setItem(
            marketId,
            itemData._amount,
            itemData._price,
            itemData._acceptTime,
            msg.sender, // buyer
            false, // available
            msg.sender, // locked
            StatusType.SOLD
        );
        IERC20(itemData._token).transferFrom(
            msg.sender,
            itemData._owner,
            itemData._terminatePrice
        );
        ILAND(itemData._item).lockToken(itemData._tokenId, false);
        tranferItem(itemData);
    }

    function tranferItem(Item memory itemData) internal virtual whenNotPaused {
        if (itemData._itemType == TokenType.ERC1155) {
            IERC1155(itemData._item).safeTransferFrom(
                itemData._owner,
                msg.sender,
                itemData._tokenId,
                itemData._amount,
                ""
            );
        } else if (itemData._itemType == TokenType.ERC721) {
            IERC721(itemData._item).safeTransferFrom(
                itemData._owner,
                msg.sender,
                itemData._tokenId
            );
        } else {
            revert("Tranfer item fail");
        }
    }

    function withdrawCash(address token)
        public
        whenPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).approve(msg.sender, balance);
        IERC20(token).transfer(msg.sender, balance);
    }

    function refundBid(uint256 marketId) public {
        (, Item memory itemData) = auctionStorage._getItemInfo(marketId);
        RefundStruct memory refundData = refundStruct[marketId][msg.sender];
        (Bid memory winner, ) = _getBidWinner(marketId);
        if(winner._buyer == msg.sender && itemData._status == StatusType.WAIT_WINNER){
            require(winner._isAccept, "Winner must accept first");
        }
        require(
            refundData.isBid &&
            refundData.isRefund == false &&
            itemData._owner != msg.sender,
            "You can't refund"
        );
        require(
            itemData._status != StatusType.BIDDING ||
            itemData._expiration < block.timestamp,
            "Refund isn't available"
        );
        refundStruct[marketId][msg.sender].isRefund = true;
        IERC20(itemData._token).approve(msg.sender, itemData._refundPrice);
        IERC20(itemData._token).transfer(msg.sender, itemData._refundPrice);
    }   
}
