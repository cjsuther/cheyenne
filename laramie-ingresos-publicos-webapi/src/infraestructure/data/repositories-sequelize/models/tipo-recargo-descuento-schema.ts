import { DataTypes } from 'sequelize';

const TipoRecargoDescuentoSchema = {
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
	tipo: {
		field: 'tipo',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	porcentaje: {
		field: 'porcentaje',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importe: {
		field: 'importe',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	emiteSolicitud: {
		field: 'emite_solicitud',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	requiereOtrogamiento: {
		field: 'requiere_otrogamiento',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	fechaDesde: {
		field: 'fecha_desde',
		type: DataTypes.DATE,
		allowNull: true
	},
	fechaHasta: {
		field: 'fecha_hasta',
		type: DataTypes.DATE,
		allowNull: true
	},
	procedimiento: {
		field: 'procedimiento',
		type: DataTypes.STRING(250),
		allowNull: false
	}
};

export default TipoRecargoDescuentoSchema;
