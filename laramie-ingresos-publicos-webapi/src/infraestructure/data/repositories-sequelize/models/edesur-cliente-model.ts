import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EdesurClienteSchema from './edesur-cliente-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class EdesurClienteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEdesur"),
		this.getDataValue("idPersona"),
		null, //idTipoPersona
		"", //nombrePersona
		null, //idTipoDocumento
		"", //numeroDocumento
		this.getDataValue("codigoCliente"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta")
	];

}

EdesurClienteModel.init(EdesurClienteSchema, {
  sequelize,
  modelName: 'EdesurCliente',
  tableName: 'edesur_cliente',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

EdesurClienteModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default EdesurClienteModel;
