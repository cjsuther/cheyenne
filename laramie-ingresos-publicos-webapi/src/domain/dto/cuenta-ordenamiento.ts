
export default class CuentaOrdenamiento {

    idEmisionEjecucionCuenta: number;
    numero: number;
    numeroCuenta: string;
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
    inmCalle: string;
    inmAltura: string;
    inmPiso: string;
    inmDpto: string;
    inmReferencia: string;
    zonCalle: string;
    zonAltura: string;
    zonPiso: string;
    zonDpto: string;
    email: string; 
    idControlador: number;

    constructor(
        idEmisionEjecucionCuenta: number = 0,
        numero: number = 0,
        numeroCuenta: string = "",
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
        inmCalle: string = "",
        inmAltura: string = "",
        inmPiso: string = "",
        inmDpto: string = "",
        inmReferencia: string = "",
        zonCalle: string = "",
        zonAltura: string = "",
        zonPiso: string = "",
        zonDpto: string = "",
        email: string = "",
        idControlador: number = 0)
    {
        this.idEmisionEjecucionCuenta = idEmisionEjecucionCuenta;
        this.numero = numero;
        this.numeroCuenta = numeroCuenta;
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
        this.inmCalle = inmCalle;
        this.inmAltura = inmAltura;
        this.inmPiso = inmPiso;
        this.inmDpto = inmDpto;
        this.inmReferencia = inmReferencia;
        this.zonCalle = zonCalle;
        this.zonAltura = zonAltura;
        this.zonPiso = zonPiso;
        this.zonDpto = zonDpto;
        this.email = email;
        this.idControlador = idControlador;
    }
    
}
