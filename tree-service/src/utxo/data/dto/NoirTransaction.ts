//@ts-ignore
import { InputMap } from '@noir-lang/noir_js';
import UtxoNode from '../../entities/UtxoNode';
import NoirUtxoNode from './NoirUtxoNode';

export default class NoirTransaction {

    inputs: NoirUtxoNode = new NoirUtxoNode();
    outputs: NoirUtxoNode[] = [];

    static fromUtxoNodes(input: UtxoNode, outputs: UtxoNode[]): NoirTransaction {
        const dto = new NoirTransaction();

        dto.inputs = NoirUtxoNode.fromUtxoNode(input);
        dto.outputs = outputs.map((output) => NoirUtxoNode.fromUtxoNode(output));

        return dto;
    }

    toJson(): InputMap {
        return {
            'inputs': [this.inputs.toJson()],
            'outputs': this.outputs.map((o) => o.toJson()),
        } as unknown as InputMap
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
