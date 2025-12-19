import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import RegistroContableSchema from './registro-contable-schema';
import RecaudacionModel from './recaudacion-model';

const sequelize = createConnection(true);

class RegistroContableModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idRegistroContableLote"),
		this.getDataValue("idRecaudacion"),
		this.getDataValue("fechaIngreso"),
		this.getDataValue("cuentaContable"),
		this.getDataValue("jurisdiccion"),
		this.getDataValue("recursoPorRubro"),
		this.getDataValue("codigoLugarPago"),
		this.getDataValue("ejercicio"),
		this.getDataValue("codigoFormaPago"),
		this.getDataValue("codigoTipoRecuadacion"),
		parseFloat(this.getDataValue("importe"))
	];

}

RegistroContableModel.init(RegistroContableSchema, {
  sequelize,
  modelName: 'RegistroContable',
  tableName: 'registro_contable',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

RegistroContableModel.belongsTo(RecaudacionModel, {
  as: 'recaudacion',
  foreignKey: 'idRecaudacion',
  targetKey: 'id'
});

export default RegistroContableModel;
