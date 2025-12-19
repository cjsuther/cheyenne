import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import DireccionModel from './direccion-model';
import PersonaJuridicaSchema from './persona-juridica-schema';

const sequelize = createConnection(true);

class PersonaJuridicaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoDocumento"),
		this.getDataValue("numeroDocumento"),
		this.getDataValue("denominacion"),
		this.getDataValue("nombreFantasia"),
		this.getDataValue("idFormaJuridica"),
		this.getDataValue("idJurisdiccion"),
		this.getDataValue("fechaConstitucion"),
		this.getDataValue("mesCierre"),
		this.getDataValue("logo")
	];

}

PersonaJuridicaModel.init(PersonaJuridicaSchema, {
  sequelize,
  modelName: 'PersonaJuridica',
  tableName: 'persona_juridica',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

PersonaJuridicaModel.hasMany(DireccionModel, { as: 'direccion', foreignKey: 'idEntidad', 
	scope: {[Op.and]: sequelize.where(sequelize.col("direccion.entidad"), Op.eq, "PersonaJuridica")}
});

export default PersonaJuridicaModel;
