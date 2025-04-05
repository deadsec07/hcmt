// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleSupplyChain is Ownable, ReentrancyGuard {

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
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    constructor() Ownable() {}  // ✅ Fixed Ownable constructor

    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender], "Not authorized to verify products");
        _;
    }

    function _verifySignature(bytes32 hash, bytes memory signature) internal pure returns (address) {
    require(signature.length == 65, "Invalid signature length."); // ✅ Signature must be 65 bytes

    bytes32 r;
    bytes32 s;
    uint8 v;

    // ✅ Extract `r`, `s`, `v` from the signature
    assembly {
        r := mload(add(signature, 32))
        s := mload(add(signature, 64))
        v := byte(0, mload(add(signature, 96)))
    }

    // ✅ Fix `v` value (Ethereum standard requires v = 27 or 28)
    if (v < 27) {
        v += 27;
    }

    // ✅ Format the message hash correctly
    bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));

    // ✅ Recover and return the signer address
    return ecrecover(ethSignedMessageHash, v, r, s);
}


    function registerProduct(string memory name, bytes memory signature) public onlyOwner {
        bytes32 messageHash = keccak256(abi.encodePacked(name, msg.sender));
        address signer = _verifySignature(messageHash, signature);
        require(signer == msg.sender, "Invalid signature");

        uint256 productId = nextProductId;
        products[productId] = Product(productId, name, msg.sender, false);
        nextProductId++;

        emit ProductRegistered(productId, name, msg.sender);
    }

    function transferProduct(uint256 productId, address to, bytes memory signature) public nonReentrant {
        Product storage product = products[productId];
        require(product.currentOwner == msg.sender, "You are not the owner");

        bytes32 messageHash = keccak256(abi.encodePacked(productId, to, product.currentOwner));
        address signer = _verifySignature(messageHash, signature);
        require(signer == product.currentOwner, "Invalid signature");

        product.currentOwner = to;
        emit ProductTransferred(productId, msg.sender, to);
    }

    function verifyProduct(uint256 productId) public onlyVerifier {
        Product storage product = products[productId];
        require(product.currentOwner != address(0), "Product does not exist");
        product.verified = true;
        emit ProductVerified(productId);
    }

    function addVerifier(address verifier) public onlyOwner {
        require(verifier != address(0), "Invalid address");
        require(!authorizedVerifiers[verifier], "Already a verifier");
        authorizedVerifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) public onlyOwner {
        require(authorizedVerifiers[verifier], "Verifier not found");
        authorizedVerifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }
}
