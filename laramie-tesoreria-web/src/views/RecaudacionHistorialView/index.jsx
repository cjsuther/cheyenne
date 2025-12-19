import { useEffect, useRef, useState } from "react"
import { useEntidad, useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { SectionHeading, TableCustom, WrapperAdvancedSearch } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { getDateToString, getFormatNumber, truncateTime } from "../../utils/convert"
import RecaudacionesGridModal from "../../components/controls/RecaudacionesGridModal"
import { useReporte } from "../../components/hooks/useReporte"
import { OpenObjectURL } from "../../utils/helpers"
import { isValidDate } from "../../utils/validator"

const initItem = {
    id: 0,
    importeTotal: 0
}

const RecaudacionHistorialView = () => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const searchRef = useRef()

    const [lotes, setLotes] = useState([])
    const [editItem, setEditItem] = useState(initItem)
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
        const { idRecaudadora, numeroLote, fechaLote, fechaProcesoDesde, fechaProcesoHasta, loteSinControlar } = searchRef.current.filters

        let filtered = [...data]

        if (idRecaudadora !== 0) filtered = filtered.filter(item => item.idRecaudadora === idRecaudadora)
        if (numeroLote !== '') filtered = filtered.filter(item => item.numeroLote.indexOf(numeroLote) >= 0)
        if (fechaLote) filtered = filtered.filter(item => truncateTime(item.fechaLote).getTime() === truncateTime(fechaLote).getTime())
        if (fechaProcesoDesde) filtered = filtered.filter(item => truncateTime(item.fechaProceso).getTime() >= truncateTime(fechaProcesoDesde).getTime())
        if (fechaProcesoHasta) filtered = filtered.filter(item => truncateTime(item.fechaProceso).getTime() <= truncateTime(fechaProcesoHasta).getTime())
        if (loteSinControlar) filtered = filtered.filter(item => !item.fechaControl)

        return filtered
    }

    const SearchLotes = () => {
        setIsLoading(true)

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            null,
            null,
            res => res.json().then(data => {
                data.forEach(row => {
                    if (row.fechaLote) row.fechaLote = new Date(row.fechaLote);
                    if (row.fechaProceso) row.fechaProceso = new Date(row.fechaProceso);
                    if (row.fechaControl) row.fechaControl = new Date(row.fechaControl);
                    if (row.fechaConciliacion) row.fechaConciliacion = new Date(row.fechaConciliacion);
                    if (row.fechaAcreditacion) row.fechaAcreditacion = new Date(row.fechaAcreditacion);
                })
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

    const emitirInformeRecaudacionLote = (id) => {
        const paramsReporte = {
            idRecaudacionLote: id
        }
        generateReporte("InformeRecaudacionLote", paramsReporte);
    }

    const avmr = {
        onView: (item) => {
            setEditItem(item)
            setShowDetalle(true)
        },
        onDownload: (item) => {  
            if (!isValidDate(item.fechaControl, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El lote debe estar controlado antes de emitir el informe')
            emitirInformeRecaudacionLote(item.id)
        },
        onRemove: ({ id }) => {
            showMessageModal({
                title: "Confirmación",
                message: "¿Está seguro de borrar el lote?",
                onConfirm: () => confirmRemoveId(id),
            })
        }
    }


    const onModalCancel = () => {
        setShowDetalle(false)
        setEditItem(initItem)
    }


    return <>
        <SectionHeading titles={[{ title: 'Recaudaciones' }, { title: 'Historial de recaudaciones' }]} />

        <section className='section-accordion'>
            <WrapperAdvancedSearch
                ref={searchRef}
                filters={[
                    { title: 'Recaudadora', field: 'idRecaudadora', type: 'entity', entidad: 'Recaudadora', size: 4 },
                    { title: 'Numero Lote', field: 'numeroLote', type: 'string', size: 4, searchOnEnter: true, },
                    { title: 'Fecha Lote', field: 'fechaLote', type: 'date', size: 4 },
                    { title: 'Fecha Proceso Desde', field: 'fechaProcesoDesde', type: 'date', size: 4 },
                    { title: 'Fecha Proceso Hasta', field: 'fechaProcesoHasta', type: 'date', size: 4, minValueField: 'fechaProcesoDesde' },
                    { title: 'Lote sin controlar', field: 'loteSinControlar', type: 'boolean', size: 4 }
                ]}
                onSearch={SearchLotes}
            />

            <TableCustom
                className={'TableCustomBase m-top-20'}
                data={lotes}
                avmr={avmr}
                columns={[
                    { Header: 'Recaudadora', accessor: 'idRecaudadora', width: '13%', Cell: ({ value }) =>  getRowEntidad('Recaudadora', value)?.nombre ?? '' },
                    { Header: 'N° lote', accessor: 'numeroLote', width: '9%', },
                    { Header: 'Fecha lote', accessor: 'fechaLote', Cell: (data) => getDateToString(data.value), width: '10%'},
                    { Header: 'Fecha proceso', accessor: 'fechaProceso', Cell: (data) => getDateToString(data.value, true), width: '11%'},
                    { Header: 'Fecha control', accessor: 'fechaControl', Cell: (data) => getDateToString(data.value, true), width: '11%' },
                    { Header: 'Fecha conciliación', accessor: 'fechaConciliacion', Cell: (data) => getDateToString(data.value, true), width: '11%' },
                    { Header: 'Casos', accessor: 'casos', Cell: (data) => getFormatNumber(data.value, 0), width: '6%', alignCell: 'right' },
                    { Header: 'Importe total', accessor: 'importeTotal', Cell: (data) => getFormatNumber(data.value, 2), width: '11%', alignCell: 'right' },
                    { Header: 'Importe neto', accessor: 'importeNeto', Cell: (data) => getFormatNumber(data.value, 2), width: '11%', alignCell: 'right' },
                    { Header: 'Archivo', accessor: 'nombreArchivoRecaudacion', width: '8%', }
                ]}
            />

            {showDetalle && (
                <RecaudacionesGridModal
                    idRecaudacionLote={editItem.id}
                    onCancel={onModalCancel}
                />
            )}

        </section>
    </>
}

export default RecaudacionHistorialView
