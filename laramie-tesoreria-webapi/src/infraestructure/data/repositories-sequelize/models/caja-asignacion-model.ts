import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import { hooksConfig } from './hooks-model';
import CajaAsignacionSchema from './caja-asignacion-schema';
import CajaModel from './caja-model';

const sequelize = createConnection(true);

class CajaAsignacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCaja"),
		this.getDataValue("idUsuario"),
		this.getDataValue("fechaApertura"),
		this.getDataValue("fechaCierre"),
		parseFloat(this.getDataValue("importeSaldoInicial")),
		parseFloat(this.getDataValue("importeSaldoFinal")),
		parseFloat(this.getDataValue("importeCobro")),
		parseFloat(this.getDataValue("importeCobroEfectivo")),
		this.getDataValue("idRecaudacionLote")
	];

}

CajaAsignacionModel.init(CajaAsignacionSchema, {
  sequelize,
  hooks: hooksConfig,
  modelName: 'CajaAsignacion',
  tableName: 'caja_asignacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CajaAsignacionModel;
