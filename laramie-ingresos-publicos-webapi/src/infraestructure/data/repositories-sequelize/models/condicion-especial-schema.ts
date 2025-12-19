import { DataTypes } from 'sequelize';

const CondicionEspecialSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idTipoCondicionEspecial: {
		field: 'id_tipo_condicion_especial',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaHasta: {
		field: 'fecha_hasta',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default CondicionEspecialSchema;