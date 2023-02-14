const {assert} = require('chai');

const RateItUpToken = artifacts.require("RateItUpToken");
const tokenAbi = require('../abis/RateItUpToken.json')

contract('RateItUpToken', ([deployer, investor]) => {

    let tokenContract;
    
    before(async() => {
        tokenContract = await RateItUpToken.deployed()
    })

    describe('Basics', async() => {
        it('Contract has correct name', async() => {
            const name = await tokenContract.name()
            assert.equal(name, 'RateItUpToken');
        })

        it('Contract has correct symbol', async() => {
            const symbol = await tokenContract.symbol()
            assert.equal(symbol, 'RIU');
        })

        it('All tokens are contained inside the contract.', async() => {
            const balance = await tokenContract.balanceOf(tokenContract.address)
            assert.equal(balance, 1000000);
        })
    })
})