import { useMemo, useState } from "react"
import { AccordionIcon, MessageModal, Modal, TableCustom } from "../../../components/common"
import { REQUEST_METHOD } from "../../../consts/requestMethodType"
import { APIS } from "../../../config/apis"
import ShowToastMessage from "../../../utils/toast"
import { ALERT_TYPE } from "../../../consts/alertType"
import { ServerRequest } from "../../../utils/apiweb"
import { OPERATION_MODE } from "../../../consts/operationMode"
import { GetTipoDatos } from "../../../utils/helpers"

const Parametros = ({ params, data, setData, open, toggle, setPendingChange }) => {
    const [loading, setLoading] = useState()
    const [editItem, setEditItem] = useState()
    const [editMode, setEditMode] = useState()
    const [removingId, setRemovingId] = useState(null)

    const filteredData = useMemo(() => data.filter(x => x.state !== 'r'), [data])

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

    //#region events
    const onAdd = (item) => {
        setEditItem({
            id: -Date.now(),
            idProcedimiento: parseInt(params.id),
            codigo: '',
            nombre: '',
            tipoDato: '',
            orden: 0,
            state: 'a',
        })
        setEditMode('add')
    }

    const onView = (item) => {
        setEditItem(item)
        setEditMode('view')
    }

    const onModify = (item) => {
        setEditItem({ ...item, state: item.state === 'a' ? 'a' : 'm' })
        setEditMode('modify')
    }

    const onModalExit = () => {
        setEditItem(null)
        setEditMode(null)
    }

    const onModalConfirm = () => {
        const reject = (message) => {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, message)
            return
        }

        if (editItem.codigo.length < 1) return reject('Debe cargar el campo Código')
        if (editItem.nombre.length < 1) return reject('Debe cargar el campo Nombre')

        if (editMode === 'modify') {
            setData(data.map(x => x.id === editItem.id ? editItem : x))
        }
        if (editMode === 'add') {
            setData([...data, editItem])
        }
        setPendingChange(true)
        onModalExit()
    }

    const onConfirmRemoveId = (id) => {
        const item = data.find(x => x.id === id)
        if (item.state === 'a') setData(data.filter(x => x.id !== id))
        else setData(data.map(x => x.id !== id ? x : {...x, state: 'r'}))
        setRemovingId(null)
        setPendingChange(true)
    }
    //#endregion

    const cellAVMR = {
        id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true,
        Header: (props) => (
            <div className='action'>
                {params.mode !== OPERATION_MODE.VIEW && (
                    <div onClick={onAdd} className="link">
                        <i className="fa fa-plus" title="nuevo"></i>
                    </div>
                )}
            </div>
        ),
        Cell: (props) =>  (
            <div className='action'>
                <div onClick={() => onView(props.row.original)} className="link">
                    <i className="fa fa-search" title="ver"></i>
                </div>
                {params.mode !== OPERATION_MODE.VIEW && <>
                    <div onClick={() => onModify(props.row.original)} className="link">
                        <i className="fa fa-pen" title="modificar"></i>
                    </div>
                    <div onClick={() => setRemovingId(props.row.original.id)} className="link">
                        <i className="fa fa-trash" title="borrar"></i>
                    </div>
                </>}
            </div>
        ),
    }

    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon open={open} />
                        <h3 className={open ? 'active' : ''}>Parámetros</h3>
                    </div>
                </div>
            </div>
        </div>
        {(open && (
            <div className='accordion-body'>
                <div className='row form-basic'>
                    <TableCustom
                        className={'TableCustomBase'}
                        data={filteredData}
                        columns={[
                            { Header: 'Código', accessor: 'codigo', width: '45%', },
                            { Header: 'Nombre', accessor: 'nombre', width: '45%', },
                            cellAVMR,
                        ]}
                    />
                </div>
            </div>
        ))}

        {editItem && (
            <Modal
                show={!!editItem}
                title='Parámetro'
                header={<div/>}
                body={(
                    <div>
                        <div className='row form-basic'>
                            <div className="col-12 col-md-6">
                                <label htmlFor="nombre" className="form-label">Código</label>
                                <input
                                    name="nombre"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={editItem.codigo}
                                    onChange={({ target }) => setEditItem(prev => ({...prev, codigo: target.value}))}
                                    disabled={editMode === 'view'}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="descripcion" className="form-label">Nombre</label>
                                <input
                                    name="descripcion"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={editItem.nombre}
                                    onChange={({ target }) => setEditItem(prev => ({...prev, nombre: target.value}))}
                                    disabled={editMode === 'view'}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="tipoDato" className="form-label">Tipo de dato</label>
                                <select
                                    name="tipoDato"
                                    placeholder=""
                                    className="form-control"
                                    value={editItem.tipoDato}
                                    onChange={({ target }) => setEditItem(prev => ({...prev, tipoDato: target.value}))}
                                    disabled={editMode === 'view'}
                                >
                                    {GetTipoDatos(true).map((item, index) =>
                                        <option value={item.key} key={index}>{item.value}</option>
                                    )}
                                </select>
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="idEstadoProcedimiento" className="form-label">Orden</label>
                                <input
                                    name="orden"
                                    type="number"
                                    placeholder=""
                                    className="form-control"
                                    value={editItem.orden}
                                    onChange={({ target }) => setEditItem(prev => ({...prev, orden: parseInt(target.value)}))}
                                    disabled={editMode === 'view'}
                                />
                            </div>
                        </div>
                    </div>
                )}
                footer={<>
                    {editMode !== 'view' && <button className="btn btn-primary" data-dismiss="modal"  onClick={onModalConfirm}>Aceptar</button>}
                    <button className="btn btn-outline-primary" data-dismiss="modal" onClick={onModalExit}>Cancelar</button>
                </>}
            />
        )}

        {removingId !== null && 
            <MessageModal
                title={"Confirmación"}
                message={"¿Está seguro de borrar el registro?"}
                onDismiss={() => setRemovingId(null)}
                onConfirm={() => onConfirmRemoveId(removingId)}
            />
        }
    </>
}

export default Parametros
