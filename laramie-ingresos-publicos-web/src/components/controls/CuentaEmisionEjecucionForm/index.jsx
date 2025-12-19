import React, { useState, useEffect, useMemo } from 'react';
import { object, func } from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';

import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { EMISION_EJECUCION_STATE } from "../../../consts/emisionEjecucionState";
import { APIS } from '../../../config/apis';
import { ServerRequest } from '../../../utils/apiweb';
import { ALERT_TYPE } from '../../../consts/alertType';
import { OPERATION_MODE } from '../../../consts/operationMode';
import { useForm } from '../../hooks/useForm';

import { Loading, InputEntidad, InputEjercicio } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { getDateNow } from '../../../utils/convert';
import ShowToastMessage from '../../../utils/toast';
import ProcedimientoParametrosGrid from '../../controls/ProcedimientoParametrosGrid';
import EmisionCuotasGrid from '../../controls/EmisionCuotasGrid';
import EmisionEjecucionCuentasGrid from '../../controls/EmisionEjecucionCuentasGrid';
import { isNull } from '../../../utils/validator';
import { EMISION_DEFINICION_STATE } from '../../../consts/emisionDefinicionState';


const CuentaEmisionEjecucionForm = (props) => {

    //variables
    let periodoEmision = "";
    const today = getDateNow(false);
    const procedimientoValorPredeterminado = "";

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
    const [state, setState] = useState({
        idCuenta: 0,
        idTipoTributo: 0,
        loading: false,
        entity: entityInit,
        tabActive: "procedimiento"
    });

    const [timestampUpdateVariables, setTimestampUpdateVariables] = useState(null);

    const mount = () => {
        if(props.data.idCuenta > 0) {
            setState(prevState => {
                return {...prevState,
                    idCuenta: props.data.idCuenta,
                    idTipoTributo: props.data.idTipoTributo,
                    entity: entityInit
                };
            });
        }
    }
    useEffect(mount, [props.data.idCuenta]);

    const [ emisionEjecucion_formValues, emisionEjecucion_formHandle, , emisionEjecucion_formSet ] = useForm({
        idEmisionDefinicion: 0,
        periodo: ''
    }, 'emisionEjecucion_');

    let listVariables = useMemo(() => 
        getListVariables(state.entity.emisionVariables, state.entity.procedimiento),
        [timestampUpdateVariables]);


    //handles
    const handleClickEjecutar = () => {
        if (isFormValid()) {
            AddEmisionEjecucion();
        };
    };
    const handleClickConfirmar = () => {
        ConfirmEmisionEjecucion();
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
            emisionEjecucion_formSet({
                idEmisionDefinicion: data.emisionEjecucion.idEmisionDefinicion,
                periodo: data.emisionEjecucion.periodo
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
    const callbackSuccessFindProcedimiento = (response) => {
        response.json()
        .then((data) => {
            let entity = CloneObject(state.entity);
            entity.procedimiento = data;
            entity.emisionProcedimientoParametros = data.procedimientoParametros.map(parametro => {
                return {
                    id: 0,
                    idEmisionEjecucion: 0,
                    idProcedimientoParametro: parametro.id,
                    valor: procedimientoValorPredeterminado
                };
            });
            entity.emisionCuotas = [1,2,3,4,5,6,7,8,9,10,11,12].map(month => {
                let fechaVencimiento = new Date(parseInt(periodoEmision), month, 0);
                if (fechaVencimiento.getDay() === 6) fechaVencimiento.setDate(fechaVencimiento.getDate()-1); //6:saturday
                if (fechaVencimiento.getDay() === 0) fechaVencimiento.setDate(fechaVencimiento.getDate()-2); //0:sunday
                return {
                    id: month,
                    idEmisionEjecucion: 0,
                    cuota: month.toString(),
                    mes: month,
                    descripcion: `${periodoEmision}-${month.toString()}`,
                    formulaCondicion: "",
                    anioDDJJ: today.getFullYear().toString(),
                    mesDDJJ: month,
                    fechaVencimiento1: fechaVencimiento,
                    fechaVencimiento2: fechaVencimiento,
                    orden: month,
                    state: 'a'
                };
            });
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
        if (state.entity.emisionCuotas.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe definir las cuotas de emisión');
            return false;
        }

        return true;
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
        entity.emisionProcedimientoParametros = [];
        setState(prevState => {
            return {...prevState, loading: false, entity: entity};
        });
    }

    function AddEmisionEjecucion() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            callbackSuccessFindEmisionEjecucion(response);
            ShowToastMessage(ALERT_TYPE.ALERT_INFO, "Emisión ejecutada correctamente. Deberá conifrmar para impactar los datos en la cuenta corriente", () => {
                SetTabActive("resultadoCuenta");
            });
        };

        const dataBody = {
            ...entityInit,
            emisionEjecucion: {
                ...state.entity.emisionEjecucion,
                idEmisionDefinicion: parseInt(emisionEjecucion_formValues.idEmisionDefinicion),
                periodo: emisionEjecucion_formValues.periodo
            },
            emisionProcedimientoParametros: state.entity.emisionProcedimientoParametros,
            emisionCuotas: state.entity.emisionCuotas
        };

        const paramsUrl = `/mostrador-web/${state.idCuenta}`;

        ServerRequest(
            REQUEST_METHOD.POST,
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

    function ConfirmEmisionEjecucion() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Emisión confirmada correctamente. Los recibos podrán ser emitidos desde la cuenta corriente", () => {
                props.onDismiss();
            });
        };

        const paramsUrl = `/${state.entity.emisionAprobacion.id}/AprobacionCalculo`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.EMISION_APROBACION,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }
    
    function UpdateEntity(typeEntity, row) {
        let entity = CloneObject(state.entity);

        if (typeEntity === 'EmisionCuota') {
            if (row.state === 'a') {
                entity.emisionCuotas.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.emisionCuotas.indexOf(entity.emisionCuotas.find(x => x.id === row.id));
                if (index !== -1) {
                    row.state = 'a'; //originalmente era un alta
                    entity.emisionCuotas[index] = row;
                }
            }
            else if (row.state === 'r') {
                entity.emisionCuotas = entity.emisionCuotas.filter(f => f.id !== row.id);
            }
        }

        setState(prevState => {
            return {...prevState,
                entity: entity
            };
        });
    }

    function UpdateEmisionProcedimientoParametro(rows) {
        let entity = CloneObject(state.entity);

        rows.forEach(row => {
            const index = entity.emisionProcedimientoParametros.indexOf(entity.emisionProcedimientoParametros.find(x => x.id === row.id));
            if (index !== -1) {
                entity.emisionProcedimientoParametros[index] = row;
            }
        });

        setState(prevState => {
            return {...prevState,
                entity: entity
            };
        });
    }

    function SetTabActive(tab) {
        setState(prevState => {
            return {...prevState, tabActive: tab};
        });
    }

    return (
    <>

        <Loading visible={state.loading}></Loading>

        <div className="m-top-10 m-bottom-10">

            <div className='accordion-header'>
                <div className='row'>
                    <div className="col-12">
                        <div className='accordion-header-title'>
                            <i className="fa fa-search"></i>
                            <h3 className='active'>Selección de Emisión</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className='accordion-body'>
                <div className='row form-basic'>
                    <div className="col-12 col-lg-7">
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
                                periodoEmision = '';
                                if (target.value > 0) {
                                    periodoEmision = target.row.periodo;
                                    idEmisionDefinicion = target.row.id;
                                    FindProcedimiento(target.row.idProcedimiento);
                                }
                                else {
                                    CleanProcedimiento();
                                }
                                emisionEjecucion_formSet({...emisionEjecucion_formValues,
                                    idEmisionDefinicion: idEmisionDefinicion,
                                    periodo: periodoEmision
                                });
                            }}
                            entidad="EmisionDefinicion"
                            onFormat={(row) => (row && row.id) ? `${row.numero} - ${row.descripcion}` : ''}
                            columns={[
                                { Header: 'Número', accessor: 'numero', width: '20%' },
                                { Header: 'Descripción', accessor: 'descripcion', width: '80%' },
                            ]}
                            filter={(row) => {
                                if (row.fechaReliquidacionDesde) row.fechaReliquidacionDesde = new Date(row.fechaReliquidacionDesde);
                                if (row.fechaReliquidacionHasta) row.fechaReliquidacionHasta = new Date(row.fechaReliquidacionHasta);
                                return (row.calculoMostradorWeb &&
                                        row.idTipoTributo === state.idTipoTributo &&
                                        row.idEstadoEmisionDefinicion === EMISION_DEFINICION_STATE.ACTIVA &&
                                        (isNull(row.fechaReliquidacionDesde) || row.fechaReliquidacionDesde <= today ) &&
                                        (isNull(row.fechaReliquidacionHasta) || row.fechaReliquidacionHasta >= today ))
                            }}
                            disabled={(state.entity.emisionEjecucion.id !== 0)}
                        />
                    </div>
                    <div className="col-12 col-lg-2">
                        <label htmlFor="emisionEjecucion_periodo" className="form-label">Período</label>
                        <InputEjercicio
                            name="emisionEjecucion_periodo"
                            placeholder=""
                            className="form-control"
                            value={ emisionEjecucion_formValues.periodo }
                            onChange={ emisionEjecucion_formHandle }
                            disabled={true}
                        />
                    </div>
                    {(emisionEjecucion_formValues.idEmisionDefinicion > 0) &&
                    <div className="col-12 col-lg-3 m-top-33 align-center">
                        {(state.entity.emisionEjecucion.id === 0) ?
                        <button className="btn action-button no-m-horizontal" onClick={ (event) => handleClickEjecutar() }>Ejecutar Emisión</button>
                        :
                        <button className="btn action-button no-m-horizontal" onClick={ (event) => handleClickConfirmar() }>Confirmar Emisión</button>
                        }
                    </div>
                    }
                </div>
            </div>

            <div className={(emisionEjecucion_formValues.idEmisionDefinicion === 0) ? 'invisible' : ''}>
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
                                        disabled={(state.entity.emisionEjecucion.id !== 0)}
                                        showValue={true}
                                        showPagination={true}
                                        data={{
                                            idEmisionEjecucion: state.entity.emisionEjecucion.id,
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
                                disabled={(state.entity.emisionEjecucion.id !== 0)}
                                requireConfirmRemove={false}
                                data={{
                                    idEmisionEjecucion: state.entity.emisionEjecucion.id,
                                    listCuotas: state.entity.emisionCuotas,
                                    listVariables: listVariables,
                                    listFunciones: state.entity.funciones,
                                    fechaVencimiento1: null,
                                    fechaVencimiento2: null
                                }}
                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                            />
                        </div>
                    </Tab>
                    <Tab eventKey="resultadoCuenta" title="Resultados por Cuenta" tabClassName={(state.mode !== OPERATION_MODE.NEW && state.entity.emisionEjecucion.idEstadoEmisionEjecucion === EMISION_EJECUCION_STATE.FINALIZADA) ? '' : 'invisible'}>
                        <div className='tab-panel'>
                            <EmisionEjecucionCuentasGrid
                                disabled={true}
                                data={{
                                    idCuenta: state.idCuenta,
                                    emisionEjecucion: state.entity.emisionEjecucion
                                }}
                                onChange={(typeEntity, row) => {}}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </div>

        </div>

    </>
    )
}

CuentaEmisionEjecucionForm.propTypes = {
    data: object.isRequired,
    onDismiss: func.isRequired
  };

export default CuentaEmisionEjecucionForm;