import { useEffect, useRef, useState } from "react"
import { useEntidad, useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { SectionHeading, TableCustom, WrapperAdvancedSearch } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import { getDateToString, getFormatNumber, truncateTime } from "../../utils/convert"
import { useNav } from '../../components/hooks/useNav';
import { useReporte } from "../../components/hooks/useReporte"
import { OpenObjectURL } from "../../utils/helpers"
import { printTicket } from "../../utils/printTicket"

const CierreCajasHistorialView = () => {
    const navigate = useNav();
    const { setIsLoading, showMessageModal } = useManagedContext()

    const searchRef = useRef()

    const [cierres, setCierres] = useState([])

    const [, getRowEntidad ] = useEntidad({
        entidades: ['Caja'],
        onLoaded: (_, isSuccess, error) => {
          if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        memo: {
          key: 'Caja',
          timeout: 0
        }
    })    

    useEffect(() => SearchCierres(), [])

    const [ generateReporte, ] = useReporte({
        callback: (reporte, data, message) => {
            if (data) {
                printTicket(data)
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message)
            }
        },
        mode: 'json'
    })

    const filterData = data => {
        const { fechaCierreDesde,  fechaCierreHasta, importeCobroDesde, importeCobroHasta } = searchRef.current.filters

        let filtered = [...data]
 
        if (fechaCierreDesde) filtered = filtered.filter(item => truncateTime(item.fechaCierre).getTime() >= truncateTime(fechaCierreDesde).getTime())
        if (fechaCierreHasta) filtered = filtered.filter(item => truncateTime(item.fechaCierre).getTime() <= truncateTime(fechaCierreHasta).getTime())
        if (importeCobroDesde && importeCobroDesde > 0) filtered = filtered.filter(item => item.importeCobro >= importeCobroDesde);
        if (importeCobroHasta && importeCobroHasta > 0) filtered = filtered.filter(item => item.importeCobro <= importeCobroHasta);

        return filtered
    }


    const SearchCierres = () => {
        setIsLoading(true)

        const { idCaja } = searchRef.current.filters

        const paramsUrl =  (idCaja > 0) ? `/caja-asignacion/${idCaja}` : `/caja-asignacion`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            null,
            res => res.json().then(data => {
                data.forEach(row => {
                    if (row.fechaApertura) row.fechaApertura = new Date(row.fechaApertura);
                    if (row.fechaCierre) row.fechaCierre = new Date(row.fechaCierre);
                })
                data = data.filter(f => f.fechaCierre)
                data.sort((a,b) => b.id - a.id)
                setCierres(filterData(data))
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
            handleClickDetalleView(item.id)
        },
        customActions: [
            {
                icon: 'print',
                title: 'Reimprimir Cierre de caja',
                onClick: (item) => {
                    emitirCajaCierre(item.id)
                }
            }
        ]
    }

    const handleClickDetalleView = (id) => {
        const url = '/historial/cierre-caja/' + id;
        navigate({ to: url });
    }

    const emitirCajaCierre = (idCajaAsignacion) => {
        const paramsReporte = {
            idCajaAsignacion: idCajaAsignacion
        }
        generateReporte("CajaCierre", paramsReporte);
    }

    return <>
        <SectionHeading titles={[{ title: 'Cajas' }, { title: 'Historial de cierre de cajas' }]} />

        <section className='section-accordion'>
            <WrapperAdvancedSearch
                ref={searchRef}
                filters={[
                    { title: 'Caja', field: 'idCaja', type: 'entity', entidad: 'Caja', size: 4 },
                    { title: 'Fecha Cierre Desde', field: 'fechaCierreDesde', type: 'date', size: 4 },
                    { title: 'Fecha Cierre Hasta', field: 'fechaCierreHasta', type: 'date', size: 4, minValueField: 'fechaCierreDesde' },
                    { title: 'Importe Cobro Desde', field: 'importeCobroDesde', type: 'number', size: 4 },
                    { title: 'Importe Cobro Hasta', field: 'importeCobroHasta', type: 'number', size: 4 },
                ]}
                onSearch={SearchCierres}
            />

            <TableCustom
                className={'TableCustomBase m-top-20'}
                data={cierres}
                avmr={avmr}
                columns={[
                    { Header: 'Caja', accessor: 'idCaja', width: '15%', Cell: ({ value }) =>  getRowEntidad('Caja', value)?.nombre ?? '' },
                    { Header: 'Fecha Apertura', accessor: 'fechaApertura', Cell: (data) => getDateToString(data.value), width: '13%'},
                    { Header: 'Fecha Cierre', accessor: 'fechaCierre', Cell: (data) => getDateToString(data.value), width: '13%'},
                    { Header: 'Saldo Inicial', accessor: 'importeSaldoInicial', Cell: (data) => getFormatNumber(data.value, 2), width: '12%', alignCell: 'right' },
                    { Header: 'Saldo Final', accessor: 'importeSaldoFinal', Cell: (data) => getFormatNumber(data.value, 2), width: '12%', alignCell: 'right' },               
                    { Header: 'Importe Cobro', accessor: 'importeCobro', Cell: (data) => getFormatNumber(data.value, 2), width: '15%', alignCell: 'right' },
                    { Header: 'Importe Cobro Efectivo', accessor: 'importeCobroEfectivo', Cell: (data) => getFormatNumber(data.value, 2), width: '20%', alignCell: 'right' }
                ]}
            />

        </section>
    </>
}

export default CierreCajasHistorialView
