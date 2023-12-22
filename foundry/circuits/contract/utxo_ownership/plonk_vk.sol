// Verification Key Hash: e4260320c67a1883bf1ea75d10013fe20e4a8066f821d51afdc6656ec50a9606
// SPDX-License-Identifier: Apache-2.0
// Copyright 2022 Aztec
pragma solidity >=0.8.4;

library UltraVerificationKey {
    function verificationKeyHash() internal pure returns(bytes32) {
        return 0xe4260320c67a1883bf1ea75d10013fe20e4a8066f821d51afdc6656ec50a9606;
    }

    function loadVerificationKey(uint256 _vk, uint256 _omegaInverseLoc) internal pure {
        assembly {
            mstore(add(_vk, 0x00), 0x0000000000000000000000000000000000000000000000000000000000001000) // vk.circuit_size
            mstore(add(_vk, 0x20), 0x0000000000000000000000000000000000000000000000000000000000000000) // vk.num_inputs
            mstore(add(_vk, 0x40), 0x0931d596de2fd10f01ddd073fd5a90a976f169c76f039bb91c4775720042d43a) // vk.work_root
            mstore(add(_vk, 0x60), 0x3061482dfa038d0fb5b4c0b226194047a2616509f531d4fa3acdb77496c10001) // vk.domain_inverse
            mstore(add(_vk, 0x80), 0x11363614bb280fabaefb13648f0878f6efa07dda7dd17fd8424ce1d8f98cebf2) // vk.Q1.x
            mstore(add(_vk, 0xa0), 0x0c4588a8ffb8f84c83fa992071dddeca45bf6664baf3d6503d6dfcf7117abd06) // vk.Q1.y
            mstore(add(_vk, 0xc0), 0x0b3161dda57d1f319d47e2c5f3b8186ea8399c36a11032b11e8f8a10a94f0aa8) // vk.Q2.x
            mstore(add(_vk, 0xe0), 0x1b4779e41166cb64edfc3a275e326673cf275a19cc4957ac91aa3a8b79727d12) // vk.Q2.y
            mstore(add(_vk, 0x100), 0x1a2fea2b69798531c13a8efbb5e5d2b97bf344d3a825ee044190625a8c301ea1) // vk.Q3.x
            mstore(add(_vk, 0x120), 0x2103e46c8e81b06ccdb1998a1056e39e535066e384bc51f7ec1e26bd272bab8e) // vk.Q3.y
            mstore(add(_vk, 0x140), 0x02639645d824b6deb9dc02adf8690d35ba9cba5276d4a6ad89b8eb7c1d043f3f) // vk.Q4.x
            mstore(add(_vk, 0x160), 0x26b88083cf73a5954643512dfea8f30abba15b1f6d909551821cbccf2dea0bd1) // vk.Q4.y
            mstore(add(_vk, 0x180), 0x1f99ab321383bab6bcd6066e1d4a7b95459d2747117405e196ccaebcba1baf91) // vk.Q_M.x
            mstore(add(_vk, 0x1a0), 0x0d7d83510f2b89a66cddb5443badfd9edc0e50d1edf99b7fa6fb114cd078a3b0) // vk.Q_M.y
            mstore(add(_vk, 0x1c0), 0x28191c5916f0f26e9bfddb79f3a794a48f4d8d554a8cb7485eabde6bb270680d) // vk.Q_C.x
            mstore(add(_vk, 0x1e0), 0x0d55aef65d4760fb588a7a1349b3e7ff8158ef2492d851bd22fa658d0df0d7a4) // vk.Q_C.y
            mstore(add(_vk, 0x200), 0x0771e1229eaae5a88b2d8ec1392cf7d3ffc51a9c7c93bae12200adf9e8c4f188) // vk.Q_ARITHMETIC.x
            mstore(add(_vk, 0x220), 0x06583b1bb1fcaffe69ec802a74c66ea164d73a486c31b4a2ae15f70580e944cc) // vk.Q_ARITHMETIC.y
            mstore(add(_vk, 0x240), 0x2b7734434113a6b87ee5e66eff63e7e426964f0425171b4a085f96419d01ff86) // vk.QSORT.x
            mstore(add(_vk, 0x260), 0x2cc61b14306640b46dd822c26c9f18f6f137463b4a3c9f6683c518074fdb92de) // vk.QSORT.y
            mstore(add(_vk, 0x280), 0x13982fd0cf8da5082a77561113bb5ee51e2e82380da3da5ad0f24e49e5f32208) // vk.Q_ELLIPTIC.x
            mstore(add(_vk, 0x2a0), 0x1aa5ffd5aa4c16d1c66e18c4574a3ab0b25e9b4e4e04ad1280d1a264237717e0) // vk.Q_ELLIPTIC.y
            mstore(add(_vk, 0x2c0), 0x1750f44d3f9dfad78a1e2127ef91051ce018f20536fe45ca28dcc7b248389fc0) // vk.Q_AUX.x
            mstore(add(_vk, 0x2e0), 0x1a05418f502a965c39994cd3f83e39164b49c0f27d4f5ac4550751cc0a24bb58) // vk.Q_AUX.y
            mstore(add(_vk, 0x300), 0x23b52edc0f1628a15235af69a908afc3cb10f72e30faaf3f4a0acfecf64b39bb) // vk.SIGMA1.x
            mstore(add(_vk, 0x320), 0x259f98754506d10993b12444031d9d5ad2f922063ca27bebc68f1ce6ef510dbe) // vk.SIGMA1.y
            mstore(add(_vk, 0x340), 0x2379a1ccc7cdb41114e20fd867bd16da546bf077217987385b7a6fe9ef2cac97) // vk.SIGMA2.x
            mstore(add(_vk, 0x360), 0x2a533de2a1bd79491b95d5de4c8ec3089ec75196cb7a067a723ecc1b6bc14dc6) // vk.SIGMA2.y
            mstore(add(_vk, 0x380), 0x061c2b8d06b3ac36e00a1f5060dcb5e1234c45698ee327419aca92abc6833257) // vk.SIGMA3.x
            mstore(add(_vk, 0x3a0), 0x11a2dc149ea648e0a024161f1c46e089d7b2ba067c89a94d0b40eac53621ad03) // vk.SIGMA3.y
            mstore(add(_vk, 0x3c0), 0x065b3aeac1c54737be47451dd7385e4aa420b361dd48d2cb94254f034bb1f767) // vk.SIGMA4.x
            mstore(add(_vk, 0x3e0), 0x01573e5f23af81e947148ed66d5bcb035049740c9cad07c3bf07fc6a1d053693) // vk.SIGMA4.y
            mstore(add(_vk, 0x400), 0x259f452dc7fd2dda4013dba2196852bcf43c285b1d1f7f85341f3615d25fe97b) // vk.TABLE1.x
            mstore(add(_vk, 0x420), 0x117500555dd886209c0b10ee8cd10e711e890a1c99a8f689419da8c52d2e8e9d) // vk.TABLE1.y
            mstore(add(_vk, 0x440), 0x2577f542178a07dac262fdabad6f55a84fca32b13b92e520bb91a7455f78ccf1) // vk.TABLE2.x
            mstore(add(_vk, 0x460), 0x0fc87ae27122e60eaacc070bd59aafe12644a82ee1345497f8c0302e92925c68) // vk.TABLE2.y
            mstore(add(_vk, 0x480), 0x1612f501335a4b72ac55dbe2fd1a75e5fe2c041687603b6577581d673d13be50) // vk.TABLE3.x
            mstore(add(_vk, 0x4a0), 0x160e8ef7ff5315cb640ec82e965db270846e904bb7d1c7ff02f32823de6c1c71) // vk.TABLE3.y
            mstore(add(_vk, 0x4c0), 0x2d540ff1653b38acbcb9cda315442364007633f529476b2f169a0ff131bfb319) // vk.TABLE4.x
            mstore(add(_vk, 0x4e0), 0x2198b9feb61f8160e357b8bb7ca329713898655cc94a0ac2d84944c737cf57e5) // vk.TABLE4.y
            mstore(add(_vk, 0x500), 0x11c8df52c3ef754f80d11792cea4b7ad74612e486596cbe7f7d6a05f19c69444) // vk.TABLE_TYPE.x
            mstore(add(_vk, 0x520), 0x10c8a36cbb2fd9ed8875b5106a37162ac2932f3bd1b6942b132546d2110a63e2) // vk.TABLE_TYPE.y
            mstore(add(_vk, 0x540), 0x23b86a73d5a145c24a4567cf9d491e9f89baab67e4b5fa079442606bad62799b) // vk.ID1.x
            mstore(add(_vk, 0x560), 0x1e88531a14eafbc530c91d1056c0418f956739048ffaf24a66d50ee3485d62f8) // vk.ID1.y
            mstore(add(_vk, 0x580), 0x2324b79f432a9981d560af14df65a9a338ecb5072c7ed2a85e8f55a10dcb8d54) // vk.ID2.x
            mstore(add(_vk, 0x5a0), 0x27bcf32f0e60476a25aa66dd26bf01782532932bf2a86588b6df0be42d7e5697) // vk.ID2.y
            mstore(add(_vk, 0x5c0), 0x0f97462c10d9abdfe3d8aa101595a58231fce8d06696f43167b730c5e9d6d53b) // vk.ID3.x
            mstore(add(_vk, 0x5e0), 0x079b4c47e2bcfd28e2e502af9bf638c559f7d7c35c5d251b6c2e3edee2183383) // vk.ID3.y
            mstore(add(_vk, 0x600), 0x267d76952727565408367a397f933ed86ffb455430347dafe9752d1932de2f98) // vk.ID4.x
            mstore(add(_vk, 0x620), 0x168b0840db1e3f9695c394204bcf0d5f12d9681db10185677ad437d657e6b72b) // vk.ID4.y
            mstore(add(_vk, 0x640), 0x00) // vk.contains_recursive_proof
            mstore(add(_vk, 0x660), 0) // vk.recursive_proof_public_input_indices
            mstore(add(_vk, 0x680), 0x260e01b251f6f1c7e7ff4e580791dee8ea51d87a358e038b4efe30fac09383c1) // vk.g2_x.X.c1 
            mstore(add(_vk, 0x6a0), 0x0118c4d5b837bcc2bc89b5b398b5974e9f5944073b32078b7e231fec938883b0) // vk.g2_x.X.c0 
            mstore(add(_vk, 0x6c0), 0x04fc6369f7110fe3d25156c1bb9a72859cf2a04641f99ba4ee413c80da6a5fe4) // vk.g2_x.Y.c1 
            mstore(add(_vk, 0x6e0), 0x22febda3c0c0632a56475b4214e5615e11e6dd3f96e6cea2854a87d4dacc5e55) // vk.g2_x.Y.c0 
            mstore(_omegaInverseLoc, 0x1af864d211b88d9ccf2e371c2ba088d9269d3fdea04e05acb6f70f8dc79e0e57) // vk.work_root_inverse
        }
    }
}
