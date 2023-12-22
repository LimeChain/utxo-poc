// Verification Key Hash: dff9ce524a9bdebb9a488aa7031fa5e1a0ec42bad9136d1f1bf32b6b3cb2f24e
// SPDX-License-Identifier: Apache-2.0
// Copyright 2022 Aztec
pragma solidity >=0.8.4;

library UltraVerificationKey {
    function verificationKeyHash() internal pure returns(bytes32) {
        return 0xdff9ce524a9bdebb9a488aa7031fa5e1a0ec42bad9136d1f1bf32b6b3cb2f24e;
    }

    function loadVerificationKey(uint256 _vk, uint256 _omegaInverseLoc) internal pure {
        assembly {
            mstore(add(_vk, 0x00), 0x0000000000000000000000000000000000000000000000000000000000010000) // vk.circuit_size
            mstore(add(_vk, 0x20), 0x0000000000000000000000000000000000000000000000000000000000000000) // vk.num_inputs
            mstore(add(_vk, 0x40), 0x00eeb2cb5981ed45649abebde081dcff16c8601de4347e7dd1628ba2daac43b7) // vk.work_root
            mstore(add(_vk, 0x60), 0x30641e0e92bebef818268d663bcad6dbcfd6c0149170f6d7d350b1b1fa6c1001) // vk.domain_inverse
            mstore(add(_vk, 0x80), 0x088eac61870df725afa2950a10bc853407be944903bf3cadb2facd812e8e4857) // vk.Q1.x
            mstore(add(_vk, 0xa0), 0x1a82eaf715c5c8cb624adc65bf0979fc123e836b17698296bdcdd34b875069be) // vk.Q1.y
            mstore(add(_vk, 0xc0), 0x2fb693bf4e03ce2453f0ca0c0b53ba1a2d0c2e6f0581ce76732c387c0ca157d2) // vk.Q2.x
            mstore(add(_vk, 0xe0), 0x206a721fdf90476e0c774c79d07776afd437a53a74581cbeb424e8598fd42119) // vk.Q2.y
            mstore(add(_vk, 0x100), 0x24aea03962b8b670f85b959f19bbb1772f37dd82a77789ec7ed2d6ffed97136f) // vk.Q3.x
            mstore(add(_vk, 0x120), 0x209330dfd281b48b271cf30f26b2311366e5758b3e8c1273b84c10c1bce3b118) // vk.Q3.y
            mstore(add(_vk, 0x140), 0x2518182e1e2fff4104a1d35309a6283e22729d14ad366e2426043b44c30abaa7) // vk.Q4.x
            mstore(add(_vk, 0x160), 0x27691a58c0cfa1d8b4130fa5f3fac3b97b704e33fe21d725fb6cae70dae077ef) // vk.Q4.y
            mstore(add(_vk, 0x180), 0x0cd7b218bfd1103ba0d3837dd93b5003f4c334e1792cb1d9ce5e52c374251c51) // vk.Q_M.x
            mstore(add(_vk, 0x1a0), 0x12403c96305d3b184da0bb80a98ebabb6c9aef869db7602a5e771772efdc3163) // vk.Q_M.y
            mstore(add(_vk, 0x1c0), 0x2aa28d2b865ccf2e98929a5d7f20620016e5269787c837f2f567d191cd7aadde) // vk.Q_C.x
            mstore(add(_vk, 0x1e0), 0x179ef3c19b8cfc5a63563e23ad541ea21eb129e3ca17bda0b1394438bcd545ce) // vk.Q_C.y
            mstore(add(_vk, 0x200), 0x1fe287da546eef40b6e02479795bd9149d36527b45e81aedcd61bb2c89c9f80b) // vk.Q_ARITHMETIC.x
            mstore(add(_vk, 0x220), 0x14fa15b30a6c4d5fa3086e39005048ab365381cc0f6b39d80057d33a20615f33) // vk.Q_ARITHMETIC.y
            mstore(add(_vk, 0x240), 0x0f380552d7a59ed53a005f3d8a2722832d55c2323eeef325f8d37678f3d80ab4) // vk.QSORT.x
            mstore(add(_vk, 0x260), 0x07c0036d06f98907fbd36643aa68e2d0768915e1bd6c3ba683fb7fa9cfcef9e5) // vk.QSORT.y
            mstore(add(_vk, 0x280), 0x21245d6c0a4d2ff12b21a825f39f30e8f8cf9b259448d111183e975828539576) // vk.Q_ELLIPTIC.x
            mstore(add(_vk, 0x2a0), 0x16a409532c8a1693536e93b6ce9920bfc2e6796e8dfe404675a0cdf6ee77ee7a) // vk.Q_ELLIPTIC.y
            mstore(add(_vk, 0x2c0), 0x0f41ca54e512e3843651651b45c8bd3ef2532d298dbc6b8b41eff2d1ae075a0c) // vk.Q_AUX.x
            mstore(add(_vk, 0x2e0), 0x09d08dd81087e4bcb9b5bb4632a67d1d56da095fcfde10adf3959bc8f39d7a78) // vk.Q_AUX.y
            mstore(add(_vk, 0x300), 0x19e164565ab1ea2602e8d15cc45a32a089c76e8952ac0ed4d16ecca3ead5de5e) // vk.SIGMA1.x
            mstore(add(_vk, 0x320), 0x060495c8f8b0295951b32827aef0a0d298089b71882cd3df4e7263f9a6be03d5) // vk.SIGMA1.y
            mstore(add(_vk, 0x340), 0x279a29e00e52861c79713beeec400c4e7466fef16f772f5190d508e1b528495f) // vk.SIGMA2.x
            mstore(add(_vk, 0x360), 0x081bcfdb43d2effc1692ff18617fe7c064f30b6edc147036230859630553881f) // vk.SIGMA2.y
            mstore(add(_vk, 0x380), 0x2c2fb55014519156ccf39999b0a6fe71f1773bfa9ff14169aa3e2d9201feb160) // vk.SIGMA3.x
            mstore(add(_vk, 0x3a0), 0x17aa24f306e7f4295803795c98ee008b3d2dcc8742f03b2b6bcb8e10e9cee484) // vk.SIGMA3.y
            mstore(add(_vk, 0x3c0), 0x243f6ab144385bca94e774558a36ed6bab8ac9238cc5e929a89e620db076e0e1) // vk.SIGMA4.x
            mstore(add(_vk, 0x3e0), 0x272234ee7d502ebfb20d205b6514afc0d157858851703768687e79fa3c5d87f6) // vk.SIGMA4.y
            mstore(add(_vk, 0x400), 0x06e6d1480535f6e29a6713cd5c4e668464cbdac425322b2d3b98a34e8834c14f) // vk.TABLE1.x
            mstore(add(_vk, 0x420), 0x15c1b7ea4800a867676fc4c79695b5b27b0e702d7d6188d0ad0259936cb3e55f) // vk.TABLE1.y
            mstore(add(_vk, 0x440), 0x030b16cd4d48e7b40d2ac90b515369aabc0c273bd7c77f122e9993c2251f7f4a) // vk.TABLE2.x
            mstore(add(_vk, 0x460), 0x07578950db871ef62bab02e94473298e53701113cc0c09573d1ccdbb99ab49b7) // vk.TABLE2.y
            mstore(add(_vk, 0x480), 0x1bbfe736b28dc8ede22ad6ba3ecec3607de18a29cee6828a7303d33ceb1e2ef0) // vk.TABLE3.x
            mstore(add(_vk, 0x4a0), 0x2e0a348344704012f149db2aed39ea37d1fe96d4d91f803026f17ed9a0449907) // vk.TABLE3.y
            mstore(add(_vk, 0x4c0), 0x273714e498d7ee7471cf8859c5db4113e86f6acee195b29fd0e5953728135962) // vk.TABLE4.x
            mstore(add(_vk, 0x4e0), 0x2997e7f0a5012a52da8388d912ce58fffbab8f6b5d56b6c289ab367fd72f242a) // vk.TABLE4.y
            mstore(add(_vk, 0x500), 0x04ebdf0e916013d64e4f4e4d4413736d2ef0cc733ccf25157e490ea2abd7f0fa) // vk.TABLE_TYPE.x
            mstore(add(_vk, 0x520), 0x00c91e3a2d468c8b3198de19b9d0aeb28f6a8f44669d54c39f9e34d091356740) // vk.TABLE_TYPE.y
            mstore(add(_vk, 0x540), 0x135965316985fb00f87a1a8c8699d1dc199f2d4e5cb6d92e3c62722728590f7b) // vk.ID1.x
            mstore(add(_vk, 0x560), 0x1c02ad34d82d9a0cbbdb1b0d3d67757e91706bde64f0650bc7b3fcc5aab5a5ed) // vk.ID1.y
            mstore(add(_vk, 0x580), 0x010acbb53d478d6145d8991e95c3f3ab5f342420495302c94f45dc806fd63e96) // vk.ID2.x
            mstore(add(_vk, 0x5a0), 0x021ef997046dc237a7f69c0f735b850b8134a2dcbb4dfbd980043a7061670ad3) // vk.ID2.y
            mstore(add(_vk, 0x5c0), 0x09b832d8f15c22354b0c45cf8ba8e8e8263b4b5fb17f215c8c9a844b12702032) // vk.ID3.x
            mstore(add(_vk, 0x5e0), 0x06e874e25b59f5c275e1186c2fb3cbaad898a712983735f04d991dc7a6c842de) // vk.ID3.y
            mstore(add(_vk, 0x600), 0x1fecd3edff46ed078c3bdc623637e75f3e06a94e10c4d39684cad266735347ce) // vk.ID4.x
            mstore(add(_vk, 0x620), 0x003605fcc65262ebc63ba6702f48d3022c8e079fecc99140328edcec5be884b9) // vk.ID4.y
            mstore(add(_vk, 0x640), 0x00) // vk.contains_recursive_proof
            mstore(add(_vk, 0x660), 0) // vk.recursive_proof_public_input_indices
            mstore(add(_vk, 0x680), 0x260e01b251f6f1c7e7ff4e580791dee8ea51d87a358e038b4efe30fac09383c1) // vk.g2_x.X.c1 
            mstore(add(_vk, 0x6a0), 0x0118c4d5b837bcc2bc89b5b398b5974e9f5944073b32078b7e231fec938883b0) // vk.g2_x.X.c0 
            mstore(add(_vk, 0x6c0), 0x04fc6369f7110fe3d25156c1bb9a72859cf2a04641f99ba4ee413c80da6a5fe4) // vk.g2_x.Y.c1 
            mstore(add(_vk, 0x6e0), 0x22febda3c0c0632a56475b4214e5615e11e6dd3f96e6cea2854a87d4dacc5e55) // vk.g2_x.Y.c0 
            mstore(_omegaInverseLoc, 0x0b5d56b77fe704e8e92338c0082f37e091126414c830e4c6922d5ac802d842d4) // vk.work_root_inverse
        }
    }
}
