import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { useLista } from '../../hooks/useLista';
import ShowToastMessage from '../../../utils/toast';
import InputLista from '../../common/InputLista';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import { MASK_FORMAT } from '../../../consts/maskFormat';
import { InputFormat } from '../../common';
import { isValidEmail } from '../../../utils/validator';


const ContactoModal = (props) => {

  const entityInit = {
    id: 0,
    entidad: '',
    idEntidad: 0,
    idTipoContacto: 0,
    detalle: ''
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
      idTipoContacto: props.data.entity.idTipoContacto,
      detalle: props.data.entity.detalle
    });
  }
  useEffect(mount, [props.data.entity]);

  const [, getRowLista] = useLista({
    listas: ['TipoContacto'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoContacto',
      timeout: 0
    }
  });

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoContacto: 0,
    detalle: ''
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTipoContacto = parseInt(formValues.idTipoContacto);
      row.detalle = formValues.detalle;

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTipoContacto <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo Contacto');
      return false;
    }
    if (formValues.detalle.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Detalle');
      return false;
    }
    if (formValues.idTipoContacto === 522/*E-Mail*/ && !isValidEmail(formValues.detalle)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar un e-mail correcto');
      return false;
    }

    return true;
  }

  const getDescTipoContacto = (id) => {
    const row = getRowLista('TipoContacto', id);
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
            <h2 className="modal-title">Contacto: {(state.entity.id > 0) ? `${getDescTipoContacto(state.entity.idTipoContacto)} ${state.entity.detalle}` : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-12 col-lg-6">
                    <label htmlFor="idTipoContacto" className="form-label">Tipo Contacto</label>
                    <InputLista
                        name="idTipoContacto"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoContacto }
                        onChange={({target}) => {
                          formSet({...formValues,
                            idTipoContacto: target.value,
                            detalle: ''
                          });
                        }}
                        disabled={props.disabled}
                        lista="TipoContacto"
                    />
                </div>
                <div className="mb-3 col-12 col-lg-6">
                    <label htmlFor="detalle" className="form-label">Detalle</label>
                    {([520,521].includes(formValues.idTipoContacto)) ?
                    <InputFormat
                        name="detalle"
                        placeholder=""
                        className="form-control"
                        mask={MASK_FORMAT.TELEFONO}
                        maskPlaceholder={null}
                        value={ formValues.detalle }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                    :
                    <input
                        name="detalle"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.detalle }
                        onChange={ formHandle }
                        maxLength="250"
                        disabled={props.disabled}
                    />
                    }
                </div>

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
                        title="Información adicional de Contacto"
                        processKey={props.processKey}
                        entidad="Contacto"
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

ContactoModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

ContactoModal.defaultProps = {
  disabled: false
};

export default ContactoModal;