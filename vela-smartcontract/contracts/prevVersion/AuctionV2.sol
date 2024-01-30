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
interface STORAGE {
    function _getItemInfo(uint256 auctionId) external returns(bool, Item memory);
    function setStatus(uint256 auctionId, address buyer, address closer, bool available, uint256 acceptTime, STATUS_TYPE status) external returns (bool);
}
interface ITOKEN{
    function _getWhiteList(address token) external view returns(bool);
    function getFee(uint256 price) external view returns (uint256);
}
enum STATUS_TYPE {
    BIDDING,
    WAIT_WINNER,
    WINNER_ACCEPT,
    WINNER_CANCEL,
    CLOSE_AUCTION,
    SOLD
}
enum TokenType {
    CLOSED,
    ERC1155,
    ERC721
}
struct Item {
    address _item;
    address _owner;
    address _buyer;
    address _token;
    address _closer;
    uint256 _tokenId;
    uint256 _amount;
    uint256 _price;
    uint256 _startTime;
    uint256 _expiration;
    uint256 _acceptTime;
    uint256 _auctionId;
    uint256 _terminatePrice;
    bool _available;
    STATUS_TYPE _status;
    TokenType _itemType;
}
contract AuctionV2 is AccessControl {
    STORAGE _Storage;
    ITOKEN wlToken;
    address _wallet;
    struct Bid{
        address _bidder;
        uint256 _price;
        uint256 _bidTime;
        uint256 _bidId;
        bool _isAccept;
        bool _active;
        bool _cancel;
    }
    constructor(address _storageAdderss, address _tokenWhiteList){
        wlToken = ITOKEN(_tokenWhiteList);
        _Storage = STORAGE(_storageAdderss);
        _wallet = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ACTIVE_SETTER_ROLE, msg.sender);
    }
    bytes32 public constant ACTIVE_SETTER_ROLE = keccak256("ACTIVE_SETTER_ROLE");
    function tranferItem(Item memory itemData) internal {
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
            revert("Item is not defined");
        }
    }
    function buyAuction(uint256 auctionId) public{
        (bool isFound, Item memory itemData) =  _Storage._getItemInfo(auctionId);
        require(isFound, "Auction is not found");
        require(msg.sender != itemData._owner, "You already owned this item");
        require(itemData._expiration >= block.timestamp, "Item is expired");
        require(itemData._terminatePrice > 0, "This item available for bidding");
        require(IERC20(itemData._token).balanceOf(msg.sender) >= itemData._terminatePrice, "Balance is not enough");
        require(itemData._status == STATUS_TYPE.BIDDING, "Auction can't bidding");
        uint256 fee = wlToken.getFee(itemData._terminatePrice);
        IERC20(itemData._token).transferFrom(msg.sender, _wallet, fee);
        IERC20(itemData._token).transferFrom(msg.sender, itemData._owner, itemData._terminatePrice - fee);
        tranferItem(itemData);
        _Storage.setStatus(auctionId, msg.sender, address(0), false, 0, STATUS_TYPE.CLOSE_AUCTION);
    }
    function closeAuction(uint256 auctionId, address winner) public onlyRole(ACTIVE_SETTER_ROLE){ 
        (bool isFound, Item memory itemData) =  _Storage._getItemInfo(auctionId);
        require(isFound, "Auction is not found");
        require(itemData._expiration <= block.timestamp, "Item is expired");
        // closer get reward
        IERC20(itemData._token).transferFrom(address(this), msg.sender, 50000000000000000 wei);
        _Storage.setStatus(auctionId, winner, msg.sender, true, block.timestamp + 1 days, STATUS_TYPE.WAIT_WINNER);
    }
    function winnerAcceptAuction(uint256 auctionId) public {
        (bool isFound, Item memory itemData) =  _Storage._getItemInfo(auctionId);
        require(isFound, "Auction is not found");
        require(itemData._acceptTime >= block.timestamp, "Accpet time is invalid");
        require(itemData._available, "Auciton isn't available");
        require(itemData._status == STATUS_TYPE.WAIT_WINNER, "Auction status is invaild");
        require(itemData._buyer == msg.sender, "You can't accept this bid");
        // tranfer reward to closer
        // uint256 reward  = wlToken.getReward(itemData._amount * itemData._price);
        tranferItem(itemData);
        uint256 fee = wlToken.getFee(itemData._amount * itemData._price);
        // IERC20(itemData._token).transferFrom(msg.sender, itemData._closer, reward);
        IERC20(itemData._token).transferFrom(msg.sender, _wallet, fee);
        IERC20(itemData._token).transferFrom(msg.sender, itemData._owner, itemData._amount * itemData._price - fee);
    }
    // function bidItem(uint256 auctionId, uint256 price) public {
    //     require()

    // }
    function setWalletAdmin(address account) public onlyRole(DEFAULT_ADMIN_ROLE){
        _wallet = account;
    }
    function grantSetterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ACTIVE_SETTER_ROLE, account);
    }
    

}