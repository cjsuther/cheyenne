import { Mongoose } from 'mongoose';
import { createConnection } from '../connections/db-connection';
import ReciboPublicacionLoteSchema from './recibo-publicacion-lote-schema';

let mongoose = null;

const createReciboPublicacionLoteModel = async () => {
    if (!mongoose) {
        mongoose = await createConnection(true) as Mongoose;
    }
    return mongoose.model('ReciboPublicacionLoteModel', ReciboPublicacionLoteSchema);
}

export { createReciboPublicacionLoteModel };