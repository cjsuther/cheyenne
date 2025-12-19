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

export function trimZero(value) {
    return parseInt(value).toString();
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

export function getDateToMajor(date, withTime = false) {
    if (!date) date = new Date(1900,0,1);
    if (!withTime) date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return moment(date).format('DD/MM/YYYY hh:mm:ss a').replace('am', 'a. m.').replace('pm', 'p. m.');
}

export function getDateFromMajor(dateMajor) {
    if (isEmpty(dateMajor) || dateMajor === "01/01/1900 12:00:00 a. m.") return null;

    const day = parseInt(dateMajor.substring(0,2));
    const month = parseInt(dateMajor.substring(3,5)) - 1;
    const year = parseInt(dateMajor.substring(6,10));
    let hour = parseInt(dateMajor.substring(11,13));
    const min = parseInt(dateMajor.substring(14,16));
    const sec = parseInt(dateMajor.substring(17,19));
    if (dateMajor.substring(19).indexOf('p. m.') >= 0) hour = hour + 12;

    const date = new Date(year,month,day,hour,min,sec);

    return date;
}

export function getDateToMajorAnsiSq(date) {
    if (!date) date = new Date(1900,0,1);
    // return moment(date).format('YYYY-MM-DD HH:mm:ss');
    return moment(date).format('YYYY-MM-DD');
}

export function getDateFromMajorAnsiSql(dateMajor:string) {
    if (isEmpty(dateMajor) || dateMajor.includes("1900-01-01")) return null;

    const year = parseInt(dateMajor.substring(0,4));
    const month = parseInt(dateMajor.substring(5,7)) - 1;
    const day = parseInt(dateMajor.substring(8,10));
    // const hour = parseInt(dateMajor.substring(11,13));
    // const min = parseInt(dateMajor.substring(14,16));
    // const sec = parseInt(dateMajor.substring(17,19));

    // const date = new Date(year,month,day,hour,min,sec);
    const date = new Date(year,month,day,0,0,0);

    return date;
}

export function getDateId(value = null) {
    const date = (!isNull(value)) ? value : new Date();
    return moment(date).format('YYYYMMDDHHmmss');
}

export function getDateFromId(value) {
    try {
        const year = parseInt(value.substring(0,4));
        const month = parseInt(value.substring(4,6)) - 1;
        const day = parseInt(value.substring(6,8));

        const date = new Date(year,month,day,0,0,0);
        return date;
    }
    catch {
        return null;
    }
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

export function iifEmpty(value1, value2) {
    return (isEmpty(value1)) ? value2 : value1;
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
