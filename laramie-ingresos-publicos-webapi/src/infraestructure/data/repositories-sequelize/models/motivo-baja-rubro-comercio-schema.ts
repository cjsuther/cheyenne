import { DataTypes } from 'sequelize';

const MotivoBajaRubroComercioSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	bajaConDeuda: {
		field: 'baja_con_deuda',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	bajaCancelaDeuda: {
		field: 'baja_cancela_deuda',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default MotivoBajaRubroComercioSchema;
