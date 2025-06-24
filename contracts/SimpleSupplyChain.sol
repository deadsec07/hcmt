// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleSupplyChain is Ownable, ReentrancyGuard {
    event ProductRegistered(uint256 indexed productId, string name, address indexed owner);
    event ProductTransferred(uint256 indexed productId, address indexed from, address indexed to);
    event ProductVerified(uint256 indexed productId);
    event VerifierUpdated(address indexed verifier, bool status);

    uint256 public nextProductId;
    mapping(uint256 => Product) private products;
    mapping(address => bool) public authorizedVerifiers;

    struct Product {
        uint256 id;
        string name;
        address currentOwner;
        bool verified;
    }

    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender], "Not authorized verifier");
        _;
    }

    function _verifySignature(bytes32 hash, bytes memory sig) internal pure returns (address) {
        require(sig.length == 65, "Invalid signature length");
        bytes32 r; bytes32 s; uint8 v;
        assembly {
            r := mload(add(sig, 0x20))
            s := mload(add(sig, 0x40))
            v := byte(0, mload(add(sig, 0x60)))
        }
        if (v < 27) v += 27;
        bytes32 prefixed = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        return ecrecover(prefixed, v, r, s);
    }

    function registerProduct(string calldata name, bytes calldata signature) external onlyOwner {
        require(bytes(name).length > 0, "Name required");
        bytes32 hash = keccak256(abi.encodePacked(name, msg.sender));
        require(_verifySignature(hash, signature) == msg.sender, "Invalid signature");
        products[nextProductId] = Product(nextProductId, name, msg.sender, false);
        emit ProductRegistered(nextProductId, name, msg.sender);
        nextProductId++;
    }

    function transferProduct(uint256 id, address to, bytes calldata signature) external nonReentrant {
        Product storage p = products[id];
        require(p.currentOwner == msg.sender, "Not owner");
        bytes32 hash = keccak256(abi.encodePacked(id, to, p.currentOwner));
        require(_verifySignature(hash, signature) == p.currentOwner, "Invalid signature");
        p.currentOwner = to;
        emit ProductTransferred(id, msg.sender, to);
    }

    function updateVerifier(address verifier, bool status) external onlyOwner {
        require(verifier != address(0), "Invalid address");
        authorizedVerifiers[verifier] = status;
        emit VerifierUpdated(verifier, status);
    }

    function verifyProduct(uint256 id) external onlyVerifier {
        products[id].verified = true;
        emit ProductVerified(id);
    }

    // ======== NEW PUBLIC GETTERS ========

    function getMessageHash(string calldata name, address ownerAddr) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(name, ownerAddr));
    }

    function getTransferHash(uint256 id, address to, address from) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(id, to, from));
    }

    function getProduct(uint256 id) external view returns (string memory name, address currentOwner, bool verified) {
        Product memory p = products[id];
        return (p.name, p.currentOwner, p.verified);
    }
}
