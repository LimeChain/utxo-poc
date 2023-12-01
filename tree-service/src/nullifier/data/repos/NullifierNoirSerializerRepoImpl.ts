import Fs from 'fs';
import Path from 'path';

import NullifierNoirSerializerRepo from '../../use-cases/repos/NullifierNoirSerializerRepo';
import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import NoirSignedTransaction from '../../../utxo/data/dto/NoirSignedTransaction';
import NullifierNode from '../../entities/NullifierNode';
import NoirNullifierNode from '../dto/NoirNullifierNode';
import NoirMerkleTreePath from '../../../merkle-tree/data/dto/NoirMerkleTreePath';
import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';

export default class NullifierNoirSerializerRepoImpl implements NullifierNoirSerializerRepo {

    async writeLowNullifier(merkleTree: MerkleTree<MerkleTreeNode>, lowNullifierNode: NullifierNode, utxoTransaction: UtxoTransaction): Promise<void> {
        const noirSignedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);
        const noirMerkleTreePath = NoirMerkleTreePath.fromMerkleTreeData(merkleTree, [lowNullifierNode]);
        const noirNullifierNode = NoirNullifierNode.fromNullifierNode(lowNullifierNode);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/low-nullifier/Prover.toml');

            const buffer = [
                noirMerkleTreePath.toToml(),
                '\n',
                noirNullifierNode.toToml('low_nullifier_leaf'),
                '\n',
                noirSignedTransaction.toToml('signed_transaction')
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
