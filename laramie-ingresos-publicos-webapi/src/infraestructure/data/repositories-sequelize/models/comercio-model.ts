import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import ComercioSchema from './comercio-schema';

const sequelize = createConnection(true);

class ComercioModel extends Model {

    getDataValues = () => [
      this.getDataValue("id"),
      this.getDataValue("idCuenta"),
      this.getDataValue("idEstadoCarga"),
      this.getDataValue("fechaCargaInicio"),
      this.getDataValue("fechaCargaFin"),     
      this.getDataValue("idRubro"),
      this.getDataValue("idCuentaInmueble"),
      this.getDataValue("nombreFantasia"),
      this.getDataValue("digitoVerificador"),
      this.getDataValue("granContribuyente")
    ];

}

ComercioModel.init(ComercioSchema, {
  sequelize,
  modelName: 'Comercio',
  tableName: 'comercio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default ComercioModel;
