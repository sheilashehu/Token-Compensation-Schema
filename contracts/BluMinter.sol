// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./BluToken.sol";

contract BluMinter is Ownable {
    using SafeMath for uint256;
    address private walletAddress;
    address private bluAddress;

    constructor(address walletAddress_, address bluAddress_){
        bluAddress = bluAddress_;
        walletAddress = walletAddress_;
    }

    function mintInitialSupply() external onlyOwner{
      require(Blu(bluAddress).totalSupply()== 0, "Initial Supply is minted");
      mintAndVestToWallet(1000000 * 10**18);
    }

    function mintAndVestToWallet(uint256 amount_) public onlyOwner(){
      require(amount_ > 0, "Illegal ammount");
      if(Blu(bluAddress).totalSupply() <= 10**26){
        bool dneWalletThreshold = (Blu(bluAddress).totalSupply()).add(amount_) <= 10**26;
        uint256 companyShare =  dneWalletThreshold ? ((amount_).mul(10)).div(100) : (((10**26) - Blu(bluAddress).totalSupply()).mul(10)).div(100);
        uint256 daoShare = amount_.sub(companyShare);
        Blu(bluAddress).mint(walletAddress, companyShare);
        Blu(bluAddress).mint(address(this), daoShare);
      }
      else{
        Blu(bluAddress).mint(address(this), amount_);
      }
    }
}
