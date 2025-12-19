import React, { useState, useEffect } from 'react';
import { func, number, bool } from 'prop-types';
import validator from 'validator';

import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ServerRequest } from '../../../utils/apiweb';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import Loading from '../../common/Loading';
import ShowToastMessage from '../../../utils/toast';


const UsuarioModal = (props) => {

  //variables
  const entityInit = {
    id: 0,
    idTipoUsuario: 0,
    idEstadoUsuario: 0,
    idPersona: 0,
    codigo: '',
    nombreApellido: '',
    email: '',
    fechaAlta: null,
    fechaBaja: null,
    password: '',
    password2: '',
  };

  //hooks
  const [state, setState] = useState({
    loading: false,
    entity: entityInit,
    lists: {
      TipoUsuario: [],
      EstadoUsuario: [],
    }
  });

  const mount = () => {

    if (props.id > 0) {
      FindUsuario();
    }
    SearchListas();

    const unmount = () => {}
    return unmount;
  }
  useEffect(mount, []);

  const [ formValues, formHandle, formReset, formSet ] = useForm({
    idTipoUsuario: 1,
    idEstadoUsuario: 10,
    codigo: '',
    nombreApellido: '',
    email: '',
    password: '',
    password2: ''
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {
      if (props.id === 0) {
        AddUsuario();
      }
      else {
        ModifyUsuario();
      }
    };
  };

  //callbacks
  const callbackNoSuccess = (response) => {
      response.json()
      .then((error) => {
        const message = error.message;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState(prevState => {
          return {...prevState, loading: false};
        });
      })
      .catch((error) => {
          const message = 'Error procesando respuesta: ' + error;
          ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
          setState(prevState => {
            return {...prevState, loading: false};
          });
      });
  }
  const callbackError = (error) => {
      const message = 'Error procesando solicitud: ' + error.message;
      ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
      setState(prevState => {
        return {...prevState, loading: false};
      });
  }

  //funciones
  function isFormValid() {

    if (formValues.idTipoUsuario <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Tipo incompleto');
      return false;
    }
    if (formValues.idEstadoUsuario <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Estado incompleto');
      return false;
    }
    if (formValues.codigo.length === 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Código incompleto');
      return false;
    }
    if (formValues.nombreApellido.length === 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Nombre o Apellido incompletos');
      return false;
    }
    if (!validator.isEmail(formValues.email)) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'E-Mail incompleto');
      return false;
    }

    if (props.id === 0 && formValues.password.length === 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Por favor ingrese una contraseña');
      return false;
    }

    if (formValues.password.length > 0 && formValues.password2.length === 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Por favor repita la contraseña ingresada');
      return false;
    }

    if (formValues.password !== formValues.password2) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  }

  function FindUsuario() {
    
    setState(prevState => {
      return {...prevState, loading: true};
    });

    const callbackSuccess = (response) => {
        response.json()
        .then((data) => {
            setState(prevState => {
              return {...prevState, loading: false, entity: data};
            });
            formSet({...formValues,
              idTipoUsuario: data.idTipoUsuario,
              idEstadoUsuario: data.idEstadoUsuario,
              codigo: data.codigo,
              nombreApellido: data.nombreApellido,
              email: data.email
            });
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
              return {...prevState, loading: false};
            });
        });
    };

    const paramsUrl = `/${props.id}`;

    ServerRequest(
        REQUEST_METHOD.GET,
        null,
        true,
        APIS.URLS.USUARIO,
        paramsUrl,
        null,
        callbackSuccess,
        callbackNoSuccess,
        callbackError
    );

  }

  function AddUsuario() {
    const method = REQUEST_METHOD.POST;
    const paramsUrl = null;
    SaveUsuario(method, paramsUrl);
  }

  function ModifyUsuario() {
    const method = REQUEST_METHOD.PUT;
    const paramsUrl = `/${props.id}`;
    SaveUsuario(method, paramsUrl);
  }

  function SaveUsuario(method, paramsUrl) {

    setState(prevState => {
      return {...prevState, loading: true};
    });

    const callbackSuccess = (response) => {
      response.json()
      .then((row) => {
        setState(prevState => {
            return {...prevState, loading: false};
        });
        props.onConfirm(row.id);
      })
      .catch((error) => {
        const message = 'Error procesando respuesta: ' + error;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState(prevState => {
          return {...prevState, loading: false};
        });
      });
    };

    const dataBody = {
      ...state.entity,
      idTipoUsuario: parseInt(formValues.idTipoUsuario),
      idEstadoUsuario: parseInt(formValues.idEstadoUsuario),
      codigo: formValues.codigo,
      nombreApellido: formValues.nombreApellido,
      email: formValues.email,
      password: formValues.password
    };

    ServerRequest(
        method,
        null,
        true,
        APIS.URLS.USUARIO,
        paramsUrl,
        dataBody,
        callbackSuccess,
        callbackNoSuccess,
        callbackError
    );

  }

  function SearchListas() {

    setState(prevState => {
        return {...prevState, loading: true};
    });

    const callbackSuccess = (response) => {
        response.json()
        .then((data) => {
            setState(prevState => {
                return {...prevState, loading: false, lists: data};
            });
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    };

    const paramsUrl = '/TipoUsuario&EstadoUsuario';

    ServerRequest(
        REQUEST_METHOD.GET,
        null,
        true,
        APIS.URLS.LISTA,
        paramsUrl,
        null,
        callbackSuccess,
        callbackNoSuccess,
        callbackError
    );

  }


  return (
    <>

    <Loading visible={state.loading}></Loading>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Usuario: {(props && props.id > 0) ? state.entity.nombreApellido : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-6 ">
                    <label htmlFor="idTipoUsuario" className="form-label">Tipo</label>
                    <select
                        name="idTipoUsuario"
                        placeholder="Tipo"
                        className="form-control"
                        value={ formValues.idTipoUsuario }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    >
                    {state.lists.TipoUsuario.map((item, index) =>
                      <option value={item.id} key={index}>{item.nombre}</option>
                    )}
                    </select>
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idEstadoUsuario" className="form-label">Estado</label>
                    <select
                        name="idEstadoUsuario"
                        placeholder="Estado"
                        className="form-control"
                        value={ formValues.idEstadoUsuario }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    >
                    {state.lists.EstadoUsuario.map((item, index) =>
                      <option value={item.id} key={index}>{item.nombre}</option>
                    )}
                    </select>
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="codigo" className="form-label">Código</label>
                    <input
                        name="codigo"
                        type="text"
                        placeholder="Código"
                        className="form-control"
                        value={ formValues.codigo }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="nombreApellido" className="form-label">Nombre y apellido</label>
                    <input
                        name="nombreApellido"
                        type="text"
                        placeholder="Nombre y apellido"
                        className="form-control"
                        value={ formValues.nombreApellido }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="email" className="form-label">E-Mail</label>
                    <input
                        name="email"
                        type="text"
                        placeholder="E-Mail"
                        className="form-control"
                        value={ formValues.email }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                        name="password"
                        type="password"
                        className="form-control"
                        value={ formValues.password }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="password2" className="form-label">Repita la contraseña</label>
                    <input
                        name="password2"
                        type="password"
                        className="form-control"
                        value={ formValues.password2 }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
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

UsuarioModal.propTypes = {
  id: number.isRequired,
  disabled: bool,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

UsuarioModal.defaultProps = {
  disabled: false
};

export default UsuarioModal;