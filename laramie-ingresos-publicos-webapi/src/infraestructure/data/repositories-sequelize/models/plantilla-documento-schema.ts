import { DataTypes } from 'sequelize';

const PlantillaDocumentoSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idTipoPlantillaDocumento: {
		field: 'id_tipo_plantilla_documento',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	nombre: {
		field: 'nombre',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	path: {
		field: 'path',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idUsuario: {
		field: 'id_usuario',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fecha: {
		field: 'fecha',
		type: DataTypes.DATE,
		allowNull: false
	}
};

export default PlantillaDocumentoSchema;
