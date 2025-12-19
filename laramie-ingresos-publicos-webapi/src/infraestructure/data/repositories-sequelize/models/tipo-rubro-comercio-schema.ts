import { DataTypes } from 'sequelize';

const TipoRubroComercioSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	agrupamiento: {
		field: 'agrupamiento',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	},
	facturable: {
		field: 'facturable',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	generico: {
		field: 'generico',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	categoria: {
		field: 'categoria',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	importeMinimo: {
		field: 'importe_minimo',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	alicuota: {
		field: 'alicuota',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	regimenGeneral: {
		field: 'regimen_general',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
};

export default TipoRubroComercioSchema;
