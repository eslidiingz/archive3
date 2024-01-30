// SPDX-License-Identifier: https://multiverseexpert.io/
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SUTLandSetting is AccessControl, Pausable {
    uint256 pricePerLand = 100;
    address globalWallet;

    struct Coord {
        uint256 xStart;
        uint256 xEnd;
        uint256 yStart;
        uint256 yEnd;
    }

    Coord[] public restricted;

    event eSetLandPrice(uint256 _price);
    event eSetGlobalWallet(address _wallet);

    constructor(address _owner) {
        globalWallet = _owner;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function getPricePerLand() external view whenNotPaused returns (uint256) {
        return pricePerLand;
    }

    function getGlobalWallet() external view whenNotPaused returns (address) {
        return globalWallet;
    }

    function setPricePerLand(uint256 _price)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_price > 0, "Price more than zero");
        pricePerLand = _price;
        emit eSetLandPrice(_price);
    }

    function setGlobalWallet(address _walletAddress)
        public
        whenNotPaused
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_walletAddress != address(0), "Invalid wallet address");
        globalWallet = _walletAddress;
        emit eSetGlobalWallet(_walletAddress);
    }

    function restrictedArea(uint256 x, uint256 y)
        public
        view
        whenNotPaused
        returns (bool)
    {
        for (uint256 i = 0; i < restricted.length; i++)
            if (
                (x >= restricted[i].xStart && x <= restricted[i].xEnd) &&
                (y >= restricted[i].yStart && y <= restricted[i].yEnd)
            ) return true;
        return false;
    }

    function addRestrictedArea(
        uint256[] memory xStart,
        uint256[] memory xEnd,
        uint256[] memory yStart,
        uint256[] memory yEnd
    ) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            (xStart.length == xEnd.length) &&
                (yStart.length == yEnd.length) &&
                (xStart.length == yStart.length) &&
                (xEnd.length == yEnd.length),
            "Invalid array length"
        );

        for (uint256 i = 0; i < xStart.length; i++)
            restricted.push(
                Coord({
                    xStart: xStart[i],
                    xEnd: xEnd[i],
                    yStart: yStart[i],
                    yEnd: yEnd[i]
                })
            );
    }

    function removeRestrictedArea(
        uint256 xStart,
        uint256 xEnd,
        uint256 yStart,
        uint256 yEnd
    ) public whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < restricted.length; i++)
            if (
                restricted[i].xStart == xStart &&
                restricted[i].xEnd == xEnd &&
                restricted[i].yStart == yStart &&
                restricted[i].yEnd == yEnd
            ) {
                restricted[i].xStart = type(uint256).max;
                restricted[i].xEnd = type(uint256).max;
                restricted[i].yStart = type(uint256).max;
                restricted[i].yEnd = type(uint256).max;
            }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
