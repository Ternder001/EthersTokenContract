// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SavingsContract is Ownable {
    mapping(address => uint256) public balances;

    constructor(address _owner) Ownable(_owner) {}

    receive() external payable {
        depositEther();
    }

    function depositEther() public payable {
        require(msg.value > 0, "Amount should be greater than 0");
        balances[msg.sender] += msg.value;
    }

    function depositERC20(address _token, uint256 _amount) external {
        require(_amount > 0, "Amount should be greater than 0");
        require(
            IERC20(_token).transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        balances[msg.sender] += _amount;
    }

    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Amount should be greater than 0");
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        balances[msg.sender] -= _amount;

         if (_amount <= address(this).balance) {
            payable(msg.sender).transfer(_amount);
        } else {
             revert("Contract does not have enough Ether to withdraw.");
        }
    }

    function withdrawAll() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawERC20(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner(), balance);
    }
}
