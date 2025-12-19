import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import DireccionModel from './direccion-model';
import PersonaFisicaSchema from './persona-fisica-schema';

const sequelize = createConnection(true);

class PersonaFisicaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoDocumento"),
		this.getDataValue("numeroDocumento"),
		this.getDataValue("idNacionalidad"),
		this.getDataValue("nombre"),
		this.getDataValue("apellido"),
		this.getDataValue("idGenero"),
		this.getDataValue("idEstadoCivil"),
		this.getDataValue("idNivelEstudio"),
		this.getDataValue("profesion"),
		this.getDataValue("matricula"),
		this.getDataValue("fechaNacimiento"),
		this.getDataValue("fechaDefuncion"),
		this.getDataValue("discapacidad"),
		this.getDataValue("idCondicionFiscal"),
		this.getDataValue("idIngresosBrutos"),
		this.getDataValue("ganancias"),
		this.getDataValue("pin"),
		this.getDataValue("foto")
	];

}

PersonaFisicaModel.init(PersonaFisicaSchema, {
  sequelize,
  modelName: 'PersonaFisica',
  tableName: 'persona_fisica',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

PersonaFisicaModel.hasMany(DireccionModel, { as: 'direccion', foreignKey: 'idEntidad', 
	scope: {[Op.and]: sequelize.where(sequelize.col("direccion.entidad"), Op.eq, "PersonaFisica")}
});

export default PersonaFisicaModel;
