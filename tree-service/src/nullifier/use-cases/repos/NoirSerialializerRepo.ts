import UtxoTransaction from '../../../utxo/entities/UtxoTransaction';
import { NullifierTree } from '../../entities/NullifierTree';

export default interface NoirSerialializerRepo {

    writeLowNullifier(nullifierTree: NullifierTree, utxoTransaction: UtxoTransaction): Promise<void>;

}
