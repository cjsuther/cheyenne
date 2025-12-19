import React, { useState, useEffect, useRef } from 'react';
import { object, bool, func } from 'prop-types';
import { DatePickerCustom, InputCuenta, InputEntidad, InputLista, Loading, MessageModal, ProcessLoading } from '../../common';
import { CloneObject, OpenObjectURL } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from '../../../consts/requestMethodType';
import { useReporte } from '../../hooks/useReporte';
import { useConfiguracion } from '../../hooks/useConfiguracion';
import { APROBACION_STATE } from '../../../consts/aprobacionState';
import { PROCESO_STATE } from '../../../consts/procesoState';
import ProcesoModal from '../../controls/ProcesoModal';
import { getDateNow } from '../../../utils/convert';


const EmisionAprobacionesGrid = (props) => {

    const procesoInit = {
        id: 0,
        identificador: "",
        entidad: "",
        idEstadoProceso: 0,
        fechaProceso: null,
        fechaInicio: null,
        fechaFin: null,
        descripcion: "",
        observacion: "",
        avance: 0,
        origen: "",
        idUsuarioCreacion: "",
        fechaCreacion: null,
        urlEjecucion: ""
    }

    const aprobaciontInit = {
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
    }

    const processesPendingsRef = useRef(false);

    //hooks
    const [state, setState] = useState({
        emisionEjecucion: null,
        emisionDefinicion: null,
        disabled: false,
        loading: false,
        showMessage: false,
        textMessage: '',
        action: '',
        async: false,
        accordions: {
            calculo: true,
            ordenamiento: false,
            controlRecibos: false,
            codigoBarras: false
        }
    });
    const [aprobacion, setAprobacion] = useState(aprobaciontInit);
    const [idOrdenamientoGeneral, setIdOrdenamientoGeneral] = useState(0);
    const [idCuentaControlRecibos, setIdCuentaControlRecibos] = useState(0);
    const [procesos, setProcesos] = useState({
        emisionAprobacionCalculo: procesoInit,
        procesoOrdenamiento: procesoInit,
        emisionAprobacionOrdenamiento: procesoInit,
        aprobacionCodigoBarras: procesoInit
    });
    const [showProcesoModal, setShowProcesoModal] = useState(false);
    const [procesoEdit, setProcesoEdit] = useState(procesoInit);


    const mount = () => {
        let myInterval = null;
        if (props.data) {
            setState(prevState => {
                return {...prevState,
                emisionEjecucion: props.data.emisionEjecucion,
                emisionDefinicion: props.data.emisionDefinicion
                };
            });
            if (props.data.emisionEjecucion.id > 0) {
                FindEmisionAprobacion(props.data.emisionEjecucion.id);
                SearchProcesos(props.data.emisionEjecucion.id);
                myInterval = setInterval(() => {
                    if (processesPendingsRef.current) {
                        SearchProcesos(props.data.emisionEjecucion.id);
                    }
                }, 5000);
            }
        }

        return () => {
            if (myInterval) clearInterval(myInterval)
        };
    }
    useEffect(mount, [props.data.emisionEjecucion]);

    const [ordenamientoGeneral, , ] = useConfiguracion({
        key: "OrdenamientoGeneral",
        onLoaded: (data, isSuccess, error) => {
            if (!isSuccess) {
              ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
          }
    });

    useEffect(() => {
        if (ordenamientoGeneral) {
            setIdOrdenamientoGeneral(parseInt(ordenamientoGeneral));
        }
        else {
            setIdOrdenamientoGeneral(0);
        }
    }, [ordenamientoGeneral]);

    const [ generateReporte, ] = useReporte({
        callback: (reporte, buffer, error) => {
            if (error) {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
            else {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                const extension = (reporte === "EmisionAprobacionControlRecibos" ? "pdf" : "xlsx")
                OpenObjectURL(`${reporte}.${extension}`, buffer);
            }
        }
    });


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
    const callbackSuccessSearchProcesos = (response) => {
        response.json()
        .then((data) => {

            if (data.fechaCreacion) data.fechaCreacion = new Date(data.fechaCreacion);
            if (data.fechaProceso) data.fechaProceso = new Date(data.fechaProceso);
            if (data.fechaInicio) data.fechaInicio = new Date(data.fechaInicio);
            if (data.fechaFin) data.fechaFin = new Date(data.fechaFin);

            let procesosNew = {
                emisionAprobacionCalculo: procesoInit,
                procesoOrdenamiento: procesoInit,
                emisionAprobacionOrdenamiento: procesoInit,
                aprobacionCodigoBarras: procesoInit
            }
            const emisionAprobacionCalculo = data.filter(f => f.entidad === `EmisionAprobacionCalculo:${props.data.emisionEjecucion.id}`).sort((a,b) => b.id-a.id);
            if (emisionAprobacionCalculo.length > 0) procesosNew.emisionAprobacionCalculo = emisionAprobacionCalculo[0]; //el más reciente
            const procesoOrdenamiento = data.filter(f => f.entidad === `ProcesoOrdenamiento:${props.data.emisionEjecucion.id}`).sort((a,b) => b.id-a.id);
            if (procesoOrdenamiento.length > 0) procesosNew.procesoOrdenamiento = procesoOrdenamiento[0]; //el más reciente
            const emisionAprobacionOrdenamiento = data.filter(f => f.entidad === `EmisionAprobacionOrdenamiento:${props.data.emisionEjecucion.id}`).sort((a,b) => b.id-a.id);
            if (emisionAprobacionOrdenamiento.length > 0) procesosNew.emisionAprobacionOrdenamiento = emisionAprobacionOrdenamiento[0]; //el más reciente
            const aprobacionCodigoBarras = data.filter(f => f.entidad === `AprobacionCodigoBarras:${props.data.emisionEjecucion.id}`).sort((a,b) => b.id-a.id);
            if (aprobacionCodigoBarras.length > 0) procesosNew.aprobacionCodigoBarras = aprobacionCodigoBarras[0]; //el más reciente

            const processesPendings = data.filter(f => [PROCESO_STATE.PENDIENTE, PROCESO_STATE.PROGRESO].includes(f.idEstadoProceso));
            processesPendingsRef.current = (processesPendings.length > 0);
            
            setProcesos(procesosNew);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackSuccessFindEmisionAprobacion = (response) => {
        response.json()
        .then((data) => {
            if (data.fechaAprobacionCalculo) data.fechaAprobacionCalculo = new Date(data.fechaAprobacionCalculo);
            if (data.fechaAprobacionOrdenamiento) data.fechaAprobacionOrdenamiento = new Date(data.fechaAprobacionOrdenamiento);
            if (data.fechaAprobacionControlRecibos) data.fechaAprobacionControlRecibos = new Date(data.fechaAprobacionControlRecibos);
            if (data.fechaAprobacionCodigoBarras) data.fechaAprobacionCodigoBarras = new Date(data.fechaAprobacionCodigoBarras);
            if (data.fechaProcesoCuentaCorriente) data.fechaProcesoCuentaCorriente = new Date(data.fechaProcesoCuentaCorriente);
            if (data.fechaProcesoImpresion) data.fechaProcesoImpresion = new Date(data.fechaProcesoImpresion);

            setAprobacion(data);
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
    const callbackSuccessModifyEmisionAprobacionAsync = (response) => {
        response.json()
        .then((data) => {
            setState(prevState => {
                return {...prevState, loading: false};
            });  
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, `Proceso iniciado...`);
            SearchProcesos(state.emisionEjecucion.id);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackSuccessModifyEmisionAprobacion = (response) => {
        if (props.onChange !== null) {
            props.onChange();
        }
        callbackSuccessFindEmisionAprobacion(response);
    }
    const callbackSuccesModifyCancelProceso = (response) => {
        response.json()
        .then((data) => {
            setState(prevState => {
                return {...prevState, loading: false};
            });
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, `Proceso anulado correctamente`);
            SearchProcesos(state.emisionEjecucion.id);
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
    function SearchProcesos(idEmisionEjecucion) {

        const paramsUrl = `/emision-ejecucion/${idEmisionEjecucion}`;
    
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PROCESO,
            paramsUrl,
            null,
            callbackSuccessSearchProcesos,
            callbackNoSuccess,
            callbackError
        );
    
    }
    function FindEmisionAprobacion(idEmisionEjecucion) {

        setState(prevState => {
        return {...prevState, loading: true};
        });
    
        const paramsUrl = `/emision-ejecucion/${idEmisionEjecucion}`;
    
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.EMISION_APROBACION,
            paramsUrl,
            null,
            callbackSuccessFindEmisionAprobacion,
            callbackNoSuccess,
            callbackError
        );
    
    }
    function ModifyEmisionAprobacion(idEmisionAprobacion, fechaProceso = null) {

        setState(prevState => {
        return {...prevState, loading: true};
        });
    
        const paramsUrl = (state.async) ? 
                            (fechaProceso) ? `/async/${idEmisionAprobacion}/${state.action}/${fechaProceso}` : 
                                             `/async/${idEmisionAprobacion}/${state.action}` :
                           `/${idEmisionAprobacion}/${state.action}`;
    
        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.EMISION_APROBACION,
            paramsUrl,
            null,
            (state.async) ? callbackSuccessModifyEmisionAprobacionAsync : callbackSuccessModifyEmisionAprobacion,
            callbackNoSuccess,
            callbackError
        );
    
    }
    function ModifyCancelProceso(identificador) {

        setState(prevState => {
        return {...prevState, loading: true};
        });
    
        const paramsUrl = `/cancel/${identificador}`;
    
        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.PROCESO,
            paramsUrl,
            null,
            callbackSuccesModifyCancelProceso,
            callbackNoSuccess,
            callbackError
        );
    
    }
    function EmisionAccion(fechaProceso = null) {
        ModifyEmisionAprobacion(aprobacion.id, fechaProceso);
        setState(prevState => {
            return {...prevState, showMessage: false, textMessage: "", action: "", async: false};
        });
    }
    function NewProceso(descripcion) {
        let proceso = CloneObject(procesoInit);
        proceso.descripcion = descripcion;
        proceso.fechaProceso = getDateNow(true);
        setProcesoEdit(proceso);
        setShowProcesoModal(true);
    }

    //handles
    const handleAprobarCalculo = () => {
        setState(prevState => {
            return {...prevState, showMessage: true, textMessage: "¿Está seguro de aprobar el proceso de cálculo?", action: "AprobacionCalculo", async: false};
        });
    }
    const handleInformeCalculo = () => {
        setState(prevState => {
            return {...prevState, showMessage: true, textMessage: "¿Está seguro de generar el informe de cálculo?", action: "EmisionAprobacionCalculo", async: true};
        });
    }
    const handleAprobarOrdenamiento = () => {
        setState(prevState => {
            return {...prevState, showMessage: true, textMessage: "¿Está seguro de aprobar el proceso de ordenamiento?", action: "AprobacionOrdenamiento", async: false};
        });
    }
    const handleProcesoOrdenamiento = () => {
        setState(prevState => {
            return {...prevState, action: "ProcesoOrdenamiento", async: true};
        });
        NewProceso("Proceso de Ordenamiento");
    }
    const handleInformeOrdenamiento = () => {
        setState(prevState => {
            return {...prevState, showMessage: true, textMessage: "¿Está seguro de generar el informe de orgenamiento?", action: "EmisionAprobacionOrdenamiento", async: true};
        });
    }
    const handleAprobarControlRecibos = () => {
        setState(prevState => {
            return {...prevState, showMessage: true, textMessage: "¿Está seguro de aprobar el proceso de control de recibos?", action: "AprobacionControlRecibos", async: false};
        });
    }
    const handleAprobarCodigoBarras = () => {
        setState(prevState => {
            return {...prevState, action: "AprobacionCodigoBarras", async: true};
        });
        NewProceso("Aprobación de Código de Barras");
    }

    const handleClickReporte = (reporte) => {
        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsReporte = {
            idEmisionEjecucion: state.emisionEjecucion.id,
            idCuenta: (reporte === "EmisionAprobacionControlRecibos") ? idCuentaControlRecibos : 0
        }
        generateReporte(reporte, paramsReporte);
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

    {state.showMessage && 
        <MessageModal
            title={"Confirmación"}
            message={state.textMessage}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showMessage: false, rowForm: null};
              });
            }}
            onConfirm={() => {
              setState(prevState => {
                  return {...prevState, showMessage: false};
              });
              EmisionAccion();
            }}
        />
    }

    {showProcesoModal && 
        <ProcesoModal
            proceso={procesoEdit}
            onDismiss={() => {
                setShowProcesoModal(false);
            }}
            onConfirm={(row) => {
                setShowProcesoModal(false);
                EmisionAccion(row.fechaProceso);
            }}
            onCancel={(row) => {
                setShowProcesoModal(false);
                ModifyCancelProceso(row.identificador);
            }}
            disabled={props.disabled}
        />
    }

    <div className='accordion-header m-top-20'>
        <div className='row'>
            <div className="col-12" onClick={() => ToggleAccordion('calculo')}>
                <div className='accordion-header-title'>
                    {(state.accordions.calculo) ? accordionOpen : accordionClose}
                    <h3 className={state.accordions.calculo ? 'active' : ''}>Cálculo</h3>
                </div>
            </div>
        </div>
    </div>
    {(state.accordions.calculo &&
    <div className='accordion-body'>
        <div className='row'>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idEstadoAprobacionCalculo" className="form-label">Estado de proceso de cálculo</label>
                <InputLista
                    name="idEstadoAprobacionCalculo"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idEstadoAprobacionCalculo }
                    lista="EstadoAprobacion"
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idUsuarioAprobacionCalculo" className="form-label">Usuario aprobación</label>
                <InputEntidad
                    name="idUsuarioAprobacionCalculo"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idUsuarioAprobacionCalculo }
                    entidad="Usuario"
                    disabled={true}
                    onFormat= {(row) => (row && row.id) ? row.nombreApellido : ''}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="fechaAprobacionCalculo" className="form-label">Fecha aprobación</label>
                <DatePickerCustom
                    name="fechaAprobacionCalculo"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.fechaAprobacionCalculo }
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3 text-center">
                {(!props.disabled && aprobacion.idEstadoAprobacionCalculo === APROBACION_STATE.PENDIENTE) &&
                <button className="btn action-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleAprobarCalculo() }>Aprobar</button>
                }
            </div>
        </div>
        <div className='row'>
            <div className="mb-3 col-12 col-md-6 col-lg-3 display-row">
                <button
                    disabled={[PROCESO_STATE.PENDIENTE, PROCESO_STATE.PROGRESO].includes(procesos.emisionAprobacionCalculo.idEstadoProceso)}
                    className="btn back-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleInformeCalculo() }>
                    Informe de Cálculo
                </button>
                <ProcessLoading
                    className="m-left-5"
                    proceso={procesos.emisionAprobacionCalculo}
                    onFinish={() => {
                        ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, `Informe generado exitosamente. Podrá descargar el archivo en la sección de Información Adicional`);
                        if (props.onChange !== null) {
                            props.onChange();
                        }
                    }}
                    onClick={(row) => {
                        setProcesoEdit(row);
                        setShowProcesoModal(true);
                    }}
                    showFinalizado={true}
                />
            </div>
        </div>
    </div>
    )}

    <div className={(state.emisionEjecucion && state.emisionEjecucion.imprimeRecibosEmision) ? 'accordion-header m-top-20' : 'accordion-header m-top-20 invisible'}>
        <div className='row'>
            <div className="col-12" onClick={() => ToggleAccordion('ordenamiento')}>
                <div className='accordion-header-title'>
                    {(state.accordions.ordenamiento) ? accordionOpen : accordionClose}
                    <h3 className={state.accordions.ordenamiento ? 'active' : ''}>Ordenamiento</h3>
                </div>
            </div>
        </div>
    </div>
    {(state.accordions.ordenamiento &&
    <div className='accordion-body'>
        <div className='row'>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idEstadoAprobacionOrdenamiento" className="form-label">Estado de proceso de ordenamiento</label>
                <InputLista
                    name="idEstadoAprobacionOrdenamiento"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idEstadoAprobacionOrdenamiento }
                    lista="EstadoAprobacion"
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idUsuarioAprobacionOrdenamiento" className="form-label">Usuario aprobación</label>
                <InputEntidad
                    name="idUsuarioAprobacionOrdenamiento"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idUsuarioAprobacionOrdenamiento }
                    entidad="Usuario"
                    disabled={true}
                    onFormat= {(row) => (row && row.id) ? row.nombreApellido : ''}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="fechaAprobacionOrdenamiento" className="form-label">Fecha aprobación</label>
                <DatePickerCustom
                    name="fechaAprobacionOrdenamiento"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.fechaAprobacionOrdenamiento }
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3 text-center">
                {(!props.disabled && aprobacion.idEstadoAprobacionOrdenamiento === APROBACION_STATE.PENDIENTE && aprobacion.idEstadoAprobacionCalculo === APROBACION_STATE.APROBADO) &&
                <button className="btn action-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleAprobarOrdenamiento() }>Aprobar</button>
                }
            </div>
        </div>
        <div className='row'>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idOrdenamientoGeneral" className="form-label">Método de ordenamiento</label>
                <InputLista
                    name="idOrdenamientoGeneral"
                    placeholder=""
                    className="form-control"
                    value={ idOrdenamientoGeneral }
                    lista="OrdenamientoGeneral"
                    disabled={true}
                />
            </div>
            {(!props.disabled && aprobacion.idEstadoAprobacionOrdenamiento === APROBACION_STATE.PENDIENTE && aprobacion.idEstadoAprobacionCalculo === APROBACION_STATE.APROBADO) &&
            <div className="mb-3 col-12 col-md-6 col-lg-3 display-row">
                <button
                    disabled={[PROCESO_STATE.PENDIENTE, PROCESO_STATE.PROGRESO].includes(procesos.procesoOrdenamiento.idEstadoProceso)}
                    className="btn back-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleProcesoOrdenamiento() }>
                    Procesar Ordenamiento
                </button>
                <ProcessLoading
                    className="m-left-5"
                    proceso={procesos.procesoOrdenamiento}
                    onFinish={() => {
                        FindEmisionAprobacion(state.emisionEjecucion.id);
                        if (props.onChange !== null) {
                            props.onChange();
                        }
                    }}
                    onClick={(row) => {
                        setProcesoEdit(row);
                        setShowProcesoModal(true);
                    }}
                    showFinalizado={true}
                />
            </div>
            }
            {(aprobacion.idEstadoAprobacionCalculo === APROBACION_STATE.APROBADO) &&
            <div className="mb-3 col-12 col-md-6 col-lg-3 display-row">
                <button
                    disabled={[PROCESO_STATE.PENDIENTE, PROCESO_STATE.PROGRESO].includes(procesos.emisionAprobacionOrdenamiento.idEstadoProceso)}
                    className="btn back-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleInformeOrdenamiento() }>
                    Informe de Ordenamiento
                </button>
                <ProcessLoading 
                    className="m-left-5"
                    proceso={procesos.emisionAprobacionOrdenamiento}
                    onFinish={() => {
                        ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, `Informe generado exitosamente. Podrá descargar el archivo en la sección de Información Adicional`);
                        if (props.onChange !== null) {
                            props.onChange();
                        }
                    }}
                    onClick={(row) => {
                        setProcesoEdit(row);
                        setShowProcesoModal(true);
                    }}
                    showFinalizado={true}
                />
            </div>
            }
        </div>
    </div>
    )}

    <div className={(state.emisionEjecucion && state.emisionEjecucion.imprimeRecibosEmision) ? 'accordion-header m-top-20' : 'accordion-header m-top-20 invisible'}>
        <div className='row'>
            <div className="col-12" onClick={() => ToggleAccordion('controlRecibos')}>
                <div className='accordion-header-title'>
                    {(state.accordions.controlRecibos) ? accordionOpen : accordionClose}
                    <h3 className={state.accordions.controlRecibos ? 'active' : ''}>Control de Recibos</h3>
                </div>
            </div>
        </div>
    </div>
    {(state.accordions.controlRecibos &&
    <div className='accordion-body'>
        <div className='row'>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idEstadoAprobacionControlRecibos" className="form-label">Estado de proceso de control de recibos</label>
                <InputLista
                    name="idEstadoAprobacionControlRecibos"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idEstadoAprobacionControlRecibos }
                    lista="EstadoAprobacion"
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idUsuarioAprobacionControlRecibos" className="form-label">Usuario aprobación</label>
                <InputEntidad
                    name="idUsuarioAprobacionControlRecibos"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idUsuarioAprobacionControlRecibos }
                    entidad="Usuario"
                    disabled={true}
                    onFormat= {(row) => (row && row.id) ? row.nombreApellido : ''}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="fechaAprobacionControlRecibos" className="form-label">Fecha aprobación</label>
                <DatePickerCustom
                    name="fechaAprobacionControlRecibos"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.fechaAprobacionControlRecibos }
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3 text-center">
                {(!props.disabled && aprobacion.idEstadoAprobacionControlRecibos === APROBACION_STATE.PENDIENTE && aprobacion.idEstadoAprobacionOrdenamiento === APROBACION_STATE.APROBADO) &&
                <button className="btn action-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleAprobarControlRecibos() }>Aprobar</button>
                }
            </div>
        </div>
        <div className='row'>
            {(aprobacion.idEstadoAprobacionOrdenamiento === APROBACION_STATE.APROBADO) &&
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <InputCuenta
                    name="idCuenta"
                    placeholder="Seleccione una cuenta..."
                    className="form-control m-top-25"
                    value={idCuentaControlRecibos}
                    onChange={(event) => {
                        const {target} = event;
                        setIdCuentaControlRecibos(target.value);
                    }}
                    disabled={false}
                    idTipoTributo={state.emisionDefinicion.idTipoTributo}
                />
            </div>
            }
            {(aprobacion.idEstadoAprobacionOrdenamiento === APROBACION_STATE.APROBADO && idCuentaControlRecibos > 0) &&
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <button className="btn back-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleClickReporte("EmisionAprobacionControlRecibos") }>Imprimir Recibo</button>
            </div>
            }
        </div>
    </div>
    )}

    <div className={(state.emisionEjecucion && state.emisionEjecucion.imprimeRecibosEmision) ? 'accordion-header m-top-20' : 'accordion-header m-top-20 invisible'}>
        <div className='row'>
            <div className="col-12" onClick={() => ToggleAccordion('codigoBarras')}>
                <div className='accordion-header-title'>
                    {(state.accordions.codigoBarras) ? accordionOpen : accordionClose}
                    <h3 className={state.accordions.codigoBarras ? 'active' : ''}>Código de Barras</h3>
                </div>
            </div>
        </div>
    </div>
    {(state.accordions.codigoBarras &&
    <div className='accordion-body'>
        <div className='row'>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idEstadoAprobacionCodigoBarras" className="form-label">Estado de proceso de código de barras</label>
                <InputLista
                    name="idEstadoAprobacionCodigoBarras"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idEstadoAprobacionCodigoBarras }
                    lista="EstadoAprobacion"
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idUsuarioAprobacionCodigoBarras" className="form-label">Usuario aprobación</label>
                <InputEntidad
                    name="idUsuarioAprobacionCodigoBarras"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idUsuarioAprobacionCodigoBarras }
                    entidad="Usuario"
                    disabled={true}
                    onFormat= {(row) => (row && row.id) ? row.nombreApellido : ''}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="fechaAprobacionCodigoBarras" className="form-label">Fecha aprobación</label>
                <DatePickerCustom
                    name="fechaAprobacionCodigoBarras"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.fechaAprobacionCodigoBarras }
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3 text-center">
                {(!props.disabled && aprobacion.idEstadoAprobacionCodigoBarras === APROBACION_STATE.PENDIENTE && aprobacion.idEstadoAprobacionControlRecibos === APROBACION_STATE.APROBADO) &&
                <div className='display-row'>
                <button
                    disabled={[PROCESO_STATE.PENDIENTE, PROCESO_STATE.PROGRESO].includes(procesos.aprobacionCodigoBarras.idEstadoProceso)}
                    className="btn action-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleAprobarCodigoBarras() }>
                    Aprobar
                </button>
                <ProcessLoading 
                    className="m-left-5"
                    proceso={procesos.aprobacionCodigoBarras}
                    onFinish={() => {
                        FindEmisionAprobacion(state.emisionEjecucion.id);
                        if (props.onChange !== null) {
                            props.onChange();
                        }
                    }}
                    onClick={(row) => {
                        setProcesoEdit(row);
                        setShowProcesoModal(true);
                    }}
                    showFinalizado={true}
                />
                </div>
                }
            </div>
        </div>
    </div>
    )}

  </>
  );
}

EmisionAprobacionesGrid.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onChange: func
};

EmisionAprobacionesGrid.defaultProps = {
  disabled: false,
  onChange: null
};

export default EmisionAprobacionesGrid;