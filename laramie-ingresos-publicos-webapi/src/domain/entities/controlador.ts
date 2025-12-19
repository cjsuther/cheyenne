import TipoControlador from "./tipo-controlador";

export default class Controlador {

    id: number;
	idTipoControlador: number;
	numero: string;
	esSupervisor: boolean;
	fechaAlta: Date;
	fechaBaja: Date;
	catastralCir: string;
	catastralSec: string;
	catastralChacra: string;
	catastralLchacra: string;
	catastralQuinta: string;
	catastralLquinta: string;
	catastralFrac: string;
	catastralLfrac: string;
	catastralManz: string;
	catastralLmanz: string;
	catastralParc: string;
	catastralLparc: string;
	catastralSubparc: string;
	catastralUfunc: string;
	catastralUcomp: string;
	idPersona: number;
	idTipoPersona: number;
	nombrePersona: string;
	idTipoDocumento: number;
	numeroDocumento: string;
	legajo: string;
	idOrdenamiento: number;
	idControladorSupervisor: number;
	clasificacion: string;
	fechaUltimaIntimacion: Date;
	cantidadIntimacionesEmitidas: number;
	cantidadIntimacionesAnuales: number;
	porcentaje: number;

	tipoControlador: TipoControlador;

	constructor(
        id: number = 0,
		idTipoControlador: number = 0,
		numero: string = "",
		esSupervisor: boolean = false,
		fechaAlta: Date = null,
		fechaBaja: Date = null,
		catastralCir: string = "",
		catastralSec: string = "",
		catastralChacra: string = "",
		catastralLchacra: string = "",
		catastralQuinta: string = "",
		catastralLquinta: string = "",
		catastralFrac: string = "",
		catastralLfrac: string = "",
		catastralManz: string = "",
		catastralLmanz: string = "",
		catastralParc: string = "",
		catastralLparc: string = "",
		catastralSubparc: string = "",
		catastralUfunc: string = "",
		catastralUcomp: string = "",
		idPersona: number = 0,
		idTipoPersona: number = 0,
		nombrePersona: string = "",
		idTipoDocumento: number = 0,
		numeroDocumento: string = "",
		legajo: string = "",
		idOrdenamiento: number = 0,
		idControladorSupervisor: number = 0,
		clasificacion: string = "",
		fechaUltimaIntimacion: Date = null,
		cantidadIntimacionesEmitidas: number = 0,
		cantidadIntimacionesAnuales: number = 0,
		porcentaje: number = 0,
		tipoControlador: TipoControlador = null
	)
	{
        this.id = id;
		this.idTipoControlador = idTipoControlador;
		this.numero = numero;
		this.esSupervisor = esSupervisor;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
		this.catastralCir = catastralCir;
		this.catastralSec = catastralSec;
		this.catastralChacra = catastralChacra;
		this.catastralLchacra = catastralLchacra;
		this.catastralQuinta = catastralQuinta;
		this.catastralLquinta = catastralLquinta;
		this.catastralFrac = catastralFrac;
		this.catastralLfrac = catastralLfrac;
		this.catastralManz = catastralManz;
		this.catastralLmanz = catastralLmanz;
		this.catastralParc = catastralParc;
		this.catastralLparc = catastralLparc;
		this.catastralSubparc = catastralSubparc;
		this.catastralUfunc = catastralUfunc;
		this.catastralUcomp = catastralUcomp;
		this.idPersona = idPersona;
		this.idTipoPersona = idTipoPersona;
		this.nombrePersona = nombrePersona;
		this.idTipoDocumento = idTipoDocumento;
		this.numeroDocumento = numeroDocumento;
		this.legajo = legajo;
		this.idOrdenamiento = idOrdenamiento;
		this.idControladorSupervisor = idControladorSupervisor;
		this.clasificacion = clasificacion;
		this.fechaUltimaIntimacion = fechaUltimaIntimacion;
		this.cantidadIntimacionesEmitidas = cantidadIntimacionesEmitidas;
		this.cantidadIntimacionesAnuales = cantidadIntimacionesAnuales;
		this.porcentaje = porcentaje;
		this.tipoControlador = tipoControlador;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idTipoControlador = row.idTipoControlador ?? 0;
		this.numero = row.numero ?? "";
		this.esSupervisor = row.esSupervisor ?? false;
		this.fechaAlta = row.fechaAlta ?? null;
		this.fechaBaja = row.fechaBaja ?? null;
		this.catastralCir = row.catastralCir ?? "";
		this.catastralSec = row.catastralSec ?? "";
		this.catastralChacra = row.catastralChacra ?? "";
		this.catastralLchacra = row.catastralLchacra ?? "";
		this.catastralQuinta = row.catastralQuinta ?? "";
		this.catastralLquinta = row.catastralLquinta ?? "";
		this.catastralFrac = row.catastralFrac ?? "";
		this.catastralLfrac = row.catastralLfrac ?? "";
		this.catastralManz = row.catastralManz ?? "";
		this.catastralLmanz = row.catastralLmanz ?? "";
		this.catastralParc = row.catastralParc ?? "";
		this.catastralLparc = row.catastralLparc ?? "";
		this.catastralSubparc = row.catastralSubparc ?? "";
		this.catastralUfunc = row.catastralUfunc ?? "";
		this.catastralUcomp = row.catastralUcomp ?? "";
		this.idPersona = row.idPersona ?? 0;
		this.idTipoPersona = row.idTipoPersona ?? 0;
		this.nombrePersona = row.nombrePersona ?? "";
		this.idTipoDocumento = row.idTipoDocumento ?? 0;
		this.numeroDocumento = row.numeroDocumento ?? "";
		this.legajo = row.legajo ?? "";
		this.idOrdenamiento = row.idOrdenamiento ?? 0;
		this.idControladorSupervisor = row.idControladorSupervisor ?? 0;
		this.clasificacion = row.clasificacion ?? "";
		this.fechaUltimaIntimacion = row.fechaUltimaIntimacion ?? null;
		this.cantidadIntimacionesEmitidas = row.cantidadIntimacionesEmitidas ?? 0;
		this.cantidadIntimacionesAnuales = row.cantidadIntimacionesAnuales ?? 0;
		this.porcentaje = row.porcentaje ?? 0;
		this.tipoControlador = row.tipoControlador?? null;
	}

}
