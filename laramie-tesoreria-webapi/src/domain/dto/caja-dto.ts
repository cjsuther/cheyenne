import Caja from '../entities/caja';
import CajaAsignacion from '../entities/caja-asignacion';
import MovimientoCajaDto from './movimiento-caja-dto';

export default class CajaDto {

    caja: Caja;
    asignacion: CajaAsignacion;
    movimientos: MovimientoCajaDto[];

    constructor(
        caja: Caja = null,
        asignacion: CajaAsignacion = null,
        movimientos: MovimientoCajaDto[] = []
        )
    {
        this.caja = caja;
        this.asignacion = asignacion;
        this.movimientos = movimientos;
    }
    
}
