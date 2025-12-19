import { DataTypes } from 'sequelize';

const PagoContadoDefinicionAlcanceCondicionFiscalSchema = {
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
	idCondicionFiscal: {
		field: 'id_condicion_fiscal',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PagoContadoDefinicionAlcanceCondicionFiscalSchema;
