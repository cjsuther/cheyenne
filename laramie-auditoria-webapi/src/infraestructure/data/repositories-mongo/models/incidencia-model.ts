import { Mongoose } from 'mongoose';
import { createConnection } from '../connections/db-connection';
import IncidenciaSchema from './incidencia-schema';

let mongoose = null;

const createIncidenciaModel = async () => {
    if (!mongoose) {
        mongoose = await createConnection(true) as Mongoose;
    }
    return mongoose.model('IncidenciaModel', IncidenciaSchema);
}

export { createIncidenciaModel };