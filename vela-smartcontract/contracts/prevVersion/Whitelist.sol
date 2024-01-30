// SPDX-License-Identifier: https://multiverseexpert.io/
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Whitelist is AccessControl {
    uint256 public rateFee;
    uint256 public depositRate; // rate from startPrice auction
    uint256 public depositFix; // use fix price when under or equal this price
    mapping(address => bool) public whiteLists;
    constructor(address _token){
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        rateFee = 2;
        depositFix = 5 ether;
        depositRate = 2;
        whiteLists[_token] = true;
    }
    function _getWhiteList(address token) public view returns (bool){
        return whiteLists[token];
    }
    function updateWhieList(address token, bool status) public onlyRole(DEFAULT_ADMIN_ROLE){
       whiteLists[token] = status;
    }
    function grantRole(address user) public onlyRole(DEFAULT_ADMIN_ROLE){
        _grantRole(DEFAULT_ADMIN_ROLE, user);
    }
    function setFee(uint256 _rateFee) public onlyRole(DEFAULT_ADMIN_ROLE){
        require(_rateFee < 100, "Rate fee is incorrect");
        rateFee = _rateFee;
    }
    function getFee(uint256 price) public view returns (uint256) {
        return price * rateFee / 100;
    }
    function getDepositRate(uint256 startPrice) public view returns(uint256){
        uint256 price = startPrice * depositRate / 100;
        if(price <= depositFix){
            price = depositFix;
        }
        return price;
    }
    function setDepositPrice(uint256 _depositRate, uint256 _depositFix) public virtual{
        require(_depositRate <= 50, "Deposit rate is incorrect");
        require(_depositFix >= 0.000001 ether, "Deposit fix is incorrect");
        depositFix = _depositFix;
        depositRate = _depositRate;
    }
}