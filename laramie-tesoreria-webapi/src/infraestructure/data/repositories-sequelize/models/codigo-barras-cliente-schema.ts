import { DataTypes } from 'sequelize';

const CodigoBarrasClienteSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoCodigoBarras: {
		field: 'id_tipo_codigo_barras',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	codigoBarras: {
		field: 'codigo_barras',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	codigoBarrasCliente: {
		field: 'codigo_barras_cliente',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default CodigoBarrasClienteSchema;
