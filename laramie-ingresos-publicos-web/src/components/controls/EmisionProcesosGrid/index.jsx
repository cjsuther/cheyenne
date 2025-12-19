import React, { useState, useEffect, useRef } from 'react';
import { object, bool, func } from 'prop-types';
import { DatePickerCustom, InputEntidad, InputLista, Loading, MessageModal, ProcessLoading, TableCustom } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from '../../../consts/requestMethodType';
import { APROBACION_STATE } from '../../../consts/aprobacionState';
import { PROCESO_STATE } from '../../../consts/procesoState';
import ProcesoModal from '../ProcesoModal';
import { getDateNow, getDateToString, getFormatNumber } from '../../../utils/convert';
import { useLista } from '../../hooks/useLista';
import { EMISION_EJECUCION_STATE } from '../../../consts/emisionEjecucionState';


const EmisionProcesosGrid = (props) => {

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
            cuentaCorriente: true,
            impresion: false,
            historialProcesos: false
        }
    });
    const [aprobacion, setAprobacion] = useState(aprobaciontInit);
    const [procesos, setProcesos] = useState({
        procesoCuentaCorriente: procesoInit,
        procesoImpresion: procesoInit
    });
    const [showProcesoModal, setShowProcesoModal] = useState(false);
    const [procesoEdit, setProcesoEdit] = useState(procesoInit);
    const [historialProcesos, setHistorialProcesos] = useState([]);

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


    const [, getRowLista] = useLista({
        listas: ['EstadoProceso'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'EstadoProceso',
          timeout: 0
        }
    });

    const getDescEstadoProceso = (id) => {
        const row = getRowLista('EstadoProceso', id);
        return (row) ? row.nombre : '';
    }

    const cellVMR = (data) =>  <div className='action'>
                                    <div onClick={ (event) => {
                                            const row = data.row.original;
                                            setProcesoEdit(row);
                                            setShowProcesoModal(true);
                                        }}
                                        className="link"
                                    >
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>                              
                                </div>

    const tableColumns = [
        { Header: 'Descripción', accessor: 'descripcion', width: '26%', disableSortBy: true  },
        { Header: 'Estado', Cell: (props) => getDescEstadoProceso(props.value), accessor: 'idEstadoProceso', width: '10%', disableSortBy: true  },
        { Header: 'Avance (%)', Cell: (props) => getFormatNumber(props.value,2), accessor: 'avance', width: '10%', alignCell: 'right' },
        { Header: 'Prog.', Cell: (props) => getDateToString(props.value, true), accessor: 'fechaProceso', width: '8%' },
        { Header: 'Inicio', Cell: (props) => getDateToString(props.value, true), accessor: 'fechaInicio', width: '8%' },
        { Header: 'Fin', Cell: (props) => getDateToString(props.value, true), accessor: 'fechaFin', width: '8%' },
        { Header: 'Descripción', accessor: 'descripcion', width: '26%', disableSortBy: true  },
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'identificador', width: '4%', disableGlobalFilter: true, disableSortBy: true }
    ];

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
                procesoCuentaCorriente: procesoInit,
                procesoImpresion: procesoInit
            }
            const procesoCuentaCorriente = data.filter(f => f.entidad === `ProcesoCuentaCorriente:${props.data.emisionEjecucion.id}`).sort((a,b) => b.id-a.id);
            if (procesoCuentaCorriente.length > 0) procesosNew.procesoCuentaCorriente = procesoCuentaCorriente[0]; //el más reciente
            const procesoImpresion = data.filter(f => f.entidad === `ProcesoImpresion:${props.data.emisionEjecucion.id}`).sort((a,b) => b.id-a.id);
            if (procesoImpresion.length > 0) procesosNew.procesoImpresion = procesoImpresion[0]; //el más reciente

            const processesPendings = data.filter(f => [PROCESO_STATE.PENDIENTE, PROCESO_STATE.PROGRESO].includes(f.idEstadoProceso));
            processesPendingsRef.current = (processesPendings.length > 0);
            
            setProcesos(procesosNew);
            setHistorialProcesos(data);
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
    const handleProcesoCuentaCorriente = () => {
        setState(prevState => {
            return {...prevState, action: "ProcesoCuentaCorriente", async: true};
        });
        NewProceso("Aprobación de Cuenta Corriente");
    }
    const handleProesoImpresion = () => {
        setState(prevState => {
            return {...prevState, action: "ProcesoImpresion", async: true};
        });
        NewProceso("Proceso de Impresión");
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

    <div className={(state.emisionEjecucion && state.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.FINALIZADA) ? 'accordion-header m-top-20' : 'accordion-header m-top-20 invisible'}>
        <div className='row'>
            <div className="col-12" onClick={() => ToggleAccordion('cuentaCorriente')}>
                <div className='accordion-header-title'>
                    {(state.accordions.cuentaCorriente) ? accordionOpen : accordionClose}
                    <h3 className={state.accordions.cuentaCorriente ? 'active' : ''}>Cuenta Corriente</h3>
                </div>
            </div>
        </div>
    </div>
    {(state.emisionEjecucion && state.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.FINALIZADA && state.accordions.cuentaCorriente &&
    <div className='accordion-body'>
        <div className='row'>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idEstadoProcesoCuentaCorriente" className="form-label">Estado de proceso de cuenta corriente</label>
                <InputLista
                    name="idEstadoProcesoCuentaCorriente"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idEstadoProcesoCuentaCorriente }
                    lista="EstadoProceso"
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idUsuarioProcesoCuentaCorriente" className="form-label">Usuario proceso</label>
                <InputEntidad
                    name="idUsuarioProcesoCuentaCorriente"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idUsuarioProcesoCuentaCorriente }
                    entidad="Usuario"
                    disabled={true}
                    onFormat= {(row) => (row && row.id) ? row.nombreApellido : ''}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="fechaProcesoCuentaCorriente" className="form-label">Fecha proceso</label>
                <DatePickerCustom
                    name="fechaProcesoCuentaCorriente"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.fechaProcesoCuentaCorriente }
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3 text-center">
                {(!props.disabled && aprobacion.idEstadoProcesoCuentaCorriente === PROCESO_STATE.PENDIENTE && aprobacion.idEstadoAprobacionCodigoBarras === APROBACION_STATE.APROBADO) &&
                <div className='display-row'>
                <button
                    disabled={[PROCESO_STATE.PENDIENTE, PROCESO_STATE.PROGRESO].includes(procesos.procesoCuentaCorriente.idEstadoProceso)}
                    className="btn action-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleProcesoCuentaCorriente() }>
                    Procesar
                </button>
                <ProcessLoading 
                    className="m-left-5"
                    proceso={procesos.procesoCuentaCorriente}
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

    <div className={(state.emisionEjecucion && state.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.FINALIZADA && state.emisionEjecucion.imprimeRecibosEmision) ? 'accordion-header m-top-20' : 'accordion-header m-top-20 invisible'}>
        <div className='row'>
            <div className="col-12" onClick={() => ToggleAccordion('impresion')}>
                <div className='accordion-header-title'>
                    {(state.accordions.impresion) ? accordionOpen : accordionClose}
                    <h3 className={state.accordions.impresion ? 'active' : ''}>Impresión de Recibos</h3>
                </div>
            </div>
        </div>
    </div>
    {(state.emisionEjecucion && state.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.FINALIZADA && state.emisionEjecucion.imprimeRecibosEmision && state.accordions.impresion &&
    <div className='accordion-body'>
        <div className='row'>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idEstadoProcesoImpresion" className="form-label">Estado de proceso de impresión</label>
                <InputLista
                    name="idEstadoProcesoImpresion"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idEstadoProcesoImpresion }
                    lista="EstadoProceso"
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="idUsuarioProcesoImpresion" className="form-label">Usuario proceso</label>
                <InputEntidad
                    name="idUsuarioProcesoImpresion"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.idUsuarioProcesoImpresion }
                    entidad="Usuario"
                    disabled={true}
                    onFormat= {(row) => (row && row.id) ? row.nombreApellido : ''}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3">
                <label htmlFor="fechaProcesoImpresion" className="form-label">Fecha proceso</label>
                <DatePickerCustom
                    name="fechaProcesoImpresion"
                    placeholder=""
                    className="form-control"
                    value={ aprobacion.fechaProcesoImpresion }
                    disabled={true}
                />
            </div>
            <div className="mb-3 col-12 col-md-6 col-lg-3 text-center">
                {(!props.disabled && aprobacion.idEstadoProcesoCuentaCorriente === PROCESO_STATE.FINALIZADO) &&
                <div className='display-row'>
                <button
                    disabled={[PROCESO_STATE.PENDIENTE, PROCESO_STATE.PROGRESO].includes(procesos.procesoImpresion.idEstadoProceso)}
                    className="btn action-button m-top-25 no-m-horizontal" data-dismiss="modal" onClick={ (event) => handleProesoImpresion() }>
                    Imprimir
                </button>
                <ProcessLoading 
                    className="m-left-5"
                    proceso={procesos.procesoImpresion}
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

    <div className='accordion-header m-top-20'>
        <div className='row'>
            <div className="col-12" onClick={() => ToggleAccordion('historialProcesos')}>
                <div className='accordion-header-title'>
                    {(state.accordions.historialProcesos) ? accordionOpen : accordionClose}
                    <h3 className={state.accordions.historialProcesos ? 'active' : ''}>Historial de Procesos</h3>
                </div>
            </div>
        </div>
    </div>
    {(state.accordions.historialProcesos &&
    <div className='accordion-body'>
        <TableCustom
            showFilterGlobal={false}
            showPagination={false}
            className={'TableCustomBase'}
            columns={tableColumns}
            data={historialProcesos}
            disabledEllipsis={true}
        />
    </div>
    )}

  </>
  );
}

EmisionProcesosGrid.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onChange: func
};

EmisionProcesosGrid.defaultProps = {
  disabled: false,
  onChange: null
};

export default EmisionProcesosGrid;