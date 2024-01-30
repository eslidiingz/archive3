// SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
interface IERC20 {
    function mint(address to, uint256 amount) external;

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external;

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
    function _getWhiteList(address token) external view returns (bool);

    function getFee(uint256 price) external view returns (uint256);

    function getDepositRate(uint256 startPrice) external returns (uint256);
}

interface ILAND {
    function lockToken(uint256 _tokenId, bool) external;
}

interface IBID {
    function _getBidWinner(uint256 marketId) external returns (Bid memory);
    function initialBid(uint256 marketId, address owner, uint256 price) external;
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
contract AuctionStorage is AccessControl, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter public _marketIdCounter;
    address public _adminWallet;
    address public bidStorageAddress;
    address public _adminCloseBid;
    ITOKEN public wlToken;
    IBID public bidStorage;
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
    bytes4 public constant ERC1155_INTERFACE = 0xd9b67a26;
    bytes4 public constant ERC721_INTERFACE = 0x80ac58cd;
    bytes32 public constant ACTIVE_SETTER_ROLE =
        keccak256("ACTIVE_SETTER_ROLE");
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
    Item[] items;
    event BidItem(
        uint256 marketId,
        uint256 price,
        uint256 tokenId,
        address item
    );

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    modifier onlyExistItem(uint256 marketId) {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(found, "Item is not exist");
        require(itemData._available, "Item is not available");
        require(
            itemData._expiration >= block.timestamp,
            "This item has expired"
        );
        _;
    }
    modifier onlyItemOwner(uint256 marketId) {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(found, "Not found token");
        bool isERC721 = IERC721(itemData._item).supportsInterface(
            ERC721_INTERFACE
        );
        bool isERC1155 = IERC1155(itemData._item).supportsInterface(
            ERC1155_INTERFACE
        );
        require(
            (isERC721 &&
                IERC721(itemData._item).ownerOf(itemData._tokenId) ==
                itemData._owner) ||
                (isERC1155 &&
                    IERC1155(itemData._item).balanceOf(
                        itemData._owner,
                        itemData._tokenId
                    ) >=
                    itemData._amount),
            "You are not owned this token."
        );
        _;
    }
    modifier uniqueItem(
        address item,
        uint256 tokenId,
        uint256 amount
    ) {
        for (uint256 i = 0; i < items.length; i++) {
            if (
                items[i]._amount == amount &&
                items[i]._item == item &&
                items[i]._tokenId == tokenId &&
                items[i]._available &&
                items[i]._owner == msg.sender &&
                items[i]._status == StatusType.BIDDING
            ) revert("This item is already created");
        }
        _;
    }

    function _getItemInfo(uint256 marketId)
        public
        view
        returns (bool, Item memory)
    {
        Item memory itemData = items[marketId];
        if (itemData._item == address(0)) return (false, itemData);
        return (true, itemData);
    }

    constructor(address tokenWhiteList) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ACTIVE_SETTER_ROLE, msg.sender);
        wlToken = ITOKEN(tokenWhiteList);
        _adminWallet = msg.sender;
        _adminCloseBid = msg.sender;
    }

    function setBidStorage(address _bidStorage)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_bidStorage != address(0), "Address is incorrect");
        bidStorage = IBID(_bidStorage);
        bidStorageAddress = _bidStorage;
    }

    function placeAuction(
        address item,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 expiration,
        uint256 terminatePrice,
        address token
    ) public whenNotPaused  uniqueItem(item, tokenId, amount) {
        require(wlToken._getWhiteList(token), "Token is not in white list");
        require(amount > 0, "Amount is incorrect");
        require(price > 0, "Price must greater than zero");
        require(expiration > block.timestamp, "Incorrect expiration");
        TokenType itemType = TokenType.CLOSED;
        if (IERC1155(item).supportsInterface(ERC1155_INTERFACE)) {
            itemType = TokenType.ERC1155;
            require(
                IERC1155(item).balanceOf(msg.sender, tokenId) >= amount,
                 "You isn't owned this item"
            );
            require(
                IERC1155(item).isApprovedForAll(msg.sender, bidStorageAddress),
                "Item isn't approve"
            );
        } else if (IERC721(item).supportsInterface(ERC721_INTERFACE)) {
            itemType = TokenType.ERC721;
            require(
                IERC721(item).ownerOf(tokenId) == msg.sender,
                "You isn't owned this item"
            );
            require(
                IERC721(item).isApprovedForAll(msg.sender, bidStorageAddress),
                "Items isn't approve"
            );
            require(amount == 1, "Amount is incorrect");
        } else {
            revert("Item is incorrect");
        }
        uint256 marketId = _marketIdCounter.current();
        _marketIdCounter.increment();
        IERC20(token).transferFrom(
            msg.sender,
            _adminWallet,
            wlToken.getFee(price)
        );
        ILAND(item).lockToken(tokenId, true);
        IBID(bidStorageAddress).initialBid(marketId, msg.sender, price);
        items.push(
            Item(
                item,
                itemType,
                msg.sender,
                tokenId,
                amount,
                price, // bidding price
                price, // startPrice
                expiration,
                0, // acceptTime
                address(0), // buyer
                true, // available
                address(0), // lockedBuyer
                marketId,
                terminatePrice,
                StatusType.BIDDING,
                token,
                wlToken.getDepositRate(price)
            )
        );
    }

    function setItem(
        uint256 marketId,
        uint256 amount,
        uint256 price,
        uint256 acceptTime,
        address buyer,
        bool available,
        address lockedBuyer,
        StatusType statusType
    ) public  onlyRole(ACTIVE_SETTER_ROLE) {
        items[marketId]._amount = amount;
        items[marketId]._price = price;
        items[marketId]._acceptTime = acceptTime;
        items[marketId]._buyer = buyer;
        items[marketId]._available = available;
        items[marketId]._lockedBuyer = lockedBuyer;
        items[marketId]._status = statusType;
    }

    function setAdminWallet(address admin) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(admin != address(0), "Address is incorrect");
        _adminWallet = admin;
    }

    function getAdminWallet() public view returns (address) {
        return _adminWallet;
    }

    function cancelAuction(uint256 marketId) public  {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(itemData._status == StatusType.BIDDING, "Can't cancel this auction");
        require(msg.sender == itemData._owner, "You don't have permission");
        ILAND(itemData._item).lockToken(itemData._tokenId, false);
        items[marketId]._available = false;
        items[marketId]._status = StatusType.CLOSE_AUCTION;
    }

    function closeBid(uint256 marketId)  public {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(
            itemData._lockedBuyer == address(0) && itemData._available,
            "Auction already closed"
        );
        require(
            msg.sender == itemData._owner || msg.sender == _adminCloseBid,
            "You don't have permission"
        );
        Bid memory winner = bidStorage._getBidWinner(marketId);
        require(
            items[marketId]._status == StatusType.BIDDING,
            "Already close auction"
        );
        if (winner._buyer == address(0) || winner._buyer == itemData._owner) {
            items[marketId]._status = StatusType.CLOSE_AUCTION;
        } else {
            items[marketId]._lockedBuyer = winner._buyer;
            items[marketId]._acceptTime = block.timestamp + 1 days;
            items[marketId]._status = StatusType.WAIT_WINNER;
        }
    }

    function getMarketId(
        address item,
        address owner,
        uint256 tokenId,
        uint256 amount,
        bool isAvailable
    ) public view returns (bool, uint256) {
        for (uint256 i = 0; i < items.length; i++) {
            if (
                items[i]._available == isAvailable &&
                items[i]._owner == owner &&
                items[i]._tokenId == tokenId &&
                items[i]._amount == amount &&
                items[i]._item == item
            ) {
                return (true, items[i]._marketId);
            }
        }
        return (false, 0);
    }

    function getAllAuction() public view returns (Item[] memory) {
        return items;
    }
    function setCloseBidAddress(address user) public onlyRole(DEFAULT_ADMIN_ROLE){
        require(user != address(0), "Address is incorrect");
        _adminCloseBid = user;
    }
    function getOnlyExistAuction() public view returns(Item[] memory){
        Item[] memory auctionToClose = new Item[](items.length);
        uint256 count = 0;
        for(uint256 i = 0; i < items.length; i++){
            if(items[i]._expiration < block.timestamp && items[i]._status == StatusType.BIDDING && items[i]._available){
                auctionToClose[count] = items[i];
                count++;
            }
        }
        return auctionToClose;
    }
}
