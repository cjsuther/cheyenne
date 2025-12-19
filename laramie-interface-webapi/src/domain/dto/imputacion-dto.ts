import CuentaContable from "../entities/cuenta-contable";
import Jurisdiccion from "../entities/jurisdiccion";
import RecursoPorRubro from "../entities/recurso-por-rubro";
import SubTasaDTO from "./sub-tasa-dto";

export default class ImputacionDTO {

    relaciones: SubTasaDTO[];
    definicionesCuentaContable: CuentaContable[];
    definicionesJurisdiccion: Jurisdiccion[];
    definicionesRecursoPorRubro: RecursoPorRubro[];

    constructor(
        relaciones: SubTasaDTO[] = [],
        definicionesCuentaContable: CuentaContable[] = [],
        definicionesJurisdiccion: Jurisdiccion[] = [],
        definicionesRecursoPorRubro: RecursoPorRubro[] = []
    )
    {
        this.relaciones = relaciones;
        this.definicionesCuentaContable = definicionesCuentaContable;
        this.definicionesJurisdiccion = definicionesJurisdiccion;
        this.definicionesRecursoPorRubro = definicionesRecursoPorRubro;
    }
    
}
