// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/// @title Interface for Blockhash Oracle
/// @author LimeChain team
interface IBlockhashOracle {
    /// @notice Fetches the blockhash for a given block number
    /// @param blockNumber The number of the block whose hash is required
    /// @return The blockhash of the specified block
    function getBlockhash(uint256 blockNumber) external view returns (bytes32);
}