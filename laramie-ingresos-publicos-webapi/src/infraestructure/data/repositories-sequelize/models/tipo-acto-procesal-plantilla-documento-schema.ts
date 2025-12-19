import { DataTypes } from 'sequelize';

const TipoActoProcesalPlantillaDocumentoSchema = {
	idTipoActoProcesal: {
		field: 'id_tipo_acto_procesal',
		type: DataTypes.BIGINT,
		primaryKey: true,
		allowNull: false
	},
	idPlantillaDocumento: {
		field: 'id_plantilla_documento',
		type: DataTypes.BIGINT,
		primaryKey: true,
		allowNull: false
	}
};

export default TipoActoProcesalPlantillaDocumentoSchema;
