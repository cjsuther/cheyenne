import { useEffect, useState } from "react"
import { Loading, SectionHeading } from "../../components/common"
import { useForm } from "../../components/hooks/useForm"
import { useParams, useNavigate } from "react-router-dom"
import { OPERATION_MODE } from "../../consts/operationMode"
import Definicion from "./components/Definicion"
import Parametros from "./components/Parametros"
import Variables from "./components/Variables"
import { ALERT_TYPE } from "../../consts/alertType"
import ShowToastMessage from "../../utils/toast"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { initialFormValues, initialOtherValues } from './utils'

import InfoAdicional from "./components/InfoAdicional"
import { dataTaggerActionClear, dataTaggerActionSet } from "../../context/redux/actions/dataTaggerAction"
import { getDateId } from "../../utils/convert"
import { useDispatch, useSelector } from "react-redux"
import { useBeforeunload } from 'react-beforeunload';
import DataUsuario from '../../components/controls/DataUsuario';
import Filtros from "./components/Filtros"

const ProcedimientoView = () => {
    const params = useParams()
    let navigate = useNavigate();
    const dispatch = useDispatch()
    const dataTagger = useSelector(state => state.dataTagger.data)
    const [pendingChange, setPendingChange] = useState(false);

    const [loading, setLoading] = useState(false)
    const [accordions, setAccordions] = useState({
        definicion: true,
        filtros: false,
        parametros: false,
        variables: false,
        infoAdicional: false,
    })
    const [formValues, handleInput, , setFormValues] = useForm(initialFormValues)
    const [otherValues, setOtherValues] = useState(initialOtherValues)
    const [idsUsuario, setIdsUsuario] = useState([])
    const [descUsuarioCreacion, setDescUsuarioCreacion] = useState('')
    const [colecciones, setColecciones] = useState([])
    const [coleccionesCampo, setColeccionesCampo] = useState([])
    const [processKey] = useState(`Procedimiento${params.id??0}_${getDateId()}`)

    useBeforeunload((event) => {
        if ((pendingChange) && (params.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    const setStateFromData = data => {
        if (data.procedimiento.fechaCreacion) data.procedimiento.fechaCreacion = new Date(data.procedimiento.fechaCreacion);
        setFormValues(data.procedimiento)
        setOtherValues({
            ...data,
            procedimiento: undefined,
        })
        const listaIdsUsuario = [data.procedimiento.idUsuarioCreacion];
        setIdsUsuario(listaIdsUsuario);
        dispatch(dataTaggerActionSet(processKey, {
            Archivo: data.archivos,
            Observacion: data.observaciones,
            Etiqueta: data.etiquetas
        }))
    }

    const onNoSuccess = (response) => {
        response.json()
            .then((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error.message);
                setLoading(false)
            })
            .catch((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error);
                setLoading(false)
            });
    }

    const onError = (error) => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando solicitud: ' + error.message)
        setLoading(false)
    }

    useEffect(() => {
        if (params.mode === OPERATION_MODE.NEW)
            return

        setLoading(true)

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PROCEDIMIENTO,
            `/full/${params.id}`,
            null,
            res => res.json().then(data => {
                setStateFromData(data)
                setLoading(false)
            }),
            onNoSuccess,
            onError,
        )
    }, [])

    useEffect(() => {
        if (formValues.idTipoTributo < 1 || params.mode === OPERATION_MODE.NEW)
            return

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.COLECCION,
            `/tipo-tributo/${formValues.idTipoTributo}`,
            null,
            res => res.json().then(data => {
                setColecciones(data)
                setColeccionesCampo(data.reduce((prev, curr) => [...prev, ...curr.coleccionesCampo], []))
            }),
            onNoSuccess,
            onError,
        )
    }, [formValues.idTipoTributo])

    const handleInputProxy = (event) => {
        handleInput(event);
        setPendingChange(true);
    }   

    const onClickBack = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear());
        const url = `/procedimientos`;
        navigate(url, { replace: true });                

    }

    const saveChanges = () => {
        const reject = (message) => {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, message)
            return
        }

        if (formValues.nombre.length < 1) return reject('Debe cargar el campo Nombre')
        if (formValues.descripcion.length < 1) return reject('Debe cargar el campo Descripción')
        if (formValues.idTipoTributo <= 0) return reject('Debe cargar el campo Tipo de Tributo')
        if (formValues.idEstadoProcedimiento <= 0) return reject('Debe cargar el campo Estado')

        setLoading(true)

        const stateFilter = x => x.state !== 'o' && x.state !== undefined
        const dataBody = {
            procedimiento: formValues,
            procedimientoFiltros: otherValues.procedimientoFiltros.filter(stateFilter),
            procedimientoParametros: otherValues.procedimientoParametros.filter(stateFilter),
            procedimientoVariables: otherValues.procedimientoVariables.filter(stateFilter),
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(stateFilter) : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(stateFilter) : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(stateFilter) : []
        }

        if (params.mode === OPERATION_MODE.NEW) {
            ServerRequest(
                REQUEST_METHOD.POST,
                null,
                true,
                APIS.URLS.PROCEDIMIENTO,
                null,
                dataBody,
                res => res.json()
                    .then(data => {
                        setPendingChange(false);
                        ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Procedimiento grabado correctamente', () => {
                            dispatch(dataTaggerActionClear(processKey))
                            setLoading(false)
                            const url = `/procedimiento/${OPERATION_MODE.EDIT}/${data.procedimiento.id}`;
                            navigate(url, { replace: true });     
                            navigate(0);
                        });
                    })
                    .catch((error) => {
                        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error)
                        setLoading(false)
                    }),
                onNoSuccess,
                onError,
            )
        }

        if (params.mode === OPERATION_MODE.EDIT) {
            ServerRequest(
                REQUEST_METHOD.PUT,
                null,
                true,
                APIS.URLS.PROCEDIMIENTO,
                `/${formValues.id}`,
                dataBody,
                res => res.json().then(data => {
                    setPendingChange(false);
                    setStateFromData(data)
                    setLoading(false)
                    ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Procedimiento grabado correctamente')
                }),
                onNoSuccess,
                onError,
            )
        }
    }

    return (
        <div>
            <Loading visible={loading}></Loading>
            <SectionHeading title={<>Procedimiento</>} />

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
                        <Definicion
                            {...{formValues, handleInputProxy, otherValues, params, descUsuarioCreacion}}
                            open={accordions.definicion}
                            toggle={() => setAccordions(prev => ({...prev, definicion: !accordions.definicion }))}
                        />

                        {params.mode !== OPERATION_MODE.NEW && <>
                            <Filtros
                                idTipoTributo={formValues.idTipoTributo}
                                params={params}
                                data={otherValues.procedimientoFiltros}
                                setData={data => setOtherValues(prev => ({...prev, procedimientoFiltros: data}))}
                                open={accordions.filtros}
                                toggle={() => setAccordions({ ...accordions, filtros: !accordions.filtros })}
                                setPendingChange={setPendingChange}
                            />
                            <Parametros
                                params={params}
                                data={otherValues.procedimientoParametros}
                                setData={data => setOtherValues(prev => ({...prev, procedimientoParametros: data}))}
                                open={accordions.parametros}
                                toggle={() => setAccordions({ ...accordions, parametros: !accordions.parametros })}
                                setPendingChange={setPendingChange}
                            />

                            <Variables
                                {...{params, colecciones, coleccionesCampo}}
                                data={otherValues.procedimientoVariables}
                                setData={data => setOtherValues(prev => ({...prev, procedimientoVariables: data}))}
                                open={accordions.variables}
                                toggle={() => setAccordions({ ...accordions, variables: !accordions.variables })}
                                setPendingChange={setPendingChange}
                            />
    
                            <InfoAdicional
                                title="Información adicional de Procedimiento"
                                entity="Procedimiento"
                                idEntity={parseInt(params.id)}
                                mode={params.mode}
                                processKey={processKey}
                                open={accordions.infoAdicional}
                                toggle={() => setAccordions({ ...accordions, infoAdicional: !accordions.infoAdicional })}
                                setPendingChange={setPendingChange}
                            />
                        </>}
                    </div>
                </section>
            </div>

            <footer className='footer footer-action'>
                <div className='footer-action-container'>
                    <button className="btn back-button float-start" onClick={onClickBack}>Volver</button>
                    {params.mode !== OPERATION_MODE.VIEW && (
                        <button
                            className={pendingChange ? "btn action-button float-end" : "btn action-button btn-disabled float-end"}
                            onClick={saveChanges}
                            disabled={!pendingChange}
                        >
                            {params.mode === OPERATION_MODE.NEW ? 'Siguiente' : 'Guardar'}
                        </button>
                    )}
                </div>
            </footer>
        </div>
    )
}

export default ProcedimientoView
