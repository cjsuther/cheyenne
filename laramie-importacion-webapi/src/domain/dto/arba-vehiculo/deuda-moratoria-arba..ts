import { FixedWidth, FixedWidthConvertible } from "fixed-width-ts-decorator";

export class DeudaMoratoriaArba extends FixedWidthConvertible {
    id: number;
    
    @FixedWidth({ start: 0, width: 4 })
    moratoria: string;

    @FixedWidth({ start: 4, width: 10 })
    monto: number;

    constructor(id: number = 0, moratoria: string = "", monto: number = 0) {
        super();
        this.id = id;
        this.moratoria = moratoria;
        this.monto = monto;
    }

    // Método para inicializar desde un objeto, como en el caso de VinculoVehiculo
    setFromObject(row) {
        this.id = row.id ?? 0;
        this.moratoria = row.moratoria ?? "";
        this.monto = row.monto ?? 0;
    }
}