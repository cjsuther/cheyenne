import { DataTypes } from 'sequelize';

const ObraInmuebleDetalleSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	idObraInmueble: {
		field: 'id_obra_inmueble',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idTipoObra: {
		field: 'id_tipo_obra',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idDestinoObra: {
		field: 'id_destino_obra',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idFormaPresentacionObra: {
		field: 'id_forma_presentacion_obra',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	idFormaCalculoObra: {
		field: 'id_forma_calculo_obra',
		type: DataTypes.BIGINT,
		allowNull: false
	},
	sujetoDemolicion: {
		field: 'sujeto_demolicion',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	generarSuperficie: {
		field: 'generar_superficie',
		type: DataTypes.BOOLEAN,
		allowNull: false
	},
	tipoSuperficie: {
		field: 'tipo_superficie',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	descripcion: {
		field: 'descripcion',
		type: DataTypes.STRING(1000),
		allowNull: false
	},
	valor: {
		field: 'valor',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	alicuota: {
		field: 'alicuota',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	metros: {
		field: 'metros',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	montoPresupuestado: {
		field: 'monto_presupuestado',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	montoCalculado: {
		field: 'monto_calculado',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	}
};

export default ObraInmuebleDetalleSchema;
