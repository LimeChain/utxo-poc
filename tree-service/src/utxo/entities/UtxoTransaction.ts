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

    getPubKeyXAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.pubKeyX, 'hex'));
    }

    getPubKeyYAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.pubKeyY, 'hex'));
    }

    getSignatureAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.signature.r + this.signature.v, 'hex'));
    }

    getHashAsUint8Array(): Uint8Array {
        return Uint8Array.from(Buffer.from(this.txHash.substring(2), 'hex'));
    }

}
