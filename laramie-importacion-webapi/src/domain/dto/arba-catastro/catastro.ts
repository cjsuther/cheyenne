export default class Catastro {

    id: number;
	partida: string;
	digitoVerificador: string;
	partido: string;
	circunscripcion: string;
	seccion: string;
	chacra: string;
	letraChacra: string;
	quinta: string;
	letraQuinta: string;
	fraccion: string;
	letraFraccion: string;
	manzana: string;
	letraManzana: string;
	parcela: string;
	letraParcela: string;
	subparcela: string;
	destinatario: string;
	calle: string;
	altura: string;
	piso: string;
	departamento: string;
	barrio: string;
	entreCalle1: string;
	entreCalle2: string;
	localidad: string;
	codigoPostal: string;
	vigencia: Date;
	codigoPostalArgentina: string;
	superficie: number;
	caracteristica: string;
	valorTierra: number;
	superficieEdificada: number;
	valorEdificado: number;
	valor1998: number;
	valorMejoras: number;
	edif1997: number;
	valorFiscal: number;
	mejoras1997: number;
	origen: string;
	motivoMovimiento: string;
	titular: string;
	codigoTitular: string;
	dominioOrigen: string;
	dominioInscripcion: string;
	dominioTipo: string;
	dominioAnio: string;
	unidadesFuncionales: string;
	serie: string;
	cuitResponsable1: string;
	nombreYApellidoResponsable1: string;
	tipoResponsable1: string;
	cuitResponsable2: string;
	nombreYApellidoResponsable2: string;
	tipoResponsable2: string;
	catastralCodigo: string;

	constructor(
        id: number = 0,
		partida: string = "",
		digitoVerificador: string = "",
		partido: string = "",
		circunscripcion: string = "",
		seccion: string = "",
		chacra: string = "",
		letraChacra: string = "",
		quinta: string = "",
		letraQuinta: string = "",
		fraccion: string = "",
		letraFraccion: string = "",
		manzana: string = "",
		letraManzana: string = "",
		parcela: string = "",
		letraParcela: string = "",
		subparcela: string = "",
		destinatario: string = "",
		calle: string = "",
		altura: string = "",
		piso: string = "",
		departamento: string = "",
		barrio: string = "",
		entreCalle1: string = "",
		entreCalle2: string = "",
		localidad: string = "",
		codigoPostal: string = "",
		vigencia: Date = null,
		codigoPostalArgentina: string = "",
		superficie: number = 0,
		caracteristica: string = "",
		valorTierra: number = 0,
		superficieEdificada: number = 0,
		valorEdificado: number = 0,
		valor1998: number = 0,
		valorMejoras: number = 0,
		edif1997: number = 0,
		valorFiscal: number = 0,
		mejoras1997: number = 0,
		origen: string = "",
		motivoMovimiento: string = "",
		titular: string = "",
		codigoTitular: string = "",
		dominioOrigen: string = "",
		dominioInscripcion: string = "",
		dominioTipo: string = "",
		dominioAnio: string = "",
		unidadesFuncionales: string = "",
		serie: string = "",
		cuitResponsable1: string = "",
		nombreYApellidoResponsable1: string = "",
		tipoResponsable1: string = "",
		cuitResponsable2: string = "",
		nombreYApellidoResponsable2: string = "",
		tipoResponsable2: string = "",
		catastralCodigo: string = ""
	)
	{
        this.id = id;
		this.partida = partida;
		this.digitoVerificador = digitoVerificador;
		this.partido = partido;
		this.circunscripcion = circunscripcion;
		this.seccion = seccion;
		this.chacra = chacra;
		this.letraChacra = letraChacra;
		this.quinta = quinta;
		this.letraQuinta = letraQuinta;
		this.fraccion = fraccion;
		this.letraFraccion = letraFraccion;
		this.manzana = manzana;
		this.letraManzana = letraManzana;
		this.parcela = parcela;
		this.letraParcela = letraParcela;
		this.subparcela = subparcela;
		this.destinatario = destinatario;
		this.calle = calle;
		this.altura = altura;
		this.piso = piso;
		this.departamento = departamento;
		this.barrio = barrio;
		this.entreCalle1 = entreCalle1;
		this.entreCalle2 = entreCalle2;
		this.localidad = localidad;
		this.codigoPostal = codigoPostal;
		this.vigencia = vigencia;
		this.codigoPostalArgentina = codigoPostalArgentina;
		this.superficie = superficie;
		this.caracteristica = caracteristica;
		this.valorTierra = valorTierra;
		this.superficieEdificada = superficieEdificada;
		this.valorEdificado = valorEdificado;
		this.valor1998 = valor1998;
		this.valorMejoras = valorMejoras;
		this.edif1997 = edif1997;
		this.valorFiscal = valorFiscal;
		this.mejoras1997 = mejoras1997;
		this.origen = origen;
		this.motivoMovimiento = motivoMovimiento;
		this.titular = titular;
		this.codigoTitular = codigoTitular;
		this.dominioOrigen = dominioOrigen;
		this.dominioInscripcion = dominioInscripcion;
		this.dominioTipo = dominioTipo;
		this.dominioAnio = dominioAnio;
		this.unidadesFuncionales = unidadesFuncionales;
		this.serie = serie;
		this.cuitResponsable1 = cuitResponsable1;
		this.nombreYApellidoResponsable1 = nombreYApellidoResponsable1;
		this.tipoResponsable1 = tipoResponsable1;
		this.cuitResponsable2 = cuitResponsable2;
		this.nombreYApellidoResponsable2 = nombreYApellidoResponsable2;
		this.tipoResponsable2 = tipoResponsable2;
		this.catastralCodigo = catastralCodigo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.partida = row.partida ?? "";
		this.digitoVerificador = row.digitoVerificador ?? "";
		this.partido = row.partido ?? "";
		this.circunscripcion = row.circunscripcion ?? "";
		this.seccion = row.seccion ?? "";
		this.chacra = row.chacra ?? "";
		this.letraChacra = row.letraChacra ?? "";
		this.quinta = row.quinta ?? "";
		this.letraQuinta = row.letraQuinta ?? "";
		this.fraccion = row.fraccion ?? "";
		this.letraFraccion = row.letraFraccion ?? "";
		this.manzana = row.manzana ?? "";
		this.letraManzana = row.letraManzana ?? "";
		this.parcela = row.parcela ?? "";
		this.letraParcela = row.letraParcela ?? "";
		this.subparcela = row.subparcela ?? "";
		this.destinatario = row.destinatario ?? "";
		this.calle = row.calle ?? "";
		this.altura = row.altura ?? "";
		this.piso = row.piso ?? "";
		this.departamento = row.departamento ?? "";
		this.barrio = row.barrio ?? "";
		this.entreCalle1 = row.entreCalle1 ?? "";
		this.entreCalle2 = row.entreCalle2 ?? "";
		this.localidad = row.localidad ?? "";
		this.codigoPostal = row.codigoPostal ?? "";
		this.vigencia = row.vigencia ?? null;
		this.codigoPostalArgentina = row.codigoPostalArgentina ?? "";
		this.superficie = row.superficie ?? 0;
		this.caracteristica = row.caracteristica ?? "";
		this.valorTierra = row.valorTierra ?? 0;
		this.superficieEdificada = row.superficieEdificada ?? 0;
		this.valorEdificado = row.valorEdificado ?? 0;
		this.valor1998 = row.valor1998 ?? 0;
		this.valorMejoras = row.valorMejoras ?? 0;
		this.edif1997 = row.edif1997 ?? 0;
		this.valorFiscal = row.valorFiscal ?? 0;
		this.mejoras1997 = row.mejoras1997 ?? 0;
		this.origen = row.origen ?? "";
		this.motivoMovimiento = row.motivoMovimiento ?? "";
		this.titular = row.titular ?? "";
		this.codigoTitular = row.codigoTitular ?? "";
		this.dominioOrigen = row.dominioOrigen ?? "";
		this.dominioInscripcion = row.dominioInscripcion ?? "";
		this.dominioTipo = row.dominioTipo ?? "";
		this.dominioAnio = row.dominioAnio ?? "";
		this.unidadesFuncionales = row.unidadesFuncionales ?? "";
		this.serie = row.serie ?? "";
		this.cuitResponsable1 = row.cuitResponsable1 ?? "";
		this.nombreYApellidoResponsable1 = row.nombreYApellidoResponsable1 ?? "";
		this.tipoResponsable1 = row.tipoResponsable1 ?? "";
		this.cuitResponsable2 = row.cuitResponsable2 ?? "";
		this.nombreYApellidoResponsable2 = row.nombreYApellidoResponsable2 ?? "";
		this.tipoResponsable2 = row.tipoResponsable2 ?? "";
		this.catastralCodigo = row.catastralCodigo ?? "";
	}

}
