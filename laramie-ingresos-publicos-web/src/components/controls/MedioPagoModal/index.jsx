import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { OnKeyPress_validInteger } from '../../../utils/validator';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { useLista } from '../../hooks/useLista';
import ShowToastMessage from '../../../utils/toast';
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

  //funciones

  const getDescTipoMedioPago = (id) => {
    const row = getRowLista('TipoMedioPago', id);
    return (row) ? row.nombre : '';
  }

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

          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

MedioPagoModal.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onDismiss: func.isRequired,
};

MedioPagoModal.defaultProps = {
  disabled: false
};

export default MedioPagoModal;