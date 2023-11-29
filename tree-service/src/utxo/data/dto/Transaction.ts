import UtxoNode from '../../entities/UtxoNode';
import Output from './Output';

export default class Transaction {

    inputs: Output = new Output();
    outputs: Output[] = [];

    static fromUtxoNodes(input: UtxoNode, outputs: UtxoNode[]): Transaction {
        const transaction = new Transaction();

        transaction.inputs = Output.fromUtxoNode(input);
        transaction.outputs = outputs.map((output) => Output.fromUtxoNode(output));

        return transaction;
    }

    toToml(path: string): string {
        const buffers: string[] = [];

        buffers.push(this.inputs.toToml(path + '.inputs'))
        buffers.push(`\n`);
        this.outputs.forEach((output, i) => {
            buffers.push(output.toToml(path + '.outputs'));
            if (i + 1 != this.outputs.length) {
                buffers.push(`\n`);
            }
        });

        return buffers.join('\n');
    }

}
