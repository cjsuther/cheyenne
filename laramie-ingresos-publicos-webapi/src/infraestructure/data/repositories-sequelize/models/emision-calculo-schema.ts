import { DataTypes } from 'sequelize';

const EmisionCalculoSchema = {
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
	idTipoEmisionCalculo: {
		field: 'id_tipo_emision_calculo',
		type: DataTypes.BIGINT,
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
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	guardaValor: {
		field: 'guarda_valor',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	formula: {
		field: 'formula',
		type: DataTypes.STRING(4000),
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	soloLectura: {
		field: 'solo_lectura',
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};

export default EmisionCalculoSchema;
