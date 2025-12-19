import { useEffect, useState } from "react"
import { useEntidad, useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { SectionHeading, TableCustom } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { getFormatNumber } from "../../utils/convert"
import { useReporte } from "../../components/hooks/useReporte"
import { OpenObjectURL } from "../../utils/helpers"

const RendicionRegistroContableView = () => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const [recaudadoras, setRecaudadoras] = useState([])
    const [selectedAll, setSelectedAll] = useState(false)

    useEffect(() => SearchRecaudacionLotes(), [])

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
        entidades: ['Recaudadora'],
        onLoaded: (_, isSuccess, error) => {
          if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        memo: {
          key: 'Recaudadora',
          timeout: 0
        }
    })

    const filterData = data => {
        let filtered = [...data]
        filtered.forEach((item, index) => {
            item.index = index
            item.selected = false
        })

        return filtered
    }
    const SearchRecaudacionLotes = () => {
        setIsLoading(true)

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            '/registro-contable',
            null,
            res => res.json().then(data => {
                data.sort((a,b) => a.idRecaudadora - b.idRecaudadora)
                setRecaudadoras(filterData(data))
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
    const RendirRegistroContable = () => {

        setIsLoading(true)

        const dataBody = {
            idsRecaudadora: recaudadoras.filter(f => f.selected).map(x => x.idRecaudadora)
        }

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.RECAUDACION_LOTE,
            '/registro-contable',
            dataBody,
            res => res.json().then(({idsRegistroContableLote}) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Rendición a contaduría exitosa')
                idsRegistroContableLote.forEach(idRegistroContableLote => emitirInformeRedo(idRegistroContableLote))
                SearchRecaudacionLotes();
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
                                        <input className='form-check-input' type="checkbox" value={''} checked={recaudadoras[props.value].selected} readOnly={true} />
                                    </div>

    function SelectAll(checked) {
        const list = [...recaudadoras]
        for (let index=0; index < list.length; index++) {
            list[index].selected = checked
        }
        setRecaudadoras(list)
    }
    function UnSelectAll() {
        setSelectedAll(false)
    }
    function UpdateItems(list) {
        UnSelectAll()
        setRecaudadoras(list)
    }
    
    const handleClickSelected = (index) => {
        const list = [...recaudadoras]
        list[index].selected = !list[index].selected
        UpdateItems(list)
    }
    const handleRendirRegistroContable = () => {
        if (recaudadoras.filter(f => f.selected).length === 0) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar una recaudadora')

        showMessageModal({
            title: "Confirmación",
            message: "¿Está seguro/a de generar la rendición?",
            onConfirm: () => RendirRegistroContable(),
        })
    }

    const emitirInformeRedo = (id) => {
        const paramsReporte = {
            idRegistroContableLote: id
        }
        generateReporte("InformeRedo", paramsReporte);
    }

    return <>
        <SectionHeading titles={[{ title: 'Rendiciones' }, { title: 'Rendición a contaduría' }]} />

        <section className='section-accordion'>

            <TableCustom
                className={'TableCustomBase m-top-20'}
                data={recaudadoras}
                columns={[
                    { Header: cellSelAll, Cell: cellSel, accessor: 'index', width:'3%', disableGlobalFilter: true, disableSortBy: true, ellipsis: false},
                    { Header: 'Recaudadora', accessor: 'idRecaudadora', width: '67%', Cell: ({ value }) =>  getRowEntidad('Recaudadora', value)?.nombre ?? '' },
                    { Header: 'Casos', Cell: (data) => getFormatNumber(data.value, 0), accessor: 'casos', width: '10%', alignCell: 'right' },
                    { Header: 'Recaudación ($)', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeTotal', width: '20%', alignCell: 'right' },
                ]}
                showDownloadCSV={false}
                showFilterGlobal={false}
                onClickRow={(row, cellId) => {
                    handleClickSelected(row.index);
                }}
            />

        </section>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn action-button float-end" onClick={ (event) => handleRendirRegistroContable() }>Confirmar</button>
            </div>
        </footer>

    </>
}

export default RendicionRegistroContableView
