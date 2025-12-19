import fs from 'fs';
import path from 'path';
import IdentificadorFactura from '../../../domain/dto/identificador-factura';

export function sortString(a, b, desc=false) {
    if (desc)
        return (a === b) ? 0 : (a < b) ? 1 : -1;
    else
        return (a === b) ? 0 : (a < b) ? -1 : 1
}

export function distinctArray(array) {
    return [...new Set(array)] as number[];
}

export function distinctArrayString(array) {
    return [...new Set(array)] as string[];
}

export function distinctArrayObject(array) {
    let newArray = new Map();
    array.forEach(item => newArray.set(JSON.stringify(item), item));

    return [...newArray.values()];
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

export function getNumeroRecibo_ObjectToIdentificador(object:any) {
    try {
        return `${object.codigoDelegacion.toString().padStart(3,"0")}${object.numeroRecibo.toString().padStart(10,"0")}`;
    }
    catch {
        return "ERROR";
    }
}

export function getNumeroRecibo_IdentificadorToObject(codigoBarras:string) {
    try {
        return {
            codigoDelegacion: parseInt(codigoBarras.substring(0,3)).toString(),
            numeroRecibo: parseInt(codigoBarras.substring(3))
        };
    }
    catch {
        return "ERROR";
    }
}

export function getNumeroRecibo_IdentificadorFacturaToObject(codigoBarras:string) {
    try {
        return new IdentificadorFactura(
            parseInt(codigoBarras.substring(0,5)).toString(),
            parseInt(codigoBarras.substring(5,8)).toString(),
            parseInt(codigoBarras.substring(8,18))
        );
    }
    catch {
        return null;
    }
}
