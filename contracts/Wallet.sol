// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./EBluToken.sol";
import "./BluToken.sol";

contract Wallet is Ownable, ReentrancyGuard {

    using SafeMath for uint256;
    uint256 private eBluMinted; 
    address public bluAddress;
    address public eBluAddress;
    mapping (address => uint256) private employeeRedemption;

    constructor(address bluAddress_, address eBluAddress_) {
      bluAddress = bluAddress_;
      eBluAddress = eBluAddress_;
    }

    function sendEBLUto (address recipient_, uint256 amount_) external onlyOwner nonReentrant{
        require (recipient_ != address(0), "Different from address zero");
        require (amount_ > 0 && eBluMinted.add(amount_) <=  10**25, "Amount exceeds wallet capacity");
        EBlu(eBluAddress).mint(recipient_, amount_);
        eBluMinted += amount_;
    }

    function redeemBlu (uint256 amount_) external nonReentrant {
        require (amount_ > 0, "Non positive amount");
        require (amount_ <= (((IERC20(bluAddress).totalSupply()).mul(IERC20(eBluAddress).balanceOf(msg.sender).add(employeeRedemption[msg.sender])).div(100000000 * 10**18)).sub(employeeRedemption[msg.sender])), "Cannot redeem this amount");
        EBlu(eBluAddress).burnTokens(msg.sender, amount_);
        employeeRedemption[msg.sender] = employeeRedemption[msg.sender].add(amount_);
        Blu(bluAddress).transfer(msg.sender, amount_); 
    } 
}
