import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RecargoDescuentoSchema from './recargo-descuento-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class RecargoDescuentoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idTipoRecargoDescuento"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("idRubro"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta"),
		this.getDataValue("fechaOtorgamiento"),
		this.getDataValue("numeroSolicitud"),
		parseFloat(this.getDataValue("porcentaje")),
		parseFloat(this.getDataValue("importe")),
		this.getDataValue("idPersona"),
		null, //idTipoPersona
		"", //nombrePersona
		"", //numeroDocumento
		null, //idTipoDocumento
		this.getDataValue("numeroDDJJ"),
		this.getDataValue("letraDDJJ"),
		this.getDataValue("ejercicioDDJJ"),
		this.getDataValue("numeroDecreto"),
		this.getDataValue("letraDecreto"),
		this.getDataValue("ejercicioDecreto"),
		this.getDataValue("idExpediente"),
		this.getDataValue("detalleExpediente")
	];

}

RecargoDescuentoModel.init(RecargoDescuentoSchema, {
  sequelize,
  modelName: 'RecargoDescuento',
  tableName: 'recargo_descuento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

RecargoDescuentoModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default RecargoDescuentoModel;
