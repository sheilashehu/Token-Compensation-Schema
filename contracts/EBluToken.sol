// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EBlu is ERC20, Ownable {

   constructor() ERC20("eBlu Token", "eBLU") {}

   function mint (address recipient_, uint256 amount_) public onlyOwner() {
    _mint( recipient_, amount_);
  }

  function burnTokens(address account_, uint256 amount) public onlyOwner(){
    _burn(account_, amount);
  }
}