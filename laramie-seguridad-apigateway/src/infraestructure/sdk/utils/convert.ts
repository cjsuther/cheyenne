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

export function iif(value1, value2, value3) {
    return (value1 === value2) ? value3 : value1;
}

export function iifNull(value1, value2) {
    return (!isNull(value1)) ? value2 : value1;
}

