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
        bool isUpForAdoption;
        string location;
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
    event PlantListedForAdoption(uint256 indexed plantId, string location);
    event AdoptionCancelled(uint256 indexed plantId);
    event PlantAdopted(uint256 indexed plantId, address indexed newSteward);

    constructor(
        address _stewardBadge
    ) ERC721("PlantSoul", "SOUL") Ownable(msg.sender) {
        stewardBadge = StewardBadge(_stewardBadge);
    }

    function registerPlant(
        string memory species,
        string memory name,
        string memory photoIPFS,
        string memory location
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
            stewards: initialStewards,
            isUpForAdoption: false,
            location: location
        });

        _safeMint(msg.sender, plantId);
        emit PlantRegistered(plantId, msg.sender);
    }

    function photoProof(uint256 plantId, string memory photoIPFS) external {
        require(ownerOf(plantId) == msg.sender, "Not the current steward");
        require(!plants[plantId].isMemorialized, "Plant is memorialized");

        plants[plantId].lastProofTime = block.timestamp;
        plants[plantId].latestPhotoIPFS = photoIPFS;

        emit ProofSubmitted(plantId, photoIPFS);
    }

    function transferStewardship(uint256 plantId, address newSteward) external {
        require(ownerOf(plantId) == msg.sender, "Not the current steward");
        require(newSteward != msg.sender, "New steward must be different");
        require(newSteward != address(0), "Invalid address");
        require(!plants[plantId].isMemorialized, "Plant is memorialized");

        // Cancel adoption if it was listed
        if (plants[plantId].isUpForAdoption) {
            plants[plantId].isUpForAdoption = false;
        }

        safeTransferFrom(msg.sender, newSteward, plantId);
    }

    function memorializePlant(uint256 plantId) external {
        require(ownerOf(plantId) == msg.sender, "Not the current steward");
        plants[plantId].isMemorialized = true;
        plants[plantId].isUpForAdoption = false;
        emit PlantMemorialized(plantId);
    }

    // --- Adoption Marketplace Logic ---

    function listForAdoption(uint256 plantId, string memory location) external {
        require(ownerOf(plantId) == msg.sender, "Not the current steward");
        require(!plants[plantId].isMemorialized, "Plant is memorialized");

        plants[plantId].isUpForAdoption = true;
        plants[plantId].location = location;

        emit PlantListedForAdoption(plantId, location);
    }

    function cancelAdoption(uint256 plantId) external {
        require(ownerOf(plantId) == msg.sender, "Not the current steward");

        plants[plantId].isUpForAdoption = false;

        emit AdoptionCancelled(plantId);
    }

    function adoptPlant(uint256 plantId) external {
        require(plants[plantId].isUpForAdoption, "Plant not up for adoption");
        require(msg.sender != ownerOf(plantId), "Already the steward");
        require(!plants[plantId].isMemorialized, "Plant is memorialized");

        address oldSteward = ownerOf(plantId);

        // Reset adoption flag
        plants[plantId].isUpForAdoption = false;

        // Transfer ownership (approved or not? Since we are modifying the contract,
        // we can use internal _transfer or act as operator if we implement it that way.
        // But `safeTransferFrom` checks approval.
        // HACK: To allow adoption without explicit approval for EVERY user,
        // the contract itself doesn't hold the token, the user does.
        // So `msg.sender` (adopter) is calling `transferFrom` on behalf of `oldSteward`? No, that requires approval.
        //
        // SOLUTION: We need `_transfer` (OpenZeppelin v5 exposes `_update`).
        // Since this contract IS the ERC721 token, we can call internal transfer methods.
        // `_update(to, tokenId, auth)` where auth is 0?
        // Let's use `_transfer(from, to, tokenId)`.

        _transfer(oldSteward, msg.sender, plantId);

        emit PlantAdopted(plantId, msg.sender);
    }

    // Override _update to handle side effects of transfer + Enumerable logic
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = _ownerOf(tokenId);

        if (from != address(0) && to != address(0)) {
            require(!plants[tokenId].isMemorialized, "Plant is memorialized");
            stewardBadge.mint(from);
            plants[tokenId].currentSteward = to;
            plants[tokenId].stewards.push(to);

            // Also ensure adoption flag is cleared on ANY transfer
            plants[tokenId].isUpForAdoption = false;

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
