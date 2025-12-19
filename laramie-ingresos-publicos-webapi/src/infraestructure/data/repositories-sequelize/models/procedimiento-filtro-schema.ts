import { DataTypes } from 'sequelize';

const ProcedimientoFiltroSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idProcedimiento: {
		field: 'id_procedimiento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idFiltro: {
		field: 'id_filtro',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default ProcedimientoFiltroSchema;
