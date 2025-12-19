import { useState } from "react"
import { Modal, TableCustom } from "../../../../../components/common"

const AddFiltroModal = ({ filtros, onConfirm, onCancel }) => {
    const [items, setItems] = useState(filtros)

    const onItemsSelected = (selected) => {
        const newItems = [...items]
        selected.forEach(x => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === x.id) {
                    newItems[i].selected = x.selected
                    break
                }
            }
        })
        setItems(newItems)
    }

    const onClickAccept = () => {
        onConfirm(items.filter(x => x.selected))
    }

    return (
        <Modal
            show
            title="Filtros disponibles"
            body={
                <div className="row">
                    <TableCustom
                        className='TableCustomBase'
                        columns={[
                            { Header: 'Nombre', accessor: 'nombre', width: '95%', },
                        ]}
                        data={filtros}
                        useSelectedField
                        onItemsSelected={onItemsSelected}
                    />
                </div>
            }
            footer={<>
                <button className="btn btn-primary" data-dismiss="modal" onClick={onClickAccept}>
                    Aceptar
                </button>
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={onCancel}>
                    Salir
                </button>
            </>}
        />
    )
}

export default AddFiltroModal
