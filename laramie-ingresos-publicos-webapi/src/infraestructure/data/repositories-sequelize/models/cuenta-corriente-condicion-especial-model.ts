import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CuentaCorrienteCondicionEspecialSchema from './cuenta-corriente-condicion-especial-schema';

const sequelize = createConnection(true);

class CuentaCorrienteCondicionEspecialModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("numero"),
		this.getDataValue("idTipoCondicionEspecial"),
		this.getDataValue("idCuenta"),
		this.getDataValue("codigoDelegacion"),
		this.getDataValue("numeroMovimiento"),
		this.getDataValue("numeroPartida"),
		this.getDataValue("numeroComprobante"),
		this.getDataValue("fechaDesde"),
		this.getDataValue("fechaHasta")
	];

}

CuentaCorrienteCondicionEspecialModel.init(CuentaCorrienteCondicionEspecialSchema, {
  sequelize,
  modelName: 'CuentaCorrienteCondicionEspecial',
  tableName: 'cuenta_corriente_condicion_especial',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CuentaCorrienteCondicionEspecialModel;
