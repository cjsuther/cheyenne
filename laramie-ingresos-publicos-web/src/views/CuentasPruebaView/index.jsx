import { useMemo, useState } from 'react'
import { AdvancedSearch, InputLista, Loading, MessageModal, SectionHeading, TableCustom } from '../../components/common'
import { ServerRequest } from '../../utils/apiweb'
import { REQUEST_METHOD } from '../../consts/requestMethodType'
import { APIS } from '../../config/apis'
import ShowToastMessage from '../../utils/toast'
import { ALERT_TYPE } from '../../consts/alertType'
import { useLista } from '../../components/hooks/useLista'
import CuentasPruebaEditModal from './components/CuentasPruebaEditModal'
import { OPERATION_MODE } from '../../consts/operationMode'

const CuentasPruebaView = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [inputIdTipoTributo, setInputIdTipoTributo] = useState(null)
    const [selectedIdTipoTributo, setSelectedIdTipoTributo] = useState(null)
    const [editState, setEditState] = useState({ item: null, mode: null, removingId: null, })

    const filteredData = useMemo(() => data.filter(x => x.idTipoTributo === selectedIdTipoTributo))

    const [, getRowLista] = useLista({
        listas: ['TipoTributo'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        memo: {
          key: 'CuentasPruebaListas',
          timeout: 0
        },
    })
    const labels = useMemo(() => selectedIdTipoTributo ? [{
        title: 'Tipo de Tributo',
        value: getRowLista('TipoTributo', selectedIdTipoTributo).nombre
    }] : [])

    //#region events

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

    const onSearch = () => {
        const onSuccess = (response) => {
            response.json().then(data => {
                setData(data)
                setLoading(false)
            })
        }

        setLoading(true)
        setSelectedIdTipoTributo(inputIdTipoTributo)
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CUENTA_PRUEBA,
            null,
            null,
            onSuccess,
            onNoSuccess,
            onError,
        )
    }
    
    const onAdd = () => {
        if (selectedIdTipoTributo < 1) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar un Tipo de Tributo')
        } else {
            setEditState({
                mode: OPERATION_MODE.NEW,
                item: {
                    id: -Date.now(),
                    idTipoTributo: selectedIdTipoTributo,
                    idCuenta: 0,
                    comentario: '',
                },
            })
        }
    }

    const onView = (row) => {
        setEditState({
            mode: OPERATION_MODE.VIEW,
            item: row,
        })
    }
    
    const onModify = (row) => {
        setEditState({
            mode: OPERATION_MODE.EDIT,
            item: row,
        })
    }

    const onRemove = (row) => {
        setEditState({ removingId: row.id })
    }

    const confirmRemoveId = (id) => {
        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.CUENTA_PRUEBA,
            `/${id}`,
            null,
            () => {
                setData(prev => prev.filter(x => x.id !== id))
                setLoading(false)
                setEditState({ })
            },
            onNoSuccess,
            onError,
        )
    }

    const onModalAccept = () => {
        if (editState.item.idCuenta < 1) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Deben seleccionar una cuenta')
            return
        }

        const isNew = editState.mode === OPERATION_MODE.NEW

        setLoading(true)
        ServerRequest(
            isNew ? REQUEST_METHOD.POST : REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CUENTA_PRUEBA,
            isNew ? null : `/${editState.item.id}`,
            editState.item,
            () => {
                onSearch()
                setEditState({
                    mode: null,
                    item: null,
                })
            },
            onNoSuccess,
            onError,
        )
    }

    const onModalCancel = () => {
        setEditState({
            mode: null,
            item: null,
        })
    }

    //#endregion

    return (
        <>

        <SectionHeading title={<>Cuentas de Prueba</>} />

        <section className='section-accordion'>

            <Loading visible={loading} />

            <AdvancedSearch
                labels={labels}
                onSearch={onSearch}
            >
                <div className='row form-basic'>
                    <div className="col-12">
                        <label htmlFor="idTipoTributo" className="form-label">Tipo Tributo</label>
                        <InputLista
                            name="idTipoTributo"
                            placeholder=""
                            className="form-control"
                            value={inputIdTipoTributo}
                            title="Tipo Tributo"
                            lista="TipoTributo"
                            onChange={({ target }) => setInputIdTipoTributo(target.value)}
                        />
                    </div>
                </div>
            </AdvancedSearch>

            <div className="m-top-20">
                <TableCustom
                    className={'TableCustomBase'}
                    data={filteredData}
                    columns={[
                        { Header: 'Número de Cuenta', accessor: 'numeroCuenta', width: '45%', },
                        { Header: 'Comentario', accesor: 'comentario', Cell: ({ row }) => row.original.comentario, width: '45%', },
                    ]}
                    avmr={{ onAdd, onView, onModify, onRemove }}
                />
            </div>
            
            {editState.item && (
                <CuentasPruebaEditModal
                    {...editState}
                    setItem={item => setEditState(prev => ({ ...prev, item }))}
                    onAccept={onModalAccept}
                    onCancel={onModalCancel}
                />
            )}

            {editState.removingId && 
                <MessageModal
                    title={"Confirmación"}
                    message={"¿Está seguro de borrar el registro?"}
                    onDismiss={() => setEditState({ })}
                    onConfirm={() => confirmRemoveId(editState.removingId)}
                />
            }
        </section>

        </>
    )
}

export default CuentasPruebaView
