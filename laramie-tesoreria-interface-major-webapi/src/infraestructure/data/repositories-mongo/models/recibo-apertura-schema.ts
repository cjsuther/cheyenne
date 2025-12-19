import { Schema } from 'mongoose';

const ReciboAperturaSchema = new Schema({
    codigoRubro: String,
    codigoTasa: String,
    codigoSubTasa: String,
    codigoTipoMovimiento: String,
    periodo: String,
    cuota: Number,
    importeCancelar: Number,
    importeImputacionContable: Number,
    ejercicio: String,
    periodoImputacion: String,
    item: Number,
    codigoEdesurCliente: String,
    numeroCertificadoApremio: String,
    vencimiento: Number,
    fechaVencimiento: Date,
    numeroEmision: String,
    tipoNovedad: String
}, { _id: false });

export default ReciboAperturaSchema;