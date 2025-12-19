import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VinculoVehiculoSchema from './vinculo-vehiculo-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class VinculoVehiculoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idVehiculo"),
		this.getDataValue("idTipoVinculoVehiculo"),
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

VinculoVehiculoModel.init(VinculoVehiculoSchema, {
  sequelize,
  modelName: 'VinculoVehiculo',
  tableName: 'vinculo_vehiculo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

VinculoVehiculoModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default VinculoVehiculoModel;
