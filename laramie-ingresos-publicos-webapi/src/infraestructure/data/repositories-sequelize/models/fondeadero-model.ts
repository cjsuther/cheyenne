import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import FondeaderoSchema from './fondeadero-schema';

const sequelize = createConnection(true);

class FondeaderoModel extends Model {

    getDataValues = () => [
      this.getDataValue("id"),
      this.getDataValue("idCuenta"),
      this.getDataValue("idEstadoCarga"),
      this.getDataValue("fechaCargaInicio"),
      this.getDataValue("fechaCargaFin"),
      this.getDataValue("idTasa"),
      this.getDataValue("idSubTasa"),
      this.getDataValue("embarcacion"),
      this.getDataValue("superficie"),
      this.getDataValue("longitud"),
      this.getDataValue("codigo"),
      this.getDataValue("club"),
      this.getDataValue("digitoVerificador"),
      this.getDataValue("ubicacion"),
      this.getDataValue("margen"),
      this.getDataValue("fechaAlta")     
    ];

}

FondeaderoModel.init(FondeaderoSchema, {
  sequelize,
  modelName: 'Fondeadero',
  tableName: 'fondeadero',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default FondeaderoModel;
