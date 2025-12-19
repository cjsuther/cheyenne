import Recaudacion from "./recaudacion";

export default class RegistroContable {

    id: number;
	idRegistroContableLote: number;
	idRecaudacion: number;
	fechaIngreso: Date;
	cuentaContable: string;
	jurisdiccion: string;
	recursoPorRubro: string;
	codigoLugarPago: string;
	ejercicio: string;
	codigoFormaPago: string;
	codigoTipoRecuadacion: string;
	importe: number;

	recaudacion: Recaudacion = null;

	constructor(
        id: number = 0,
		idRegistroContableLote: number = 0,
		idRecaudacion: number = 0,
		fechaIngreso: Date = null,
		cuentaContable: string = "",
		jurisdiccion: string = "",
		recursoPorRubro: string = "",
		codigoLugarPago: string = "",
		ejercicio: string = "",
		codigoFormaPago: string = "",
		codigoTipoRecuadacion: string = "",
		importe: number = 0
	)
	{
        this.id = id;
		this.idRegistroContableLote = idRegistroContableLote;
		this.idRecaudacion = idRecaudacion;
		this.fechaIngreso = fechaIngreso;
		this.cuentaContable = cuentaContable;
		this.jurisdiccion = jurisdiccion;
		this.recursoPorRubro = recursoPorRubro;
		this.codigoLugarPago = codigoLugarPago;
		this.ejercicio = ejercicio;
		this.codigoFormaPago = codigoFormaPago;
		this.codigoTipoRecuadacion = codigoTipoRecuadacion;
		this.importe = importe;
	}

	setFromObject = (row) =>
	{
        this.id = row.id ?? 0;
		this.idRegistroContableLote = row.idRegistroContableLote ?? 0;
		this.idRecaudacion = row.idRecaudacion ?? 0;
		this.fechaIngreso = row.fechaIngreso ?? null;
		this.cuentaContable = row.cuentaContable ?? "";
		this.jurisdiccion = row.jurisdiccion ?? "";
		this.recursoPorRubro = row.recursoPorRubro ?? "";
		this.codigoLugarPago = row.codigoLugarPago ?? "";
		this.ejercicio = row.ejercicio ?? "";
		this.codigoFormaPago = row.codigoFormaPago ?? "";
		this.codigoTipoRecuadacion = row.codigoTipoRecuadacion ?? "";
		this.importe = row.importe ?? 0;
	}

}
