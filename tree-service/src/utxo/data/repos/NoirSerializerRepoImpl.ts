import Fs from 'fs';
import Path from 'path';

import UtxoTransaction from '../../entities/UtxoTransaction';
import NoirSerializerRepo from '../../use-cases/repos/NoirSerializerRepo';
import SignedTransaction from '../dto/SignedTransaction';
import MerkleTreePath from '../dto/MerkleTreePath';
import MerkleTree from '../../../merkle-tree/entities/MerkleTree';
import MerkleTreeNode from '../../../merkle-tree/entities/MerkleTreeNode';

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
        });
    }

    async writeUtxoOwnership(utxoTransaction: UtxoTransaction): Promise<void> {
        const signedTransaction = SignedTransaction.fromUtxoTransaction(utxoTransaction);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/utxo-ownership/Prover.toml');

            Fs.writeFile(storagePath, signedTransaction.toToml('signed_transaction'), (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
    async writeUtxoInputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void> {
        const signedTransaction = SignedTransaction.fromUtxoTransaction(utxoTransaction);
        const merkleTreePath = MerkleTreePath.fromMerkleTreeData(merkleTree, utxoTransaction.inputs);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/utxo-inputs/Prover.toml');

            const buffer = [
                merkleTreePath.toToml(),
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
    async writeUtxoOutputs(merkleTree: MerkleTree<MerkleTreeNode>, utxoTransaction: UtxoTransaction): Promise<void> {
        const signedTransaction = SignedTransaction.fromUtxoTransaction(utxoTransaction);
        const merkleTreePath = MerkleTreePath.fromMerkleTreeData(merkleTree, utxoTransaction.outputs);

        return new Promise((resolve, reject) => {
            const storagePath = Path.join(__dirname, '../../../../../circuits/crates/utxo-outputs/Prover.toml');

            const buffer = [
                merkleTreePath.toToml(),
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
