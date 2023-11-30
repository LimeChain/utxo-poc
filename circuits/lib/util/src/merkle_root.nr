use dep::std;

pub fn compute_merkle_root(leaf: [u8; 32], path_indices: [Field; 32], siblings: [[u8; 32]; 32]) -> [u8; 32] {
    let mut current = leaf;
    for i in 0..31 { //depth 32 (31 loops, because 32th depth is the leaf itself)
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
