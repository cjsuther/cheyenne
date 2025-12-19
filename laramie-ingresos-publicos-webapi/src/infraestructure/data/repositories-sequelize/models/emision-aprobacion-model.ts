import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionAprobacionSchema from './emision-aprobacion-schema';

const sequelize = createConnection(true);

class EmisionAprobacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idEstadoAprobacionCalculo"),
		this.getDataValue("idUsuarioAprobacionCalculo"),
		this.getDataValue("fechaAprobacionCalculo"),
		this.getDataValue("idEstadoAprobacionOrdenamiento"),
		this.getDataValue("idUsuarioAprobacionOrdenamiento"),
		this.getDataValue("fechaAprobacionOrdenamiento"),
		this.getDataValue("idEstadoAprobacionControlRecibos"),
		this.getDataValue("idUsuarioAprobacionControlRecibos"),
		this.getDataValue("fechaAprobacionControlRecibos"),
		this.getDataValue("idEstadoAprobacionCodigoBarras"),
		this.getDataValue("idUsuarioAprobacionCodigoBarras"),
		this.getDataValue("fechaAprobacionCodigoBarras"),
		this.getDataValue("idEstadoProcesoCuentaCorriente"),
		this.getDataValue("idUsuarioProcesoCuentaCorriente"),
		this.getDataValue("fechaProcesoCuentaCorriente"),
		this.getDataValue("idEstadoProcesoImpresion"),
		this.getDataValue("idUsuarioProcesoImpresion"),
		this.getDataValue("fechaProcesoImpresion")
	];

}

EmisionAprobacionModel.init(EmisionAprobacionSchema, {
  sequelize,
  modelName: 'EmisionAprobacion',
  tableName: 'emision_aprobacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EmisionAprobacionModel;
