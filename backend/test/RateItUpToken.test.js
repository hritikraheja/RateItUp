const { assert } = require("chai");

const RateItUpToken = artifacts.require("RateItUpToken");

contract("RateItUpToken", ([deployer, ...accounts]) => {
  let tokenContract;

  before(async () => {
    tokenContract = await RateItUpToken.deployed();
  });

  describe("Basics", async () => {
    it("Contract has correct name", async () => {
      const name = await tokenContract.name();
      assert.equal(name, "RateItUpToken");
    });

    it("Contract has correct symbol", async () => {
      const symbol = await tokenContract.symbol();
      assert.equal(symbol, "RIU");
    });

    it("Contract has the correct owner", async() => {
        assert.equal(await tokenContract._owner(), deployer)
    })

    it("All tokens are contained inside the contract.", async () => {
      const balance = await tokenContract.checkContractBalance();
      assert.equal(balance, 10000000);
    });
  });

  describe("Withdrawal methods", async () => {
    it("Send tokens from contract", async () => {
      let receiverBalance = await tokenContract.balanceOf(accounts[0]);
      console.log(`Initial receiver balance : ${receiverBalance.toNumber()}`);
      await tokenContract.sendToken(accounts[0], "1000", { from: deployer });
      receiverBalance = await tokenContract.balanceOf(accounts[0]);
      console.log(`Final receiver balance : ${receiverBalance.toNumber()}`);
      assert.equal(receiverBalance, 1000);
    });

    it("Withdrawal of some tokens", async () => {
      let deployerBalance = await tokenContract.balanceOf(deployer);
      console.log(`Initial owner balance : ${deployerBalance.toNumber()}`);
      await tokenContract.withdraw(100, { from: deployer });
      deployerBalance = await tokenContract.balanceOf(deployer);
      console.log(`Final owner balance : ${deployerBalance.toNumber()}`);
      assert.equal(deployerBalance, 100);
    });

    it("Withdrawal of all tokens", async () => {
      let deployerBalance = await tokenContract.balanceOf(deployer);
      console.log(`Initial owner balance : ${deployerBalance.toNumber()}`);
      await tokenContract.withdrawAll({ from: deployer });
      deployerBalance = await tokenContract.balanceOf(deployer);
      console.log(`Final owner balance : ${deployerBalance.toNumber()}`);
      assert.equal(deployerBalance, 9999000);
    });
  });
});
