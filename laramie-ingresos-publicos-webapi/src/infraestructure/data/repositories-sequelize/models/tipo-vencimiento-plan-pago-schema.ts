import { DataTypes } from 'sequelize';

const TipoVencimientoPlanPagoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	baseDiaActual: {
		field: 'base_dia_actual',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	baseDiaFinMes: {
		field: 'base_dia_fin_mes',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	habiles: {
		field: 'habiles',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	proximoHabil: {
		field: 'proximo_habil',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	anteriorHabil: {
		field: 'anterior_habil',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	dias: {
		field: 'dias',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	meses: {
		field: 'meses',
		type: DataTypes.INTEGER,
		allowNull: false
	}
};

export default TipoVencimientoPlanPagoSchema;
