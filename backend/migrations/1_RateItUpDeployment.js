const RateItUpToken = artifacts.require("RateItUpToken");

module.exports = function(deployer) {
  deployer.deploy(RateItUpToken, 10000000);
};
