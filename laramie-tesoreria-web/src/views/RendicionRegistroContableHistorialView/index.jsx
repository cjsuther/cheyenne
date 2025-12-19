import { useEffect, useRef, useState } from "react"
import { useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { SectionHeading, TableCustom, WrapperAdvancedSearch } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { getDateToString, getFormatNumber, truncateTime } from "../../utils/convert"
import { useReporte } from "../../components/hooks/useReporte"
import { OpenObjectURL } from "../../utils/helpers"
import RegistrosContablesGridModal from "../../components/controls/RegistrosContablesGridModal"

const initItem = {
    id: 0
}

const RendicionRegistroContableHistorialView = () => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const searchRef = useRef()

    const [lotes, setLotes] = useState([])
    const [editItem, setEditItem] = useState(initItem)
    const [showDetalle, setShowDetalle] = useState(false)

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
        const { numeroLote, fechaProcesoDesde,  fechaProcesoHasta} = searchRef.current.filters

        let filtered = [...data]

        if (numeroLote !== '') filtered = filtered.filter(item => item.numeroLote.indexOf(numeroLote) >= 0)
        if (fechaProcesoDesde) filtered = filtered.filter(item => truncateTime(item.fechaProceso).getTime() >= truncateTime(fechaProcesoDesde).getTime())
        if (fechaProcesoHasta) filtered = filtered.filter(item => truncateTime(item.fechaProceso).getTime() <= truncateTime(fechaProcesoHasta).getTime())

        return filtered
    }

    const SearchLotes = () => {
        setIsLoading(true)

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.REGISTRO_CONTABLE_LOTE,
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

    const emitirInformeRedo = (id) => {
        const paramsReporte = {
            idRegistroContableLote: id
        }
        generateReporte("InformeRedo", paramsReporte);
    }

    const avmr = {
        onView: (item) => {
            setEditItem(item)
            setShowDetalle(true)
        },
        onDownload: ({ id }) => {
            emitirInformeRedo(id)
        }
    }


    const onModalCancel = () => {
        setShowDetalle(false)
        setEditItem(initItem)
    }


    return <>
        <SectionHeading titles={[{ title: 'Rendiciones' }, { title: 'Historial de rendición a contaduría' }]} />

        <section className='section-accordion'>
            <WrapperAdvancedSearch
                ref={searchRef}
                filters={[
                    { title: 'Numero Lote', field: 'numeroLote', type: 'string', size: 4, searchOnEnter: true, },
                    { title: 'Fecha Proceso Desde', field: 'fechaProcesoDesde', type: 'date', size: 4 },
                    { title: 'Fecha Proceso Hasta', field: 'fechaProcesoHasta', type: 'date', size: 4, minValueField: 'fechaProcesoDesde' },
                ]}
                onSearch={SearchLotes}
            />

            <TableCustom
                className={'TableCustomBase m-top-20'}
                data={lotes}
                avmr={avmr}
                columns={[
                    { Header: 'N° lote', accessor: 'numeroLote', width: '23%', },
                    { Header: 'Fecha lote', accessor: 'fechaLote', Cell: (data) => getDateToString(data.value), width: '11%'},
                    { Header: 'Fecha proceso', accessor: 'fechaProceso', Cell: (data) => getDateToString(data.value, true), width: '11%'},
                    { Header: 'Fecha confirmación', accessor: 'fechaConfirmacion', Cell: (data) => getDateToString(data.value, true), width: '12%' },
                    { Header: 'Casos', accessor: 'casos', Cell: (data) => getFormatNumber(data.value, 0), width: '9%', alignCell: 'right' },
                    { Header: 'Importe total', accessor: 'importeTotal', Cell: (data) => getFormatNumber(data.value, 2), width: '17%', alignCell: 'right' },
                    { Header: 'Archivo rendición', accessor: 'pathArchivoRegistroContable', width: '22%', }
                ]}
            />

            {showDetalle && (
                <RegistrosContablesGridModal
                    idRegistroContableLote={editItem.id}
                    onCancel={onModalCancel}
                />
            )}

        </section>
    </>
}

export default RendicionRegistroContableHistorialView
