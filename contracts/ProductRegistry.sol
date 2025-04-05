// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleSupplyChain is Ownable, ReentrancyGuard {
    event Debug(address recovered, bytes32 hash);
    mapping(address => bool) public authorizedVerifiers;
    
    struct Product {
        uint256 id;
        string name;
        address currentOwner;
        bool verified;
    }

    mapping(uint256 => Product) public products;
    uint256 public nextProductId;

    event ProductRegistered(uint256 productId, string name, address indexed owner);
    event ProductTransferred(uint256 productId, address indexed from, address indexed to);
    event ProductVerified(uint256 productId);
    event VerifierUpdated(address indexed verifier, bool status);

    constructor() Ownable() {}

    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender], "Not authorized");
        _;
    }

    function _verifySignature(bytes32 hash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        if (v < 27) v += 27;
        require(v == 27 || v == 28, "Invalid signature version");
        
        // Add EIP-191 prefix matching ethers.js signMessage
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        return ecrecover(prefixedHash, v, r, s);
    }

    function registerProduct(string memory name, bytes memory signature) public onlyOwner {
        require(bytes(name).length > 0, "Invalid product name");
        
        bytes32 messageHash = keccak256(abi.encodePacked(name, msg.sender));
        address signer = _verifySignature(messageHash, signature);
        require(signer == msg.sender, "Invalid signature");

        uint256 productId = nextProductId++;
        products[productId] = Product(productId, name, msg.sender, false);
        emit ProductRegistered(productId, name, msg.sender);
    }

    function transferProduct(uint256 productId, address to, bytes memory signature) public nonReentrant {
        require(to != address(0), "Invalid recipient");
        Product storage product = products[productId];
        require(product.currentOwner == msg.sender, "Not owner");

        // Match client-side: ethers.utils.solidityKeccak256(["uint256", "address", "address"], [id, to, owner])
        bytes32 messageHash = keccak256(abi.encodePacked(productId, to, product.currentOwner));
        address signer = _verifySignature(messageHash, signature);
        require(signer == product.currentOwner, "Invalid signature");

        product.currentOwner = to;
        emit ProductTransferred(productId, msg.sender, to);
    }

    function updateVerifier(address verifier, bool status) public onlyOwner {
        require(verifier != address(0), "Invalid address");
        authorizedVerifiers[verifier] = status;
        emit VerifierUpdated(verifier, status);
    }

    function verifyProduct(uint256 productId) public onlyVerifier {
        require(products[productId].currentOwner != address(0), "Product not exist");
        products[productId].verified = true;
        emit ProductVerified(productId);
    }
    
    function getMessageHash(string memory name, address ownerAddress) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(name, ownerAddress));
    }
}