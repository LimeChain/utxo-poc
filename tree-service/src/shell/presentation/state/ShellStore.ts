import ShellUseCases from '../../use-cases/ShellUseCases';

export default class ShellStore {

    shellUseCases: ShellUseCases;

    constructor(shellUseCases: ShellUseCases) {
        this.shellUseCases = shellUseCases;
    }

    async executeCircuits() {
        await this.shellUseCases.executeUtxoSignature();
        await this.shellUseCases.executeUtxoOwnership();
        await this.shellUseCases.executeUtxoInputs();
        await this.shellUseCases.executeUtxoOutputs();
        await this.shellUseCases.executeUtxoLowNullifier();
    }

}
