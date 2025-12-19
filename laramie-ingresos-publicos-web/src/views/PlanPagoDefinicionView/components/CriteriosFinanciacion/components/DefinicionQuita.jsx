import { useMemo, useState } from 'react'

import { InputNumber, TableCustom } from "../../../../../components/common"
import { ALERT_TYPE } from '../../../../../consts/alertType';
import { buildCellAVMR } from "../../../utils"
import ShowToastMessage from '../../../../../utils/toast';
import { OPERATION_MODE } from '../../../../../consts/operationMode';

const DefinicionQuita = ({ data, setData, params, setPendingChange }) => {
    const [edittingQuita, setEdittingQuita] = useState()
    const [mode, setMode] = useState()

    const filteredData = useMemo(() => !data ? [] : data.filter(x => x.state !== 'r'), [data])

    const onAdd = (quita) => {
        setEdittingQuita({
            id: -Date.now(),
            idPlanPagoDefinicion: parseInt(params.id),
            cuotaDesde: 0,
            cuotaHasta: 0,
            porcentajeQuitaAportes: 0,
            porcentajeQuitaHonorarios: 0,
            porcentajeQuitaMultaInfracciones: 0,
            porcentajeQuitaRecargos: 0,
            state: 'a',
        })
        setMode('add')
    }

    const onView = (quita) => {
        setEdittingQuita(quita)
        setMode('view')
    }

    const onModify = (quita) => {
        setEdittingQuita(quita)
        setMode('modify')
    }

    const onRemove = (quita) => {
        setData(data.map(x => x.id === quita.id ? {...x, state: 'r'} : x))
    }

    const onClickModalAccept = () => {
        if (
            edittingQuita.cuotaDesde <= 0 ||
            edittingQuita.cuotaHasta <= 0 ||
            (edittingQuita.porcentajeQuitaRecargos <= 0 &&
            edittingQuita.porcentajeQuitaMultaInfracciones <= 0 &&
            edittingQuita.porcentajeQuitaHonorarios <= 0 &&
            edittingQuita.porcentajeQuitaAportes <= 0)
        ) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Existen campos incompletos')
            return
        }

        if (mode === 'add') {
            setData([...data, edittingQuita])
        }

        else if (mode === 'modify') {
            setData(data.map(x => x.id === edittingQuita.id ? {...edittingQuita, state: edittingQuita.state === 'a' ? 'a' : 'm',} : x))
        }

        setMode(null)  

        setPendingChange(true)
    }

    const onClickModalCancel = () => {
        setEdittingQuita(null)
        setMode(null)
    }
    
    return (
        <div className="col-md-6">
            <div className="col-12 m-top-15">
                <label className="label-subtitle">Quita</label>
            </div>

            <TableCustom
                showFilterGlobal={false}
                showPagination={false}
                className='TableCustomBase'
                columns={[
                    { Header: 'Cuota desde', accessor: 'cuotaDesde', width: '30%' },
                    { Header: 'Cuota hasta', accessor: 'cuotaHasta', width: '30%' },
                    { Header: 'Porcentaje', accessor: 'porcentajeQuitaRecargos', width: '30%' },
                    buildCellAVMR({ onAdd, onView, onModify, onRemove, readOnly: params.mode === OPERATION_MODE.VIEW }),
                ]}
                data={filteredData}
            />
    
            {!!mode && (
                <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content animated fadeIn">
                            <div className="modal-header">
                                <h2 className="modal-title">Quita</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="cuotaDesde" className="form-label">Cuota desde</label>
                                        <InputNumber
                                            name="cuotaDesde"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingQuita.cuotaDesde}
                                            onChange={({ target }) => setEdittingQuita(prev => ({...prev, cuotaDesde: target.value}))}
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
                                            value={edittingQuita.cuotaHasta}
                                            onChange={({ target }) => setEdittingQuita(prev => ({...prev, cuotaHasta: target.value}))}
                                            precision={0}
                                            disabled={mode === 'view'}
                                        />
                                    </div>

                                    <div className='m-top-10'/>

                                    <div className="col-12 col-md-6">
                                        <label htmlFor="porcentajeQuitaRecargos" className="form-label">% Quita de recargos</label>
                                        <InputNumber
                                            name="porcentajeQuitaRecargos"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingQuita.porcentajeQuitaRecargos}
                                            onChange={({ target }) => setEdittingQuita(prev => ({...prev, porcentajeQuitaRecargos: target.value}))}
                                            precision={2}
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="porcentajeQuitaMultaInfracciones" className="form-label">% Quita de multas e infracciones</label>
                                        <InputNumber
                                            name="porcentajeQuitaMultaInfracciones"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingQuita.porcentajeQuitaMultaInfracciones}
                                            onChange={({ target }) => setEdittingQuita(prev => ({...prev, porcentajeQuitaMultaInfracciones: target.value}))}
                                            precision={2}
                                            disabled={mode === 'view'}
                                        />
                                    </div>

                                    <div className='m-top-10'/>

                                    <div className="col-12 col-md-6">
                                        <label htmlFor="porcentajeQuitaHonorarios" className="form-label">% Quita de aportes</label>
                                        <InputNumber
                                            name="porcentajeQuitaHonorarios"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingQuita.porcentajeQuitaHonorarios}
                                            onChange={({ target }) => setEdittingQuita(prev => ({...prev, porcentajeQuitaHonorarios: target.value}))}
                                            precision={2}
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="porcentajeQuitaAportes" className="form-label">% Quita de honorarios</label>
                                        <InputNumber
                                            name="porcentajeQuitaAportes"
                                            placeholder=""
                                            className="form-control"
                                            value={edittingQuita.porcentajeQuitaAportes}
                                            onChange={({ target }) => setEdittingQuita(prev => ({...prev, porcentajeQuitaAportes: target.value}))}
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

export default DefinicionQuita
