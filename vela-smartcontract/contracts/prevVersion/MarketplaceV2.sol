// SPDX-License-Identifier: https://multiverseexpert.io/
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
}

interface ILAND {
    function lockToken(uint256 token) external;

    function unlockToken(uint256 token) external;
}

contract MarketplaceV2 is AccessControl, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _marketIdCounter;
    address public _wallet;
    ITOKEN public wlToken;
    enum TokenType {
        CLOSED,
        ERC1155,
        ERC721
    }
    bytes4 public constant ERC1155InterfaceId = 0xd9b67a26;
    bytes4 public constant ERC721InterfaceId = 0x80ac58cd;
    //แก้แล้วอยู่ market
    struct Item {
        address _item;
        TokenType _itemType;
        address _owner;
        uint256 _tokenId;
        uint256 _amount;
        uint256 _price;
        uint256 _expiration;
        address _buyer;
        bool _available;
        uint256 _marketId;
        address _token;
    }
    //แก้แล้วอยู่ offer
    struct Offer {
        address _buyer;
        uint256 _price;
        uint256 _amount;
        uint256 _marketId;
        uint256 _expiration;
        uint256 _offerId;
        bool _isAccept;
        bool _active;
    }
    //แก้แล้วอยู่ market
    Item[] public items;
    //แก้แล้วอยู่ offer
    mapping(address => Offer[]) public offers;
    //แก้แล้วอยู่ market
    event PlaceItem(
        address item,
        uint256 price,
        uint256 marketId,
        uint256 tokenId,
        uint256 amount
    );
    //แก้แล้วอยู่ offer
    event BuyItem(
        uint256 marketId,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address seller,
        address buyer
    );
    //แก้แล้วอยู่ market
    event CancelItem(uint256 marketId, address owner, uint256 price);
    //แก้แล้วอยู่ offer
    event CloseOffer(uint256 marketId, uint256 offerId);

    //แก้แล้วอยู่ offer
    event MakeOffer(
        uint256 marketId,
        uint256 amount,
        uint256 price,
        bool status
    );

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    //แก้แล้วอยู่ market
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
    //แก้แล้วอยู่ market
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
                items[i]._owner == msg.sender
            ) revert("This item is already created");
        }
        _;
    }
    //แก้แล้วอยู่ market
    modifier onlyItemOwner(uint256 marketId) {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(found, "Not found token");
        bool isERC721 = IERC721(itemData._item).supportsInterface(
            ERC721InterfaceId
        );
        bool isERC1155 = IERC1155(itemData._item).supportsInterface(
            ERC1155InterfaceId
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
        _;
    }

    //แก้แล้วอยู่ market
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
        wlToken = ITOKEN(tokenWhiteList);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _wallet = msg.sender;
    }

    //แก้แล้วอยู่ market
    function placeItem(
        address item,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 expiration,
        address token
    ) public whenNotPaused uniqueItem(item, tokenId, amount) {
        TokenType itemType = TokenType.CLOSED;
        require(amount >= 1, "Amount is incorrect");
        require(price > 0, "Price must more than zero");
        require(wlToken._getWhiteList(token), "Token isn't allow");
        require(
            IERC20(token).balanceOf(msg.sender) >= wlToken.getFee(price),
            "Balance is not enough"
        );
        IERC20(token).transferFrom(msg.sender, _wallet, wlToken.getFee(price));
        if (IERC1155(item).supportsInterface(ERC1155InterfaceId)) {
            itemType = TokenType.ERC1155;
            require(
                IERC1155(item).balanceOf(msg.sender, tokenId) >= amount,
                "Item isn't owned"
            );
            require(
                IERC1155(item).isApprovedForAll(msg.sender, address(this)),
                "Item isn't approved"
            );
        } else if (IERC721(item).supportsInterface(ERC721InterfaceId)) {
            itemType = TokenType.ERC721;
            require(
                IERC721(item).ownerOf(tokenId) == msg.sender,
                "Item isn't owned"
            );
            require(
                IERC721(item).isApprovedForAll(msg.sender, address(this)),
                "Item isn't approved"
            );
        } else revert("Type is incorrect");
        require(expiration > block.timestamp, "Incorrect expiration");
        uint256 marketId = _marketIdCounter.current();
        ILAND(item).lockToken(tokenId);
        _marketIdCounter.increment();
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

    //แก้แล้วอยู่ offer
    function buyItem(uint256 marketId, uint256 amount)
        public
        whenNotPaused
        onlyExistItem(marketId)
    {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(
            IERC20(itemData._token).balanceOf(msg.sender) >=
                itemData._price * amount,
            "Balance isn't enough"
        );
        require(itemData._buyer == address(0), "Item is already sold");
        require(amount <= itemData._amount, "Item is not enough");
        require(msg.sender != itemData._owner, "You already owned this item");
        if (itemData._itemType == TokenType.ERC1155)
            require(
                IERC1155(itemData._item).balanceOf(
                    itemData._owner,
                    itemData._tokenId
                ) >= itemData._amount,
                "Seller doesn't owned"
            );
        if (itemData._itemType == TokenType.ERC721)
            require(
                IERC721(itemData._item).ownerOf(itemData._tokenId) ==
                    itemData._owner,
                "Seller doesn't owned"
            );
        IERC20(itemData._token).transferFrom(
            msg.sender,
            itemData._owner,
            itemData._price * amount
        );
        ILAND(itemData._item).unlockToken(itemData._tokenId);
        tranferItem(itemData, amount, msg.sender);
        if (itemData._amount == amount) {
            items[marketId]._available = false;
            items[marketId]._buyer = msg.sender;
        }
        items[marketId]._amount -= amount;
        emit BuyItem(
            marketId,
            itemData._tokenId,
            amount,
            itemData._price * amount,
            itemData._owner,
            msg.sender
        );
    }

    //แก้แล้วอยู่ offer
    function makeOffer(
        uint256 marketId,
        uint256 price,
        uint256 expiration,
        uint256 amount
    ) public whenNotPaused onlyExistItem(marketId) {
        require(block.timestamp < expiration, "Offer is expired");
        (, Item memory itemData) = _getItemInfo(marketId);
        require(
            itemData._price * amount <=
                IERC20(itemData._token).balanceOf(msg.sender),
            "Balance is not enough"
        );
        require(itemData._amount >= amount, "Amount item is not enough");
        require(itemData._buyer == address(0), "Item is already sold");
        require(amount > 0, "Amount is incorrect");
        require(itemData._owner != msg.sender, "You already owned this item");
        offers[itemData._owner].push(
            Offer(
                msg.sender,
                price,
                amount,
                marketId,
                expiration,
                offers[itemData._owner].length,
                false,
                true
            )
        );
        emit MakeOffer(marketId, amount, price * amount, true);
    }

    //แก้แล้วอยู่ market
    function getItems() public view returns (Item[] memory) {
        return items;
    }

    //แก้แล้วอยู่ offer
    function getOfferLists(address owner) public view returns (Offer[] memory) {
        return offers[owner];
    }

    //แก้แล้วอยู่ offer
    function getOfferById(address owner, uint256 offerId)
        public
        view
        returns (bool status, Offer memory)
    {
        return (true, offers[owner][offerId]);
    }

    //แก้ offer
    function acceptOffer(uint256 marketId, uint256 offerId)
        public
        whenNotPaused
        onlyExistItem(marketId)
    {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(itemData._buyer == address(0), "Item is already sold");
        (bool status, Offer memory offerData) = getOfferById(
            itemData._owner,
            offerId
        );
        require(status, "Offer not found");
        require(offerData._active, "Offer is not active");
        require(offerData._isAccept == false, "Item is already accept");
        require(offerData._expiration >= block.timestamp, "Offer is expired");
        require(msg.sender == itemData._owner, "You can't accept this offer");
        require(
            itemData._amount >= offerData._amount,
            "Item in market is not enough"
        );
        require(
            IERC20(items[marketId]._token).balanceOf(offerData._buyer) >=
                offerData._price * offerData._amount,
            "Balance buyer is not enough"
        );
        ILAND(itemData._item).unlockToken(itemData._tokenId);
        tranferItem(itemData, offerData._amount, offerData._buyer);
        IERC20(itemData._token).transferFrom(
            offerData._buyer,
            itemData._owner,
            offerData._price * offerData._amount
        );
        if (offerData._amount == itemData._amount) {
            items[marketId]._available = false;
            items[marketId]._buyer = offerData._buyer;
        }
        items[marketId]._amount -= offerData._amount;
        offers[itemData._owner][offerId]._isAccept = true;
        offers[itemData._owner][offerId]._active = false;
    }

    //แก้ offer
    function closeOffer(uint256 offerId, uint256 marketId)
        public
        whenNotPaused
        onlyExistItem(marketId)
    {
        address itemOwner = items[marketId]._owner;
        require(offerId < offers[itemOwner].length, "Invalid offerId");
        require(
            offers[itemOwner][offerId]._buyer == msg.sender,
            "You can't close this offer"
        );
        uint256 fee = wlToken.getFee(offers[itemOwner][offerId]._price);
        require(
            IERC20(items[marketId]._token).balanceOf(msg.sender) >= fee,
            "Balance is not enough to pay fee"
        );
        IERC20(items[marketId]._token).transferFrom(msg.sender, _wallet, fee);
        offers[itemOwner][offerId]._active = false;
        emit CloseOffer(marketId, offerId);
    }

    //แก้แล้วอยู่ market
    function cancelItem(uint256 marketId)
        public
        whenNotPaused
        onlyItemOwner(marketId)
    {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(items[marketId]._available, "Items is already not available");
        require(msg.sender == itemData._owner, "You can't cancel this item");
        require(
            IERC20(itemData._token).balanceOf(msg.sender) >=
                wlToken.getFee(itemData._price),
            "Balance is not enough to cancel"
        );
        IERC20(itemData._token).transferFrom(
            msg.sender,
            _wallet,
            wlToken.getFee(itemData._price)
        );
        ILAND(itemData._item).unlockToken(itemData._tokenId);
        emit CancelItem(itemData._marketId, itemData._owner, itemData._price);
        items[marketId]._available = false;
    }

    //แก้แล้วอยู่ market
    function setAdminWallet(address wallet)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _wallet = wallet;
    }

    //แก้แล้วอยู่ market
    function getMarketId(
        address item,
        address owner,
        uint256 tokenId,
        uint256 amount,
        bool status
    ) public view returns (bool, uint256) {
        for (uint256 i = 0; i < items.length; i++) {
            if (
                items[i]._available == status &&
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

    //แก้แล้วอยู่ market
    function setAvailable(uint256 marketId)
        public
        whenNotPaused
        onlyExistItem(marketId)
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        items[marketId]._available = false;
        ILAND(items[marketId]._item).unlockToken(items[marketId]._tokenId);
        return true;
    }

    //แก้แล้วอยู่ offer
    function tranferItem(
        Item memory itemData,
        uint256 amount,
        address buyer
    ) internal virtual whenNotPaused {
        if (itemData._itemType == TokenType.ERC1155) {
            IERC1155(itemData._item).safeTransferFrom(
                itemData._owner,
                buyer,
                itemData._tokenId,
                amount,
                ""
            );
        } else if (itemData._itemType == TokenType.ERC721) {
            IERC721(itemData._item).safeTransferFrom(
                itemData._owner,
                buyer,
                itemData._tokenId
            );
        } else revert("Item type is incorrect");
    }
}
