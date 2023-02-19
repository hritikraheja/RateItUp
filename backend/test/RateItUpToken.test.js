const { assert } = require("chai");
var Web3 = require("web3");
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

    it("Contract has the correct owner", async () => {
      assert.equal(await tokenContract._owner(), deployer);
    });

    it("All tokens are contained inside the contract.", async () => {
      const balance = await tokenContract.checkContractBalance();
      assert.equal(Web3.utils.fromWei(balance, "ether"), 10000000);
    });
  });

  describe("Withdrawal methods", async () => {
    it("Send tokens from contract", async () => {
      let receiverBalance = await tokenContract.balanceOf(accounts[0]);
      console.log(`Initial receiver balance : ${receiverBalance.toNumber()}`);
      await tokenContract.sendToken(accounts[0], `${10 ** 18}`, {
        from: deployer,
      });
      receiverBalance = Web3.utils.fromWei(
        await tokenContract.balanceOf(accounts[0]),
        "ether"
      );
      console.log(`Final receiver balance : ${receiverBalance}`);
      assert.equal(receiverBalance, 1);
    });

    it("Withdrawal of some tokens", async () => {
      let deployerBalance = await tokenContract.balanceOf(deployer);
      console.log(`Initial owner balance : ${deployerBalance.toNumber()}`);
      await tokenContract.withdraw(`${10 * 10 ** 18}`, { from: deployer });
      deployerBalance = Web3.utils.fromWei(
        await tokenContract.balanceOf(deployer),
        "ether"
      );
      console.log(`Final owner balance : ${deployerBalance}`);
      assert.equal(deployerBalance, 10);
    });

    it("Withdrawal of all tokens", async () => {
      let deployerBalance = Web3.utils.fromWei(
        await tokenContract.balanceOf(deployer),
        "ether"
      );
      console.log(`Initial owner balance : ${deployerBalance}`);
      await tokenContract.withdrawAll({ from: deployer });
      deployerBalance = Web3.utils.fromWei(
        await tokenContract.balanceOf(deployer),
        "ether"
      );
      console.log(`Final owner balance : ${deployerBalance}`);
      assert.equal(deployerBalance, 9999999);
    });
  });
});
