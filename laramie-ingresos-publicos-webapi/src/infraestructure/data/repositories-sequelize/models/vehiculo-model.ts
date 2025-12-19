import { Model, Op } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import VehiculoSchema from './vehiculo-schema';

const sequelize = createConnection(true);

class VehiculoModel extends Model {

    getDataValues = () => [
      this.getDataValue("id"),
      this.getDataValue("idCuenta"),
      this.getDataValue("idEstadoCarga"),
      this.getDataValue("fechaCargaInicio"),
      this.getDataValue("fechaCargaFin"), 
      this.getDataValue("dominio"),
      this.getDataValue("dominioAnterior"),
      this.getDataValue("anioModelo"),
      this.getDataValue("marca"),
      this.getDataValue("codigoMarca"),
      this.getDataValue("modelo"),
      this.getDataValue("idIncisoVehiculo"),
      this.getDataValue("idTipoVehiculo"),
      this.getDataValue("idCategoriaVehiculo"),
      this.getDataValue("numeroMotor"),
      this.getDataValue("marcaMotor"),
      this.getDataValue("numeroChasis"),
      this.getDataValue("serieMotor"),
      this.getDataValue("legajo"),
      parseFloat(this.getDataValue("valuacion")),
      this.getDataValue("peso"),
      this.getDataValue("carga"),
      this.getDataValue("cilindrada"),
      this.getDataValue("idOrigenFabricacion"),
      this.getDataValue("idCombustible"),
      this.getDataValue("idUsoVehiculo"),
      this.getDataValue("idMotivoBajaVehiculo"),
      this.getDataValue("recupero"),
      this.getDataValue("radicacionAnterior"),
      this.getDataValue("fechaAlta"),
      this.getDataValue("fechaPatentamiento"),
      this.getDataValue("fechaRadicacion"),
      this.getDataValue("fechaTransferencia"),
      this.getDataValue("fechaCompra"),
      this.getDataValue("fechaBaja"),
      this.getDataValue("fechaHabilitacionDesde"),
      this.getDataValue("fechaHabilitacionHasta"),
      this.getDataValue("fechaDDJJ")          
    ];

}

VehiculoModel.init(VehiculoSchema, {
  sequelize,
  modelName: 'Vehiculo',
  tableName: 'vehiculo',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default VehiculoModel;
