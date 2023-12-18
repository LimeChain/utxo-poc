// @ts-ignore
import { expect } from 'chai';
import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';

import path from 'path';
import { ProofData, CompiledCircuit } from '@noir-lang/types';

import dkim_circuit from "../circuits/target/dkim.json"

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
    let backends;
    let noirs;

    before(async () => {
        backends = {
            dkim: new BarretenbergBackend(dkim_circuit as unknown as CompiledCircuit, { threads: 8 }),
        }
        noirs = {
            dkim: new Noir(dkim_circuit as unknown as CompiledCircuit, backends.dkim),
        }
    })


    after(async () => {
        await backends.dkim.destroy();
    })


    it('Should generate an intermediate proof', async () => {

        const dkim_proof_data = loadProofData('dkim');
        const {proofAsFields: dkim_proofAsFields, vkAsFields: dkim_vkAsFields, vkHash: dkim_vkHash } = await backends.dkim.generateIntermediateProofArtifacts(
            dkim_proof_data,
            0, // numPublicInputs
        );
        expect(dkim_vkAsFields).to.be.of.length(114);
        expect(dkim_vkHash).to.be.a('string');

        console.log(dkim_vkAsFields)
        console.log(dkim_vkHash)

    });
})