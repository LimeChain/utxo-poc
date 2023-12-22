import Path from 'path';
import FS from 'fs';
import { BarretenbergBackend, ProofData } from '@noir-lang/backend_barretenberg';
//@ts-ignore
import { InputMap, Noir } from '@noir-lang/noir_js';
import { Artifacts } from '../entities/Artifacts';

export default class NoirArtifacts {

    static async generateArtifacts(backend: BarretenbergBackend, noir: Noir, params: InputMap, name: string): Promise<Artifacts> {
        console.log('executing...');
        const executionResult = await noir.execute(params);
        console.log('proof...');
        // const intermediateProof = await backend.generateIntermediateProof(executionResult.witness);
        // NoirArtifacts.saveProofWithoutPublicInputs(intermediateProof);
        console.log('artifacts...')
        const intermediateProof = NoirArtifacts.loadProofWithoutPublicInputs(name);
        return backend.generateIntermediateProofArtifacts(intermediateProof, intermediateProof.publicInputs.size);
    }

    static loadProofWithoutPublicInputs(name: string): ProofData {
        const proofHex = FS.readFileSync(Path.resolve(`../foundry/circuits/proofs/${name}.proof`)).toString();
        const proofAsUint8Array = new Uint8Array(proofHex.length >> 1);
        for (let i = 0; i < proofHex.length; i += 2) {
            proofAsUint8Array[i >> 1] = (parseInt(proofHex[i], 16) << 4) | parseInt(proofHex[i + 1], 16);
        }

        return {
            proof: proofAsUint8Array,
            publicInputs: new Map(),
        }
    }

    static saveProofWithoutPublicInputs(intermediateProof: ProofData, name: string) {
        let proofHex = '';
        for (let i = 0; i < intermediateProof.proof.length; ++i) {
            proofHex += ((intermediateProof.proof[i] >> 4) & 0xf).toString(16);
            proofHex += (intermediateProof.proof[i] & 0xf).toString(16);
        }

        FS.writeFileSync(Path.resolve(`../foundry/circuits/proofs/${name}.proof`), proofHex);
    }

}
