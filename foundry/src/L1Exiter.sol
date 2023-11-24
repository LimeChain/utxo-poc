// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IVerifier} from "./interfaces/IVerifier.sol";
import {IBlockhashOracle} from "./interfaces/IBlockhashOracle.sol";

import "openzeppelin/access/Ownable.sol";
import "openzeppelin/utils/cryptography/ECDSA.sol";
import "openzeppelin/utils/cryptography/MerkleProof.sol";
import "openzeppelin/token/ERC20/IERC20.sol";

struct Output {
    address token;
    uint256 value;
    bytes spender_signature;
}

contract L1Exiter is Ownable {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;
    using MerkleProof for bytes32[];


    IVerifier public verifier;
    IBlockhashOracle public blockhashOracle;
    uint256 public challengePeriod;

    bytes32 public utxoRoot;
    mapping(bytes32 => mapping(address => uint256)) public exitPeriodEnd;
    //owner to token to amount
    mapping(address => mapping(address => uint256)) public deposits;

    event ExitInitiated(bytes32 indexed messageHash);

    constructor (address _verifier, address _blockhashOracle, _challengePeriod) {
        require(_verifier != address(0)); 
        require(_blockhashOracle != address(0));
        verifier = IVerifier(verifier);
        blockhashOracle = IBlockhashOracle(blockhashOracle);
        challengePeriod = _challengePeriod;
    
    }

    //submits proof that 
    function submitProof(bytes calldata _proof, uint256 _blockNumber, bytes32 _utxoRoot) external {
        bytes32 fetchedBlockhash = blockhashOracle.getBlockhash(_blockNumber);
        require(fetchedBlockhash != bytes32(0), "block number not present in oracle");

        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = fetchedBlockhash;
        publicInputs[1] = utxoRoot;

        require(verifier.verify(_proof, publicInputs), "invalid proof");
    }

    //exit L2, starts challenge period
    function initiateExit(Output calldata _output) external {
        bytes32 messageHash = keccak256(abi.encodePacked(_output.token, _output.value));
        require(messageHash.recover(_output.signature) == msg.sender, "Not authorized spender for UTXO");
        exitPeriodEnd[messageHash][msg.sender] = block.timestamp + challengePeriod;
        emit ExitInitiated(messageHash);
    }

    function finalizeExit(bytes32 _messageHash) external {
        require(exitPeriodEnd[_messageHash][msg.sender] < block.timestamp, "challenge period not over");
        IERC20(output.token).safeTransfer(msg.sender, output.value);
    }


    //merkle proof that the current state of the UTXO graph on L2 is
    function exitInstant(Output calldata output, bytes32[] calldata merkleProof, bytes32 root) external {
        bytes32 outputLeafHash = keccak256(abi.encodePacked(output));
        require(merkleProof.verifyCalldata(root, outputLeafHash), "invalid merkle proof");

        IERC20(output.token).safeTransfer(msg.sender, output.value);
    }

    //NOTE: deposit functions are needed only to simulate sandbox Validium, in real cases the tokens are going to already be in circulation

    //ERC20 must be approved beforehand
    function deposit(address _token, uint _value) external {
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _value);
        deposits[msg.sender][_token] += _value;
    }

    fallback() external payable {
        deposits[msg.sender][address(0)] += msg.value; // we consider address zero as ETH deposit, everything else is ERC20 deposit
    } 


}