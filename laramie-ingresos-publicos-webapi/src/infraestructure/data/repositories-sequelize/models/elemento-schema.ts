import { DataTypes } from 'sequelize';

const ElementoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idClaseElemento: {
		field: 'id_clase_elemento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoElemento: {
		field: 'id_tipo_elemento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuenta: {
		field: 'id_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	cantidad: {
		field: 'cantidad',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	fechaAlta: {
		field: 'fecha_alta',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default ElementoSchema;
