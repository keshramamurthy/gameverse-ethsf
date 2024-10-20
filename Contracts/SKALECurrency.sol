// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameVerse is ERC20, ERC20Burnable, Ownable {
    mapping(address => bool) private addedUsers;
    constructor(address initialOwner)
        ERC20("GameVerse", "GMV")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

        // Owner-only function to update a single user's balance, adds new user if not already added
    function updateBalance(address user, uint256 newBalance) public onlyOwner {
        if (!addedUsers[user]) {
            addedUsers[user] = true;
        }

        uint256 currentBalance = balanceOf(user);
        if (newBalance > currentBalance) {
            _mint(user, newBalance - currentBalance);
        } else if (newBalance < currentBalance) {
            _burn(user, currentBalance - newBalance);
        }
    }

    // Batch update balances for multiple users, adding new users if necessary
    function batchUpdateBalances(address[] memory users, uint256[] memory balances) public onlyOwner {
        require(users.length == balances.length, "Mismatched input lengths");

        for (uint256 i = 0; i < users.length; i++) {
            updateBalance(users[i], balances[i]);
        }
    }
}