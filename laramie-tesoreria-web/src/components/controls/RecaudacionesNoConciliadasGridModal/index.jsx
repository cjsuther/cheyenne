import { MessageModal, Modal, TableCustom } from "../../common"
import { getDateToString, getFormatNumber, getNumeroRecibo_ObjectToIdentificador } from "../../../utils/convert"
import { ServerRequest } from "../../../utils/apiweb"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { APIS } from "../../../config/apis"
import { onRequestError, onRequestNoSuccess } from "../../../utils/requests"
import { useEffect, useState } from "react"
import { useManagedContext } from "../../hooks"
import { ALERT_TYPE } from "../../../consts/alertType"
import ShowToastMessage from "../../../utils/toast"

const initItem = {
    id: 0,
    importeTotal: 0
}

const RecaudacionesNoConciliadasGridModal = ({ idRecaudacionLote, onVolver }) => {
    
    const {setIsLoading} = useManagedContext()

    const [recaudaciones, setRecaudaciones] = useState([])
    const [showMessage, setShowMessage] = useState(false)
    const [editItem, setEditItem] = useState(initItem)
    const [hasChanges, setChanges] = useState(false)
    

    useEffect(() => {
        if (idRecaudacionLote > 0) {
            SearchRecuadaciones(idRecaudacionLote)
        }
    }, [])

    const filterData = data => {
        let filtered = [...data]

        filtered = filtered.filter(item => !item.fechaConciliacion)

        return filtered
    }

    const SearchRecuadaciones = (idRecaudacionLote) => {
        setIsLoading(true)

        const paramsUrl = `/detalle/${idRecaudacionLote}`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            paramsUrl,
            null,
            res => res.json().then(data => {
                data.forEach(x => {
                    if (x.fechaConciliacion) x.fechaConciliacion = new Date(x.fechaConciliacion)
                })
                setRecaudaciones(filterData(data))
                setIsLoading(false)
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }

    const confirmConciliacionId = (id) => {
        setIsLoading(true)

        const paramsUrl = `/conciliacion/manual/${id}`

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            paramsUrl,
            null,
            () => {
                setChanges(true)
                setRecaudaciones(prev => prev.filter(x => x.id !== id))
                setIsLoading(false)
            },
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }

    const avmr = {
        customActions: [
            {
                icon: 'check_circle',
                title: 'Confirmar Conciliación',
                onClick: (item) => {
                    if (!item.idReciboPublicacion) {
                        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'La recaudación no está asociada a una publicación')
                        return;
                    }
                    setEditItem(item)
                    setShowMessage(true)
                },
                requiresEdit: true
            }
        ],
        customActionsPosition: 'before',
    }

    return (
        <>

        <Modal
            allowFullscreen={true}
            size="xl"
            title="Recaudaciones no conciliadas"
            body={(
                <TableCustom
                    className={'TableCustomBase m-top-10'}
                    data={recaudaciones}
                    avmr={avmr}
                    columns={[
                        { Header: 'N° control', accessor: 'numeroControl', width: '10%' },
                        { Header: 'N° cliente', accessor: 'numeroCuenta', width: '15%' },
                        { Header: 'N° recibo', accessor: 'numeroRecibo', width: '15%', Cell: ({ row }) =>  getNumeroRecibo_ObjectToIdentificador(row.original) },
                        { Header: 'Fecha de cobro', accessor: 'fechaCobro', Cell: (data) => getDateToString(data.value), width: '15%' },
                        { Header: 'Importe ($)', accessor: 'importeCobro', Cell: (data) => getFormatNumber(data.value, 2), width: '15%', alignCell: 'right' },
                        { Header: 'Observacion', accessor: 'observacion', width: '30%' },
                    ]}
                    showDownloadCSV={false}
                />
            )}
            footer={(
                <div className="width-100p disp-b">
                    <button className="btn back-button m-left-5" data-dismiss="modal" onClick={() => onVolver(hasChanges)}>Volver</button>
                </div>
            )}
        />

        {showMessage && 
            <MessageModal
                title={"Confirmación"}
                message={"¿Está seguro/a de aplicar la conciliación?"}
                onDismiss={() => {
                    setEditItem(initItem)
                    setShowMessage(false)
                }}
                onConfirm={() => {
                    confirmConciliacionId(editItem.id)
                    setEditItem(initItem)
                    setShowMessage(false)
                }}
            />
        }

        </>
    )
}

export default RecaudacionesNoConciliadasGridModal
