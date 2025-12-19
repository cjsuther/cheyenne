import moment from 'moment';
import { isEmpty, isNull } from "./validator";

export function getDateNow(withTime = false) {
    if (withTime)
        return new Date();
    else
        return new Date((new Date()).toDateString());
}

export function truncateTime(date) {
    if (date)
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    else
        return null;
}

export function getDateToString(date, withTime = false) {
    if (date) {
        if (withTime)
            return moment(date).format('DD/MM/YYYY HH:mm:ss');
        else
            return moment(date).format('DD/MM/YYYY');
    }
    else {
        return '';
    }
}

export function getDateSerialize(date) {
    if (date) {
        return moment(date).format('YYYY-MM-DDTHH:mm:ssZ');
    }
    else {
        return '';
    }
}

export function getDateId() {
    const date = new Date();
    return moment(date).format('YYYYMMDDHHmmss');
}

export function getParseDecimalToString(value: number) {
    return Math.round((value - Math.trunc(value)) * 100).toString() + '/100';
}

export function iif(value1, value2, value3) {
    return (value1 === value2) ? value3 : value1;
}

export function iifNull(value1, value2) {
    return (!isNull(value1)) ? value2 : value1;
}

export function castDataType(value, dataType, valueIsNull = "") {
    if (isNull(value)) return valueIsNull;

    switch(dataType) {
        case "string":
            return value.toString();
        case "number":
            parseInt(value);
        case "decimal":
            return parseFloat(value);
        case "boolean":
            return (value.toString() === 'true');
        case "date":
            return (value !== '') ? new Date(value) : null;
        default:
            return value;
    }
}

export function getCatastral(row, withLabels = false, nomenclaturaCatastral = "SSSSSSSSSSSSSSS") {
    try {
        let catastral = "";
        if (withLabels) {
            if (nomenclaturaCatastral[0] == "S") catastral += " Cir: " + ((!isEmpty(row.catastralCir)) ?  row.catastralCir : "0");
            if (nomenclaturaCatastral[1] == "S") catastral += " Sec: " + ((!isEmpty(row.catastralSec)) ?  row.catastralSec : "0");
            if (nomenclaturaCatastral[2] == "S")  catastral += " Chacra: " + ((!isEmpty(row.catastralChacra)) ?  row.catastralChacra : "0");
            if (nomenclaturaCatastral[3] == "S")  catastral += " L.Chacra: " + ((!isEmpty(row.catastralLchacra)) ?  row.catastralLchacra : "0");
            if (nomenclaturaCatastral[4] == "S")  catastral += " Quinta: " + ((!isEmpty(row.catastralQuinta)) ?  row.catastralQuinta : "0");
            if (nomenclaturaCatastral[5] == "S")  catastral += " L.Quinta: " + ((!isEmpty(row.catastralLquinta)) ?  row.catastralLquinta : "0");        
            if (nomenclaturaCatastral[6] == "S")  catastral += " Frac: " + ((!isEmpty(row.catastralFrac)) ?  row.catastralFrac : "0");
            if (nomenclaturaCatastral[7] == "S")  catastral += " L.Frac: " + ((!isEmpty(row.catastralLfrac)) ?  row.catastralLfrac : "0");
            if (nomenclaturaCatastral[8] == "S")  catastral += " Manz: " + ((!isEmpty(row.catastralManz)) ?  row.catastralManz : "0");
            if (nomenclaturaCatastral[9] == "S")  catastral += " L.Manz: " + ((!isEmpty(row.catastralLmanz)) ?  row.catastralLmanz : "0");
            if (nomenclaturaCatastral[10] == "S")  catastral += " Parc: " + ((!isEmpty(row.catastralParc)) ?  row.catastralParc : "0");
            if (nomenclaturaCatastral[11] == "S")  catastral += " L.Parc: " + ((!isEmpty(row.catastralLparc)) ?  row.catastralLparc : "0");
            if (nomenclaturaCatastral[12] == "S")  catastral += " Subparc: " + ((!isEmpty(row.catastralSubparc)) ?  row.catastralSubparc : "0");
            if (nomenclaturaCatastral[13] == "S")  catastral += " U.Func: " + ((!isEmpty(row.catastralUfunc)) ?  row.catastralUfunc : "0");
            if (nomenclaturaCatastral[14] == "S")  catastral += " U.Comp: " + ((!isEmpty(row.catastralUcomp)) ?  row.catastralUcomp : "0");
            if (catastral.length > 0) catastral = catastral.substring(1);
        }
        else {
            if (nomenclaturaCatastral[0] == "S")  catastral += (!isEmpty(row.catastralCir)) ? '-' + row.catastralCir : "-0";
            if (nomenclaturaCatastral[1] == "S")  catastral += (!isEmpty(row.catastralSec)) ? '-' + row.catastralSec : "-0";
            if (nomenclaturaCatastral[2] == "S")  catastral += (!isEmpty(row.catastralChacra)) ? '-' + row.catastralChacra : "-0";
            if (nomenclaturaCatastral[3] == "S")  catastral += (!isEmpty(row.catastralLchacra)) ? '-' + row.catastralLchacra : "-0";
            if (nomenclaturaCatastral[4] == "S")  catastral += (!isEmpty(row.catastralQuinta)) ? '-' + row.catastralQuinta : "-0";
            if (nomenclaturaCatastral[5] == "S")  catastral += (!isEmpty(row.catastralLquinta)) ? '-' + row.catastralLquinta : "-0";        
            if (nomenclaturaCatastral[6] == "S")  catastral += (!isEmpty(row.catastralFrac)) ? '-' + row.catastralFrac : "-0";
            if (nomenclaturaCatastral[7] == "S")  catastral += (!isEmpty(row.catastralLfrac)) ? '-' + row.catastralLfrac : "-0";
            if (nomenclaturaCatastral[8] == "S")  catastral += (!isEmpty(row.catastralManz)) ? '-' + row.catastralManz : "-0";
            if (nomenclaturaCatastral[9] == "S")  catastral += (!isEmpty(row.catastralLmanz)) ? '-' + row.catastralLmanz : "-0";
            if (nomenclaturaCatastral[10] == "S")  catastral += (!isEmpty(row.catastralParc)) ? '-' + row.catastralParc : "-0";
            if (nomenclaturaCatastral[11] == "S")  catastral += (!isEmpty(row.catastralLparc)) ? '-' + row.catastralLparc : "-0";
            if (nomenclaturaCatastral[12] == "S")  catastral += (!isEmpty(row.catastralSubparc)) ? '-' + row.catastralSubparc : "-0";
            if (nomenclaturaCatastral[13] == "S")  catastral += (!isEmpty(row.catastralUfunc)) ? '-' + row.catastralUfunc : "-0";
            if (nomenclaturaCatastral[14] == "S")  catastral += (!isEmpty(row.catastralUcomp)) ? '-' + row.catastralUcomp : "-0";
            if (catastral.length > 0) catastral = catastral.substring(1);
        }

        return catastral;
    }
    catch {
        return "";
    }
}

export function getDireccion(row) {
    try {
        let direccion = "";
        if (!isEmpty(row.calle)) {
            direccion += row.calle;
            direccion += (!isEmpty(row.altura)) ? ' ' + row.altura : "";
            direccion += (!isEmpty(row.piso)) ? ' ' + row.piso : "";
            direccion += (!isEmpty(row.dpto)) ? ' ' + row.dpto : "";
            direccion += (!isEmpty(row.codigoPostal)) ? ' (CP: ' + row.codigoPostal + ')' : "";
        }
        else if (!isEmpty(row.referencia)) {
            direccion = row.referencia;
        }

        return direccion;
    }
    catch {
        return "";
    }
}

let convert_precision = 0;
let convert_formatter = null;
export function getFormatNumber(value, precision) {
    if (!convert_formatter || convert_precision !== precision) {
        convert_precision = precision;
        convert_formatter = new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: convert_precision,
            maximumFractionDigits: convert_precision,
        });
    }
    return convert_formatter.format(value);
}

export function precisionRound(number, precision = 2, ignoreLessThan = 0) {
    var factor = Math.pow(10, precision);
    var result = Math.round(number * factor) / factor;
    return (ignoreLessThan > 0 && Math.abs(result) < ignoreLessThan) ? 0 : result;
}

export function castPublicError(err) {
    return {
        name: err.name,
        message: err.message,
        stack: err.stack,
        parentMessage: (err.originError) ? err.originError.message : undefined,
        parentError: err.originError
    };
}
