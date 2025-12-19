import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ReciboEspecialSchema from './recibo-especial-schema';
import ReciboEspecialConceptoModel from './recibo-especial-concepto-model';

const sequelize = createConnection(true);

class ReciboEspecialModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigo"),
		this.getDataValue("descripcion"),
		this.getDataValue("aplicaValorUF")
	];

}

ReciboEspecialModel.init(ReciboEspecialSchema, {
  sequelize,
  modelName: 'ReciboEspecial',
  tableName: 'recibo_especial',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

ReciboEspecialModel.hasMany(ReciboEspecialConceptoModel, { as: 'reciboEspecialConcepto', foreignKey: 'idReciboEspecial' });

export default ReciboEspecialModel;
