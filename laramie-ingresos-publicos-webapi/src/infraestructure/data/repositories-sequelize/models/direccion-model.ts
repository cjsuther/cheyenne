import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import DireccionSchema from './direccion-schema';

const sequelize = createConnection(true);

class DireccionModel extends Model {

    getDataValues = () => [
      this.getDataValue("id"),
      this.getDataValue("entidad"),
      this.getDataValue("idEntidad"),
      this.getDataValue("idTipoGeoreferencia"),
      this.getDataValue("idPais"),
      this.getDataValue("idProvincia"),
      this.getDataValue("idLocalidad"),
      this.getDataValue("idZonaGeoreferencia"),
      this.getDataValue("codigoPostal"),
      this.getDataValue("calle"),
      this.getDataValue("entreCalle1"),
      this.getDataValue("entreCalle2"),
      this.getDataValue("altura"),
      this.getDataValue("piso"),
      this.getDataValue("dpto"),
      this.getDataValue("referencia"),
      this.getDataValue("longitud"),
      this.getDataValue("latitud")      
    ];

}

DireccionModel.init(DireccionSchema, {
  sequelize,
  modelName: 'Direccion',
  tableName: 'direccion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default DireccionModel;
