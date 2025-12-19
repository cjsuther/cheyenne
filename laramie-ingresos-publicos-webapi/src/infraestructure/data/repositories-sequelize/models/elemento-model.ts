import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ElementoSchema from './elemento-schema';

const sequelize = createConnection(true);

class ElementoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idClaseElemento"),
		this.getDataValue("idTipoElemento"),
		this.getDataValue("idCuenta"),
		parseFloat(this.getDataValue("cantidad")),
		this.getDataValue("fechaAlta"),
		this.getDataValue("fechaBaja")
	];

}

ElementoModel.init(ElementoSchema, {
  sequelize,
  modelName: 'Elemento',
  tableName: 'elemento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ElementoModel;
