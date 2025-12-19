import { DataTypes } from 'sequelize';

const ApremioSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idExpediente: {
		field: 'id_expediente',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idOrganismoJudicial: {
		field: 'id_organismo_judicial',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaInicioDemanda: {
		field: 'fecha_inicio_demanda',
		type: DataTypes.DATE,
		allowNull: false
	},
	carpeta: {
		field: 'carpeta',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	caratula: {
		field: 'caratula',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	estado: {
		field: 'estado',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default ApremioSchema;
