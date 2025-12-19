import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import InhumadoSchema from './inhumado-schema';
import DireccionModel from './direccion-model';
import VerificacionModel from './verificacion-model';

const sequelize = createConnection(true);

class InhumadoModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idCementerio"),
		this.getDataValue("idTipoDocumento"),
		this.getDataValue("numeroDocumento"),
		this.getDataValue("apellido"),
		this.getDataValue("nombre"),
		this.getDataValue("fechaNacimiento"),
		this.getDataValue("idGenero"),
		this.getDataValue("idEstadoCivil"),
		this.getDataValue("idNacionalidad"),
		this.getDataValue("fechaDefuncion"),
		this.getDataValue("fechaIngreso"),
		this.getDataValue("idMotivoFallecimiento"),
		this.getDataValue("idCocheria"),
		this.getDataValue("numeroDefuncion"),
		this.getDataValue("libro"),
		this.getDataValue("folio"),
		this.getDataValue("idRegistroCivil"),
		this.getDataValue("acta"),
		this.getDataValue("idTipoOrigenInhumacion"),
		this.getDataValue("observacionesOrigen"),
		this.getDataValue("idTipoCondicionEspecial"),
		this.getDataValue("fechaEgreso"),
		this.getDataValue("fechaTraslado"),
		this.getDataValue("idTipoDestinoInhumacion"),
		this.getDataValue("observacionesDestino"),
		this.getDataValue("fechaExhumacion"),
		this.getDataValue("fechaReduccion"),
		this.getDataValue("numeroReduccion"),
		this.getDataValue("unidad"),
		this.getDataValue("idTipoDocumentoResponsable"),
		this.getDataValue("numeroDocumentoResponsable"),
		this.getDataValue("apellidoResponsable"),
		this.getDataValue("nombreResponsable"),
		this.getDataValue("fechaHoraInicioVelatorio"),
		this.getDataValue("fechaHoraFinVelatorio")
	];

}

InhumadoModel.init(InhumadoSchema, {
  sequelize,
  modelName: 'Inhumado',
  tableName: 'inhumado',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

InhumadoModel.hasMany(DireccionModel, { as: 'direccion', foreignKey: 'idEntidad', 
	scope: {[Op.and]: sequelize.where(sequelize.col("direccion.entidad"), Op.eq, "Inhumado")}
});
InhumadoModel.hasMany(VerificacionModel, { as: 'verificacion', foreignKey: 'idInhumado' });

export default InhumadoModel;
