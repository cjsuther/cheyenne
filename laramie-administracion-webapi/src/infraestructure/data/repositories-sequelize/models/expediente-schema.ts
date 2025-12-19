import { DataTypes } from 'sequelize';

const ExpedienteSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	matricula: {
		field: 'matricula',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	ejercicio: {
		field: 'ejercicio',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	letra: {
		field: 'letra',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idProvincia: {
		field: 'id_provincia',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoExpediente: {
		field: 'id_tipo_expediente',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	subnumero: {
		field: 'subnumero',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	idTemaExpediente: {
		field: 'id_tema_expediente',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	referenciaExpediente: {
		field: 'referencia_expediente',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	fechaCreacion: {
		field: 'fecha_creacion',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default ExpedienteSchema;
