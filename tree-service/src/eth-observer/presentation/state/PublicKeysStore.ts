import { SigningKey, ethers } from 'ethers';
import RawTransaction from '../../entities/RawTransaction';

export default class PublicKeysStore {

    pubKeyX: Map<string, string> = new Map();
    pubKeyY: Map<string, string> = new Map();

    getPublicKeyX = (address: string): string => {
        return this.pubKeyX.get(address) ?? '';
    }

    getPublicKeyY = (address: string): string => {
        return this.pubKeyY.get(address) ?? "";
    }

    updatePubKeys(rawTransactions: RawTransaction[]) {
        for (let i = 0; i < rawTransactions.length; ++i) {
            const rawTransaction = rawTransactions[i];
            if (rawTransaction.signerAddr === '') {
                continue;
            }

            if (this.pubKeyX.has(rawTransaction.signerAddr) === true) {
                continue;
            }

            const pubKeyUncompressed = SigningKey.recoverPublicKey(rawTransaction.unsignedHash, rawTransaction.signature);
            const pubKey = pubKeyUncompressed.slice(4);

            const recoverAddress = ethers.recoverAddress(rawTransaction.unsignedHash, rawTransaction.signature);
            if (recoverAddress.toLowerCase() != rawTransaction.signerAddr.toLowerCase()) {
                console.log('Error recovering the address. Expected', rawTransaction.signerAddr.toLowerCase(), ' got ', recoverAddress.toLowerCase());
                process.exit(1);
            }

            this.pubKeyX.set(rawTransaction.signerAddr, pubKey.substring(0, 64));
            this.pubKeyY.set(rawTransaction.signerAddr, pubKey.substring(64));
        }
    }

}
