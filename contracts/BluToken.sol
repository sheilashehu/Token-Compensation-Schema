// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Blu is ERC20, Ownable {

   constructor() ERC20("Blu Token", "BLU") {
   }
    function mint (address recipient_, uint256 amount_) public onlyOwner() {
    _mint( recipient_, amount_);
  }
}