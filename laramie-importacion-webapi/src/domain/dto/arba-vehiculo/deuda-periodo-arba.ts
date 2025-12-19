import { FixedWidth, FixedWidthConvertible } from "fixed-width-ts-decorator";

export class DeudaPeriodoArba extends FixedWidthConvertible {
    id: number;
    
    @FixedWidth({ start: 0, width: 6 })
    periodo: string;

    @FixedWidth({ start: 6, width: 10 })
    montoOriginal: number;

    @FixedWidth({ start: 16, width: 10 })
    montoActual: number;

    constructor(id: number = 0, periodo: string = "", montoOriginal: number = 0, montoActual: number = 0) {
        super();
        this.id = id;
        this.periodo = periodo;
        this.montoOriginal = montoOriginal;
        this.montoActual = montoActual;
    }

    setFromObject(row) {
        this.id = row.id ?? 0;
        this.periodo = row.periodo ?? "";
        this.montoOriginal = row.montoOriginal ?? 0;
        this.montoActual = row.montoActual ?? 0;
    }
}
