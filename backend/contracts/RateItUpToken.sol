//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RateItUpToken is ERC20 {
    address public _owner;

    constructor(uint256 initialSupply) ERC20("RateItUpToken", "RIU") {
        _mint(address(this), initialSupply);
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only owner can call this function");
        _;
    }
    
    /**
    This method allows the owner to withdraw all the tokens.
     */
    function withdrawAll() public onlyOwner {
        _transfer(address(this), _owner, balanceOf(address(this)));
    }

    /**
    This method allows the owner to withdraw a particular amount of tokens.
     */
    function withdraw(uint _amount) public onlyOwner {
        require(_amount <= balanceOf(address(this)), "Withdrawal amount is more than balance");
        _transfer(address(this), _owner, _amount);
    }

    /**
    This method allows the owner to send a particular amount of tokens to the specified address.
     */
    function sendToken(address _receiver, uint _amount) public onlyOwner{
        require(_amount <= balanceOf(address(this)), "Withdrawal amount is more than balance");
        _transfer(address(this), _receiver, _amount);
    }

    /**
    This method allows the user to check the number of tokens owned by the contract. 
     */
    function checkContractBalance() public view returns(uint){
        return balanceOf(address(this));
    }
}
