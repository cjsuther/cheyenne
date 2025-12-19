import { DataTypes } from 'sequelize';

const OrganoJudicialSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	codigoOrganoJudicial: {
		field: 'codigo_organo_judicial',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	departamentoJudicial: {
		field: 'departamento_judicial',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	fuero: {
		field: 'fuero',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	secretaria: {
		field: 'secretaria',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default OrganoJudicialSchema;
