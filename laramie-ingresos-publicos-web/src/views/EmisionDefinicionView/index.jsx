import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { Tab, Tabs } from 'react-bootstrap';

import { dataTaggerActionSet, dataTaggerActionClear } from '../../context/redux/actions/dataTaggerAction';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { useForm } from '../../components/hooks/useForm';

import { Loading, SectionHeading, InputLista, InputFormat, InputEntidad, DatePickerCustom, InputEjercicio } from '../../components/common';
import { CloneObject } from '../../utils/helpers';
import { getDateId } from '../../utils/convert';
import ShowToastMessage from '../../utils/toast';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import { MASK_FORMAT } from '../../consts/maskFormat';
import ProcedimientoParametrosGrid from '../../components/controls/ProcedimientoParametrosGrid';
import ProcedimientoVariablesGrid from '../../components/controls/ProcedimientoVariablesGrid';
import EmisionCalculosGrid from '../../components/controls/EmisionCalculosGrid';
import EmisionConceptosGrid from '../../components/controls/EmisionConceptosGrid';
import EmisionCuentasCorrientesGrid from '../../components/controls/EmisionCuentasCorrientesGrid';
import EmisionImputacionesContablesGrid from '../../components/controls/EmisionImputacionesContablesGrid';
import { useBeforeunload } from 'react-beforeunload';
import { EMISION_EJECUCION_STATE } from '../../consts/emisionEjecucionState';
import { useEntidad } from '../../components/hooks/useEntidad';
import { isNull } from '../../utils/validator';

function EmisionDefinicionView() {

    //parametros url
    const params = useParams();

    //variables
    const entityInit = {
        emisionDefinicion: {
            id: 0,
            idTipoTributo: 0,
            idNumeracion: 0,
            idProcedimiento: 0,
            idEstadoEmisionDefinicion: 0,
            idEmisionDefinicionBase: 0,
            numero: '',
            descripcion: '',
            codigoDelegacion: '',
            periodo: '',
            procesaPlanes: false,
            procesaRubros: false,
            procesaElementos: false,
            calculoMostradorWeb: false,
            calculoMasivo: false,
            calculoPagoAnticipado: false,
            fechaReliquidacionDesde: null,
            fechaReliquidacionHasta: null,
            modulo: ''
        },
        archivos: [],
        observaciones: [],
        etiquetas: [],
        funciones: [],
        procedimientos: [],
        emisionVariables: [],
        emisionCalculos: [],
        emisionConceptos: [],
        emisionCuentasCorrientes: [],
        emisionImputacionesContables: []
    };

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        processKey: `EmisionDefinicion_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        accordions: {
            cabecera: true,
            parametros: (params.mode === OPERATION_MODE.NEW),
            info: false
        },
        tabActive: "procedimiento"
    });
    const [timestampUpdateVariables, setTimestampUpdateVariables] = useState(null)
    const [pendingChange, setPendingChange] = useState(false);
    const [listClaseElemento, setClaseElemento] = useState(false);
    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );

    useBeforeunload((event) => {
        if ((pendingChange) && (state.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    const mount = () => {
        if (state.id > 0) {
            if (state.mode === OPERATION_MODE.EDIT) {
                CheckEmisionEjecucion();
            }
            else {
                FindEmisionDefinicion();
            }
        }
        else {
            SearchProcedimientos();
        }
    }
    useEffect(mount, []);

    const [ emisionDefinicion_formValues, emisionDefinicion_formHandle, , emisionDefinicion_formSet ] = useForm({
        idTipoTributo: 0,
        idNumeracion: 0,
        idProcedimiento: 0,
        idEstadoEmisionDefinicion: 230, //Activa
        idEmisionDefinicionBase: 0,
        numero: '',
        descripcion: '',
        codigoDelegacion: '',
        periodo: '',
        procesaPlanes: false,
        procesaRubros: false,
        procesaElementos: false,
        calculoMostradorWeb: false,
        calculoMasivo: false,
        calculoPagoAnticipado: false,
        fechaReliquidacionDesde: null,
        fechaReliquidacionHasta: null,
    }, 'emisionDefinicion_');

    let listVariables = useMemo(() => 
        getListVariables(state.entity.emisionVariables.filter(x => x.state !== 'r'),
                         state.entity.procedimientos,
                         emisionDefinicion_formValues.idProcedimiento),
        [emisionDefinicion_formValues.idProcedimiento, timestampUpdateVariables]);

    const [getTableEntidad, , readyClaseElemento ] = useEntidad({
        entidades: ['ClaseElemento'],
        onLoaded: (entidades, isSuccess, error) => {
            if (!isSuccess) {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: {
            key: 'ClaseElemento',
            timeout: 0
        }
    });

    useEffect(() => {
        if (readyClaseElemento && emisionDefinicion_formValues.idTipoTributo > 0) {
            const list = getTableEntidad("ClaseElemento").filter(f => isNull(f.idTipoTributo) || f.idTipoTributo === emisionDefinicion_formValues.idTipoTributo);
            setClaseElemento(list);
        }
    }, [readyClaseElemento, emisionDefinicion_formValues.idTipoTributo]);

    //handles
    const emisionDefinicion_formHandleProxy = (event) => {
        emisionDefinicion_formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (isFormValid()) {
            if (state.id === 0) {
                AddEmisionDefinicion();
            }
            else {
                ModifyEmisionDefinicion();
            }
        };
    };
    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        const url = '/emision-definiciones';
        navigate(url, { replace: true });
    }

    //callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState(prevState => {
            return {...prevState, loading: false};
        });
    }
    const callbackSuccessFindEmisionDefinicion = (response) => {
        response.json()
        .then((data) => {

            if (data.emisionDefinicion.fechaReliquidacionDesde) data.emisionDefinicion.fechaReliquidacionDesde = new Date(data.emisionDefinicion.fechaReliquidacionDesde);
            if (data.emisionDefinicion.fechaReliquidacionHasta) data.emisionDefinicion.fechaReliquidacionHasta = new Date(data.emisionDefinicion.fechaReliquidacionHasta);

            data.archivos.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });
            data.observaciones.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });

            setState(prevState => {
                return {...prevState, loading: false, entity: data};
            });
            setTimestampUpdateVariables(new Date());
            setPendingChange(false);
            emisionDefinicion_formSet({
                idTipoTributo: data.emisionDefinicion.idTipoTributo,
                idNumeracion: data.emisionDefinicion.idNumeracion,
                idProcedimiento: data.emisionDefinicion.idProcedimiento,
                idEstadoEmisionDefinicion: data.emisionDefinicion.idEstadoEmisionDefinicion,
                idEmisionDefinicionBase: data.emisionDefinicion.idEmisionDefinicionBase,
                numero: data.emisionDefinicion.numero,
                descripcion: data.emisionDefinicion.descripcion,
                codigoDelegacion: data.emisionDefinicion.codigoDelegacion,
                periodo: data.emisionDefinicion.periodo,
                procesaPlanes: data.emisionDefinicion.procesaPlanes,
                procesaRubros: data.emisionDefinicion.procesaRubros,
                procesaElementos: data.emisionDefinicion.procesaElementos,
                calculoMostradorWeb: data.emisionDefinicion.calculoMostradorWeb,
                calculoMasivo: data.emisionDefinicion.calculoMasivo,
                calculoPagoAnticipado: data.emisionDefinicion.calculoPagoAnticipado,
                fechaReliquidacionDesde: data.emisionDefinicion.fechaReliquidacionDesde,
                fechaReliquidacionHasta: data.emisionDefinicion.fechaReliquidacionHasta,
            });
            dispatch(dataTaggerActionSet(state.processKey, {
                Archivo: data.archivos,
                Observacion: data.observaciones,
                Etiqueta: data.etiquetas
            }));
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    };
    const callbackSuccessSearchProcedimientos = (response) => {
        response.json()
        .then((data) => {
         
            let entityAdd = CloneObject(state.entity);
            entityAdd.procedimientos = data;
            setState(prevState => {
                return {...prevState, loading: false, entity: entityAdd};
            });
            dispatch(dataTaggerActionSet(state.processKey, {
                Archivo: [],
                Observacion: [],
                Etiqueta: []
            }));
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Ingrese los datos y presione siguiente para confirmar el alta');
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    };

    //funciones
    function getListVariables(emisionVariables, procedimientos, idProcedimiento) {
        return (idProcedimiento > 0)
                ? procedimientos.find(f => f.id === idProcedimiento)
                    .procedimientoVariables.filter(f => emisionVariables.map(x => x.idProcedimientoVariable).includes(f.id))
                    .sort((a, b) => a.orden - b.orden)
                : [];
    }

    function isFormValid() {

        if (emisionDefinicion_formValues.idTipoTributo === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Tipo de Tributo incompleto');
            return false;
        }
        if (emisionDefinicion_formValues.idNumeracion === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Tipo de Numeración incompleto');
            return false;
        }
        if (emisionDefinicion_formValues.idEstadoEmisionDefinicion === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Estado incompleto');
            return false;
        }
        if (emisionDefinicion_formValues.numero.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Número incompleto');
            return false;
        }
        if (emisionDefinicion_formValues.descripcion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Descripción incompleto');
            return false;
        }
        if (emisionDefinicion_formValues.codigoDelegacion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Código de Delegacion incompleto');
            return false;
        }
        if (emisionDefinicion_formValues.idProcedimiento === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Procedimiento incompleto');
            return false;
        }
        if (emisionDefinicion_formValues.periodo.length < 4) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Período incompleto');
            return false;
        }

        if (emisionDefinicion_formValues.calculoPagoAnticipado) {
            if (emisionDefinicion_formValues.idEmisionDefinicionBase === 0) {
                ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe definir la emisión de base para el cálculo de pago anticipado');
                return false;
            }
        }

        return true;
    }

    function SearchProcedimientos() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PROCEDIMIENTO,
            null,
            null,
            callbackSuccessSearchProcedimientos,
            callbackNoSuccess,
            callbackError
        );

    }

    function CheckEmisionEjecucion() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((ejecuciones) => {

                if (ejecuciones.filter(f => [EMISION_EJECUCION_STATE.PAUSADA, EMISION_EJECUCION_STATE.PROCESO, EMISION_EJECUCION_STATE.FINALIZADA].includes(f.idEstadoEmisionEjecucion)).length === 0) {
                    FindEmisionDefinicion();
                }
                else {
                    ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "La Definición ya tiene Ejecuciones en curso, NO podrá ser modificada", () => {
                        dispatch(dataTaggerActionClear(state.processKey));
                        setState(prevState => {
                            return {...prevState, loading: false};
                        });
                        const url = '/emision-definicion/' + OPERATION_MODE.VIEW + '/' + state.id;
                        navigate(url, { replace: true });
                        navigate(0);
                    });
                }

            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const paramsUrl = `/emision-definicion/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EMISION_EJECUCION,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function FindEmisionDefinicion() {
        
        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EMISION_DEFINICION,
            paramsUrl,
            null,
            callbackSuccessFindEmisionDefinicion,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddEmisionDefinicion() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Definición ingresada correctamente", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/emision-definicion/' + OPERATION_MODE.EDIT + '/' + row.emisionDefinicion.id;
                    navigate(url, { replace: true });
                    navigate(0);
                });
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const dataBody = {
            emisionDefinicion: {
                ...state.entity.emisionDefinicion,
                idTipoTributo: emisionDefinicion_formValues.idTipoTributo,
                idNumeracion: emisionDefinicion_formValues.idNumeracion,
                idProcedimiento: emisionDefinicion_formValues.idProcedimiento,
                idEstadoEmisionDefinicion: emisionDefinicion_formValues.idEstadoEmisionDefinicion,
                idEmisionDefinicionBase: emisionDefinicion_formValues.idEmisionDefinicionBase,
                numero: emisionDefinicion_formValues.numero,
                descripcion: emisionDefinicion_formValues.descripcion,
                codigoDelegacion: emisionDefinicion_formValues.codigoDelegacion,
                periodo: emisionDefinicion_formValues.periodo,
                procesaPlanes: emisionDefinicion_formValues.procesaPlanes,
                procesaRubros: emisionDefinicion_formValues.procesaRubros,
                procesaElementos: emisionDefinicion_formValues.procesaElementos,
                calculoMostradorWeb: emisionDefinicion_formValues.calculoMostradorWeb,
                calculoMasivo: emisionDefinicion_formValues.calculoMasivo,
                calculoPagoAnticipado: emisionDefinicion_formValues.calculoPagoAnticipado,
                fechaReliquidacionDesde: emisionDefinicion_formValues.fechaReliquidacionDesde,
                fechaReliquidacionHasta: emisionDefinicion_formValues.fechaReliquidacionHasta,
            },
            archivos: [],
            observaciones: [],
            etiquetas: [],
            procedimientos: [],
            funciones: [],
            emisionVariables: [],
            emisionCalculos: [],
            emisionConceptos: [],
            emisionCuentasCorrientes: [],
            emisionImputacionesContables: []
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.EMISION_DEFINICION,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ModifyEmisionDefinicion() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Definición actualizada correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                callbackSuccessFindEmisionDefinicion(response);
            });
        };

        const dataBody = {
            emisionDefinicion: {
                ...state.entity.emisionDefinicion,
                idTipoTributo: emisionDefinicion_formValues.idTipoTributo,
                idNumeracion: emisionDefinicion_formValues.idNumeracion,
                idProcedimiento: emisionDefinicion_formValues.idProcedimiento,
                idEstadoEmisionDefinicion: emisionDefinicion_formValues.idEstadoEmisionDefinicion,
                idEmisionDefinicionBase: emisionDefinicion_formValues.idEmisionDefinicionBase,
                numero: emisionDefinicion_formValues.numero,
                descripcion: emisionDefinicion_formValues.descripcion,
                codigoDelegacion: emisionDefinicion_formValues.codigoDelegacion,
                periodo: emisionDefinicion_formValues.periodo,
                procesaPlanes: emisionDefinicion_formValues.procesaPlanes,
                procesaRubros: emisionDefinicion_formValues.procesaRubros,
                procesaElementos: emisionDefinicion_formValues.procesaElementos,
                calculoMostradorWeb: emisionDefinicion_formValues.calculoMostradorWeb,
                calculoMasivo: emisionDefinicion_formValues.calculoMasivo,
                calculoPagoAnticipado: emisionDefinicion_formValues.calculoPagoAnticipado,
                fechaReliquidacionDesde: emisionDefinicion_formValues.fechaReliquidacionDesde,
                fechaReliquidacionHasta: emisionDefinicion_formValues.fechaReliquidacionHasta,
            },
            archivos: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            procedimientos: [],
            funciones: [],
            emisionVariables: state.entity.emisionVariables.filter(f => f.state !== 'o'),
            emisionCalculos: state.entity.emisionCalculos.filter(f => f.state !== 'o'),
            emisionConceptos: state.entity.emisionConceptos.filter(f => f.state !== 'o'),
            emisionCuentasCorrientes: state.entity.emisionCuentasCorrientes.filter(f => f.state !== 'o'),
            emisionImputacionesContables: state.entity.emisionImputacionesContables.filter(f => f.state !== 'o')
        };

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.EMISION_DEFINICION,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }
    
    function UpdateEntity(typeEntity, row) {
        // o:original a:add m:modify r:remove c:modify only childs

        let entity = CloneObject(state.entity);

        if (typeEntity === 'EmisionVariable') {
            //esta entidad trabaja sobre idProcedimientoVariable como identificador, ya que un solo registro hijo hace referencia a cada registro maestro
            if (row.state === 'a') {
                const index = entity.emisionVariables.indexOf(entity.emisionVariables.find(x => x.idProcedimientoVariable === row.idProcedimientoVariable));
                if (index === -1) { //lo agrego porque no existe en la bd
                    entity.emisionVariables.push(row);
                }
                else { //estaba borrado temporalmente, entonces lo recupero
                    entity.emisionVariables[index].state = 'o';
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.emisionVariables = entity.emisionVariables.filter(f => f.idProcedimientoVariable !== row.idProcedimientoVariable);
                }
                else {
                    let item = entity.emisionVariables.find(x => x.idProcedimientoVariable === row.idProcedimientoVariable);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'EmisionCalculo') {
            if (row.state === 'a') {
                entity.emisionCalculos.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.emisionCalculos.indexOf(entity.emisionCalculos.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.emisionCalculos[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.emisionCalculos = entity.emisionCalculos.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.emisionCalculos.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'EmisionConcepto') {
            if (row.state === 'a') {
                entity.emisionConceptos.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.emisionConceptos.indexOf(entity.emisionConceptos.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.emisionConceptos[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.emisionConceptos = entity.emisionConceptos.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.emisionConceptos.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'EmisionCuentaCorriente') {
            if (row.state === 'a') {
                entity.emisionCuentasCorrientes.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.emisionCuentasCorrientes.indexOf(entity.emisionCuentasCorrientes.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.emisionCuentasCorrientes[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.emisionCuentasCorrientes = entity.emisionCuentasCorrientes.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.emisionCuentasCorrientes.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'EmisionImputacionContable') {
            if (row.state === 'a') {
                entity.emisionImputacionesContables.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.emisionImputacionesContables.indexOf(entity.emisionImputacionesContables.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.emisionImputacionesContables[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.emisionImputacionesContables = entity.emisionImputacionesContables.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.emisionImputacionesContables.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        setState(prevState => {
            return {...prevState,
                entity: entity
            };
        });
        setPendingChange(true);
        setTimestampUpdateVariables(new Date());
    }


    function SetTabActive(tab) {
        setState(prevState => {
            return {...prevState, tabActive: tab};
        });
    }

    function ToggleAccordion(accordion) {
        let accordions = CloneObject(state.accordions);
        accordions[accordion] = !accordions[accordion];
        setState(prevState => {
            return {...prevState, accordions: accordions};
        });
    }

    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i>

    return (
    <>

        <Loading visible={state.loading}></Loading>

        <SectionHeading title={<>Facturación - Definición de Emisión</>} />

        <div className="m-top-20">

            <section className='section-accordion'>

                <div className="m-top-20 m-bottom-20">

                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('cabecera')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.cabecera) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.cabecera ? 'active' : ''}>Datos principales</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.cabecera &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="col-12 col-md-8 col-lg-4">
                                <label htmlFor="emisionDefinicion_idTipoTributo" className="form-label">Tipo Tributo</label>
                                <InputLista
                                    name="emisionDefinicion_idTipoTributo"
                                    placeholder=""
                                    className="form-control"
                                    value={ emisionDefinicion_formValues.idTipoTributo }
                                    onChange={ emisionDefinicion_formHandleProxy }
                                    disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW}
                                    lista="TipoTributo"
                                />
                            </div>
                            <div className="col-12 col-md-8 col-lg-4">
                                <label htmlFor="emisionDefinicion_idNumeracion" className="form-label">Numeración de Recibos</label>
                                <InputEntidad
                                    name="emisionDefinicion_idNumeracion"
                                    title="Numeración"
                                    placeholder=""
                                    className="form-control"
                                    value={ emisionDefinicion_formValues.idNumeracion }
                                    onChange={ emisionDefinicion_formHandleProxy }
                                    disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW}
                                    entidad="EmisionNumeracion"
                                    onFormat={(row) => (row && row.id) ? row.nombre : ''}
                                    columns={[
                                        { Header: 'Númeración', accessor: 'nombre', width: '70%' },
                                        { Header: 'Próximo valor', accessor: 'valorProximo', width: '30%' }
                                    ]}
                                    filter={(row) => { return (row.idTipoTributo === null || row.idTipoTributo === emisionDefinicion_formValues.idTipoTributo) }}
                                    memo={false}
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-2">
                                <label htmlFor="emisionDefinicion_codigoDelegacion" className="form-label">Código Delegación</label>
                                <input
                                    name="emisionDefinicion_codigoDelegacion"
                                    type="text"
                                    placeholder=""
                                    maxLength={1000}
                                    className="form-control"
                                    value={ emisionDefinicion_formValues.codigoDelegacion }
                                    onChange={ emisionDefinicion_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-2">
                                <label htmlFor="emisionDefinicion_periodo" className="form-label">Período</label>
                                <InputEjercicio
                                    name="emisionDefinicion_periodo"
                                    placeholder=""
                                    className="form-control"
                                    value={ emisionDefinicion_formValues.periodo }
                                    onChange={ emisionDefinicion_formHandleProxy }
                                    disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-8">
                                <label htmlFor="emisionDefinicion_descripcion" className="form-label">Descripción</label>
                                <input
                                    name="emisionDefinicion_descripcion"
                                    type="text"
                                    placeholder=""
                                    maxLength={1000}
                                    className="form-control"
                                    value={ emisionDefinicion_formValues.descripcion }
                                    onChange={ emisionDefinicion_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-2">
                                <label htmlFor="emisionDefinicion_idEstadoEmisionDefinicion" className="form-label">Estado</label>
                                <InputLista
                                    name="emisionDefinicion_idEstadoEmisionDefinicion"
                                    placeholder=""
                                    className="form-control"
                                    value={ emisionDefinicion_formValues.idEstadoEmisionDefinicion }
                                    onChange={ emisionDefinicion_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    lista="EstadoEmisionDefinicion"
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-2">
                                <label htmlFor="emisionDefinicion_numero" className="form-label">Número de Definición</label>
                                <InputFormat
                                    name="emisionDefinicion_numero"
                                    placeholder=""
                                    className="form-control"
                                    mask={MASK_FORMAT.EMISION_NUMERO}
                                    maskPlaceholder={null}
                                    value={emisionDefinicion_formValues.numero}
                                    onChange={ emisionDefinicion_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                        </div>
                    </div>
                    )}

                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('parametros')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.parametros) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.parametros ? 'active' : ''}>Parámetros</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.parametros &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>

                            <div className="row col-12 col-md-6 col-lg-2 no-m-horizontal no-p-horizontal">
                                <div className="col-12">
                                    <label className="form-label">Tipo de Cálculo:</label>
                                </div>
                                <div className="col-12 form-check">
                                    <label htmlFor="emisionDefinicion_calculoPagoAnticipado" className="form-check-label">Cálculo pago anticipado:</label>
                                    <input
                                        name="emisionDefinicion_calculoPagoAnticipado"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionDefinicion_formValues.calculoPagoAnticipado}
                                        onChange={(event) => {
                                            const calculoPagoAnticipado = event.target.checked;
                                            const calculoMostradorWeb = calculoPagoAnticipado ? false : emisionDefinicion_formValues.calculoMostradorWeb;
                                            const calculoMasivo = calculoPagoAnticipado ? true : emisionDefinicion_formValues.calculoMasivo;
                                            emisionDefinicion_formSet({...emisionDefinicion_formValues,
                                                calculoPagoAnticipado: calculoPagoAnticipado,
                                                calculoMostradorWeb: calculoMostradorWeb,
                                                calculoMasivo: calculoMasivo,
                                                idEmisionDefinicionBase: 0,
                                                idProcedimiento: 0
                                            });
                                            setPendingChange(true);
                                        }}
                                        disabled={emisionDefinicion_formValues.idTipoTributo === 0 || state.mode !== OPERATION_MODE.NEW}
                                    />
                                </div>
                                <div className="col-12 form-check">
                                    <label htmlFor="emisionDefinicion_calculoMostradorWeb" className="form-check-label">Cálculo de Mostrador/Web</label>
                                    <input
                                        name="emisionDefinicion_calculoMostradorWeb"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionDefinicion_formValues.calculoMostradorWeb }
                                        onChange={ emisionDefinicion_formHandleProxy }
                                        disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-12 form-check">
                                    <label htmlFor="emisionDefinicion_calculoMasivo" className="form-check-label">Cálculo masivo</label>
                                    <input
                                        name="emisionDefinicion_calculoMasivo"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionDefinicion_formValues.calculoMasivo }
                                        onChange={ emisionDefinicion_formHandleProxy }
                                        disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                            </div>
                            <div className="row col-12 col-md-6 col-lg-2 no-m-horizontal no-p-horizontal">
                                {emisionDefinicion_formValues.idTipoTributo === 11 && //COMERCIO
                                <>
                                <div className="col-12">
                                    <label className="form-label">Procesos:</label>
                                </div>
                                <div className="col-12 form-check m-top-20">
                                    <label htmlFor="emisionDefinicion_procesaRubros" className="form-check-label">Procesa Rubros</label>
                                    <input
                                        name="emisionDefinicion_procesaRubros"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionDefinicion_formValues.procesaRubros }
                                        onChange={ emisionDefinicion_formHandleProxy }
                                        disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-12 form-check">
                                    <label htmlFor="emisionDefinicion_procesaElementos" className="form-check-label">Procesa Elementos</label>
                                    <input
                                        name="emisionDefinicion_procesaElementos"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionDefinicion_formValues.procesaElementos }
                                        onChange={ emisionDefinicion_formHandleProxy }
                                        disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                </>
                                }
                            </div>
                            {!emisionDefinicion_formValues.calculoPagoAnticipado && emisionDefinicion_formValues.calculoMostradorWeb &&
                            <div className="row col-12 col-lg-8 no-m-horizontal no-p-horizontal">
                                <div className="col-12">
                                    <label className="form-label">Cálculo vigente para reliquidar:</label>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <label htmlFor="emisionDefinicion_fechaReliquidacionDesde" className="form-label">Desde</label>
                                    <DatePickerCustom
                                        name="emisionDefinicion_fechaReliquidacionDesde"
                                        placeholder=""
                                        className="form-control"
                                        value={ emisionDefinicion_formValues.fechaReliquidacionDesde }
                                        onChange={ emisionDefinicion_formHandleProxy }
                                        disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <label htmlFor="emisionDefinicion_fechaReliquidacionHasta" className="form-label">Hasta</label>
                                    <DatePickerCustom
                                        name="emisionDefinicion_fechaReliquidacionHasta"
                                        placeholder=""
                                        className="form-control"
                                        value={ emisionDefinicion_formValues.fechaReliquidacionHasta }
                                        onChange={ emisionDefinicion_formHandleProxy }
                                        disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                            </div>
                            }
                            {emisionDefinicion_formValues.calculoPagoAnticipado &&
                            <div className="row col-12 col-md-8 no-m-horizontal no-p-horizontal">
                                <div className="col-12 col-md-12 col-lg-6">
                                    <label htmlFor="emisionDefinicion_idEmisionDefinicionBase" className="form-label">Emisión base para el cálculo de pago anticipado:</label>
                                    <InputEntidad
                                        name="emisionDefinicion_idEmisionDefinicionBase"
                                        title="Emisiones"
                                        placeholder=""
                                        className="form-control"
                                        value={ emisionDefinicion_formValues.idEmisionDefinicionBase }
                                        onChange={(event) => {
                                            if (event.target.value) {
                                                const row = event.target.row;
                                                emisionDefinicion_formSet({...emisionDefinicion_formValues,
                                                    idNumeracion: row.idNumeracion,
                                                    idProcedimiento: row.idProcedimiento,
                                                    idEmisionDefinicionBase: row.id,
                                                    periodo: row.periodo,
                                                    procesaRubros: row.procesaRubros,
                                                    procesaElementos: row.procesaElementos,
                                                    fechaReliquidacionDesde: null,
                                                    fechaReliquidacionHasta: null
                                                });
                                            }
                                            else {
                                                emisionDefinicion_formSet({...emisionDefinicion_formValues,
                                                    idNumeracion: 0,
                                                    idProcedimiento: 0,
                                                    idEmisionDefinicionBase: 0,
                                                    periodo: '',
                                                    procesaRubros: false,
                                                    procesaElementos: false,
                                                    fechaReliquidacionDesde: null,
                                                    fechaReliquidacionHasta: null
                                                });
                                            }
                                            setPendingChange(true);
                                        }}
                                        entidad="EmisionDefinicion"
                                        onFormat={(row) => (row && row.id) ? `${row.numero} - ${row.descripcion}` : ''}
                                        columns={[
                                            { Header: 'Número', accessor: 'numero', width: '20%' },
                                            { Header: 'Descripción', accessor: 'descripcion', width: '80%' },
                                        ]}
                                        filter={(row) => {return (row.idTipoTributo === emisionDefinicion_formValues.idTipoTributo && !row.calculoPagoAnticipado)}}
                                        disabled={state.mode !== OPERATION_MODE.NEW}
                                        memo={false}
                                    />
                                </div>
                            </div>
                            }

                        </div>
                    </div>
                    )}

                    {(state.mode !== OPERATION_MODE.NEW) && (
                    <>

                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('info')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.info) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.info ? 'active' : ''}>Información adicional</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.info &&
                    <div className='accordion-body'>
                        <DataTaggerFormRedux
                            title="Información adicional de Definición de Emisión"
                            processKey={state.processKey}
                            entidad="EmisionDefinicion"
                            idEntidad={state.id}
                            disabled={(state.mode === OPERATION_MODE.VIEW)}
                            onChange={(row) => setPendingChange(true)}
                        />
                    </div>
                    )}

                    </>
                    )}

                    <Tabs
                        id="tabs-emision-definicion"
                        activeKey={state.tabActive}
                        className="m-top-20"
                        onSelect={(tab) => SetTabActive(tab)}
                    >
                        <Tab eventKey="procedimiento" title="Procedimiento">
                            <div className='tab-panel'>
                                <div className='row form-basic'>
                                    <div className="col-12 col-lg-10 m-bottom-20">
                                        <label htmlFor="emisionDefinicion_idProcedimiento" className="form-label">Procedimiento</label>
                                        <InputEntidad
                                            name="emisionDefinicion_idProcedimiento"
                                            title="Procedimiento"
                                            placeholder=""
                                            className="form-control"
                                            value={ emisionDefinicion_formValues.idProcedimiento }
                                            onChange={ emisionDefinicion_formHandleProxy }
                                            disabled={emisionDefinicion_formValues.calculoPagoAnticipado || state.mode === OPERATION_MODE.VIEW || state.entity.emisionVariables.filter(f => f.state !== 'r').length > 0 || state.entity.emisionCalculos.filter(f => f.state !== 'r').length > 0}
                                            entidad="Procedimiento"
                                            onFormat={(row) => (row && row.id) ? `${row.nombre} - ${row.descripcion}` : ''}
                                            columns={[
                                                { Header: 'Nombre', accessor: 'nombre', width: '35%' },
                                                { Header: 'Descripción', accessor: 'descripcion', width: '65%' }
                                            ]}
                                        />
                                    </div>
                                    <div className="col-12 col-lg-10">
                                        <ProcedimientoParametrosGrid
                                            disabled={true}
                                            data={{
                                                idEmisionEjecucion: 0,
                                                listParametros: (emisionDefinicion_formValues.idProcedimiento > 0)
                                                                ? state.entity.procedimientos.find(f => f.id === emisionDefinicion_formValues.idProcedimiento).procedimientoParametros
                                                                : [],
                                                listValores: []
                                            }}
                                            onChange={(typeEntity, row) => {}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="variables" title="Variables" tabClassName={(state.mode !== OPERATION_MODE.NEW) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <ProcedimientoVariablesGrid
                                    processKey={state.processKey}
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    data={{
                                        idEmisionDefinicion: state.entity.emisionDefinicion.id,
                                        list: state.entity.emisionVariables,
                                        listAll: (emisionDefinicion_formValues.idProcedimiento > 0)
                                                    ? state.entity.procedimientos.find(f => f.id === emisionDefinicion_formValues.idProcedimiento).procedimientoVariables
                                                    : [],
                                    }}
                                    onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="calculos" title="Cálculos" tabClassName={(state.mode !== OPERATION_MODE.NEW) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <EmisionCalculosGrid
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    showElementos={emisionDefinicion_formValues.procesaElementos}
                                    showEntidades={emisionDefinicion_formValues.procesaRubros}
                                    data={{
                                        idEmisionDefinicion: state.entity.emisionDefinicion.id,
                                        listCalculos: state.entity.emisionCalculos,
                                        listVariables: listVariables,
                                        listFunciones: state.entity.funciones,
                                        listParametros: (emisionDefinicion_formValues.idProcedimiento > 0)
                                            ? state.entity.procedimientos.find(f => f.id === emisionDefinicion_formValues.idProcedimiento).procedimientoParametros
                                            : [],
                                        listElementos: listClaseElemento
                                    }}
                                    onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="conceptos" title="Items/Conceptos" tabClassName={(state.mode !== OPERATION_MODE.NEW) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <EmisionConceptosGrid
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    data={{
                                        idEmisionDefinicion: state.entity.emisionDefinicion.id,
                                        listConceptos: state.entity.emisionConceptos,
                                        listCalculos: state.entity.emisionCalculos,
                                        listFunciones: state.entity.funciones
                                    }}
                                    onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="ctacte" title="Cuenta Corriente" tabClassName={(state.mode !== OPERATION_MODE.NEW) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <EmisionCuentasCorrientesGrid
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    data={{
                                        idEmisionDefinicion: state.entity.emisionDefinicion.id,
                                        listCuentasCorrientes: state.entity.emisionCuentasCorrientes,
                                        listCalculos: state.entity.emisionCalculos,
                                        listFunciones: state.entity.funciones
                                    }}
                                    onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="contabilidad" title="Imputación contable" tabClassName={(state.mode !== OPERATION_MODE.NEW) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <EmisionImputacionesContablesGrid
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    data={{
                                        idEmisionDefinicion: state.entity.emisionDefinicion.id,
                                        listImputacionesContables: state.entity.emisionImputacionesContables,
                                        listCalculos: state.entity.emisionCalculos,
                                        listFunciones: state.entity.funciones
                                    }}
                                    onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                />
                            </div>
                        </Tab>
                    </Tabs>

                </div>

            </section>

        </div>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
                {state.mode !== OPERATION_MODE.VIEW &&
                <button
                    className={pendingChange ? "btn action-button float-end" : "btn action-button btn-disabled float-end"}
                    onClick={ (event) => handleClickGuardar() }
                    disabled={!pendingChange}
                >
                    {(state.mode === OPERATION_MODE.NEW) ? "Siguiente" : "Guardar"}
                </button>
                }
            </div>
        </footer>

    </>
    )
}

export default EmisionDefinicionView;
