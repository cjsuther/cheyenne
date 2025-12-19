import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EmisionEjecucionCuentaSchema from './emision-ejecucion-cuenta-schema';
import EmisionCalculoResultadoModel from './emision-calculo-resultado-model';
import EmisionConceptoResultadoModel from './emision-concepto-resultado-model';
import EmisionCuentaCorrienteResultadoModel from './emision-cuenta-corriente-resultado-model';
import EmisionImputacionContableResultadoModel from './emision-imputacion-contable-resultado-model';
import EmisionEjecucionCuotaModel from './emision-ejecucion-cuota-model';

const sequelize = createConnection(true);

class EmisionEjecucionCuentaModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idEmisionEjecucion"),
		this.getDataValue("idCuenta"),
		this.getDataValue("idEstadoEmisionEjecucionCuenta"),
		this.getDataValue("numeroBloque"),
		this.getDataValue("numero"),
		this.getDataValue("observacion")
	];

}

EmisionEjecucionCuentaModel.init(EmisionEjecucionCuentaSchema, {
  sequelize,
  modelName: 'EmisionEjecucionCuenta',
  tableName: 'emision_ejecucion_cuenta',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

EmisionEjecucionCuentaModel.hasMany(EmisionEjecucionCuotaModel, { as: 'emisionEjecucionCuota', foreignKey: 'idEmisionEjecucionCuenta' });
EmisionEjecucionCuentaModel.hasMany(EmisionCalculoResultadoModel, { as: 'emisionCalculoResultado', foreignKey: 'idEmisionEjecucionCuenta' });
EmisionEjecucionCuentaModel.hasMany(EmisionConceptoResultadoModel, { as: 'emisionConceptoResultado', foreignKey: 'idEmisionEjecucionCuenta' });
EmisionEjecucionCuentaModel.hasMany(EmisionCuentaCorrienteResultadoModel, { as: 'emisionCuentaCorrienteResultado', foreignKey: 'idEmisionEjecucionCuenta' });
EmisionEjecucionCuentaModel.hasMany(EmisionImputacionContableResultadoModel, { as: 'emisionImputacionContableResultado', foreignKey: 'idEmisionEjecucionCuenta' });

EmisionEjecucionCuotaModel.belongsTo(EmisionEjecucionCuentaModel, { as: 'emisionEjecucionCuenta', foreignKey: 'idEmisionEjecucionCuenta' });

export default EmisionEjecucionCuentaModel;
