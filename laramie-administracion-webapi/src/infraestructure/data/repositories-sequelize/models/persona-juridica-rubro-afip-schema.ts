import { DataTypes } from 'sequelize';

const PersonaJuridicaRubroAfipSchema = {
    idPersonaJuridica: {
        field: 'id_persona_juridica',
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    idRubroAfip: {
        field: 'id_rubro_afip',
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
};

export default PersonaJuridicaRubroAfipSchema; 