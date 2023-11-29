import UtxoTransaction from '../../entities/UtxoTransaction';

export default interface NoirSerializerRepo {

    writeUtxoSignature(utxoTransaction: UtxoTransaction): Promise<void>;

}
