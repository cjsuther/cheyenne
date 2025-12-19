import { Model } from 'sequelize';
import { createConnection } from '../connections/db-connection';
import PersonaJuridicaRubroAfipSchema from './persona-juridica-rubro-afip-schema';
import PersonaJuridicaModel from './persona-juridica-model';
import ListaModel from './lista-model';

const sequelize = createConnection(true);

class PersonaJuridicaRubroAfipModel extends Model {

    getDataValues = () => [
        this.getDataValue("idPersonaJuridica"),
        this.getDataValue("idPerfil")
    ];
}

PersonaJuridicaRubroAfipModel.init(PersonaJuridicaRubroAfipSchema, {
  sequelize,
  modelName: 'PersonaJuridicaRubroAfip',
  tableName: 'persona_juridica_rubro_afip',
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false
});

PersonaJuridicaModel.hasMany(PersonaJuridicaRubroAfipModel, { as: 'personaJuridicaRubroAfip', foreignKey: 'idPersonaJuridica' });
ListaModel.hasMany(PersonaJuridicaRubroAfipModel, { as: 'personaJuridicaRubroAfip', foreignKey: 'idRubroAfip' });


export default PersonaJuridicaRubroAfipModel;