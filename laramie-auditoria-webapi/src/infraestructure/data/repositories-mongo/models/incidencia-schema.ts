import { Schema } from 'mongoose';

const IncidenciaSchema = new Schema({
	id: Number,
	token: String,
	idTipoIncidencia: Number,
	idNivelCriticidad: Number,
	idUsuario: Number,
	fecha: Date,
	idModulo: Number,
	origen: String,
	mensaje: String,
	error: Object,
	data: Object,
}, {collection: 'Incidencia'});

export default IncidenciaSchema;