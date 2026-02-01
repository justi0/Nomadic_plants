// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StewardBadge.sol";

contract PlantRegistry is ERC721, ERC721Enumerable, Ownable {
    struct Plant {
        string species;
        string name;
        address currentSteward;
        uint256 lastProofTime;
        string latestPhotoIPFS;
        bool isMemorialized;
        address[] stewards;
    }

    mapping(uint256 => Plant) public plants;
    uint256 public nextPlantId = 1;
    StewardBadge public stewardBadge;

    event PlantRegistered(uint256 indexed plantId, address indexed steward);
    event StewardshipTransferred(
        uint256 indexed plantId,
        address indexed oldSteward,
        address indexed newSteward
    );
    event ProofSubmitted(uint256 indexed plantId, string ipfsHash);
    event PlantMemorialized(uint256 indexed plantId);

    constructor(
        address _stewardBadge
    ) ERC721("PlantSoul", "SOUL") Ownable(msg.sender) {
        stewardBadge = StewardBadge(_stewardBadge);
    }

    function registerPlant(
        string memory species,
        string memory name,
        string memory photoIPFS
    ) external {
        uint256 plantId = nextPlantId++;

        address[] memory initialStewards = new address[](1);
        initialStewards[0] = msg.sender;

        plants[plantId] = Plant({
            species: species,
            name: name,
            currentSteward: msg.sender,
            lastProofTime: block.timestamp,
            latestPhotoIPFS: photoIPFS,
            isMemorialized: false,
            stewards: initialStewards
        });

        _safeMint(msg.sender, plantId);
        emit PlantRegistered(plantId, msg.sender);
    }

    function photoProof(uint256 plantId, string memory photoIPFS) external {
        require(ownerOf(plantId) == msg.sender, "Not the current steward");
        require(!plants[plantId].isMemorialized, "Plant is memorialized");
        // Check 30 day window? The requirements say: "If no care is logged...".
        // User story: "As current owner, I can submit photo proof every 30 days"
        // Spec requirements: "Requires: block.timestamp - lastProofTime >= 30 days"
        require(
            block.timestamp - plants[plantId].lastProofTime >= 30 days,
            "Proof cooldown active"
        );

        plants[plantId].lastProofTime = block.timestamp;
        plants[plantId].latestPhotoIPFS = photoIPFS;

        emit ProofSubmitted(plantId, photoIPFS);
    }

    function transferStewardship(uint256 plantId, address newSteward) external {
        require(ownerOf(plantId) == msg.sender, "Not the current steward");
        require(newSteward != msg.sender, "New steward must be different");
        require(newSteward != address(0), "Invalid address");
        require(!plants[plantId].isMemorialized, "Plant is memorialized");

        // Use safeTransferFrom to handle the transfer logic
        // The side effects (badge minting, history update) are handled in _update
        safeTransferFrom(msg.sender, newSteward, plantId);
    }

    function memorializePlant(uint256 plantId) external {
        require(ownerOf(plantId) == msg.sender, "Not the current steward");
        plants[plantId].isMemorialized = true;
        emit PlantMemorialized(plantId);
    }

    // Override _update to handle side effects of transfer + Enumerable logic
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);

        // Logic for badges (skip if minting from=0 or burning to=0)
        // Note: _ownerOf(tokenId) returns 0 for minting because token doesn't exist yet,
        // OR returns previous owner. _update is called BEFORE state change in OZ v5?
        // OZ v5 `_update`: "Transfers `tokenId` from its current owner to `to`, or alternatively mints..."
        // Returns the previous owner.
        // So `address from = _ownerOf(tokenId)` is unreliable during mint?
        // Wait, `_update` implementation in OZ v5:
        // address from = _ownerOf(tokenId);
        // ... updates balances ...
        // ... updates ownership ...
        // So `from` is correct previous owner (0 if minting).

        if (from != address(0) && to != address(0)) {
            require(!plants[tokenId].isMemorialized, "Plant is memorialized");
            stewardBadge.mint(from);
            plants[tokenId].currentSteward = to;
            plants[tokenId].stewards.push(to);
            emit StewardshipTransferred(tokenId, from, to);
        }

        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // View Functions
    function getPlant(uint256 plantId) external view returns (Plant memory) {
        return plants[plantId];
    }

    function getCurrentSteward(
        uint256 plantId
    ) external view returns (address) {
        return ownerOf(plantId);
    }
}
