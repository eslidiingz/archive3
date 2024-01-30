// SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
interface IERC20 {
    function mint(address to, uint256 amount) external;
    function transferFrom(address sender, address recipient, uint256 amount) external;
    function transfer(address recipient, uint256 amount) external;
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
    function getDepositRate(uint256 startPrice) external view returns(uint256); 
}
interface ILAND{
    function lockToken(uint256 token) external;
    function unlockToken(uint256 token) external;
}
contract Auction is AccessControl, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _marketIdCounter;
    address public _admin;
    address public _setter;
    ITOKEN public wlToken;
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
    bytes32 public constant ACTIVE_SETTER_ROLE = keccak256("ACTIVE_SETTER_ROLE");
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
    struct Bid {
        address _buyer;
        uint256 _price;
        uint256 _time;
        uint256 bidId;
        bool _isAccept;
        bool _active;
        bool _cancel;
    }
    struct RefundStruct{
        bool isBid;
        bool isRefund;
    }
    Item[] items;
    mapping(uint256 => Bid[]) public bidders; // marketId => struct
    mapping(uint256 => mapping(address => RefundStruct)) public refundStruct; // marketId => (bidder => isBid)
    event BidItem(uint256 marketId, uint256 price, uint256 tokenId, address item);
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
        require(itemData._expiration >= block.timestamp, "This item has expired");
        _;
    }
    modifier onlyItemOwner(uint256 marketId) {
        (bool found, Item memory itemData) = _getItemInfo(marketId);
        require(found, "Not found token");
        bool isERC721 = IERC721(itemData._item).supportsInterface(ERC721_INTERFACE);
        bool isERC1155 = IERC1155(itemData._item).supportsInterface(ERC1155_INTERFACE);
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
                items[i]._status == StatusType.BIDDING
            ) revert("This item is already created");
        }
        _;
    }
    function _getItemInfo(uint256 marketId) public view returns(bool, Item memory) {
        Item memory itemData = items[marketId];
        if(itemData._item == address(0)) return (false, itemData);
        return(true, itemData);
    }
    constructor(address tokenWhitelist) {
        address adminWallet = 0xe923EA8B926E9a4b9B3f7FadBF5dd1319a677D67;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ACTIVE_SETTER_ROLE, msg.sender);
        _grantRole(ACTIVE_SETTER_ROLE, adminWallet);
        wlToken = ITOKEN(tokenWhitelist);
        _admin = adminWallet;
        _setter = msg.sender;
    }
    function placeAuction(
        address item,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        uint256 expiration,
        uint256 terminatePrice,
        address token
    ) public whenNotPaused uniqueItem(item, tokenId, amount) returns(uint256) {
        require(wlToken._getWhiteList(token), "Token isn't in whitelist");
        require(amount > 0, "Amount is incorrect");
        require(price > 0, "Price must greater than zero");
        require(expiration > block.timestamp, "Incorrect expiration");
        TokenType itemType = TokenType.CLOSED;
        if(IERC1155(item).supportsInterface(ERC1155_INTERFACE)){
            itemType = TokenType.ERC1155;
            require(IERC1155(item).balanceOf(msg.sender, tokenId) >= amount, "You do not own this item");
            require(IERC1155(item).isApprovedForAll(msg.sender, address(this)), "Item is not approve");
        } else if(IERC721(item).supportsInterface(ERC721_INTERFACE)){
            itemType = TokenType.ERC721;
            require(IERC721(item).ownerOf(tokenId) == msg.sender, "You do not own this item");
            require(IERC721(item).isApprovedForAll(msg.sender, address(this)), "Items is not approve");
        }
        uint256 marketId = _marketIdCounter.current();
        _marketIdCounter.increment();
        ILAND(item).lockToken(tokenId);
        require(IERC20(token).balanceOf(msg.sender) >= wlToken.getFee(price), "Balance is not enough to pay fee");
        IERC20(token).transferFrom(msg.sender, _admin, wlToken.getFee(price));
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
                wlToken.getDepositRate(price) // deposit price
            )
        );
        bidders[marketId].push(
            Bid(
                msg.sender, // buyer
                price,
                block.timestamp, // start time
                bidders[marketId].length, // bidId
                false, // isAccept
                true, // isActive
                false // isCancel
            )
        );
        return marketId;
    }
    function tranferItem(Item memory itemData) internal virtual whenNotPaused {
        ILAND(itemData._item).unlockToken(itemData._tokenId);
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
            revert("Tranfer item fail");
        }
    }
    function buyAuction(uint256 marketId) public whenNotPaused onlyExistItem(marketId){
        (, Item memory itemData) = _getItemInfo(marketId);
        require(msg.sender != itemData._owner, "You already owned this item");
        require(itemData._terminatePrice > 0, "This item available for bidding");
        require(
            itemData._status == StatusType.BIDDING &&
            itemData._lockedBuyer == address(0)
        , "Auction isn't available");
        require(IERC20(itemData._token).balanceOf(msg.sender) >= itemData._terminatePrice, "Balance is not enough");
        IERC20(itemData._token).transferFrom(msg.sender, itemData._owner, itemData._terminatePrice);
        items[marketId]._available = false;
        items[marketId]._lockedBuyer = msg.sender;
        items[marketId]._buyer = msg.sender;
        items[marketId]._acceptTime = block.timestamp;
        items[marketId]._status = StatusType.SOLD;
        tranferItem(itemData);
    }
    function refundBid(uint256 marketId) public whenNotPaused onlyExistItem(marketId) {
        (, Item memory itemData) = _getItemInfo(marketId);
        RefundStruct memory refundData = refundStruct[marketId][msg.sender];
        Bid memory bidData = _getBidWinner(marketId);
        require(
            refundData.isBid && refundData.isRefund == false &&
            itemData._owner != msg.sender &&
            bidData._buyer != msg.sender,
            "You can't refund");
        require(
            itemData._status != StatusType.BIDDING ||
            itemData._expiration < block.timestamp
            , "Refund isn't available");
        refundStruct[marketId][msg.sender].isRefund = true;
        IERC20(itemData._token).approve(msg.sender, itemData._refundPrice);
        IERC20(itemData._token).transfer(msg.sender, itemData._refundPrice);
    }
    function withdrawCash(address token, uint256 percent) public onlyRole(DEFAULT_ADMIN_ROLE){
        uint256 balance = IERC20(token).balanceOf(address(this));
        // 90% from all balance
        IERC20(token).transferFrom(address(this), _admin, balance * percent / 100);
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
    function cancelAuction(uint256 marketId) public whenNotPaused onlyItemOwner(marketId)  {
        (, Item memory itemData) = _getItemInfo(marketId);
        require(msg.sender == itemData._owner, "You can't cancel this auction");
        ILAND(itemData._item).unlockToken(itemData._tokenId);
        items[marketId]._available = false;
        items[marketId]._status = StatusType.CLOSE_AUCTION;
    }
    function cancelBid(uint256 marketId, uint256 offerId) public whenNotPaused onlyExistItem(marketId) {
        Bid memory bidData = bidders[marketId][offerId];
        require(bidData._buyer == msg.sender, "You can't cancle this bid");
        require(items[marketId]._owner != msg.sender, "Owner can't cancle bid");
        require(items[marketId]._status == StatusType.BIDDING, "Auction isn't available");
        require(IERC20(items[marketId]._token).balanceOf(msg.sender) >=  wlToken.getFee(bidData._price), "Balance isn't enough to pay fee");
        IERC20(items[marketId]._token).transferFrom(msg.sender, _admin, wlToken.getFee(bidData._price));
        Bid memory bidWinner = _getBidWinner(marketId);
        if(bidWinner._price == bidders[marketId][offerId]._price){
            for(uint256 i = offerId - 1; i >= 0; i--){
                if(bidders[marketId][i]._active && bidders[marketId][i]._cancel == false){
                    items[marketId]._price = bidders[marketId][i]._price;
                    break;
                }
            }
        }
        bidders[marketId][offerId]._active = false;
        bidders[marketId][offerId]._cancel = true;
    }
    function closeBid(uint256 marketId) public whenNotPaused onlyItemOwner(marketId){
         (, Item memory itemData) = _getItemInfo(marketId);
        require(itemData._lockedBuyer == address(0), "The auction has been closed");
        require(itemData._available, "This item already closed");
        require(msg.sender == itemData._owner || msg.sender == _setter, "You can't close this auction");
        Bid memory winner = _getBidWinner(marketId);
        require(items[marketId]._status == StatusType.BIDDING, "Can't close this bid");
        items[marketId]._acceptTime = items[marketId]._expiration + 1 days;
        items[marketId]._lockedBuyer = winner._buyer;
        if(bidders[marketId].length == 1 || winner._buyer == itemData._owner){
            items[marketId]._status = StatusType.CLOSE_AUCTION;
        } else {
            items[marketId]._status = StatusType.WAIT_WINNER;
        }
    }
    function winnerAcceptBid(uint256 marketId) public whenNotPaused onlyItemOwner(marketId) {
        uint256 bidIndex = bidders[marketId].length - 1;
        uint256 price = bidders[marketId][bidIndex]._price;
        require(items.length > marketId, "Item not found");
        require(items[marketId]._acceptTime >= block.timestamp, "Out of accept time");
        require(bidders[marketId][bidIndex]._buyer == msg.sender, "You can't accept this bid");
        require(IERC20(items[marketId]._token).balanceOf(msg.sender) >= price, "Balance winnner is not enough");
        require(items[marketId]._status == StatusType.WAIT_WINNER, "Auction isn't available");
        (, Item memory itemData) = _getItemInfo(marketId);
        tranferItem(itemData);
        IERC20(itemData._token).transferFrom(msg.sender, itemData._owner, price);
        bidders[marketId][bidIndex]._isAccept = true;
        bidders[marketId][bidIndex]._active = false;
        items[marketId]._available = false;
        items[marketId]._lockedBuyer = msg.sender;
        items[marketId]._status = StatusType.WINNER_ACCEPT;
    }
    function bidItem(uint256 marketId, uint256 bidPrice) public whenNotPaused onlyExistItem(marketId){
        (, Item memory itemData) = _getItemInfo(marketId);
        RefundStruct memory refundData = refundStruct[marketId][msg.sender];
        require(refundData.isBid, "Place deposit");
        require(bidders[marketId][bidders[marketId].length - 1]._price < bidPrice, "The auction price incorrect");
        require(msg.sender != itemData._owner, "You can't bid this auction");
        require(items[marketId]._available && itemData._lockedBuyer == address(0), "Auction is not available");
        require(items[marketId]._expiration >= block.timestamp, "Bid is expired");
        require(items[marketId]._status == StatusType.BIDDING, "Can't bid this auction");
        require(IERC20(items[marketId]._token).balanceOf(msg.sender) >= bidPrice, "Balance is not enough to bid");
        items[marketId]._price = bidPrice;
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
    function depositBid(uint256 marketId) public onlyExistItem(marketId){
        RefundStruct memory refundData = refundStruct[marketId][msg.sender];
        require(refundData.isBid == false && refundData.isRefund == false, "You can't deposit for auction");
        (, Item memory itemData) = _getItemInfo(marketId);
        IERC20(itemData._token).transferFrom(msg.sender, address(this), itemData._refundPrice);
        refundStruct[marketId][msg.sender].isBid = true;
    }
    function setWallet(address wallet, address setter) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE){
        _admin = wallet;
        _setter = setter;
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
    function setCloseAuction(uint256 marketId) public whenNotPaused onlyExistItem(marketId) onlyRole(ACTIVE_SETTER_ROLE){
        items[marketId]._available = false;
        items[marketId]._status = StatusType.CLOSE_AUCTION;
        ILAND(items[marketId]._item).unlockToken(items[marketId]._tokenId);
    }
}