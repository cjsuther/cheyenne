import { Schema } from 'mongoose';
import ReciboPublicacionSchema from './recibo-publicacion-schema';

const ReciboPublicacionLoteSchema = new Schema({
	numeroLotePublicacion: String,
	fechaPublicacion: Date,
	fechaEnvio: Date,
	fechaConfirmacion: Date,
	masivo: Boolean,
	error: Boolean,
	observacionEnvio: String,
	observacionConfirmacion: String,
	recibosPublicacion: [ReciboPublicacionSchema]
}, {collection: 'ReciboPublicacionLote'});

export default ReciboPublicacionLoteSchema;