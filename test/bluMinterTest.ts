import { ethers } from "hardhat";
import {expect} from "chai";

// 1.check if the minter is the owner ✅
// 2.check if the amount is zero at the beginning ✅
// 3. check if minted initial supply is 1000000 ✅
// 4. check the sum of initial supply and minted supply ✅
// 5.should transfer 10% of total supply in company's wallet ✅
// employee can redeem 1% in the beginning ✅
// employee can redeem 10% Blu when total supply is 10 million ✅
// employee can redeem 15% Blu when total supply is 15 million
// employee can redeem 100% Blu when total supply is 100 million ✅
// employee cannot redeem more than 100k Blu when total supply is more than 100 million ✅
// check eBlu balance after Blu tokens are redeemed ✅
// check Blu balance left to redeeem for different cases ✅
// check above scenario for two employees ✅


describe("BluMinter", async function () {

    it("1,2,3,4,5", async function () {
        const [owner, employee1, employee2] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("Wallet");
        const EBlu = await ethers.getContractFactory("EBlu");
        const Blu = await ethers.getContractFactory("Blu");
        const BluMinter = await ethers.getContractFactory("BluMinter");
      
        const EBluContract = await EBlu.deploy();
        const BluContract = await Blu.deploy();
        const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
        const BluMinterContract = await BluMinter.deploy(walletContract.address, BluContract.address);

        await BluContract.deployed();
        await EBluContract.deployed();
        await walletContract.deployed();
        await BluMinterContract.deployed();
      
        await EBluContract.transferOwnership(walletContract.address);
        await BluContract.transferOwnership(BluMinterContract.address);

        expect (await (BluContract.totalSupply())).to.equal(0);

        await expect (BluMinterContract.mintInitialSupply({from: owner.address})).to.not.be.reverted;
       
        await expect (BluMinterContract.mintInitialSupply({from: employee1.address})).to.be.reverted;
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("1000000"));
        expect (await (BluContract.balanceOf(walletContract.address))).to.equal(ethers.utils.parseEther("100000")); 
       
        await BluMinterContract.mintAndVestToWallet(ethers.utils.parseEther("4000000"));
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("5000000"));
        expect (await (BluContract.balanceOf(walletContract.address))).to.equal(ethers.utils.parseEther("500000"));        
    });

    it("Check if employee can redeem 1% in the beginning", async function () {
        const [owner, employee] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("Wallet");
        const EBlu = await ethers.getContractFactory("EBlu");
        const Blu = await ethers.getContractFactory("Blu");
        const BluMinter = await ethers.getContractFactory("BluMinter");
      
        const EBluContract = await EBlu.deploy();
        const BluContract = await Blu.deploy();
        const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
        const BluMinterContract = await BluMinter.deploy(walletContract.address, BluContract.address);

        await BluContract.deployed();
        await EBluContract.deployed();
        await walletContract.deployed();
        await BluMinterContract.deployed();
      
        await EBluContract.transferOwnership(walletContract.address);
        await BluContract.transferOwnership(BluMinterContract.address);

        await BluMinterContract.mintInitialSupply();

        await walletContract.sendEBLUto(employee.address, (ethers.utils.parseEther("100000")));
        expect (await EBluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("100000"));
        
        await walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("1000"));
        expect (await BluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("1000"));
    });

    it("Check if employee can redeem 10% Blu when total supply is 10 million", async function () {
        const [owner, employee] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("Wallet");
        const EBlu = await ethers.getContractFactory("EBlu");
        const Blu = await ethers.getContractFactory("Blu");
        const BluMinter = await ethers.getContractFactory("BluMinter");
      
        const EBluContract = await EBlu.deploy();
        const BluContract = await Blu.deploy();
        const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
        const BluMinterContract = await BluMinter.deploy(walletContract.address, BluContract.address);

        await BluContract.deployed();
        await EBluContract.deployed();
        await walletContract.deployed();
        await BluMinterContract.deployed();
      
        await EBluContract.transferOwnership(walletContract.address);
        await BluContract.transferOwnership(BluMinterContract.address);

        await BluMinterContract.mintInitialSupply();

        await BluMinterContract.mintAndVestToWallet(ethers.utils.parseEther("9000000"));
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("10000000"));

        await walletContract.sendEBLUto(employee.address, (ethers.utils.parseEther("100000")));
        expect (await EBluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("100000"));
        
        await walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("10000"));
        expect (await BluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("10000"));
    });

    it("Check if employee can redeem 15% Blu when total supply is 15 million", async function () {
        const [owner, employee] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("Wallet");
        const EBlu = await ethers.getContractFactory("EBlu");
        const Blu = await ethers.getContractFactory("Blu");
        const BluMinter = await ethers.getContractFactory("BluMinter");
      
        const EBluContract = await EBlu.deploy();
        const BluContract = await Blu.deploy();
        const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
        const BluMinterContract = await BluMinter.deploy(walletContract.address, BluContract.address);

        await BluContract.deployed();
        await EBluContract.deployed();
        await walletContract.deployed();
        await BluMinterContract.deployed();
      
        await EBluContract.transferOwnership(walletContract.address);
        await BluContract.transferOwnership(BluMinterContract.address);

        await BluMinterContract.mintInitialSupply();

        await BluMinterContract.mintAndVestToWallet(ethers.utils.parseEther("14000000"));
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("15000000"));

        await walletContract.sendEBLUto(employee.address, (ethers.utils.parseEther("100000")));
        expect (await EBluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("100000"));
        
        await walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("15000"));
        expect (await BluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("15000"));
    });

    it("Check if employee can redeem 100% Blu when total supply is 100 million", async function () {
        const [owner, employee] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("Wallet");
        const EBlu = await ethers.getContractFactory("EBlu");
        const Blu = await ethers.getContractFactory("Blu");
        const BluMinter = await ethers.getContractFactory("BluMinter");
      
        const EBluContract = await EBlu.deploy();
        const BluContract = await Blu.deploy();
        const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
        const BluMinterContract = await BluMinter.deploy(walletContract.address, BluContract.address);

        await BluContract.deployed();
        await EBluContract.deployed();
        await walletContract.deployed();
        await BluMinterContract.deployed();
      
        await EBluContract.transferOwnership(walletContract.address);
        await BluContract.transferOwnership(BluMinterContract.address);

        await BluMinterContract.mintInitialSupply();

        await BluMinterContract.mintAndVestToWallet(ethers.utils.parseEther("99000000"));
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("100000000"));

        await walletContract.sendEBLUto(employee.address, (ethers.utils.parseEther("100000")));
        expect (await EBluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("100000"));
        
        await walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("100000"));
        expect (await BluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("100000"));
    });

    it("Check if employee cannot redeem more than 100k Blu when total supply is more than 100 million", async function () {
        const [owner, employee] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("Wallet");
        const EBlu = await ethers.getContractFactory("EBlu");
        const Blu = await ethers.getContractFactory("Blu");
        const BluMinter = await ethers.getContractFactory("BluMinter");
      
        const EBluContract = await EBlu.deploy();
        const BluContract = await Blu.deploy();
        const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
        const BluMinterContract = await BluMinter.deploy(walletContract.address, BluContract.address);

        await BluContract.deployed();
        await EBluContract.deployed();
        await walletContract.deployed();
        await BluMinterContract.deployed();
      
        await EBluContract.transferOwnership(walletContract.address);
        await BluContract.transferOwnership(BluMinterContract.address);

        await BluMinterContract.mintInitialSupply();

        await BluMinterContract.mintAndVestToWallet(ethers.utils.parseEther("149000000"));
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("150000000"));

        await walletContract.sendEBLUto(employee.address, (ethers.utils.parseEther("100000")));
        expect (await EBluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("100000"));
        
        await expect (walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("150000"))).to.be.reverted;
        await expect (walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("100000"))).to.not.be.reverted;
    });

    it("Check if Eblu tokens are burned and check the amount of Blu left to redeem", async function () {
        const [owner, employee] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("Wallet");
        const EBlu = await ethers.getContractFactory("EBlu");
        const Blu = await ethers.getContractFactory("Blu");
        const BluMinter = await ethers.getContractFactory("BluMinter");
      
        const EBluContract = await EBlu.deploy();
        const BluContract = await Blu.deploy();
        const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
        const BluMinterContract = await BluMinter.deploy(walletContract.address, BluContract.address);

        await BluContract.deployed();
        await EBluContract.deployed();
        await walletContract.deployed();
        await BluMinterContract.deployed();
      
        await EBluContract.transferOwnership(walletContract.address);
        await BluContract.transferOwnership(BluMinterContract.address);

        await BluMinterContract.mintInitialSupply();

        await BluMinterContract.mintAndVestToWallet(ethers.utils.parseEther("14000000"));
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("15000000"));

        await walletContract.sendEBLUto(employee.address, (ethers.utils.parseEther("100000")));
        expect (await EBluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("100000"));

        await walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("15000"));
        expect (await BluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("15000"));

        await BluMinterContract.mintAndVestToWallet(ethers.utils.parseEther("3000000"));
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("18000000"));

        await expect (walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("3001"))).to.be.revertedWith("Cannot redeem this amount");
        await expect (walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("3000"))).to.not.be.reverted;    
        expect (await BluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("18000"));  

        expect (await EBluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("82000"));
   
        await BluMinterContract.mintAndVestToWallet(ethers.utils.parseEther("93000000"));
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("111000000"));

        await (walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("1000")));
        expect (await BluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("19000"));
   
        await expect (walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("81000"))).to.not.be.reverted;
        await expect (walletContract.connect(employee).redeemBlu(ethers.utils.parseEther("81001"))).to.be.revertedWith("Cannot redeem this amount");

        expect (await EBluContract.balanceOf(employee.address)).to.not.equal(ethers.utils.parseEther("82000"));
        expect (await EBluContract.balanceOf(employee.address)).to.equal(ethers.utils.parseEther("0"));
    });

    it("Check if Eblu tokens are burned and check the amount of Blu left to redeem for two employees", async function () {
        const [owner, employee1, employee2] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("Wallet");
        const EBlu = await ethers.getContractFactory("EBlu");
        const Blu = await ethers.getContractFactory("Blu");
        const BluMinter = await ethers.getContractFactory("BluMinter");
      
        const EBluContract = await EBlu.deploy();
        const BluContract = await Blu.deploy();
        const walletContract = await Wallet.deploy(BluContract.address, EBluContract.address);
        const BluMinterContract = await BluMinter.deploy(walletContract.address, BluContract.address);

        await BluContract.deployed();
        await EBluContract.deployed();
        await walletContract.deployed();
        await BluMinterContract.deployed();
      
        await EBluContract.transferOwnership(walletContract.address);
        await BluContract.transferOwnership(BluMinterContract.address);

        await BluMinterContract.mintInitialSupply();

        await BluMinterContract.mintAndVestToWallet(ethers.utils.parseEther("14000000"));
        expect (await (BluContract.totalSupply())).to.equal(ethers.utils.parseEther("15000000"));

        await walletContract.sendEBLUto(employee1.address, (ethers.utils.parseEther("100000")));
        expect (await EBluContract.balanceOf(employee1.address)).to.equal(ethers.utils.parseEther("100000"));

        await walletContract.sendEBLUto(employee2.address, (ethers.utils.parseEther("100000")));
        expect (await EBluContract.balanceOf(employee2.address)).to.equal(ethers.utils.parseEther("100000"));

        await walletContract.connect(employee1).redeemBlu(ethers.utils.parseEther("15000"));
        await expect (walletContract.connect(employee1).redeemBlu(ethers.utils.parseEther("15001"))).to.be.revertedWith("Cannot redeem this amount");
        expect (await BluContract.balanceOf(employee1.address)).to.equal(ethers.utils.parseEther("15000"));

        await walletContract.connect(employee2).redeemBlu(ethers.utils.parseEther("15000"));
        await expect (walletContract.connect(employee2).redeemBlu(ethers.utils.parseEther("15001"))).to.be.revertedWith("Cannot redeem this amount");
        expect (await BluContract.balanceOf(employee2.address)).to.equal(ethers.utils.parseEther("15000"));

        expect (await EBluContract.balanceOf(employee1.address)).to.equal(ethers.utils.parseEther("85000"));
        expect (await EBluContract.balanceOf(employee2.address)).to.equal(ethers.utils.parseEther("85000"));
    });
});