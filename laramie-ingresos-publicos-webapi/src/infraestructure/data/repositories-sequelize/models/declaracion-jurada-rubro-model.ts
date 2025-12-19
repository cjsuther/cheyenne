import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import DeclaracionJuradaRubroSchema from './declaracion-jurada-rubro-schema';

const sequelize = createConnection(true);

class DeclaracionJuradaRubroModel extends Model {

	getDataValues = () => [
		this.getDataValue("id"),
		this.getDataValue("idDeclaracionJuradaComercio"),
		this.getDataValue("idRubroComercio"),
		parseFloat(this.getDataValue("importeIngresosBrutos")),
		parseFloat(this.getDataValue("importeDeducciones")),
		parseFloat(this.getDataValue("importeIngresosNetos"))
	];

}

DeclaracionJuradaRubroModel.init(DeclaracionJuradaRubroSchema, {
  sequelize,
  modelName: 'DeclaracionJuradaRubro',
  tableName: 'declaracion_jurada_rubro',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default DeclaracionJuradaRubroModel;
