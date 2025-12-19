import { DataTypes } from 'sequelize';

const TasaVencimientoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTasa: {
		field: 'id_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasa: {
		field: 'id_sub_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	periodo: {
		field: 'periodo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	cuota: {
		field: 'cuota',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	fechaVencimiento1: {
		field: 'fecha_vencimiento1',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaVencimiento2: {
		field: 'fecha_vencimiento2',
		type: DataTypes.DATE,
		allowNull: false
	},
	idEmisionEjecucion: {
		field: 'id_emision_ejecucion',
		type: DataTypes.BIGINT,
		allowNull: true
	}
};

export default TasaVencimientoSchema;
