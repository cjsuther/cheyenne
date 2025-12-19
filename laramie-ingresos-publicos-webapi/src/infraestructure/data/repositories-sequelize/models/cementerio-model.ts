import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import CementerioSchema from './cementerio-schema';

const sequelize = createConnection(true);

class CementerioModel extends Model {

    getDataValues = () => [
      this.getDataValue("id"),
      this.getDataValue("idCuenta"),
      this.getDataValue("idEstadoCarga"),
      this.getDataValue("fechaCargaInicio"),
      this.getDataValue("fechaCargaFin"),  
      this.getDataValue("idTipoConstruccionFuneraria"),
      this.getDataValue("idCementerio"),
      this.getDataValue("circunscripcionCementerio"),
      this.getDataValue("seccionCementerio"),
      this.getDataValue("manzanaCementerio"),
      this.getDataValue("parcelaCementerio"),
      this.getDataValue("frenteCementerio"),
      this.getDataValue("filaCementerio"),
      this.getDataValue("numeroCementerio"),
      this.getDataValue("fechaAlta"),
      this.getDataValue("fechaBaja"),
      this.getDataValue("fechaPresentacion"),
      this.getDataValue("digitoVerificador"),
      this.getDataValue("fechaConcesion"),
      this.getDataValue("fechaEscritura"),
      this.getDataValue("fechaSucesion"),
      this.getDataValue("libroEscritura"),
      this.getDataValue("folioEscritura"),
      this.getDataValue("numeroSucesion"),
      parseFloat(this.getDataValue("superficie")),
      parseFloat(this.getDataValue("largo")),
      parseFloat(this.getDataValue("ancho"))
    ];

}

CementerioModel.init(CementerioSchema, {
  sequelize,
  modelName: 'Cementerio',
  tableName: 'cementerio',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default CementerioModel;
