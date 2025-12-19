import { useState } from "react"
import { Accordion, InputNumber, InputSubTasa, InputTasa, Modal, TableCustom } from "../../../components/common"
import { useForm } from "../../../components/hooks/useForm"
import { ALERT_TYPE } from "../../../consts/alertType"
import { OPERATION_MODE } from "../../../consts/operationMode"
import ShowToastMessage from "../../../utils/toast"
import { useEntidad } from "../../../components/hooks/useEntidad"
import { getFormatNumber } from "../../../utils/convert"

const Conceptos = ({ params, conceptos, onAddConcepto, onModifyConcepto, onRemoveConcepto }) => {
    const [editItem, setEditItem] = useState(null)
    const [editMode, setEditMode] = useState(null)

    const [, getEntidad, entidadesReady] = useEntidad({
        entidades: ['Tasa', 'SubTasa'],
        onLoaded: (entidades, isSuccess, error) => {
          if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        }
    })

    const getCell = (entidad, value) => {
        if (!entidadesReady) return ''
        else {
            const row = getEntidad(entidad, value)
            if (row) {
                const { codigo, descripcion } = getEntidad(entidad, value)
                return `${codigo} - ${descripcion}`
            }
            else return ""
        }
    }

    const onClickConfirm = () => {
        if (editItem.valor <= 0)
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el valor')
        if (editItem.idTasa <= 0)
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar la tasa')
        if (editItem.idSubTasa <= 0)
            return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar la sub-tasa')
        
        if (editMode === OPERATION_MODE.NEW) onAddConcepto(editItem)
        else onModifyConcepto(editItem)

        setEditItem(null)
        setEditMode(null)
    }

    const avmr = {
        onAdd: () => { // NOTE: webapi explota si se manda un parámetro inválido
            setEditMode(OPERATION_MODE.NEW)
            setEditItem({
                id: -new Date(),
                idReciboEspecial: parseInt(params.id),
                idTasa: 0,
                idSubTasa: 0,
                valor: 0,
                state: 'a',
            })
        },
        onModify: (item) => {
            setEditMode(OPERATION_MODE.EDIT)
            setEditItem({...item, state: item.state === 'a' ? 'a' : 'm'})
        },
        onRemove: (item) => {
            onRemoveConcepto(item)
        }
    }

    return <>
        
        <Accordion title="Conceptos" startOpen>
            <TableCustom
                className="TableCustomBase"
                data={conceptos}
                avmr={params.mode !== OPERATION_MODE.VIEW ? avmr : undefined}
                columns={[
                    { Header: 'Tasa', accessor: 'idTasa', Cell: ({ value }) => getCell('Tasa', value), width: '40%' },
                    { Header: 'Sub Tasa', accessor: 'idSubTasa', Cell: ({ value }) => getCell('SubTasa', value), width: '40%' },
                    { Header: 'Valor', accessor: 'valor', Cell: ({ value }) => getFormatNumber(value, 2), width: '20%', alignCell: 'right' },
                ]}
            />
        </Accordion>

        {editItem !== null && <Modal
            show
            header={<h2 className="modal-title">Definición de Concepto</h2>}
            body={(
                <div className='row form-basic'>
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="idTasa" className="form-label">Tasa</label>
                        <InputTasa
                            name="idTasa"
                            placeholder=""
                            className="form-control"
                            value={editItem.idTasa}
                            onChange={({ target }) => setEditItem(x => ({...x, idTasa: target.value}))}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="idSubTasa" className="form-label">Sub Tasa</label>
                        <InputSubTasa
                            name="idSubTasa"
                            placeholder=""
                            className="form-control"
                            value={editItem.idSubTasa}
                            onChange={({ target }) => setEditItem(x => ({...x, idSubTasa: target.value}))}
                            idTasa={editItem.idTasa}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="valor" className="form-label">Valor</label>
                        <InputNumber
                            type="number"
                            name="valor"
                            className="form-control"
                            precision={2}
                            value={editItem.valor}
                            onChange={({ target }) => setEditItem(x => ({...x, valor: target.value}))}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                </div>
            )}
            footer={(
                <div>
                    {params.mode !== OPERATION_MODE.VIEW && (
                        <button
                            className="btn btn-primary"
                            data-dismiss="modal"
                            onClick={onClickConfirm}
                        >
                            Guardar
                        </button>
                    )}
                    <button
                        className="btn btn-outline-primary m-left-5"
                        data-dismiss="modal"
                        onClick={() => { setEditItem(null); setEditMode(null); }}
                    >
                        Salir
                    </button>
                </div>
            )}
        />}
    </>
}

export default Conceptos
