import Fs from 'fs';
import Path from 'path';

import NoirSerialializerRepo from '../../use-cases/repos/NoirSerialializerRepo';
import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import SignedTransaction from '../../../utxo/data/dto/SignedTransaction';
import MerkleTreePath from '../../../utxo/data/dto/MerkleTreePath';
import { NullifierTree } from '../../entities/NullifierTree';
import NullifierNode from '../../entities/NullifierNode';
import LowNullifier from '../dto/LowNullifier';

export default class NoirSerializerRepoImpl implements NoirSerialializerRepo {

    async writeLowNullifier(nullifierTree: NullifierTree, utxoTransaction: UtxoTransaction): Promise<void> {
        const signedTransaction = SignedTransaction.fromUtxoTransaction(utxoTransaction);
        const lowNullifierNode = nullifierTree.getLowNullifier(NullifierNode.newInstance(utxoTransaction.inputs[0].hash));
        const merkleTreePath = MerkleTreePath.fromMerkleTreeData(nullifierTree.merkleTree, [lowNullifierNode]);
        const lowNullifier = LowNullifier.fromNullifierNode(lowNullifierNode);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/low-nullifier/Prover.toml');

            const buffer = [
                merkleTreePath.toToml(),
                '\n',
                lowNullifier.toToml('low_nullifier_leaf'),
                '\n',
                signedTransaction.toToml('signed_transaction')
            ]

            Fs.writeFile(storagePath, buffer.join('\n'), (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

}
