import { Mongoose } from 'mongoose';
import { createConnection } from '../connections/db-connection';
import PagoRendicionLoteSchema from './pago-rendicion-lote-schema';

let mongoose = null;

const createPagoRendicionLoteModel = async () => {
    if (!mongoose) {
        mongoose = await createConnection(true) as Mongoose;
    }
    return mongoose.model('PagoRendicionLoteModel', PagoRendicionLoteSchema);
}

export { createPagoRendicionLoteModel };