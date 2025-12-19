import { DataTypes } from 'sequelize';

const ControladorCuentaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoControlador: {
		field: 'id_tipo_controlador',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idControlador: {
		field: 'id_controlador',
		type: DataTypes.BIGINT,
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

export default ControladorCuentaSchema;
