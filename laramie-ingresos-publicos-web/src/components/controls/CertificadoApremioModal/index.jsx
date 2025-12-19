import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { DatePickerCustom, InputFormat, InputLista, InputNumber, InputCuenta } from '../../common';

const CertificadoApremioModal = (props) => {

  const entityInit = {
    id: 0,
    idApremio: 0,
    idEstadoCertificadoApremio: 0,
    numero: '',
    idCuenta: 0,
    idInspeccion: 0,
    montoTotal: 0,
    fechaCertificado: null,
    fechaCalculo: null,
    fechaNotificacion: null,
    fechaRecepcion: null
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
      idApremio: props.data.entity.idApremio,
      idEstadoCertificadoApremio: props.data.entity.idEstadoCertificadoApremio,
      numero: props.data.entity.numero,
      idCuenta: props.data.entity.idCuenta,
      idInspeccion: props.data.entity.idInspeccion,
      montoTotal: props.data.entity.montoTotal,
      fechaCertificado: (props.data.entity.fechaCertificado) ? new Date(props.data.entity.fechaCertificado) : null,
      fechaCalculo: (props.data.entity.fechaCalculo) ? new Date(props.data.entity.fechaCalculo) : null,
      fechaNotificacion: (props.data.entity.fechaNotificacion) ? new Date(props.data.entity.fechaNotificacion) : null,
      fechaRecepcion: (props.data.entity.fechaRecepcion) ? new Date(props.data.entity.fechaRecepcion) : null
    });
  }
  useEffect(mount, [props.data.entity])

  const [ formValues, formHandle, , formSet ] = useForm({
    idApremio: 0,
    idEstadoCertificadoApremio: 0,
    numero: '',
    idCuenta: 0,
    idInspeccion: 0,
    montoTotal: 0,
    fechaCertificado: null,
    fechaCalculo: null,
    fechaNotificacion: null,
    fechaRecepcion: null
  });

  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-lg">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Número: {state.entity.numero}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                <div className="mb-3 col-12 col-md-6">
                  <label htmlFor="numero" className="form-label">Número de certificado</label>
                  <input
                      name="numero"
                      type="text"
                      placeholder=""
                      className="form-control"
                      value={formValues.numero}
                      onChange={ formHandle }
                      disabled={props.disabled}
                  />
              </div>
                  <div className="mb-3 col-12 col-md-6">
                      <label htmlFor="idEstadoCertificadoApremio" className="form-label">Estado</label>
                      <InputLista
                          name="idEstadoCertificadoApremio"
                          type="text"
                          placeholder=""
                          className="form-control"
                          value={formValues.idEstadoCertificadoApremio}
                          onChange={ formHandle }
                          disabled={props.disabled}
                          lista="EstadoCertificadoApremio"
                      />
                  </div>
              </div>
              <div className="row">
                  <div className="mb-3 col-12 col-md-6">
                      <label htmlFor="idCuenta" className="form-label">Cuenta</label>
                      <InputCuenta
                          name="idCuenta"
                          placeholder=""
                          className="form-control"
                          value={formValues.idCuenta}
                          onChange={ formHandle }
                          disabled={props.disabled}
                      />
                  </div>
                  <div className="mb-3 col-12 col-md-3">
                      <label htmlFor="idInspeccion" className="form-label">Número de inspección</label>
                      <InputLista
                          name="idInspeccion"
                          placeholder=""
                          className="form-control"
                          value={formValues.idInspeccion}
                          onChange={ formHandle }
                          disabled={props.disabled}
                          lista="InspeccionCertificadoApremio"
                      />
                  </div>
                  <div className="mb-3 col-12 col-md-3">
                      <label htmlFor="montoTotal" className="form-label">Total deuda</label>
                      <InputNumber
                          type="number"
                          name="montoTotal"
                          placeholder=""
                          className="form-control"
                          value={formValues.montoTotal}
                          onChange={ formHandle }
                          precision={2}
                          disabled={props.disabled}
                      />
                  </div>

                  <div className="col-6 col-md-3">
                      <label htmlFor="fechaCertificado" className="form-label">Fecha certificado</label>
                      <DatePickerCustom
                          name="fechaCertificado"
                          placeholder=""
                          className="form-control"
                          value={formValues.fechaCertificado}
                          onChange={ formHandle }
                          disabled={props.disabled}
                      />
                  </div>
                  <div className="col-6 col-md-3">
                      <label htmlFor="fechaCalculo" className="form-label">Fecha cálculo</label>
                      <DatePickerCustom
                          name="fechaCalculo"
                          placeholder=""
                          className="form-control"
                          value={formValues.fechaCalculo}
                          onChange={ formHandle }
                          disabled={props.disabled}
                      />
                  </div>
                  <div className="col-6 col-md-3">
                      <label htmlFor="fechaNotificacion" className="form-label">Fecha notificación</label>
                      <DatePickerCustom
                          name="fechaNotificacion"
                          placeholder=""
                          className="form-control"
                          value={formValues.fechaNotificacion}
                          onChange={ formHandle }
                          disabled={props.disabled}
                      />
                  </div>
                  <div className="col-6 col-md-3">
                      <label htmlFor="fechaRecepcion" className="form-label">Fecha recepción</label>
                      <DatePickerCustom
                          name="fechaRecepcion"
                          placeholder=""
                          className="form-control"
                          value={formValues.fechaRecepcion}
                          onChange={ formHandle }
                          disabled={props.disabled}
                      />
                  </div>
              </div>
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

CertificadoApremioModal.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onDismiss: func.isRequired,
};

CertificadoApremioModal.defaultProps = {
  disabled: false
};

export default CertificadoApremioModal;