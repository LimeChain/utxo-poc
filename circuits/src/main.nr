
use dep::noir_biguint;
use dep::ecrecover::secp256k1;
use dep::std;

// modify these values when creating an array of inputs and outputs for a single UTXO
global OUTPUT_SIZE = 116;
global TRANSACTION_SIZE = 232; // OUTPUT_SIZE * 2
global INDEXED_MERKLE_LEAF_SIZE = 236; // 2 * OUTPUT_SIZE + 4 (nextIdx)

struct Output {
    value: [u8; 32], // represents u256 value in EVM
    spender_pub_key_x: [u8; 32],
    spender_pub_key_y: [u8; 32],
    erc20_address: [u8; 20], // represents address of ERC20 token contract. Ised as an ID. If it's null we can consider the transfer to be ETH transfer
}

struct Transaction {
    input: Output, // reference to the previous UTXO output
    output: Output // current new UTXO output
}

impl Transaction {
    // conversion can be unconstrained since we are not checking anything here
    unconstrained fn to_bytes(self: Self) -> [u8; TRANSACTION_SIZE] {
        let mut res =  [0 as u8; TRANSACTION_SIZE];
        let mut index = 0;

        for j in 0..32 {
            res[index] = self.input.value[j];
            index += 1;
        }
        for j in 0..32 {
            res[index] = self.input.spender_pub_key_x[j];
            index += 1;
        }
        for j in 0..32 {
            res[index] = self.input.spender_pub_key_y[j];
            index += 1;
        }
        for j in 0..20 {
            res[index] = self.input.erc20_address[j];
            index += 1;
        }
        
        for j in 0..32 {
            res[index] = self.output.value[j];
            index += 1;
        }
        for j in 0..32 {
            res[index] = self.output.spender_pub_key_x[j];
            index += 1;
        }
        for j in 0..32 {
            res[index] = self.output.spender_pub_key_y[j];
            index += 1;
        }

        for j in 0..20 {
            res[index] = self.output.erc20_address[j];
            index += 1;
        }
        
        res
    }

}

impl Output {
    // conversion can be unconstrained since we are not checking anything here
    unconstrained fn to_field_array(self: Self) -> [Field; OUTPUT_SIZE] {
        let mut res =  [0 as Field; OUTPUT_SIZE];
        let mut index = 0;

        for j in 0..32 {
            res[index] = self.value[j] as Field;
            index += 1;
        }
        for j in 0..32 {
            res[index] = self.spender_pub_key_x[j] as Field;
            index += 1;
        }
        for j in 0..32 {
            res[index] = self.spender_pub_key_y[j] as Field;
            index += 1;
        }
        for j in 0..20 {
            res[index] = self.erc20_address[j] as Field;
            index += 1;
        }
        
        res
    }

    //NOTE: keccak hashes the entire object
    fn to_bytes_32(self: Self) -> [u8; 32] {
        let mut arr =  [0 as u8; OUTPUT_SIZE];
        let mut index = 0;

        for j in 0..20 {
            arr[index] = self.erc20_address[j];
            index += 1;
        }
        for j in 0..32 {
            arr[index] = self.value[j];
            index += 1;
        }
        for j in 0..32 {
            arr[index] = self.spender_pub_key_x[j];
            index += 1;
        }
        for j in 0..32 {
            arr[index] = self.spender_pub_key_y[j];
            index += 1;
        }
        
        let res = std::hash::keccak256(arr, OUTPUT_SIZE);
        res
    }
}

struct SignedTransaction {
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],
    transaction: Transaction
}

impl SignedTransaction {
    //verification logic comes from: https://github.com/colinnielsen/ecrecover-noir/tree/main#methods
    fn verify(self) -> bool {
        let transaction_bytes: [u8; TRANSACTION_SIZE] = self.transaction.to_bytes();
        let hashed_transaction = std::hash::keccak256(transaction_bytes, TRANSACTION_SIZE);
        let key = secp256k1::PubKey::from_xy(self.pub_key_x, self.pub_key_y);
        let res = key.verify_sig(self.signature, hashed_transaction);
        res
    }
}

struct IndexedMerkleLeaf {
    val: Output,
    nextVal: Output,
    nextIdx: u32,
}

impl IndexedMerkleLeaf {

    //NOTE: keccak hashes the entire object
    fn to_bytes_32(self: Self) -> [u8; 32] {
        let mut arr =  [0 as u8; INDEXED_MERKLE_LEAF_SIZE];
        let mut index = 0;

        for j in 0..32 {
            arr[index] = self.val.value[j];
            index += 1;
        }
        for j in 0..32 {
            arr[index] = self.val.spender_pub_key_x[j];
            index += 1;
        }
        for j in 0..32 {
            arr[index] = self.val.spender_pub_key_y[j];
            index += 1;
        }
        for j in 0..20 {
            arr[index] = self.val.erc20_address[j];
            index += 1;
        }

        for j in 0..32 {
            arr[index] = self.nextVal.value[j];
            index += 1;
        }
        for j in 0..32 {
            arr[index] = self.nextVal.spender_pub_key_x[j];
            index += 1;
        }
        for j in 0..32 {
            arr[index] = self.nextVal.spender_pub_key_y[j];
            index += 1;
        }
        for j in 0..20 {
            arr[index] = self.nextVal.erc20_address[j];
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

// NOTE: we need to initially compress the Output leaf to 32 bytes before passing it to the function
fn compute_merkle_root(leaf: [u8; 32], path_indices: [Field; 32], siblings: [[u8; 32]; 32]) -> [u8; 32] {
    let mut current = leaf;
    for i in 0..32 { //depth 32
        let is_right = (path_indices[i] == 1) as bool;
        let mut arr: [u8; 64] = [0; 64];
        let mut index = 0;
        for j in 0..32 { // each one of 32 bytes
            if(is_right) {
                arr[index] = siblings[i][j];
                index += 1;
            } else {
                arr[index] = current[j];
                index += 1;
            }
        }
        
        for j in 0..32 { // each one of 32 bytes
            if(is_right) {
                arr[index] = current[j];
                index += 1;
            } else {
                arr[index] = siblings[i][j];
                index += 1;
            }
        }
        
        current = std::hash::keccak256(arr, 64);

    }

    current
}

//then check inputs are available and required amount is available
fn check_input_output_values(input: Output, output: Output) {
    let mut total_value_inputs = noir_biguint::BigUint56::zero();
    let mut total_value_outputs = noir_biguint::BigUint56::zero(); // we are using BigInt library to accumulate UTXO values

    //maybe add with carry and assert there is no overflow
    total_value_inputs = total_value_inputs.add(noir_biguint::BigUint56::from_bytes(input.value));
    total_value_outputs = total_value_outputs.add(noir_biguint::BigUint56::from_bytes(output.value));


    // the transaction total value must be more than zero, but input value must be less than output value
    assert(!total_value_outputs.is_zero());
    assert(!total_value_inputs.is_zero());
    assert(total_value_inputs.lt(total_value_outputs));
}

// utxo_before and utxo_after are the sets of UTXOs before and after executing the transaction traces
// each one of them is represented as merkle tree root, path indices (0 or 1 representing left or right side) and sibling path (array of intermediary tree values).
// The nullifier tree will be append-only and should be used to proove UTXO has not been spent using merkle non-inclusion proof.
// nullifier
// Merkle tree of depth 32 should be enough to represent 4 billion UTXOs, enough to cover the next 27 years at 5 TPS at full usage.
fn main(utxo_before_root: [u8; 32], utxo_before_path_indices: [Field; 32], utxo_before_siblings: [[u8; 32]; 32], utxo_after_root: [u8; 32], utxo_after_path_indices: [Field; 32], utxo_after_siblings: [[u8; 32]; 32], low_nullifier_leaf: IndexedMerkleLeaf, low_nullifier_root: [u8; 32], low_nullifier_path_indices: [Field; 32], low_nullifier_siblings: [[u8; 32]; 32], signed_transaction: SignedTransaction) {

        //Ensure that the signature is signed by the same owner that claims to have access to UTXO before
        assert(signed_transaction.verify());
        let transaction = signed_transaction.transaction;

        check_input_output_values(transaction.input, transaction.output);
        
        //assert utxo input index exists in utxo set before (use it as leaf index)
        let computed_root = compute_merkle_root(transaction.input.to_bytes_32(), utxo_before_path_indices, utxo_before_siblings);
        assert(utxo_before_root == computed_root);

        //assert the new utxo output has been added to the utxo tree after the transaction
        let computed_root = compute_merkle_root(transaction.output.to_bytes_32(), utxo_after_path_indices, utxo_after_siblings);
        assert(utxo_after_root == computed_root);

        //ownership check
        //assert the transaction signer public key is the same as the input utxo spender public key
        assert(signed_transaction.pub_key_x == transaction.input.spender_pub_key_x);
        assert(signed_transaction.pub_key_y == transaction.input.spender_pub_key_y);

        //UTXO input merkle non-inclusion proof
        // https://docs.aztec.network/concepts/advanced/data_structures/indexed_merkle_tree#non-membership-proof

        //hash the low nullifier
        let low_nullifier_hash = low_nullifier_leaf.to_bytes_32();

        //Prove the low leaf exists in the tree: n hashes.
        let computed_root = compute_merkle_root(low_nullifier_hash, low_nullifier_path_indices, low_nullifier_siblings);
        assert(low_nullifier_root == computed_root);
        
        let low_nullifier_value = noir_biguint::BigUint56::from_bytes(low_nullifier_leaf.val.value);
        let new_nullifier_value = noir_biguint::BigUint56::from_bytes(transaction.input.value);
        if(low_nullifier_leaf.nextIdx == 0) {
            //Special case, the low leaf is at the very end, so the new_value must be higher than all values in the tree
            assert(low_nullifier_value.lt(new_nullifier_value));
        } else {
            let low_nullifier_next_value = noir_biguint::BigUint56::from_bytes(low_nullifier_leaf.nextVal.value);
            assert(low_nullifier_next_value.gt(new_nullifier_value));
            assert(low_nullifier_value.lt(new_nullifier_value));
        }
}
