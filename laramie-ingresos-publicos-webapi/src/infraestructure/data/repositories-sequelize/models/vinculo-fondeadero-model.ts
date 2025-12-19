import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VinculoFondeaderoSchema from './vinculo-fondeadero-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class VinculoFondeaderoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idFondeadero"),
		this.getDataValue("idTipoVinculoFondeadero"),
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

VinculoFondeaderoModel.init(VinculoFondeaderoSchema, {
  sequelize,
  modelName: 'VinculoFondeadero',
  tableName: 'vinculo_fondeadero',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

VinculoFondeaderoModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default VinculoFondeaderoModel;
