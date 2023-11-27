// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IVerifier} from "./interfaces/IVerifier.sol";

import "openzeppelin/access/Ownable.sol";
import "openzeppelin/token/ERC20/IERC20.sol";
import "openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin/utils/ReentrancyGuard.sol";
import "openzeppelin/utils/cryptography/MerkleProof.sol";

struct UTXO {
    uint256 value;
    bytes32 spender_pub_key_x;
    bytes32 spender_pub_key_y;
    address token;
}

struct LowNullifierLeaf {
    UTXO value;
    UTXO next_value;
    uint32 next_index;
}

contract L1Exiter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using MerkleProof for bytes32[];

    IVerifier public verifier;
    uint256 public challengePeriod;

    bytes32 public nullifierRoot;
    bytes32 public utxoRoot;

    struct Balance {
        uint256 amount;
        address token;
        uint256 challengePeriodEnd;
    }

    // message hash to user address to (ammount, challengePeriodEnd)
    mapping(bytes32 => mapping(address => Balance)) public exits;

    event ExitInitiated(address spender, bytes32 indexed messageHash);

    constructor(address _verifier, uint256 _challengePeriod) Ownable(msg.sender) {
        require(_verifier != address(0));
        verifier = IVerifier(verifier);
        challengePeriod = _challengePeriod;
    }

    //NOTE: we optimistically trust that the account-based model state roots are correct.
    //submits proof that
    function submitProof(bytes calldata _proof, bytes32 _nullifierRoot, bytes32 _utxoRoot) external onlyOwner {
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = _nullifierRoot;
        publicInputs[1] = _utxoRoot;

        require(verifier.verify(_proof, publicInputs), "invalid proof");

        nullifierRoot = _nullifierRoot;
        utxoRoot = _utxoRoot;
    }

    //transaction UTXO should be empty
    function initiateExit(UTXO calldata _utxo) external {
        bytes32 messageHash =
            keccak256(abi.encodePacked(_utxo.value, _utxo.spender_pub_key_x, _utxo.spender_pub_key_y, _utxo.token));

        exits[messageHash][msg.sender] =
            Balance({amount: _utxo.value, token: _utxo.token, challengePeriodEnd: block.timestamp + challengePeriod});

        emit ExitInitiated(msg.sender, messageHash);
    }

    function finalizeExit(bytes32 _messageHash) external nonReentrant {
        Balance storage balance = exits[_messageHash][msg.sender];
        require(balance.challengePeriodEnd < block.timestamp, "challenge period not over");
        require(balance.amount > 0, "exit not initiated or already completed");

        if (balance.token == address(0)) {
            (bool success,) = payable(msg.sender).call{value: balance.amount}();
            require(success);
        } else {
            IERC20(balance.token).safeTransfer(msg.sender, balance.amount);
        }

        balance.amount = 0;
    }

    // prove double spend attempt for UTXO
    // if a mallicious user tries to spend the UTXO on the L2 and simultanioulsy tries to exit it on the L1 (before the next UTXO proof is submitted) we can challenge them by proving the UTXO they are trying to exit exists in the new nullifier tree
    ///@param _nullifierSiblings - nullifier tree sibling nodes. keccak256(value: UTXO, nextVal, nextIndex)
    function challengeUTXOAlreadySpent(
        address _spender,
        bytes32 _messageHash,
        bytes32 _nullifierTreeLeaf,
        bytes32[] calldata _nullifierSiblings
    ) external {
        //if at any point in the future the message exists in the nullifier tree then it has been spent.
        require(_nullifierSiblings.verifyCalldata(nullifierRoot, _nullifierTreeLeaf), "invalid merkle proof");

        //penalty
        Balance storage balance = exits[_messageHash][_spender];
        balance.amount = 0;
    }

    // prove that the spender is trying to exit with a UTXO that does not exist in the UTXO tree
    function challengeUTXODoesNotExist(address _spender, bytes32 _messageHash, bytes32[] calldata _utxoTreeSiblings)
        external
    {
        require(!_utxoTreeSiblings.verifyCalldata(utxoRoot, _messageHash), "UTXO is in tree");

        //penalty
        Balance storage balance = exits[_messageHash][_spender];
        balance.amount = 0;
    }

    function exitInstant(
        UTXO calldata _utxo,
        bytes32[] calldata _utxoTreeSiblings,
        LowNullifierLeaf calldata _lowNullifierLeaf,
        bytes32[] calldata _nullifierTreeSiblings
    ) external {
        bytes32 messageHash =
            keccak256(abi.encodePacked(_utxo.value, _utxo.spender_pub_key_x, _utxo.spender_pub_key_y, _utxo.token));

        //ensure UTXO exists in UTXO tree
        require(_utxoTreeSiblings.verifyCalldata(utxoRoot, messageHash), "UTXO is NOT in tree");

        // ensure UTXO has not been spent using low nullifier.
        // for algorithm see: https://docs.aztec.network/concepts/advanced/data_structures/indexed_merkle_tree#non-membership-proof
        bytes32 lowNullifierLeafHash = keccak256(
            abi.encodePacked(
                _lowNullifierLeaf.value.value,
                _lowNullifierLeaf.value.spender_pub_key_x,
                _lowNullifierLeaf.value.spender_pub_key_y,
                _lowNullifierLeaf.value.token,
                _lowNullifierLeaf.next_value.value,
                _lowNullifierLeaf.next_value.spender_pub_key_x,
                _lowNullifierLeaf.next_value.spender_pub_key_y,
                _lowNullifierLeaf.next_value.token,
                _lowNullifierLeaf.next_index
            )
        );

        require(
            _nullifierTreeSiblings.verifyCalldata(nullifierRoot, lowNullifierLeafHash),
            "Low nullifier NOT in nullifier tree"
        );

        require(_utxo.token == _lowNullifierLeaf.value.token, "Token identifier mismatch");
        require(_utxo.token == _lowNullifierLeaf.next_value.token, "Token identifier mismatch");

        require(_lowNullifierLeaf.value.value < _utxo.value, "UTXO value should be larger than low nullifier value");

        if (_lowNullifierLeaf.next_index != 0) {
            require(
                _lowNullifierLeaf.next_value.value > _utxo.value,
                "UTXO next value should be larger than low nullifier value"
            );
        }

        if (_utxo.token == address(0)) {
            (bool success,) = payable(msg.sender).call{value: balance.amount}();
            require(success);
        } else {
            IERC20(_utxo.token).safeTransfer(msg.sender, _utxo.value);
        }
    }

    //NOTE: deposit functions are needed only to simulate sandbox Validium, in real cases the tokens are going to already be in circulation

    //ERC20 must be approved beforehand
    function deposit(address _token, uint256 _value) external {
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _value);
        // deposits[msg.sender][_token] += _value;
    }

    receive() external payable {
        // deposits[msg.sender][address(0)] += msg.value; // we consider address zero as ETH deposit, everything else is ERC20 deposit
    }
}
