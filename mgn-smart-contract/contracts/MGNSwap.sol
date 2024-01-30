// SPDX-License-Identifier: https://multiverseexpert.io/
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface Itoken {

    function mint(address to, uint256 amount) external;
    function transferFrom(address sender,address recipient,uint256 amount) external;
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external returns (uint256);
    function allowance(address owner, address spender) external returns (uint256);
    function transfer(address recipient,uint256 amount) external;
    function burnFrom(address from, uint256 amount) external;

}

contract MGNSwap is Pausable, AccessControl, Ownable {

    Itoken public mgn;
    Itoken public busd;
    address public _globalWallet = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
    uint256 public swapFee = 3;
    uint256[2] private collectingRatio = [10,90];
    // 1 BUSD = 10 MGN
    uint256[2] private swapRatio = [1,10];
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address _busd, address _mgn) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        mgn = Itoken(_mgn);
        busd = Itoken(_busd);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function busdToMGN(uint256 _amount) public {
        require(busd.balanceOf(msg.sender) >= _amount,"Balance is not enough");
        require(_amount > 0, "The amount > 0");
        require(busd.allowance(msg.sender, address(this)) >= _amount, "Allowance balance is not enough");
        uint256 _amountafterFee = getMinimumRecieve(_amount);
        // transfer fee (BUSD)
        busd.transferFrom(msg.sender, _globalWallet, (_amount*swapFee/10000));
        // Transfer remaining BUSD
        busd.transferFrom(msg.sender, address(this), (_amountafterFee *collectingRatio[0] /100));
        busd.transferFrom(msg.sender, _globalWallet, (_amountafterFee *collectingRatio[1] /100));
        // Mint MGN == remaining BUSD
        mgn.mint(msg.sender, _amountafterFee*swapRatio[1]/swapRatio[0]);
    }

    function mgnToBusd(uint256 _amount) public {
        require(mgn.balanceOf(msg.sender) >= _amount,"Sender's balance is not enough");
        require(_amount > 0, "The amount > 0");
        require(
            busd.balanceOf(address(this)) >= _amount,
            "Wallet is not enough");
        uint256 _amountafterswap = _amount*swapRatio[0]/swapRatio[1];
        uint256 _amountafterFee = getMinimumRecieve(_amountafterswap);
        // transfer fee (BUSD)
        busd.transferFrom(msg.sender, _globalWallet, (_amountafterswap*swapFee/10000));
        // Transfer BUSD = remaining MGN
        busd.transfer(msg.sender, _amountafterFee);
        // Burn remaining MGN
        mgn.burnFrom(msg.sender, _amount);
    }

    function getSwapFee(uint256 _amount) public view returns(uint256){
        require(_amount > 0, "The amount > 0");
        uint256 _fee = _amount*swapFee/10000;
        return _fee;
    }

    function getMinimumRecieve(uint256 _amount) public view returns(uint256){
        require(_amount > 0, "The amount > 0");
        uint256 _minimumRecieve =  _amount - getSwapFee(_amount);
        return _minimumRecieve;
    }

    function setSwapFee(uint256 _fee) public onlyRole(MINTER_ROLE) {
        require(_fee > 0, "Invalid fee");
        swapFee = _fee;
    }
    
    function setCollectingRatio(uint256[] memory _collectingRatio) public onlyRole(MINTER_ROLE) {
        require(_collectingRatio.length == 2, "The value set = 2");
       for (uint256 i = 0; i < _collectingRatio.length; i++){
        require(_collectingRatio[i] > 0, "Invalid fee");
        collectingRatio[i] = _collectingRatio[i];
       }
    }

    function setSwapRatio(uint256[] memory _swapRatio) public onlyRole(MINTER_ROLE) {
        require(_swapRatio.length == 2, "The value set = 2");
       for (uint256 i = 0; i < _swapRatio.length; i++){
        require(_swapRatio[i] > 0, "Invalid fee");
        swapRatio[i] = _swapRatio[i];
       }
    }

}