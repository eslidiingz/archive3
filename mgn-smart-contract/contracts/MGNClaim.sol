// SPDX-License-Identifier: https://multiverseexpert.io/
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IMGNLAND {
    function safeBurn(uint256 _tokenId) external;
    
    function balanceOf(address user) external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address);
    
    function getEndProjectTime(uint32 _zone) external view returns (uint256);

    function getZoneOfToken(uint256 tokenId) external view returns (uint32);

    function getLandPrice() external view returns (uint256);
}


interface IMGNToken {
    
    function mint(address to, uint256 amount) external;

    function transferFrom(address from, address to, uint256 amount) external;
}

contract MGNClaim is Pausable, AccessControl {

    bytes32 public constant SETTER_ROLE = keccak256("SETTER_ROLE");
    bytes32 public constant MARKET_ROLE = keccak256("MARKET_ROLE");

    address landAddress;
    address mgnAddress;

    uint256 rewardPerLand = 1500;

    IMGNToken mgntoken;
    IMGNLAND land;

    using Counters for Counters.Counter;
    Counters.Counter private _stakeIdCounter;

    constructor(address _landAddress, address _mgnTokenAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SETTER_ROLE, msg.sender);
        _grantRole(MARKET_ROLE, msg.sender);

        land = IMGNLAND(_landAddress);
        mgntoken = IMGNToken(_mgnTokenAddress);
    }

    function setReward(uint256 rewardRate) public onlyRole(SETTER_ROLE){
        rewardPerLand = rewardRate;
    }

    function claimLand(uint256[] memory tokenId) external {

        uint256 calReward;
        uint256 amountReturn;

        for (uint32 i=0; i< tokenId.length; i++) {

            uint32 zone = land.getZoneOfToken(tokenId[i]);
            uint endTime = land.getEndProjectTime(zone);
            uint256 landPrice = land.getLandPrice();

            require(land.ownerOf(tokenId[i]) == msg.sender, "Ownership: you are not the owner");
            require(block.timestamp >= endTime, "Endtime: it's over");
            land.safeBurn(tokenId[i]);
            calReward += rewardPerLand * landPrice / 10000;
            amountReturn += land.getLandPrice();
        }

        uint256 totalAmount = calReward + amountReturn;

        //transfer initial amount and reward to user
        mgntoken.transferFrom(
            landAddress,
            msg.sender,
            totalAmount
        );
        
    }
    
}
