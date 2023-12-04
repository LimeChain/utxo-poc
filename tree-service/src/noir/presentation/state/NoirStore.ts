// @ts-ignore
import { Noir } from '@noir-lang/noir_js';
import { CompiledProgram } from '@noir-lang/noir_wasm';
import NoirUseCases from '../../use-cases/NoirUseCases';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import NullifierNode from '../../../nullifier/entities/NullifierNode';
import UtxoStore from '../../../utxo/presentation/state/UtxoStore';
import NullifierStore from '../../../nullifier/presentation/state/NullifierStore';

const NAME_UTXO_SIGNATURE = 'utxo_signature';
const NAME_UTXO_OWNERSHIP = 'utxo_ownership';
const NAME_UTXO_INPUTS = 'utxo_inputs';
const NAME_UTXO_OUTPUTS = 'utxo_outputs';
const NAME_LOW_NULLIFIER = 'low_nullifier';
const NAMES = [
    NAME_UTXO_SIGNATURE,
    NAME_UTXO_OWNERSHIP,
    NAME_UTXO_INPUTS,
    NAME_UTXO_OUTPUTS,
    NAME_LOW_NULLIFIER
];

export default class NoirStore {

    utxoStore: UtxoStore;
    nullifierStore: NullifierStore;
    noirUseCases: NoirUseCases;

    programs: Map<string, CompiledProgram> = new Map();
    backends: Map<string, BarretenbergBackend> = new Map();
    noirs: Map<string, Noir> = new Map();

    constructor(utxoStore: UtxoStore, nullifierStore: NullifierStore, noirUseCases: NoirUseCases) {
        this.utxoStore = utxoStore;
        this.nullifierStore = nullifierStore;
        this.noirUseCases = noirUseCases;
    }

    async init(): Promise<void> {
        await this.loadCircuits();
        await this.loadBackends();
        await this.loadNoirs();
    }

    getProgram(name: string): CompiledProgram {
        return this.programs.get(name)!;
    }

    getBackend(name: string): BarretenbergBackend {
        return this.backends.get(name)!;
    }

    getNoir(name: string): Noir {
        return this.noirs.get(name)!;
    }

    async loadCircuits(): Promise<void> {
        for (let i = 0; i < NAMES.length; ++i) {
            this.programs.set(NAMES[i], await this.noirUseCases.getCircuit(NAMES[i]));
        }
    }

    async loadBackends(): Promise<void> {
        for (let i = 0; i < NAMES.length; ++i) {
            this.backends.set(NAMES[i], await this.noirUseCases.getBackend(this.getProgram(NAMES[i])));
        }
    }

    async loadNoirs(): Promise<void> {
        for (let i = 0; i < NAMES.length; ++i) {
            this.noirs.set(NAMES[i], await this.noirUseCases.getNoir(this.getProgram(NAMES[i]), this.getBackend(NAMES[i])));
        }
    }

    async executeCircuits(utxoTransaction: UtxoTransaction): Promise<void> {
        const inputNullifierNode = NullifierNode.newInstance(utxoTransaction.inputs[0].hash);
        const lowNullifierNode = this.nullifierStore.nullifierTree.getLowNullifier(inputNullifierNode);

        console.log("        utxo-signature");
        const utxoSignatureIntermediateProofArtifacts = await this.utxoStore.generateUtxoSignatureArtifacts(utxoTransaction, this.getBackend(NAME_UTXO_SIGNATURE), this.getNoir(NAME_UTXO_SIGNATURE));
        // console.log(utxoSignatureIntermediateProofArtifacts);

        console.log("        utxo-ownership");
        const utxoOwnershipIntermediateProofArtifacts = await this.utxoStore.generateUtxoOwnershipArtifacts(utxoTransaction, this.getBackend(NAME_UTXO_OWNERSHIP), this.getNoir(NAME_UTXO_OWNERSHIP));
        // console.log(utxoOwnershipIntermediateProofArtifacts);

        console.log("        utxo-inputs");
        const utxoInputsIntermediateProofArtifacts = await this.utxoStore.generateUtxoInputsArtifacts(utxoTransaction, this.getBackend(NAME_UTXO_INPUTS), this.getNoir(NAME_UTXO_INPUTS));
        // console.log(utxoInputsIntermediateProofArtifacts);

        console.log("        utxo-outputs");
        const utxoOutputsIntermediateProofArtifacts = await this.utxoStore.generateUtxoOutputsArtifacts(utxoTransaction, this.getBackend(NAME_UTXO_OUTPUTS), this.getNoir(NAME_UTXO_OUTPUTS));
        // console.log(utxoOutputsIntermediateProofArtifacts);

        console.log("        low-nullifier");
        const utxoLowNullifierIntermediateProofArtifacts = await this.nullifierStore.generateLowNullifierArtifacts(lowNullifierNode, utxoTransaction, this.getBackend(NAME_LOW_NULLIFIER), this.getNoir(NAME_LOW_NULLIFIER));
        // console.log(utxoLowNullifierIntermediateProofArtifacts);

    }

}
