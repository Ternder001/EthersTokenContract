import { ethers } from "hardhat";
const { expect } = require('chai');

describe('SavingsContract', function () {
  let SavingsContract;
  let savingsContract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, adimport { ethers } from 'hardhat';
    import { Signer } from 'ethers';
    import { expect } from 'chai';
    
    describe('SavingsContract', function () {
      let owner: Signer;
      let user1: Signer;
      let user2: Signer;
      let savingsContract: any; // Type this properly with the contract ABI
    
      beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
    
        const SavingsContract = await ethers.getContractFactory('SavingsContract');
        savingsContract = await SavingsContract.deploy(await owner.getAddress());
        await savingsContract.deployed();
      });
    
      it('Should deposit Ether', async function () {
        const depositAmount = ethers.utils.parseEther('1');
        await expect(() => owner.sendTransaction({ to: savingsContract.address, value: depositAmount }))
          .to.changeEtherBalance(savingsContract, depositAmount);
      });
    
      it('Should deposit ERC20 tokens', async function () {
        // This test assumes you have ERC20 token deployed and have allowances set for the SavingsContract
        const tokenAddress = ''; // Insert your ERC20 token address
        const tokenAmount = ethers.utils.parseUnits('100', 18); // Insert the amount of tokens to deposit
    
        const erc20 = await ethers.getContractAt('IERC20', tokenAddress, owner);
        await erc20.approve(savingsContract.address, tokenAmount);
        await expect(() => savingsContract.depositERC20(tokenAddress, tokenAmount))
          .to.changeTokenBalance(erc20, savingsContract, tokenAmount);
      });
    
      it('Should withdraw Ether', async function () {
        const depositAmount = ethers.utils.parseEther('1');
        await owner.sendTransaction({ to: savingsContract.address, value: depositAmount });
    
        const initialBalance = await ethers.provider.getBalance(owner.getAddress());
        const withdrawAmount = ethers.utils.parseEther('0.5');
        await expect(() => savingsContract.connect(owner).withdraw(withdrawAmount))
          .to.changeEtherBalance(owner, withdrawAmount);
        const finalBalance = await ethers.provider.getBalance(owner.getAddress());
        expect(finalBalance.sub(initialBalance)).to.equal(withdrawAmount);
      });
    
      it('Should withdraw all Ether by owner', async function () {
        const depositAmount = ethers.utils.parseEther('1');
        await owner.sendTransaction({ to: savingsContract.address, value: depositAmount });
    
        const initialBalance = await ethers.provider.getBalance(owner.getAddress());
        await expect(() => savingsContract.connect(owner).withdrawAll())
          .to.changeEtherBalance(owner, depositAmount);
        const finalBalance = await ethers.provider.getBalance(owner.getAddress());
        expect(finalBalance.sub(initialBalance)).to.equal(depositAmount);
      });
    
      it('Should withdraw all ERC20 tokens by owner', async function () {
        // This test assumes you have ERC20 token deployed and have allowances set for the SavingsContract
        const tokenAddress = ''; // Insert your ERC20 token address
        const tokenAmount = ethers.utils.parseUnits('100', 18); // Insert the amount of tokens to deposit
    
        const erc20 = await ethers.getContractAt('IERC20', tokenAddress, owner);
        await erc20.approve(savingsContract.address, tokenAmount);
        await savingsContract.depositERC20(tokenAddress, tokenAmount);
    
        const initialBalance = await erc20.balanceOf(owner.getAddress());
        await expect(() => savingsContract.connect(owner).withdrawERC20(tokenAddress))
          .to.changeTokenBalance(erc20, owner, initialBalance);
        const finalBalance = await erc20.balanceOf(owner.getAddress());
        expect(finalBalance).to.equal(0);
      });
    });
    dr2] = await ethers.getSigners();
    SavingsContract = await ethers.getContractFactory('SavingsContract');
    savingsContract = await SavingsContract.deploy();
    await savingsContract.deployed();
  });

  it('should deposit Ether', async function () {
    await savingsContract.depositEther({ value: ethers.utils.parseEther('1') });
    const balance = await savingsContract.balances(owner.address);
    expect(balance).to.equal(ethers.utils.parseEther('1'));
  });

  it('should withdraw Ether', async function () {
    await savingsContract.depositEther({ value: ethers.utils.parseEther('2') });
    await savingsContract.withdraw(ethers.utils.parseEther('1'));
    const balance = await savingsContract.balances(owner.address);
    expect(balance).to.equal(ethers.utils.parseEther('1'));
  });

  it('should deposit ERC20 token', async function () {
    const ERC20Mock = await ethers.getContractFactory('ERC20Mock');
    const erc20Mock = await ERC20Mock.deploy('Mock Token', 'MOCK');
    await erc20Mock.deployed();
    await erc20Mock.transfer(addr1.address, ethers.utils.parseUnits('1000', 18));
    await erc20Mock.connect(addr1).approve(savingsContract.address, ethers.utils.parseUnits('100', 18));
    await savingsContract.connect(addr1).depositERC20(erc20Mock.address, ethers.utils.parseUnits('100', 18));
    const balance = await savingsContract.balances(addr1.address);
    expect(balance).to.equal(ethers.utils.parseUnits('100', 18));
  });

  it('should withdraw ERC20 token', async function () {
    const ERC20Mock = await ethers.getContractFactory('ERC20Mock');
    const erc20Mock = await ERC20Mock.deploy('Mock Token', 'MOCK');
    await erc20Mock.deployed();
    await erc20Mock.transfer(addr1.address, ethers.utils.parseUnits('1000', 18));
    await erc20Mock.connect(addr1).approve(savingsContract.address, ethers.utils.parseUnits('100', 18));
    await savingsContract.connect(addr1).depositERC20(erc20Mock.address, ethers.utils.parseUnits('100', 18));
    await savingsContract.withdrawERC20(erc20Mock.address, ethers.utils.parseUnits('50', 18));
    const balance = await erc20Mock.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.utils.parseUnits('950', 18));
  });
});
