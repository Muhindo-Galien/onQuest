// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Airdrop is Ownable {
    uint256 public constant CLAIM_AMOUNT = 10 ether;
    mapping(address => bool) public eligibleAddresses;
    mapping(address => bool) public hasClaimed;

    event AddressAdded(address indexed user);
    event AirdropClaimed(address indexed user, uint256 amount);

    constructor() payable {
        require(msg.value >= 100 ether, "Contract must be funded with ETH");
    }

    // Admin adds eligible addresses
    function addEligibleAddress(address user) external onlyOwner {
        require(user != address(0), "Invalid address");
        require(!eligibleAddresses[user], "Address already eligible");
        eligibleAddresses[user] = true;
        emit AddressAdded(user);
    }

    // Users claim their airdrop
    function claim() external {
        require(eligibleAddresses[msg.sender], "Not eligible for airdrop");
        require(!hasClaimed[msg.sender], "Airdrop already claimed");
        require(address(this).balance >= CLAIM_AMOUNT, "Insufficient contract balance");

        hasClaimed[msg.sender] = true;
        payable(msg.sender).transfer(CLAIM_AMOUNT);

        emit AirdropClaimed(msg.sender, CLAIM_AMOUNT);
    }

    // Allow owner to withdraw any remaining ETH
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        payable(owner()).transfer(amount);
    }

    // Receive function to allow ETH deposits
    receive() external payable {}
}
