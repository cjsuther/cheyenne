export default class TipoConstruccionFuneraria {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	conVencimiento: boolean;
	plazoMaxConcesion: number;
	terminoConcesion1: number;
	terminoConcesion2: number;
	plazoMaxRenovacion: number;
	terminoRenovacion1: number;
	terminoRenovacion2: number;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		conVencimiento: boolean = false,
		plazoMaxConcesion: number = 0,
		terminoConcesion1: number = 0,
		terminoConcesion2: number = 0,
		plazoMaxRenovacion: number = 0,
		terminoRenovacion1: number = 0,
		terminoRenovacion2: number = 0
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.conVencimiento = conVencimiento;
		this.plazoMaxConcesion = plazoMaxConcesion;
		this.terminoConcesion1 = terminoConcesion1;
		this.terminoConcesion2 = terminoConcesion2;
		this.plazoMaxRenovacion = plazoMaxRenovacion;
		this.terminoRenovacion1 = terminoRenovacion1;
		this.terminoRenovacion2 = terminoRenovacion2;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.conVencimiento = row.conVencimiento ?? false;
		this.plazoMaxConcesion = row.plazoMaxConcesion ?? 0;
		this.terminoConcesion1 = row.terminoConcesion1 ?? 0;
		this.terminoConcesion2 = row.terminoConcesion2 ?? 0;
		this.plazoMaxRenovacion = row.plazoMaxRenovacion ?? 0;
		this.terminoRenovacion1 = row.terminoRenovacion1 ?? 0;
		this.terminoRenovacion2 = row.terminoRenovacion2 ?? 0;
	}

}
