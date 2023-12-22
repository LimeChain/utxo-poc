// Verification Key Hash: 961aa69e20d269eb60e2a3217e3ec2995fe62c65b444c0d39864783dedd69cb8
// SPDX-License-Identifier: Apache-2.0
// Copyright 2022 Aztec
pragma solidity >=0.8.4;

library UltraVerificationKey {
    function verificationKeyHash() internal pure returns(bytes32) {
        return 0x961aa69e20d269eb60e2a3217e3ec2995fe62c65b444c0d39864783dedd69cb8;
    }

    function loadVerificationKey(uint256 _vk, uint256 _omegaInverseLoc) internal pure {
        assembly {
            mstore(add(_vk, 0x00), 0x0000000000000000000000000000000000000000000000000000000000100000) // vk.circuit_size
            mstore(add(_vk, 0x20), 0x0000000000000000000000000000000000000000000000000000000000000000) // vk.num_inputs
            mstore(add(_vk, 0x40), 0x26125da10a0ed06327508aba06d1e303ac616632dbed349f53422da953337857) // vk.work_root
            mstore(add(_vk, 0x60), 0x30644b6c9c4a72169e4daa317d25f04512ae15c53b34e8f5acd8e155d0a6c101) // vk.domain_inverse
            mstore(add(_vk, 0x80), 0x14fa6d4b91ff52705595a46b7984faeb4ccc9c1753b49d74667c86f1ffb293d9) // vk.Q1.x
            mstore(add(_vk, 0xa0), 0x130369419244ff47c5123575d77d32a95bdfd208ad1faf101c90f23d9fdcfd40) // vk.Q1.y
            mstore(add(_vk, 0xc0), 0x12b7d9c3c2c5e5be4bfb89b84e196d1cf11848e46bed2f9dadfb3b4ac412af10) // vk.Q2.x
            mstore(add(_vk, 0xe0), 0x11d27db0c54f6911b40df482ca55df17fb779f41a9a7bc6f5dcbe165b7b9a3b2) // vk.Q2.y
            mstore(add(_vk, 0x100), 0x03de7a765d4edf11a9e8cbd87001632e7430608fb19ae7e14bc4c8737dad9236) // vk.Q3.x
            mstore(add(_vk, 0x120), 0x26ef3f24cd9eca4691d39438dc2e3f73aa7c8d720ae24ce72d1a45d658728b0e) // vk.Q3.y
            mstore(add(_vk, 0x140), 0x2c79462e4e2f7da7094d38708543c1effd6f3582087a784f79a83583d0f6000a) // vk.Q4.x
            mstore(add(_vk, 0x160), 0x220eaff291ab4262a2f09449b1a431a588fb734a6ac7b067483adf3ec660311a) // vk.Q4.y
            mstore(add(_vk, 0x180), 0x0f671dc3a3068d2f246e17bac46d4e9a608a1e319be82ec8e66edfc7cd44cf5a) // vk.Q_M.x
            mstore(add(_vk, 0x1a0), 0x0879f74d9e1c81cab1f7b343a60f410d0b2a4a391cdcba172de6f341e4ae5173) // vk.Q_M.y
            mstore(add(_vk, 0x1c0), 0x25b8008217569882e243251a71a4dc09e7b568e7ba4fc593e5ff1ff7bf3fa2aa) // vk.Q_C.x
            mstore(add(_vk, 0x1e0), 0x29047c08027eafb19afc141ae8afc60c89d93f239a2627ec9571f61c44e4fc3e) // vk.Q_C.y
            mstore(add(_vk, 0x200), 0x07b6e9ca6a56ce885110b6fa4ddc464de529639c14b9dcbec424cb7c22a7b50b) // vk.Q_ARITHMETIC.x
            mstore(add(_vk, 0x220), 0x13e6af92fdfba938655fbebbe4e05e100791c559b403d1ceb42ba96345623317) // vk.Q_ARITHMETIC.y
            mstore(add(_vk, 0x240), 0x0ea298996175ab1cb3e4c29969b28ec29ee44b73328542848a8e7501fce8b40d) // vk.QSORT.x
            mstore(add(_vk, 0x260), 0x23fcfea6fc20ecb3e17ec0d0d29e49fd4a8ba091ab4c412435ba3dc1a070837e) // vk.QSORT.y
            mstore(add(_vk, 0x280), 0x2e96e47cebeb8f1f4b5465d3475fba0623d4523ae564170555962a0f3562ef80) // vk.Q_ELLIPTIC.x
            mstore(add(_vk, 0x2a0), 0x2ee9f3f01fe2ade60ee3aa740db59b85971aff3dd99940436b59d2fb216ad98b) // vk.Q_ELLIPTIC.y
            mstore(add(_vk, 0x2c0), 0x14557cd88b42181250d7cd1830730c196d9fae86b51e43545463014bd5ceca83) // vk.Q_AUX.x
            mstore(add(_vk, 0x2e0), 0x1bd3a9da783a6730a47ec3af05c3dbce60cef6c094fc7a2b1ce8833f9e73be6c) // vk.Q_AUX.y
            mstore(add(_vk, 0x300), 0x0bcf2e8d21ef19c1f914576a2c15bfb1421c3e8b69bbc1a06845b81fff2db5ba) // vk.SIGMA1.x
            mstore(add(_vk, 0x320), 0x21dc0abfa7f47f56b93cc216e523f201b5c16aef8592d09596baf769d3d50021) // vk.SIGMA1.y
            mstore(add(_vk, 0x340), 0x0c37b927254eeac9e000c24db482ee189ec45db1b18072f6475e4b734d609eda) // vk.SIGMA2.x
            mstore(add(_vk, 0x360), 0x08197f6dc669141fdea597ea8b2e4fbf6e9eb24d5021027bb11f40150426f30b) // vk.SIGMA2.y
            mstore(add(_vk, 0x380), 0x2b3cbf4f77ddcbb006e3f6f08ec12ed3944a90d461ba478fa568c3e9aa73f172) // vk.SIGMA3.x
            mstore(add(_vk, 0x3a0), 0x2eb465e5fed54aa47dc88e9f77f3aba7508bc136360049a911ce4829f27c8702) // vk.SIGMA3.y
            mstore(add(_vk, 0x3c0), 0x211c6f62d5eff3b250e2d1042ea1c201f9e7303ad47a24eec345cd2736c65c0f) // vk.SIGMA4.x
            mstore(add(_vk, 0x3e0), 0x278705c976870cd650dc557e3c2b1fd47d81c9954eacced0fef3e294bfbdf866) // vk.SIGMA4.y
            mstore(add(_vk, 0x400), 0x0b9f59e968519aab3f6bdad9cd7130660cd239c4bba6d42506597af25ec4dbdd) // vk.TABLE1.x
            mstore(add(_vk, 0x420), 0x244c6c2d72b12e804bb9e4ae05a4c8c705a344bf98891e4eee6f005fda57f57a) // vk.TABLE1.y
            mstore(add(_vk, 0x440), 0x008d8b611563b6dd530e3d8a1df56ef56a49bcf9e3b81c8e50b6cacbd9d26a27) // vk.TABLE2.x
            mstore(add(_vk, 0x460), 0x1e0d5ce429217ab59c05bf41994eb5cdf97c507c1bd4e6d4a0b07624b1318286) // vk.TABLE2.y
            mstore(add(_vk, 0x480), 0x19704033d62de688fd88eff68de65cec07180c937b6671861a07cc8061ad77d7) // vk.TABLE3.x
            mstore(add(_vk, 0x4a0), 0x1430b09e661baf8f49866d8d08c37f1f3bd946afb46793bf8f6822e3bfedfbba) // vk.TABLE3.y
            mstore(add(_vk, 0x4c0), 0x12ce84a5f77cb907baeba0928b26062e9b761fc533ffcda97069998ceae00995) // vk.TABLE4.x
            mstore(add(_vk, 0x4e0), 0x0dde852ae1051200f46984363064ef4e3133d98297be07b75a41763a06e4ea73) // vk.TABLE4.y
            mstore(add(_vk, 0x500), 0x01b4375e0ca0a09f6872cc2d8e04ccb3542a4998aac6d3e2e70b3d8546b846ca) // vk.TABLE_TYPE.x
            mstore(add(_vk, 0x520), 0x0c60c74d4cd9768bcc254fa622b03f5ec0d527730675ea2ab3513ba114f6839e) // vk.TABLE_TYPE.y
            mstore(add(_vk, 0x540), 0x17ad9e84a3eefd73b71905c70584747abe81da88630ea0cbb5e0bca0524fcc15) // vk.ID1.x
            mstore(add(_vk, 0x560), 0x2b481ffb2ccb36afc0d4b099bbe13d46cbadeca304474a9bb550b67d336b8d57) // vk.ID1.y
            mstore(add(_vk, 0x580), 0x2134c486aeede9e26daf635c49f9fb11f62433e1b50ef82b274bf244540292a1) // vk.ID2.x
            mstore(add(_vk, 0x5a0), 0x07b10c02d7bf5cb3f00b45c07e6e8722db445394e7cc6058526ad305e6f4c175) // vk.ID2.y
            mstore(add(_vk, 0x5c0), 0x21c070b1b520108fc318f64bb3f2278dc3c31d547bf29dbaf120272440b2adf8) // vk.ID3.x
            mstore(add(_vk, 0x5e0), 0x2f3b675171b16183f4bf667df243dab9b46fa992d156d66a02e464a76557ed67) // vk.ID3.y
            mstore(add(_vk, 0x600), 0x0063dea468f7ba0deb5f2778d213c66fd13dd33fcb3f7e7054bad76f9d1213e6) // vk.ID4.x
            mstore(add(_vk, 0x620), 0x10624cd34e8524715dacbbc2aa4ac49aeef7dfc7ac971a5c55ccbd0e92d666b4) // vk.ID4.y
            mstore(add(_vk, 0x640), 0x00) // vk.contains_recursive_proof
            mstore(add(_vk, 0x660), 0) // vk.recursive_proof_public_input_indices
            mstore(add(_vk, 0x680), 0x260e01b251f6f1c7e7ff4e580791dee8ea51d87a358e038b4efe30fac09383c1) // vk.g2_x.X.c1 
            mstore(add(_vk, 0x6a0), 0x0118c4d5b837bcc2bc89b5b398b5974e9f5944073b32078b7e231fec938883b0) // vk.g2_x.X.c0 
            mstore(add(_vk, 0x6c0), 0x04fc6369f7110fe3d25156c1bb9a72859cf2a04641f99ba4ee413c80da6a5fe4) // vk.g2_x.Y.c1 
            mstore(add(_vk, 0x6e0), 0x22febda3c0c0632a56475b4214e5615e11e6dd3f96e6cea2854a87d4dacc5e55) // vk.g2_x.Y.c0 
            mstore(_omegaInverseLoc, 0x100c332d2100895fab6473bc2c51bfca521f45cb3baca6260852a8fde26c91f3) // vk.work_root_inverse
        }
    }
}
