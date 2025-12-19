import { DataTypes } from 'sequelize';

const RegistroContableSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idRegistroContableLote: {
		field: 'id_registro_contable_lote',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idRecaudacion: {
		field: 'id_recaudacion',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	fechaIngreso: {
		field: 'fecha_ingreso',
		type: DataTypes.DATE,
		allowNull: false
	},
	cuentaContable: {
		field: 'cuenta_contable',
		type: DataTypes.STRING(350),
		allowNull: false
	},
	jurisdiccion: {
		field: 'jurisdiccion',
		type: DataTypes.STRING(350),
		allowNull: false
	},
	recursoPorRubro: {
		field: 'recurso_por_rubro',
		type: DataTypes.STRING(350),
		allowNull: false
	},
	codigoLugarPago: {
		field: 'codigo_lugar_pago',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	ejercicio: {
		field: 'ejercicio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	codigoFormaPago: {
		field: 'codigo_forma_pago',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	codigoTipoRecuadacion: {
		field: 'codigo_tipo_recuadacion',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	importe: {
		field: 'importe',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default RegistroContableSchema;
