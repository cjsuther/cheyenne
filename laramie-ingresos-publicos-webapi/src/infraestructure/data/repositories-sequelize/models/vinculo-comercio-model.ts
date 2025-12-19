import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VinculoComercioSchema from './vinculo-comercio-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class VinculoComercioModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idComercio"),
		this.getDataValue("idTipoVinculoComercio"),
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

VinculoComercioModel.init(VinculoComercioSchema, {
  sequelize,
  modelName: 'VinculoComercio',
  tableName: 'vinculo_comercio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

VinculoComercioModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default VinculoComercioModel;
