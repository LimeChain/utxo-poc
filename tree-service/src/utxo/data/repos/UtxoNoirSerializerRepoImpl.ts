import Fs from 'fs';
import Path from 'path';

import UtxoTransaction from '../../entities/UtxoTransaction';
import UtxoNoirSerializerRepo from '../../use-cases/repos/UtxoNoirSerializerRepo';
import NoirSignedTransaction from '../dto/NoirSignedTransaction';
import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';
import NoirMerkleTreePath from '../../../merkle-tree/data/dto/NoirMerkleTreePath';

export default class UtxoNoirSerializerRepoImpl implements UtxoNoirSerializerRepo {

    async writeUtxoSignature(utxoTransaction: UtxoTransaction): Promise<void> {
        const noirSignedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/utxo-signature/Prover.toml');

            Fs.writeFile(storagePath, noirSignedTransaction.toToml('signed_transaction'), (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    async writeUtxoOwnership(utxoTransaction: UtxoTransaction): Promise<void> {
        const noirSignedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/utxo-ownership/Prover.toml');

            Fs.writeFile(storagePath, noirSignedTransaction.toToml('signed_transaction'), (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    async writeUtxoInputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void> {
        const noirSignedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);
        const noirMerkleTreePath = NoirMerkleTreePath.fromMerkleTreeData(merkleTree, utxoTransaction.inputs);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/utxo-inputs/Prover.toml');

            const buffer = [
                noirMerkleTreePath.toToml(),
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

    async writeUtxoOutputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void> {
        const signedTransaction = NoirSignedTransaction.fromUtxoTransaction(utxoTransaction);
        const noirMerkleTreePath = NoirMerkleTreePath.fromMerkleTreeData(merkleTree, utxoTransaction.outputs);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/utxo-outputs/Prover.toml');

            const buffer = [
                noirMerkleTreePath.toToml(),
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
