import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import { ServerRequest } from '../../../utils/apiweb';
import { InputLista, InputFile } from '../../common';
import ShowToastMessage from '../../../utils/toast';

const PlantillaDocumentoModal = (props) => {

    //variables
    const entityInit = {
        id: 0,
        idTipoPlantillaDocumento: 0,
        Archivo_descripcion: '',
        Archivo_nombre: '',
        Archivo_path: ''
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit,
        showInfo: false
    });    

    const mount = () => {

        if (props.id > 0) {
            FindPlantillaDocumento();
        }
   
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [, getRowLista ] = useLista({
        listas: ['TipoPlantillaDocumento'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoPlantillaDocumento',
          timeout: 0
        }
    });

    const getDescTipoPlantillaDocumento = (id) => {
        const row = getRowLista('TipoPlantillaDocumento', id);
        return (row) ? row.nombre : '';
    }

    const [ formValues, formHandle, , formSet ] = useForm({
        idTipoPlantillaDocumento: 0,
        Archivo_nombre: '',
        Archivo_path: '',
        Archivo_descripcion: ''
    });

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.id == 0) {
                AddPlantillaDocumento();
            }
            else {
                ModifyPlantillaDocumento();
            }
        };
    };
    const handleClickCancelar = () => {
        props.onDismiss();
    }

    const handleUploadArchivo = (filename, data) => {

        const callbackSuccess = (response) => {
          response.text()
          .then((path) => {
            formSet({
              ...formValues,
              Archivo_path: path,
              Archivo_nombre: filename
            });
          })
          .catch((error) => {
              const message = 'Error procesando respuesta: ' + error;
              ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
          });
        };
    
        const paramsHeaders = {
          "Content-Type": "application/octet-stream"
        };
        ServerRequest(
          REQUEST_METHOD.POST,
          paramsHeaders,
          true,
          APIS.URLS.FILE,
          null,
          data,
          callbackSuccess,
          callbackNoSuccess,
          callbackError,
          false
        );   
    }

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

    // funciones
    function isFormValid() {

        if (formValues.idTipoPlantillaDocumento <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo Plantilla');
            return false;
        }    
        if (formValues.Archivo_descripcion.length <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar la Descripción');
            return;
        }    
        if (formValues.Archivo_nombre.length <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el Archivo');
            return;
        }

        return true;
    }   
    
    function FindPlantillaDocumento() {
    
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
                    idTipoPlantillaDocumento: data.idTipoPlantillaDocumento,
                    Archivo_descripcion: data.descripcion,
                    Archivo_nombre: data.nombre,
                    Archivo_path: data.path
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
            APIS.URLS.PLANTILLA_DOCUMENTO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    
    function AddPlantillaDocumento() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = null;
        SavePlantillaDocumento(method, paramsUrl);
    }
    
    function ModifyPlantillaDocumento() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.id}`;
        SavePlantillaDocumento(method, paramsUrl);
    }    

    function SavePlantillaDocumento(method, paramsUrl) {

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
                idTipoPlantillaDocumento: formValues.idTipoPlantillaDocumento,
                descripcion: formValues.Archivo_descripcion,
                nombre: formValues.Archivo_nombre,
                path: formValues.Archivo_path,
        };
    
        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.PLANTILLA_DOCUMENTO,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }

  return (
    <>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Plantilla Documento: {(props && props.id > 0) ? 
                        getDescTipoPlantillaDocumento(state.entity.idTipoPlantillaDocumento) : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-12">
                    <label htmlFor="idTipoPlantillaDocumento" className="form-label">Tipo plantilla</label>
                    <InputLista
                        name="idTipoPlantillaDocumento"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idTipoPlantillaDocumento }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        lista="TipoPlantillaDocumento"
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="Archivo_descripcion" className="form-label">Descripción</label>
                    <input
                        name="Archivo_descripcion"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.Archivo_descripcion }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="Archivo_nombre" className="form-label">Archivo</label>
                    <InputFile
                        name="Archivo_nombre"
                        type="text"
                        placeholder="click para cargar un archivo..."
                        className="form-control"
                        value={ formValues.Archivo_nombre }
                        onUpload={ handleUploadArchivo }
                        disabled={props.disabled}
                    />
                </div>


            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => handleClickCancelar() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

PlantillaDocumentoModal.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

PlantillaDocumentoModal.defaultProps = {
    disabled: false
};

export default PlantillaDocumentoModal;