import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ContactoSchema from './contacto-schema';

const sequelize = createConnection(true);

class ContactoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("entidad"),
		this.getDataValue("idEntidad"),
		this.getDataValue("idTipoContacto"),
		this.getDataValue("detalle")
	];

}

ContactoModel.init(ContactoSchema, {
  sequelize,
  modelName: 'Contacto',
  tableName: 'contacto',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ContactoModel;
