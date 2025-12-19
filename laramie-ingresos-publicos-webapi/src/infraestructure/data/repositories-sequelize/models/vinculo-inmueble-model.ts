import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VinculoInmuebleSchema from './vinculo-inmueble-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class VinculoInmuebleModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idInmueble"),
		this.getDataValue("idTipoVinculoInmueble"),
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

VinculoInmuebleModel.init(VinculoInmuebleSchema, {
  sequelize,
  modelName: 'VinculoInmueble',
  tableName: 'vinculo_inmueble',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

VinculoInmuebleModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default VinculoInmuebleModel;
