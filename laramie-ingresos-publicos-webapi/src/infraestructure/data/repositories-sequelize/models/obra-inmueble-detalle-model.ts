import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ObraInmuebleDetalleSchema from './obra-inmueble-detalle-schema';

const sequelize = createConnection(true);

class ObraInmuebleDetalleModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idObraInmueble"),
		this.getDataValue("idTipoObra"),
		this.getDataValue("idDestinoObra"),
		this.getDataValue("idFormaPresentacionObra"),
		this.getDataValue("idFormaCalculoObra"),
		this.getDataValue("sujetoDemolicion"),
		this.getDataValue("generarSuperficie"),
		this.getDataValue("tipoSuperficie"),
		this.getDataValue("descripcion"),
		parseFloat(this.getDataValue("valor")),
		parseFloat(this.getDataValue("alicuota")),
		parseFloat(this.getDataValue("metros")),
		parseFloat(this.getDataValue("montoPresupuestado")),
		parseFloat(this.getDataValue("montoCalculado"))
	];

}

ObraInmuebleDetalleModel.init(ObraInmuebleDetalleSchema, {
  sequelize,
  modelName: 'ObraInmuebleDetalle',
  tableName: 'obra_inmueble_detalle',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ObraInmuebleDetalleModel;
