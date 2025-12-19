import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { Tab, Tabs } from 'react-bootstrap';

import { dataTaggerActionSet, dataTaggerActionClear } from '../../context/redux/actions/dataTaggerAction';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { EMISION_EJECUCION_STATE } from "../../consts/emisionEjecucionState";
import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { useForm } from '../../components/hooks/useForm';

import { Loading, SectionHeading, InputFormat, InputEntidad, InputEjercicio, DatePickerCustom, InputLista, TableCustom } from '../../components/common';
import { CloneObject } from '../../utils/helpers';
import { getDateId, getDateNow, getDateToString, getFormatNumber, iif } from '../../utils/convert';
import ShowToastMessage from '../../utils/toast';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import { MASK_FORMAT } from '../../consts/maskFormat';
import ProcedimientoParametrosGrid from '../../components/controls/ProcedimientoParametrosGrid';
import EmisionCuotasGrid from '../../components/controls/EmisionCuotasGrid';
import EmisionEjecucionCuentasGrid from '../../components/controls/EmisionEjecucionCuentasGrid';
import EmisionAprobacionesGrid from '../../components/controls/EmisionAprobacionesGrid';
import EmisionProcesosGrid from '../../components/controls/EmisionProcesosGrid';
import { useBeforeunload } from 'react-beforeunload';

function EmisionEjecucionView() {

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
        emisionEjecucion: {
            id: 0,
            idEmisionDefinicion: 0,
            idEstadoEmisionEjecucion: 0,
            numero: '',
            descripcion: '',
            descripcionAbreviada: '',
            periodo: '',
            imprimeRecibosEmision: false,
            aplicaDebitoAutomatico: false,
            calculoMostradorWeb: false,
            calculoMasivo: false,
            calculoPrueba: false,
            calculoPagoAnticipado: false,
            fechaPagoAnticipadoVencimiento1: null,
            fechaPagoAnticipadoVencimiento2: null,
            fechaEjecucionInicio: null,
            fechaEjecucionFin: null
        },
        emisionAprobacion: {
            id: 0,
            idEmisionEjecucion: 0,
            idEstadoAprobacionCalculo: 0,
            idUsuarioAprobacionCalculo: 0,
            fechaAprobacionCalculo: null,
            idEstadoAprobacionOrdenamiento: 0,
            idUsuarioAprobacionOrdenamiento: 0,
            fechaAprobacionOrdenamiento: null,
            idEstadoAprobacionControlRecibos: 0,
            idUsuarioAprobacionControlRecibos: 0,
            fechaAprobacionControlRecibos: null,
            idEstadoAprobacionCodigoBarras: 0,
            idUsuarioAprobacionCodigoBarras: 0,
            fechaAprobacionCodigoBarras: null,
            idEstadoProcesoCuentaCorriente: 0,
            idUsuarioProcesoCuentaCorriente: 0,
            fechaProcesoCuentaCorriente: null,
            idEstadoProcesoImpresion: 0,
            idUsuarioProcesoImpresion: 0,
            fechaProcesoImpresion: null
        },
        procedimiento: {
            id: 0,
            nombre: '',
            descripcion: '',
            modulo: '',
            procedimientoParametros: [],
            procedimientoVariables: []
        },
        archivos: [],
        observaciones: [],
        etiquetas: [],
        funciones: [],
        emisionVariables: [],
        emisionProcedimientoParametros: [],
        emisionCuotas: []
    };

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        processKey: `EmisionEjecucion_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        accordions: {
            cabecera: true,
            parametros: false,
            info: false
        },
        tabActive: "procedimiento"
    });
    const [timestampUpdateVariables, setTimestampUpdateVariables] = useState(null);
    const [pendingChange, setPendingChange] = useState(false);
    const [listEmisionEjecucionCuentaResume, setListEmisionEjecucionCuentaResume] = useState([]);
    const [processSpeed, setProcessSpeed] = useState({
        processedSeconds: 0,
        processedCount: 0,
        lastTime: null
    });

    const estadoEmisionEjecucionEstadoRef = useRef(0);

    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );

    useBeforeunload((event) => {
        if ((pendingChange) && (state.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    const mount = () => {
        let myInterval = null;
        if (state.id > 0) {
            FindEmisionEjecucion();
            ListEmisionEjecucionCuentaResume();
            myInterval = setInterval(() => {
                if (estadoEmisionEjecucionEstadoRef.current === EMISION_EJECUCION_STATE.PROCESO) {
                    ListEmisionEjecucionCuentaResume();
                }
            }, 3000);
        }
        else {
            dispatch(dataTaggerActionSet(state.processKey, {
                Archivo: [],
                Observacion: [],
                Etiqueta: []
            }));
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Ingrese los datos y presione siguiente para confirmar el alta');
        }

        return () => {
            if (myInterval) clearInterval(myInterval)
        };
    }
    useEffect(mount, []);

    useEffect(() => {
        estadoEmisionEjecucionEstadoRef.current = state.entity.emisionEjecucion.idEstadoEmisionEjecucion;
    }, [state.entity.emisionEjecucion.idEstadoEmisionEjecucion]);

    useEffect(() => {
        if (listEmisionEjecucionCuentaResume.length > 0) {
            const today = getDateNow(true);
            const finalizados = listEmisionEjecucionCuentaResume.find(f => f.idEstadoEmisionEjecucionCuenta === 262);
            if (finalizados && finalizados.cantidad > 0) {
                if (processSpeed.lastTime) {
                    const seconds = (Math.abs(today - processSpeed.lastTime) / 1000);
                    const processedCount = (finalizados.cantidad - processSpeed.processedCount);
                    const processedSeconds = (seconds > 0 && processedCount > 0) ? (processedCount / seconds) : 0;
                    setProcessSpeed({
                        processedCount: finalizados.cantidad,
                        processedSeconds: processedSeconds.toFixed(0),
                        lastTime: today
                    });
                }
                else {
                    setProcessSpeed({
                        processedCount: finalizados.cantidad,
                        processedSeconds: 0,
                        lastTime: today
                    });
                }
            }
            else {
                setProcessSpeed({
                    processedCount: 0,
                    processedSeconds: 0,
                    lastTime: today
                });
            }
            const fecha1 = iif(state.entity.emisionEjecucion.fechaEjecucionInicio, null, "");
            const fecha2 = iif(listEmisionEjecucionCuentaResume[0].fechaEjecucionInicio, null, "");
            if (state.entity.emisionEjecucion.idEstadoEmisionEjecucion !== listEmisionEjecucionCuentaResume[0].idEstadoEmisionEjecucion ||
                fecha1.toString() !== fecha2.toString()) {
                FindEmisionEjecucion();
            }
        }   
    }, [listEmisionEjecucionCuentaResume]);

    const [ emisionEjecucion_formValues, emisionEjecucion_formHandle, , emisionEjecucion_formSet ] = useForm({
        idEmisionDefinicion: 0,
        idEstadoEmisionEjecucion: 250, //Pendiente
        numero: '',
        descripcion: '',
        descripcionAbreviada: '',
        periodo: '',
        imprimeRecibosEmision: false,
        aplicaDebitoAutomatico: false,
        calculoMostradorWeb: false,
        calculoMasivo: false,
        calculoPrueba: false,
        calculoPagoAnticipado: false,
        fechaPagoAnticipadoVencimiento1: null,
        fechaPagoAnticipadoVencimiento2: null,
        fechaEjecucionInicio: null,
        fechaEjecucionFin: null
    }, 'emisionEjecucion_');

    let listVariables = useMemo(() => 
        getListVariables(state.entity.emisionVariables, state.entity.procedimiento),
        [timestampUpdateVariables]);


    const tableColumnsEmisionEjecucionCuentaResume = [
        { Header: 'Estado', accessor: 'estadoEmisionEjecucionCuenta', width: '60%' },
        { Header: 'Cantidad', Cell: (props) => getFormatNumber(props.value, 0), accessor: 'cantidad', width: '40%', alignCell: 'right', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const emisionEjecucion_formHandleProxy = (event) => {
        emisionEjecucion_formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (isFormValid()) {
            if (state.id === 0) {
                AddEmisionEjecucion();
            }
            else {
                ModifyEmisionEjecucion();
            }
        };
    };
    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        const url = '/emision-ejecuciones';
        navigate(url, { replace: true });
    }
    const handleClickAction = (action) => {
        if (pendingChange) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Existen cambios sin guardar.");
        }
        else {
            ModifyStateEmisionEjecucion(action);
        }
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
    const callbackSuccessFindEmisionEjecucion = (response) => {
        response.json()
        .then((data) => {

            if (data.emisionEjecucion.fechaPagoAnticipadoVencimiento1) data.emisionEjecucion.fechaPagoAnticipadoVencimiento1 = new Date(data.emisionEjecucion.fechaPagoAnticipadoVencimiento1);
            if (data.emisionEjecucion.fechaPagoAnticipadoVencimiento2) data.emisionEjecucion.fechaPagoAnticipadoVencimiento2 = new Date(data.emisionEjecucion.fechaPagoAnticipadoVencimiento2);
            if (data.emisionEjecucion.fechaEjecucionInicio) data.emisionEjecucion.fechaEjecucionInicio = new Date(data.emisionEjecucion.fechaEjecucionInicio);
            if (data.emisionEjecucion.fechaEjecucionFin) data.emisionEjecucion.fechaEjecucionFin = new Date(data.emisionEjecucion.fechaEjecucionFin);

            if (data.emisionAprobacion.fechaAprobacionCalculo) data.emisionAprobacion.fechaAprobacionCalculo = new Date(data.emisionAprobacion.fechaAprobacionCalculo);
            if (data.emisionAprobacion.fechaAprobacionOrdenamiento) data.emisionAprobacion.fechaAprobacionOrdenamiento = new Date(data.emisionAprobacion.fechaAprobacionOrdenamiento);
            if (data.emisionAprobacion.fechaAprobacionControlRecibos) data.emisionAprobacion.fechaAprobacionControlRecibos = new Date(data.emisionAprobacion.fechaAprobacionControlRecibos);
            if (data.emisionAprobacion.fechaAprobacionCodigoBarras) data.emisionAprobacion.fechaAprobacionCodigoBarras = new Date(data.emisionAprobacion.fechaAprobacionCodigoBarras);
            if (data.emisionAprobacion.fechaProcesoCuentaCorriente) data.emisionAprobacion.fechaProcesoCuentaCorriente = new Date(data.emisionAprobacion.fechaProcesoCuentaCorriente);
            if (data.emisionAprobacion.fechaProcesoImpresion) data.emisionAprobacion.fechaProcesoImpresion = new Date(data.emisionAprobacion.fechaProcesoImpresion);

            data.emisionCuotas.forEach(x => {
                if (x.fechaVencimiento1) x.fechaVencimiento1 = new Date(x.fechaVencimiento1);
                if (x.fechaVencimiento2) x.fechaVencimiento2 = new Date(x.fechaVencimiento2);
            });

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
            emisionEjecucion_formSet({
                idEmisionDefinicion: data.emisionEjecucion.idEmisionDefinicion,
                idEstadoEmisionEjecucion: data.emisionEjecucion.idEstadoEmisionEjecucion,
                numero: data.emisionEjecucion.numero,
                descripcion: data.emisionEjecucion.descripcion,
                descripcionAbreviada: data.emisionEjecucion.descripcionAbreviada,
                periodo: data.emisionEjecucion.periodo,
                imprimeRecibosEmision: data.emisionEjecucion.imprimeRecibosEmision,
                aplicaDebitoAutomatico: data.emisionEjecucion.aplicaDebitoAutomatico,
                calculoMostradorWeb: data.emisionEjecucion.calculoMostradorWeb,
                calculoMasivo: data.emisionEjecucion.calculoMasivo,
                calculoPrueba: data.emisionEjecucion.calculoPrueba,
                calculoPagoAnticipado: data.emisionEjecucion.calculoPagoAnticipado,
                fechaPagoAnticipadoVencimiento1: data.emisionEjecucion.fechaPagoAnticipadoVencimiento1,
                fechaPagoAnticipadoVencimiento2: data.emisionEjecucion.fechaPagoAnticipadoVencimiento2,
                fechaEjecucionInicio: data.emisionEjecucion.fechaEjecucionInicio,
                fechaEjecucionFin: data.emisionEjecucion.fechaEjecucionFin                
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
    }
    const callbackSuccessListEmisionEjecucionCuentaResume = (response) => {
        response.json()
        .then((data) => {
            data.forEach(x => {
                if (x.fechaEjecucionInicio) x.fechaEjecucionInicio = new Date(x.fechaEjecucionInicio);
                if (x.fechaEjecucionFin) x.fechaEjecucionFin = new Date(x.fechaEjecucionFin);
            });
            setListEmisionEjecucionCuentaResume(data);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        });
    }
    const callbackSuccessFindProcedimiento = (response) => {
        response.json()
        .then((data) => {
         
            let entity = CloneObject(state.entity);
            entity.procedimiento = data;
            setState(prevState => {
                return {...prevState, loading: false, entity: entity};
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

    //funciones
    function getListVariables(emisionVariables, procedimiento) {
        return (procedimiento)
                ? procedimiento.procedimientoVariables
                    .filter(f => emisionVariables.map(x => x.idProcedimientoVariable).includes(f.id))
                    .sort((a, b) => a.orden - b.orden)
                : [];
    }

    function isFormValid() {

        if (emisionEjecucion_formValues.idEmisionDefinicion === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Definición de Emisión sin determinar');
            return false;
        }
        if (emisionEjecucion_formValues.numero === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Número incompleto');
            return false;
        }
        if (emisionEjecucion_formValues.descripcion === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Descripción incompleta');
            return false;
        }
        if (emisionEjecucion_formValues.descripcionAbreviada === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Descripción Abreviada incompleta');
            return false;
        }
        if (emisionEjecucion_formValues.calculoPagoAnticipado) {
            if (emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento1 == null) {
                ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo primer vencimiento del cálculo pago anticipado');
                return false;
            }
            if (emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento2 == null) {
                ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo segundo vencimiento del cálculo pago anticipado');
                return false;
            }
        }

        return true;
    }

    function ListEmisionEjecucionCuentaResume() {

        const paramsUrl = `/resume/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EMISION_EJECUCION_CUENTA,
            paramsUrl,
            null,
            callbackSuccessListEmisionEjecucionCuentaResume,
            callbackNoSuccess,
            callbackError
        );

    }

    function FindProcedimiento(idProcedimiento) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/${idProcedimiento}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PROCEDIMIENTO,
            paramsUrl,
            null,
            callbackSuccessFindProcedimiento,
            callbackNoSuccess,
            callbackError
        );

    }

    function CleanProcedimiento () {
        let entity = CloneObject(state.entity);
        entity.procedimiento = entityInit.procedimiento;
        setState(prevState => {
            return {...prevState, loading: false, entity: entity};
        });
    }

    function FindEmisionEjecucion() {
        
        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EMISION_EJECUCION,
            paramsUrl,
            null,
            callbackSuccessFindEmisionEjecucion,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddEmisionEjecucion() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Alta realizada correctamente", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/emision-ejecucion/' + OPERATION_MODE.EDIT + '/' + row.emisionEjecucion.id;
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
            ...entityInit,
            emisionEjecucion: {
                ...state.entity.emisionEjecucion,
                idEmisionDefinicion: parseInt(emisionEjecucion_formValues.idEmisionDefinicion),
                idEstadoEmisionEjecucion: parseInt(emisionEjecucion_formValues.idEstadoEmisionEjecucion),
                numero: emisionEjecucion_formValues.numero,
                descripcion: emisionEjecucion_formValues.descripcion,
                descripcionAbreviada: emisionEjecucion_formValues.descripcionAbreviada,
                periodo: emisionEjecucion_formValues.periodo,
                imprimeRecibosEmision: emisionEjecucion_formValues.imprimeRecibosEmision,
                aplicaDebitoAutomatico: emisionEjecucion_formValues.aplicaDebitoAutomatico,
                calculoMostradorWeb: emisionEjecucion_formValues.calculoMostradorWeb,
                calculoMasivo: emisionEjecucion_formValues.calculoMasivo,
                calculoPrueba: emisionEjecucion_formValues.calculoPrueba,
                calculoPagoAnticipado: emisionEjecucion_formValues.calculoPagoAnticipado,
                fechaPagoAnticipadoVencimiento1: emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento1,
                fechaPagoAnticipadoVencimiento2: emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento2,
                fechaEjecucionInicio: emisionEjecucion_formValues.fechaEjecucionInicio,
                fechaEjecucionFin: emisionEjecucion_formValues.fechaEjecucionFin                
            }
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.EMISION_EJECUCION,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ModifyEmisionEjecucion() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Actualización realizada correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                callbackSuccessFindEmisionEjecucion(response);
            });
        };

        const dataBody = {
            ...entityInit,
            emisionEjecucion: {
                ...state.entity.emisionEjecucion,
                idEstadoEmisionEjecucion: parseInt(emisionEjecucion_formValues.idEstadoEmisionEjecucion),
                numero: emisionEjecucion_formValues.numero,
                descripcion: emisionEjecucion_formValues.descripcion,
                descripcionAbreviada: emisionEjecucion_formValues.descripcionAbreviada,
                periodo: emisionEjecucion_formValues.periodo,
                imprimeRecibosEmision: emisionEjecucion_formValues.imprimeRecibosEmision,
                aplicaDebitoAutomatico: emisionEjecucion_formValues.aplicaDebitoAutomatico,
                calculoMostradorWeb: emisionEjecucion_formValues.calculoMostradorWeb,
                calculoMasivo: emisionEjecucion_formValues.calculoMasivo,
                calculoPrueba: emisionEjecucion_formValues.calculoPrueba,
                calculoPagoAnticipado: emisionEjecucion_formValues.calculoPagoAnticipado,
                fechaPagoAnticipadoVencimiento1: emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento1,
                fechaPagoAnticipadoVencimiento2: emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento2,
                fechaEjecucionInicio: emisionEjecucion_formValues.fechaEjecucionInicio,
                fechaEjecucionFin: emisionEjecucion_formValues.fechaEjecucionFin  
            },
            archivos: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            emisionProcedimientoParametros: state.entity.emisionProcedimientoParametros.filter(f => f.state !== 'o'),
            emisionCuotas: state.entity.emisionCuotas //se envia completo por si hay que actualizar los vencimientos en el calculo pago anticipado
        };

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.EMISION_EJECUCION,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ModifyStateEmisionEjecucion(action) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Acción aplicada correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                callbackSuccessFindEmisionEjecucion(response);
                ListEmisionEjecucionCuentaResume();
            });
        };

        const paramsUrl = `/${action}/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
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
    
    function UpdateEntity(typeEntity, row) {
        // o:original a:add m:modify r:remove c:modify only childs

        let entity = CloneObject(state.entity);

        if (typeEntity === 'EmisionCuota') {
            if (row.state === 'a') {
                entity.emisionCuotas.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.emisionCuotas.indexOf(entity.emisionCuotas.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.emisionCuotas[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.emisionCuotas = entity.emisionCuotas.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.emisionCuotas.find(x => x.id === row.id);
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
    }

    function UpdateEmisionProcedimientoParametro(rows) {
        // o:original a:add m:modify r:remove c:modify only childs

        let entity = CloneObject(state.entity);

        rows.forEach(row => {
            if (row.state === 'm') {
                const index = entity.emisionProcedimientoParametros.indexOf(entity.emisionProcedimientoParametros.find(x => x.id === row.id));
                if (index !== -1) {
                    entity.emisionProcedimientoParametros[index] = row;
                }
            }
        });

        setState(prevState => {
            return {...prevState,
                entity: entity
            };
        });
        setPendingChange(true);
    }

    function IsEnabled(newEnabled, editEnabled) {
        return (
            (newEnabled && state.mode === OPERATION_MODE.NEW) ||
            (editEnabled && state.mode === OPERATION_MODE.EDIT && (
                state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.PENDIENTE ||
                state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.CANCELADA)
            )
        );
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

        <SectionHeading title={<>Facturación - Ejecución de Emisión</>} />

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
                            <div className="col-12 col-md-4 col-lg-7">
                                <label htmlFor="emisionEjecucion_idEmisionDefinicion" className="form-label">Definición de Emisión</label>
                                <InputEntidad
                                    name="emisionEjecucion_idEmisionDefinicion"
                                    title="Definición de Emisiones"
                                    placeholder=""
                                    className="form-control"
                                    value={ emisionEjecucion_formValues.idEmisionDefinicion }
                                    onChange={(event) => {
                                        const {target} = event;
                                        let idEmisionDefinicion = 0;
                                        let periodo = '';
                                        if (target.value > 0) {
                                            periodo = target.row.periodo;
                                            idEmisionDefinicion = target.row.id;
                                            FindProcedimiento(target.row.idProcedimiento);
                                        }
                                        else {
                                            CleanProcedimiento();
                                        }
                                        emisionEjecucion_formSet({...emisionEjecucion_formValues,
                                            idEmisionDefinicion: idEmisionDefinicion,
                                            periodo: periodo
                                        });
                                        setPendingChange(true);
                                    }}
                                    disabled={!IsEnabled(true, false)}
                                    entidad="EmisionDefinicion"
                                    onFormat={(row) => (row && row.id) ? `${row.numero} - ${row.descripcion}` : ''}
                                    columns={[
                                        { Header: 'Número', accessor: 'numero', width: '20%' },
                                        { Header: 'Descripción', accessor: 'descripcion', width: '80%' },
                                    ]}
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-3">
                                <label htmlFor="emisionEjecucion_descripcionAbreviada" className="form-label">Descripción Abreviada</label>
                                <input
                                    name="emisionEjecucion_descripcionAbreviada"
                                    type="text"
                                    placeholder=""
                                    maxLength={250}
                                    className="form-control"
                                    value={ emisionEjecucion_formValues.descripcionAbreviada }
                                    onChange={ emisionEjecucion_formHandleProxy }
                                    disabled={!IsEnabled(true, true)}
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-2">
                                <label htmlFor="emisionEjecucion_periodo" className="form-label">Período</label>
                                <InputEjercicio
                                    name="emisionEjecucion_periodo"
                                    placeholder=""
                                    className="form-control"
                                    value={ emisionEjecucion_formValues.periodo }
                                    onChange={ emisionEjecucion_formHandleProxy }
                                    disabled={true}
                                />
                            </div>
                            <div className="col-12 col-md-8 col-lg-10">
                                <label htmlFor="emisionEjecucion_descripcion" className="form-label">Descripción</label>
                                <input
                                    name="emisionEjecucion_descripcion"
                                    type="text"
                                    placeholder=""
                                    maxLength={1000}
                                    className="form-control"
                                    value={ emisionEjecucion_formValues.descripcion }
                                    onChange={ emisionEjecucion_formHandleProxy }
                                    disabled={!IsEnabled(true, true)}
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-2">
                                <label htmlFor="emisionEjecucion_numero" className="form-label">Número de Emisión</label>
                                <InputFormat
                                    name="emisionEjecucion_numero"
                                    placeholder=""
                                    className="form-control"
                                    mask={MASK_FORMAT.EMISION_NUMERO}
                                    maskPlaceholder={null}
                                    value={emisionEjecucion_formValues.numero}
                                    onChange={ emisionEjecucion_formHandleProxy }
                                    disabled={!IsEnabled(true, true)}
                                />
                            </div>
                        </div>
                    </div>
                    )}

                    {(state.mode !== OPERATION_MODE.NEW) && (
                    <>

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
                                    <label htmlFor="emisionEjecucion_calculoMostradorWeb" className="form-check-label">Cálculo de Mostrador/Web</label>
                                    <input
                                        name="emisionEjecucion_calculoMostradorWeb"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionEjecucion_formValues.calculoMostradorWeb }
                                        onChange={ emisionEjecucion_formHandleProxy }
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 form-check">
                                    <label htmlFor="emisionEjecucion_calculoMasivo" className="form-check-label">Cálculo masivo</label>
                                    <input
                                        name="emisionEjecucion_calculoMasivo"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionEjecucion_formValues.calculoMasivo }
                                        onChange={ emisionEjecucion_formHandleProxy }
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 form-check">
                                    <label htmlFor="emisionEjecucion_calculoPrueba" className="form-check-label">Cálculo de prueba</label>
                                    <input
                                        name="emisionEjecucion_calculoPrueba"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionEjecucion_formValues.calculoPrueba }
                                        onChange={ emisionEjecucion_formHandleProxy }
                                        disabled={!IsEnabled(false, true)}
                                    />
                                </div>
                            </div>
                            <div className="row col-12 col-md-6 col-lg-2 no-m-horizontal no-p-horizontal">
                                <div className="col-12">
                                    <label className="form-label">Opciones de Emisión:</label>
                                </div>
                                <div className="col-12 form-check">
                                    <label htmlFor="emisionEjecucion_aplicaDebitoAutomatico" className="form-check-label">Aplica débito automático</label>
                                    <input
                                        name="emisionEjecucion_aplicaDebitoAutomatico"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionEjecucion_formValues.aplicaDebitoAutomatico }
                                        onChange={ emisionEjecucion_formHandleProxy }
                                        disabled={!IsEnabled(false, true)}
                                    />
                                </div>
                                <div className="col-12 form-check">
                                    <label htmlFor="emisionEjecucion_imprimeRecibosEmision" className="form-check-label">Imprime recibos de emisión</label>
                                    <input
                                        name="emisionEjecucion_imprimeRecibosEmision"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionEjecucion_formValues.imprimeRecibosEmision }
                                        onChange={ emisionEjecucion_formHandleProxy }
                                        disabled={!IsEnabled(false, true) || emisionEjecucion_formValues.calculoPagoAnticipado}
                                    />
                                </div>
                                <div className="col-12 form-check"></div>
                            </div>
                            <div className="row col-12 col-lg-8 no-m-horizontal no-p-horizontal">
                                <div className="col-12 form-check">
                                    <label htmlFor="emisionEjecucion_calculoPagoAnticipado" className="form-check-label">Cálculo pago anticipado:</label>
                                    <input
                                        name="emisionEjecucion_calculoPagoAnticipado"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={emisionEjecucion_formValues.calculoPagoAnticipado}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <label htmlFor="emisionEjecucion_fechaPagoAnticipadoVencimiento1" className="form-label">1er Vencimiento</label>
                                    <DatePickerCustom
                                        name="emisionEjecucion_fechaPagoAnticipadoVencimiento1"
                                        placeholder=""
                                        className="form-control"
                                        value={ emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento1 }
                                        onChange={ emisionEjecucion_formHandleProxy }
                                        disabled={!emisionEjecucion_formValues.calculoPagoAnticipado || !IsEnabled(false, true)}
                                    />
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <label htmlFor="emisionEjecucion_fechaPagoAnticipadoVencimiento2" className="form-label">2do Vencimiento</label>
                                    <DatePickerCustom
                                        name="emisionEjecucion_fechaPagoAnticipadoVencimiento2"
                                        placeholder=""
                                        className="form-control"
                                        value={ emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento2 }
                                        onChange={ emisionEjecucion_formHandleProxy }
                                        disabled={!emisionEjecucion_formValues.calculoPagoAnticipado || !IsEnabled(false, true)}
                                        minValue={emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento1}
                                    />
                                </div>
                            </div>                            

                        </div>
                    </div>
                    )}

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
                            entidad="EmisionEjecucion"
                            idEntidad={state.id}
                            disabled={state.mode !== OPERATION_MODE.EDIT}
                            onChange={(row) => setPendingChange(true)}
                        />
                    </div>
                    )}

                    </>
                    )}

                    <Tabs
                        id="tabs-emision-ejecucion"
                        activeKey={state.tabActive}
                        className="m-top-20"
                        onSelect={(tab) => SetTabActive(tab)}
                    >
                        <Tab eventKey="procedimiento" title="Procedimiento">
                            <div className='tab-panel'>
                                <div className='row form-basic'>
                                    <div className="col-12 col-lg-10 m-bottom-20">
                                        <label htmlFor="emisionEjecucion_idProcedimiento" className="form-label">Procedimiento</label>
                                        <InputEntidad
                                            name="emisionEjecucion_idProcedimiento"
                                            placeholder=""
                                            className="form-control"
                                            value={ state.entity.procedimiento.id }
                                            disabled={true}
                                            entidad="Procedimiento"
                                            onFormat={(row) => (row && row.id) ? `${row.nombre} - ${row.descripcion}` : ''}
                                        />
                                    </div>
                                    <div className="col-12 col-lg-10">
                                        <ProcedimientoParametrosGrid
                                            disabled={!IsEnabled(false, true)}
                                            showValue={(state.mode !== OPERATION_MODE.NEW)}
                                            data={{
                                                idEmisionEjecucion: state.id,
                                                listParametros: (state.entity.procedimiento.id > 0)
                                                                ? state.entity.procedimiento.procedimientoParametros
                                                                : [],
                                                listValores: state.entity.emisionProcedimientoParametros
                                            }}
                                            onChange={(typeEntity, rows) => UpdateEmisionProcedimientoParametro(rows)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="cuotas" title="Cuotas" tabClassName={(state.mode !== OPERATION_MODE.NEW) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <EmisionCuotasGrid
                                    disabled={!IsEnabled(false, true) || (emisionEjecucion_formValues.calculoPagoAnticipado && (!emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento1 || !emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento2))}
                                    data={{
                                        idEmisionEjecucion: state.entity.emisionEjecucion.id,
                                        listCuotas: state.entity.emisionCuotas,
                                        listVariables: listVariables,
                                        listFunciones: state.entity.funciones,
                                        fechaVencimiento1: (emisionEjecucion_formValues.calculoPagoAnticipado) ? emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento1 : null,
                                        fechaVencimiento2: (emisionEjecucion_formValues.calculoPagoAnticipado) ? emisionEjecucion_formValues.fechaPagoAnticipadoVencimiento2 : null
                                    }}
                                    onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="ejecucion" title="Ejecución" tabClassName={(state.mode !== OPERATION_MODE.NEW) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <div className='row form-basic'>
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label htmlFor="resume_idEstadoEmisionEjecucion" className="form-label">Estado</label>
                                        <InputLista
                                            name="resume_idEstadoEmisionEjecucion"
                                            placeholder=""
                                            className="form-control"
                                            value={ state.entity.emisionEjecucion.idEstadoEmisionEjecucion }
                                            disabled={true}
                                            lista="EstadoEmisionEjecucion"
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 offset-lg-3 col-lg-3">
                                        <label htmlFor="resume_fechaEjecucionInicio" className="form-label">Inicio Ejecución</label>
                                        <input
                                            name="resume_fechaEjecucionInicio"
                                            type="text"
                                            className="form-control"
                                            value={getDateToString(state.entity.emisionEjecucion.fechaEjecucionInicio, true)}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <label htmlFor="resume_fechaEjecucionFin" className="form-label">Fin Ejecución</label>
                                        <input
                                            name="resume_fechaEjecucionFin"
                                            type="text"
                                            className="form-control"
                                            value={getDateToString(state.entity.emisionEjecucion.fechaEjecucionFin, true)}
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="col-12 col-lg-6">
                                    {state.mode === OPERATION_MODE.EDIT && state.entity.emisionAprobacion.idEstadoAprobacionCalculo === 350 &&
                                    <>
                                        <label className="form-label">Acciones de ejecución</label>
                                        <div>
                                        {state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.PENDIENTE &&
                                            <button className="btn action-button no-m-left m-right-20" data-dismiss="modal" onClick={ (event) => handleClickAction('start') }>Iniciar</button>
                                        }
                                        {(state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.FINALIZADA ||
                                        state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.PAUSADA) &&
                                            <button className="btn back-button no-m-left m-right-20" data-dismiss="modal" onClick={ (event) => handleClickAction('stop') }>Cancelar</button>
                                        }
                                        {state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.PROCESO &&
                                            <button className="btn back-button no-m-left m-right-20" data-dismiss="modal" onClick={ (event) => handleClickAction('pause') }>Pausar</button>
                                        }
                                        {state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.PAUSADA &&
                                            <button className="btn action-button no-m-left m-right-20" data-dismiss="modal" onClick={ (event) => handleClickAction('continue') }>Reanudar</button>
                                        }
                                        {(state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.FINALIZADA ||
                                        state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.CANCELADA ||
                                        state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.PAUSADA) &&
                                            <button className="btn action-button no-m-left m-right-20" data-dismiss="modal" onClick={ (event) => handleClickAction('start') }>Reiniciar</button>
                                        }
                                        </div>
                                    </>
                                    }
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <label className="form-label">Monitor de Ejecución ({processSpeed.processedSeconds} cuentas/seg)</label>
                                        <TableCustom
                                            showFilterGlobal={false}
                                            showPagination={false}
                                            className={'TableCustomBase'}
                                            columns={tableColumnsEmisionEjecucionCuentaResume}
                                            data={listEmisionEjecucionCuentaResume}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="resultadoCuenta" title="Resultados por Cuenta" tabClassName={(state.mode !== OPERATION_MODE.NEW && state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.FINALIZADA) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <EmisionEjecucionCuentasGrid
                                    disabled={state.mode !== OPERATION_MODE.EDIT}
                                    data={{
                                        idCuenta: 0,
                                        emisionEjecucion: state.entity.emisionEjecucion
                                    }}
                                    onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="aprobaciones" title="Aprobaciones" tabClassName={(state.mode !== OPERATION_MODE.NEW && state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.FINALIZADA) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <EmisionAprobacionesGrid
                                    disabled={state.mode !== OPERATION_MODE.EDIT}
                                    data={{
                                        emisionEjecucion: state.entity.emisionEjecucion,
                                        emisionDefinicion: state.entity.emisionDefinicion
                                    }}
                                    onChange={() => FindEmisionEjecucion()}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="procesos" title="Procesos" tabClassName={(state.mode !== OPERATION_MODE.NEW) ? '' : 'invisible'}>
                            <div className='tab-panel'>
                                <EmisionProcesosGrid
                                    disabled={state.mode !== OPERATION_MODE.EDIT}
                                    data={{
                                        emisionEjecucion: state.entity.emisionEjecucion,
                                        emisionDefinicion: state.entity.emisionDefinicion
                                    }}
                                    onChange={() => FindEmisionEjecucion()}
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

export default EmisionEjecucionView;
