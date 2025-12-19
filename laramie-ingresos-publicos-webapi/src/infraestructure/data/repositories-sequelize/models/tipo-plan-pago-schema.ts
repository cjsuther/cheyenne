import { DataTypes } from 'sequelize';

const TipoPlanPagoSchema = {
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
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	convenio: {
		field: 'convenio',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	condiciones: {
		field: 'condiciones',
		type: DataTypes.STRING(1000),
		allowNull: false
	}
};

export default TipoPlanPagoSchema;
