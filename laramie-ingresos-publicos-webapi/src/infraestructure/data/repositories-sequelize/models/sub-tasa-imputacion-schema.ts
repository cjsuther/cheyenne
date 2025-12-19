import { DataTypes } from 'sequelize';

const SubTasaImputacionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
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
	},
	ejercicio: {
		field: 'ejercicio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idTipoCuota: {
		field: 'id_tipo_cuota',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuentaContable: {
		field: 'id_cuenta_contable',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuentaContableAnterior: {
		field: 'id_cuenta_contable_anterior',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCuentaContableFutura: {
		field: 'id_cuenta_contable_futura',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idJurisdiccionActual: {
		field: 'id_jurisdiccion_actual',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idRecursoPorRubroActual: {
		field: 'id_recurso_por_rubro_actual',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idJurisdiccionAnterior: {
		field: 'id_jurisdiccion_anterior',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idRecursoPorRubroAnterior: {
		field: 'id_recurso_por_rubro_anterior',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idJurisdiccionFutura: {
		field: 'id_jurisdiccion_futura',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idRecursoPorRubroFutura: {
		field: 'id_recurso_por_rubro_futura',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default SubTasaImputacionSchema;
