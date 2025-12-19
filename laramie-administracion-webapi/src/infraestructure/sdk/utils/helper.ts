import fs from 'fs';
import path from 'path';

export function sortString(a, b, desc=false) {
    if (desc)
        return (a === b) ? 0 : (a < b) ? 1 : -1;
    else
        return (a === b) ? 0 : (a < b) ? -1 : 1
}

export function distinctArray(array) {
    const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
    }
    
    return array.filter(distinct);
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