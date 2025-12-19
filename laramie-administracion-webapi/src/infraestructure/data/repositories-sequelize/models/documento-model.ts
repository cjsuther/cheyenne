import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import DocumentoSchema from './documento-schema';

const sequelize = createConnection(true);

class DocumentoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoPersona"),
		this.getDataValue("idPersona"),
		this.getDataValue("idTipoDocumento"),
		this.getDataValue("numeroDocumento"),
		this.getDataValue("principal")
	];

}

DocumentoModel.init(DocumentoSchema, {
  sequelize,
  modelName: 'Documento',
  tableName: 'documento',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default DocumentoModel;
