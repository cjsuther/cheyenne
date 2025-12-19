import { DataTypes } from 'sequelize';

const EmisionVariableSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEmisionDefinicion: {
		field: 'id_emision_definicion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idProcedimientoVariable: {
		field: 'id_procedimiento_variable',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default EmisionVariableSchema;
