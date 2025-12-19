import { useEffect, useRef, useState } from "react"
import { useEntidad, useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { SectionHeading, TableCustom, WrapperAdvancedSearch } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { PERMISSIONS } from "../../consts/permissions"
import { ESTADO_CAJA } from "../../consts/estadoCaja"
import { getDateToString, getFormatNumber } from "../../utils/convert"
import MovimientosCajaGridModal from "../../components/controls/MovimientosCajaGridModal"
import { useReporte } from "../../components/hooks/useReporte"
import { OpenObjectURL } from "../../utils/helpers"

const CierreTesoreriaView = () => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const [cajas, setCajas] = useState([])
    const [tableVisible, setTableVisible] = useState(true)
    const [selectedAll, setSelectedAll] = useState(false)
    const [idCajaAsignacion, setIdCajaAsignacion] = useState(0)

    const searchRef = useRef()

    useEffect(() => SearchCajas(), [])

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

    const [, getRowEntidad ] = useEntidad({
        entidades: ['Dependencia','Recaudadora'],
        onLoaded: (_, isSuccess, error) => {
          if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        memo: {
          key: 'Dependencia_Recaudadora',
          timeout: 0
        }
    })

    const filterData = data => {
        const { idDependencia } = searchRef.current.filters

        let filtered = [...data]
        filtered = filtered.filter(item => item.idEstadoCaja === ESTADO_CAJA.CERRADA &&
                                           item.cajaAsignacion && !item.cajaAsignacion.idRecaudacionLote)
        if (idDependencia !== 0) filtered = filtered.filter(item => item.idDependencia === idDependencia)
        filtered.forEach((item, index) => {
            item.index = index
            item.selected = false
            item.fechaCierre = item.cajaAsignacion.fechaCierre
            item.fechaApertura = item.cajaAsignacion.fechaApertura
            item.importeCobro = item.cajaAsignacion.importeCobro
        })

        return filtered
    }
    const SearchCajas = () => {
        setIsLoading(true)

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CAJA,
            '/cierre-tesoreria',
            null,
            res => res.json().then(data => {
                data.sort((a,b) => a.orden - b.orden)
                setCajas(filterData(data))
                setIsLoading(false)
                setTableVisible(true)
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
    const CerrarTesoreria = () => {

        setIsLoading(true)

        const paramsUrl = `/cierre-tesoreria`
        const dataBody = {
            idsCajaAsignacion: cajas.filter(f => f.selected).map(x => x.cajaAsignacion.id)
        }

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            dataBody,
            res => res.json().then(({idsRecaudacionLote}) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Cierre de tesorería exitoso')
                idsRecaudacionLote.forEach(idRecaudacionLote => emitirInformeRecaudacionLote(idRecaudacionLote))
                SearchCajas();
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

    const cellSelAll = (props) =>   <div className='action-check'>
                                        <input className='form-check-input' type="checkbox" value={''} checked={selectedAll}
                                            name="selectedAll"
                                            onChange={({target}) =>{
                                                const checked = target.checked
                                                setSelectedAll(checked)
                                                SelectAll(checked)
                                            }}
                                        />
                                    </div>
    const cellSel = (props) =>      <div className='action-check'>
                                        <input className='form-check-input' type="checkbox" value={''} checked={cajas[props.value].selected} readOnly={true} />
                                    </div>

    function SelectAll(checked) {
        const list = [...cajas]
        for (let index=0; index < list.length; index++) {
            list[index].selected = checked
        }
        setCajas(list)
    }
    function UnSelectAll() {
        setSelectedAll(false)
    }
    function UpdateItems(list) {
        UnSelectAll()
        setCajas(list)
    }
    
    const handleClickSelected = (index) => {
        const list = [...cajas]
        list[index].selected = !list[index].selected
        UpdateItems(list)
    }
    const handleCerrarTesoreria = () => {
        if (cajas.filter(f => f.selected).length === 0) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar un cierre de caja')

        showMessageModal({
            title: "Confirmación",
            message: "¿Está seguro/a de cerrar la tesorería?",
            onConfirm: () => CerrarTesoreria(),
        })
    }

    const emitirInformeRecaudacionLote = (id) => {
        const paramsReporte = {
            idRecaudacionLote: id
        }
        generateReporte("InformeRecaudacionLote", paramsReporte);
    }
    
    const avmr = {
        onView: (row) => {
            if (row.cajaAsignacion) {
                setIdCajaAsignacion(row.cajaAsignacion.id)
            }
        }
    }

    return <>
        <SectionHeading titles={[{ title: 'Cajas' }, { title: 'Cierre de tesorería' }]} {...{tableVisible}} />

        <section className='section-accordion'>
            <WrapperAdvancedSearch
                ref={searchRef}
                filters={[
                    { title: 'Dependencia', field: 'idDependencia', type: 'entity', entidad: 'Dependencia', size: 4 },
                ]}
                onSearch={SearchCajas}
            />

            {tableVisible && (
                <TableCustom
                    className={'TableCustomBase m-top-20'}
                    data={cajas}
                    avmr={avmr}
                    columns={[
                        { Header: cellSelAll, Cell: cellSel, accessor: 'index', width:'3%', disableGlobalFilter: true, disableSortBy: true, ellipsis: false},
                        { Header: 'Código', accessor: 'codigo', width: '7%', },
                        { Header: 'Nombre', accessor: 'nombre', width: '13%', },
                        { Header: 'Fecha apertura', Cell: (data) => getDateToString(data.value, true), accessor: 'fechaApertura', width: '12%'},
                        { Header: 'Fecha cierre', Cell: (data) => getDateToString(data.value, true), accessor: 'fechaCierre', width: '12%' },
                        { Header: 'Recaudación ($)', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeCobro', width: '12%', alignCell: 'right' },
                        { Header: 'Dependencia', accessor: 'idDependencia', width: '18%', Cell: ({ value }) =>  getRowEntidad('Dependencia', value)?.nombre ?? '' },
                        { Header: 'Recaudadora', accessor: 'idRecaudadora', width: '18%', Cell: ({ value }) =>  getRowEntidad('Recaudadora', value)?.nombre ?? '' },
                    ]}
                    showDownloadCSV={false}
                    showFilterGlobal={false}
                    editCode={PERMISSIONS.CIERRE_TESORERIA_EDIT}
                    onClickRow={(row, cellId) => {
                        if (cellId !== "abm") {
                            handleClickSelected(row.index);
                        }
                    }}
                />
            )}

            {idCajaAsignacion > 0 && (
                <MovimientosCajaGridModal
                    idCajaAsignacion={idCajaAsignacion}
                    onCancel={() => setIdCajaAsignacion(0)}
                />
            )}

        </section>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn action-button float-end" onClick={ (event) => handleCerrarTesoreria() }>Cerrar tesorería</button>
            </div>
        </footer>

    </>
}

export default CierreTesoreriaView
