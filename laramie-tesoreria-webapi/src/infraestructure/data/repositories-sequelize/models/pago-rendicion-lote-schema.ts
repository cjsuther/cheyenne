import { DataTypes } from 'sequelize';

const PagoRendicionLoteSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	numeroLote: {
		field: 'numero_lote',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	fechaLote: {
		field: 'fecha_lote',
		type: DataTypes.DATE,
		allowNull: false
	},
	casos: {
		field: 'casos',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	importeTotal: {
		field: 'importe_total',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	idUsuarioProceso: {
		field: 'id_usuario_proceso',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaProceso: {
		field: 'fecha_proceso',
		type: DataTypes.DATE,
		allowNull: false
	},
	fechaConfirmacion: {
		field: 'fecha_confirmacion',
		type: DataTypes.DATE,
		allowNull: true
	}
};

export default PagoRendicionLoteSchema;
