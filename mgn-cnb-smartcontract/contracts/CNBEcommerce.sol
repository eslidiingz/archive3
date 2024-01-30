// SPDX-License-Identifier:  Multiverse Expert
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract CNBEcommerce is ReentrancyGuard, Pausable, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    mapping(address => bool) public isUtilityToken;
    mapping(uint256 => sOrder) public order; // orderId => sOrder
    mapping(uint256 => mapping(uint256 => sProduct)) public product; // orderId => productId => sProduct
    uint256 public feeRate;
    address public recipientWallet;

    struct sProduct {
        uint256 productId;
        uint256 amount; // number of product
        uint256 price; // price of a product
        bool isRefunded;
    }

    struct sOrder {
        uint256 orderId;
        address buyer;
        address seller;
        uint256[] productId;
        uint256 totalPaid; // total amount of token could be transfered.
        address tokenAddress;
        uint256 feeRate;
        bool isTransferedToSeller;
    }

    event buyEvent(
        uint256[] indexed orderId,
        address indexed buyer,
        address[] seller,
        uint256[][] indexed productId,
        uint256[][] price,
        uint256[][] amount,
        uint256[] totalPaid,
        address[] tokenAddress,
        uint256 feeRate
    );

    event refundEvent(
        uint256 indexed orderId,
        uint256 indexed productId,
        uint256 refundedAmount
    );

    event batchRefundEvent(
        uint256[] indexed orderId,
        uint256[][] indexed productId,
        uint256[][] refundedAmount
    );

    event transferToSellerEvent(uint256[] indexed orderId, uint256[] totalPaid);

    constructor(
        address _tokenAddress,
        uint256 _feeRate,
        address _recipientWallet
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        isUtilityToken[_tokenAddress] = true;
        feeRate = _feeRate;
        recipientWallet = _recipientWallet;
    }

    // set parameters

    function setUtilityToken(address _tokenAddress, bool _status)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        isUtilityToken[_tokenAddress] = _status;
    }

    function setFeeRate(uint256 _feeRate)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        feeRate = _feeRate;
    }

    function setRecipientWallet(address _recipientWallet)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        recipientWallet = _recipientWallet;
    }

    // key functions

    function buy(
        uint256[] memory orderId,
        uint256[][] memory productId,
        uint256[][] memory amount,
        uint256[][] memory price, // wei
        uint256[] memory totalPaid, // wei
        address[] memory tokenAddress,
        address[] memory seller
    ) public whenNotPaused nonReentrant {
        require(
            orderId.length == amount.length &&
                totalPaid.length == tokenAddress.length &&
                tokenAddress.length == seller.length,
            "Invalid input length"
        );

        for (uint256 i = 0; i < orderId.length; i++) {
            require(
                productId[i].length == amount[i].length,
                "Invalid input length"
            );
            require(isUtilityToken[tokenAddress[i]], "Token isn't allowed");
            require(
                IERC20(tokenAddress[i]).balanceOf(msg.sender) >= totalPaid[i],
                "Your balance isn't enough"
            );

            IERC20(tokenAddress[i]).transferFrom(
                msg.sender,
                recipientWallet,
                totalPaid[i]
            );

            order[orderId[i]] = sOrder(
                orderId[i],
                msg.sender,
                seller[i],
                productId[i],
                totalPaid[i],
                tokenAddress[i],
                feeRate,
                false
            );

            for (uint256 j = 0; j < productId[i].length; j++) {
                product[orderId[i]][productId[i][j]] = sProduct(
                    productId[i][j],
                    amount[i][j],
                    price[i][j],
                    false
                );
            }
        }
        emit buyEvent(
            orderId,
            msg.sender,
            seller,
            productId,
            price,
            amount,
            totalPaid,
            tokenAddress,
            feeRate
        );
    }

    function refund(
        uint256 orderId,
        uint256 productId,
        uint256 refundedAmount
    ) public whenNotPaused nonReentrant onlyRole(ADMIN_ROLE) {
        require(
            !order[orderId].isTransferedToSeller,
            "This order is transfered to seller"
        );
        require(
            !product[orderId][productId].isRefunded,
            "This product is refunded"
        );
        require(
            IERC20(order[orderId].tokenAddress).balanceOf(recipientWallet) >=
                product[orderId][productId].amount,
            "Your balance isn't enough"
        );

        product[orderId][productId].isRefunded = true;
        product[orderId][productId].amount =
            product[orderId][productId].amount -
            refundedAmount;
        order[orderId].totalPaid =
            order[orderId].totalPaid -
            (refundedAmount * product[orderId][productId].price);
        uint256 fee = (refundedAmount *
            product[orderId][productId].price *
            order[orderId].feeRate) / 10000;

        IERC20(order[orderId].tokenAddress).transferFrom(
            recipientWallet,
            order[orderId].buyer,
            (refundedAmount * product[orderId][productId].price) - fee
        );

        emit refundEvent(orderId, productId, refundedAmount);
    }

    function batchRefund(
        uint256[] memory orderId,
        uint256[][] memory productId,
        uint256[][] memory refundedAmount
    ) public whenNotPaused nonReentrant onlyRole(ADMIN_ROLE) {
        for (uint256 i = 0; i < orderId.length; i++) {
            uint256 totalPaid;
            uint256 fee;
            for (uint256 k = 0; k < productId[i].length; k++) {
                totalPaid =
                    totalPaid +
                    (refundedAmount[i][k] *
                        product[orderId[i]][productId[i][k]].price);
            }
            require(
                IERC20(order[orderId[i]].tokenAddress).balanceOf(
                    recipientWallet
                ) >= totalPaid,
                "Your balance isn't enough"
            );
            require(
                !order[orderId[i]].isTransferedToSeller,
                "This order is transfered to seller"
            );

            for (uint256 j = 0; j < productId[i].length; j++) {
                require(
                    !product[orderId[i]][productId[i][j]].isRefunded,
                    "This product is refunded"
                );
                product[orderId[i]][productId[i][j]].isRefunded = true;
                product[orderId[i]][productId[i][j]].amount =
                    product[orderId[i]][productId[i][j]].amount -
                    refundedAmount[i][j];
                fee = (totalPaid * order[orderId[i]].feeRate) / 10000;
            }
            order[orderId[i]].totalPaid =
                order[orderId[i]].totalPaid -
                totalPaid;
            IERC20(order[orderId[i]].tokenAddress).transferFrom(
                recipientWallet,
                order[orderId[i]].buyer,
                totalPaid - fee
            );
        }

        emit batchRefundEvent(orderId, productId, refundedAmount);
    }

    function transferToSeller(
        uint256[] memory orderId,
        uint256[] memory totalPaid
    ) public whenNotPaused nonReentrant onlyRole(ADMIN_ROLE) {
        for (uint256 i = 0; i < orderId.length; i++) {
            require(
                !order[orderId[i]].isTransferedToSeller,
                "This order is transfered to seller"
            );
            require(
                order[orderId[i]].totalPaid == totalPaid[i],
                "Invalid total paid token"
            );
            uint256 fee = (order[orderId[i]].totalPaid *
                order[orderId[i]].feeRate) / 10000;

            order[orderId[i]].isTransferedToSeller = true;
            IERC20(order[orderId[i]].tokenAddress).transferFrom(
                recipientWallet,
                order[orderId[i]].seller,
                totalPaid[i] - fee
            );
        }

        emit transferToSellerEvent(orderId, totalPaid);
    }
}
