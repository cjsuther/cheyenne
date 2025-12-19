import { DataTypes } from 'sequelize';

const ReciboEspecialConceptoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idReciboEspecial : {
		field: 'id_recibo_especial',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTasa : {
		field: 'id_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idSubTasa : {
		field: 'id_sub_tasa',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	valor : {
		field: 'valor',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default ReciboEspecialConceptoSchema;
