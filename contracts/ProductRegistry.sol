// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleSupplyChain is Ownable, ReentrancyGuard {
    
    // Define a Product struct
    struct Product {
        uint256 id;
        string name;
        address currentOwner;
        uint256 price;
        bool verified;
    }

    // Store products
    mapping(uint256 => Product) public products;
    uint256 public nextProductId;

    event ProductRegistered(uint256 productId, string name, address indexed owner, uint256 price);
    event ProductTransferred(uint256 productId, address indexed from, address indexed to);

    // Constructor to initialize Ownable and ReentrancyGuard
    constructor() Ownable(msg.sender) ReentrancyGuard() {}

    // Register a new product (only owner can do this)
    function registerProduct(string memory name, uint256 price) public onlyOwner {
        uint256 productId = nextProductId;
        products[productId] = Product({
            id: productId,
            name: name,
            currentOwner: msg.sender,
            price: price,
            verified: false
        });
        nextProductId++;
        
        emit ProductRegistered(productId, name, msg.sender, price);
    }

    // Transfer ownership of a product (only the current owner can transfer)
    function transferProduct(uint256 productId, address to) public nonReentrant {
        require(products[productId].currentOwner == msg.sender, "You are not the owner of this product");
        require(to != address(0), "Invalid address");

        address previousOwner = products[productId].currentOwner;
        products[productId].currentOwner = to;

        emit ProductTransferred(productId, previousOwner, to);
    }

    // Verify the product (owner can verify)
    function verifyProduct(uint256 productId) public {
        require(products[productId].currentOwner == msg.sender, "You must be the owner to verify the product");
        products[productId].verified = true;
    }

    // Get product details
    function getProduct(uint256 productId) public view returns (Product memory) {
        return products[productId];
    }
}
