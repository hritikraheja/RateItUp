import Web3 from 'web3';
const HDWalletProvider = require("@truffle/hdwallet-provider");
const RateItUpToken = require('../abis/RateItUpToken.json')
import { ContractInteractive } from '../interfaces/ContractInteractive';

export const getRateItUpTokenDaoInstance = () => {
    let provider = new HDWalletProvider('65edc5f2cc241a4f99c9909272a3bf7689c5061b695766254d153d4408ace13c', 'http://127.0.0.1:7545')
    let instance = new RateItUpTokenDao(provider, '5777')
    return instance;
}

export const getRateItUpDeploymentAddress = (networkId:string) : String => {
    return RateItUpToken.networks[networkId].address
}

export class RateItUpTokenDao implements ContractInteractive{
    private tokenContract;
    constructor(web3Provider : any, networkId : string){
        const web3 = new Web3(web3Provider)
        const tokenAbi = RateItUpToken.abi
        const deploymentAddress = RateItUpToken.networks[networkId].address
        this.tokenContract = new web3.eth.Contract(tokenAbi, deploymentAddress)
    }

    async getTokensInContract() : Promise<String> {
        let amount = await this.tokenContract.methods.checkContractBalance().call()
        let amountInEthers = Web3.utils.fromWei(amount, 'ether');
        return amountInEthers;
    }

    async getContractOwner() : Promise<String>{
        let owner = await this.tokenContract.methods._owner().call()
        return owner;
    }

    async getTokenBalanceOfAddress(address : string) : Promise<String>{
        let balance = await this.tokenContract.methods.balanceOf(address).call()
        let amountInEthers = Web3.utils.fromWei(balance, 'ether');
        return amountInEthers;
    }

    async sendTokensFromContractToAddress(receiverAddress: String, amountInWei: String): Promise<String> {
        let ownerAddress = await this.getContractOwner();
        let txn = await this.tokenContract.methods.sendToken(receiverAddress, amountInWei).send({from : ownerAddress})
        return txn.transactionHash;
    }

    async withdrawSomeTokens(amountInWei : string) : Promise<String> {
        let ownerAddress = await this.getContractOwner();
        let txn = await this.tokenContract.methods.withdraw(amountInWei).send({from : ownerAddress});
        return txn.transactionHash;
    }

    async withdrawAllTokens() : Promise<String> {
        let ownerAddress = await this.getContractOwner();
        let txn = await this.tokenContract.methods.withdrawAll().send({from : ownerAddress});
        return txn.transactionHash;
    }
}