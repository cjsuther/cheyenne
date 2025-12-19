export default class LadoTerrenoObra {

    id: number;
	idLadoTerreno: number;
	idObra: number;
	importe: number;
	reduccionMetros: number;
	reduccionSuperficie: number;
	fecha: Date;

	constructor(
        id: number = 0,
		idLadoTerreno: number = 0,
		idObra: number = 0,
		importe: number = 0,
		reduccionMetros: number = 0,
		reduccionSuperficie: number = 0,
		fecha: Date = null
	)
	{
        this.id = id;
		this.idLadoTerreno = idLadoTerreno;
		this.idObra = idObra;
		this.importe = importe;
		this.reduccionMetros = reduccionMetros;
		this.reduccionSuperficie = reduccionSuperficie;
		this.fecha = fecha;
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
	}

}
