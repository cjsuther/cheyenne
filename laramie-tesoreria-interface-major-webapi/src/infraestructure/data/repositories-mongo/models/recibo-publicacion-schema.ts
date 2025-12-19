import { Schema } from 'mongoose';
import ReciboAperturaSchema from './recibo-apertura-schema';

const ReciboPublicacionSchema = new Schema({
	idCuentaPago: Number,
	codigoTipoTributo: String,
	numeroCuenta: String,
	codigoDelegacion: String,
	numeroRecibo: Number,
	periodo: String,
	cuota: Number,
	importeVencimiento1: Number,
	importeVencimiento2: Number,
	fechaVencimiento1: Date,
	fechaVencimiento2: Date,
	codigoBarras: String,
	recibosApertura: [ReciboAperturaSchema]
}, { _id: false });

export default ReciboPublicacionSchema;