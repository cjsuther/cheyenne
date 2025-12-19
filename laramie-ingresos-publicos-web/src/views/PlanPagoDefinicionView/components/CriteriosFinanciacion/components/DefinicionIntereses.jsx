import { useMemo, useState } from 'react'

import { InputNumber, TableCustom } from "../../../../../components/common"
import { ALERT_TYPE } from '../../../../../consts/alertType';
import { buildCellAVMR } from "../../../utils"
import ShowToastMessage from '../../../../../utils/toast';
import { OPERATION_MODE } from '../../../../../consts/operationMode';

const DefinicionIntereses = ({ data, setData, params, setPendingChange }) => {
    const [edittingInteres, setEdittingInteres] = useState()
    const [mode, setMode] = useState()

    const filteredData = useMemo(() => !data ? [] : data.filter(x => x.state !== 'r'), [data])

    const onAdd = (interes) => {
        setEdittingInteres({
            id: -Date.now(),
            idPlanPagoDefinicion: parseInt(params.id),
            cuotaDesde: 0,
            cuotaHasta: 0,
            porcentajeInteres: 0,
            state: 'a',
        })
        setMode('add')
    }

    const onView = (interes) => {
        setEdittingInteres(interes)
        setMode('view')
    }

    const onModify = (interes) => {
        setEdittingInteres(interes)
        setMode('modify')
    }

    const onRemove = (interes) => {
        setData(data.map(x => x.id === interes.id ? {...x, state: 'r'} : x))
    }

    const onClickModalAccept = () => {
        if (!(edittingInteres.cuotaDesde > 0 && edittingInteres.cuotaHasta > 0)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Existen campos incompletos')
            return
        }

        if (mode === 'add') {
            setData([...data, edittingInteres])
        }

        else if (mode === 'modify') {
            setData(data.map(x => x.id === edittingInteres.id ? {...edittingInteres, state: edittingInteres.state === 'a' ? 'a' : 'm',} : x))
        }

        setMode(null)  

        setPendingChange(true)
    }

    const onClickModalCancel = () => {
        setEdittingInteres(null)
        setMode(null)
    }
    
    return (
        <div className="col-md-6">
            <div className="col-12 m-top-15">
                <label className="label-subtitle">Interés</label>
            </div>

            <TableCustom
                showFilterGlobal={false}
                showPagination={false}
                className='TableCustomBase'
                columns={[
                    { Header: 'Cuota desde', accessor: 'cuotaDesde', width: '30%' },
                    { Header: 'Cuota hasta', accessor: 'cuotaHasta', width: '30%' },
                    { Header: 'Porcentaje', accessor: 'porcentajeInteres', width: '30%' },
                    buildCellAVMR({ onAdd, onView, onModify, onRemove, readOnly: params.mode === OPERATION_MODE.VIEW }),
                ]}
                data={filteredData}
            />
    
            {!!mode && (
                <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content animated fadeIn">
                            <div className="modal-header">
                                <h2 className="modal-title">Interés</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="cuotaDesde" className="form-label">Cuota desde</label>
                                        <InputNumber
                                            name="cuotaDesde"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingInteres.cuotaDesde}
                                            onChange={({ target }) => setEdittingInteres(prev => ({...prev, cuotaDesde: target.value}))}
                                            precision={0}
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="cuotaHasta" className="form-label">Cuota hasta</label>
                                        <InputNumber
                                            name="cuotaHasta"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingInteres.cuotaHasta}
                                            onChange={({ target }) => setEdittingInteres(prev => ({...prev, cuotaHasta: target.value}))}
                                            precision={0}
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 m-top-10">
                                        <label htmlFor="procentajeInteres" className="form-label">Porcentaje interés</label>
                                        <InputNumber
                                            name="porcentajeInteres"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingInteres.porcentajeInteres}
                                            onChange={({ target }) => setEdittingInteres(prev => ({...prev, porcentajeInteres: target.value}))}
                                            precision={2}
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {mode !== 'view' && <button className="btn btn-primary" data-dismiss="modal" onClick={onClickModalAccept}>Aceptar</button>}
                                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={onClickModalCancel}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DefinicionIntereses
