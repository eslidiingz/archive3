// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
interface IERC20 {
    function mint(address to, uint256 amount) external;
    function transferFrom(address sender, address recipient, uint256 amount) external;
    function balanceOf(address account) external returns(uint256);
    function approve(address spender, uint256 amount) external returns(bool);
    function allowance(address owner, address spender) external returns(uint256);
}
interface IERC1155 {
    function balanceOf(address account, uint256 id) external returns(uint256);
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;
    function isApprovedForAll(address account, address operator) external returns(bool);
    function supportsInterface(bytes4 interfaceId) external returns(bool);
}
interface IERC721 {
    function balanceOf(address owner) external returns(uint256);
    function ownerOf(uint256 tokenId) external returns(address);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function isApprovedForAll(address account, address operator) external returns(bool);
    function supportsInterface(bytes4 interfaceId) external returns(bool);
}
interface ITOKEN{
    function _getWhiteList(address token) external view returns(bool);
    function getFee(uint256 price) external view returns (uint256);
}
contract Auction is AccessControl {
    using Counters for Counters.Counter;

    Counters.Counter private _marketIdCounter;
    address public _wallet; // admin velaverse
    address public _setterAddress;
    ITOKEN  wlToken;
    enum TokenType {
        CLOSED,
        ERC1155,
        ERC721
    }
    enum STATUS_TYPE {
        BIDDING,
        WAIT_WINNER,
        WINNER_ACCEPT,
        WINNER_CANCEL,
        CLOSE_AUCTION,
        SOLD
    }
    bytes4 public constant ERC1155InterfaceId = 0xd9b67a26;
    bytes4 public constant ERC721InterfaceId = 0x80ac58cd;
    bytes32 public constant ACTIVE_SETTER_ROLE = keccak256("ACTIVE_SETTER_ROLE");
    struct Item {
        address _item;
        TokenType _itemType;
        address _owner;
        uint256 _tokenId;
        uint256 _amount;
        uint256 _bidPrice;
        uint256 _startPrice;
        uint256 _expiration;
        uint256 _acceptTime;
        uint256 _closeAuctionTime;
        address _buyer;
        bool _available;
        address _lockedBuyer;
        address _closeAuctionBy;
        uint256 _marketId;
        uint256 _terminatePrice;
        STATUS_TYPE _status;
        address _token;
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

    Item[] items;
    // mapping bid
    mapping (uint256 => Bid[]) bidders;

    // event
    event BidItem(uint256 marketId, uint256 price, uint256 tokenId, address item);

    modifier onlyExistItem(uint256 marketId) {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(found, "Item is not exist");
        require(itemData._available, "Item is not available");
        require(itemData._expiration >= block.timestamp, "This item has expired");
        _;
    }
    modifier onlyItemOwner(uint256 marketId) {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(found, "Not found token");
        bool isERC721 = IERC721(itemData._item).supportsInterface(ERC721InterfaceId);
        bool isERC1155 = IERC1155(itemData._item).supportsInterface(ERC1155InterfaceId);
        require(
            (isERC721 && IERC721(itemData._item).ownerOf(itemData._tokenId) == itemData._owner) || 
            (isERC1155 && IERC1155(itemData._item).balanceOf(itemData._owner, itemData._tokenId) >= itemData._amount)
            , "You are not owned this token."
        );
        _;
    }
    modifier uniqueItem(address item, uint256 tokenId, uint256 amount) {
        for(uint256 i = 0; i < items.length; i++){
            if(
                items[i]._amount == amount &&
                items[i]._item == item &&
                items[i]._tokenId == tokenId &&
                items[i]._available &&
                items[i]._owner == msg.sender && 
                items[i]._status == STATUS_TYPE.BIDDING
            ) revert("This item is already created");
        }
        _;
    }
    function _getItemInfo(uint256 marketId) public view returns(bool, Item memory) {
        Item memory itemData = items[marketId];
        if(itemData._item == address(0)) return (false, itemData);
        return(true, itemData);
    }
    constructor(address tokenWhiteList) {
        address adminWallet = 0xe923EA8B926E9a4b9B3f7FadBF5dd1319a677D67;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ACTIVE_SETTER_ROLE, msg.sender);
        _grantRole(ACTIVE_SETTER_ROLE, adminWallet);
        wlToken = ITOKEN(tokenWhiteList);
        _wallet = adminWallet;
        _setterAddress = adminWallet;
    }
    function placeAuction(
        address item,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 expiration,
        uint256 termiantePrice,
        address token
    ) public uniqueItem(item, tokenId, amount) returns(uint256) {
        require(wlToken._getWhiteList(token), "Token is not in white list");
        require(amount > 0, "Amount is incorrect");
        require(price > 0, "Price must greater than zero");
        require(expiration > block.timestamp, "Incorrect expiration");
        TokenType itemType = TokenType.CLOSED;
        if(IERC1155(item).supportsInterface(ERC1155InterfaceId))
            itemType = TokenType.ERC1155;
        if(IERC721(item).supportsInterface(ERC721InterfaceId))
            itemType = TokenType.ERC721;
        if(itemType == TokenType.ERC1155){
            require(IERC1155(item).balanceOf(msg.sender, tokenId) >= amount, "You do not own this item (ERC1155)");
            require(IERC1155(item).isApprovedForAll(msg.sender, address(this)), "Item is not approve");
        }
        if(itemType == TokenType.ERC721) {
            require(IERC721(item).ownerOf(tokenId) == msg.sender, "You do not own this item (ERC721)");
            require(IERC721(item).isApprovedForAll(msg.sender, address(this)), "Items is not approve");
        }
        uint256 marketId = _marketIdCounter.current();
        _marketIdCounter.increment();
        require(IERC20(token).balanceOf(msg.sender) >= wlToken.getFee(price) + price * 1 / 100, "Balance isn't enough to pay fee");
        IERC20(token).transferFrom(msg.sender, _wallet, wlToken.getFee(price));
        IERC20(token).transferFrom(msg.sender, address(this), price * 1 / 100); // tranfer to setter 1%
        items.push(
            Item(
                item,
                itemType,
                msg.sender,
                tokenId,
                amount,
                price, // bidPrice
                price, // startPrice
                expiration,
                0, // accept time
                0, // close auction time range
                address(0), // buyer
                true, // available
                address(0), // locked
                address(0), // close auction by
                marketId,
                termiantePrice,
                STATUS_TYPE.BIDDING,
                token
            )
        );
        
        bidders[marketId].push(
            Bid(
                msg.sender,
                price,
                block.timestamp,
                bidders[marketId].length,
                false,
                true,
                false
            )
        );
        return marketId;
    }
    function buyAuction(uint256 marketId) public onlyExistItem(marketId) returns(bool, Item memory){
        (, Item memory itemData) = _getItemInfo(marketId);
        require(msg.sender != itemData._owner, "You already owned this item");
        require(itemData._lockedBuyer == address(0), "This item is not available for buy");
        require(itemData._terminatePrice > 0, "This item available for bidding");
        require(IERC20(itemData._token).balanceOf(msg.sender) >= itemData._terminatePrice, "Balance is not enough");
        IERC20(itemData._token).transferFrom(msg.sender, itemData._owner, itemData._terminatePrice);
        // tranfer NFT to buyer
        tranferItem(itemData);
        items[marketId]._available = false;
        items[marketId]._lockedBuyer = msg.sender;
        items[marketId]._buyer = msg.sender;
        items[marketId]._acceptTime = block.timestamp;
        items[marketId]._status = STATUS_TYPE.SOLD;
        items[marketId]._bidPrice = itemData._terminatePrice;
        return (true, itemData);
    }
    function getAllAuction() public view returns(Item[] memory){
        return items;
    }
    function _getBidWinner(uint256 marketId) internal view returns(Bid memory) {
        for(uint256 i = bidders[marketId].length - 1; i >= 0; i--){
            if(bidders[marketId][i]._active) return bidders[marketId][i];
        }
        return Bid(address(0), 0, 0, 0, false, false, false);
    }
    function getAllBids(uint256 marketId) public view returns (Bid[] memory){
        return bidders[marketId];
    }
    function getSpecificBid(uint256 marketId, uint256 index) public view returns (Bid memory){
        return bidders[marketId][index];
    }
    function cancelAuction(uint256 marketId) public onlyItemOwner(marketId)  {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(msg.sender == itemData._owner, "You can't cancel this auction");
        items[marketId]._available = false;
        items[marketId]._status = STATUS_TYPE.CLOSE_AUCTION;
    }
    function cancelBid(uint256 marketId, uint256 offerId) public onlyExistItem(marketId) {
        Bid memory bidData = bidders[marketId][offerId];
        require(bidData._buyer == msg.sender, "You can't cancel this bid");
        require(IERC20(items[marketId]._token).balanceOf(msg.sender) >=  wlToken.getFee(bidData._price), "Balance is not enough to pay fee");
        IERC20(items[marketId]._token).transferFrom(msg.sender, _wallet, wlToken.getFee(bidData._price));
        bidders[marketId][offerId]._active = false;
        bidders[marketId][offerId]._cancel = true;
    }
    function closeBid(uint256 marketId) public onlyItemOwner(marketId) {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(itemData._lockedBuyer == address(0), "The auction has been closed");
        require(itemData._available, "This item is not available");
        require(
            itemData._closeAuctionTime == 0 && 
            itemData._closeAuctionBy == address(0) && 
            items[marketId]._status == STATUS_TYPE.BIDDING 
        , "Auction isn't available for close");
        Bid memory winner = _getBidWinner(marketId);
        require(winner._buyer != address(0), "Not found winner");
        items[marketId]._acceptTime = items[marketId]._expiration + 1 days;
        items[marketId]._lockedBuyer = winner._buyer;
        items[marketId]._closeAuctionTime = block.timestamp;
        items[marketId]._closeAuctionBy = msg.sender;
        if(block.timestamp <= itemData._expiration + 1 hours){
            // tranfer reward to closer
            IERC20(itemData._token).transferFrom(address(this), msg.sender, itemData._startPrice * 1 / 100);
        }
        if(bidders[marketId].length == 1){
            items[marketId]._status = STATUS_TYPE.CLOSE_AUCTION;
        } else {
            items[marketId]._status = STATUS_TYPE.WAIT_WINNER;
        }
    }
    function tranferItem(Item memory itemData) internal{
        if(itemData._itemType == TokenType.ERC1155){
            IERC1155(itemData._item).safeTransferFrom(
                itemData._owner, 
                msg.sender, 
                itemData._tokenId, 
                itemData._amount, 
                ""
            );
        } else if (itemData._itemType == TokenType.ERC721){
            IERC721(itemData._item).safeTransferFrom(
                itemData._owner, 
                msg.sender, 
                itemData._tokenId
            );
        } else {
            revert("Item is invalid");
        }
    }
    function winnerAcceptBid(uint256 marketId) public returns (bool, uint256) {
        uint256 bidIndex = bidders[marketId].length - 1;
        uint256 price = bidders[marketId][bidIndex]._price;
        require(items.length > marketId, "Item not found");
        require(items[marketId]._acceptTime >= block.timestamp, "Out of accept time");
        require(bidders[marketId][bidIndex]._buyer == msg.sender, "You can't accept this bid");
        require(IERC20(items[marketId]._token).balanceOf(msg.sender) >= price, "Balance winnner is not enough");
        require(items[marketId]._status == STATUS_TYPE.WAIT_WINNER, "Auction status must be wait winner accept, You can't accept this bid");
        (, Item memory itemData) = _getItemInfo(marketId);
        tranferItem(itemData);
        // tranfer erc20 to seller
        IERC20(itemData._token).transferFrom(msg.sender, itemData._owner, price);
        bidders[marketId][bidIndex]._isAccept = true;
        bidders[marketId][bidIndex]._active = false;
        items[marketId]._available = false;
        items[marketId]._lockedBuyer = msg.sender;
        items[marketId]._status = STATUS_TYPE.WINNER_ACCEPT;
        return (true, itemData._marketId);
    }
    function winnerCancelBid(uint256 marketId) public onlyExistItem(marketId) returns (bool) {
        (,Item memory itemData) = _getItemInfo(marketId);
        require(itemData._lockedBuyer == msg.sender, "You are not winner");
        require(items[marketId]._status == STATUS_TYPE.WAIT_WINNER, "Auction status must be wait winner");
        IERC20(itemData._token).transferFrom(msg.sender, _wallet, wlToken.getFee(itemData._bidPrice));
        for(uint256 i = 0; i < bidders[marketId].length; i++){
            if(bidders[marketId][i]._active) {
                bidders[marketId][i]._cancel = true;
                bidders[marketId][i]._active = false;
                items[marketId]._acceptTime = items[marketId]._acceptTime + 1 hours;
                items[marketId]._status = STATUS_TYPE.WINNER_CANCEL;
                items[marketId]._available = false;
                return true;
            }
        }
        return false;
    }
    function bidItem(uint256 marketId, uint256 bidPrice) public onlyExistItem(marketId){
        (, Item memory itemData) = _getItemInfo(marketId);
        require(itemData._lockedBuyer == address(0), "This item is not available for auction");
        require(bidders[marketId][bidders[marketId].length - 1]._price < bidPrice, "The auction price must be greater than the latest price");
        require(msg.sender != itemData._owner, "You can't bid this auction");
        require(items[marketId]._available, "Auction is not available");
        require(items[marketId]._status == STATUS_TYPE.BIDDING, "Can't bid this auction");
        require(IERC20(items[marketId]._token).balanceOf(msg.sender) >= bidPrice, "Balance is not enough to bid");
        items[marketId]._bidPrice = bidPrice;
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
        emit BidItem(marketId, bidPrice, itemData._tokenId, itemData._item); 
    }
    function setAdminWallet(address wallet) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _wallet = wallet;
    }
    function getMarketId(address item, address owner, uint256 tokenId, uint256 amount, bool isAvailable) public view returns(bool, uint256){
        for(uint i = 0; i < items.length; i++){
            if(
                items[i]._available == isAvailable && 
                items[i]._owner == owner && 
                items[i]._tokenId == tokenId && 
                items[i]._amount == amount && 
                items[i]._item == item
            ){
                return (true, items[i]._marketId);
            }
        }
        return (false, 0);
    }
    function setAvailable(uint256 marketId) public onlyExistItem(marketId) onlyRole(ACTIVE_SETTER_ROLE){
        items[marketId]._available = false;
        items[marketId]._status = STATUS_TYPE.CLOSE_AUCTION;
    }
    function setSetterAddress(address setter) public onlyRole(DEFAULT_ADMIN_ROLE){
        _setterAddress = setter;
    }
    function setActiveRole(address adds) public onlyRole(DEFAULT_ADMIN_ROLE){
        _grantRole(ACTIVE_SETTER_ROLE, adds);
    }
}