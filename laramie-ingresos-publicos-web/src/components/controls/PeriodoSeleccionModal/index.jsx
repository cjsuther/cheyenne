import React, { useState, useMemo } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { object, func } from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { MODE_SELECTION } from "../../../consts/modeSelection";
import { GetMeses } from '../../../utils/helpers';

const PeriodoSeleccionModal = (props) => {

    const [modeSeleccion, setModeSeleccion] = useState(MODE_SELECTION.PERIODO);

    const [ formValues, formHandle, , ] = useForm({
        periodo: props.data.periodoHasta,
        periodoDesde: props.data.periodoDesde,
        periodoHasta: props.data.periodoHasta,
        cuotaDesde: '01',
        cuotaHasta: '12',
    });

    const periodos = useMemo(() => {
        let periodos = [];
        for (let periodo=parseInt(props.data.periodoDesde); periodo <= parseInt(props.data.periodoHasta); periodo++) {
            periodos.push({key: periodo, value: periodo});
        }
        return periodos;
    }, [props.data]);

    //handles
    const handleClickAceptar = () => {
        const result = (modeSeleccion === MODE_SELECTION.PERIODO) ? {
            modeSeleccion: MODE_SELECTION.PERIODO,
            periodo: formValues.periodo.toString()
        } : {
            modeSeleccion: MODE_SELECTION.RANGO_PERIODO_CUOTA,
            periodoDesde: formValues.periodoDesde.toString() + formValues.cuotaDesde.toString().padStart(2,'0'),
            periodoHasta: formValues.periodoHasta.toString() + formValues.cuotaHasta.toString().padStart(2,'0')
        };
        props.onConfirm(result);
    };

    const handleClickCancelar = () => {
        props.onDismiss();
    }


    return (
        <>

        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog">
            <div className="modal-content animated fadeIn">
            <div className="modal-header">
            <h2 className="modal-title">Determine un criterio de selección</h2>
            </div>
            <div className="modal-body">

                <Tabs
                    id="tabs-seleccion"
                    activeKey={modeSeleccion}
                    className="m-top-20"
                    onSelect={(tab) => setModeSeleccion(tab)}
                >

                    <Tab eventKey={MODE_SELECTION.PERIODO} title="Por Periodo">
                        <div className='tab-panel'>
                            <div className="row">
                                <div className="mb-3 col-6">
                                    <label htmlFor="periodo" className="form-label">Periodo</label>
                                    <select
                                        name="periodo"
                                        className="form-control"
                                        value={ formValues.periodo }
                                        onChange={ formHandle }
                                    >
                                    {periodos.map((item, index) =>
                                    <option value={item.key} key={index}>{item.value}</option>
                                    )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey={MODE_SELECTION.RANGO_PERIODO_CUOTA} title="Por rango Periodo-Cuota">
                        <div className='tab-panel'>
                            <div className="row">
                                <div className="mb-3 col-6">
                                    <label htmlFor="periodoDesde" className="form-label">Periodo desde</label>
                                    <select
                                        name="periodoDesde"
                                        className="form-control"
                                        value={ formValues.periodoDesde }
                                        onChange={ formHandle }
                                    >
                                    {periodos.map((item, index) =>
                                    <option value={item.key} key={index}>{item.value}</option>
                                    )}
                                    </select>
                                </div>
                                <div className="mb-3 col-6">
                                    <label htmlFor="cuotaDesde" className="form-label">Cuota desde</label>
                                    <select
                                        name="cuotaDesde"
                                        className="form-control"
                                        value={ formValues.cuotaDesde }
                                        onChange={ formHandle }
                                    >
                                    {GetMeses().map((item, index) =>
                                    <option value={item.key} key={index}>{item.cuota}</option>
                                    )}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="mb-3 col-6">
                                    <label htmlFor="periodoHasta" className="form-label">Periodo hasta</label>
                                    <select
                                        name="periodoHasta"
                                        className="form-control"
                                        value={ formValues.periodoHasta }
                                        onChange={ formHandle }
                                    >
                                    {periodos.map((item, index) =>
                                    <option value={item.key} key={index}>{item.value}</option>
                                    )}
                                    </select>
                                </div>
                                <div className="mb-3 col-6">
                                    <label htmlFor="cuotaHasta" className="form-label">Cuota hasta</label>
                                    <select
                                        name="cuotaHasta"
                                        className="form-control"
                                        value={ formValues.cuotaHasta }
                                        onChange={ formHandle }
                                    >
                                    {GetMeses().map((item, index) =>
                                    <option value={item.key} key={index}>{item.cuota}</option>
                                    )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Tab>

                </Tabs>

            </div>
            <div className="modal-footer">
                <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => handleClickCancelar() }>Cancelar</button>
            </div>
            </div>
        </div>
        </div>

        </>
    );
}

PeriodoSeleccionModal.propTypes = {
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

export default PeriodoSeleccionModal;