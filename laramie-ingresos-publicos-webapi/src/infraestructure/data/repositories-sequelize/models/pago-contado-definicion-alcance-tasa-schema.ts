import { DataTypes } from 'sequelize';

const PagoContadoDefinicionAlcanceTasaSchema = {
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
	idTasa: {
		field: 'id_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasa: {
		field: 'id_sub_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PagoContadoDefinicionAlcanceTasaSchema;
