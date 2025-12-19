import { FixedWidth, FixedWidthConvertible } from "fixed-width-ts-decorator";

export class DenunciaDTO extends FixedWidthConvertible {
    @FixedWidth({ start: 0, width: 3 })
    nroMunicipio: number;

    @FixedWidth({ start: 3, width: 6 })
    dominioAnterior: string;

    @FixedWidth({ start: 11, width: 6 })
    dominio: string;

    @FixedWidth({ start: 17, width: 35 })
    calle: string;

    @FixedWidth({ start: 52, width: 15 })
    numero: number;

    @FixedWidth({ start: 67, width: 30 })
    localidad: string;

    @FixedWidth({ start: 97, width: 8 })
    codigoPostalLargo: string;

    @FixedWidth({ start: 105, width: 4 })
    codigoPostalCorto: number;

    @FixedWidth({ start: 109, width: 31 })
    nombreYApellido: string;
}