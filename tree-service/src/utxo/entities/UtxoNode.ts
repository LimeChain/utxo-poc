import createKeccakHash from 'keccak';

export class UtxoNode {

    hash: string = '';
    value: bigint = 0n;
    pubKey: string = '';
    spent: boolean = false;

    static newUnspentUtxoNode(): UtxoNode {
        const utxoNode = new UtxoNode();
        utxoNode.spent = false;
        return utxoNode;
    }

    invalidateHash(): void {
        const json = JSON.stringify(this, (key, value) => {
            return typeof (value) === 'bigint' ? value.toString() : value;
        });
        this.hash = createKeccakHash('keccak256').update(json).digest('hex');
    }

    isSpent(): boolean {
        return this.spent;
    }

    spend(): void {
        this.spent = true;
    }

}
