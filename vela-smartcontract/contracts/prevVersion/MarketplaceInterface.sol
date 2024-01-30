// SPDX-License-Identifier: https://multiverseexpert.com/
pragma solidity ^0.8.2;

enum TokenType {
    CLOSED,
    ERC1155,
    ERC721
}

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
    function lockToken(uint256 _tokenId, bool _isLocked) external;
}

interface IMARKET {
    function _getItemInfo(uint256 marketId)
        external
        returns (bool, Item memory);

    function getFeeWallet() external returns (address);

    function uniqueItem(
        address item,
        uint256 tokenId,
        uint256 amount
    ) external;

    function onlyExistItem(uint256 marketId) external;

    function onlyItemOwner(uint256 marketId) external;

    function getItems() external view returns (Item[] memory);

    function setItem(
        uint256 marketId,
        address _buyer,
        bool _available,
        uint256 _amount
    ) external;
}
