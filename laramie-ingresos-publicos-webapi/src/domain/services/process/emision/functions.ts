export default class CodeFunctions {

    constructor() {
    }

    AccionAnd = (...condiciones) => {
        for(let i=0; i<condiciones.length; i++) {
            if (!condiciones[i]) return false;
        }
        return true;
    };

    AccionOr = (...condiciones) => {
        for(let i=0; i<condiciones.length; i++) {
            if (condiciones[i]) return true;
        }
        return false;
    };

    AccionXOr = (...condiciones) => {
        let result = 0;
        for(let i=0; i<condiciones.length; i++) {
            if (condiciones[i]) result++;
        }
        return (result === 1);
    };

    AccionCondicional = (condicion, valor01, valor02) => {
        if (condicion) {
            return valor01;
        }
        else {
            return valor02;
        }
    };

    AccionProcesaLista = (lista:any, func_valor:any) => {
        return lista.map(fields => func_valor(fields));
    }

    SumaLista = (lista:any) => {
        let suma = 0;
        lista.forEach(x => suma += x);
        return suma;
    }

    MaxLista = (lista:any) => {
        let max = null;
        lista.forEach(x => {if (max === null || x > max) max = x;});
        return max;
    }

    MinLista = (lista:any) => {
        let min = null;
        lista.forEach(x => {if (min === null || x < min) min = x;});
        return min;
    }
    
    ConvertirFecha = (dia:number, mes:number, anio:number) => {
        const result = new Date(anio, (mes - 1), dia);
        return result;
    };
        
    Promedio = (valor01:number, valor02:number) => {
        const result:number = (valor01 + valor02 / 2);
        return result;
    };

    Redondeo = (valor:number, precision:number) => {
        return valor.toFixed(precision);
    };

    NroEnLista = (valor:any, lista:string) => {
        return (lista.indexOf(valor.toString()) >= 0);
    };

    getFunctions = (data: any) => {
    
        const result = {
            AccionAnd: this.AccionAnd,
            AccionOr: this.AccionOr,
            AccionXOr: this.AccionXOr,
            AccionCondicional: this.AccionCondicional,
            AccionProcesaLista: this.AccionProcesaLista,
            SumaLista: this.SumaLista,
            MaxLista: this.MaxLista,
            MinLista: this.MinLista,
            Promedio: this.Promedio,
            Redondeo: this.Redondeo,
            ConvertirFecha: this.ConvertirFecha,
            NroEnLista: this.NroEnLista,
            CuotaEjecucionNumero: () => data["CuotaEjecucionNumero"],
            CuotaEjecucionFechaVencimiento1: () => data["CuotaEjecucionFechaVencimiento1"],
            CuotaEjecucionFechaVencimiento2: () => data["CuotaEjecucionFechaVencimiento2"],
            CuotaEjecucionCantidad: () => data["CuotaEjecucionCantidad"]
        };
    
        return result;
    }
    
}

