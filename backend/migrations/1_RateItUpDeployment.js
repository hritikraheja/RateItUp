const RateItUpToken = artifacts.require("RateItUpToken");
var Web3 = require('web3')

module.exports = function(deployer) {
  deployer.deploy(RateItUpToken, Web3.utils.toWei('10000000', 'ether'));
};
