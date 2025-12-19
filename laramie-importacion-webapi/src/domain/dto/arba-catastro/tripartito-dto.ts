import { FixedWidth, FixedWidthConvertible } from "fixed-width-ts-decorator";

export class TripartitoDTO extends FixedWidthConvertible {
    @FixedWidth({ start: 0, width: 3 })
    partido: string;

    @FixedWidth({ start: 3, width: 6 })
    partida: string;

    @FixedWidth({ start: 9, width: 1 })
    digitoVerificador: string;

    @FixedWidth({ start: 10, width: 2 })
    circunscripcion: string;

    @FixedWidth({ start: 12, width: 2 })
    seccion: string;

    @FixedWidth({ start: 14, width: 4 })
    chacra: string;

    @FixedWidth({ start: 18, width: 3 })
    letraChacra: string;

    @FixedWidth({ start: 21, width: 4 })
    quinta: string;

    @FixedWidth({ start: 25, width: 3 })
    letraQuinta: string;

    @FixedWidth({ start: 28, width: 4 })
    fraccion: string;

    @FixedWidth({ start: 32, width: 3 })
    letraFraccion: string;

    @FixedWidth({ start: 35, width: 4 })
    manzana: string;

    @FixedWidth({ start: 39, width: 3 })
    letraManzana: string;

    @FixedWidth({ start: 42, width: 4 })
    parcela: string;

    @FixedWidth({ start: 46, width: 3 })
    letraParcela: string;

    @FixedWidth({ start: 49, width: 6 })
    subparcela: string;

    @FixedWidth({ start: 55, width: 33 })
    destinatario: string;

    @FixedWidth({ start: 88, width: 45 })
    calle: string;

    @FixedWidth({ start: 133, width: 30 })
    barrio: string;

    @FixedWidth({ start: 163, width: 5 })
    altura: string;

    @FixedWidth({ start: 168, width: 3 })
    puerta: string;

    @FixedWidth({ start: 171, width: 3 })
    piso: string;

    @FixedWidth({ start: 174, width: 4 })
    departamento: string;

    @FixedWidth({ start: 178, width: 4 })
    codigoPostal: string;

    @FixedWidth({ start: 182, width: 8 })
    codigoPostalArgentina: string;

    @FixedWidth({ start: 190, width: 30 })
    localidad: string;

    @FixedWidth({ start: 220, width: 8 })
    fechaActividadVigente: string;

    vigencia: Date;

    @FixedWidth({ start: 228, width: 1 })
    caracteristica: string;

    @FixedWidth({ start: 229, width: 9 })
    superficie: number;

    @FixedWidth({ start: 238, width: 9 })
    valorTierraHistoricoEntero: number;

    @FixedWidth({ start: 247, width: 4 })
    valorTierraHistoricoDecimales: number;

    valor1998: number;

    @FixedWidth({ start: 251, width: 9 })
    valorTierraVigenteEntero: number;

    @FixedWidth({ start: 260, width: 4 })
    valorTierraVigenteDecimales: number;

    valorTierra: number;

    @FixedWidth({ start: 264, width: 9 })
    valorEdificadoHistoricoEntero: number;

    @FixedWidth({ start: 273, width: 4 })
    valorEdificadoHistoricoDecimales: number;

    edif1997: number;

    @FixedWidth({ start: 277, width: 9 })
    valorEdificadoVigenteEntero: number;

    @FixedWidth({ start: 286, width: 4 })
    valorEdificadoVigenteDecimales: number;

    valorEdificado: number;

    @FixedWidth({ start: 290, width: 1 })
    motivoMovimiento: string;

    @FixedWidth({ start: 291, width: 9 })
    origen: string;

    @FixedWidth({ start: 300, width: 20 })
    titular: string;

    @FixedWidth({ start: 320, width: 2 })
    codigoTitular: string;

    @FixedWidth({ start: 322, width: 3 })
    dominioOrigen: string;

    @FixedWidth({ start: 325, width: 6 })
    dominioInscripcion: string;

    @FixedWidth({ start: 331, width: 1 })
    dominioTipo: string;

    @FixedWidth({ start: 332, width: 6 })
    unidadesFuncionales: string;

    @FixedWidth({ start: 338, width: 4 })
    dominioAnio: string;

    @FixedWidth({ start: 342, width: 1 })
    serie: string;

    @FixedWidth({ start: 343, width: 9 })
    superficieEdificada: number;

    @FixedWidth({ start: 352, width: 11 })
    cuitResponsable1: string;

    @FixedWidth({ start: 363, width: 80 })
    nombreYApellidoResponsable1: string;

    @FixedWidth({ start: 443, width: 20 })
    tipoResponsable1: string;

    @FixedWidth({ start: 463, width: 11 })
    cuitResponsable2: string;

    @FixedWidth({ start: 474, width: 80 })
    nombreYApellidoResponsable2: string;

    @FixedWidth({ start: 554, width: 20 })
    tipoResponsable2: string;
}