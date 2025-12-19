import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import UsuarioSchema from './usuario-schema';

const sequelize = createConnection(true);

class UsuarioModel extends Model {

    getDataValues = () => [
        this.getDataValue("id"),
        this.getDataValue("idTipoUsuario"),
        this.getDataValue("idEstadoUsuario"),
        this.getDataValue("idPersona"),
        this.getDataValue("codigo"),
        this.getDataValue("nombreApellido"),
        this.getDataValue("email"),
        this.getDataValue("fechaAlta"),
        this.getDataValue("fechaBaja")
    ];

}

UsuarioModel.init(UsuarioSchema, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'usuario',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default UsuarioModel;
