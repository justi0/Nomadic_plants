// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PlantRegistry.sol";
import "../src/StewardBadge.sol";

contract PlantRegistryTest is Test {
    PlantRegistry public registry;
    StewardBadge public badge;

    address public alice = address(0x1);
    address public bob = address(0x2);
    address public carol = address(0x3);

    function setUp() public {
        badge = new StewardBadge();
        registry = new PlantRegistry(address(badge));
        badge.transferOwnership(address(registry));

        vm.label(alice, "Alice");
        vm.label(bob, "Bob");
        vm.label(carol, "Carol");
    }

    function testRegisterPlant() public {
        vm.startPrank(alice);
        registry.registerPlant("Monstera", "Alice's Plant", "QmHash1");

        assertEq(registry.ownerOf(1), alice);
        (
            string memory species,
            string memory name,
            address currentSteward,
            ,
            ,

        ) = registry.plants(1);
        assertEq(species, "Monstera");
        assertEq(name, "Alice's Plant");
        assertEq(currentSteward, alice);
        vm.stopPrank();
    }

    function testTransferStewardshipMintsBadge() public {
        vm.startPrank(alice);
        registry.registerPlant("Monstera", "Alice's Plant", "QmHash1");

        // Alice transfers to Bob
        registry.transferStewardship(1, bob);
        vm.stopPrank();

        // Check ownership
        assertEq(registry.ownerOf(1), bob);

        // Check badge minted to Alice
        assertEq(badge.balanceOf(alice), 1);
        assertEq(badge.ownerOf(0), alice); // First badge ID is 0

        // Check Plant record updated
        PlantRegistry.Plant memory p = registry.getPlant(1);
        assertEq(p.currentSteward, bob);
        assertEq(p.stewards.length, 2);
        assertEq(p.stewards[0], alice);
        assertEq(p.stewards[1], bob);
    }

    function testPhotoProofCooldown() public {
        vm.startPrank(alice);
        registry.registerPlant("Monstera", "Alice's Plant", "QmHash1");

        // Try to proof immediately
        vm.expectRevert("Proof cooldown active");
        registry.photoProof(1, "QmHash2");

        // Warp 30 days
        vm.warp(block.timestamp + 30 days);

        registry.photoProof(1, "QmHash2");
        (, , , uint256 lastProofTime, string memory latestPhoto, ) = registry
            .plants(1);
        assertEq(latestPhoto, "QmHash2");
        assertEq(lastProofTime, block.timestamp);
        vm.stopPrank();
    }

    function testMemorializeLocksActions() public {
        vm.startPrank(alice);
        registry.registerPlant("Monstera", "Alice's Plant", "QmHash1");

        registry.memorializePlant(1);
        (, , , , , bool isMemorialized) = registry.plants(1);
        assertTrue(isMemorialized);

        // Try transfer
        vm.expectRevert("Plant is memorialized");
        registry.transferStewardship(1, bob);

        // Try proof
        vm.expectRevert("Plant is memorialized");
        registry.photoProof(1, "QmHashNew");
        vm.stopPrank();
    }
}
