// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the existing NFTMarketplace contract
import "./NFTMarketplace.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SubscriptionContract is Ownable {
    // Declare a variable to store the NFTMarketplace contract instance
    NFTMarketplace public nftMarketplaceInstance;

    // Mapping to track user stakes and subscription expiry
    mapping(address => uint256) public userStakes;
    mapping(address => uint256) public userSubscriptionExpiry;

    // Mapping to track user default NFT selections
    mapping(address => uint256) public userDefaultNFT;

    // Mapping to track user daily request usage
    mapping(address => bool) public userHasAccessedDailyLimit;

    // Mapping to store credits for NFT creators
    mapping(address => uint256) public nftCreatorCredits;

    // Event for when a user sets their default NFT
    event DefaultNFTSet(address indexed user, uint256 nftId);

    // Event for when a user stakes and gets a subscription
    event StakedForSubscription(address indexed user, uint256 amount, uint256 subscriptionExpiry);

    // Event for when a user upgrades their daily request limit
    event RequestLimitUpgraded(address indexed user, bool hasAccess);

    // Event for when the owner rewards an NFT creator with credits
    event NFTCreatorRewarded(address indexed creator, uint256 nftId, uint256 credits);

    constructor(address _nftMarketplaceAddress) {
        // Create an instance of the NFTMarketplace contract
        nftMarketplaceInstance = NFTMarketplace(_nftMarketplaceAddress);
    }

    // Function to set the default NFT for a user
    function setDefaultNFT(uint256 nftId) external {
        // Check if the user holds the specified NFT
        require(nftMarketplaceInstance.balanceOf(msg.sender, nftId) > 0, "You do not own this NFT");

        userDefaultNFT[msg.sender] = nftId;
        emit DefaultNFTSet(msg.sender, nftId);
    }

    // Function to stake ETH and get a subscription
    function stakeForSubscription() external payable {
        require(msg.value >= 90 ether, "You need to stake at least 90 BTTC");
        require(userSubscriptionExpiry[msg.sender]<= block.timestamp,"You already have subscription !");
        uint256 subscriptionDuration = 30 days;

        // Increase the user's stake
        userStakes[msg.sender] += msg.value;

        // Set the subscription expiry timestamp
        userSubscriptionExpiry[msg.sender] = block.timestamp + subscriptionDuration;

        emit StakedForSubscription(msg.sender, msg.value, userSubscriptionExpiry[msg.sender]);
    }

    // Function to upgrade the daily request limit and change state (onlyOwner)
    function upgradeRequestLimit(address user) external onlyOwner {
        require(userStakes[user] >= 3 ether, "User needs to stake at least 3 ETH to upgrade");
        
        // Reduce the user's stake
        userStakes[user] -= 3 ether;

        // Change the user's daily request access state
        userHasAccessedDailyLimit[user] = true;

        emit RequestLimitUpgraded(user, userHasAccessedDailyLimit[user]);
    }

    // Function to update the daily request access for a user (onlyOwner)
    function updateRequest(address user, bool hasAccess) external onlyOwner {
        userHasAccessedDailyLimit[user] = hasAccess;
        emit RequestLimitUpgraded(user, hasAccess);
    }

    // Function to reward an NFT creator with credits (onlyOwner)
    function rewardNFTCreator(address creator, uint256 nftId, uint256 credits) external onlyOwner {
        nftCreatorCredits[creator] += credits;
        emit NFTCreatorRewarded(creator, nftId, credits);
    }
    // Function to withdraw funds from the contract (onlyOwner)
    function withdraw() external onlyOwner {
        // Check if the staked balance is more than 100 ETH
        require(address(this).balance > 100 ether, "Staked balance is not more than 100 BTTC");

        // Transfer the balance to the owner
        payable(owner()).transfer(address(this).balance);
    }
}