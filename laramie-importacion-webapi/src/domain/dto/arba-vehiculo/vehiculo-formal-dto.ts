import { FixedWidth, FixedWidthConvertible } from "fixed-width-ts-decorator";

export class VehiculoFormalDTO extends FixedWidthConvertible {
    @FixedWidth({ start: 0, width: 6 })
    dominioAnterior: string;

    @FixedWidth({ start: 8, width: 6 })
    dominio: string;

    @FixedWidth({ start: 14, width: 5 })
    registro: string;

    @FixedWidth({ start: 19, width: 3 })
    nroMunicipio: string;

    @FixedWidth({ start: 22, width: 28 })
    descripcionMunicipio: string;

    @FixedWidth({ start: 50, width: 8 })
    fechaUltimaDDJJ: string;

    @FixedWidth({ start: 58, width: 8 })
    fechaAlta: string;

    @FixedWidth({ start: 66, width: 8 })
    fechaTributacion: string;

    @FixedWidth({ start: 74, width: 4 })
    anioModelo: string;

    @FixedWidth({ start: 78, width: 2 })
    tipoVehiculo: string;

    @FixedWidth({ start: 80, width: 1 })
    usoVehiculo: number;

    @FixedWidth({ start: 81, width: 5 })
    peso: string;

    @FixedWidth({ start: 86, width: 5 })
    carga: string;

    @FixedWidth({ start: 91, width: 7 })
    codigoMarca: string;

    @FixedWidth({ start: 98, width: 1 })
    codigoRecupero: string;

    @FixedWidth({ start: 99, width: 1 })
    nacionalidad: string;

    @FixedWidth({ start: 100, width: 1 })
    categoria: number;

    @FixedWidth({ start: 101, width: 2 })
    inciso: string;

    @FixedWidth({ start: 103, width: 8 })
    fechaBaja: string;

    @FixedWidth({ start: 111, width: 1 })
    codigoBaja: string;

    @FixedWidth({ start: 112, width: 12 })
    marcaMotor: string;

    @FixedWidth({ start: 124, width: 12 })
    serieMotor: string;

    @FixedWidth({ start: 136, width: 17 })
    nroMotor: string;

    @FixedWidth({ start: 153, width: 17 })
    nroChasis: string;

    @FixedWidth({ start: 170, width: 1 })
    tipoCombustible: string;

    @FixedWidth({ start: 171, width: 30 })
    marca: string;

    @FixedWidth({ start: 201, width: 60 })
    modelo: string;

    @FixedWidth({ start: 261, width: 4 })
    anioCalculoCuota: number;

    @FixedWidth({ start: 265, width: 8 })
    importeCuotaEntero: number;

    @FixedWidth({ start: 273, width: 2 })
    importeCuotaDecimales: number;

    @FixedWidth({ start: 275, width: 8 })
    importeAnualEntero: number;

    @FixedWidth({ start: 283, width: 2 })
    importeAnualDecimales: number;

    @FixedWidth({ start: 285, width: 8 })
    baseImponible: number;

    @FixedWidth({ start: 293, width: 8 })
    valuacionSeguros: number;

    @FixedWidth({ start: 301, width: 4 })
    codigoPostal: string;

    @FixedWidth({ start: 305, width: 17 })
    localidad: string;

    @FixedWidth({ start: 322, width: 30 })
    calle: string;

    @FixedWidth({ start: 352, width: 5 })
    numero: number;

    @FixedWidth({ start: 357, width: 3 })
    piso: string;

    @FixedWidth({ start: 360, width: 4 })
    departamento: string;

    @FixedWidth({ start: 364, width: 30 })
    destinatario: string;

    @FixedWidth({ start: 394, width: 8 })
    fechaMovimientoPostal: string;

    @FixedWidth({ start: 402, width: 3 })
    telefonoCaracteristicaInternacional: string;

    @FixedWidth({ start: 405, width: 6 })
    telefonoCodigoDeArea: string;

    @FixedWidth({ start: 411, width: 12 })
    telefonoNumero: string;

    @FixedWidth({ start: 423, width: 11 })
    cuitPostal: string;
}