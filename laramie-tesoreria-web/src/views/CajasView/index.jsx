import { useEffect, useRef, useState } from "react"
import { useEntidad, useLista, useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { SectionHeading, TableCustom, WrapperAdvancedSearch } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import CajaModal from "../../components/controls/CajaModal"
import { PERMISSIONS } from "../../consts/permissions"
import { ESTADO_CAJA } from "../../consts/estadoCaja"

const CajasView = () => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const [cajas, setCajas] = useState([])
    const [tableVisible, setTableVisible] = useState(true)
    const [editMode, setEditMode] = useState()
    const [editItem, setEditItem] = useState()

    const searchRef = useRef()

    const [, getRowLista ] = useLista({
        listas: ['EstadoCaja'],
        onLoaded: (_, isSuccess, error) => {
          if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        memo: {
          key: 'EstadoCaja',
          timeout: 0
        }
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

    useEffect(() => SearchCajas(), [])

    const filterData = data => {
        const { idDependencia } = searchRef.current.filters

        let filtered = [...data]

        if (idDependencia !== 0) filtered = filtered.filter(item => item.idDependencia === idDependencia)

        return filtered
    }

    const SearchCajas = () => {
        setIsLoading(true)

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CAJA,
            null,
            null,
            res => res.json().then(data => {
                data.sort((a,b) => a.orden - b.orden)
                setCajas(filterData(data))
                setIsLoading(false)
                setTableVisible(true)
                setEditMode(null)
                setEditItem(null)
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
                setEditMode(null)
                setEditItem(null)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
                setEditMode(null)
                setEditItem(null)
            },
        )
    }

    const confirmRemoveId = (id) => {
        setIsLoading(true)
        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.CAJA,
            `/${id}`,
            null,
            () => {
                setCajas(prev => prev.filter(x => x.id !== id))
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

    const onModalCancel = () => {
        setEditMode(null)
        setEditItem(null)
    }

    const onModalConfirm = () => {
        SearchCajas()
    }

    const avmr = {
        onAdd: () => {
            setEditMode('add')
            setEditItem({
                id: -Date.now(),
                codigo: '',
                nombre: '',
                orden: 0,
                idDependencia: 0,
                idEstadoCaja: ESTADO_CAJA.INACTIVA,
                idUsuarioActual: 0,
                idCajaAsignacionActual: 0,
                idRecaudadora: 0,
            })
        },
        onView: (item) => {
            setEditMode('view')
            setEditItem(item)
        },
        onModify: (item) => {
            setEditMode('modify')
            setEditItem(item)
        },
        onRemove: ({ id }) => {
            showMessageModal({
                title: "Confirmación",
                message: "¿Está seguro/a de borrar el registro?",
                onConfirm: () => confirmRemoveId(id),
            })
        }
    }

    return <>
        <SectionHeading titles={[{ title: 'Cajas' }, { title: 'Administración de cajas' }]} {...{tableVisible}} />

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
                        { Header: 'Código', accessor: 'codigo', width: '10%', },
                        { Header: 'Nombre', accessor: 'nombre', width: '30%', },
                        { Header: 'Estado', accessor: 'idEstadoCaja', width: '10%', Cell: ({ value }) =>  getRowLista('EstadoCaja', value)?.nombre ?? '' },
                        { Header: 'Dependencia', accessor: 'idDependencia', width: '25%', Cell: ({ value }) =>  getRowEntidad('Dependencia', value)?.nombre ?? '' },
                        { Header: 'Recaudadora', accessor: 'idRecaudadora', width: '25%', Cell: ({ value }) =>  getRowEntidad('Recaudadora', value)?.nombre ?? '' },
                    ]}
                    editCode={PERMISSIONS.CAJA_EDIT}
                />
            )}

            {editItem && (
                <CajaModal
                    {...{editMode, editItem}}
                    onConfirm={onModalConfirm}
                    onCancel={onModalCancel}
                />
            )}
        </section>
    </>
}

export default CajasView
