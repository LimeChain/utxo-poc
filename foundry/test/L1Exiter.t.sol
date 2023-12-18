// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "utxo-signature/plonk_vk.sol";
import {L1Exiter} from "../src/L1Exiter.sol";

import "forge-std/Test.sol";
import {console} from "forge-std/Script.sol";

contract Deploy is Test {
    L1Exiter exiter;
    UltraVerifier verifier;
    uint256 challengePeriod = 24 * 60 * 60; // 1 day in seconds

    function setUp() public {
        verifier = new UltraVerifier();
        exiter = new L1Exiter(address(verifier), challengePeriod);

    }

    function test_submitProof() public {
        console.log("generated verifier", address(verifier));
        console.log("exiter verifier", address(exiter));
        string memory proof = vm.readLine("circuits/proofs/utxo_signature.proof");
        bytes memory proofBytes = vm.parseBytes(proof);
        console.log(proofBytes.length);
        bytes32[] memory publicInputs = new bytes32[](0);
        exiter.submitProof(proofBytes, bytes32(0), bytes32(0), publicInputs);
    }
}
