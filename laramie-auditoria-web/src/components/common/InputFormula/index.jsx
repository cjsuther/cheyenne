import React, { useState, useEffect, useMemo } from 'react';
import { object, bool, string, func, number } from 'prop-types';

import './index.scss'
import { isEmptyString } from '../../../utils/validator';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';


const InputFormula = (props) => {

    //atributos
    const charCode = '\\+\\-\\*\\/\\,\\(\\)\\<\\>\\=';
    const charExtra = '\\s\\.\\"ñÑ';
    const charValid = `[\\w${charCode}${charExtra}]`;

    const [state, setState] = useState({
        value: '',
        listCalculos: [],
        listVariables: [],
        listFunciones: [],
        listParametros: [],
        listRubros: [],
        listElementos: []
    });

    useEffect(() => {
        setState(prevState => {
            return {...prevState,
                value: props.value,
                listCalculos: props.data.listCalculos,
                listVariables: props.data.listVariables,
                listFunciones: props.data.listFunciones,
                listParametros: props.data.listParametros,
                listRubros: [
                    {id: -1, codigo: "RUBRO_CODIGO", nombre: "Código Rubro"},
                    {id: -2, codigo: "RUBRO_ALICUOTA", nombre: "Alicuota"},
                    {id: -3, codigo: "RUBRO_MINIMO", nombre: "Mínimo"},
                    {id: -4, codigo: "RUBRO_REG_GENERAL", nombre: "Rubro de Régimen General"},
                    {id: -5, codigo: "RUBRO_CATEGORIA", nombre: "Cateoría de Rubro"},
                    {id: -6, codigo: "RUBRO_AGRUPAMIENTO", nombre: "Agrupamiento de Rubro"},
                    {id: -7, codigo: "RUBRO_MINIMO_APLICABLE", nombre: "Aplica Mínimo"},
                    {id: -8, codigo: "RUBRO_TIPO_LIQUIDACION", nombre: "Tipo Liquidación"},
                    ...props.data.listTiposDeclaracionJurada
                ],
                listElementos: props.data.listElementos
            };
        });
    }, [props.value, props.data.listCalculos, props.data.listVariables, props.data.listFunciones, props.data.listParametros, props.data.listElementos, props.data.listTiposDeclaracionJurada]);

    useEffect(() => {
        const events = props.queueEvents.queue.filter(f => f.timestamps === props.queueEvents.timestamps);
        events.forEach(event => {
            if (event.queueName === props.queueName && event.code === 'insert_text') {
                let el = document.getElementById(`${props.name}_edit`)
                typeInTextarea(event.value, el);
                onChange_Edit(null);
            }
        });

    }, [props.queueEvents.timestamps]);

    let matchsCalculos = useMemo(() => getMatchsCalculos(state.listCalculos), [state.listCalculos]);
    let matchsVariables = useMemo(() => getMatchsVariables(state.listVariables), [state.listVariables]);
    let matchsFunciones = useMemo(() => getMatchsFunciones(state.listFunciones), [state.listFunciones]);
    let matchsParametros = useMemo(() => getMatchsParametros(state.listParametros), [state.listParametros]);
    let matchsRubros = useMemo(() => getMatchsRubros(state.listRubros), [state.listRubros]);
    let matchsElementos = useMemo(() => getMatchsElementos(state.listElementos), [state.listElementos]);
    let matchsEntidades = "LISTA_CARTELES|LISTA_EXENCIONES|LISTA_CONDIC_ESPECIALES|LISTA_CONTROLADORES";
    let matchsFields = "CAMPO_TIPO|CAMPO_CANTIDAD|CAMPO_VALOR|CAMPO_PORCENTAJE|CAMPO_IMPORTE|CAMPO_TASA|CAMPO_SUBTASA|CAMPO_RUBRO|CAMPO_NUMERO|CAMPO_TIPO_CARTEL|CAMPO_TIPO_PROD_PUBLI|CAMPO_CAT_UBICACION|CAMPO_CANT_PUBLI|CAMPO_ALTO|CAMPO_ANCHO|CAMPO_SUPERFICIE";

    useEffect(() => {
        if (props.value.length > 0) {
            document.getElementById(`${props.name}_view`).innerHTML = parseCodeToHTML(props.value);
            document.getElementById(`${props.name}_edit`).value = parseCodeToText(props.value);

            if (props.disabled) {
                let elements = document.getElementsByClassName('input-formula-variable');
                for (let i=0; i<elements.length; i++) {
                    const element = elements[i];
                    const codigo = element.innerText.trim();
                    const nombre = (state.listVariables.find(f => f.codigo === codigo)??{nombre: ''}).nombre;
                    element.title = nombre;
                }
                elements = document.getElementsByClassName('input-formula-parametro');
                for (let i=0; i<elements.length; i++) {
                    const element = elements[i];
                    const codigo = element.innerText.trim();
                    const nombre = (state.listParametros.find(f => f.codigo === codigo)??{nombre: ''}).nombre;
                    element.title = nombre;
                }
                elements = document.getElementsByClassName('input-formula-rubro');
                for (let i=0; i<elements.length; i++) {
                    const element = elements[i];
                    const codigo = element.innerText.trim();
                    const nombre = (state.listRubros.find(f => f.codigo === codigo)??{nombre: ''}).nombre;
                    element.title = nombre;
                }
                elements = document.getElementsByClassName('input-formula-funcion');
                for (let i=0; i<elements.length; i++) {
                    const element = elements[i];
                    const codigo = element.innerText.trim();
                    const nombre = (state.listFunciones.find(f => f.codigo === codigo)??{nombre: ''}).nombre;
                    element.title = nombre;
                }
                elements = document.getElementsByClassName('input-formula-calculo');
                for (let i=0; i<elements.length; i++) {
                    const element = elements[i];
                    const codigo = element.innerText.trim();
                    const nombre = (state.listCalculos.find(f => f.codigo === codigo)??{nombre: ''}).nombre;
                    element.title = nombre;
                }
            }
        }
        else {
            document.getElementById(`${props.name}_view`).innerHTML = '';
            document.getElementById(`${props.name}_edit`).value = ''; 
        }
    }, [state.value, props.disabled, matchsCalculos, matchsVariables, matchsFunciones, matchsParametros, matchsRubros, matchsElementos]);


    function getMatchs(list) {
        let matchs = '';
        list.forEach((x,i) => matchs += (i === 0) ? x.codigo : `|${x.codigo}`);
        return matchs;
    }
    function getMatchsCalculos(listCalculos) {
        return getMatchs(listCalculos);
    }
    function getMatchsVariables(listVariables) {
        return getMatchs(listVariables);
    }
    function getMatchsFunciones(listFunciones) {
        return getMatchs(listFunciones);
    }
    function getMatchsParametros(listParametros) {
        return getMatchs(listParametros);
    }
    function getMatchsRubros(listRubros) {
        return getMatchs(listRubros);
    }
    function getMatchsElementos(listElementos) {
        return getMatchs(listElementos);
    }

    function parseCodeToHTML(valueCode) {
        return parseTextToHTML(parseCodeToText(valueCode));
    }
    function parseCodeToText(valueCode) {
        let valueText = valueCode.replace(/\|/g, '');

        valueText = valueText.replace(/@C/g,'').replace(/@V/g,'').replace(/@F/g,'').replace(/@P/g,'').replace(/@R/g,'').replace(/@E/g,'').replace(/@T/g,'').replace(/@D/g,'').replace(/!/g,'').replace(/\/\*/g,'//').replace(/\*\//g,'').replace(/\\n/g, '\n');

        return valueText;
    }
    function parseTextToHTML(valueText) {
        let valueHTML = valueText;

        const classInputFormula = [
            {key: "%'C%", value: "<span class='input-formula-calculo'>"},
            {key: "%'V%", value: "<span class='input-formula-variable'>"},
            {key: "%'F%", value: "<span class='input-formula-funcion'>"},
            {key: "%'P%", value: "<span class='input-formula-parametro'>"},
            {key: "%'R%", value: "<span class='input-formula-rubro'>"},
            {key: "%'E%", value: "<span class='input-formula-elemento'>"},
            {key: "%'T%", value: "<span class='input-formula-elemento'>"}, //entidad
            {key: "%'D%", value: "<span class='input-formula-field'>"},
            {key: "%'N%", value: "<span class='input-formula-constante-numerica'>"},
            {key: "%'A%", value: "<span class='input-formula-constante-alfabetica'>"},
            {key: "%'U%", value: "<span class='input-formula-undefined'>"},
            {key: "%'M%", value: "<span class='input-formula-comment'>"},
            {key: "%'X%", value: "</span>"}
        ];

        let comments = [];
        let regexpComment = new RegExp(`(\\/{2}${charValid}+?)(?=\\n|$)`, 'g');
        let result = regexpComment.exec(valueHTML);
        while (result) {
            const comment = result[1];
            comments.push(comment);
            result = regexpComment.exec(valueHTML);
        }
        comments.forEach(comment => {
            valueHTML = valueHTML.replace(comment,'¿');
        });

        if (matchsCalculos.length > 0) {
            const regexpCalculos = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsCalculos})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueHTML = valueHTML.replace(regexpCalculos,`%'C%$2$3$4%'X%`);
        }

        if (matchsVariables.length > 0) {
            const regexpVariables = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsVariables})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueHTML = valueHTML.replace(regexpVariables,`%'V%$2$3$4%'X%`);
        }

        if (matchsFunciones.length > 0) {
            const regexpFunciones = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsFunciones})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueHTML = valueHTML.replace(regexpFunciones,`%'F%$2$3$4%'X%`);
        }

        if (matchsParametros.length > 0) {
            const regexpParametros = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsParametros})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueHTML = valueHTML.replace(regexpParametros,`%'P%$2$3$4%'X%`);
        }

        if (matchsRubros.length > 0) {
            const regexpRubros = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsRubros})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueHTML = valueHTML.replace(regexpRubros,`%'R%$2$3$4%'X%`);
        }

        if (matchsElementos.length > 0) {
            const regexpElementos = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsElementos})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueHTML = valueHTML.replace(regexpElementos,`%'E%$2$3$4%'X%`);
        }

        if (matchsEntidades.length > 0) {
            const regexpEntidades = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsEntidades})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueHTML = valueHTML.replace(regexpEntidades,`%'T%$2$3$4%'X%`);
        }

        if (matchsFields.length > 0) {
            const regexpFields = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsFields})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueHTML = valueHTML.replace(regexpFields,`%'D%$2$3$4%'X%`);
        }

        const regexpCosntNumber = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)([\\d\\.]+)(\\s*?)(?=([${charCode}¿]|$))`, 'g');
        valueHTML = valueHTML.replace(regexpCosntNumber,`%'N%$2$3$4%'X%`);

        const regexpCosntText = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)"([\\w\\s\\.\\ñÑ\\-]*)"(\\s*?)(?=([${charCode}¿]|$))`, 'g');
        valueHTML = valueHTML.replace(regexpCosntText,`%'A%$2"$3"$4%'X%`);

        const regexpUndefined = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)([\\w\\.ñÑ]+)(\\s*?)(?=([${charCode}¿]|$))`, 'g');
        valueHTML = valueHTML.replace(regexpUndefined,`%'U%$2$3$4%'X%`);

        comments.forEach(comment => {
            valueHTML = valueHTML.replace(/¿/,`%'M%${comment}%'X%`);    
        });

        valueHTML = valueHTML.replace(/\n/g, '<br>').replace(/\s/g, ' ') + '<br>';

        classInputFormula.forEach(item => {
            const patternClass = new RegExp(`${item.key}`, 'g');
            valueHTML = valueHTML.replace(patternClass, item.value);
        });

        return valueHTML;
    }
    function parseTextToCode(valueText) {
        let valueCode = valueText;

        let comments = [];
        let regexpComment = new RegExp(`(\\/{2}${charValid}+?)(?=\\n|$)`, 'g');
        let result = regexpComment.exec(valueCode);
        while (result) {
            const comment = result[1];
            comments.push(comment);
            result = regexpComment.exec(valueCode);
        }
        comments.forEach(comment => {
            valueCode = valueCode.replace(comment,'¿');
        });

        if(!isEmptyString(valueCode)) {
            if (matchsCalculos.length > 0) {
                const regexpCalculos = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsCalculos})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
                valueCode = valueCode.replace(regexpCalculos,`|$2@C$3$4|`);
            }

            if (matchsVariables.length > 0) {
                const regexpVariables = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsVariables})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
                valueCode = valueCode.replace(regexpVariables,`|$2@V$3$4|`);
            }

            if (matchsFunciones.length > 0) {
                const regexpFunciones = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsFunciones})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
                valueCode = valueCode.replace(regexpFunciones,`|$2@F$3$4|`);
            }

            if (matchsParametros.length > 0) {
                const regexpParametros = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsParametros})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
                valueCode = valueCode.replace(regexpParametros,`|$2@P$3$4|`);
            }

            if (matchsRubros.length > 0) {
                const regexpRubros = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsRubros})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
                valueCode = valueCode.replace(regexpRubros,`|$2@R$3$4|`);
            }

            if (matchsElementos.length > 0) {
                const regexpElementos = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsElementos})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
                valueCode = valueCode.replace(regexpElementos,`|$2@E$3$4|`);
            }

            if (matchsEntidades.length > 0) {
                const regexpEntidades = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsEntidades})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
                valueCode = valueCode.replace(regexpEntidades,`|$2@T$3$4|`);
            }

            if (matchsFields.length > 0) {
                const regexpFields = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)(${matchsFields})(\\s*?)(?=([${charCode}¿]|$))`, 'g');
                valueCode = valueCode.replace(regexpFields,`|$2@D$3$4|`);
            }

            const regexpCosntNumber = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)([\\d\\.]+)(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueCode = valueCode.replace(regexpCosntNumber,`|$2$3$4|`);

            const regexpCosntText = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)"([\\w\\s\\.ñÑ\\-]*)"(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueCode = valueCode.replace(regexpCosntText,`|$2"$3"$4|`);

            const regexpUndefined = new RegExp(`(?<=([${charCode}¿]|^))(\\s*?)([\\w\\.ñÑ]+)(\\s*?)(?=([${charCode}¿]|$))`, 'g');
            valueCode = valueCode.replace(regexpUndefined,`|$2!$3$4|`);
        }

        comments.forEach(comment => {
            valueCode = valueCode.replace(/¿/,`|/*${comment.replace('//','')}*/|`);
        });

        valueCode = valueCode.replace(/\(/g, '|(|');
        valueCode = valueCode.replace(/\)/g, '|)|');
        valueCode = valueCode.replace(/\|\|/g, '|').replace(/\n/g, '\\n');

        if (valueCode.length > 0) {
            if (valueCode[0] === '|') valueCode = valueCode.substring(1);
            if (valueCode[valueCode.length-1] === '|') valueCode = valueCode.substring(0, valueCode.length-1);
        }
        
        return valueCode;
    }

    function typeInTextarea(newText, el) {
        const start = el.selectionStart
        const end = el.selectionEnd
        const text = el.value
        const before = text.substring(0, start)
        const after  = text.substring(end, text.length)
        el.value = (before + newText + after)
        el.selectionStart = el.selectionEnd = start + newText.length
        el.focus()
    }

    function onKeyPress_Edit(e) {
        const key = e.key;
        const pattern = new RegExp(`^${charValid}$`);
        if (key !== "Enter" && !pattern.test(key)) {
            e.preventDefault();
        }
    }
    function onScroll_Edit() {
        document.getElementById(`${props.name}_view`).scrollTop = document.getElementById(`${props.name}_edit`).scrollTop;
    }
    function onChange_Edit(e) {
        const value = document.getElementById(`${props.name}_edit`).value;
        if (value.length > 0) {
            document.getElementById(`${props.name}_view`).innerHTML = parseTextToHTML(value);
        }
        else {
            document.getElementById(`${props.name}_view`).innerHTML = '';
        }
        document.getElementById(`${props.name}_view`).scrollTop = document.getElementById(`${props.name}_edit`).scrollTop;

        syncFormula();
    }
    function onFocus_Edit(e) {
        if (props.onFocus) {
            props.onFocus({
                target: {
                    name: props.name
                }
            });
        }
    }
    function onPaste_Edit(e) {
        try {
            const pasteText = e.clipboardData.getData('text');
            if (pasteText) {
                const pattern = new RegExp(`^${charValid}$`);
                for (let i=0; i<pasteText.length; i++) {
                    const key = pasteText[i];
                    if (!pattern.test(key)) {
                        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Se detectaron caracteres no válidos en el texto a pegar");
                        e.preventDefault();
                        break;
                    }
                }
            }
        }
        catch {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, "Error en evento onPaste_Edit");
            e.preventDefault();
        }
    }
    function onBlur_Edit(e) {
        // syncFormula();
    }

    function syncFormula() {
        const valueText = document.getElementById(`${props.name}_edit`).value;
        const valueCode = parseTextToCode(valueText);
        if (props.onChange) {
            props.onChange({
                target: {
                    name: props.name,
                    type: 'text',
                    value: valueCode
                }
            });
        }
        setState(prevState => {
            return {...prevState,
                value: valueCode
            };
        });
    }

    return (
        <>

        <div className={'input-formula'} style={{height: (props.editorExpanded ? props.heightExpanded: props.heightNormal)}}>

            <div
                id={`${props.name}_view`}
                className={`input-formula-view input-formula-font-${props.fontSize} ${props.className} ${(props.disabled) ? 'input-formula-view-disabled' : ''}`}
            ></div>

            <textarea
                id={`${props.name}_edit`}
                maxLength={4000}
                className={`input-formula-edit input-formula-font-${props.fontSize} ${props.className} ${(props.disabled) ? 'invisible' : ''}`}
                onChange={onChange_Edit}
                onKeyPress={onKeyPress_Edit}
                onScroll={onScroll_Edit}
                onFocus={onFocus_Edit}
                onPaste={onPaste_Edit}
                onBlur={onBlur_Edit}
            ></textarea>

        </div>

        </>
    )
}

InputFormula.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    fontSize: string,
    editorExpanded: bool,
    heightExpanded: number,
    heightNormal: number,
    value: string,
    onChange: func,
    onFocus: func,
    disabled: bool,
    data: object.isRequired,
    queueEvents: object.isRequired,
    queueName: string
};

InputFormula.defaultProps = {
    placeholder: "",
    className: "",
    fontSize: "md",
    editorExpanded: false,
    heightExpanded: 450,
    heightNormal: 150,
    value: "",
    onChange: null,
    onFocus: null,
    disabled: false,
    queueName: ""
};

export default InputFormula;
