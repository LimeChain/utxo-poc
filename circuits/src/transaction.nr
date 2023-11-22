use crate::output::Output;

global TRANSACTION_SIZE = 232; // OUTPUT_SIZE * 2

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
