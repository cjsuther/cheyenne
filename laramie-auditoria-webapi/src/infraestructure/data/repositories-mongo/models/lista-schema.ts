import { Schema } from 'mongoose';

const ListaSchema = new Schema({
	id: Number,
    codigo: String,
    tipo: String,
    nombre: String,
    orden: Number,
}, {collection: 'Lista'});

export default ListaSchema;