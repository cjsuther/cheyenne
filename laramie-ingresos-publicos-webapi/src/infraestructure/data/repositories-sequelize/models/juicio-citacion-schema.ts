import { DataTypes } from 'sequelize';

const JuicioCitacionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idApremio: {
		field: 'id_apremio',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaCitacion: {
		field: 'fecha_citacion',
		type: DataTypes.DATE,
		allowNull: false
	},
	idTipoCitacion: {
		field: 'id_tipo_citacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	observacion: {
		field: 'observacion',
		type: DataTypes.STRING(1000),
		allowNull: false
	}
};

export default JuicioCitacionSchema;
