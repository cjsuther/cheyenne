import { FixedWidth, FixedWidthConvertible } from "fixed-width-ts-decorator";
import { CoPropietarioDTO } from "./co-propietario-dto";

export class PropietarioDTO extends FixedWidthConvertible {
    @FixedWidth({ start: 0, width: 6 })
    dominioAnterior: string;

    @FixedWidth({ start: 8, width: 6 })
    dominio: string;

    @FixedWidth({ start: 14, width: 3 })
    nroMunicipio: string;

    @FixedWidth({ start: 17, width: 804 })
    propietarios: string;

    coPropietarios: CoPropietarioDTO[] = [];
}