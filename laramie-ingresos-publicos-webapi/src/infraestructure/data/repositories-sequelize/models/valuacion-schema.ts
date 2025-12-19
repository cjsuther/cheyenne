import { DataTypes } from 'sequelize';

const ValuacionSchema = {
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
	idTipoValuacion: {
		field: 'id_tipo_valuacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	ejercicio: {
		field: 'ejercicio',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	mes: {
		field: 'mes',
		type: DataTypes.INTEGER,
		allowNull: false
	},
	valor: {
		field: 'valor',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default ValuacionSchema;
