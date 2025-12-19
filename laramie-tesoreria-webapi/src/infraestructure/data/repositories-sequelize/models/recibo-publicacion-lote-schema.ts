import { DataTypes } from 'sequelize';

const ReciboPublicacionLoteSchema = {
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
	importeTotal1: {
		field: 'importe_total1',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	importeTotal2: {
		field: 'importe_total2',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default ReciboPublicacionLoteSchema;
