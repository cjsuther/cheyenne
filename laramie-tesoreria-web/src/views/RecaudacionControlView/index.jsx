import { useEffect, useRef, useState } from "react"
import { useEntidad, useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { SectionHeading, TableCustom, WrapperAdvancedSearch } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { getDateToString, getFormatNumber } from "../../utils/convert"
import RecaudacionControlModal from "../../components/controls/RecaudacionControlModal"
import RecaudacionesGridModal from "../../components/controls/RecaudacionesGridModal"
import { useReporte } from "../../components/hooks/useReporte"
import { OpenObjectURL } from "../../utils/helpers"

const initItem = {
    id: 0,
    importeTotal: 0
}

const RecaudacionControlView = () => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const searchRef = useRef()

    const [lotes, setLotes] = useState([])
    const [editItem, setEditItem] = useState(initItem)
    const [showConfirmacion, setShowConfirmacion] = useState(false)
    const [showDetalle, setShowDetalle] = useState(false)

    const [, getRowEntidad ] = useEntidad({
        entidades: ['Recaudadora'],
        onLoaded: (_, isSuccess, error) => {
          if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        memo: {
          key: 'Recaudadora',
          timeout: 0
        }
    })

    useEffect(() => SearchLotes(), [])

    const [ generateReporte, ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer) {
                OpenObjectURL(`${reporte}.pdf`, buffer);
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message)
            }
        },
        mode: 'blob'
    })

    const filterData = data => {
        const { idRecaudadora } = searchRef.current.filters

        let filtered = [...data]

        if (idRecaudadora !== 0) filtered = filtered.filter(item => item.idRecaudadora === idRecaudadora)

        return filtered
    }

    const SearchLotes = () => {
        setIsLoading(true)

        const paramsUrl = `/control`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            paramsUrl,
            null,
            res => res.json().then(data => {
                data.sort((a,b) => b.id - a.id)
                setLotes(filterData(data))
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

    const confirmRemoveId = (id) => {
        setIsLoading(true)

        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            `/${id}`,
            null,
            () => {
                setLotes(prev => prev.filter(x => x.id !== id))
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
                title: 'Confirmar Recaudación',
                onClick: (item) => {
                    setEditItem(item)
                    setShowConfirmacion(true)
                },
                requiresEdit: true
            }
        ],
        customActionsPosition: 'before',
        onView: (item) => {
            setEditItem(item)
            setShowDetalle(true)
        },
        onRemove: ({ id }) => {
            showMessageModal({
                title: "Confirmación",
                message: "¿Está seguro de borrar el lote?",
                onConfirm: () => confirmRemoveId(id),
            })
        }
    }

    const emitirInformeRecaudacionLote = (id) => {
        const paramsReporte = {
            idRecaudacionLote: id
        }
        generateReporte("InformeRecaudacionLote", paramsReporte);
    }

    const onModalCancel = () => {
        setShowConfirmacion(false)
        setShowDetalle(false)
        setEditItem(initItem)
    }
    const onModalConfirm = () => {
        setShowConfirmacion(false)
        emitirInformeRecaudacionLote(editItem.id)
        setEditItem(initItem)
        SearchLotes()
    }


    return <>
        <SectionHeading titles={[{ title: 'Recaudaciones' }, { title: 'Control de recaudaciones' }]} />

        <section className='section-accordion'>
            <WrapperAdvancedSearch
                ref={searchRef}
                filters={[
                    { title: 'Recaudadora', field: 'idRecaudadora', type: 'entity', entidad: 'Recaudadora', size: 4 },
                ]}
                onSearch={SearchLotes}
            />

            <TableCustom
                className={'TableCustomBase m-top-20'}
                data={lotes}
                avmr={avmr}
                columns={[
                    { Header: 'Recaudadora', accessor: 'idRecaudadora', width: '20%', Cell: ({ value }) =>  getRowEntidad('Recaudadora', value)?.nombre ?? '' },
                    { Header: 'N° lote', accessor: 'numeroLote', width: '15%', },
                    { Header: 'Fecha lote', accessor: 'fechaLote', Cell: (data) => getDateToString(data.value), width: '10%' },
                    { Header: 'Fecha proceso', accessor: 'fechaProceso', Cell: (data) => getDateToString(data.value, true), width: '12%' },
                    { Header: 'Casos', accessor: 'casos', Cell: (data) => getFormatNumber(data.value, 0), width: '7%', alignCell: 'right' },
                    { Header: 'Importe total', accessor: 'importeTotal', Cell: (data) => getFormatNumber(data.value, 2), width: '12%', alignCell: 'right' },
                    { Header: 'Importe neto', accessor: 'importeNeto', Cell: (data) => getFormatNumber(data.value, 2), width: '12%', alignCell: 'right' },
                    { Header: 'Archivo', accessor: 'nombreArchivoRecaudacion', width: '10%', }
                ]}
            />

            {showDetalle && (
                <RecaudacionesGridModal
                    idRecaudacionLote={editItem.id}
                    onCancel={onModalCancel}
                />
            )}
            
            {showConfirmacion && (
                <RecaudacionControlModal
                    lote={editItem}
                    onConfirm={onModalConfirm}
                    onCancel={onModalCancel}
                />
            )}

        </section>
    </>
}

export default RecaudacionControlView
