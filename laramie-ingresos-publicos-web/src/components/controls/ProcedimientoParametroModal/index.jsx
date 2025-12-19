import React, { useState, useEffect } from 'react';
import { object, func } from 'prop-types';

import { CloneObject, GetTipoDato } from '../../../utils/helpers';
import { isValidString } from '../../../utils/validator';
import { useForm } from '../../hooks/useForm';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { InputCustom } from '../../common';


const ProcedimientoParametroModal = (props) => {

  const [state, setState] = useState({
    listParametros: [],
    listValores: []
  });

  const mount = () => {

    let valores = {};
    props.data.listParametros.forEach(parametro => {
      const emisionProcedimientoParametro = props.data.listValores.find(f => f.idProcedimientoParametro === parametro.id);
      valores[parametro.codigo] = emisionProcedimientoParametro.valor;
    });

    setState({
      listParametros: props.data.listParametros,
      listValores: props.data.listValores
    });
    formSet(valores);
  }
  useEffect(mount, [props.data]);

  const [ formValues, formHandle, , formSet ] = useForm({});

  //handles
  const handleClickAceptar = () => {
      let rows = [];
      for (let i=0; i< state.listParametros.length; i++) {
        const parametro = state.listParametros[i];
        const formValue = formValues[parametro.codigo];
        if (!isValidString(formValue, true)) {
          ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar un valor para el parámetro: ' + parametro.codigo);
          return;
        }
        
        const emisionProcedimientoParametro = state.listValores.find(f => f.idProcedimientoParametro === parametro.id);
        if (formValue !== emisionProcedimientoParametro.valor) {
          let row = CloneObject(emisionProcedimientoParametro);
          row.valor = formValue;
          rows.push(row);
        }
      }

      props.onConfirm(rows);
  };

  
  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-xl">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Valores de Parámetros</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                {state.listParametros.map((parametro, index) => 
                  <div key={parametro.codigo} className="mb-3 col-4">
                      <label htmlFor={parametro.codigo} className="form-label">{parametro.nombre}</label>
                      <InputCustom
                          name={parametro.codigo}
                          type={ parametro.tipoDato }
                          placeholder={`Ingrese un valor de tipo ${GetTipoDato(parametro.tipoDato)}`}
                          className="form-control"
                          value={ formValues[parametro.codigo] }
                          onChange={ formHandle }
                          serialize={true}
                      />
                  </div>
                )}

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

ProcedimientoParametroModal.propTypes = {
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

export default ProcedimientoParametroModal;