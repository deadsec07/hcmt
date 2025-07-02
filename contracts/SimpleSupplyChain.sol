// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleSupplyChain is AccessControl, ReentrancyGuard {
    bytes32 public constant CLIENT_ROLE    = keccak256("CLIENT_ROLE");
    bytes32 public constant TRANSFER_ROLE  = keccak256("TRANSFER_ROLE");
    bytes32 public constant VERIFIER_ROLE  = keccak256("VERIFIER_ROLE");
    bytes32 public constant FREEZER_ROLE   = keccak256("FREEZER_ROLE");

    uint256 public nextProductId;

    struct Product {
        uint256 id;
        string name;
        address currentOwner;
        bool verified;
        bool frozen;
        uint256 registeredAt;
    }

    mapping(uint256 => Product) private products;
    mapping(uint256 => address[]) private history;

    event ProductRegistered(uint256 indexed id, string name, address indexed owner);
    event ProductTransferred(uint256 indexed id, address indexed from, address indexed to);
    event ProductVerified(uint256 indexed id);
    event ProductFrozen(uint256 indexed id);
    event ProductUnfrozen(uint256 indexed id);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier onlyNotFrozen(uint256 id) {
        require(!products[id].frozen, "Product is frozen");
        _;
    }

    // —— Registration (single + batch) ——
    function registerProduct(string calldata name, bytes calldata signature)
        external onlyRole(CLIENT_ROLE)
    {
        _registerSingle(name, signature);
    }

    function registerBatch(string[] calldata names, bytes[] calldata sigs)
        external onlyRole(CLIENT_ROLE)
    {
        require(names.length == sigs.length, "Mismatched arrays");
        for (uint i = 0; i < names.length; i++) {
            _registerSingle(names[i], sigs[i]);
        }
    }

    function _registerSingle(string calldata name, bytes calldata signature) internal {
        require(bytes(name).length > 0, "Name required");
        bytes32 hash = getMessageHash(name, msg.sender);
        require(_verifySignature(hash, signature) == msg.sender, "Invalid signature");

        products[nextProductId] = Product({
            id: nextProductId,
            name: name,
            currentOwner: msg.sender,
            verified: false,
            frozen: false,
            registeredAt: block.timestamp
        });
        history[nextProductId].push(msg.sender);

        emit ProductRegistered(nextProductId, name, msg.sender);
        nextProductId++;
    }

    // —— Transfers ——
    function transferProduct(uint256 id, address to, bytes calldata signature)
        external nonReentrant onlyRole(TRANSFER_ROLE) onlyNotFrozen(id) {
        Product storage p = products[id];

        // Owner’s signed consent lets a TRANSFER_ROLE caller effect the hand‐off:
        bytes32 hash = getTransferHash(id, to, p.currentOwner);
        require(_verifySignature(hash, signature) == p.currentOwner, "Invalid signature");

        address from = p.currentOwner;
        p.currentOwner = to;
        history[id].push(to);

        emit ProductTransferred(id, from, to);
    }

    // —— Verification ——
    function verifyProduct(uint256 id)
        external onlyRole(VERIFIER_ROLE) onlyNotFrozen(id)
    {
        products[id].verified = true;
        emit ProductVerified(id);
    }

    // —— Freeze / Unfreeze ——
    function freezeProduct(uint256 id) external onlyRole(FREEZER_ROLE) {
        products[id].frozen = true;
        emit ProductFrozen(id);
    }
    function unfreezeProduct(uint256 id) external onlyRole(FREEZER_ROLE) {
        products[id].frozen = false;
        emit ProductUnfrozen(id);
    }

    // —— Public Getters ——
    function getProduct(uint256 id) external view returns (
        uint256, string memory, address, bool, bool, uint256
    ) {
        Product memory p = products[id];
        return (
            p.id, p.name, p.currentOwner,
            p.verified, p.frozen, p.registeredAt
        );
    }

    function getHistory(uint256 id) external view returns (address[] memory) {
        return history[id];
    }

    function getMessageHash(string calldata name, address ownerAddr)
        public pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(name, ownerAddr));
    }

    function getTransferHash(uint256 id, address to, address from)
        public pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(id, to, from));
    }

    // —— Internal Sig Verifier ——
    function _verifySignature(bytes32 hash, bytes memory sig)
        internal pure returns (address)
    {
        require(sig.length == 65, "Invalid signature length");
        bytes32 r; bytes32 s; uint8 v;
        assembly {
            r := mload(add(sig,32))
            s := mload(add(sig,64))
            v := byte(0, mload(add(sig,96)))
        }
        if (v < 27) v += 27;
        bytes32 prefixed = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ecrecover(prefixed, v, r, s);
    }
}
