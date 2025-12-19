import { useRef, useState } from "react"
import { Modal, TableCustom } from "../../../../../components/common"
import { useEffect } from "react"

const AddModal = ({ colecciones, show, onCancel, onAccept }) => {
    const [coleccionIndex, setColeccionIndex] = useState(-1)
    const [currentCampos, setCurrentCampos] = useState([])

    const tableRef = useRef(null)

    useEffect(() => {
        if (coleccionIndex === -1 || colecciones[coleccionIndex] === undefined)
            setCurrentCampos([])
        else setCurrentCampos(colecciones[coleccionIndex].coleccionesCampo.map(item => ({
            ...item,
            selected: false,
        })))
    }, [coleccionIndex, colecciones])

    const onColeccionChange = (id) => {
        setColeccionIndex(id)
        tableRef.current.manualReset()
    }

    const onItemsSelected = (items) => {
        const newCampos = [...currentCampos]
        items.forEach(item => {
            for (let i = 0; i < newCampos.length; i++) {
                if (newCampos[i].id === item.id) {
                    newCampos[i].selected = item.selected
                    break
                }
            }
        })
        setCurrentCampos(newCampos)
    }

    return <Modal
        show={show}
        title='Colección'
        header={<div/>}
        body={(
            <div>
                <div className='row form-basic'>
                    <div className="col-12">
                        <label htmlFor="coleccion" className="form-label">Colección</label>
                        <select
                            name='coleccion'
                            className={`input-lista form-control`}
                            value={coleccionIndex}
                            onChange={({ target }) => onColeccionChange(target.value)}
                        >
                            <option value={-1}></option>
                            {colecciones.map((item, index) => (
                                <option value={index} key={item.nombre}>
                                    {item.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <TableCustom
                        className={'TableCustomBase'}
                        data={currentCampos}
                        columns={[
                            { Header: 'Código', accessor: 'codigo', width: '45%', },
                            { Header: 'Nombre', accessor: 'nombre', width: '45%', },
                        ]}
                        ref={tableRef}
                        onItemsSelected={onItemsSelected}
                        useSelectedField={true}
                        showDownloadCSV={false}
                        showFilterGlobal={false}
                        showPagination={false}
                        showPageSize={false}
                    />
                </div>
            </div>
        )}
        footer={<>
            <button
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={() => onAccept(currentCampos.filter(x => x.selected))}
            >
                Aceptar
            </button>
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={onCancel}>Cancelar</button>
        </>}
    />
}

export default AddModal
