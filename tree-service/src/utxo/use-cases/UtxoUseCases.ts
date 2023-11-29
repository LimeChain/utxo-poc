import UtxoTransaction from '../entities/UtxoTransaction';
import NoirSerializerRepo from './repos/NoirSerializerRepo';

export default class UtxoUseCases {

    noirSerializerRepo: NoirSerializerRepo;

    constructor(noirSerializerRepo: NoirSerializerRepo) {
        this.noirSerializerRepo = noirSerializerRepo;
    }

    writeUtxoSignature(utxoTransaction: UtxoTransaction): Promise<void> {
        return this.noirSerializerRepo.writeUtxoSignature(utxoTransaction);
    }

}
