// SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./MarketplaceInterface.sol";
contract OfferStorage is AccessControl, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _marketId;
    address public marketStorageAddress;
    ITOKEN public wlToken;
    IMARKET public marketStorage;

    bytes4 public constant ERC721INTERFACE = 0x80ac58cd;
    bytes4 public constant ERC1155INTERFACE = 0xd9b67a26;

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

    event BuyItem(
        uint256 marketId,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address seller,
        address buyer
    );

    event MakeOffer(
        uint256 marketId,
        uint256 amount,
        uint256 price,
        bool status
    );

    event CloseOffer(uint256 marketId, uint256 offerId);

    mapping(address => Offer[]) public offers;

    constructor(address whitelist) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        wlToken = ITOKEN(whitelist);
    }

    function setMarketAddress(address market)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        marketStorageAddress = market;
        marketStorage = IMARKET(market);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function buyItem(uint256 marketId, uint256 amount) public whenNotPaused  {
        marketStorage.onlyExistItem(marketId);
        (, Item memory itemData) = marketStorage._getItemInfo(marketId);
        require(
            IERC20(itemData._token).balanceOf(msg.sender) >=
                itemData._price * amount,
            "Balance isn't enough"
        );
        require(itemData._buyer == address(0), "Item is already sold");
        require(amount <= itemData._amount && amount >= 1, "Item is not enough");
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
        ILAND(itemData._item).lockToken(itemData._tokenId, false);
        tranferItem(itemData, amount, msg.sender);
        if (itemData._amount == amount) {
            marketStorage.setItem(
                marketId,
                msg.sender,
                false,
                itemData._amount
            );
        } else {
            marketStorage.setItem(
                marketId,
                address(0),
                true,
                itemData._amount - amount
            );
        }

        emit BuyItem(
            marketId,
            itemData._tokenId,
            amount,
            itemData._price * amount,
            itemData._owner,
            msg.sender
        );
    }

    function makeOffer(
        uint256 marketId,
        uint256 price,
        uint256 expiration,
        uint256 amount
    ) public whenNotPaused  {
        marketStorage.onlyExistItem(marketId);
        require(block.timestamp < expiration, "Offer is expired");
        (, Item memory itemData) = marketStorage._getItemInfo(marketId);
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

    function acceptOffer(uint256 marketId, uint256 offerId)
        public
        whenNotPaused
        
    {
        marketStorage.onlyExistItem(marketId);
        (, Item memory itemData) = marketStorage._getItemInfo(marketId);
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
            IERC20(itemData._token).balanceOf(offerData._buyer) >=
                offerData._price * offerData._amount,
            "Balance buyer is not enough"
        );
        ILAND(itemData._item).lockToken(itemData._tokenId, false);
        tranferItem(itemData, offerData._amount, offerData._buyer);
        IERC20(itemData._token).transferFrom(
            offerData._buyer,
            itemData._owner,
            offerData._price * offerData._amount
        );
        if (offerData._amount == itemData._amount) {
            marketStorage.setItem(
                marketId,
                offerData._buyer,
                false,
                itemData._amount
            );
        } else {
            marketStorage.setItem(
                marketId,
                address(0),
                true,
                itemData._amount - offerData._amount
            );
        }
        offers[itemData._owner][offerId]._isAccept = true;
        offers[itemData._owner][offerId]._active = false;
    }

    function closeOffer(uint256 offerId, uint256 marketId)
        public
        whenNotPaused
        
    {
        marketStorage.onlyExistItem(marketId);
        (, Item memory itemData) = marketStorage._getItemInfo(marketId);
        address itemOwner = itemData._owner;
        require(offerId < offers[itemOwner].length, "Invalid offerId");
        require(
            offers[itemOwner][offerId]._buyer == msg.sender,
            "You can't close this offer"
        );
        uint256 fee = wlToken.getFee(offers[itemOwner][offerId]._price);
        require(
            IERC20(itemData._token).balanceOf(msg.sender) >= fee,
            "Balance is not enough to pay fee"
        );
        IERC20(itemData._token).transferFrom(
            msg.sender,
            marketStorage.getFeeWallet(),
            fee
        );
        offers[itemOwner][offerId]._active = false;

        emit CloseOffer(marketId, offerId);
    }

    function getOfferLists(address owner) public view returns (Offer[] memory) {
        return offers[owner];
    }

    function getOfferById(address owner, uint256 offerId)
        public
        view
        returns (bool status, Offer memory)
    {
        return (true, offers[owner][offerId]);
    }

    function tranferItem(
        Item memory itemData,
        uint256 amount,
        address buyer
    ) internal virtual whenNotPaused  {
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
