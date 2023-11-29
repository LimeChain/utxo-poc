import Fs from 'fs';
import Path from 'path';

import UtxoTransaction from '../../entities/UtxoTransaction';
import NoirSerializerRepo from '../../use-cases/repos/NoirSerializerRepo';
import SignedTransaction from '../dto/SignedTransaction';
import TOML from '@iarna/toml';

export default class NoirSerializerRepoImpl implements NoirSerializerRepo {

    async writeUtxoSignature(utxoTransaction: UtxoTransaction): Promise<void> {
        const signedTransaction = SignedTransaction.fromUtxoTransaction(utxoTransaction);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/utxo-signature/Prover.toml');

            Fs.writeFile(storagePath, TOML.stringify(signedTransaction.toJsonMap()), (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
            resolve();
        });
    }

}
