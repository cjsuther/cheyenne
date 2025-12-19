import { DataTypes } from 'sequelize';

const DeclaracionJuradaRubroSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idDeclaracionJuradaComercio: {
		field: 'id_declaracion_jurada_comercio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idRubroComercio: {
		field: 'id_rubro_comercio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	importeIngresosBrutos: {
		field: 'importe_ingresos_brutos',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeDeducciones: {
		field: 'importe_deducciones',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeIngresosNetos: {
		field: 'importe_ingresos_netos',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default DeclaracionJuradaRubroSchema;
