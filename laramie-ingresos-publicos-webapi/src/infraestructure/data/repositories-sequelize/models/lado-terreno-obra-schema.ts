import { DataTypes } from 'sequelize';

const LadoTerrenoObraSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idLadoTerreno: {
		field: 'id_lado_terreno',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idObra: {
		field: 'id_obra',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	importe: {
		field: 'importe',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	reduccionMetros: {
		field: 'reduccion_metros',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	reduccionSuperficie: {
		field: 'reduccion_superficie',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	fecha: {
		field: 'fecha',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default LadoTerrenoObraSchema;
