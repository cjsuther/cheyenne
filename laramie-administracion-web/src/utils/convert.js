
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

export function getDateId(date = new Date()) {
    return new moment(date).format('YYYYMMDDHHmmss');
}

export function getStringMaxLength(value, length, textAlternative = '') {
    if (value.length > length)
        return value.substring(0, length) + textAlternative;
    else
        return value;
}
