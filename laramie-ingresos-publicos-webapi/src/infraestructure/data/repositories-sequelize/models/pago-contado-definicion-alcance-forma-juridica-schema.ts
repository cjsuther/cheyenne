import { DataTypes } from 'sequelize';

const PagoContadoDefinicionAlcanceFormaJuridicaSchema = {
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
	idFormaJuridica: {
		field: 'id_forma_juridica',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PagoContadoDefinicionAlcanceFormaJuridicaSchema;
