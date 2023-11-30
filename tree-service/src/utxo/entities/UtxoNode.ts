import HashUtils from '../../core/utilities/HashUtils';
import MerkleTreeNode from '../../merkle-tree/entities/MerkleTreeNode';

let nonce: bigint = 1n;

export default class UtxoNode extends MerkleTreeNode {

    pubKeyX: string = '';
    pubKeyY: string = '';
    addr: string = '';
    value: bigint = 0n;
    erc20Addr: string = '';
    spent: boolean = false;
    nonce: bigint = -1n;

    static newUnspentUtxoNode(pubKeyX: string, pubKeyY: string, addr: string, value: bigint, erc20Addr: string): UtxoNode {
        const utxoNode = new UtxoNode();
        utxoNode.pubKeyX = pubKeyX;
        utxoNode.pubKeyY = pubKeyY;
        utxoNode.addr = addr;
        utxoNode.value = value;
        utxoNode.erc20Addr = erc20Addr;
        utxoNode.spent = false;
        utxoNode.nonce = nonce++;

        utxoNode.hash = utxoNode.createHash();

        return utxoNode;
    }

    getNonce(): number {
        return Number(this.nonce);
    }

    getValueAsUint8Array(): Uint8Array {
        const valueBufferArray = new Uint8Array(32);
        for (let convertedValue = this.value, i = valueBufferArray.length - 1; convertedValue > 0n; convertedValue >>= 8n, --i) {
            valueBufferArray[i] = Number(convertedValue & 0xFFn);
        }

        return valueBufferArray;
    }

    getPubKeyXAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.pubKeyX, 'hex'));
    }

    getPubKeyYAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.pubKeyY, 'hex'));
    }

    getErc20AddrAsUint8Array(): Uint8Array {
        const erc20Addr = this.erc20Addr === '' ? '0'.repeat(40) : this.erc20Addr.substring(2);
        return Buffer.from(erc20Addr, 'hex');
    }

    getNonceAsUint8Array(): Uint8Array {
        const result = new Uint8Array(8);

        for (let i = 0; i < result.length; ++i) {
            const shiftAmount = 56 - (i << 3);
            result[i] = Number((this.nonce >> BigInt(shiftAmount)) & 0xFFn);
        }

        return result;
    }

    createHash(): Buffer {
        return HashUtils.createHash(Buffer.concat([
            Buffer.from(this.getValueAsUint8Array()),
            Buffer.from(this.getPubKeyXAsUint8Array()),
            Buffer.from(this.getPubKeyYAsUint8Array()),
            Buffer.from(this.getErc20AddrAsUint8Array()),
            Buffer.from(this.getNonceAsUint8Array())
        ]));
    }

    isSpent(): boolean {
        return this.spent;
    }

    spend(): void {
        this.spent = true;
    }

}
