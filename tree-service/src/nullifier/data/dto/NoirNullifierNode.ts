import NullifierNode from '../../entities/NullifierNode';

export default class NoirNullifierNode {

    nextIdx: number = 0;
    nextVal: number[] = [];
    val: number[] = [];

    static fromNullifierNode(nullifierNode: NullifierNode) {
        const dto = new NoirNullifierNode();

        dto.nextIdx = nullifierNode.nextIndex;
        dto.nextVal = Array.from(nullifierNode.getNextValueAsUint8Array());
        dto.val = Array.from(nullifierNode.getValueAsUint8Array());

        return dto;
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
