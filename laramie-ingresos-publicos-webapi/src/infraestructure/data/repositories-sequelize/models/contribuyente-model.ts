import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ContribuyenteSchema from './contribuyente-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class ContribuyenteModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idPersona"),
		null, //idTipoPersona
		null, //idTipoDocumento
		"", //numeroDocumento
		"", //nombrePersona
		this.getDataValue("fechaAlta")
	];

}

ContribuyenteModel.init(ContribuyenteSchema, {
  sequelize,
  modelName: 'Contribuyente',
  tableName: 'contribuyente',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

ContribuyenteModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default ContribuyenteModel;
