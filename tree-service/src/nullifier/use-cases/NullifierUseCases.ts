import UtxoTransaction from '../../utxo/entities/UtxoTransaction';
import { NullifierTree } from '../entities/NullifierTree';
import NoirSerialializerRepo from './repos/NoirSerialializerRepo';

export default class NullifierUseCases {

    noirSerialializerRepo: NoirSerialializerRepo;

    constructor(noirSerialializerRepo: NoirSerialializerRepo) {
        this.noirSerialializerRepo = noirSerialializerRepo;
    }

    writeLowNullifier(nullifierTree: NullifierTree, utxoTransaction: UtxoTransaction): Promise<void> {
        return this.noirSerialializerRepo.writeLowNullifier(nullifierTree, utxoTransaction);
    }

}
