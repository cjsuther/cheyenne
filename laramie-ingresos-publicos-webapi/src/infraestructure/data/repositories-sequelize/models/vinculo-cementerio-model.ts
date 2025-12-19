import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VinculoCementerioSchema from './vinculo-cementerio-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class VinculoCementerioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCementerio"),
		this.getDataValue("idTipoVinculoCementerio"),
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

VinculoCementerioModel.init(VinculoCementerioSchema, {
  sequelize,
  modelName: 'VinculoCementerio',
  tableName: 'vinculo_cementerio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

VinculoCementerioModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default VinculoCementerioModel;
