import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import InmuebleSchema from './inmueble-schema';

const sequelize = createConnection(true);

class InmuebleModel extends Model {

    getDataValues = () => [
      this.getDataValue("id"),
      this.getDataValue("idCuenta"),
      this.getDataValue("idEstadoCarga"),
      this.getDataValue("fechaCargaInicio"),
      this.getDataValue("fechaCargaFin"),
      this.getDataValue("catastralCir"),
      this.getDataValue("catastralSec"),
      this.getDataValue("catastralChacra"),
      this.getDataValue("catastralLchacra"),
      this.getDataValue("catastralQuinta"),
      this.getDataValue("catastralLquinta"),     
      this.getDataValue("catastralFrac"),
      this.getDataValue("catastralLfrac"),
      this.getDataValue("catastralManz"),
      this.getDataValue("catastralLmanz"),
      this.getDataValue("catastralParc"),
      this.getDataValue("catastralLparc"),
      this.getDataValue("catastralSubparc"),
      this.getDataValue("catastralUfunc"),
      this.getDataValue("catastralUcomp"),
      this.getDataValue("catastralRtasPrv"),
      this.getDataValue("tributoManz"),
      this.getDataValue("tributoLote"),
      this.getDataValue("tributoEsquina")      
    ];

}

InmuebleModel.init(InmuebleSchema, {
  sequelize,
  modelName: 'Inmueble',
  tableName: 'inmueble',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default InmuebleModel;
