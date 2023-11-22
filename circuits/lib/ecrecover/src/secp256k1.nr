use dep::std;

struct PubKey {
    pub_x: [u8; 32],
    pub_y: [u8; 32],
}

impl PubKey {
    pub fn from_xy(pub_x: [u8; 32], pub_y: [u8; 32]) -> PubKey {
        PubKey {
            pub_x,
            pub_y,
        }
    }

    pub fn verify_sig(self, signature: [u8; 64], hashed_message: [u8; 32]) -> bool {
        std::ecdsa_secp256k1::verify_signature(self.pub_x, self.pub_y, signature, hashed_message)
    }

}