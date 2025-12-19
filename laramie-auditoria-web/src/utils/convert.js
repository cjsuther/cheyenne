
import moment from 'moment';

export function getDateNow(withTime = false) {
    if (withTime)
        return new Date();
    else
        return new Date((new Date()).toDateString());
}

export function getDateToString(date, withTime = false) {
    if (date) {
        if (withTime)
            return new moment(date).format('DD/MM/YYYY HH:mm:ss');
        else
            return new moment(date).format('DD/MM/YYYY');
    }
    else {
        return '';
    }
}

export function getDateSerialize(date) {
    if (date) {
        return new moment(date).format('YYYY-MM-DDTHH:mm:ssZ');
    }
    else {
        return '';
    }
}

export function getBooleanToString(value) {
    return value ? 'Sí' : 'No';
}

export function getDateId(date = new Date()) {
    return new moment(date).format('YYYYMMDDHHmmss');
}

export function addDayToDate(date, days) {
    let newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds());
    return newDate;
}

export function getStringMaxLength(value, length, textAlternative = '') {
    if (value.length > length)
        return value.substring(0, length) + textAlternative;
    else
        return value;
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

export function iif(value1, value2, value3) {
    return (value1 === value2) ? value3 : value1;
}

export function getFormatValueOut(value, type, serialize) {
    if (serialize) {
        if (type === "string") {
            return value;
        }
        else if (type === "date") {
            return getDateSerialize(value);
        }
        else if (type === "number") {
            return value.toString();
        }
        else if (type === "decimal") {
            return value.toString();
        }
        else if (type === "boolean") {
            return value ? "true" : "false";
        }
        else if (type === "any") {
            return value;
        }
        else if (type === "list") {
            return value.toString();
        }
        else if (type === "entity") {
            return value.toString();
        }
        else {
            return value;
        }
    }
    else {
        return value;
    }
}

export function getFormatValueIn(value, type, serialize) {
    if (serialize) {
        if (type === "string") {
            return value;
        }
        else if (type === "date") {
            return (value.length > 0) ? new Date(value) : null;
        }
        else if (type === "number") {
            return parseInt(value);
        }
        else if (type === "decimal") {
            return parseFloat(value);
        }
        else if (type === "boolean") {
            return (value === "true");
        }
        else if (type === "any") {
            return value;
        }
        else if (type === "list") {
            return isNaN(value) ? value : parseInt(value)
        }
        else if (type === "entity") {
            return parseInt(value);
        }
        else {
            return value;
        }
    }
    else {
        return value;
    }
}

export function getFormatValueGrid(value, type, serialize = false) {
    if (serialize) {
        value = getFormatValueIn(value, type, serialize);
    }

    if (type === "string") {
        return value;
    }
    else if (type === "date") {
        return getDateToString(value, false);
    }
    else if (type === "number") {
        return getFormatNumber(value, 0);
    }
    else if (type === "decimal") {
        return getFormatNumber(value, 2);
    }
    else if (type === "boolean") {
        return value ? "Sí" : "No";
    }
    else if (type === "any") {
        return value;
    }
    else if (type === "list") {
        return value.toString();
    }
    else if (type === "entity") {
        return value.toString();
    }
    else {
        return value;
    }
}

export function roundTo(n, place = 2) {    
    return parseFloat(n.toFixed(place));
}

export function precisionRound(number, precision = 2) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

export function parseJwt (token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
    catch (e) {
        return null
    }
}

export function padWithZeros(value, length) {
    if (!value) return '';
    return value.padStart(length, '0');
}
