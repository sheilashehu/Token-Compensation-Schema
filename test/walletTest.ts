import { ethers } from "hardhat";
import {expect} from "chai";

//1.amount is equal to zero ✅
//2.amount is between 0 and 10 ** 25 ✅
//3.amount is greater than 10 ** 25 ✅
//4.eblu can be called from address different than owner address ✅
// amount added to previous eblu minted ✅


describe("Wallet", async function () {

  it("1,2,3,4", async function () {

    const [owner, employee1, employee2] = await ethers.getSigners();
    const Wallet = await ethers.getContractFactory("Wallet");
    const EBlu = await ethers.getContractFactory("EBlu");
    const Blu = await ethers.getContractFactory("Blu");
  
    const EBluContract = await EBlu.deploy();
    const BluContract = await Blu.deploy();
    const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
  
    await BluContract.deployed();
    await EBluContract.deployed();
    await walletContract.deployed();
  
    await EBluContract.transferOwnership(walletContract.address);
  
    await expect (walletContract.sendEBLUto(employee1.address, 0)).to.be.reverted;

    await expect (walletContract.sendEBLUto(employee1.address, 10000)).to.not.be.reverted;

    await expect (walletContract.sendEBLUto(employee1.address, (10 ** 26))).to.be.reverted;

    await expect (walletContract.sendEBLUto(employee1.address, 10000, {from: owner.address})).to.not.be.reverted;
    await expect (walletContract.sendEBLUto(employee1.address, 10000, {from: employee2.address})).to.be.reverted;
  });

  
  it("Total Eblu minted should be equal to previous eblu minted and new amount", async function () {
   const [owner, employee] = await ethers.getSigners();
    const Wallet = await ethers.getContractFactory("Wallet");
    const EBlu = await ethers.getContractFactory("EBlu");
    const Blu = await ethers.getContractFactory("Blu");
  
    const EBluContract = await EBlu.deploy();
    const BluContract = await Blu.deploy();
    const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
  
    await BluContract.deployed();
    await EBluContract.deployed();
    await walletContract.deployed();
  
    await EBluContract.transferOwnership(walletContract.address);
  
    await walletContract.sendEBLUto(employee.address, 10000);
    await walletContract.sendEBLUto(employee.address, 30000);
    expect (await (EBluContract.balanceOf(employee.address))).to.equal(40000);
  });
})

