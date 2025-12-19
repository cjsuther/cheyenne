import { DataTypes } from 'sequelize';

const VariableCuentaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idVariable: {
		field: 'id_variable',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valor: {
		field: 'valor',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaHasta: {
		field: 'fecha_hasta',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default VariableCuentaSchema;
