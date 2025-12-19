import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import DeclaracionJuradaSchema from './declaracion-jurada-schema';

const sequelize = createConnection(true);

class DeclaracionJuradaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTipoTributo"),
		this.getDataValue("idTributo"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("fechaPresentacionDDJJ"),
		this.getDataValue("anioDeclaracion"),
		this.getDataValue("mesDeclaracion"),
		this.getDataValue("numero"),
		this.getDataValue("idTipoDDJJ"),
		parseFloat(this.getDataValue("valorDeclaracion")),
		this.getDataValue("fechaAlta"),
		this.getDataValue("fechaBaja"),
		this.getDataValue("resolucion")
	];

}

DeclaracionJuradaModel.init(DeclaracionJuradaSchema, {
  sequelize,
  modelName: 'DeclaracionJurada',
  tableName: 'declaracion_jurada',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default DeclaracionJuradaModel;
