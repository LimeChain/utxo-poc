import NullifierNode from '../../entities/NullifierNode';

export default class LowNullifier {

    nextIdx: number = 0;
    nextVal: number[] = [];
    val: number[] = [];

    static fromNullifierNode(nullifierNode: NullifierNode) {
        const lowNullifier = new LowNullifier();

        lowNullifier.nextIdx = nullifierNode.nextIndex;
        lowNullifier.nextVal = Array.from(nullifierNode.getNextValueAsUint8Array());
        lowNullifier.val = Array.from(nullifierNode.getValueAsUint8Array());

        return lowNullifier;
    }

    toToml(path: string): string {
        const buffers: string[] = [];

        buffers.push(`[[${path}]]`)
        buffers.push(`nextIdx = ${JSON.stringify(this.nextIdx)}`);
        buffers.push(`nextVal = ${JSON.stringify(this.nextVal)}`);
        buffers.push(`val = ${JSON.stringify(this.val)}`);
        buffers.push(`\n`);

        return buffers.join('\n');
    }

}
