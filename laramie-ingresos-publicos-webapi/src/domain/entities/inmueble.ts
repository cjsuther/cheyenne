
export default class Inmueble {

    id: number;
    idCuenta: number;
    idEstadoCarga: number;
    fechaCargaInicio: Date;
    fechaCargaFin: Date;
    catastralCir: string;
    catastralSec: string;
    catastralChacra: string;
    catastralLchacra: string;
    catastralQuinta: string;
    catastralLquinta: string;
    catastralFrac: string;
    catastralLfrac: string;
    catastralManz: string;
    catastralLmanz: string;
    catastralParc: string;
    catastralLparc: string;
    catastralSubparc: string;
    catastralUfunc: string;
    catastralUcomp: string;
    catastralRtasPrv: string;
    tributoManz: string;
    tributoLote: string;
    tributoEsquina: boolean;

    constructor(
        id: number = 0,
        idCuenta: number = 0,
        idEstadoCarga: number = 0,
        fechaCargaInicio: Date = null,
        fechaCargaFin: Date = null,
        catastralCir: string = "",
        catastralSec: string = "",
        catastralChacra: string = "",
        catastralLchacra: string = "",
        catastralQuinta: string = "",
        catastralLquinta: string = "",    
        catastralFrac: string = "",
        catastralLfrac: string = "",
        catastralManz: string = "",
        catastralLmanz: string = "",
        catastralParc: string = "",
        catastralLparc: string = "",
        catastralSubparc: string = "",
        catastralUfunc: string = "",
        catastralUcomp: string = "",
        catastralRtasPrv: string = "",
        tributoManz: string = "",
        tributoLote: string = "",
        tributoEsquina: boolean = false)
    {
        this.id = id;
        this.idCuenta = idCuenta;
        this.idEstadoCarga = idEstadoCarga;
        this.fechaCargaInicio = fechaCargaInicio;
        this.fechaCargaFin = fechaCargaFin;
        this.catastralCir = catastralCir;
        this.catastralSec = catastralSec;
        this.catastralChacra = catastralChacra,
        this.catastralLchacra = catastralLchacra,
        this.catastralQuinta = catastralQuinta,
        this.catastralLquinta = catastralLquinta,
        this.catastralFrac = catastralFrac;
        this.catastralLfrac = catastralLfrac;
        this.catastralManz = catastralManz;
        this.catastralLmanz = catastralLmanz;
        this.catastralParc = catastralParc;
        this.catastralLparc = catastralLparc;
        this.catastralSubparc = catastralSubparc;
        this.catastralUfunc = catastralUfunc;
        this.catastralUcomp = catastralUcomp;
        this.catastralRtasPrv = catastralRtasPrv;
        this.tributoManz = tributoManz;
        this.tributoLote = tributoLote;
        this.tributoEsquina = tributoEsquina;        
    }

    setFromObject = (row) =>
    {
        this.id = row.id ?? 0;
        this.idCuenta = row.idCuenta ?? 0;
        this.idEstadoCarga = row.idEstadoCarga ?? 0;
        this.fechaCargaInicio = row.fechaCargaInicio ?? null;
        this.fechaCargaFin = row.fechaCargaFin ?? null;
        this.catastralCir = row.catastralCir ?? "";
        this.catastralSec = row.catastralSec ?? "";
        this.catastralChacra = row.catastralChacra ?? "";
        this.catastralLchacra = row.catastralLchacra ?? "";
        this.catastralQuinta = row.catastralQuinta ?? "";
        this.catastralLquinta = row.catastralLquinta ?? "";        
        this.catastralFrac = row.catastralFrac ?? "";
        this.catastralLfrac = row.catastralLfrac ?? "";
        this.catastralManz = row.catastralManz ?? "";
        this.catastralLmanz = row.catastralLmanz ?? "";
        this.catastralParc = row.catastralParc ?? "";
        this.catastralLparc = row.catastralLparc ?? "";
        this.catastralSubparc = row.catastralSubparc ?? "";
        this.catastralUfunc = row.catastralUfunc ?? "";
        this.catastralUcomp = row.catastralUcomp ?? "";
        this.catastralRtasPrv = row.catastralRtasPrv ?? "";
        this.tributoManz = row.tributoManz ?? "";
        this.tributoLote = row.tributoLote ?? "";
        this.tributoEsquina = row.tributoEsquina ?? false;
    }
    
}
