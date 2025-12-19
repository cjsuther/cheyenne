import { DataTypes } from 'sequelize';

const PagoContadoDefinicionAlcanceZonaTarifariaSchema = {
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
	idZonaTarifaria: {
		field: 'id_zona_tarifaria',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PagoContadoDefinicionAlcanceZonaTarifariaSchema;
