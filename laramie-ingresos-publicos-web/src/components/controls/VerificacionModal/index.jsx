import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { object, func, bool, string } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { DatePickerCustom, InputLista } from '../../common';
import DataTaggerFormRedux from '../DataTaggerFormRedux';


const VerificacionModal = (props) => {

    const entityInit = {
        id: 0,
        idInhumado: 0,
        fecha: null,
        motivoVerificacion: '',
        idTipoDocumentoVerificador: 0,
        numeroDocumentoVerificador: '',
        apellidoVerificador: '',
        nombreVerificador: '',
        idResultadoVerificacion: 0 
      };

    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        showInfo: false,
    });

    const mount = () => {
        setState(prevState => {
          return {...prevState, entity: props.data.entity };
        });
        formSet({
          fecha: props.data.entity.fecha,
          motivoVerificacion: props.data.entity.motivoVerificacion,
          idTipoDocumentoVerificador: props.data.entity.idTipoDocumentoVerificador,
          numeroDocumentoVerificador: props.data.entity.numeroDocumentoVerificador,
          apellidoVerificador: props.data.entity.apellidoVerificador,
          nombreVerificador: props.data.entity.nombreVerificador,
          idResultadoVerificacion: props.data.entity.idResultadoVerificacion  
        });
    }
    useEffect(mount, [props.data.entity]);
    
    const [ formValues, formHandle, , formSet ] = useForm({
        fecha: null,
        motivoVerificacion: '',
        idTipoDocumentoVerificador: 0,
        numeroDocumentoVerificador: '',
        apellidoVerificador: '',
        nombreVerificador: '',
        idResultadoVerificacion: 0 
    });    

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {

            let row = CloneObject(state.entity);
            row.fecha = formValues.fecha;
            row.motivoVerificacion = formValues.motivoVerificacion;
            row.idTipoDocumentoVerificador = parseInt(formValues.idTipoDocumentoVerificador);
            row.numeroDocumentoVerificador = formValues.numeroDocumentoVerificador;
            row.apellidoVerificador = formValues.apellidoVerificador;
            row.nombreVerificador = formValues.nombreVerificador;
            row.idResultadoVerificacion = parseInt(formValues.idResultadoVerificacion);   

            props.onConfirm(row);
        };
    };

    //funciones
    function isFormValid() {

        if (formValues.fecha == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha');
            return false;
        }   
        if (formValues.idResultadoVerificacion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Resultado');
            return false;
        }        
        if (formValues.motivoVerificacion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Motivo de verificación');
            return false;
        }
        if (formValues.idTipoDocumentoVerificador <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de documento del verificador');
            return false;
        }
        if (formValues.numeroDocumentoVerificador.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número de documento del verificador');
            return false;
        }
        if (formValues.apellidoVerificador.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Apellido del verificador');
            return false;
        }
        if (formValues.nombreVerificador.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Nombre del verificador');
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
        <div className="modal-dialog modal-dialog-size">
        <div className="modal-content animated fadeIn">
            <div className="modal-header">
                <h2 className="modal-title">Verificación: {(state.entity.id > 0) ? `N° ${state.entity.id}` : "Nueva"}</h2>
            </div>
            <div className="modal-body">
                <div className="row">

                    <div className="mb-3 col-12 col-md-3 col-xl-3">
                        <label htmlFor="fecha" className="form-label">Fecha</label>
                        <DatePickerCustom
                            name="fecha"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fecha }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-12 col-md-9 col-xl-9">
                        <label htmlFor="idResultadoVerificacion" className="form-label">Resultado</label>
                        <InputLista
                            name="idResultadoVerificacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idResultadoVerificacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="ResultadoVerificacion"
                        />
                    </div>
                    
                    <div className="mb-3 col-12">
                        <label htmlFor="motivoVerificacion" className="form-label">Motivo de verificación</label>
                        <input
                            name="motivoVerificacion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.motivoVerificacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                </div>

                <hr className="solid m-bottom-10"></hr>

                <div className='row'>

                    <div className="mb-3">
                            <h2 className="modal-title">Verificador:</h2>
                    </div>

                    <div className="mb-3 col-12 col-md-6 col-xl-3">
                        <label htmlFor="idTipoDocumentoVerificador" className="form-label">Tipo de documento</label>
                        <InputLista
                            name="idTipoDocumentoVerificador"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoDocumentoVerificador }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoDocumento"
                        />
                    </div>

                    <div className="mb-3 col-12 col-md-6 col-xl-3">
                        <label htmlFor="numeroDocumentoVerificador" className="form-label">Número de documento</label>
                        <input
                            name="numeroDocumentoVerificador"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numeroDocumentoVerificador }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-12 col-md-6 col-xl-3">
                        <label htmlFor="apellidoVerificador" className="form-label">Apellido</label>
                        <input
                            name="apellidoVerificador"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.apellidoVerificador }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 col-12 col-md-6 col-xl-3">
                        <label htmlFor="nombreVerificador" className="form-label">Nombre</label>
                        <input
                            name="nombreVerificador"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nombreVerificador }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
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
                                title="Información adicional de Verificacion"
                                processKey={props.processKey}
                                entidad="Verificacion"
                                idEntidad={state.entity.id}
                                disabled={props.disabled}
                            />
                        </div>
                        }
                    </div>


                </div>

            </div>



            <div className="modal-footer">
                {!props.disabled &&
                <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() } >Aceptar</button>
                }
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
            </div>

            </div>
        </div>
    </div>

    </>
    );
}
    

VerificacionModal.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};
  
VerificacionModal.defaultProps = {
    disabled: false
};

export default VerificacionModal;
