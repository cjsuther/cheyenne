import { DataTypes } from 'sequelize';

const CatastroSchema = {
	id: {
		field: 'id',
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	partida: {
		field: 'partida',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	digitoVerificador: {
		field: 'digito_verificador',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	partido: {
		field: 'partido',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	circunscripcion: {
		field: 'circunscripcion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	seccion: {
		field: 'seccion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	chacra: {
		field: 'chacra',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	letraChacra: {
		field: 'letra_chacra',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	quinta: {
		field: 'quinta',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	letraQuinta: {
		field: 'letra_quinta',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	fraccion: {
		field: 'fraccion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	letraFraccion: {
		field: 'letra_fraccion',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	manzana: {
		field: 'manzana',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	letraManzana: {
		field: 'letra_manzana',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	parcela: {
		field: 'parcela',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	letraParcela: {
		field: 'letra_parcela',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	subparcela: {
		field: 'subparcela',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	destinatario: {
		field: 'destinatario',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	calle: {
		field: 'calle',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	altura: {
		field: 'altura',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	piso: {
		field: 'piso',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	departamento: {
		field: 'departamento',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	barrio: {
		field: 'barrio',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	entreCalle1: {
		field: 'entre_calle1',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	entreCalle2: {
		field: 'entre_calle2',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	localidad: {
		field: 'localidad',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	codigoPostal: {
		field: 'codigo_postal',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	vigencia: {
		field: 'vigencia',
		type: DataTypes.DATE,
		allowNull: true
	},
	codigoPostalArgentina: {
		field: 'codigo_postal_argentina',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	superficie: {
		field: 'superficie',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	caracteristica: {
		field: 'caracteristica',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	valorTierra: {
		field: 'valor_tierra',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	superficieEdificada: {
		field: 'superficie_edificada',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	valorEdificado: {
		field: 'valor_edificado',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	valor1998: {
		field: 'valor1998',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	valorMejoras: {
		field: 'valor_mejoras',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	edif1997: {
		field: 'edif1997',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	valorFiscal: {
		field: 'valor_fiscal',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	mejoras1997: {
		field: 'mejoras1997',
		type: DataTypes.DECIMAL(18,2),
		allowNull: false
	},
	origen: {
		field: 'origen',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	motivoMovimiento: {
		field: 'motivo_movimiento',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	titular: {
		field: 'titular',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	codigoTitular: {
		field: 'codigo_titular',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	dominioOrigen: {
		field: 'dominio_origen',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	dominioInscripcion: {
		field: 'dominio_inscripcion',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	dominioTipo: {
		field: 'dominio_tipo',
		type: DataTypes.STRING(250),
		allowNull: false
	},
	dominioAnio: {
		field: 'dominio_anio',
		type: DataTypes.STRING(20),
		allowNull: false
	},
	unidadesFuncionales: {
		field: 'unidades_funcionales',
		type: DataTypes.STRING(50),
		allowNull: false
	},
	serie: {
		field: 'serie',
		type: DataTypes.STRING(50),
		allowNull: false
	}
};

export default CatastroSchema;
