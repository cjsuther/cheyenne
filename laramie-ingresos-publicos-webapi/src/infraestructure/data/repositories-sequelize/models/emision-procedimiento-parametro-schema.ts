import { DataTypes } from 'sequelize';

const EmisionProcedimientoParametroSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idEmisionEjecucion: {
		field: 'id_emision_ejecucion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idProcedimientoParametro: {
		field: 'id_procedimiento_parametro',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valor: {
		field: 'valor',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default EmisionProcedimientoParametroSchema;
