import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'

import { APPCONFIG } from "../../app.config"
import { Loading, SectionHeading } from "../../components/common"
import { useForm } from "../../components/hooks/useForm"
import { APIS } from "../../config/apis"
import { ALERT_TYPE } from "../../consts/alertType"
import { OPERATION_MODE } from "../../consts/operationMode"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { dataTaggerActionClear, dataTaggerActionSet } from "../../context/redux/actions/dataTaggerAction"
import { ServerRequest } from "../../utils/apiweb"
import ShowToastMessage from "../../utils/toast"
import { CondicionesAplicacion, DescuentosAplicables, InfoAdicional, TasasPlan } from "./components"
import Definicion from "./components/Definicion"
import { formatDataForPut, initialFormValues, initialOtherValues } from "./utils"
import { getDateId } from "../../utils/convert"
import { useBeforeunload } from 'react-beforeunload';
import DataUsuario from '../../components/controls/DataUsuario';

const PagoContadoDefinicionView = () => {
    let navigate = useNavigate();
    const params = useParams()

    const dispatch = useDispatch()
    const dataTagger = useSelector(state => state.dataTagger.data)

    const [pendingChange, setPendingChange] = useState(false);

    const [formValues, handleInput, , setFormValues] = useForm(initialFormValues)
    const [otherValues, setOtherValues] = useState(initialOtherValues)
    const [idsUsuario, setIdsUsuario] = useState([])
    const [descUsuarioCreacion, setDescUsuarioCreacion] = useState('')
    const [processKey, setProcessKey] = useState(`PagoContadoDefinicion_${params.id??0}_${getDateId()}`)
    const [loading, setLoading] = useState(false)
    const [accordions, setAccordions] = useState({
        definicion: true,
        tasasPlan: false,
        condicionesAplicacion: false,
        infoAdicional: false,
    })

    useBeforeunload((event) => {
        if ((pendingChange) && (params.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

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
        
        if (formValues.idViaConsolidacion <= 0) return reject('Debe cargar el campo Vía de consolidación')
        if (formValues.idEstadoPagoContadoDefinicion <= 0) return reject('Debe cargar el campo Estado')
        if (formValues.fechaDesde === null) return reject('Debe cargar el campo Fecha vigencia desde')
        if (formValues.idTasaPagoContado <= 0) return reject('Debe cargar el campo Tasa del plan')
        if (formValues.idSubTasaPagoContado <= 0) return reject('Debe cargar el campo Sub tasa del plan')
        if (formValues.idTipoAlcanceTemporal <= 0) return reject('Debe cargar el campo Tipo alcance temporal')

        return true
    }

    const onDataReceived = (data) => {
        if (data.pagoContadoDefinicion.fechaDesde) data.pagoContadoDefinicion.fechaDesde = new Date(data.pagoContadoDefinicion.fechaDesde);
        if (data.pagoContadoDefinicion.fechaHasta) data.pagoContadoDefinicion.fechaHasta = new Date(data.pagoContadoDefinicion.fechaHasta);
        if (data.pagoContadoDefinicion.fechaDesdeAlcanceTemporal) data.pagoContadoDefinicion.fechaDesdeAlcanceTemporal = new Date(data.pagoContadoDefinicion.fechaDesdeAlcanceTemporal);
        if (data.pagoContadoDefinicion.fechaHastaAlcanceTemporal) data.pagoContadoDefinicion.fechaHastaAlcanceTemporal = new Date(data.pagoContadoDefinicion.fechaHastaAlcanceTemporal);
        if (data.pagoContadoDefinicion.fechaCreacion) data.pagoContadoDefinicion.fechaCreacion = new Date(data.pagoContadoDefinicion.fechaCreacion);
        data.archivos.forEach(x => {
            if (x.fecha) x.fecha = new Date(x.fecha);
        });
        data.observaciones.forEach(x => {
            if (x.fecha) x.fecha = new Date(x.fecha);
        });

        setFormValues(data.pagoContadoDefinicion)
        const listaIdsUsuario = [data.pagoContadoDefinicion.idUsuarioCreacion];
        setIdsUsuario(listaIdsUsuario);
        setOtherValues({...data, pagoContadoDefinicion: undefined})

        dispatch(dataTaggerActionSet(processKey, {
            Archivo: data.archivos,
            Observacion: data.observaciones,
            Etiqueta: data.etiquetas
        }))
    }

    const onBadDataReceived = (error) => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error)
        setLoading(false)
    }

    const onNoSuccess = (response) => {
        response.json()
            .then((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error.message);
                setLoading(false)
            })
            .catch(onBadDataReceived)
    }

    const onError = (error) => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando solicitud: ' + error.message);
        setLoading(false)
    }

    useEffect(() => {
        if (params.mode !== OPERATION_MODE.NEW) {
            const onSuccess = (res) => {
                res.json().then(onDataReceived).catch(onBadDataReceived)
                setLoading(false)
            }

            setLoading(true)
            ServerRequest(
                REQUEST_METHOD.GET,
                null,
                true,
                APIS.URLS.PAGO_CONTADO_DEFINICION,
                `/${params.id}`,
                null,
                onSuccess,
                onNoSuccess,
                onError,
            )
        }
        else {
            dispatch(dataTaggerActionSet(processKey, {
                Archivo: [],
                Observacion: [],
                Etiqueta: []
            }))
        }
    }, [])

    const handleInputProxy = (event) => {
        handleInput(event);
        setPendingChange(true);
    }   

    const add = () => {
        if (!isFormValidAdd())
            return

        const onSuccess = (res) => {
            res.json()
                .then(obj => {
                    setPendingChange(false);
                    ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Definición de Pago Contado ingresado correctamente", () => {
                        dispatch(dataTaggerActionClear(processKey))
                        setLoading(false)
                        const url = `/pago-contado-definicion/edit/${obj.pagoContadoDefinicion.id}`;
                        navigate(url, { replace: true });
                        navigate(0);
                    })
                })
                .catch(onBadDataReceived);
        }

        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.PAGO_CONTADO_DEFINICION,
            null,
            { pagoContadoDefinicion: formValues, ...otherValues },
            onSuccess,
            onNoSuccess,
            onError,
        )
    }

    const modify = () => {
        if (!isFormValidModify())
            return

        const onSuccess = (res) => {
            res.json().then(obj => {
                onDataReceived(obj)
                setPendingChange(false);
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Definición de Pago Contado ingresado correctamente")
            })
            .catch(onBadDataReceived)
            setLoading(false)
        }

        setLoading(true)

        const formattedOtherValues = {
            ...otherValues,
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta : []
        }

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.PAGO_CONTADO_DEFINICION,
            `/${params.id}`,
            formatDataForPut(formValues, formattedOtherValues),
            onSuccess,
            onNoSuccess,
            onError,
        )
    }

    const onClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(processKey));
        const url = '/pagos-contados-definicion';
        navigate(url, { replace: true });
    }

    const buildSectionProps = (field) => ({
        toggle: () => setAccordions(prev => ({ ...prev, [field]: !prev[field] })),
        open: accordions[field],
        formValues,
        handleInputProxy,
        otherValues,
        setOtherValues,
        params,
    })

    return (
        <div>
            <Loading visible={loading}></Loading>

            <SectionHeading title={<>Definición de Pago Contado</>} />

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
                        <Definicion {...buildSectionProps('definicion')} {...{setPendingChange, descUsuarioCreacion}} />
                        {params.mode !== OPERATION_MODE.NEW && <>
                            <TasasPlan {...buildSectionProps('tasasPlan')} />
                            <CondicionesAplicacion {...buildSectionProps('condicionesAplicacion')} {...{setPendingChange}}/>
                            <DescuentosAplicables {...buildSectionProps('descuentosAplicables')} />
                            <InfoAdicional {...buildSectionProps('infoAdicional')} idEntity={parseInt(params.id)} processKey={processKey} setPendingChange={setPendingChange}/>
                        </>}
                    </div>
                </section>
            </div>

            <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={onClickVolver}>Volver</button>
                {params.mode !== OPERATION_MODE.VIEW && (
                    <button
                        className={pendingChange ? "btn action-button float-end" : "btn action-button btn-disabled float-end"}
                        onClick={params.mode === OPERATION_MODE.NEW ? add : modify}
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

export default PagoContadoDefinicionView
