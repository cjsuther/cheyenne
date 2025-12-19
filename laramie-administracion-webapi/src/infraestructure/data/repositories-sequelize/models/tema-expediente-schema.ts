import { DataTypes } from 'sequelize';

const TemaExpedienteSchema = {
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
	ejercicioOficina: {
		field: 'ejercicio_oficina',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	oficina: {
		field: 'oficina',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	detalle: {
		field: 'detalle',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	plazo: {
		field: 'plazo',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	fechaAlta: {
		field: 'fecha_alta',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default TemaExpedienteSchema;
