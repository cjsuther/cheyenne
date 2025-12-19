export default class TipoRubroComercio {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	agrupamiento: string;
	fechaBaja: Date;
	facturable: boolean;
	generico: boolean;
	categoria: string;
	importeMinimo: number;
	alicuota: number;
	regimenGeneral: boolean;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		agrupamiento: string = "",
		fechaBaja: Date = null,
		facturable: boolean = false,
		generico: boolean = false,
		categoria: string = "",
		importeMinimo: number = 0,
		alicuota: number = 0,
		regimenGeneral: boolean = true
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.agrupamiento = agrupamiento;
		this.fechaBaja = fechaBaja;
		this.facturable = facturable;
		this.generico = generico;
		this.categoria = categoria;
		this.importeMinimo = importeMinimo;
		this.alicuota = alicuota;
		this.regimenGeneral = regimenGeneral;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.agrupamiento = row.agrupamiento ?? "";
		this.fechaBaja = row.fechaBaja ?? null;
		this.facturable = row.facturable ?? false;
		this.generico = row.generico ?? false;
		this.categoria = row.categoria ?? "";
		this.importeMinimo = row.importeMinimo ?? 0;
		this.alicuota = row.alicuota ?? 0;
		this.regimenGeneral = row.regimenGeneral ?? true;
	}

}
