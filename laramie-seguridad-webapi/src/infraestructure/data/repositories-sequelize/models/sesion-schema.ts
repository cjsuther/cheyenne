import { DataTypes } from 'sequelize';

const sesionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	token: {
		field: 'token',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	fechaVencimiento: {
		field: 'fecha_vencimiento',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaCreacion: {
		field: 'fecha_creacion',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default sesionSchema;
