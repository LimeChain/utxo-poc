import ShellRepo from './repos/ShellRepo';

export default class ShellUseCases {

    shellRepo: ShellRepo;

    constructor(shellRepo: ShellRepo) {
        this.shellRepo = shellRepo;
    }

    async executeUtxoSignature() {
        console.log("        utxo-signature");
        await this.shellRepo.exec('cd ../circuits && nargo prove --package utxo_signature');
    }

    async executeUtxoOwnership() {
        console.log("        utxo-ownership");
        await this.shellRepo.exec('cd ../circuits && nargo prove --package utxo_ownership');
    }

    async executeUtxoInputs() {
        console.log("        utxo-inputs");
        await this.shellRepo.exec('cd ../circuits && nargo prove --package utxo_inputs');
    }

    async executeUtxoOutputs() {
        console.log("        utxo-outputs");
        await this.shellRepo.exec('cd ../circuits && nargo prove --package utxo_outputs');
    }

    async executeUtxoLowNullifier() {
        console.log("        low-nullifier");
        await this.shellRepo.exec('cd ../circuits && nargo prove --package low_nullifier');
    }

}
