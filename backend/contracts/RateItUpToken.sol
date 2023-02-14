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

    function withdrawAll() public onlyOwner {
        _transfer(address(this), _owner, balanceOf(address(this)));
    }

    function withdraw(uint _amount) public onlyOwner {
        require(_amount <= balanceOf(address(this)), "Withdrawal amount is more than balance");
        _transfer(address(this), _owner, _amount);
    }

    function sendToken(address _receiver, uint _amount) public onlyOwner{
        require(_amount <= balanceOf(address(this)), "Withdrawal amount is more than balance");
        _transfer(address(this), _receiver, _amount);
    }
}
