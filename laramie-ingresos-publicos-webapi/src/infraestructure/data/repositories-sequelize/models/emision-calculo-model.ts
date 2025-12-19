import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionCalculoSchema from './emision-calculo-schema';

const sequelize = createConnection(true);

class EmisionCalculoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionDefinicion"),
		this.getDataValue("idTipoEmisionCalculo"),
		this.getDataValue("codigo"),
		this.getDataValue("nombre"),
		this.getDataValue("descripcion"),
		this.getDataValue("guardaValor"),
		this.getDataValue("formula"),
		this.getDataValue("orden"),
		this.getDataValue("soloLectura")
	];

}

EmisionCalculoModel.init(EmisionCalculoSchema, {
  sequelize,
  modelName: 'EmisionCalculo',
  tableName: 'emision_calculo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionCalculoModel;
