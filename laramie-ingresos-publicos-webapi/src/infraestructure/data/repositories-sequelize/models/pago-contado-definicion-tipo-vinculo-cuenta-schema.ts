import { DataTypes } from 'sequelize';

const PagoContadoDefinicionTipoVinculoCuentaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idPagoContadoDefinicion: {
		field: 'id_pago_contado_definicion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoVinculoCuenta: {
		field: 'id_tipo_vinculo_cuenta',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PagoContadoDefinicionTipoVinculoCuentaSchema;
