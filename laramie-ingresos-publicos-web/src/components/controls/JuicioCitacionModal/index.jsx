import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { CloneObject } from '../../../utils/helpers';
import { DatePickerCustom, InputLista  } from '../../common';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';


const JuicioCitacionModal = (props) => {

    const entityInit = {
        id: 0,
        idApremio: 0,
        fechaCitacion: null,
        idTipoCitacion: 0,
        observacion: ''
    };
    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        showInfo: false,
    });    

    const mount = () => {
        setState(prevState => {
            return {...prevState, entity: props.data.entity}
        });
        formSet({          
            idApremio: props.data.entity.idApremio,
            fechaCitacion: props.data.entity.fechaCitacion,
            idTipoCitacion: props.data.entity.idTipoCitacion,
            observacion: props.data.entity.observacion
        });
    }
    useEffect(mount, [props.data.entity]);  

    const [ formValues, formHandle, , formSet ] = useForm({
        idApremio: 0,
        fechaCitacion: null,
        idTipoCitacion: 0,
        observacion: ''
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);

            row.idApremio = parseInt(formValues.idApremio);
            row.fechaCitacion = formValues.fechaCitacion;
            row.idTipoCitacion = parseInt(formValues.idTipoCitacion);
            row.observacion = formValues.observacion;

            props.onConfirm(row);
        };
    };

    //funciones
    function isFormValid() {

        if (formValues.fechaCitacion == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha');
            return false;
        }
        if (formValues.idTipoCitacion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de citación');
            return false;
        }

        return true;
    }

    function ToggleAccordionInfo() {
        setState(prevState => {
            return {...prevState, showInfo: !prevState.showInfo};
        });
    }

    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i> 


  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-lg">
            <div className="modal-content animated fadeIn">
            <div className="modal-header">
                <h2 className="modal-title">Juicio citación: {(state.entity.id > 0) ? `N° ${state.entity.id}` : "Nuevo"}</h2>
            </div>
            <div className="modal-body">

                <div className="row">
                    <div className="col-12 col-md-6">
                        <label htmlFor="fechaCitacion" className="form-label">Fecha</label>
                        <DatePickerCustom
                            name="fechaCitacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaCitacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="idTipoCitacion" className="form-label">Tipo de citación</label>
                        <InputLista
                            name="idTipoCitacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoCitacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoCitacion"
                        />
                    </div>
                    <div className="mb-3 col-12">
                        <label htmlFor="observacion" className="form-label">Observaciones</label>
                        <input
                            name="observacion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.observacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                </div>

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordionInfo()}>
                                <div className='accordion-header-title'>
                                    {(state.showInfo) ? accordionOpen : accordionClose}
                                    <h3 className={state.showInfo ? 'active' : ''}>Información adicional</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {state.showInfo &&
                    <div className='accordion-body'>
                        <DataTaggerFormRedux
                            title="Información adicional de Juicio Citacion"
                            processKey={props.processKey}
                            entidad="JuicioCitacion"
                            idEntidad={state.entity.id}
                            disabled={props.disabled}
                        />
                    </div>
                    }
                </div>

            </div>
            <div className="modal-footer">
                <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
            </div>
            </div>
        </div>
    </div>

    </>
  );
}


export default JuicioCitacionModal;