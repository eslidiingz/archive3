// SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./MarketplaceInterface.sol";
contract MarketplaceStorage is AccessControl, Pausable {
    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");

    using Counters for Counters.Counter;
    Counters.Counter private _marketId;
    address public feeWallet;
    address public offerStorageAddress;
    ITOKEN public wlToken;

    bytes4 public constant ERC721INTERFACE = 0x80ac58cd;
    bytes4 public constant ERC1155INTERFACE = 0xd9b67a26;

    Item[] public items;

    event PlaceItem(
        address item,
        uint256 price,
        uint256 marketId,
        uint256 tokenId,
        uint256 amount
    );
    event CancelItem(uint256 marketId, address owner, uint256 price);

    constructor(address whitelist) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SETTER_ROLE, msg.sender);
        wlToken = ITOKEN(whitelist);
        feeWallet = msg.sender;
    }

    function setOfferAddress(address offer)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        offerStorageAddress = offer;
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function uniqueItem(
        address item,
        uint256 tokenId,
        uint256 amount
    ) public view {
        for (uint256 i = 0; i < items.length; i++) {
            if (
                items[i]._amount == amount &&
                items[i]._item == item &&
                items[i]._tokenId == tokenId &&
                items[i]._available &&
                items[i]._owner == msg.sender
            ) revert("This item is already created");
        }
    }

    function onlyExistItem(uint256 marketId) public view {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(found, "Item is not exist");
        require(itemData._available, "Item is not available");
        require(
            itemData._expiration >= block.timestamp,
            "This item has expired"
        );
    }

    function onlyItemOwner(uint256 marketId) public {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(found, "Not found token");
        bool isERC721 = IERC721(itemData._item).supportsInterface(
            ERC721INTERFACE
        );
        bool isERC1155 = IERC1155(itemData._item).supportsInterface(
            ERC1155INTERFACE
        );
        require(
            (isERC721 &&
                IERC721(itemData._item).ownerOf(itemData._tokenId) ==
                msg.sender) ||
                (isERC1155 &&
                    IERC1155(itemData._item).balanceOf(
                        itemData._owner,
                        itemData._tokenId
                    ) >=
                    itemData._amount),
            "You are not owned this token."
        );
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

    function placeItem(
        address item,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 expiration,
        address token
    ) public whenNotPaused  {
        uniqueItem(item, tokenId, amount);
        TokenType itemType = TokenType.CLOSED;
        require(amount >= 1, "Amount is incorrect");
        require(price > 0, "Price must more than zero");
        require(wlToken._getWhiteList(token), "Token isn't allow");
        require(
            IERC20(token).balanceOf(msg.sender) >= wlToken.getFee(price),
            "Balance is not enough"
        );
        IERC20(token).transferFrom(
            msg.sender,
            feeWallet,
            wlToken.getFee(price)
        );
        if (IERC1155(item).supportsInterface(ERC1155INTERFACE)) {
            itemType = TokenType.ERC1155;
            require(
                IERC1155(item).balanceOf(msg.sender, tokenId) >= amount,
                "Item isn't owned"
            );
            require(
                IERC1155(item).isApprovedForAll(
                    msg.sender,
                    offerStorageAddress
                ),
                "Item isn't approved"
            );
        } else if (IERC721(item).supportsInterface(ERC721INTERFACE)) {
            itemType = TokenType.ERC721;
            require(
                IERC721(item).ownerOf(tokenId) == msg.sender,
                "Item isn't owned"
            );
            require(
                IERC721(item).isApprovedForAll(msg.sender, offerStorageAddress),
                "Item isn't approved"
            );
            require(amount == 1, "Amount is incorrect");
        } else revert("Type is incorrect");
        require(expiration > block.timestamp, "Incorrect expiration");
        uint256 marketId = _marketId.current();
        ILAND(item).lockToken(tokenId, true);
        _marketId.increment();
        items.push(
            Item(
                item,
                itemType,
                msg.sender,
                tokenId,
                amount,
                price,
                expiration,
                address(0),
                true,
                marketId,
                token
            )
        );
        emit PlaceItem(item, price, marketId, tokenId, amount);
    }

    function cancelItem(uint256 marketId) public whenNotPaused  {
        onlyItemOwner(marketId);
        (, Item memory itemData) = _getItemInfo(marketId);
        require(items[marketId]._available, "Items is already not available");
        require(msg.sender == itemData._owner, "You can't cancel this item");
        require(
            IERC20(itemData._token).balanceOf(msg.sender) >=
                wlToken.getFee(itemData._price),
            "Balance is not enough to cancel"
        );
        items[marketId]._available = false;
        IERC20(itemData._token).transferFrom(
            msg.sender,
            feeWallet,
            wlToken.getFee(itemData._price)
        );
        ILAND(itemData._item).lockToken(itemData._tokenId, false);
        emit CancelItem(itemData._marketId, itemData._owner, itemData._price);
    }

    function getItems() public view returns (Item[] memory) {
        return items;
    }

    function setItem(
        uint256 marketId,
        address _buyer,
        bool _available,
        uint256 _amount
    ) public  onlyRole(SETTER_ROLE) {
        items[marketId]._buyer = _buyer;
        items[marketId]._available = _available;
        items[marketId]._amount = _amount;
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

    function getFeeWallet() public view returns (address) {
        return feeWallet;
    }

    function setFeeWallet(address wallet) public onlyRole(DEFAULT_ADMIN_ROLE) {
        feeWallet = wallet;
    }

    function setAvailable(uint256 marketId)
        public
        whenNotPaused
        
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        onlyExistItem(marketId);
        items[marketId]._available = false;
        ILAND(items[marketId]._item).lockToken(items[marketId]._tokenId, false);
        return true;
    }
}
