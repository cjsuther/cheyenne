import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ControladorCuentaModel from './controlador-cuenta-model';
import ControladorSchema from './controlador-schema';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class ControladorModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTipoControlador"),
		this.getDataValue("numero"),
		this.getDataValue("esSupervisor"),
		this.getDataValue("fechaAlta"),
		this.getDataValue("fechaBaja"),
		this.getDataValue("catastralCir"),
		this.getDataValue("catastralSec"),
		this.getDataValue("catastralChacra"),
		this.getDataValue("catastralLchacra"),
		this.getDataValue("catastralQuinta"),
		this.getDataValue("catastralLquinta"),
		this.getDataValue("catastralFrac"),
		this.getDataValue("catastralLfrac"),
		this.getDataValue("catastralManz"),
		this.getDataValue("catastralLmanz"),
		this.getDataValue("catastralParc"),
		this.getDataValue("catastralLparc"),
		this.getDataValue("catastralSubparc"),
		this.getDataValue("catastralUfunc"),
		this.getDataValue("catastralUcomp"),
		this.getDataValue("idPersona"),
		null, //idTipoPersona
		"", //nombrePersona
		null, //idTipoDocumento
		"", //numeroDocumento
		this.getDataValue("legajo"),
		this.getDataValue("idOrdenamiento"),
		this.getDataValue("idControladorSupervisor"),
		this.getDataValue("clasificacion"),
		this.getDataValue("fechaUltimaIntimacion"),
		parseFloat(this.getDataValue("cantidadIntimacionesEmitidas")),
		parseFloat(this.getDataValue("cantidadIntimacionesAnuales")),
		parseFloat(this.getDataValue("porcentaje"))
	];

}

ControladorModel.init(ControladorSchema, {
  sequelize,
  modelName: 'Controlador',
  tableName: 'controlador',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

ControladorModel.hasMany(ControladorCuentaModel, { as: 'controladorCuenta', foreignKey: 'idControlador' });
ControladorCuentaModel.belongsTo(ControladorModel, { as: 'controlador', foreignKey: 'idControlador' });
ControladorModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default ControladorModel;
