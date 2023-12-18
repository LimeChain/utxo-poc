
import { Noir, abi } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { CompiledCircuit, ProofData } from "@noir-lang/types"


export type Circuits = {
  dkim: CompiledCircuit,
  utxo_signature: CompiledCircuit,
  utxo_ownership: CompiledCircuit
  utxo_inputs: CompiledCircuit
  utxo_outputs: CompiledCircuit
  low_nullifier: CompiledCircuit
}

export type BackendInstances = {
    dkim: BarretenbergBackend,
    utxo_signature: BarretenbergBackend,
    utxo_ownership: BarretenbergBackend
    utxo_inputs: BarretenbergBackend
    utxo_outputs: BarretenbergBackend
    low_nullifier: BarretenbergBackend
    aggregator: BarretenbergBackend
}

export type Noirs = {
    dkim: Noir,
    utxo_signature: Noir,
    utxo_ownership: Noir
    utxo_inputs: Noir
    utxo_outputs: Noir
    low_nullifier: Noir
    aggregator: Noir
}

export interface ProofArtifacts extends ProofData {
  returnValue: Uint8Array,
  proofAsFields: string[],
  vkAsFields: string[],
  vkHash: string
}