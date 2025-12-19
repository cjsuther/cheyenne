import Catastro from "../entities/catastro";
export default class CatastroState extends Catastro {

    state: string;

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
		state: string = ""
	)
	{
        super(id, partida, digitoVerificador, partido, circunscripcion, seccion, chacra, letraChacra, quinta, letraQuinta, fraccion, letraFraccion, manzana, letraManzana, parcela, letraParcela, subparcela, destinatario, calle, altura, piso, departamento, barrio, entreCalle1, entreCalle2, localidad, codigoPostal, vigencia, codigoPostalArgentina, superficie, caracteristica, valorTierra, superficieEdificada, valorEdificado, valor1998, valorMejoras, edif1997, valorFiscal, mejoras1997, origen, motivoMovimiento, titular, codigoTitular, dominioOrigen, dominioInscripcion, dominioTipo, dominioAnio, unidadesFuncionales, serie);
		this.state = state;
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
		this.state = row.state ?? "o";
	}

}
