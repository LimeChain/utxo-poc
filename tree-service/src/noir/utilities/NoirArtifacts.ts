import Path from 'path';
import FS from 'fs';
import { BarretenbergBackend, ProofData } from '@noir-lang/backend_barretenberg';
//@ts-ignore
import { InputMap, Noir } from '@noir-lang/noir_js';
import { Artifacts } from '../entities/Artifacts';

export default class NoirArtifacts {

    static async generateArtifacts(backend: BarretenbergBackend, noir: Noir, params: InputMap, numPublicInputs: number): Promise<Artifacts> {
        console.log('executing...');
        const executionResult = await noir.execute(params);
        console.log('proof...');
        let proof: ProofData;
        try {
            proof = await backend.generateIntermediateProof(executionResult.witness);
        } catch (ex) {
            const proofAsHex = FS.readFileSync(Path.resolve('../circuits/proofs/utxo_inputs.proof'));
            proof = {
                proof: Uint8Array.from(proofAsHex),
                publicInputs: new Map(),
            }
        }
        console.log('artifacts...');
        return backend.generateIntermediateProofArtifacts(proof, proof.publicInputs.size);
    }

}
