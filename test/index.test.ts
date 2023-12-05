// @ts-ignore
import { expect } from 'chai';
import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { BackendInstances, Circuits, Noirs } from '../types';
import { ethers } from 'hardhat';

import path from 'path';
import { ProofData, CompiledCircuit } from '@noir-lang/types';

import utxo_signature_circuit from "../circuits/target/utxo_signature.json"
import utxo_ownership_circuit from "../circuits/target/utxo_ownership.json"
import utxo_inputs_circuit from "../circuits/target/utxo_inputs.json"
import utxo_outputs_circuit from "../circuits/target/utxo_outputs.json"
import low_nullifier_circuit from "../circuits/target/low_nullifier.json"
import aggregator_circuit from "../circuits/target/aggregator.json"

import * as fs from 'fs';

const getArtifactsPath = (name: string) => {
    return path.join("circuits", "contract", name, "plonk_vk.sol:UltraVerifier")
}

const loadProofData = (name: string): ProofData => {
    // Read the file as a Buffer to get the hex data
    const hexData = fs.readFileSync(path.join("circuits", "proofs", `${name}.proof`));

    // Convert the hex data to a string
    const bytes = Uint8Array.from(Buffer.from(hexData.toString(), 'hex'));
    console.log(bytes.length)
    // Parse the JSON string into ProofData type
    return {
        publicInputs: [],
        proof: bytes
    };
}

describe("Recursive flow", async () => {
    let backends: BackendInstances;
    let noirs: Noirs;
    let verifierContract: ethers.Contract;

    let recursiveInputs: any;
    let recursiveProof: ProofData;

    before(async () => {
        backends = {
            utxo_signature: new BarretenbergBackend(utxo_signature_circuit as unknown as CompiledCircuit, { threads: 8 }),
            utxo_ownership: new BarretenbergBackend(utxo_ownership_circuit as unknown as CompiledCircuit, { threads: 8 }),
            utxo_inputs: new BarretenbergBackend(utxo_inputs_circuit as unknown as CompiledCircuit, { threads: 8 }),
            utxo_outputs: new BarretenbergBackend(utxo_outputs_circuit as unknown as CompiledCircuit, { threads: 8 }),
            low_nullifier: new BarretenbergBackend(low_nullifier_circuit as unknown as CompiledCircuit, { threads: 8 }),
            aggregator: new BarretenbergBackend(aggregator_circuit as unknown as CompiledCircuit, { threads: 8 })
        }
        noirs = {
            utxo_signature: new Noir(utxo_signature_circuit as unknown as CompiledCircuit, backends.utxo_signature),
            utxo_ownership: new Noir(utxo_ownership_circuit as unknown as CompiledCircuit, backends.utxo_ownership),
            utxo_inputs: new Noir(utxo_inputs_circuit as unknown as CompiledCircuit, backends.utxo_inputs),
            utxo_outputs: new Noir(utxo_outputs_circuit as unknown as CompiledCircuit, backends.utxo_outputs),
            low_nullifier: new Noir(low_nullifier_circuit as unknown as CompiledCircuit, backends.low_nullifier),
            aggregator: new Noir(aggregator_circuit as unknown as CompiledCircuit, backends.aggregator),
        }

        const verifierContractFactory = await ethers.getContractFactory(getArtifactsPath("aggregator"));
        verifierContract = await verifierContractFactory.deploy();

        const verifierAddr = await verifierContract.waitForDeployment();
    })


    after(async () => {
        await backends.utxo_signature.destroy();
        await backends.utxo_ownership.destroy();
        await backends.utxo_inputs.destroy();
        await backends.utxo_outputs.destroy();
        await backends.low_nullifier.destroy();
    })


    it('Should generate an intermediate proof', async () => {

        const utxo_signature_proof_data = loadProofData('utxo_signature');
        const utxo_ownership_proof_data = loadProofData('utxo_ownership');
        const utxo_inputs_proof_data = loadProofData('utxo_inputs');
        const utxo_outputs_proof_data = loadProofData('utxo_outputs');
        const low_nullifier_proof_data = loadProofData('low_nullifier');

        const {proofAsFields: utxo_signature_proofAsFields, vkAsFields: utxo_signature_vkAsFields, vkHash: utxo_signature_vkHash } = await backends.utxo_signature.generateIntermediateProofArtifacts(
            utxo_signature_proof_data,
            0, // numPublicInputs
        );
        expect(utxo_signature_vkAsFields).to.be.of.length(114);
        expect(utxo_signature_vkHash).to.be.a('string');


        console.log(utxo_signature_vkAsFields)
        console.log(utxo_signature_vkHash)

        const { proofAsFields: utxo_ownership_proofAsFields, vkAsFields: utxo_ownership_vkAsFields, vkHash: utxo_ownership_vkHash } = await backends.utxo_ownership.generateIntermediateProofArtifacts(
            utxo_ownership_proof_data,
            0, // numPublicInputs,
        );
        expect(utxo_ownership_vkAsFields).to.be.of.length(114);
        expect(utxo_ownership_vkHash).to.be.a('string');

        console.log(utxo_ownership_vkAsFields)
        console.log(utxo_ownership_vkHash)

        const { proofAsFields: utxo_inputs_proofAsFields, vkAsFields: utxo_inputs_vkAsFields,vkHash: utxo_inputs_vkHash } = await backends.utxo_inputs.generateIntermediateProofArtifacts(
            utxo_inputs_proof_data,
            0, // numPublicInputs,
        );
        expect(utxo_inputs_vkAsFields).to.be.of.length(114);
        expect(utxo_inputs_vkHash).to.be.a('string');

        console.log(utxo_inputs_vkAsFields)
        console.log(utxo_inputs_vkHash)

        const { proofAsFields: utxo_outputs_proofAsFields, vkAsFields: utxo_outputs_vkAsFields, vkHash: utxo_outputs_vkHash } = await backends.utxo_outputs.generateIntermediateProofArtifacts(
            utxo_outputs_proof_data,
            0, // numPublicInputs,
        );
        expect(utxo_outputs_vkAsFields).to.be.of.length(114);
        expect(utxo_outputs_vkHash).to.be.a('string');

        console.log(utxo_outputs_vkAsFields)
        console.log(utxo_outputs_vkHash)

        const { proofAsFields: low_nullifier_proofAsFields, vkAsFields: low_nullifier_vkAsFields, vkHash: low_nullifier_vkHash } = await backends.low_nullifier.generateIntermediateProofArtifacts(
            low_nullifier_proof_data,
            0, // numPublicInputs,
        );
        expect(low_nullifier_vkAsFields).to.be.of.length(114);
        expect(low_nullifier_vkHash).to.be.a('string');

        console.log(low_nullifier_vkAsFields)
        console.log(low_nullifier_vkHash)

        const aggregationObject = Array(16).fill(
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        );

        recursiveInputs = {
            verification_key_utxo_signature: utxo_signature_vkAsFields,
            verification_key_utxo_ownership: utxo_ownership_vkAsFields,
            verification_key_utxo_inputs: utxo_inputs_vkAsFields,
            verification_key_utxo_outputs: utxo_outputs_vkAsFields,
            verification_key_low_nullifier: low_nullifier_vkAsFields,

            proof_utxo_signature: utxo_signature_proofAsFields,
            proof_utxo_ownership: utxo_ownership_proofAsFields,
            proof_utxo_inputs: utxo_inputs_proofAsFields,
            proof_utxo_outputs: utxo_outputs_proofAsFields,
            proof_low_nullifier: low_nullifier_proofAsFields,

            public_inputs_utxo_signature: [],
            public_inputs_utxo_ownership: [],
            public_inputs_utxo_inputs: [],
            public_inputs_utxo_outputs: [],
            public_inputs_low_nullifier: [],

            key_hash_utxo_signature: utxo_signature_vkHash,
            key_hash_utxo_ownership: utxo_ownership_vkHash,
            key_hash_utxo_inputs: utxo_inputs_vkHash,
            key_hash_utxo_outputs: utxo_outputs_vkHash,
            key_hash_low_nullifier: low_nullifier_vkHash,

            input_aggregation_object: aggregationObject,
        }

    });

    // it("Should generate a final proof with a recursive input", async () => {
    //     recursiveProof = await noirs.aggregator.generateFinalProof(recursiveInputs)
    //     expect(recursiveProof.proof instanceof Uint8Array).to.be.true;
    // })

    // it('Should verify off-chain', async () => {
    //     const verified = await noirs.aggregator.verifyFinalProof(recursiveProof);
    //     expect(verified).to.be.true;
    // });

    // it("Should verify on-chain", async () => {
    //     const verified = await verifierContract.verify(recursiveProof.proof, recursiveProof.publicInputs);
    //     expect(verified).to.be.true;
    // })
})