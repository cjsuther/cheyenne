import fs from 'fs';
import path from 'path';
import { precisionRound } from './convert';

export function sortString(a, b, desc=false) {
    if (desc)
        return (a === b) ? 0 : (a < b) ? 1 : -1;
        else
        return (a === b) ? 0 : (a < b) ? -1 : 1;
}

export function distinctArray(array) {
    return [...new Set(array)] as number[];
}

export function distinctArrayObject(array) {
    let newArray = new Map();
    array.forEach(item => newArray.set(JSON.stringify(item), item));

    return [...newArray.values()];
}

export function addArray(array) {
    let accum = 0;
    array.forEach(element => accum += element);
    return precisionRound(accum);
}

export function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }
  
export function findEntitySync(list, entidad, idEntidad, fieldEntidad = "entidad", fieldIdEntidad = "idEntidad") {
    let row = null;

    for (let i=0; i<list.length; i++) {
        if (list[i][fieldEntidad] === entidad && list[i][fieldIdEntidad] === idEntidad) {
            row = list[i];
            break;
        }
    }

    return row;
}

export function CloneObject(origin) {
    return Object.assign({}, origin, {});
}

export const GetMeses = (emptyOption = false) => {
    let meses = [
        {key: 1, value: '0001 - Enero', code: '0001', name: 'Enero'},
        {key: 2, value: '0002 - Febrero', code: '0002', name: 'Febrero'},
        {key: 3, value: '0003 - Marzo', code: '0003', name: 'Marzo'},
        {key: 4, value: '0004 - Abril', code: '0004', name: 'Abril'},
        {key: 5, value: '0005 - Mayo', code: '0005', name: 'Mayo'},
        {key: 6, value: '0006 - Junio', code: '0006', name: 'Junio'},
        {key: 7, value: '0007 - Julio', code: '0007', name: 'Julio'},
        {key: 8, value: '0008 - Agosto', code: '0008', name: 'Agosto'},
        {key: 9, value: '0009 - Septiembre', code: '0009', name: 'Septiembre'},
        {key: 10, value: '0010 - Octubre', code: '0010', name: 'Octubre'},
        {key: 11, value: '0011 - Noviembre', code: '0011', name: 'Noviembre'},
        {key: 12, value: '0012 - Diciembre', code: '0012', name: 'Diciembre'}
    ];

    if (emptyOption) {
        meses.unshift({key: 0, value: '', code: '', name: ''});
    }
    
    return meses;
}

export const GetFieldMes = (key, field) => {
    const meses = GetMeses();
    const mes = meses.find(f => f.key === key);
    return (mes) ? mes[field] : null;
}

export const GetDayOfYear = (date) => {
    const timestampTo = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const timestampFrom = new Date(date.getFullYear(), 0, 0);
  
    return GetDayDifference(timestampFrom, timestampTo);
}

export const GetDayDifference = (date1, date2) => {
    const timestamp1 = date2;
    const timestamp2 = date1;
    const differenceInMilliseconds = timestamp1 - timestamp2;
    const differenceInDays = differenceInMilliseconds / 1000 / 60 / 60 / 24;
  
    return Math.floor(differenceInDays);
}

export const GetMonthDifference = (date1, date2) => {   
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();
    const month1 = date1.getMonth() + 2; //base 1 and the start month not count
    const month2 = date2.getMonth() + 1; //base 1

    let countMonth = 0;
    for (let year = year1; year <= year2; year++) {
        const monthStart = (year === year1) ? month1 : 1;
        const monthEnd = (year === year2) ? month2 : 12;
        for (let month = monthStart; month <= monthEnd; month++) {
            countMonth++;
        }
    }

    return countMonth;
}

export const GetLastDayMonth = (date) => {
    return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
}

export const AddDays = (date, days) => {
    return (new Date(date.getFullYear(), date.getMonth(), date.getDate() + days));
}

