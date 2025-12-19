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

export function getDateId() {
    const date = new Date();
    return moment(date).format('YYYYMMDDHHmmss');
}

export function getDateFromDateId(date: string) {
    return moment(date, 'YYYYMMDDHHmmss').toDate()
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
