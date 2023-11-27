// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "aggregator/plonk_vk.sol";
import {L1Exiter} from "../src/L1Exiter.sol";
import {Script, console} from "forge-std/Script.sol";

contract Deploy is Script {
    L1Exiter wrapper;
    UltraVerifier verifier;
    uint256 challengePeriod = 24 * 60 * 60; // 1 day in seconds

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        verifier = new UltraVerifier();
        wrapper = new L1Exiter(address(verifier), challengePeriod);

        console.log("generated verifier", address(verifier));
        console.log("wrapper verifier", address(wrapper));

        vm.stopBroadcast();
    }
}
