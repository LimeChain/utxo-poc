// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {IVerifier} from "./interfaces/IVerifier.sol";
import {IBlockhashOracle} from "./interfaces/IBlockhashOracle.sol";

contract L1Exiter {
    IVerifier public verifier;
    IBlockhashOracle public blockhashOracle;

    constructor (address verifier, address blockhashOracle) {
        verifier = IVerifier(verifier);
        blockhashOracle = IBlockhashOracle(blockhashOracle);
    }

    function submitProof(bytes calldata proof) public {

    }

    function exit() public {
    }
}