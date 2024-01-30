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

interface IERC721 {
    function balanceOf(address owner) external returns (uint256);

    function ownerOf(uint256 tokenId) external returns (address);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function getApproved(uint256 tokenId) external returns (address);

    function supportsInterface(bytes4 interfaceId) external returns (bool);
}

interface ILAND {
    function _lockLand(uint256 _tokenId, address _sender) external;

    function _unlockLand(uint256 _tokenId, address _sender) external;

    function updateOwner(address _newOwner, uint256 _tokenId) external;

    function getProjectEndDate() external returns (uint256);
}

contract MGNMarketplace is AccessControl, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private orderIdCounter;
    address public recipientWallet;
    uint256 public feesRate;


    bytes32 public constant CLAIMER_ROLE = keccak256("CLAIMER_ROLE");


    struct Order {
        address landContract;
        address tokenContract;
        address owner;
        uint256 orderId;
        uint256 tokenId;
        uint256 price;
        uint256 endProject;
        address buyer;
        bool available;
    }

    struct Offer {
        uint256 orderId;
        uint256 offerId;
        uint256 tokenId;
        address buyer;
        uint256 price;
        uint256 endProject;
        bool isAccept;
        bool active;
    }



    Order[] public items;
    // mapping(uint256 => Order) public items;
    mapping(address => Offer[]) public offers;

    // events
    // 1.placeOrder
    event PlaceOrder(
        address landContract,
        address tokenContract,
        uint256 orderId,
        uint256 tokenId,
        address owner,
        uint256 price
    );
    // 2.cancleOrder
    event CancelOrder(
        address landContract,
        address tokenContract,
        uint256 orderId,
        uint256 tokenId,
        address owner,
        uint256 price
    );
    // 3.buyOrder
    event BuyOrder(
        address landContract,
        address tokenContract,
        uint256 orderId,
        uint256 tokenId,
        address owner,
        address buyer,
        uint256 price
    );
    // 4.makeOffer
    event MakeOffer(
        address landContract,
        address tokenContract,
        uint256 orderId,
        uint256 offerId,
        uint256 tokenId,
        address buyer,
        uint256 price
    );
    // 5.cancleOffer
    event CancleOffer(uint256 orderId, uint256 offerId);
    // 6.acceptOffer
    event AcceptOffer(
        address landContract,
        address tokenContract,
        uint256 orderId,
        uint256 offerId,
        uint256 tokenId,
        address seller,
        address buyer,
        uint256 price
    );

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    constructor(address _wallet) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        recipientWallet = _wallet;
    }

    // set parameters
    function setRecipientWallet(address _wallet)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        recipientWallet = _wallet;
    }

    function setFeerate(uint256 _fee)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        feesRate = _fee;
    }

    // Market actions
    // 1. placeOrder
    function placeOrder(
        address _landContract,
        address _tokenContract,
        uint256 _tokenId,
        uint256 _price
    ) public whenNotPaused {
        require(
            IERC721(_landContract).ownerOf(_tokenId) == msg.sender,
            "This land is owned by other"
        );
        require(
            IERC721(_landContract).getApproved(_tokenId) == address(this),
            "This land isn't approved"
        );
        require(_price > 0, "Price must more than zero");
        uint256 _projectEndDate = ILAND(_landContract).getProjectEndDate();
        require(
            _projectEndDate > block.timestamp,
            "This Project has already ended!!"
        );

        uint256 orderId = orderIdCounter.current();

        // lock ERC721
        ILAND(_landContract)._lockLand(_tokenId, msg.sender);

        // set order
        items[orderId] = Order(
                _landContract,
                _tokenContract,
                msg.sender,
                orderId,
                _tokenId,
                _price,
                _projectEndDate,
                address(0),
                true
        );

        orderIdCounter.increment();

        // emit event
        emit PlaceOrder(
            _landContract,
            _tokenContract,
            orderId,
            _tokenId,
            msg.sender,
            _price
        );
    }

    // 2.cancleOrder
    function cancelOrder(uint256 _orderId) public whenNotPaused {
        address _landContract = items[_orderId].landContract;
        uint256 _tokenId = items[_orderId].tokenId;
        address _tokenContract = items[_orderId].tokenContract;
        address _owner = IERC721(_landContract).ownerOf(_tokenId);
        require(
            block.timestamp < items[_orderId].endProject,
            "This project ended"
        );
        require(_owner == msg.sender, "This land is owned by other");
        require(
            items[_orderId].available == true,
            "Items is already not available"
        );
        // unlock ERC721
        ILAND(_landContract)._unlockLand(_tokenId, _owner);
        // update status
        items[_orderId].available = false;
        // emit event
        emit CancelOrder(
            _landContract,
            _tokenContract,
            _orderId,
            _tokenId,
            _owner,
            items[_orderId].price
        );
    }

    // 3.buyOrder
    function buyOrder(uint256 _orderId) public whenNotPaused {
        address _landContract = items[_orderId].landContract;
        uint256 _tokenId = items[_orderId].tokenId;
        address _tokenContract = items[_orderId].tokenContract;
        address _owner = IERC721(_landContract).ownerOf(_tokenId);
        uint256 _price = items[_orderId].price;
        require(
            block.timestamp < items[_orderId].endProject,
            "This project ended"
        );
        require(
            IERC20(_tokenContract).balanceOf(msg.sender) >= _price,
            "Balance isn't enough"
        );
        require(_owner != msg.sender, "You own this item");
        require(items[_orderId].available == true, "The order isn't available");
        require(items[_orderId].buyer == address(0), "Item is already sold");
        require(_owner == items[_orderId].owner, "Seller don't own this land");
        uint256 _fee = (_price * feesRate) / 10000;

        // transfer ERC20
        IERC20(_tokenContract).transferFrom(msg.sender, _owner, _price - _fee);
        IERC20(_tokenContract).transferFrom(msg.sender, recipientWallet, _fee);

        // unlock ERC721
        ILAND(_landContract)._unlockLand(_tokenId, _owner);

        // transfer ERC721
        IERC721(_landContract).safeTransferFrom(
            _owner,
            items[_orderId].buyer,
            _tokenId
        );

        // update status
        ILAND(_landContract).updateOwner(msg.sender, _tokenId);

        items[_orderId].available = false;
        items[_orderId].buyer = msg.sender;

        // emit event
        emit BuyOrder(
            _landContract,
            _tokenContract,
            _orderId,
            _tokenId,
            _owner,
            items[_orderId].buyer,
            _price
        );
    }

    // makeOffer
    function makeOffer(uint256 _orderId, uint256 _price) public whenNotPaused {
        address _landContract = items[_orderId].landContract;
        uint256 _tokenId = items[_orderId].tokenId;
        address _tokenContract = items[_orderId].tokenContract;
        address _owner = IERC721(_landContract).ownerOf(_tokenId);
        uint256 _projectEndDate = ILAND(_landContract).getProjectEndDate();
        require(
            items[_orderId].available == true,
            "Items is already not available"
        );
        require(block.timestamp < _projectEndDate, "This project ended");
        require(
            _price <= IERC20(_tokenContract).balanceOf(msg.sender),
            "Balance is not enough"
        );
        require(items[_orderId].buyer == address(0), "Item is already sold");
        require(_owner != msg.sender, "You own this item");

        // set offer
        offers[_owner].push(
            Offer(
                _orderId,
                offers[_owner].length,
                _tokenId,
                msg.sender,
                _price,
                _projectEndDate,
                false,
                true
            )
        );

        // emit event
        emit MakeOffer(
            _landContract,
            _tokenContract,
            _orderId,
            offers[_owner].length,
            _tokenId,
            msg.sender,
            _price
        );
    }

    // cancleOffer
    function cancleOffer(uint256 _orderId, uint256 _offerId)
        public
        whenNotPaused
    {
        address _owner = IERC721(items[_orderId].landContract).ownerOf(
            items[_orderId].tokenId
        );
        require(
            offers[_owner][_offerId].active == true,
            "This offer isn't exist"
        );
        require(
            offers[_owner][_offerId].offerId == _offerId,
            "Invalid offerId"
        );
        require(
            offers[_owner][_offerId].buyer == msg.sender,
            "This offer doesn't belong to you"
        );
        require(
            block.timestamp < offers[_owner][_offerId].endProject,
            "This project ended"
        );

        // update status
        offers[_owner][_offerId].active = false;
        // emit event
        emit CancleOffer(_orderId, _offerId);
    }

    // acceptOffer
    function acceptOffer(uint256 _orderId, uint256 _offerId)
        public
        whenNotPaused
    {
        address _landContract = items[_orderId].landContract;
        uint256 _tokenId = items[_orderId].tokenId;
        address _tokenContract = items[_orderId].tokenContract;
        address _owner = IERC721(_landContract).ownerOf(_tokenId);
        address _buyer = offers[_owner][_offerId].buyer;
        uint256 _price = offers[_owner][_offerId].price;
        require(_owner == msg.sender, "You cannot accept this offer");
        require(items[_orderId].available == true, "The order isn't available");
        require(items[_orderId].buyer == address(0), "Item is already sold");
        require(
            block.timestamp < offers[msg.sender][_offerId].endProject,
            "This project ended"
        );
        require(
            offers[_owner][_offerId].active == true,
            "This offer is not active"
        );
        require(
            offers[_owner][_offerId].isAccept == false,
            "This offer has already accepted"
        );
        require(
            IERC20(_tokenContract).balanceOf(_buyer) >= _price,
            "Buyer's balance is not enough"
        );
        uint256 _fee = (_price * feesRate) / 10000;

        // transfer ERC20
        IERC20(_tokenContract).transferFrom(_buyer, _owner, _price - _fee);
        IERC20(_tokenContract).transferFrom(_buyer, recipientWallet, _fee);

        // unlock ERC721
        ILAND(_landContract)._unlockLand(_tokenId, _owner);

        // transfer ERC721
        IERC721(_landContract).safeTransferFrom(_owner, _buyer, _tokenId);

        // update status
        ILAND(_landContract).updateOwner(_buyer, _tokenId);

        items[_orderId].available = false;
        items[_orderId].buyer = _buyer;
        offers[_owner][_offerId].isAccept = true;
        offers[_owner][_offerId].active = false;

        // emit event
        emit AcceptOffer(
            _landContract,
            _tokenContract,
            _orderId,
            _offerId,
            _tokenId,
            _owner,
            _buyer,
            _price
        );
    }

    // read function

    function getItems() public view returns (Order[] memory) {
        return items;
    }

    function getOfferLists(address _owner)
        public
        view
        returns (Offer[] memory)
    {
        return offers[_owner];
    }

    function getOfferById(address _owner, uint256 _offerId)
        public
        view
        returns (bool status, Offer memory)
    {
        return (true, offers[_owner][_offerId]);
    }

    function getOrder(uint256 _orderId)
        public
        view
        returns (bool, Order memory)
    {
        Order memory itemData = items[_orderId];
        if (itemData.landContract == address(0)) return (false, itemData);
        return (true, itemData);
    }

}
