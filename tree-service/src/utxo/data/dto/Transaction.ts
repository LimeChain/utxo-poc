import { JsonMap } from '@iarna/toml';
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

    toJsonMap(): JsonMap {
        return {
            'inputs': this.inputs.toJsonMap(),
            'outputs': this.outputs.map((j) => j.toJsonMap())
        }
    }

}
