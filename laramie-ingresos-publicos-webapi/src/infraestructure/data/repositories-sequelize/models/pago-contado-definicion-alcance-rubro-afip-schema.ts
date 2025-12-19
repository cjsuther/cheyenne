import { DataTypes } from 'sequelize';

const PagoContadoDefinicionAlcanceRubroAfipSchema = {
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
	idRubroAfip: {
		field: 'id_rubro_afip',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PagoContadoDefinicionAlcanceRubroAfipSchema;
