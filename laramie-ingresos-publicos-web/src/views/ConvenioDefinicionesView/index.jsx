import { useState } from "react"
import { useEffect } from "react"
import { InputFormat, InputFormula, InputLista, Loading, MessageModal, Modal, TableCustom, ToolbarFormula } from "../../components/common"
import { useLista } from "../../components/hooks/useLista"
import { APIS } from "../../config/apis"
import { ALERT_TYPE } from "../../consts/alertType"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { ServerRequest } from "../../utils/apiweb"
import ShowToastMessage from "../../utils/toast"

import './index.scss';

const fontSizes = ['xm', 'sm', 'md', 'lg']

const ConvenioDefinicionesView = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [editMode, setEditMode] = useState()
    const [editItem, setEditItem] = useState({
        codigo: '',
        condiciones: '',
        convenio: '',
        id: 0,
        idTipoTributo: 0,
        nombre: ''
    })
    const [removingId, setRemovingId] = useState(null)
    const [showToolbar, setShowToolbar] = useState(false)
    const [toolbarHorizontal, setToolbarHorizontal] = useState(true)
    const [queueEvents, setQueueEvents] = useState({
        timestamps: null,
        queue: [],
    })
    const [fontSizeIndex, setFontSizeIndex] = useState(1)
    const [parametros, setParametros] = useState([])

    //#region requests
    const onNoSuccess = response => response.json()
        .then((error) => {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error.message);
            setLoading(false)
        })
        .catch((error) => {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error);
            setLoading(false)
    })

    const onError = error => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando solicitud: ' + error.message)
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.TIPO_PLAN_PAGO,
            null,
            null,
            res => res.json().then(data => {
                setData(data)
                setLoading(false)
            }),
            onNoSuccess,
            onError,
        )
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CONVENIO_PARAMETRO,
            null,
            null,
            res => res.json().then(data => setParametros(data)),
            onNoSuccess,
            onError,
        )
    }, [])

    const [, getRowLista, listaReady] = useLista({
        listas: ['TipoTributo'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'ConvenioDefinicionesTipoTributo',
          timeout: 0
        },
    })
    //#endregion

    //#region events
    const onAdd = () => {
        setEditMode('add')
        setEditItem({
            codigo: '',
            condiciones: 'a',
            convenio: '',
            id: -Date.now(),
            idTipoTributo: 0,
            nombre: ''
        })
    }

    const onView = (item) => {
        setEditMode('view')
        setEditItem(item)
    }

    const onModify = (item) => {
        setEditMode('modify')
        setEditItem(item)
    }

    const confirmRemoveId = (id) => {
        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.TIPO_PLAN_PAGO,
            `/${id}`,
            null,
            () => {
                setData(prev => prev.filter(x => x.id !== id))
                setLoading(false)
            },
            onNoSuccess,
            onError
        )
        setRemovingId(null)
    }

    const onConfirmEdit = () => {
        if (editItem.codigo.length < 1) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Código')
        if (editItem.nombre.length < 1) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Nombre')
        if (editItem.convenio.length < 1) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Convenio')
        if (!editItem.idTipoTributo || editItem.idTipoTributo === 0) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tipo de Tributo')
        if (editItem.condiciones.length < 1) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Condiciones')

        if (editMode === 'add') {
            ServerRequest(
                REQUEST_METHOD.POST,
                null,
                true,
                APIS.URLS.TIPO_PLAN_PAGO,
                null,
                editItem,
                res => res.json().then(data => setData(prev => [...prev, data])),
                onNoSuccess,
                onError,
            )
        }

        else {
            const onSuccess = (res) => {
                res.json().then(data => {
                    setData(prev => prev.map(x => x.id === data.id ? data : x))
                })
            }

            ServerRequest(
                REQUEST_METHOD.PUT,
                null,
                true,
                APIS.URLS.TIPO_PLAN_PAGO,
                `/${editItem.id}`,
                editItem,
                onSuccess,
                onNoSuccess,
                onError,
            )
        }

        setEditMode(null)
        setEditItem(null)
    }

    const onCancelEdit = () => {
        setEditMode(null)
        setEditItem(null)
    }

    const onParametroSelected = (codigo) => {
        const { selectionStart, selectionEnd } = document.getElementsByTagName('textarea')[0]
        const original = editItem.condiciones
        setEditItem({
            ...editItem,
            condiciones: original.slice(0, selectionStart) + `[[${codigo}]]` + original.slice(selectionEnd)
        })
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
            </div>
        ),
    }

    const tableColumnsParametros = [
        {
            Header: '',
            Cell: ({ row: { original }}) => (
                <div className='action'>
                    <div onClick={() => onParametroSelected(original.codigo)} className="link">
                        <i className="fa fa-arrow-left" title="seleccionar"></i>
                    </div>
                </div>
            ),
            id:'select',
            accessor: 'id',
            width: '5%',
            disableGlobalFilter: true,
            disableSortBy: true
        },{
            Header: 'Código',
            accessor: 'codigo',
            width: '95%',
            Cell: ({ row: { original }}) => (
                <span style={{fontSize: 12,}}>
                    <strong className="input-formula-parametro">
                        {original.codigo}
                    </strong>
                    : {original.nombre}
                </span>
            ),
        }
    ]

    return (
        <section className='section-accordion'>
            <Loading visible={loading} />

            <div className="m-top-20">
                <TableCustom
                    className={'TableCustomBase'}
                    data={data}
                    columns={[
                        { Header: 'Código', accessor: 'codigo', width: '20%', },
                        { Header: 'Nombre', accessor: 'nombre', width: '20%', },
                        { Header: 'Convenio', accessor: 'convenio', width: '20%', },
                        { Header: 'Tipo de Tributo', accessor: 'idTipoTributo', Cell: ({ value }) => listaReady ? getRowLista('TipoTributo', value).nombre : '', width: '20%', },
                        cellAVMR,
                    ]}
                />
            </div>

            {editMode && <Modal
                show={editMode !== null}
                header={<h2 className="modal-title">Definición de Convenio</h2>}
                body={(
                    <div className='row form-basic'>
                        <div className="col-12 col-md-6">
                            <label htmlFor="codigo" className="form-label">Código</label>
                            <input
                                type="text"
                                name="Código"
                                maxLength={50}
                                className="form-control"
                                value={editItem.codigo}
                                onChange={({ target }) => setEditItem(prev => ({...prev, codigo: target.value}))}
                                disabled={editMode === 'view'}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input
                                type="text"
                                name="Nombre"
                                maxLength={250}
                                className="form-control"
                                value={editItem.nombre}
                                onChange={({ target }) => setEditItem(prev => ({...prev, nombre: target.value}))}
                                disabled={editMode === 'view'}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label htmlFor="convenio" className="form-label">Convenio</label>
                            <input
                                type="text"
                                name="Convenio"
                                maxLength={250}
                                className="form-control"
                                value={editItem.convenio}
                                onChange={({ target }) => setEditItem(prev => ({...prev, convenio: target.value}))}
                                disabled={editMode === 'view'}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <label htmlFor="idTipoTRibuto" className="form-label">Tipo de Tributo</label>
                            <InputLista
                                name="idTipoTributo"
                                placeholder=""
                                className="form-control"
                                value={editItem.idTipoTributo}
                                onChange={({ target }) => setEditItem(prev => ({...prev, idTipoTributo: target.value}))}
                                disabled={editMode === 'view'}
                                lista="TipoTributo"
                            />
                        </div>
                        <div className="convenio-definicion-form-separated">
                            <div className='col-md-7 convenio-definicion-condiciones'>
                                <label htmlFor="condiciones" className="form-label">Condiciones</label>
                                <textarea
                                    className="form-control"
                                    value={editItem.condiciones}
                                    onChange={({ target }) => setEditItem(prev => ({...prev, condiciones: target.value}))}
                                />
                            </div>
                            {(editMode !== 'view') && 
                            <div className='col-12 col-md-5'>
                                <label htmlFor="condiciones" className="form-label">Parámetros</label>
                                <TableCustom
                                    showDownloadCSV={false}
                                    showHeader={false}
                                    showFilterGlobal={true}
                                    showPagination={true}
                                    showPageSize={false}
                                    showPageCountOnlyPage={true}
                                    pageSize={5}
                                    className={'TableCustomBase'}
                                    columns={tableColumnsParametros}
                                    data={parametros}
                                    messageEmpty="No se encontraron parámetros"
                                />
                            </div>
                            }
                        </div>
                    </div>
                )}
                footer={(
                    <div>
                        {editMode !== 'view' && <button className="btn btn-primary" data-dismiss="modal" onClick={onConfirmEdit}>Guardar</button>}
                        <button className="btn btn-outline-primary m-left-5" data-dismiss="modal" onClick={onCancelEdit}>Salir</button>
                    </div>
                )}
            />}

            {removingId && 
                <MessageModal
                    title={"Confirmación"}
                    message={"¿Está seguro de borrar el registro?"}
                    onDismiss={() => setRemovingId(null)}
                    onConfirm={() => confirmRemoveId(removingId)}
                />
            }
        </section>
    )
}

export default ConvenioDefinicionesView
