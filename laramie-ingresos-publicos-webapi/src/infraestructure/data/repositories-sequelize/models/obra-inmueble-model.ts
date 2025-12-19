import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ObraInmuebleSchema from './obra-inmueble-schema';
import ObraInmuebleDetalleModel from './obra-inmueble-detalle-model';
import PersonaModel from './persona-model';

const sequelize = createConnection(true);

class ObraInmuebleModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idInmueble"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("idTipoMovimiento"),
		this.getDataValue("numero"),
		this.getDataValue("cuota"),
		this.getDataValue("fechaPrimerVencimiento"),
		this.getDataValue("fechaSegundoVencimiento"),
		this.getDataValue("idExpediente"),
		this.getDataValue("detalleExpediente"),
		this.getDataValue("idPersona"),
		null, //idTipoPersona
		"", //nombrePersona
		null, //idTipoDocumento
		"", //numeroDocumento
		this.getDataValue("fechaPresentacion"),
		this.getDataValue("fechaInspeccion"),
		this.getDataValue("fechaAprobacion"),
		this.getDataValue("fechaInicioDesglose"),
		this.getDataValue("fechaFinDesglose"),
		this.getDataValue("fechaFinObra"),
		this.getDataValue("fechaArchivado"),
		this.getDataValue("fechaIntimado"),
		this.getDataValue("fechaVencidoIntimado"),
		this.getDataValue("fechaMoratoria"),
		this.getDataValue("fechaVencidoMoratoria")
	];

}

ObraInmuebleModel.init(ObraInmuebleSchema, {
  sequelize,
  modelName: 'ObraInmueble',
  tableName: 'obra_inmueble',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

ObraInmuebleModel.hasMany(ObraInmuebleDetalleModel, { as: 'obraInmuebleDetalle', foreignKey: 'idObraInmueble' });
ObraInmuebleModel.belongsTo(PersonaModel, { as: 'persona', foreignKey: 'idPersona'});

export default ObraInmuebleModel;
