import { DataTypes } from 'sequelize';

const ContactoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	entidad: {
		field: 'entidad',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idEntidad: {
		field: 'id_entidad',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoContacto: {
		field: 'id_tipo_contacto',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	detalle: {
		field: 'detalle',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default ContactoSchema;
