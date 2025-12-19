import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';

import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { useLista } from '../../hooks/useLista';
import ShowToastMessage from '../../../utils/toast';
import { InputLista, InputFormat } from '../../common';
import DataTaggerFormRedux from '../DataTaggerFormRedux';
import { MASK_FORMAT } from '../../../consts/maskFormat';


const DocumentoModal = (props) => {

  const entityInit = {
    id: 0,
    idTipoPersona: 0,
    idPersona: 0,
    idTipoDocumento: 0,
    numeroDocumento: '',
    principal: false,
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
      idTipoDocumento: (props.data.entity.idTipoPersona === 501/*Juridica*/) ? 512 : props.data.entity.idTipoDocumento,
      numeroDocumento: props.data.entity.numeroDocumento,
      principal: props.data.entity.principal
    });
  }
  useEffect(mount, [props.data.entity]);

  const [, getRowLista] = useLista({
    listas: ['TipoDocumento'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoDocumento',
      timeout: 0
    }
  });

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoDocumento: 0,
    numeroDocumento: '',
    principal: false
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTipoDocumento = parseInt(formValues.idTipoDocumento);
      row.numeroDocumento = formValues.numeroDocumento;
      row.principal = formValues.principal;

      props.onConfirm(row);
    };
  };

  //funciones
  function isFormValid() {

    if (formValues.idTipoDocumento <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo Documento');
      return false;
    }
    if (formValues.numeroDocumento.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número Documento');
      return false;
    }

    return true;
  }

  const getDescTipoDocumento = (id) => {
    const row = getRowLista('TipoDocumento', id);
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
            <h2 className="modal-title">Documento: {(state.entity.id > 0) ? `${getDescTipoDocumento(state.entity.idTipoDocumento)} ${state.entity.numeroDocumento}` : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-12 col-lg-5">
                    <label htmlFor="idTipoDocumento" className="form-label">Tipo Documento</label>
                    <InputLista
                        name="idTipoDocumento"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoDocumento }
                        onChange={({target}) => {
                          formSet({...formValues,
                            idTipoDocumento: target.value,
                            numeroDocumento: ''
                          });
                        }}
                        disabled={(state.entity.idTipoPersona === 501/*Juridica*/) ? true : props.disabled}
                        lista="TipoDocumento"
                    />
                </div>
                <div className="mb-3 col-8 col-lg-5">
                    <label htmlFor="numeroDocumento" className="form-label">Número Documento</label>
                    <InputFormat
                        name="numeroDocumento"
                        placeholder=""
                        className="form-control"
                        mask={(formValues.idTipoDocumento === 510/*DNI*/) ? MASK_FORMAT.DNI :
                              (formValues.idTipoDocumento === 511/*CUIL*/) ? MASK_FORMAT.CUIT :
                              (formValues.idTipoDocumento === 512/*CUIT*/) ? MASK_FORMAT.CUIT : MASK_FORMAT.DOCUMENTO}
                        maskPlaceholder={null}
                        value={ formValues.numeroDocumento }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 mt-4 col-4 col-lg-2 form-check">
                    <label htmlFor="principal" className="form-check-label">Principal</label>
                    <input
                        name="principal"
                        type="checkbox"
                        className="form-check-input"
                        value={''}
                        checked={formValues.principal }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
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
                        title="Información adicional de Documento"
                        processKey={props.processKey}
                        entidad="Documento"
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

DocumentoModal.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

DocumentoModal.defaultProps = {
  disabled: false
};

export default DocumentoModal;