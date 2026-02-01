// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PlantRegistry.sol";
import "../src/StewardBadge.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy StewardBadge
        StewardBadge badge = new StewardBadge();
        console.log("StewardBadge deployed to:", address(badge));

        // 2. Deploy PlantRegistry
        PlantRegistry registry = new PlantRegistry(address(badge));
        console.log("PlantRegistry deployed to:", address(registry));

        // 3. Transfer ownership of Badge to Registry
        badge.transferOwnership(address(registry));
        console.log("StewardBadge ownership transferred to Registry");

        vm.stopBroadcast();
    }
}
