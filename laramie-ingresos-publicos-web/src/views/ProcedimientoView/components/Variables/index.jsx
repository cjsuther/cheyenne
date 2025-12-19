import { useMemo, useState } from "react"
import { AccordionIcon, InputLista, MessageModal, Modal, TableCustom } from "../../../../components/common"
import { ALERT_TYPE } from "../../../../consts/alertType"
import ShowToastMessage from "../../../../utils/toast"
import { OPERATION_MODE } from "../../../../consts/operationMode"
import AddModal from "./components/AddModal"

const Variables = ({ params, data, setData, colecciones, coleccionesCampo, open, toggle, setPendingChange }) => {
    const [editItem, setEditItem] = useState()
    const [editMode, setEditMode] = useState()
    const [removingId, setRemovingId] = useState(null)

    const coleccionCampoCells = useMemo(() => {
        const result = {}
        coleccionesCampo.forEach(campo => {
            const coleccion = colecciones.find(x => x.id === campo.idColeccion)
            result[campo.id] = `${coleccion.nombre} / ${campo.nombre}`
        })
        return result
    }, [colecciones, coleccionesCampo])

    //#region events
    const onAdd = (item) => {
        setEditMode('add')
    }

    const onView = (item) => {
        setEditItem(item)
        setEditMode('view')
    }

    const onModify = (item) => {
        setEditItem({ ...item, state: item.state === 'a' ? 'a' : 'm', })
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

    const onColeccionesSelected = (items) => {
        setData([...data, ...items.map((item, index) => ({
            id: -Date.now() + index,
            idProcedimiento: parseInt(params.id),
            idColeccionCampo: item.id,
            idTipoVariable: item.idTipoVariable,
            codigo: item.codigo,
            nombre: item.nombre,
            tipoDato: item.tipoDato,
            orden: data.length + index + 1,
            state: 'a',
        }))])
        setEditMode(null)

        if (items.length > 0)
            setPendingChange(true)
    }
    //#endregion

    const filteredData = useMemo(() => {
        return data.filter(x => x.state !== 'r')
    }, [data])

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
                        <h3 className={open ? 'active' : ''}>Variables</h3>
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
                        {
                            Header: 'Colección / Campo',
                            accessor: 'idColeccionCampo',
                            Cell: ({ value }) => coleccionCampoCells[value],
                            width: '30%',
                        },
                        { Header: 'Código', accessor: 'codigo', width: '30%', },
                        { Header: 'Nombre', accessor: 'nombre', width: '30%', },
                        cellAVMR,
                    ]}
                />
                </div>
            </div>
        ))}

        {['view', 'modify'].includes(editMode) && (
            <Modal
                show={true}
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
                                    onChange={({ target }) => {
                                        if (!/[^a-zA-Z0-9_]/g.test(target.value))
                                            setEditItem(prev => ({...prev, codigo: target.value}))
                                    }}
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
                                <label htmlFor="idTipoVariable" className="form-label">Tipo de Variable</label>
                                <InputLista
                                    name="idTipoVariable"
                                    placeholder=""
                                    className="form-control"
                                    value={editItem.idTipoVariable}
                                    lista="TipoVariable"
                                    disabled
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="tipoDato" className="form-label">Tipo de Dato</label>
                                <input
                                    name="descripcion"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={editItem.tipoDato}
                                    disabled
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label htmlFor="idEstadoProcedimiento" className="form-label">Colección/Campo</label>
                                <input
                                    name="idColeccionCampo"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={coleccionCampoCells[editItem.idColeccionCampo]}
                                    disabled
                                />
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

        {editMode === 'add' && <AddModal
            colecciones={colecciones}
            show={editMode === 'add'}
            onCancel={() => setEditMode(null)}
            onAccept={onColeccionesSelected}
        />}

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

export default Variables
