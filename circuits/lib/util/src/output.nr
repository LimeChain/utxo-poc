use dep::std;

global OUTPUT_SIZE = 116;

struct Output {
    value: [u8; 32], // represents u256 value of ERC20 token contract
    spender_pub_key_x: [u8; 32],
    spender_pub_key_y: [u8; 32],
    erc20_address: [u8; 20], // represents address of ERC20 token contract. Ised as an ID. If it's null we can consider the transfer to be ETH transfer
}

impl Output {
    //NOTE: keccak hashes the entire object
    fn to_bytes_32(self: Self) -> [u8; 32] {
        let mut arr =  [0 as u8; OUTPUT_SIZE];
        let mut index = 0;

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
        for j in 0..20 {
            arr[index] = self.erc20_address[j];
            index += 1;
        }
        
        let res = std::hash::keccak256(arr, OUTPUT_SIZE);
        res
    }
}