import { DataTypes } from 'sequelize';

const PagoContadoDefinicionAlcanceGrupoSchema = {
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
	idGrupo: {
		field: 'id_grupo',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default PagoContadoDefinicionAlcanceGrupoSchema;
