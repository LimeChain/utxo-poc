// @ts-ignore
import { expect } from 'chai';
import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { BackendInstances, Circuits, Noirs } from '../types';
import { ethers } from 'hardhat';
import { compile } from '@noir-lang/noir_wasm';
import path from 'path';
import { ProofData } from '@noir-lang/types';

const getCircuit = async (name: string) => {
    const compiled = await compile(path.resolve("circuits", "crates", name, "src", `main.nr`));
    return compiled
}

const getArtifactsPath = (name: string) => {
    return path.join("circuits", "contract", name, "plonk_vk.sol:UltraVerifier")
}

describe('It compiles noir program code, receiving circuit bytes and abi object.', () => {
    let circuits: Circuits;
    let backends: BackendInstances;
    let noirs: Noirs;

    before(async () => {
        circuits = {
            utxo_signature: await getCircuit("utxo-signature"),
            utxo_ownership: await getCircuit("utxo-ownership"),
            utxo_inputs: await getCircuit("utxo-inputs"),
            utxo_outputs: await getCircuit("utxo-outputs"),
            low_nullifier: await getCircuit("low-nullifier"),
        }
        backends = {
            utxo_signature: new BarretenbergBackend(circuits.utxo_signature, { threads: 8 }),
            utxo_ownership: new BarretenbergBackend(circuits.utxo_ownership, { threads: 8 }),
            utxo_inputs: new BarretenbergBackend(circuits.utxo_inputs, { threads: 8 }),
            utxo_outputs: new BarretenbergBackend(circuits.utxo_outputs, { threads: 8 }),
            low_nullifier: new BarretenbergBackend(circuits.low_nullifier, { threads: 8 })
        }
        noirs = {
            utxo_signature: new Noir(circuits.utxo_signature, backends.utxo_signature),
            utxo_ownership: new Noir(circuits.utxo_ownership, backends.utxo_ownership),
            utxo_inputs: new Noir(circuits.utxo_inputs, backends.utxo_inputs),
            utxo_outputs: new Noir(circuits.utxo_outputs, backends.utxo_outputs),
            low_nullifier: new Noir(circuits.low_nullifier, backends.low_nullifier),
        }
    })


    after(async () => {
        await backends.utxo_signature.destroy();
        await backends.utxo_ownership.destroy();
        await backends.utxo_inputs.destroy();
        await backends.utxo_outputs.destroy();
        await backends.low_nullifier.destroy();
    })

    describe("Normal flow", async () => {
        let finalProof: ProofData;

        describe("Proof generation", async () => {
            it('Should generate a final proof', async () => {
                const utxo_signature = await noirs.utxo_signature.generateFinalProof(mainInput)
                expect(utxo_signature.proof instanceof Uint8Array).to.be.true;
            });
        })

        describe("Proof verification", async () => {
            let verifierContract: ethers.Contract;

            before(async () => {
                const verifierContractFactory = await ethers.getContractFactory(getArtifactsPath("aggregator"));
                verifierContract = await verifierContractFactory.deploy();
            });

            it('Should verify off-chain', async () => {
                const verified = await noirs.main.verifyFinalProof(finalProof);
                expect(verified).to.be.true;
            });

            it("Should verify on-chain", async () => {
                const { proof, publicInputs } = finalProof;
                const verified = await verifierContract.verify(proof, publicInputs);
                expect(verified).to.be.true;
            })
        })
    })

    describe("Recursive flow", async () => {
        let circuits: Circuits;
        let backends: BackendInstances;
        let noirs: Noirs;

        let recursiveInputs: any;
        let recursiveProof: ProofData;

        before(async () => {
            circuits = {
                utxo_signature: await getCircuit("utxo-signature"),
                utxo_ownership: await getCircuit("utxo-ownership"),
                utxo_inputs: await getCircuit("utxo-inputs"),
                utxo_outputs: await getCircuit("utxo-outputs"),
                low_nullifier: await getCircuit("low-nullifier"),
            }
            backends = {
                utxo_signature: new BarretenbergBackend(circuits.utxo_signature, { threads: 8 }),
                utxo_ownership: new BarretenbergBackend(circuits.utxo_ownership, { threads: 8 }),
                utxo_inputs: new BarretenbergBackend(circuits.utxo_inputs, { threads: 8 }),
                utxo_outputs: new BarretenbergBackend(circuits.utxo_outputs, { threads: 8 }),
                low_nullifier: new BarretenbergBackend(circuits.low_nullifier, { threads: 8 })
            }
            noirs = {
                utxo_signature: new Noir(circuits.utxo_signature, backends.utxo_signature),
                utxo_ownership: new Noir(circuits.utxo_ownership, backends.utxo_ownership),
                utxo_inputs: new Noir(circuits.utxo_inputs, backends.utxo_inputs),
                utxo_outputs: new Noir(circuits.utxo_outputs, backends.utxo_outputs),
                low_nullifier: new Noir(circuits.low_nullifier, backends.low_nullifier),
            }
        })


        after(async () => {
            await backends.utxo_signature.destroy();
            await backends.utxo_ownership.destroy();
            await backends.utxo_inputs.destroy();
            await backends.utxo_outputs.destroy();
            await backends.low_nullifier.destroy();
        })


        describe("Proof generation", async () => {
            it('Should generate an intermediate proof', async () => {

                const { witness, returnValue } = await noirs.utxo_signature.execute(mainInput);

                const { proof_utxo_signature, publicInputs_utxo_signature } = await backends.utxo_signature.generateIntermediateProof(witness);
                const { proof_utxo_ownership, publicInputs_utxo_ownership } = await backends.utxo_signature.generateIntermediateProof(witness);
                const { proof_utxo_inputs, publicInputs_utxo_inputs } = await backends.utxo_signature.generateIntermediateProof(witness);
                const { proof_utxo_outputs, publicInputs_utxo_outputs } = await backends.utxo_signature.generateIntermediateProof(witness);
                const { proof_low_nullifier, publicInputs_low_nullifier } = await backends.utxo_signature.generateIntermediateProof(witness);

                expect(proof_utxo_signature instanceof Uint8Array).to.be.true;
                expect(proof_utxo_ownership instanceof Uint8Array).to.be.true;
                expect(proof_utxo_inputs instanceof Uint8Array).to.be.true;
                expect(proof_utxo_outputs instanceof Uint8Array).to.be.true;
                expect(proof_low_nullifier instanceof Uint8Array).to.be.true;

                const verified1 = await backends.utxo_signature.verifyIntermediateProof({ proof_utxo_signature, publicInputs_utxo_signature });
                expect(verified1).to.be.true;
                const verified2 = await backends.utxo_ownership.verifyIntermediateProof({ proof_utxo_ownership, publicInputs_utxo_ownership });
                expect(verified2).to.be.true;
                const verified3 = await backends.utxo_inputs.verifyIntermediateProof({ proof_utxo_inputs, publicInputs_utxo_inputs });
                expect(verified3).to.be.true;
                const verified4 = await backends.utxo_outputs.verifyIntermediateProof({ proof_utxo_outputs, publicInputs_utxo_outputs });
                expect(verified4).to.be.true;
                const verified5 = await backends.low_nullifier.verifyIntermediateProof({ proof_low_nullifier, publicInputs_low_nullifier });
                expect(verified5).to.be.true;


                const { utxo_signature_proofAsFields, utxo_signature_vkAsFields, utxo_signature_vkHash } = await backends.utxo_signature.generateIntermediateProofArtifacts(
                    { publicInputs_utxo_signature, proof_utxo_signature },
                    0, // numPublicInputs
                );                
                expect(utxo_signature_vkAsFields).to.be.of.length(114);
                expect(utxo_signature_vkHash).to.be.a('string');


                const { utxo_ownership_proofAsFields, utxo_ownership_vkAsFields, utxo_ownership_vkHash } = await backends.utxo_ownership.generateIntermediateProofArtifacts(
                    { publicInputs_utxo_ownership, proof_utxo_ownership },
                    0, // numPublicInputs,
                );
                expect(utxo_ownership_vkAsFields).to.be.of.length(114);
                expect(utxo_ownership_vkHash).to.be.a('string');

                const { utxo_inputs_proofAsFields, utxo_inputs_vkAsFields, utxo_inputs_vkHash } = await backends.utxo_inputs.generateIntermediateProofArtifacts(
                    { publicInputs_utxo_inputs, proof_utxo_inputs },
                    0, // numPublicInputs,
                );
                expect(utxo_inputs_vkAsFields).to.be.of.length(114);
                expect(utxo_inputs_vkHash).to.be.a('string');

                const { utxo_outputs_proofAsFields, utxo_outputs_vkAsFields, utxo_outputs_vkHash } = await backends.utxo_outputs.generateIntermediateProofArtifacts(
                    { publicInputs_utxo_outputs, proof_utxo_outputs },
                    1, // numPublicInputs,
                );
                expect(utxo_outputs_vkAsFields).to.be.of.length(114);
                expect(utxo_outputs_vkHash).to.be.a('string');

                const { low_nullifier_proofAsFields, low_nullifier_vkAsFields, low_nullifier_vkHash } = await backends.low_nullifier.generateIntermediateProofArtifacts(
                    { publicInputs_low_nullifier, proof_low_nullifier },
                    1, // numPublicInputs,
                );
                expect(low_nullifier_vkAsFields).to.be.of.length(114);
                expect(low_nullifier_vkHash).to.be.a('string');

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

            it("Should generate a final proof with a recursive input", async () => {
                recursiveProof = await noirs.recursive.generateFinalProof(recursiveInputs)
                expect(recursiveProof.proof instanceof Uint8Array).to.be.true;
            })
        });

        describe("Proof verification", async () => {
            let verifierContract: ethers.Contract;

            before(async () => {
                const verifierContractFactory = await ethers.getContractFactory(getArtifactsPath("recursion"));
                verifierContract = await verifierContractFactory.deploy();

                const verifierAddr = await verifierContract.deployed();
            });

            it('Should verify off-chain', async () => {
                const verified = await noirs.recursive.verifyFinalProof(recursiveProof);
                expect(verified).to.be.true;
            });

            it("Should verify on-chain", async () => {
                const verified = await verifierContract.verify(recursiveProof.proof, recursiveProof.publicInputs);
                expect(verified).to.be.true;
            })
        })
    })
});