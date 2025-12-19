export const GetValue = (data, field, id) => {
    const item = data.find(x => x.id === id);
    return (item) ? item[field] : '';
}

export const CloneObject = (origin) => {
    return Object.assign({}, origin, {});
}

export const GetMeses = (emptyOption = false) => {
    let meses = [
        {key: 1, value: '0001 - Enero', code: '0001', cuota: '01', name: 'Enero'},
        {key: 2, value: '0002 - Febrero', code: '0002', cuota: '02', name: 'Febrero'},
        {key: 3, value: '0003 - Marzo', code: '0003', cuota: '03', name: 'Marzo'},
        {key: 4, value: '0004 - Abril', code: '0004', cuota: '04', name: 'Abril'},
        {key: 5, value: '0005 - Mayo', code: '0005', cuota: '05', name: 'Mayo'},
        {key: 6, value: '0006 - Junio', code: '0006', cuota: '06', name: 'Junio'},
        {key: 7, value: '0007 - Julio', code: '0007', cuota: '07', name: 'Julio'},
        {key: 8, value: '0008 - Agosto', code: '0008', cuota: '08', name: 'Agosto'},
        {key: 9, value: '0009 - Septiembre', code: '0009', cuota: '09', name: 'Septiembre'},
        {key: 10, value: '0010 - Octubre', code: '0010', cuota: '10', name: 'Octubre'},
        {key: 11, value: '0011 - Noviembre', code: '0011', cuota: '11', name: 'Noviembre'},
        {key: 12, value: '0012 - Diciembre', code: '0012', cuota: '12', name: 'Diciembre'}
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

export const OpenObjectURL = (filename, buffer) => {
    const objectUrl = URL.createObjectURL(buffer);
    let a = document.createElement('a');
    a.setAttribute('href', objectUrl);
    a.setAttribute('target', '_blank');
    a.setAttribute("download",filename);
    a.click();
    //window.open(objectUrl);
}

export const GetTipoDatos = (emptyOption = false) => {
    const tipoDatos = [
        {key: 'number', value: 'Número entero'},
        {key: 'decimal', value: 'Número decimal'},
        {key: 'string', value: 'Texto'},
        {key: 'boolean', value: 'Lógico'},
        {key: 'date', value: 'Fecha'},
        {key: 'any', value: 'Indefinido'},
        {key: 'list', value: 'Lista'},
    ];

    if (emptyOption) {
        tipoDatos.unshift({key: '', value: ''});
    }

    return tipoDatos;
}

export const GetTipoDato = (typeData) => {
    const data = [
        {typeData: 'number', tipoDato: 'Número entero'},
        {typeData: 'decimal', tipoDato: 'Número decimal'},
        {typeData: 'string', tipoDato: 'Texto'},
        {typeData: 'boolean', tipoDato: 'Lógico'},
        {typeData: 'date', tipoDato: 'Fecha'},
        {typeData: 'any', tipoDato: 'Indefinido'},
        {typeData: 'list', tipoDato: 'Lista'},
        {typeData: 'entity', tipoDato: 'Entidad'},
    ];

    const item = data.find(x => x.typeData === typeData);

    return (item) ? item.tipoDato : '';
}

export const GetInitDato = (typeData) => {
    const data = [
        {typeData: 'number', value: 0},
        {typeData: 'decimal', value: 0},
        {typeData: 'string', value: ''},
        {typeData: 'boolean', value: false},
        {typeData: 'date', value: null},
        {typeData: 'any', value: ''},
        {typeData: 'list', value: null},
        {typeData: 'entity', value: null},
    ];

    const item = data.find(x => x.typeData === typeData);

    return (item) ? item.value : '';
}

export const GetTitleFromField = (field) => {
    let title = '';
    let partial = '';
    for (let i=0; i < field.length; i++) {
        const char = field[i].toString();
        if (i === 0) {
            partial = char.toUpperCase();
        }
        else if (char === char.toUpperCase()) {
            partial = ' ' + char;
        }
        else {
            partial = char;
        }
        title += partial;
    }

    return title;
} 

export const DistinctArray = (array) => {
    return [...new Set(array)];
}

export const GetArrayNumbers = (toNumber, pad = 0) => {
    return [...Array(toNumber).keys()].map((item, index) => {
        const value = (pad) ? item.toString().padStart(pad,'0'): item.toString();
        return {key: index, value: value, name: value}
    });
}

export const CompareDates = (dateTimeA, dateTimeB) => {
    if (dateTimeA > dateTimeB) return 1;
    else if (dateTimeA < dateTimeB) return -1;
    else return 0;
}

export const GetListaVariables = (emptyOption = false) => {
    let optionList = [
        {key: 'BloqueoEmision', value: 'Bloqueo Emision'},
        {key: 'ZonaTarifaria', value: 'Zona Tarifaria'},
        {key: 'CategoriaVivienda', value: 'Categoria Vivienda'},
        {key: 'Zonificacion', value: 'Zonificacion'},
    ];

    if (emptyOption) {
        optionList.unshift({key: 0, value: ''});
    }

    return optionList;
} 

