import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CuentaSchema from './cuenta-schema';

const sequelize = createConnection(true);

class CuentaModel extends Model {

    getDataValues = () => [
      this.getDataValue("id"),
      this.getDataValue("numeroCuenta"),
      this.getDataValue("numeroWeb"),
      this.getDataValue("idEstadoCuenta"),
      this.getDataValue("idTipoTributo"),
      this.getDataValue("idTributo"),
      this.getDataValue("fechaAlta"),
      this.getDataValue("fechaBaja"),
      this.getDataValue("idContribuyentePrincipal"),
      this.getDataValue("idDireccionPrincipal"),
      this.getDataValue("idDireccionEntrega")
    ];

}

CuentaModel.init(CuentaSchema, {
  sequelize,
  modelName: 'Cuenta',
  tableName: 'cuenta',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CuentaModel;
