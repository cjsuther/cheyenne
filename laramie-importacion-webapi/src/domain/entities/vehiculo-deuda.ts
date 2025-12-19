
export default class VehiculoDeuda {

    idCuenta: number;
    dominio: string;
    dominioAnterior: string;
    periodo: string;
    cuota: number;
    fechaVencimiento: Date;
    numeroPartida: number;
    idTasa: number;
    idSubTasa: number;
    importeSaldo: number;

    constructor(
        idCuenta: number = 0,
        dominio: string = "",
        dominioAnterior: string = "",
        periodo: string = "",
        cuota: number = 0,
        fechaVencimiento: Date = null,
        numeroPartida: number = 0,
        idTasa: number = 0,
        idSubTasa: number = 0,
        importeSaldo: number = 0
        )
    {
        this.idCuenta = idCuenta;
        this.dominio = dominio;
        this.dominioAnterior = dominioAnterior;
        this.periodo = periodo;
        this.cuota = cuota;
        this.fechaVencimiento = fechaVencimiento;
        this.numeroPartida = numeroPartida;
        this.idTasa = idTasa;
        this.idSubTasa = idSubTasa;
        this.importeSaldo = importeSaldo;
    }
    
}
