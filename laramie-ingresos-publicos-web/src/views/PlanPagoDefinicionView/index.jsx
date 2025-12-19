import React, { useEffect, useState} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { dataTaggerActionSet, dataTaggerActionClear } from '../../context/redux/actions/dataTaggerAction';

import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { ALERT_TYPE } from '../../consts/alertType';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { OPERATION_MODE } from '../../consts/operationMode';
import { CondicionesAplicacion, CriteriosCaducidad, CriteriosFinanciacion, Definicion, InfoAdicional, TasasPlan, Vencimientos } from './components';
import { Loading, SectionHeading } from '../../components/common';
import { useForm } from '../../components/hooks/useForm';
import { initialFormValues, initialOtherValues, formatDataForPost } from './utils';
import { ServerRequest } from '../../utils/apiweb';
import ShowToastMessage from '../../utils/toast';
import { CloneObject } from '../../utils/helpers';
import { getDateId } from '../../utils/convert';
import { useBeforeunload } from 'react-beforeunload';
import DataUsuario from '../../components/controls/DataUsuario';

function PlanPagoDefinicionView() {
    const params = useParams()
    let navigate = useNavigate();
    
    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );

    const [formValues, handleInput, , setFormValues] = useForm(initialFormValues)
    const [otherValues, setOtherValues] = useState(initialOtherValues)

    const [pendingChange, setPendingChange] = useState(false);
    const [idsUsuario, setIdsUsuario] = useState([])
    const [descUsuarioCreacion, setDescUsuarioCreacion] = useState('')

    const [state, setState] = useState({
        processKey: `PlanPagoDefinicion_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        accordions: {
            definicion: true,
            tasasPlan: false,
            vencimientos: false,
            condAplicacion: false,
            criteriosFinanciacion: false,
            criteriosCaducidad: false,
            info: false
        },
        tabActive: "definicion"
    });

    const [loading, setLoading] = useState(false)

    useBeforeunload((event) => {
        if ((pendingChange) && (params.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    useEffect(() => {
        if (params.id) {
            setFormValues({...formValues, id: params.id})
            setLoading(true)

            const onSuccess = (response) => {
                response.json()
                .then(data => {
                    if (data.planPagoDefinicion.fechaDesde) data.planPagoDefinicion.fechaDesde = new Date(data.planPagoDefinicion.fechaDesde);
                    if (data.planPagoDefinicion.fechaHasta) data.planPagoDefinicion.fechaHasta = new Date(data.planPagoDefinicion.fechaHasta);
                    if (data.planPagoDefinicion.fechaDesdeAlcanceTemporal) data.planPagoDefinicion.fechaDesdeAlcanceTemporal = new Date(data.planPagoDefinicion.fechaDesdeAlcanceTemporal);
                    if (data.planPagoDefinicion.fechaHastaAlcanceTemporal) data.planPagoDefinicion.fechaHastaAlcanceTemporal = new Date(data.planPagoDefinicion.fechaHastaAlcanceTemporal);
                    if (data.planPagoDefinicion.fechaCreacion) data.planPagoDefinicion.fechaCreacion = new Date(data.planPagoDefinicion.fechaCreacion);
                    data.archivos.forEach(x => {
                        if (x.fecha) x.fecha = new Date(x.fecha);
                    });
                    data.observaciones.forEach(x => {
                        if (x.fecha) x.fecha = new Date(x.fecha);
                    });

                    setFormValues(data.planPagoDefinicion)
                    const listaIdsUsuario = [data.planPagoDefinicion.idUsuarioCreacion];
                    setIdsUsuario(listaIdsUsuario);

                    setOtherValues({...data, planPagoDefinicion: undefined})
                    dispatch(dataTaggerActionSet(state.processKey, {
                        Archivo: data.archivos,
                        Observacion: data.observaciones,
                        Etiqueta: data.etiquetas
                    }))
                    setLoading(false)
                })
            }

            ServerRequest(
                REQUEST_METHOD.GET,
                null,
                true,
                APIS.URLS.PLAN_PAGO_DEFINICION,
                `/${params.id}`,
                null,
                onSuccess,
                onNoSuccess,
                onError,
            );
        }
        else {
            dispatch(dataTaggerActionSet(state.processKey, {
                Archivo: [],
                Observacion: [],
                Etiqueta: []
            }))
        }
    }, [params.id, params.mode])

    const onNoSuccess = (response) => {
        response.json()
            .then((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error.message);
                setLoading(false)
            })
            .catch((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error);
                setLoading(false)
            })
    }

    const onError = (error) => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando solicitud: ' + error.message);
        setLoading(false)
    }

    const isFormValidAdd = () => {
        const reject = (message) => {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, message)
            return false
        }

        if (formValues.codigo.length < 1) return reject('Debe cargar el campo Código')
        if (formValues.descripcion.length < 1) return reject('Debe cargar el campo Descripción')
        if (formValues.idTipoPlanPago === 0) return reject('Debe cargar el campo Tipo de Plan')
        if (formValues.idTipoTributo === 0) return reject('Debe cargar el campo Tipo de Tributo')

        return true
    }

    const isFormValidModify = () => {
        const reject = (message) => {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, message)
            return false
        }

        if (!isFormValidAdd())
            return false

        if (formValues.idEstadoPlanPagoDefinicion <= 0) return reject('Debe cargar el campo Estado')
        if (formValues.fechaDesde === null) return reject('Debe cargar el campo Fecha vigencia desde')
        if (formValues.idTasaPlanPago <= 0) return reject('Debe cargar el campo Tasa del plan')
        if (formValues.idSubTasaPlanPago <= 0) return reject('Debe cargar el campo Sub tasa del plan')
        if (formValues.idTipoVencimientoAnticipo <= 0) return reject('Debe cargar el campo Vencimiento anticipo')
        if (formValues.idTipoVencimientoCuota1 <= 0) return reject('Debe cargar el campo Vencimiento primera cuota')
        if (formValues.idTipoVencimientoCuotas <= 0) return reject('Debe cargar el campo Vencimiento cuotas restantes')
        if (formValues.idTipoAlcanceTemporal <= 0) return reject('Debe cargar el campo Tipo alcance temporal')
        if (formValues.peridiocidad <= 0) return reject('Debe cargar el campo Periodicidad')
        if (formValues.idTipoCalculoInteres === 0) return reject('Debe cargar el campo Tipo de cálculo')
        if (formValues.cuotaDesde <= 0) return reject('Debe cargar el campo Cuota desde')
        if (formValues.cuotaHasta <= 0) return reject('Debe cargar el campo Cuota hasta')
        
        return true
    }

    const handleInputProxy = (event) => {
        handleInput(event);
        setPendingChange(true);
    }   

    const addPlan = () => {
        if (!isFormValidAdd())
            return

        setLoading(true)
        
        const onSuccess = (response) => {
            response.json()
                .then((data) => {
                    setPendingChange(false);
                    ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Definición de Plan de Pago ingresado correctamente", () => {
                        dispatch(dataTaggerActionClear(state.processKey))
                        setLoading(false)
                        const url = `/plan-pago-definicion/${OPERATION_MODE.EDIT}/${data.planPagoDefinicion.id}`;
                        navigate(url, { replace: true });
                        navigate(0);
                    });
                })
                .catch((error) => {
                    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error)
                    setLoading(false)
                });
        }
    
        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.PLAN_PAGO_DEFINICION,
            null,
            formatDataForPost(formValues, otherValues),
            onSuccess,
            onNoSuccess,
            onError,
        );
    }

    const modifyPlan = () => {
        if (!isFormValidModify())
            return

        setLoading(true)
        
        const onSuccess = (response) => {
            response.json()
                .then((data) => {
                    setPendingChange(false);
                    ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Definición de Plan de Pago actualizado correctamente", () => {
                        if (data.planPagoDefinicion.fechaDesde) data.planPagoDefinicion.fechaDesde = new Date(data.planPagoDefinicion.fechaDesde);
                        if (data.planPagoDefinicion.fechaHasta) data.planPagoDefinicion.fechaHasta = new Date(data.planPagoDefinicion.fechaHasta);
                        if (data.planPagoDefinicion.fechaDesdeAlcanceTemporal) data.planPagoDefinicion.fechaDesdeAlcanceTemporal = new Date(data.planPagoDefinicion.fechaDesdeAlcanceTemporal);
                        if (data.planPagoDefinicion.fechaHastaAlcanceTemporal) data.planPagoDefinicion.fechaHastaAlcanceTemporal = new Date(data.planPagoDefinicion.fechaHastaAlcanceTemporal);
                        if (data.planPagoDefinicion.fechaCreacion) data.planPagoDefinicion.fechaCreacion = new Date(data.planPagoDefinicion.fechaCreacion);
                        data.archivos.forEach(x => {
                            if (x.fecha) x.fecha = new Date(x.fecha);
                        });
                        data.observaciones.forEach(x => {
                            if (x.fecha) x.fecha = new Date(x.fecha);
                        });
                        
                        setFormValues(data.planPagoDefinicion)
                        setOtherValues({...data, planPagoDefinicion: undefined})
                        dispatch(dataTaggerActionSet(state.processKey, {
                            Archivo: data.archivos,
                            Observacion: data.observaciones,
                            Etiqueta: data.etiquetas
                        }))
                        setLoading(false)
                    })
                })
                .catch((error) => {
                    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error)
                    setLoading(false)
                });
        }

        const partialOtherValues = CloneObject(otherValues);
        const allOtherValues = {...partialOtherValues,
            archivos: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Archivo : [],
            observaciones: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Observacion : [],
            etiquetas: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Etiqueta : []
        }

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.PLAN_PAGO_DEFINICION,
            `/${params.id}`,
            formatDataForPost(formValues, allOtherValues),
            onSuccess,
            onNoSuccess,
            onError,
        );
    }

    const buildSectionProps = field => ({
        toggle: () => setState(prev => ({...prev, accordions: {...prev.accordions, [field]: !prev.accordions[field]}})),
        open: state.accordions[field],
        formValues,
        handleInputProxy,
        params,
    })

    const returnPlan = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        const url = '/planes-pago-definicion';
        navigate(url, { replace: true });
    }

    return <>

        <Loading visible={loading}></Loading>

        <SectionHeading title={<>Definición de Plan de Pago</>} />


        <DataUsuario
            data={idsUsuario}
            onChange={(data) => {
                if (data.length > 0){
                    let nombreApellido = data[0].nombreApellido;
                    setDescUsuarioCreacion(nombreApellido);
                }
                else{
                    setDescUsuarioCreacion('');
                }
            }}
        /> 

        <div className="m-top-20">

            <section className='section-accordion'>

                <div className="m-top-20 m-bottom-20">  
                    <Definicion {...buildSectionProps('definicion')} {...{otherValues, setOtherValues, setPendingChange, descUsuarioCreacion}}  />
                    {(params.mode !== OPERATION_MODE.NEW) && <>
                        <TasasPlan {...buildSectionProps('tasasPlan')} />
                        <Vencimientos {...buildSectionProps('vencimientos')} />
                        <CondicionesAplicacion {...buildSectionProps('condAplicacion')} {...{otherValues, setOtherValues, setPendingChange}} />
                        <CriteriosFinanciacion {...buildSectionProps('criteriosFinanciacion')} {...{otherValues, setOtherValues, setPendingChange}} />
                        <CriteriosCaducidad {...buildSectionProps('criteriosCaducidad')} />
                        <InfoAdicional {...buildSectionProps('infoAdicional')}
                            title="Información adicional de Definición de Planes de Pago"
                            entity="PlanPagoDefinicion"
                            idEntity={state.id}
                            mode={state.mode}
                            processKey={state.processKey}
                            setPendingChange={setPendingChange}
                        />
                    </>}
                </div>

            </section>

        </div>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => returnPlan() }>Volver</button>
                {params.mode !== OPERATION_MODE.VIEW && (
                    <button
                        className={pendingChange ? "btn action-button float-end" : "btn action-button btn-disabled float-end"}
                        onClick={params.mode === OPERATION_MODE.NEW ? addPlan : modifyPlan}
                        disabled={!pendingChange}
                    >
                        {params.mode === OPERATION_MODE.NEW ? 'Siguiente' : 'Guardar'}
                    </button>
                )}
            </div>
        </footer>

    </>
}

export default PlanPagoDefinicionView;
