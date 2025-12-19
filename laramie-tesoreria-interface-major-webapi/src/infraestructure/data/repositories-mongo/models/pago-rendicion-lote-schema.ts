import { Schema } from 'mongoose';
import PagoRendicionSchema from './pago-rendicion-schema';

const PagoRendicionLoteSchema = new Schema({
	numeroLoteRendicion: String,
	fechaRendicion: Date,
	fechaEnvio: Date,
	fechaConfirmacion: Date,
	error: Boolean,
	observacionEnvio: String,
	observacionConfirmacion: String,
	pagosRendicion: [PagoRendicionSchema]
}, {collection: 'PagoRendicionLote'});

export default PagoRendicionLoteSchema;