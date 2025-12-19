import CajaModel from './caja-model';
import CajaAsignacionModel from './caja-asignacion-model';

CajaAsignacionModel.belongsTo(CajaModel, {
  as: 'caja',
  foreignKey: 'idCaja',
  targetKey: 'id'
});

CajaModel.belongsTo(CajaAsignacionModel, {
  as: 'cajaAsignacion',
  foreignKey: 'idCajaAsignacionActual',
  targetKey: 'id'
});
