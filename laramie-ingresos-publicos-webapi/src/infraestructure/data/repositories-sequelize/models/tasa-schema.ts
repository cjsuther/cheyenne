import { DataTypes } from 'sequelize';

const TasaSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	codigo: {
		field: 'codigo',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	idTipoTributo: {
		field: 'id_tipo_tributo',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idCategoriaTasa: {
		field: 'id_categoria_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	porcentajeDescuento: {
		field: 'porcentaje_descuento',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default TasaSchema;
