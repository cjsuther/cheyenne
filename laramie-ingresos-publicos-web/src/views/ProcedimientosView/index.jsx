import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AdvancedSearch, InputLista, Loading, MessageModal, SectionHeading, TableCustom } from "../../components/common"
import { APPCONFIG } from "../../app.config"
import { OPERATION_MODE } from "../../consts/operationMode"
import { useEffect } from "react"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { useLista } from "../../components/hooks/useLista"
import DataTaggerModalApi from "../../components/controls/DataTaggerModalApi"

const labelSchema = [
    { title: 'Tipo Tributo', field: 'idTipoTributo', },
]

const ProcedimientosView = () => {
    let navigate = useNavigate();
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [removingId, setRemovingId] = useState()
    const [filters, setFilters] = useState({
        idTipoTributo: { value: 0, label: '' },
    })
    const [appliedFilters, setAppliedFilters] = useState(filters)
    const [dataTaggerId, setDataTaggerId] = useState(null)

    const labels = useMemo(() => {
        return labelSchema.filter(x => appliedFilters[x.field].value).map(x => ({ title: x.title, value: appliedFilters[x.field].label }))
    }, [appliedFilters])

    const filteredData = useMemo(() => {
        if (filters.idTipoTributo.value === 0)
            return data
        else return data.filter(x => x.idTipoTributo === filters.idTipoTributo.value)
    }, [data, appliedFilters])

    const [, getRowLista ] = useLista({
        listas: ['TipoTributo'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'ProcedimientoTipoTributo',
          timeout: 0
        },
    })
    const getTipoTributo = (id) => getRowLista('TipoTributo', id) ?? {}

    const onNoSuccess = (response) => {
        response.json()
            .then((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error.message);
                setLoading(false)
            })
            .catch((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error);
                setLoading(false)
            });
    }

    const onError = (error) => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando solicitud: ' + error.message)
        setLoading(false)
    }

    const fetchData = () => {
        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PROCEDIMIENTO,
            null,
            null,
            res => res.json().then(data => {
                setData(data)
                setLoading(false)
            }),
            onNoSuccess,
            onError,
        )
    }

    useEffect(() => {
        if (!mounted) setMounted(true)
        else fetchData()
    }, [appliedFilters])

    //#region events
    const onSearch = () => {
        setAppliedFilters(filters)
        fetchData()
    }

    const onAdd = () => {
        const url = '/procedimiento/' + OPERATION_MODE.NEW;
        navigate(url, { replace: true });
    }

    const onView = (item) => {
        const url = '/procedimiento/' + OPERATION_MODE.VIEW + '/' + item.id;
        navigate(url, { replace: true });
    }

    const onModify = (item) => {
        const url = '/procedimiento/' + OPERATION_MODE.EDIT + '/' + item.id;
        navigate(url, { replace: true });
    }

    const onAdditionalInfo = (item) => {
        setDataTaggerId(item.id)
    }

    const onConfirmRemoveId = (id) => {
        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.PROCEDIMIENTO,
            `/${id}`,
            null,
            res => {
                setData(prev => prev.filter(x => x.id !== id))
                setRemovingId(null)
                setLoading(false)
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Procedimiento borrado')
            },
            onNoSuccess,
            onError,
        )
    }
    //#endregion

    const cellAVMR = {
        id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true,
        Header: (props) => (
            <div className='action'>
                <div onClick={onAdd} className="link">
                    <i className="fa fa-plus" title="nuevo"></i>
                </div>
            </div>
        ),
        Cell: (props) =>  (
            <div className='action'>
                <div onClick={() => onView(props.row.original)} className="link">
                    <i className="fa fa-search" title="ver"></i>
                </div>
                <div onClick={() => onModify(props.row.original)} className="link">
                    <i className="fa fa-pen" title="modificar"></i>
                </div>
                <div onClick={() => setRemovingId(props.row.original.id)} className="link">
                    <i className="fa fa-trash" title="borrar"></i>
                </div>
                <div onClick={() => onAdditionalInfo(props.row.original)} className="link">
                    <i className="fa fa-info-circle" title="Información adicional"></i>
                </div>
            </div>
        ),
    }

    return (
        <div>
            <SectionHeading title={<>Procedimientos de Emisión</>} />
    
            <section className='section-accordion'>
                <Loading visible={loading} />

                <AdvancedSearch
                    labels={labels}
                    onSearch={onSearch}
                >
                    <div className='row form-basic'>
                        <div className="col-12 col-md-6 col-lg-4">
                            <label htmlFor="idTipoTributo" className="form-label">Tipo Tributo</label>
                            <InputLista
                                name="idTipoTributo"
                                placeholder=""
                                className="form-control"
                                value={filters.idTipoTributo.value}
                                title="Tipo Tributo"
                                lista="TipoTributo"
                                onChange={({ target: { row } }) => setFilters(prev => ({
                                    ...prev,
                                    idTipoTributo: { value: row ? row.id : 0 , label: row ? row.nombre : null }
                                }))}
                            />
                        </div>
                    </div>

                </AdvancedSearch>

                <TableCustom
                    className={'TableCustomBase m-top-10'}
                    data={filteredData}
                    columns={[
                        { Header: 'Tipo de Tributo', accessor: 'idTipoTributo', Cell: ({ value }) => getTipoTributo(value).nombre ?? '', width: '30%', },
                        { Header: 'Nombre', accessor: 'nombre', width: '30%', },
                        { Header: 'Descripción', accessor: 'descripcion', width: '30%', },
                        cellAVMR,
                    ]}
                />
            </section>

            {removingId && 
                <MessageModal
                    title={"Confirmación"}
                    message={"¿Está seguro de borrar el registro?"}
                    onDismiss={() => setRemovingId(null)}
                    onConfirm={() => onConfirmRemoveId(removingId)}
                />
            }

            {dataTaggerId &&
                <DataTaggerModalApi
                    title="Información adicional de Procedimiento"
                    entidad="Procedimiento"
                    idEntidad={dataTaggerId}
                    disabled={false}
                    onConfirm={() => setDataTaggerId(null)}
                    onDismiss={() => setDataTaggerId(null)}
                />
            }
        </div>
    )
}

export default ProcedimientosView
