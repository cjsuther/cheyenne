import LadoTerrenoObra from "../entities/lado-terreno-obra";

export default class LadoTerrenoObraState extends LadoTerrenoObra {

    state: string;

	constructor(
        id: number = 0,
		idLadoTerreno: number = 0,
		idObra: number = 0,
		importe: number = 0,
		reduccionMetros: number = 0,
		reduccionSuperficie: number = 0,
		fecha: Date = null,
		state: string = "o"
	)
	{
        super(id, idLadoTerreno, idObra, importe, reduccionMetros, reduccionSuperficie, fecha);
		this.state = state;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idLadoTerreno = row.idLadoTerreno ?? 0;
		this.idObra = row.idObra ?? 0;
		this.importe = row.importe ?? 0;
		this.reduccionMetros = row.reduccionMetros ?? 0;
		this.reduccionSuperficie = row.reduccionSuperficie ?? 0;
		this.fecha = row.fecha ?? null;
		this.state = row.state ?? "o";
	}

}
