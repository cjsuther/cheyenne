import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import SubTasaImputacionSchema from './sub-tasa-imputacion-schema';

const sequelize = createConnection(true);

class SubTasaImputacionModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idTasa"),
		this.getDataValue("idSubTasa"),
		this.getDataValue("ejercicio"),
		this.getDataValue("idTipoCuota"),
		this.getDataValue("idCuentaContable"),
		this.getDataValue("idCuentaContableAnterior"),
		this.getDataValue("idCuentaContableFutura"),
		this.getDataValue("idJurisdiccionActual"),
		this.getDataValue("idRecursoPorRubroActual"),
		this.getDataValue("idJurisdiccionAnterior"),
		this.getDataValue("idRecursoPorRubroAnterior"),
		this.getDataValue("idJurisdiccionFutura"),
		this.getDataValue("idRecursoPorRubroFutura")
	];

}

SubTasaImputacionModel.init(SubTasaImputacionSchema, {
  sequelize,
  modelName: 'SubTasaImputacion',
  tableName: 'sub_tasa_imputacion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default SubTasaImputacionModel;
