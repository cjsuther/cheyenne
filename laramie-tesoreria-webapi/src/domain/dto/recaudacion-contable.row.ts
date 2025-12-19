export default class RecaudacionContableRow {

    periodo: string;
    ejercicio: string;
    codigoTasa: string;
    codigoSubTasa: string;
    agrupamientoJurisdiccion: string;
    descripcionJurisdiccion: string;
    agrupamientoCuenta: string;
    descripcionCuenta: string;
    importe: number;

    constructor(
        periodo: string = "",
        ejercicio: string = "",
        codigoTasa: string = "",
        codigoSubTasa: string = "",
        agrupamientoJurisdiccion: string = "",
        descripcionJurisdiccion: string = "",
        agrupamientoCuenta: string = "",
        descripcionCuenta: string = "",
        importe: number = 0
    ) {
        this.periodo = periodo;
        this.ejercicio = ejercicio;
        this.codigoTasa = codigoTasa;
        this.codigoSubTasa = codigoSubTasa;
        this.agrupamientoJurisdiccion = agrupamientoJurisdiccion;
        this.descripcionJurisdiccion = descripcionJurisdiccion;
        this.agrupamientoCuenta = agrupamientoCuenta;
        this.descripcionCuenta = descripcionCuenta;
        this.importe = importe;
    }

}
