import { useState } from "react"
import { Loading, MessageModal, SectionHeading, TableCustom } from "../../components/common"
import { useEffect } from "react"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { OPERATION_MODE } from "../../consts/operationMode"
import { useNavigate } from "react-router-dom"

const RecibosEspecialesView = () => {
    const [recibos, setRecibos] = useState([])
    const [loading, setLoading] = useState(false)
    const [removingId, setRemovingId] = useState(null)

    const navigate = useNavigate()
    
    const onNoSuccess = res => res.json()
        .then(err => ShowToastMessage(ALERT_TYPE.ALERT_ERROR, err.message))
        .catch(err => ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + err)
        .finally(() => setLoading(false))
    )

    const onError = err => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando solicitud: ' + err.message)
        setLoading(false)
    }

    useEffect(() => {
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.RECIBO_ESPECIAL,
            null,
            null,
            res => {
                res.json()
                .then(data => setRecibos(data))
                .catch(err => ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + err))
                .finally(() => setLoading(false))
            },
            onNoSuccess,
            onError,
        )
    }, [])

    const avmr = {
        onAdd: () => {
            navigate('/recibo-especial/' + OPERATION_MODE.NEW, { replace: true });
        },
        onView: ({ id }) => {
            navigate(`/recibo-especial/${OPERATION_MODE.VIEW}/${id}`, { replace: true })
        },
        onModify: ({ id }) => {
            navigate(`/recibo-especial/${OPERATION_MODE.EDIT}/${id}`, { replace: true })
        },
        onRemove: ({ id }) => {
            setRemovingId(id)
        }
    }

    const confirmRemoveId = (id) => {
        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.RECIBO_ESPECIAL,
            `/${id}`,
            null,
            res => {
                setRecibos(prev => prev.filter(x => x.id !== id))
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Recibo borrado')
                setLoading(false)
                setRemovingId(null)
            },
            onNoSuccess,
            onError,
        )
    }

    return (
        <div>
            <Loading visible={loading} />

            <SectionHeading title={<>Definición de Recibos Especiales</>} />

            <section className='section-accordion'>
                 <TableCustom
                    className={'TableCustomBase'}
                    data={recibos}
                    avmr={avmr}
                    columns={[
                        { Header: 'Código', accessor: 'codigo', width: '45%', },
                        { Header: 'Descripción', accessor: 'descripcion', width: '45%', },
                        {
                            Header: 'Aplica UF',
                            accessor: 'aplicaValorUF',
                            Cell: ({ value }) => value ? 'Sí' : 'No',
                            width: '10%',
                        },
                    ]}
                />
            </section>

            {removingId && 
                <MessageModal
                    title={"Confirmación"}
                    message={"¿Está seguro de borrar el registro?"}
                    onDismiss={() => setRemovingId(null)}
                    onConfirm={() => confirmRemoveId(removingId)}
                />
            }
        </div>
    )
}

export default RecibosEspecialesView
