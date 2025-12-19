import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import EntidadDefinicionSchema from './entidad-definicion-schema';

const sequelize = createConnection(true);

class EntidadModel extends Model {

    getDataValues = () => [
        this.getDataValue("id"),
        this.getDataValue("tipo"),
        this.getDataValue("descripcion"),
        this.getDataValue("nombre1"),
        this.getDataValue("nombre2"),
        this.getDataValue("nombre3"),
        this.getDataValue("nombre4"),
        this.getDataValue("nombre5"),
        this.getDataValue("nombre6"),
        this.getDataValue("nombre7"),
        this.getDataValue("nombre8"),
        this.getDataValue("nombre9"),
        this.getDataValue("nombre10"),
        this.getDataValue("descripcion1"),
        this.getDataValue("descripcion2"),
        this.getDataValue("descripcion3"),
        this.getDataValue("descripcion4"),
        this.getDataValue("descripcion5"),
        this.getDataValue("descripcion6"),
        this.getDataValue("descripcion7"),
        this.getDataValue("descripcion8"),
        this.getDataValue("descripcion9"),
        this.getDataValue("descripcion10"),
        this.getDataValue("tipoDato1"),
        this.getDataValue("tipoDato2"),
        this.getDataValue("tipoDato3"),
        this.getDataValue("tipoDato4"),
        this.getDataValue("tipoDato5"),
        this.getDataValue("tipoDato6"),
        this.getDataValue("tipoDato7"),
        this.getDataValue("tipoDato8"),
        this.getDataValue("tipoDato9"),
        this.getDataValue("tipoDato10"),
        this.getDataValue("obligatorio1"),
        this.getDataValue("obligatorio2"),
        this.getDataValue("obligatorio3"),
        this.getDataValue("obligatorio4"),
        this.getDataValue("obligatorio5"),
        this.getDataValue("obligatorio6"),
        this.getDataValue("obligatorio7"),
        this.getDataValue("obligatorio8"),
        this.getDataValue("obligatorio9"),
        this.getDataValue("obligatorio10")
    ];

}

EntidadModel.init(EntidadDefinicionSchema, {
  sequelize,
  modelName: 'EntidadDefinicion',
  tableName: 'entidad_definicion',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

export default EntidadModel;
