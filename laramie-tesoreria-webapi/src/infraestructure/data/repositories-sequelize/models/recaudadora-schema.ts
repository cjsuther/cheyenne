import { DataTypes } from 'sequelize';

const RecaudadoraSchema = {
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
	codigoCliente: {
		field: 'codigo_cliente',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idLugarPago: {
		field: 'id_lugar_pago',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idMetodoImportacion: {
		field: 'id_metodo_importacion',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default RecaudadoraSchema;
