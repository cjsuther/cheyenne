import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { object, func, bool, string } from 'prop-types';
import { CloneObject, GetMeses } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { DatePickerCustom, InputEntidad, InputNumber, InputEjercicio, InputTasa, InputSubTasa, InputCodigo } from '../../common';
import DataTaggerFormRedux from '../DataTaggerFormRedux';

const DeclaracionJuradaModal = (props) => {

    const entityInit = {
        id: 0,
		idCuenta: 0,
		idTipoTributo: 0,
		idTributo: 0,
		idTasa: 0,
		idSubTasa: 0,
		fechaPresentacionDDJJ: null,
		anioDeclaracion: '',
		mesDeclaracion: 0,
		numero: '',
		idTipoDDJJ: 0,
		valorDeclaracion: 0,
		fechaAlta: null,
		fechaBaja: null,
		resolucion: ''
    };


    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        showInfo: false
    });

    const mount = () => {
        setState(prevState => {
          return {...prevState, entity: props.data.entity };
        });

        formSet({
            idCuenta: props.data.entity.idCuenta,
            idTipoTributo: props.data.entity.idTipoTributo,
            idTributo: props.data.entity.idTributo,
            idTasa: props.data.entity.idTasa,
            idSubTasa: props.data.entity.idSubTasa,
            fechaPresentacionDDJJ: props.data.entity.fechaPresentacionDDJJ,
            anioDeclaracion: props.data.entity.anioDeclaracion,
            mesDeclaracion: props.data.entity.mesDeclaracion,
            numero: props.data.entity.numero,
            idTipoDDJJ: props.data.entity.idTipoDDJJ,
            valorDeclaracion: props.data.entity.valorDeclaracion,
            fechaAlta: props.data.entity.fechaAlta,
            fechaBaja: props.data.entity.fechaBaja,
            resolucion: props.data.entity.resolucion
        });
    }
    useEffect(mount, [props.data.entity]);
    
    const [ formValues, formHandle, , formSet ] = useForm({
		idCuenta: 0,
		idTipoTributo: 0,
		idTributo: 0,
		idTasa: 0,
		idSubTasa: 0,
		fechaPresentacionDDJJ: null,
		anioDeclaracion: '',
		mesDeclaracion: 0,
        numero: '',
		idTipoDDJJ: 0,
		valorDeclaracion: 0,
		fechaAlta: null,
		fechaBaja: null,
		resolucion: ''
    });    

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            let row = CloneObject(state.entity);
            row.idTasa = parseInt(formValues.idTasa);
            row.idSubTasa = parseInt(formValues.idSubTasa);
            row.fechaPresentacionDDJJ = formValues.fechaPresentacionDDJJ;
            row.anioDeclaracion = formValues.anioDeclaracion;
            row.mesDeclaracion = formValues.mesDeclaracion;
            row.numero = formValues.numero;
            row.idTipoDDJJ = parseInt(formValues.idTipoDDJJ);
            row.valorDeclaracion = formValues.valorDeclaracion;
            row.fechaAlta = formValues.fechaAlta;
            row.fechaBaja = formValues.fechaBaja;
            row.resolucion = formValues.resolucion;

            if (formValues.fechaAlta == null){
                row.fechaAlta = row.fechaPresentacionDDJJ
            }

            props.onConfirm(row);
        };
    };

    //funciones
    function isFormValid() {

        if (formValues.idTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tasa');
            return false;
        }
        if (formValues.idSubTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Sub Tasa');
            return false;
        }
        if (formValues.fechaPresentacionDDJJ == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Fecha de Presentacion');
            return false;
        }
        if (formValues.anioDeclaracion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Año');
            return false;
        }
        if (formValues.mesDeclaracion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Mes');
            return false;
        }
        if (formValues.numero.length <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número');
            return false;
        }
        if (formValues.idTipoDDJJ <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo DDJJ');
            return false;
        }
        if (formValues.valorDeclaracion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Valor');
            return false;
        }
        if (formValues.resolucion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Resolución');
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
                <h2 className="modal-title">Declaración Jurada: </h2>
              </div>
              <div className="modal-body">
                <div className="row">
    
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="idTasa" className="form-label">Tasa</label>
                        <InputTasa
                            name="idTasa"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTasa }
                            onChange={ formHandle }
                            disabled={ props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="idSubTasa" className="form-label">Sub tasa</label>
                        <InputSubTasa
                            name="idSubTasa"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idSubTasa }
                            onChange={ formHandle }
                            disabled={ props.disabled}
                            idTasa={formValues.idTasa}
                        />
                    </div> 
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaPresentacionDDJJ" className="form-label">Fecha de presentación</label>
                        <DatePickerCustom
                            name="fechaPresentacionDDJJ"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaPresentacionDDJJ }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="anioDeclaracion" className="form-label">Año</label>
                        <InputEjercicio
                            name="anioDeclaracion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.anioDeclaracion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="mesDeclaracion" className="form-label">Mes</label>
                        <select
                            name="mesDeclaracion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.mesDeclaracion }
                            onChange={ (value) => {
                                formHandle(value);
                            }}
                            disabled={ props.disabled }
                        >
                        {GetMeses(true).map((item, index) =>
                            <option value={item.key} key={index}>{item.name}</option>
                        )}
    
                        </select>
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="numero" className="form-label m-left-10">Número</label>
                        <InputCodigo
                            name="numero"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numero }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            maxLength={20}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-4">
                        <label htmlFor="idTipoDDJJ" className="form-label">Tipo DDJJ</label>
                        <InputEntidad
                            name="idTipoDDJJ"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoDDJJ }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            title="Tipo DDJJ"
                            entidad="TipoDDJJ"
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="valorDeclaracion" className="form-label m-left-10">Valor</label>
                        <InputNumber
                            name="valorDeclaracion"
                            placeholder=""
                            className="form-control"
                            precision={2}
                            value={ formValues.valorDeclaracion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaAlta" className="form-label">Fecha alta</label>
                        <DatePickerCustom
                            name="fechaAlta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaAlta }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaBaja" className="form-label">Fecha baja</label>
                        <DatePickerCustom
                            name="fechaBaja"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaBaja }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="resolucion" className="form-label">Resolución</label>
                        <input
                            name="resolucion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.resolucion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="mb-3 m-top-10 col-12">
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
                                title="Información adicional de Declaraciones Juradas"
                                processKey={props.processKey}
                                entidad="DeclaracionJurada"
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
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() } >Cancelar</button>
              </div>
            </div>
          </div>
        </div>
    
        </>
      );
    }


DeclaracionJuradaModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

DeclaracionJuradaModal.defaultProps = {
  disabled: false
};

export default DeclaracionJuradaModal;