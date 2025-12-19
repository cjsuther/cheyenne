import { FixedWidth, FixedWidthConvertible } from "fixed-width-ts-decorator";

export class CoPropietarioDTO extends FixedWidthConvertible {
    @FixedWidth({ start: 0, width: 30 })
    nombreYApellido: string;

    @FixedWidth({ start: 30, width: 11 })
    cuit: string;

    @FixedWidth({ start: 41, width: 4 })
    codigoPostal: string;

    @FixedWidth({ start: 45, width: 17 })
    localidad: string;

    @FixedWidth({ start: 62, width: 30 })
    calle: string;

    @FixedWidth({ start: 92, width: 5 })
    numero: number;

    @FixedWidth({ start: 97, width: 3 })
    piso: string;

    @FixedWidth({ start: 100, width: 4 })
    departamento: string;

    @FixedWidth({ start: 104, width: 3 })
    telefonoCaracteristicaInternacional: string;

    @FixedWidth({ start: 107, width: 6 })
    telefonoCodigoDeArea: string;

    @FixedWidth({ start: 113, width: 12 })
    telefonoNumero: string;

    @FixedWidth({ start: 125, width: 1 })
    tipoDocumento: string;

    @FixedWidth({ start: 126, width: 8 })
    nroDocumento: string;
}