// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "aggregator/plonk_vk.sol";
import {DummyBlockhashOracle} from "../src/DummyBlockhashOracle.sol";
import {L1Exiter} from "../src/L1Exiter.sol";
import {Script, console2} from "forge-std/Script.sol";

contract Deploy is Script {
    L1Exiter wrapper;
    UltraVerifier verifier;
    DummyBlockhashOracle oracle;
    uint challengePeriod = 24 * 60 * 60; // 1 day in seconds

    function setUp() public {
        verifier = new UltraVerifier();
        oracle = new DummyBlockhashOracle();
        wrapper = new L1Exiter(address(oracle), address(verifier), challengePeriod);
    }

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        verifier = new UltraVerifier();
        oracle = new DummyBlockhashOracle();
        wrapper = new L1Exiter(address(oracle), address(verifier), challengePeriod);

        console.log("oracle", address(oracle));
        console.log("wrapper verifier", address(wrapper));
        console.log("generated verifier", address(verifier));

        vm.stopBroadcast();
    }
}
