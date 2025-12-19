import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VinculoEspecialSchema from './vinculo-especial-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class VinculoEspecialModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEspecial"),
		this.getDataValue("idTipoVinculoEspecial"),
		this.getDataValue("idPersona"),
		null, //idTipoPersona
		null, //idTipoDocumento
		"", //numeroDocumento
		"", //nombrePersona	
		this.getDataValue("idTipoInstrumento"),
		this.getDataValue("fechaInstrumentoDesde"),
		this.getDataValue("fechaInstrumentoHasta"),
		parseFloat(this.getDataValue("porcentajeCondominio"))
	];

}

VinculoEspecialModel.init(VinculoEspecialSchema, {
  sequelize,
  modelName: 'VinculoEspecial',
  tableName: 'vinculo_especial',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

VinculoEspecialModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default VinculoEspecialModel;
