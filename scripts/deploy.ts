// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {

  const [owner, employee1, employee2] = await ethers.getSigners();
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const BluFactory = await ethers.getContractFactory("Blu");
  const BluContract = await BluFactory.deploy();
  await BluContract.deployed();
  console.log("Contract deployed to:", BluContract.address)

  const EBluFactory = await ethers.getContractFactory("EBlu");
  const EBluContract = await EBluFactory.deploy();
  await EBluContract.deployed();
  console.log("Contract deployed to:", EBluContract.address)

  const walletFactory = await ethers.getContractFactory("Wallet");
  const walletContract = await walletFactory.deploy(BluContract.address, EBluContract.address);
  await walletContract.deployed();
  console.log("Contract deployed to:", walletContract.address)

  const bluMinterFactory = await ethers.getContractFactory("BluMinter");
  const bluMinterContract = await bluMinterFactory.deploy(walletContract.address, BluContract.address);
  await bluMinterContract.deployed;
  console.log("Contract deployed to:", bluMinterContract.address)

  await BluContract.transferOwnership(bluMinterContract.address);
  await EBluContract.transferOwnership(walletContract.address);
  await bluMinterContract.mintInitialSupply();
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
