import { DataTypes } from 'sequelize';

const TipoActoProcesalSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoActoProcesal: {
		field: 'id_tipo_acto_procesal',
		type: DataTypes.BIGINT,
		allowNull: true
	},
	codigoActoProcesal: {
		field: 'codigo_acto_procesal',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	plazoDias: {
		field: 'plazo_dias',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	porcentajeHonorarios: {
		field: 'porcentaje_honorarios',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	fechaBaja: {
		field: 'fecha_baja',
		type: DataTypes.DATE,
		allowNull: true
	},
	nivel: {
		field: 'nivel',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	orden: {
		field: 'orden',
		type: DataTypes.INTEGER,
		allowNull: false
	}
};

export default TipoActoProcesalSchema;
