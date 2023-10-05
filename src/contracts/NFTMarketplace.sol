// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC1155 {
     // for Nft Tokens
    uint256 public nextTokenId = 0;
     // counter for generating unique market IDs
    uint256 public nextMarketId = 0;

    //struct to represent a market item
    struct MarketItem {
        uint256 tokenId;
        uint256 quantity;
        uint256 price;
        address creator;
        address seller;
    }

    struct NFT {
        string image;
        string name;
        string description;
        uint256 totalSupply;
        uint256 tokenId;
        address creatorAddress;
    }

    // mapping to store market items by market ID
    mapping(uint256 => MarketItem) public marketItems;

    // mapping to store market items by listed by user
    mapping(address =>uint256[]) public userToMarketId;

    // mapping to store Nft details
    mapping(uint256 => NFT) public nftInfo;

    // Create a mapping to track the owner of each NFT tokenId
    // mapping(uint256 => address[]) public nftOwners;

    // Creator of NFT
    mapping(uint256 => address) public nftCreator;

    // Enum to represent transaction types
    enum TransactionType { Mint, Buy, Sell }

    // Define a struct to represent a transaction
    struct Transaction {
        TransactionType transactionType;
        uint256 tokenId;
        uint256 quantity;
        uint256 price;
        address creator;
        address seller;
        uint256 timestamp;
    }

    // Define a struct to represent the details of an NFT listing
    struct NFTListing {
        uint256 tokenId;
        string name;
        string image;
        string description;
        uint256 quantity;
        uint256 price;
        address creator;
        address seller;
        uint256 marketId;
    }

    struct OwnedNft {
        NFT allNfts;
        Transaction transactions;
    }

    // Create a mapping to track user transactions
    mapping(address => Transaction[]) public userTransactions;

    mapping(address => mapping(uint256=>uint256)) public userTokenBalance;

    // Event for when a new NFT is created
    event NFTCreated(uint256 indexed tokenId, address indexed creator, uint256 quantity, uint256 price);


    // Event for when an NFT is sold
    event NFTSold(uint256 marketId, uint256 indexed tokenId, address indexed buyer, uint256 quantity, uint256 price);


    // Event for when an NFT is listed for sale
    event NFTListed(uint256 marketId, uint256 indexed tokenId, uint256 price, uint256 quantity);


    constructor() ERC1155("https://example.com/api/token/{id}.json") {}


    // Create a new NFT and mint it to the creator
    function mintNFT(uint256 totalSupply, string memory image, string memory name, string memory description) external {
        uint256 tokenId = nextTokenId;
        uint256 price = 0;
        userTokenBalance[msg.sender][tokenId]= totalSupply;
       


        _mint(msg.sender, tokenId, totalSupply, "");
       
        nftCreator[tokenId] = msg.sender;
        // nftOwners[tokenId].push(msg.sender);


        nftInfo[tokenId] = NFT({
            image: image,
            name: name,
            description: description,
            totalSupply: totalSupply,
            tokenId: tokenId,
            creatorAddress: msg.sender
        });


        // Record the mint transaction
        userTransactions[msg.sender].push(Transaction({
            transactionType: TransactionType.Mint,
            tokenId: tokenId,
            quantity: totalSupply,
            price: price,
            creator: msg.sender,
            seller: address(0), // No seller when minting
            timestamp: block.timestamp
        }));
        nextTokenId++;
        emit NFTCreated(tokenId, msg.sender, totalSupply, price);
    }


    function createMarketItem(uint256 _tokenId,uint256 _totalSupply,uint256 _price,address _seller) public 
    {
        userToMarketId[msg.sender].push(nextMarketId);

        marketItems[nextMarketId] = MarketItem({
            tokenId: _tokenId,
            quantity: _totalSupply,
            price: _price,
            creator: nftCreator[_tokenId],
            seller: _seller
        });
        nextMarketId++;   
    }


   function getMintedNFTsByUser(address user) external view returns (NFT[] memory) {
        NFT[] memory mintedNFTs = new NFT[](nextTokenId);
        uint256 mintedNFTCount = 0;

        for (uint256 tokenId = 0; tokenId < nextTokenId; tokenId++) {
            if (nftInfo[tokenId].creatorAddress == user) {
                mintedNFTs[mintedNFTCount] = NFT({
                    image: nftInfo[tokenId].image,
                    name: nftInfo[tokenId].name,
                    description: nftInfo[tokenId].description,
                    totalSupply: nftInfo[tokenId].totalSupply,
                    tokenId: tokenId,
                    creatorAddress: nftInfo[tokenId].creatorAddress
                });
                mintedNFTCount++;
            }
        }

        // Resize the array to the actual number of minted NFTs
        assembly {
            mstore(mintedNFTs, mintedNFTCount)
        }

        return mintedNFTs;
    }

    // Buy NFTs
    function buyNFT(uint256 marketId, uint256 quantity) external payable {
        require(marketItems[marketId].price > 0, "NFT is not for sale");
        require(quantity <= marketItems[marketId].quantity, "Quantity exceeds what's listed for sale");
        require(msg.value >= marketItems[marketId].price * quantity, "Insufficient funds");
        userTokenBalance[msg.sender][marketItems[marketId].tokenId] += quantity;
        
        MarketItem storage item = marketItems[marketId];
        address seller = item.seller;
        uint256 price = item.price * quantity;

        // Transfer the payment to the seller
        payable(seller).transfer(price);

        // Transfer the NFTs to the buyer
        _safeTransferFrom(seller, msg.sender, item.tokenId, quantity, "");

        // Record the buy transaction
        userTransactions[msg.sender].push(Transaction({
            transactionType: TransactionType.Buy,
            tokenId: item.tokenId,
            quantity: quantity,
            price: price,
            creator: item.creator,
            seller: seller,
            timestamp: block.timestamp
        }));


        // Update the market item
        item.quantity -= quantity;
        nftInfo[marketItems[marketId].tokenId].totalSupply -=  quantity;
        emit NFTSold(marketId, item.tokenId, msg.sender, quantity, price);
    }

    // List an NFT for sale with a specified quantity and price
    function listNFTForSale(uint256 tokenId, uint256 quantity, uint256 price) external {
    //    require((nftOwners[tokenId].length > 0 && isOwnerOf(tokenId, msg.sender)) || (marketItems[tokenId].creator == msg.sender), "Only the owner or creator can list");
        require(userTokenBalance[msg.sender][tokenId]>=quantity,"Sorry you don't have enough NFT's to list for sell");
       
        require(quantity > 0, "Quantity must be greater than zero");

        userTokenBalance[msg.sender][tokenId] -= quantity;
        // Generate a unique market ID
        uint256 marketId = nextMarketId++;

        // Create a new market item
        createMarketItem(tokenId,quantity,price,msg.sender);
        
        // Record the listing transaction
        userTransactions[msg.sender].push(Transaction({
            transactionType: TransactionType.Sell,
            tokenId: tokenId,
            quantity: quantity,
            price: price,
            creator: marketItems[tokenId].creator,
            seller: address(0), // No seller when listing
            timestamp: block.timestamp
        }));

        emit NFTListed(marketId, tokenId, price, quantity);
    }

    // Get details of a specific market item by its market ID
    function getMarketItem(uint256 marketId) external view returns (uint256 tokenId, uint256 quantity, uint256 price, address creator, address seller) {
        require(marketId <= nextMarketId, "Invalid market ID");
        MarketItem storage item = marketItems[marketId];
        return (item.tokenId, item.quantity, item.price, item.creator, item.seller);
    }

    // Get the NFTs owned by a user with quantities
    // Get the NFTs owned by a user with quantities and details
    function getOwnedNFTs(address user) external view returns (OwnedNft[] memory) {
        
        OwnedNft[] memory allOwnedNft = new OwnedNft[](userTransactions[user].length);
        uint256 counter=0;

        for(uint256 i=0;i<userTransactions[user].length;i++)
        {
            if(userTransactions[user][i].transactionType == TransactionType.Buy )
            {
                allOwnedNft[counter]=OwnedNft(nftInfo[userTransactions[user][i].tokenId],userTransactions[user][i]);
                counter++;
            }
        }

        assembly {
            mstore(allOwnedNft, counter)
        }
        return allOwnedNft;
        
    }

    // Get all transactions for a user
    function getUserTransactions(address user) external view returns (Transaction[] memory) {
            return userTransactions[user];  
    }

    // Create a function to get all NFTs listed for sale with creator information
    function getAllNFTsForSale() external view returns (NFTListing[] memory) {
        NFTListing[] memory listedItems = new NFTListing[](nextMarketId);
        uint256 itemCount = 0;

        for (uint256 marketId = 0; marketId <= nextMarketId; marketId++) {
            MarketItem storage item = marketItems[marketId];
            if (item.price > 0 && item.quantity > 0) {
                listedItems[itemCount] = NFTListing({
                    tokenId: item.tokenId,
                    name: nftInfo[item.tokenId].name,
                    image: nftInfo[item.tokenId].image,
                    description: nftInfo[item.tokenId].description,
                    quantity: item.quantity,
                    price: item.price,
                    creator: item.creator,
                    seller: item.seller,
                    marketId: marketId
                });
                itemCount++;
            }
        }

        // Resize the array to the actual number of listed items
        assembly {
            mstore(listedItems, itemCount)
        }
        return listedItems;
    }
}