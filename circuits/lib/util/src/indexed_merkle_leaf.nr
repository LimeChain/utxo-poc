use dep::std;
use crate::utxo::UTXO;

global INDEXED_MERKLE_LEAF_SIZE = 68; // 2 * OUTPUT_SIZE + 4 (nextIdx)


struct IndexedMerkleLeaf {
    val: [u8; 32], // hash of current UTXO
    nextVal: [u8; 32], // hash of next UTXO
    nextIdx: u32,
}

impl IndexedMerkleLeaf {

    //NOTE: keccak hashes the entire object
    fn to_bytes_32(self: Self) -> [u8; 32] {
        let mut arr =  [0 as u8; INDEXED_MERKLE_LEAF_SIZE];
        let mut index = 0;

        for j in 0..32 {
            arr[index] = self.val[j];
            index += 1;
        }

        for j in 0..32 {
            arr[index] = self.nextVal[j];
            index += 1;
        }

        for j in 0..4 {
            let shift_amount: u32 = 24 - (j * 8) as u32;
            arr[index] = ((self.nextIdx >> shift_amount) & 255) as u8;
            index += 1;
        }
        
        let res = std::hash::keccak256(arr, INDEXED_MERKLE_LEAF_SIZE);
        res
    }
}
