import ProcedimientoParametro from "./procedimiento-parametro";
import ProcedimientoVariable from "./procedimiento-variable";

export default class Procedimiento {

	id: number;
	idEstadoProcedimiento: number;
	idTipoTributo: number;
	nombre: string;
	descripcion: string;
	idUsuarioCreacion: number;
	fechaCreacion: Date;

	procedimientoParametros: Array<ProcedimientoParametro>;
	procedimientoVariables: Array<ProcedimientoVariable>;

	constructor(
		id: number = 0,
		idEstadoProcedimiento: number = 0,
		idTipoTributo: number = 0,
		nombre: string = "",
		descripcion: string = "",
		idUsuarioCreacion: number = 0,
		fechaCreacion: Date = null,
		procedimientoParametros: Array<ProcedimientoParametro> = [],
		procedimientoVariables: Array<ProcedimientoVariable> = []
	)
	{
        this.id = id;
		this.idEstadoProcedimiento = idEstadoProcedimiento;
		this.idTipoTributo = idTipoTributo;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.idUsuarioCreacion = idUsuarioCreacion;
		this.fechaCreacion = fechaCreacion;
		this.procedimientoParametros = procedimientoParametros;
		this.procedimientoVariables = procedimientoVariables;
	}

	setFromObject = (row) =>
	{
		this.id = row.id ?? 0;
		this.idEstadoProcedimiento = row.idEstadoProcedimiento ?? 0;
		this.idTipoTributo = row.idTipoTributo ?? 0;
		this.nombre = row.nombre ?? "";
		this.descripcion = row.descripcion ?? "";
		this.idUsuarioCreacion = row.idUsuarioCreacion ?? 0;
		this.fechaCreacion = row.fechaCreacion ?? null;
	}

}
