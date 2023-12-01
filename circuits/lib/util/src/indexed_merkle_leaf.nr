struct IndexedMerkleLeaf {
    val: [u8; 32], // hash of current UTXO
    nextVal: [u8; 32], // hash of next UTXO
    nextIdx: u32,
}