import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import OrganoJudicialSchema from './organo-judicial-schema';

const sequelize = createConnection(true);

class OrganoJudicialModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("codigoOrganoJudicial"),
		this.getDataValue("departamentoJudicial"),
		this.getDataValue("fuero"),
		this.getDataValue("secretaria")
	];

}

OrganoJudicialModel.init(OrganoJudicialSchema, {
  sequelize,
  modelName: 'OrganoJudicial',
  tableName: 'organo_judicial',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default OrganoJudicialModel;
