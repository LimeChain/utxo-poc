import { Signature } from 'ethers';
import UtxoNode from './UtxoNode';

export default class UtxoTransaction {

    pubKeyX: string = '';
    pubKeyY: string = '';
    signature: Signature;
    txHash: string = '';
    inputs: UtxoNode[] = [];
    outputs: UtxoNode[] = [];

    constructor(pubKeyX: string, pubKeyY: string, signature: Signature, txHash: string) {
        this.pubKeyX = pubKeyX;
        this.pubKeyY = pubKeyY;
        this.signature = signature;
        this.txHash = txHash;
    }

    isSupportedByCircuits(): boolean {
        return this.inputs.length === 1 && this.outputs.length === 2;
    }

    getPubKeyXAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.pubKeyX, 'hex'));
    }

    getPubKeyYAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.pubKeyY, 'hex'));
    }

    getSignatureAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.signature.r.substring(2) + this.signature.s.substring(2), 'hex'));
    }

    getHashAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.txHash.substring(2), 'hex'));
    }

}
