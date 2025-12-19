import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { isEmptyString, OnKeyPress_validInteger } from '../../../utils/validator';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { useLista } from '../../hooks/useLista';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import { DatePickerCustom, InputFormat, InputLista } from '../../common';
import { MASK_FORMAT } from '../../../consts/maskFormat';


const MedioPagoModal = (props) => {

  const entityInit = {
    id: 0,
    idTipoPersona: 0,
    idPersona: 0,
    idTipoMedioPago: 0,
    titular: '',
    numero: '',
    banco: '',
    alias: '',
    idTipoTarjeta: 0,
    idMarcaTarjeta: 0,
    fechaVencimiento: null,
    cvv: ''
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
      idTipoPersona: props.data.entity.idTipoPersona,
      idPersona: props.data.entity.idPersona,
      idTipoMedioPago: props.data.entity.idTipoMedioPago,
      titular: props.data.entity.titular,
      numero: props.data.entity.numero,
      banco: props.data.entity.banco,
      alias: props.data.entity.alias,
      idTipoTarjeta: props.data.entity.idTipoTarjeta,
      idMarcaTarjeta: props.data.entity.idMarcaTarjeta,
      fechaVencimiento: props.data.entity.fechaVencimiento,
      cvv: props.data.entity.cvv      
    });
  }
  useEffect(mount, [props.data.entity]);

  const [, getRowLista] = useLista({
    listas: ['TipoMedioPago', 'TipoTarjeta', 'MarcaTarjeta'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoMedioPago_TipoTarjeta_MarcaTarjeta',
      timeout: 0
    }
  });

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoMedioPago: 0,
    titular: '',
    numero: '',
    banco: '',
    alias: '',
    idTipoTarjeta: 0,
    idMarcaTarjeta: 0,
    fechaVencimiento: null,
    cvv: ''
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTipoMedioPago = parseInt(formValues.idTipoMedioPago);
      row.titular = formValues.titular;
      row.numero = formValues.numero;
      if (formValues.idTipoMedioPago === 611) { //CBU
        row.banco = formValues.banco;
        row.alias = formValues.alias;
      }
      else {
        row.banco = '';
        row.alias = '';
      }
      if (formValues.idTipoMedioPago === 610) { //Tarjeta Crédito/Débito
        row.idTipoTarjeta = !isEmptyString(formValues.idTipoTarjeta) ? parseInt(formValues.idTipoTarjeta) : 0;
        row.idMarcaTarjeta = !isEmptyString(formValues.idMarcaTarjeta) ? parseInt(formValues.idMarcaTarjeta) : 0;
        row.fechaVencimiento = formValues.fechaVencimiento;
        row.cvv = formValues.cvv;
      }
      else {
        row.idTipoTarjeta = 0;
        row.idMarcaTarjeta = 0;
        row.fechaVencimiento = null;
        row.cvv = '';
      }

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTipoMedioPago <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de medio de pago');
      return false;
    }
    if (formValues.titular.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Títular');
      return false;
    }
    if (formValues.numero.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número');
      return false;
    }

    if (formValues.idTipoMedioPago === 611) { //CBU
      if (formValues.banco.length <= 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Entidad');
        return false;
      }
      // if (formValues.alias.length <= 0) {
      //   ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Alias');
      //   return false;
      // }
    }

    if (formValues.idTipoMedioPago === 610) { //Tarjeta Crédito/Débito
      if (formValues.idTipoTarjeta <= 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Tipo de tarjeta');
        return false;
      }
      if (formValues.idMarcaTarjeta <= 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Marca de tarjeta');
        return false;
      }
      if (formValues.fechaVencimiento === null) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha de vencimiento');
        return false;
      }
      if (formValues.cvv.length <= 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Código de seguridad');
        return false;
      }
    }

    return true;
  }

  const getDescTipoMedioPago = (id) => {
    const row = getRowLista('TipoMedioPago', id);
    return (row) ? row.nombre : '';
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
            <h2 className="modal-title">Medio de Pago: {(state.entity.id > 0) ? `${getDescTipoMedioPago(state.entity.idTipoMedioPago)} ${state.entity.numero}` : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                <div className="mb-3 col-12 col-lg-6">
                    <label htmlFor="idTipoMedioPago" className="form-label">Tipo de Medio de Pago</label>
                    <InputLista
                        name="idTipoMedioPago"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoMedioPago }
                        onChange={({target}) => {
                          formSet({...formValues,
                            idTipoMedioPago: target.value,
                            numero: ''
                          });
                        }}
                        disabled={props.disabled}
                        lista="TipoMedioPago"
                    />
                </div>
                <div className="mb-3 col-12 col-lg-6">
                    <label htmlFor="numero" className="form-label">Número</label>
                    <InputFormat
                        name="numero"
                        placeholder=""
                        className="form-control"
                        mask={(formValues.idTipoMedioPago === 610/*Tarjeta Credito/Debito*/) ? MASK_FORMAT.TARJETA :
                              (formValues.idTipoMedioPago === 611/*CBU/CVU*/) ? MASK_FORMAT.CBU : '*'}
                        maskPlaceholder={null}
                        value={ formValues.numero }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="titular" className="form-label">Títular</label>
                    <input
                        name="titular"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.titular }
                        onChange={ formHandle }
                        maxLength="250"
                        disabled={props.disabled}
                    />
                </div>
            </div>

            {(formValues.idTipoMedioPago === 611/*CBU*/ &&
            <div className="row">
                <div className="mb-3 col-12 col-lg-6">
                    <label htmlFor="banco" className="form-label">Entidad</label>
                    <input
                        name="banco"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.banco }
                        onChange={ formHandle }
                        maxLength="250"
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-lg-6">
                    <label htmlFor="alias" className="form-label">Alias</label>
                    <input
                        name="alias"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.alias }
                        onChange={ formHandle }
                        maxLength="50"
                        disabled={props.disabled}
                    />
                </div>
            </div>
            )}
            {(formValues.idTipoMedioPago === 610/*Tarjeta Crédito/Débito*/ &&
            <div className="row">
                <div className="mb-3 col-12 col-lg-6">
                    <label htmlFor="idTipoTarjeta" className="form-label">Tipo de Tarjeta</label>
                    <InputLista
                        name="idTipoTarjeta"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoTarjeta }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        lista="TipoTarjeta"
                    />
                </div>
                <div className="mb-3 col-12 col-lg-6">
                    <label htmlFor="idMarcaTarjeta" className="form-label">Marca de Tarjeta</label>
                    <InputLista
                        name="idMarcaTarjeta"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idMarcaTarjeta }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        lista="MarcaTarjeta"
                    />
                </div>
                <div className="mb-3 col-6 col-lg-6">
                    <label htmlFor="fechaVencimiento" className="form-label">Fecha Vencimiento</label>
                    <DatePickerCustom
                        name="fechaVencimiento"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaVencimiento }
                        onChange={ formHandle }
                        disabled={props.disabled}  
                    />
                </div>
                <div className="mb-3 col-6 col-lg-6">
                    <label htmlFor="cvv" className="form-label">Código de Seguridad</label>
                    <input
                        name="cvv"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.cvv }
                        onChange={ formHandle }
                        onKeyPress={ OnKeyPress_validInteger }
                        maxLength="3"
                        disabled={props.disabled}
                    />
                </div>
            </div>
            )}

            <div className="row">
                <div className="m-top-20 mb-3 col-12">
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
                        title="Información adicional de Medio de Pago"
                        processKey={props.processKey}
                        entidad="MedioPago"
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
              <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
            }
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

MedioPagoModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

MedioPagoModal.defaultProps = {
  disabled: false
};

export default MedioPagoModal;