import { Schema } from 'mongoose';
import ReciboAperturaSchema from './recibo-apertura-schema';

const PagoRendicionSchema = new Schema({
	idCuentaPago: Number,
	codigoDelegacion: String,
	numeroRecibo: Number,
	codigoLugarPago: String,
	importePago: Number,
	fechaPago: Date,
	fechaProceso: Date,
	idUsuarioProceso: Number,
	codigoBarras: String,
	recibosApertura: [ReciboAperturaSchema]
}, { _id: false });

export default PagoRendicionSchema;