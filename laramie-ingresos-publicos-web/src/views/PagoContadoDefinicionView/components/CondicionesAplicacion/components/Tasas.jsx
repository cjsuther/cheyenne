import { useMemo, useState } from 'react'

import { InputSubTasa, InputTasa, TableCustom } from '../../../../../components/common'
import { useEntidad } from '../../../../../components/hooks/useEntidad'
import { ALERT_TYPE } from '../../../../../consts/alertType'
import { OPERATION_MODE } from '../../../../../consts/operationMode'
import ShowToastMessage from '../../../../../utils/toast'
import { buildCellAVMR } from '../../../utils'

const Tasas = ({ tasas, setTasas, params }) => {
    const [edittingTasa, setEdittingTasa] = useState()
    const [mode, setMode] = useState()
    const data = useMemo(() => tasas.filter(x => x.state !== 'r'), [tasas])

    const [entidadesLoaded, setEntidadesLoaded] = useState(false)
    const [, getEntidad] = useEntidad({
        entidades: ['Tasa', 'SubTasa'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setEntidadesLoaded(true)
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'Tasa_SubTasa',
          timeout: 0
        }
    })

    const labels = useMemo(() => {
        const result = { }
        data.forEach(tasa => {
            const entidadTasa = getEntidad('Tasa', tasa.idTasa)
            const entidadSubTasa = getEntidad('SubTasa', tasa.idSubTasa)
            if (entidadTasa && entidadSubTasa) result[tasa.id] = {
                tasa: `${entidadTasa.codigo} - ${entidadTasa.descripcion}`,
                subTasa: `${entidadSubTasa.codigo} - ${entidadSubTasa.descripcion}`
            }
        })
        return result
    }, [data, entidadesLoaded])

    const onAdd = () => {
        setMode('add')
        setEdittingTasa({
            id: -Date.now(),
            idPagoContadoDefinicion: parseInt(params.id),
            idTasa: 0,
            idSubTasa: 0,
            state: "a",
        })
    }

    const onView = (tasa) => {
        setMode('view')
        setEdittingTasa(tasa)
    }

    const onModify = (tasa) => {
        setMode('modify')
        setEdittingTasa(tasa)
    }

    const onRemove = (tasa) => {
        setTasas(tasas.map(x => x.id === tasa.id ? {...x, state: 'r'} : x))
    }

    const onClickModalAccept = () => {
        if (edittingTasa.idTasa === 0 || edittingTasa.idSubTasa === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Existen campos incompletos')
            return
        }

        if (mode === 'add') {
            setTasas([...tasas, edittingTasa])
        }

        else if (mode === 'modify') {
            setTasas(tasas.map(x => x.id === edittingTasa.id ? {...edittingTasa, state: edittingTasa.state === 'a' ? 'a' : 'm',} : x))
        }

        setMode(null)
    }

    const onClickModalCancel = () => {
        setMode(null)
        setEdittingTasa(null)
    }

    const tableColumns = [
        { Header: 'Tasa', Cell: ({ row }) => entidadesLoaded ? labels[row.original.id].tasa : '', accessor: 'idTasa', width: '45%' },
        { Header: 'Subtasa', Cell: ({ row }) => entidadesLoaded ? labels[row.original.id].subTasa : '', accessor: 'idSubTasa', width: '45%' },
        buildCellAVMR({ onAdd, onView, onModify, onRemove, readOnly: params.mode === OPERATION_MODE.VIEW })
    ]

    return (
        <div>
            <div className="col-12 m-top-15">
                <label className="label-subtitle">Tasas</label>
            </div>

            <TableCustom
                showFilterGlobal={false}
                showPagination={false}
                className='TableCustomBase'
                columns={tableColumns}
                data={data}
            />
    
            {!!mode && (
                <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content animated fadeIn">
                            <div className="modal-header">
                                <h2 className="modal-title">Tasas</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="idTasaPlanPago" className="form-label">Tasa del plan</label>
                                        <InputTasa
                                            name="idTasaPlanPago"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingTasa.idTasa}
                                            onChange={({ target }) => setEdittingTasa(prev => ({...prev, idTasa: target.value}))}
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="idSubTasaPlanPago" className="form-label">Sub tasa del plan</label>
                                        <InputSubTasa
                                            name="idSubTasaPlanPago"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingTasa.idSubTasa}
                                            onChange={({ target }) => setEdittingTasa(prev => ({...prev, idSubTasa: target.value}))}
                                            disabled={mode === 'view'}
                                            idTasa={edittingTasa.idTasa}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {mode !== 'view' && (<button className="btn btn-primary" data-dismiss="modal" onClick={onClickModalAccept}>Aceptar</button>)}
                                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={onClickModalCancel}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Tasas
