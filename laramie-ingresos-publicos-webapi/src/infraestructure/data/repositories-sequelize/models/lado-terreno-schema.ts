import { DataTypes } from 'sequelize';

const LadoTerrenoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idInmueble: {
		field: 'id_inmueble',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoLado: {
		field: 'id_tipo_lado',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numero: {
		field: 'numero',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	metros: {
		field: 'metros',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	reduccion: {
		field: 'reduccion',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default LadoTerrenoSchema;
