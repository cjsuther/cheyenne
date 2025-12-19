import React, { useEffect, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useLista } from '../../hooks/useLista';
import { func } from 'prop-types';
import ShowToastMessage from '../../../utils/toast';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ServerRequest } from '../../../utils/apiweb';
import { ALERT_TYPE } from '../../../consts/alertType';
import { Loading } from '../../common';

const PermisoModal = (props) => {

  //variables
  const entityInit = {
    id: 0,
    codigo: '',
    nombre: '',
    sistema: '',
    idModulo: '',
    descripcion: ''
  };

  // hooks
  const [state, setState] = useState({
    loading: false,
    entity: entityInit
  });

  useEffect(() => {
    if (props.id > 0) {
      FindPermiso();
    }

    const unmount = () => {}
    return unmount;
  }, []);

  const [ formValues, formHandle, formReset, formSet ] = useForm({
    codigo: '',
    nombre: '',
    sistema: '',
    idModulo: '',
    descripcion: ''
  });

  const [getLista, ] = useLista({
      listas: ['Modulo'],
      onLoaded: (listas, isSuccess, error) => {
        if (isSuccess) {
          setState(prevState => ({...prevState}));
        }
        else {
          ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
        }
      },
      memo: {
        key: 'Modulo',
        timeout: 0
      }
  });

  const getListModulo = () => {
    return getLista('Modulo');
  }

  // callbacks
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

  // functions
  function FindPermiso() {
    
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
              nombre: data.nombre,
              sistema: data.sistema,
              idModulo: data.idModulo,
              descripcion: data.descripcion
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
        APIS.URLS.PERMISO,
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
            <h2 className="modal-title">Permiso: Alta de Usuario</h2>
          </div>
          <div className="modal-body">
            <div className="row">
                
                <div className="mb-3 col-6">
                    <label htmlFor="sistema" className="form-label">Sistema</label>
                    <input
                        name="sistema"
                        type="text"
                        placeholder="Sistema"
                        className="form-control"
                        value={formValues.sistema}
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="idModulo" className="form-label">Módulo</label>
                    <select
                        name="idModulo"
                        placeholder="Módulo"
                        className="form-control"
                        value={ formValues.idModulo }
                        onChange={ formHandle }
                        disabled={true}
                    >
                    {getListModulo().map((item, index) =>
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
                        value={formValues.codigo}
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-6">
                    <label htmlFor="nombreApellido" className="form-label">Nombre</label>
                    <input
                        name="nombre"
                        type="text"
                        placeholder="Nombre"
                        className="form-control"
                        value={formValues.nombre}
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <input
                        name="descripcion"
                        type="text"
                        placeholder="Descripción"
                        className="form-control"
                        value={formValues.descripcion}
                        disabled={true}
                    />
                </div>

            </div>
          </div>
          <div className="modal-footer">
              <button className="btn action-button" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Salir</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

PermisoModal.propTypes = {
  onDismiss: func.isRequired,
};

export default PermisoModal;