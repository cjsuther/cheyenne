import { DataTypes } from 'sequelize';

const VerificacionSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idInhumado: {
		field: 'id_inhumado',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fecha: {
		field: 'fecha',
		type: DataTypes.DATE,
		allowNull: false
	},
	motivoVerificacion: {
		field: 'motivo_verificacion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	idTipoDocumentoVerificador: {
		field: 'id_tipo_documento_verificador',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	numeroDocumentoVerificador: {
		field: 'numero_documento_verificador',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	apellidoVerificador: {
		field: 'apellido_verificador',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	nombreVerificador: {
		field: 'nombre_verificador',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	idResultadoVerificacion: {
		field: 'id_resultado_verificacion',
		type: DataTypes.BIGINT,
		allowNull: false
	}
};

export default VerificacionSchema;
