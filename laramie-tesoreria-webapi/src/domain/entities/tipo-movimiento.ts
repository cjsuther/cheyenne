export default class TipoMovimiento {

    id: number;
	codigo: string;
	nombre: string;
	orden: number;
	actEmitido: boolean;
	automatico: boolean;
	autonumerado: boolean;
	numero: number;
	imputacion: string;
	tipo: string;

	constructor(
        id: number = 0,
		codigo: string = "",
		nombre: string = "",
		orden: number = 0,
		actEmitido: boolean = false,
		automatico: boolean = false,
		autonumerado: boolean = false,
		numero: number = 0,
		imputacion: string = "",
		tipo: string = ""
	)
	{
        this.id = id;
		this.codigo = codigo;
		this.nombre = nombre;
		this.orden = orden;
		this.actEmitido = actEmitido;
		this.automatico = automatico;
		this.autonumerado = autonumerado;
		this.numero = numero;
		this.imputacion = imputacion;
		this.tipo = tipo;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.codigo = row.codigo ?? "";
		this.nombre = row.nombre ?? "";
		this.orden = row.orden ?? 0;
		this.actEmitido = row.actEmitido ?? false;
		this.automatico = row.automatico ?? false;
		this.autonumerado = row.autonumerado ?? false;
		this.numero = row.numero ?? 0;
		this.imputacion = row.imputacion ?? "";
		this.tipo = row.tipo ?? "";
	}

}
