export interface ContractInteractive{
    getTokensInContract() : Promise<String>
    getContractOwner() : Promise<String>
    getTokenBalanceOfAddress(address : string) : Promise<String>
    sendTokensFromContractToAddress(receiverAddress : string, amountInWei : string) : Promise<String>
    withdrawAllTokens() : Promise<String>,
    withdrawSomeTokens(amountInWei : String) : Promise<String>
}