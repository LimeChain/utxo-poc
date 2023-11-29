import Fs from 'fs';
import Path from 'path';

import UtxoTransaction from '../../entities/UtxoTransaction';
import NoirSerializerRepo from '../../use-cases/repos/NoirSerializerRepo';
import SignedTransaction from '../dto/SignedTransaction';

export default class NoirSerializerRepoImpl implements NoirSerializerRepo {

    async writeUtxoSignature(utxoTransaction: UtxoTransaction): Promise<void> {
        const signedTransaction = SignedTransaction.fromUtxoTransaction(utxoTransaction);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/utxo-signature/Prover.toml');

            Fs.writeFile(storagePath, signedTransaction.toToml('signed_transaction'), (err) => {
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
