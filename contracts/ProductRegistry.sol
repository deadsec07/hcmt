// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ProductRegistry is ReentrancyGuard {
    
    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address owner;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    // Event to emit product registration
    event ProductRegistered(uint256 id, string name, uint256 price, address owner);
    
    // Constructor to initialize the contract
    constructor() {
        productCount = 0;
    }

    // Function to register a new product
    function registerProduct(string memory _name, uint256 _price) public nonReentrant {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(_price > 0, "Product price must be greater than zero");

        // Increment the productCount and create a new product
        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender);

        // Emit an event to log the product registration
        emit ProductRegistered(productCount, _name, _price, msg.sender);
    }

    // Function to update the product's price
    function updatePrice(uint256 _productId, uint256 _newPrice) public nonReentrant {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        require(products[_productId].owner == msg.sender, "Only the owner can update the price");
        require(_newPrice > 0, "Price must be greater than zero");

        // Update the product price
        products[_productId].price = _newPrice;
    }

    // Function to transfer ownership of a product
    function transferOwnership(uint256 _productId, address _newOwner) public nonReentrant {
        require(_productId > 0 && _productId <= productCount, "Product does not exist");
        require(products[_productId].owner == msg.sender, "Only the owner can transfer ownership");

        // Transfer the ownership
        products[_productId].owner = _newOwner;
    }
}
