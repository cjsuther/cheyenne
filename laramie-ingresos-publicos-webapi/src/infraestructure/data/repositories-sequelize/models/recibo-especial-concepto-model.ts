import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ReciboEspecialConceptoSchema from './recibo-especial-concepto-schema';

const sequelize = createConnection(true);

class ReciboEspecialConceptoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idReciboEspecial"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		parseFloat(this.getDataValue("valor"))
	];

}

ReciboEspecialConceptoModel.init(ReciboEspecialConceptoSchema, {
  sequelize,
  modelName: 'ReciboEspecialConcepto',
  tableName: 'recibo_especial_concepto',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ReciboEspecialConceptoModel;
