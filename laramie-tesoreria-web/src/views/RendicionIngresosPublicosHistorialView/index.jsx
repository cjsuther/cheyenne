import { useEffect, useRef, useState } from "react"
import { useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { SectionHeading, TableCustom, WrapperAdvancedSearch } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import { getDateToString, getFormatNumber, truncateTime } from "../../utils/convert"
import RegistrosIngresosPublicosGridModal from "../../components/controls/RegistrosIngresosPublicosGridModal"

const initItem = {
    id: 0
}

const RendicionIngresosPublicosHistorialView = () => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const searchRef = useRef()

    const [lotes, setLotes] = useState([])
    const [editItem, setEditItem] = useState(initItem)
    const [showDetalle, setShowDetalle] = useState(false)

    useEffect(() => SearchLotes(), [])

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
            APIS.URLS.PAGO_RENDICION_LOTE,
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

    const avmr = {
        onView: (item) => {
            setEditItem(item)
            setShowDetalle(true)
        }
    }

    const onModalCancel = () => {
        setShowDetalle(false)
        setEditItem(initItem)
    }


    return <>
        <SectionHeading titles={[{ title: 'Rendiciones' }, { title: 'Historial de rendición a ingresos públicos' }]} />

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
                    { Header: 'Fecha proceso', accessor: 'fechaProceso', Cell: (data) => getDateToString(data.value, true), width: '20%'},
                    { Header: 'Fecha confirmación', accessor: 'fechaConfirmacion', Cell: (data) => getDateToString(data.value, true), width: '20%' },
                    { Header: 'Casos', accessor: 'casos', Cell: (data) => getFormatNumber(data.value, 0), width: '9%', alignCell: 'right' },
                    { Header: 'Importe total', accessor: 'importeTotal', Cell: (data) => getFormatNumber(data.value, 2), width: '17%', alignCell: 'right' }
                ]}
            />

            {showDetalle && (
                <RegistrosIngresosPublicosGridModal
                    idPagoRendicionLote={editItem.id}
                    onCancel={onModalCancel}
                />
            )}

        </section>
    </>
}

export default RendicionIngresosPublicosHistorialView
