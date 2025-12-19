import React, { useState, useEffect } from 'react';
import { string, number, func, bool } from 'prop-types';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';
import { DataTagger, Loading } from '../../common';
import { DATA_TAGGER_TYPE } from '../../../consts/dataTaggerType';

import './index.css';


const DataTaggerModalApi = (props) => {

  //hooks
  const [state, setState] = useState({
    loading: false,
    entidad: "",
    idEntidad: 0,
    data: {
      archivos: [],
      observaciones: [],
      etiquetas: []
    }
  });

  const [controllerDataTagger, setControllerDataTagger] = useState({
    entidad: "",
    idEntidad: 0,
    data: {
      archivos: [],
      observaciones: [],
      etiquetas: []
    },
    addRow: (dataTaggerType, row, success, error) => {},
    removeRow: (dataTaggerType, row, success, error) => {}
  });

  const mount = () => {

    if (props.idEntidad > 0) {
      SearchInformacionAdicional();
    }

  }
  useEffect(mount, [props.entidad, props.idEntidad]);

  useEffect(() => {
    setControllerDataTagger({
      entidad: state.entidad,
      idEntidad: state.idEntidad,
      data: {
          archivos: state.data.archivos.filter(f => f.state !== 'r'),
          observaciones: state.data.observaciones.filter(f => f.state !== 'r'),
          etiquetas: state.data.etiquetas.filter(f => f.state !== 'r')
      },
      addRow: (dataTaggerType, row, success, error) => {
        switch(dataTaggerType) {
            case DATA_TAGGER_TYPE.ARCHIVO:
              AddArchivo(row, success, error);
              break;
            case DATA_TAGGER_TYPE.OBSERVACION:
              AddObservacion(row, success, error);
              break;
            case DATA_TAGGER_TYPE.ETIQUETA:
              AddEtiqueta(row, success, error);
              break;
            default:
                break;
        }
      },
      removeRow: (dataTaggerType, row, success, error) => {
        switch(dataTaggerType) {
          case DATA_TAGGER_TYPE.ARCHIVO:
            RemoveArchivo(row, success, error);
            break;
          case DATA_TAGGER_TYPE.OBSERVACION:
            RemoveObservacion(row, success, error);
            break;
          case DATA_TAGGER_TYPE.ETIQUETA:
            RemoveEtiqueta(row, success, error);
            break;
          default:
              break;
        }
      }
    });
  }, [state.entidad, state.idEntidad, state.data]);


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
  const callbackSuccess = (response) => {
    response.json()
    .then((response) => {
      setState(prevState => {
          return {...prevState, loading: false};
      });
      SearchInformacionAdicional();
    })
    .catch((error) => {
      const message = 'Error procesando respuesta: ' + error;
      ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
      setState(prevState => {
        return {...prevState, loading: false};
      });
    });
  };

  //funciones
  function SearchInformacionAdicional() {

    setState(prevState => {
        return {...prevState, loading: true};
    });

    const callbackSearchInformacionAdicionalSuccess = (response) => {
        response.json()
        .then((data) => {
          data.archivos.forEach(x => {
              if (x.fecha) x.fecha = new Date(x.fecha);
          });
          data.observaciones.forEach(x => {
              if (x.fecha) x.fecha = new Date(x.fecha);
          });
          setState(prevState => {
              return {...prevState,
                loading: false,
                entidad: props.entidad,
                idEntidad: props.idEntidad,
                data: data
              };
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

    const paramsUrl = `/entidad/${props.entidad}/${props.idEntidad}`;
    ServerRequest(
        REQUEST_METHOD.GET,
        null,
        true,
        APIS.URLS.INFORMACION_ADICIONAL,
        paramsUrl,
        null,
        callbackSearchInformacionAdicionalSuccess,
        callbackNoSuccess,
        callbackError
    );

  }

  function AddArchivo(row, success, error) {

    setState(prevState => {
      return {...prevState, loading: true};
    });

    const dataBody = row;

    ServerRequest(
        REQUEST_METHOD.POST,
        null,
        true,
        APIS.URLS.ARCHIVO,
        null,
        dataBody,
        (response) => { callbackSuccess(response); success(); },
        (response) => { callbackNoSuccess(response); error(); },
        (error) => { callbackError(error); error(); }
    );

  }
  function RemoveArchivo(row, success, error) {

    setState(prevState => {
      return {...prevState, loading: true};
    });

    const paramUrl = `/${row.id}`;

    ServerRequest(
        REQUEST_METHOD.DELETE,
        null,
        true,
        APIS.URLS.ARCHIVO,
        paramUrl,
        null,
        (response) => { callbackSuccess(response); success(); },
        (response) => { callbackNoSuccess(response); error(); },
        (error) => { callbackError(error); error(); }
    );

  }
  function AddObservacion(row, success, error) {

    setState(prevState => {
      return {...prevState, loading: true};
    });

    const dataBody = row;

    ServerRequest(
        REQUEST_METHOD.POST,
        null,
        true,
        APIS.URLS.OBSERVACION,
        null,
        dataBody,
        (response) => { callbackSuccess(response); success(); },
        (response) => { callbackNoSuccess(response); error(); },
        (error) => { callbackError(error); error(); }
    );

  }
  function RemoveObservacion(row, success, error) {

    setState(prevState => {
      return {...prevState, loading: true};
    });

    const paramUrl = `/${row.id}`;

    ServerRequest(
        REQUEST_METHOD.DELETE,
        null,
        true,
        APIS.URLS.OBSERVACION,
        paramUrl,
        null,
        (response) => { callbackSuccess(response); success(); },
        (response) => { callbackNoSuccess(response); error(); },
        (error) => { callbackError(error); error(); }
    );

  }
  function AddEtiqueta(row, success, error) {

    setState(prevState => {
      return {...prevState, loading: true};
    });

    const dataBody = row;

    ServerRequest(
        REQUEST_METHOD.POST,
        null,
        true,
        APIS.URLS.ETIQUETA,
        null,
        dataBody,
        (response) => { callbackSuccess(response); success(); },
        (response) => { callbackNoSuccess(response); error(); },
        (error) => { callbackError(error); error(); }
    );

  }
  function RemoveEtiqueta(row, success, error) {

    setState(prevState => {
      return {...prevState, loading: true};
    });

    const paramUrl = `/${row.id}`;

    ServerRequest(
        REQUEST_METHOD.DELETE,
        null,
        true,
        APIS.URLS.ETIQUETA,
        paramUrl,
        null,
        (response) => { callbackSuccess(response); success(); },
        (response) => { callbackNoSuccess(response); error(); },
        (error) => { callbackError(error); error(); }
    );

  }


  return (
    <>

    <Loading visible={state.loading}></Loading>

    <div className='data-tagger-modal'>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-lg">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
              <i className="modal-icon fa fa-info-circle"></i>
            </div>
            <div className="modal-body">

              <DataTagger
                controller={controllerDataTagger}
                disabled={props.disabled}
              />

            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Salir</button>
            </div>
          </div>
        </div>
      </div>

    </div>

    </>
  );
}

DataTaggerModalApi.propTypes = {
  disabled: bool,
  title: string.isRequired,
  entidad: string.isRequired,
  idEntidad: number.isRequired,
  onDismiss: func.isRequired
};

DataTaggerModalApi.defaultProps = {
  disabled: false
};

export default DataTaggerModalApi;
