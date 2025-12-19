import { Mongoose } from 'mongoose';
import { createConnection } from '../connections/db-connection';
import ListaSchema from './lista-schema';

let mongoose = null;

const createListaModel = async () => {
    if (!mongoose) {
        mongoose = await createConnection(true) as Mongoose;
    }
    return mongoose.model('ListaModel', ListaSchema);
}

export { createListaModel };