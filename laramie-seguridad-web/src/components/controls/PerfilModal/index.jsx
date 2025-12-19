import React, { useState, useEffect } from 'react';
import { func, number, bool } from 'prop-types';

import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ServerRequest } from '../../../utils/apiweb';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import Loading from '../../common/Loading';
import ShowToastMessage from '../../../utils/toast';


const PerfilModal = (props) => {

  //variables
  const entityInit = {
    id: 0,
    codigo: '',
    nombre: ''
  };

  //hooks
  const [state, setState] = useState({
    loading: false,
    entity: entityInit
    // lists: {
    //   TipoUsuario: [],
    //   EstadoUsuario: [],
    // }
  });

  const mount = () => {

    if (props.id > 0) {
      FindPerfil();
    }

    const unmount = () => {}
    return unmount;
  }
  useEffect(mount, []);

  const [ formValues, formHandle, formReset, formSet ] = useForm({
    codigo: '',
    nombre: ''
  });

  //handles
  const handleClickAceptar = () => {
    if (isFormValid()) {
      if (props.id == 0) {
        AddPerfil();
      }
      else {
        ModifyPerfil();
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
    if (formValues.codigo.length === 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Código incompleto');
      return false;
    }

    if (formValues.nombre.length === 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Nombre del perfil incompleto');
      return false;
    }

    return true;
  }

  function FindPerfil() {
    
    setState(prevState => {
      return {...prevState, loading: true};
    });

    const callbackSuccess = (response) => {
        response.json()
        .then((data) => {
            setState(prevState => {
              return {...prevState, loading: false, entity: data};
            });
            formSet({
              codigo: data.codigo,
              nombre: data.nombre
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
        APIS.URLS.PERFIL,
        paramsUrl,
        null,
        callbackSuccess,
        callbackNoSuccess,
        callbackError
    );

  }

  function AddPerfil() {
    const method = REQUEST_METHOD.POST;
    const paramsUrl = null;
    SavePerfil(method, paramsUrl);
  }

  function ModifyPerfil() {
    const method = REQUEST_METHOD.PUT;
    const paramsUrl = `/${props.id}`;
    SavePerfil(method, paramsUrl);
  }

  function SavePerfil(method, paramsUrl) {

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
      codigo: formValues.codigo,
      nombre: formValues.nombre
    };

    ServerRequest(
        method,
        null,
        true,
        APIS.URLS.PERFIL,
        paramsUrl,
        dataBody,
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
            <h5 className="modal-title">Perfil: {(props && props.id > 0) ? state.entity.nombre : "Nuevo"}</h5>
          </div>
          <div className="modal-body">
            <div className="mb-3 col-12">
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
            <div className="mb-3 col-12">
                <label htmlFor="nombre" className="form-label">Nombre del perfil</label>
                <input
                    name="nombre"
                    type="text"
                    placeholder="Nombre del perfil"
                    className="form-control"
                    value={ formValues.nombre }
                    onChange={ formHandle }
                    disabled={props.disabled}
                />
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

PerfilModal.propTypes = {
  id: number.isRequired,
  disabled: bool,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
};

PerfilModal.defaultProps = {
  disabled: false
};

export default PerfilModal;