import { FixedWidth, FixedWidthConvertible } from "fixed-width-ts-decorator";
import { DeudaPeriodoArba } from "./deuda-periodo-arba";
import { DeudaMoratoriaArba } from "./deuda-moratoria-arba.";

export class DeudaDTO extends FixedWidthConvertible {
    @FixedWidth({ start: 0, width: 6 })
    dominioAnterior: string;

    @FixedWidth({ start: 8, width: 6 })
    dominio: string;

    @FixedWidth({ start: 14, width: 3 })
    nroMunicipio: number;

    @FixedWidth({ start: 17, width: 1 })
    moratoriaVigente: string;

    @FixedWidth({ start: 18, width: 780 })
    periodos: string;

    @FixedWidth({ start: 798, width: 280 })
    moratorias: string;

    @FixedWidth({ start: 1078, width: 1 })
    tituloEjecutivo: string;

    deudasPeriodoArba: DeudaPeriodoArba[] = [];
    
    deudasMoratoriaArba: DeudaMoratoriaArba[] = [];
}