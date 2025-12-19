import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Accordion, Loading, SectionHeading, TableCustom } from "../../components/common"
import { useForm } from "../../components/hooks/useForm"
import { OPERATION_MODE } from "../../consts/operationMode"
import { useState } from "react"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { useEffect } from "react"
import Conceptos from "./components/Conceptos"
import { useBeforeunload } from 'react-beforeunload';

const ReciboEspecialView = () => {
    const params = useParams()
    const navigate = useNavigate()

    const [formValues, _handleFormInput, , setFormValues] = useForm({ codigo: '', descripcion: '', aplicaValorUF: false, })
    const [conceptos, setConceptos] = useState([])
    const [pendingChange, setPendingChange] = useState(false)
    const [loading, setLoading] = useState(false)

    const filteredConceptos = useMemo(() => conceptos.filter(x => x.state !== 'r'), [conceptos])

    useBeforeunload((event) => {
        if ((pendingChange) && (params.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault()
        }
    })

    const handleFormInput = (...args) => {
        setPendingChange(true)
        _handleFormInput(...args)
    }

    const onChangeAplicaValorUF = ({ target }) => {
        setFormValues(x => ({...x, aplicaValorUF: target.value === "true"}))
        setPendingChange(true)
    }

    const onNoSuccess = (response) => {
        response.json() 
        .then((error) => { ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error.message) })
        .catch((error) => { ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error) })
        .finally(() => setLoading(false))
    }

    const onError = (error) => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando solicitud: ' + error.message);
        setLoading(false)
    }

    useEffect(() => {
        if (params.mode !== OPERATION_MODE.NEW) {
            setLoading(true)
            ServerRequest(
                REQUEST_METHOD.GET,
                null,
                true,
                APIS.URLS.RECIBO_ESPECIAL,
                `/${params.id}`,
                null,
                res => {
                    res.json()
                        .then(data => {
                            setFormValues(data.reciboEspecial)
                            setConceptos(data.recibosEspecialConcepto)
                        })
                        .catch(onNoSuccess)
                        .finally(() => setLoading(false))
                },
                onNoSuccess,
                onError,
            )
        }
    }, [])

    const addRecibo = () => {
        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.RECIBO_ESPECIAL,
            null,
            {
                reciboEspecial: {...formValues, id: -new Date()},
                recibosEspecialConcepto: [],
            },
            res => {
                res.json()
                    .then(data => {
                        ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Recibo generado exitosamente')
                        const url = `/recibo-especial/${OPERATION_MODE.EDIT}/${data.reciboEspecial.id}`
                        navigate(url, { replace: true })
                        navigate(0)
                    })
                    .catch(onNoSuccess)
                    .finally(() => setLoading(false))
            },
            onNoSuccess,
            onError,
        )
    }

    const modifyRecibo = () => {
        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.RECIBO_ESPECIAL,
            `/${params.id}`,
            {
                reciboEspecial: formValues,
                recibosEspecialConcepto: conceptos,
            },
            res => {
                setLoading(false)
                setPendingChange(false)
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Recibo modificado exitosamente')
            },
            onNoSuccess,
            onError,
        )
    }

    const onClickVolver = () => {
        navigate(`/recibos-especiales`, { replace: true })
    }

    const onAddConcepto = (item) => {
        setConceptos(prev => [...prev, item])
        setPendingChange(true)
    }

    const onModifyConcepto = (item) => {
        setConceptos(prev => prev.map(x => x.id === item.id ? item : x))
        setPendingChange(true)
    }

    const onRemoveConcepto = (item) => {
        const newConceptos = []
        conceptos.forEach(concepto => {
            if (concepto.id === item.id) {
                if (concepto.state !== 'a')
                    newConceptos.push({...concepto, state: 'r'})
            }
            else newConceptos.push(concepto)
        })
        setConceptos(newConceptos)
        setPendingChange(true)
    }

    return (
        <div>
            <Loading visible={loading} />

            <SectionHeading title={<>Definición de Recibo Especial</>} />
            
            <section className="section-accordion">
                <Accordion title="Definición" startOpen>
                    <div className='row form-basic'>
                        <div className="col-12 col-md-4">
                            <label htmlFor="codigo" className="form-label">Código</label>
                            <input
                                name="codigo"
                                type="text"
                                placeholder=""
                                className="form-control"
                                value={formValues.codigo}
                                onChange={handleFormInput}
                                disabled={params.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <input
                                name="descripcion"
                                type="text"
                                placeholder=""
                                className="form-control"
                                value={formValues.descripcion}
                                onChange={handleFormInput}
                                disabled={params.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <label htmlFor="aplicaValorUF" className="form-label">Aplica Valor UF</label>
                            <select
                                name="aplicaValorUF"
                                placeholder=""
                                className="form-control"
                                value={formValues.aplicaValorUF ? "true" : "false"}
                                onChange={onChangeAplicaValorUF}
                                disabled={params.mode === OPERATION_MODE.VIEW}
                            >
                                <option value={"false"}>No</option>
                                <option value={"true"}>Sí</option>
                            </select>
                        </div>
                    </div>
                </Accordion>

                {params.mode !== OPERATION_MODE.NEW &&
                <div className="m-top-20 m-bottom-20">
                <Conceptos {...{ params, onAddConcepto, onModifyConcepto, onRemoveConcepto, conceptos: filteredConceptos }} />
                </div>
                }

            </section>

            <footer className='footer footer-action'>
                <div className='footer-action-container'>
                    <button className="btn back-button float-start" onClick={onClickVolver}>Volver</button>
                    {params.mode !== OPERATION_MODE.VIEW && (
                        <button
                            className={pendingChange ? "btn action-button float-end" : "btn action-button btn-disabled float-end"}
                            onClick={params.mode === OPERATION_MODE.NEW ? addRecibo : modifyRecibo}
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

export default ReciboEspecialView
