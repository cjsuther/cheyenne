import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EspecialSchema from './especial-schema';

const sequelize = createConnection(true);

class EspecialModel extends Model {

    getDataValues = () => [
      this.getDataValue("id"),
      this.getDataValue("idCuenta"),
      this.getDataValue("idEstadoCarga"),
      this.getDataValue("fechaCargaInicio"),
      this.getDataValue("fechaCargaFin"),     
    ];

}

EspecialModel.init(EspecialSchema, {
  sequelize,
  modelName: 'Especial',
  tableName: 'especial',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EspecialModel;
