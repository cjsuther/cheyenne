import React, { useState, useEffect } from 'react';
import { object, bool } from 'prop-types';
import { Tab, Tabs } from '../TabCustom';
import { useForm } from '../../hooks/useForm';
import { TableCustom, Loading } from '../../common';
import { CloneObject, OpenObjectURL } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { DATA_TAGGER_TYPE } from '../../../consts/dataTaggerType';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { getDateToString, getStringMaxLength } from '../../../utils/convert';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import MessageModal from '../MessageModal';
import InputFile from '../InputFile';


const DataTagger = (props) => {

  //hooks
  const [state, setState] = useState({
      controller: {
        entidad: "",
        idEntidad: 0,
        data: {
          archivos: [],
          observaciones: [],
          etiquetas: []
        },
        addRow: (dataTaggerType, row, success, error) => {},
        removeRow: (dataTaggerType, row, success, error) => {}
      },
      loading: false,
      showMessage: false,
      showForm: false,
      modeFormEdit: false,
      rowForm: null,
      tabActive: DATA_TAGGER_TYPE.ARCHIVO
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState,
        controller: props.controller
      };
    });
  }
  useEffect(mount, [props.controller]);

  const [ formValues, formHandle, formReset, formSet ] = useForm({
    Archivo_nombre: '',
    Archivo_path: '',
    Archivo_descripcion: '',
    Observacion_detalle: '',
    Etiqueta_codigo: ''
  });

  const cellAA = (data) =>  <div className='action'>
                              {!props.disabled && (
                              <div onClick={ (event) => handleClickAAdd() } className="link">
                                  <span className="material-symbols-outlined" title="Nuevo">add</span>
                              </div>
                              )}
                            </div>

  const cellADR = (data) => <div className='action'>
                              <div onClick={ (event) => handleClickADownload(data.value) } className="link">
                                  <span className="material-symbols-outlined" title="Descargar CSV">download</span>
                              </div>
                              {!props.disabled && (
                              <div onClick={ (event) => handleClickARemove(data.value) } className="link">
                                  <span className="material-symbols-outlined" title="Eliminar">delete</span>
                              </div>
                              )}
                            </div>

  const cellOA = (data) =>  <div className='action'>
                              {!props.disabled && (
                              <div onClick={ (event) => handleClickOAdd() } className="link">
                                  <span className="material-symbols-outlined" title="Nuevo">add</span>
                              </div>
                              )}
                            </div>

  const cellOVR = (data) => <div className='action'>
                              <div onClick={ (event) => handleClickOView(data.value) } className="link">
                                  <span className="material-symbols-outlined" title="Ver">search</span>
                              </div>
                              {!props.disabled && (
                              <div onClick={ (event) => handleClickORemove(data.value) } className="link">
                                  <span className="material-symbols-outlined" title="Eliminar">delete</span>
                              </div>
                              )}
                            </div>

  const cellEA = (data) =>  <div className='action'>
                              {!props.disabled && (
                              <div onClick={ (event) => handleClickEAdd() } className="link">
                                  <span className="material-symbols-outlined" title="Nuevo">add</span>
                              </div>
                              )}
                            </div>

  const cellER = (data) =>  <div className='action'>
                              {!props.disabled && (
                              <div onClick={ (event) => handleClickERemove(data.value) } className="link">
                                  <span className="material-symbols-outlined" title="Eliminar">delete</span>
                              </div>
                              )}
                            </div>

  const tableAColumns = [
    { Header: 'Descripción', accessor: 'descripcion', width: '75%' },
    { Header: 'Fecha', Cell: (data) => getDateToString(data.value, true), accessor: 'fecha', width: '20%' },
    { Header: cellAA, Cell: cellADR, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
  ];
  const tableOColumns = [
    { Header: 'Detalle', Cell: (data) => getStringMaxLength(data.value, 80, ' [...]'), accessor: 'detalle', width: '75%' },
    { Header: 'Fecha', Cell: (data) => getDateToString(data.value, true), accessor: 'fecha', width: '20%' },
    { Header: cellOA, Cell: cellOVR, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
  ];
  const tableEColumns = [
    { Header: 'Código', accessor: 'codigo', width: '95%' },
    { Header: cellEA, Cell: cellER, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickAAdd = () => {
    const rowForm = {
      id: 0,
      entidad: state.controller.entidad,
      idEntidad: state.controller.idEntidad,
      nombre: '',
      path: '',
      descripcion: '',
      idUsuario: 0,
      fecha: null
    };
    setState(prevState => {
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    formReset();
  }
  const handleClickADownload = (id) => {

    const rowForm = state.controller.data.archivos.find(x => x.id === id);
    const callbackSuccess = (response) => {
      response.blob()
      .then((buffer) => {
        OpenObjectURL(rowForm.nombre, buffer);
      })
      .catch((error) => {
          const message = 'Error procesando respuesta: ' + error;
          ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
      });
    };

    const paramsHeaders = {
      "Content-Type": "application/octet-stream"
    };
    const paramsUrl = (id > 0) ? `/${rowForm.path}` : `/temp/${rowForm.path}`;
    ServerRequest(
      REQUEST_METHOD.GET,
      paramsHeaders,
      true,
      APIS.URLS.FILE,
      paramsUrl,
      null,
      callbackSuccess,
      callbackNoSuccess,
      callbackError
    );

  }
  const handleClickARemove = (id) => {
    setState(prevState => {
      const rowForm = state.controller.data.archivos.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickOAdd = () => {
    const rowForm = {
      id: 0,
      entidad: state.controller.entidad,
      idEntidad: state.controller.idEntidad,
      detalle: '',
      idUsuario: 0,
      fecha: null
    };
    setState(prevState => {
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    formReset();
  }
  const handleClickOView = (id) => {
    const rowForm = state.controller.data.observaciones.find(x => x.id === id);
    setState(prevState => {
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
    formSet({...formValues, Observacion_detalle: rowForm.detalle});
  }
  const handleClickORemove = (id) => {
    const rowForm = state.controller.data.observaciones.find(x => x.id === id);
    setState(prevState => {
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickEAdd = () => {
    const rowForm = {
      id: 0,
      entidad: state.controller.entidad,
      idEntidad: state.controller.idEntidad,
      codigo: ''
    };
    setState(prevState => {
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    formReset();

  }
  const handleClickERemove = (id) => {
    const rowForm = state.controller.data.etiquetas.find(x => x.id === id);
    setState(prevState => {
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleUploadArchivo = (filename, data) => {
    const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'png']; // Lista de extensiones permitidas
    const fileExtension = filename.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El tipo de archivo no está permitido. Por favor, suba un archivo con una extensión válida.');
        return;
    }

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
    })
    .catch((error) => {
        const message = 'Error procesando respuesta: ' + error;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
    });
  }
  const callbackError = (error) => {
      const message = 'Error procesando solicitud: ' + error.message;
      ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
  }

  //funciones
  function SetTabActive(tab) {
    setState(prevState => {
        return {...prevState, tabActive: tab};
    });
  }

  function AddEntidad() {

    const row = CloneObject(state.rowForm);

    if (state.tabActive === DATA_TAGGER_TYPE.ARCHIVO) {
      if (formValues.Archivo_nombre.length <= 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe adjuntar el archivo');
        return;
      }
      if (formValues.Archivo_descripcion.length <= 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar la descripción');
        return;
      }
      if (formValues.Archivo_descripcion.length > 250) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'La descripcion no puede exceder los 250 caracteres');
        return;
      }
      row.nombre = formValues.Archivo_nombre;
      row.path = formValues.Archivo_path;
      row.descripcion = formValues.Archivo_descripcion;
    }
    else if (state.tabActive === DATA_TAGGER_TYPE.OBSERVACION) {
      if (formValues.Observacion_detalle.length <= 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar el detalle');
        return;
      }
      if (formValues.Observacion_detalle.length > 1000) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El detalle no puede exceder los 1000 caracteres');
        return;
      }
      row.detalle = formValues.Observacion_detalle;
    }
    else if (state.tabActive === DATA_TAGGER_TYPE.ETIQUETA) {
      if (formValues.Etiqueta_codigo.length <= 0) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar el código');
        return;
      }
      if (formValues.Etiqueta_codigo.length > 50) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El código no puede exceder los 50 caracteres');
        return;
      }
      row.codigo = formValues.Etiqueta_codigo;
    }

    setState(prevState => {
      return {...prevState, loading: true };
    });
    state.controller.addRow(state.tabActive, row, ClosePopup, ClosePopup);
  }

  function RemoveEntidad(row) {
    setState(prevState => {
      return {...prevState, loading: true };
    });
    state.controller.removeRow(state.tabActive, row, ClosePopup, ClosePopup);
  }

  function ClosePopup() {
    setState(prevState => {
      return {...prevState, showForm: false, rowForm: null, loading: false };
    });
  }


  return (
  <>

    <Loading visible={state.loading}></Loading>

    {state.showMessage && 
        <MessageModal
            title={"Confirmación"}
            message={"¿Está seguro de borrar el registro?"}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showMessage: false, rowForm: null};
              });
            }}
            onConfirm={() => {
              const row = CloneObject(state.rowForm);
              setState(prevState => {
                  return {...prevState, showMessage: false, rowForm: null};
              });
              RemoveEntidad(row);
            }}
        />
    }

    {state.showForm && state.tabActive === DATA_TAGGER_TYPE.ARCHIVO &&
      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Archivo</h5>
              <span className="modal-icon material-symbols-outlined">upload_file</span>
            </div>
            <div className="modal-body">
              <div className="row">

                <div className="mb-3 col-12">
                  <label htmlFor="Archivo_descripcion" className="form-label">Descripción</label>
                  <input
                      name="Archivo_descripcion"
                      type="text"
                      placeholder=""
                      className="form-control"
                      value={ formValues.Archivo_descripcion }
                      onChange={ formHandle }
                      disabled={ !state.modeFormEdit }
                  />
                </div>
                <div className="mb-3 col-12">
                  <label htmlFor="Archivo_nombre" className="form-label">Archivo</label>
                  <InputFile
                      name="Archivo_nombre"
                      type="text"
                      placeholder="Click para adjuntar un archivo..."
                      className="form-control"
                      value={ formValues.Archivo_nombre }
                      onUpload={ handleUploadArchivo }
                      disabled={ !state.modeFormEdit }
                  />
                </div>
  
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline-primary" data-dismiss="modal"
                onClick={ (event) => {
                  setState(prevState => {
                    return {...prevState, showForm: false, rowForm: null};
                  });
                }}
              >Cancelar</button>
              {state.modeFormEdit &&
              <button
                className="btn btn-primary" data-dismiss="modal"
                onClick={ (event) => {
                  AddEntidad();
                }}
              >Aceptar</button>
              }
            </div>
          </div>
        </div>
      </div>
    }

    {state.showForm && state.tabActive === DATA_TAGGER_TYPE.OBSERVACION &&
      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Observación</h5>
              <span className="modal-icon material-symbols-outlined">maps_ugc</span>
            </div>
            <div className="modal-body">
              <div className="row">

                <div className="mb-3 col-12">
                  <label htmlFor="Observacion_detalle" className="form-label">Detalle</label>
                  <textarea
                      name="Observacion_detalle"
                      placeholder=""
                      className="form-control"
                      value={ formValues.Observacion_detalle }
                      onChange={ formHandle }
                      disabled={ !state.modeFormEdit }
                      rows="4"
                  />
                </div>

              </div>
            </div>
            {state.modeFormEdit &&
            <div className="modal-footer">
              <button
                className="btn btn-outline-primary" data-dismiss="modal"
                onClick={ (event) => {
                  setState(prevState => {
                    return {...prevState, showForm: false, rowForm: null};
                  });
                }}
              >Cancelar</button>
              <button
                className="btn btn-primary" data-dismiss="modal"
                onClick={ (event) => {
                  AddEntidad();
                }}
              >Aceptar</button>
            </div>
            }
               
            {state.modeFormEdit === false &&
            <div className="modal-footer f-align">
                  <button
                    className="btn back-button" data-dismiss="modal"
                    onClick={ (event) => {
                      setState(prevState => {
                        return {...prevState, showForm: false, rowForm: null};
                      });
                    }}
                  >Volver</button>
            </div>
            }
          </div>
        </div>
      </div>
    }

    {state.showForm && state.tabActive === DATA_TAGGER_TYPE.ETIQUETA &&
      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Etiqueta</h5>
              <span className="modal-icon material-symbols-outlined">sell</span>
            </div>
            <div className="modal-body">
              <div className="row">

                <div className="mb-3 col-12">
                  <label htmlFor="Etiqueta_codigo" className="form-label">Código</label>
                  <input
                      name="Etiqueta_codigo"
                      type="text"
                      placeholder=""
                      className="form-control"
                      value={ formValues.Etiqueta_codigo }
                      onChange={ formHandle }
                      disabled={ !state.modeFormEdit }
                  />
                </div>

              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline-primary" data-dismiss="modal"
                onClick={ (event) => {
                  setState(prevState => {
                    return {...prevState, showForm: false, rowForm: null};
                  });
                }}
              >Cancelar</button>
              {state.modeFormEdit &&
              <button
                className="btn btn-primary" data-dismiss="modal"
                onClick={ (event) => {
                  AddEntidad();
                }}
              >Aceptar</button>
              }
            </div>
          </div>
        </div>
      </div>
    }

    <Tabs
      id="tabs-datatagger"
      activeKey={state.tabActive}
      className="m-top-20"
      onSelect={(tab) => SetTabActive(tab)}
    >

      <Tab eventKey={DATA_TAGGER_TYPE.ARCHIVO} title="Archivos">
          <div className='tab-panel'>
            <TableCustom
                showFilterGlobal={false}
                className={'TableCustomBase'}
                columns={tableAColumns}
                data={state.controller.data.archivos}
            />
          </div>
      </Tab>
      <Tab eventKey={DATA_TAGGER_TYPE.OBSERVACION} title="Observaciones">
          <div className='tab-panel'>
            <TableCustom
                showFilterGlobal={false}
                className={'TableCustomBase'}
                columns={tableOColumns}
                data={state.controller.data.observaciones}
            />
          </div>
      </Tab>
      <Tab eventKey={DATA_TAGGER_TYPE.ETIQUETA} title="Etiquetas">
          <div className='tab-panel'>
            <TableCustom
                showFilterGlobal={false}
                className={'TableCustomBase'}
                columns={tableEColumns}
                data={state.controller.data.etiquetas}
            />
          </div>
      </Tab>

    </Tabs>

  </>
  );
}

DataTagger.propTypes = {
  disabled: bool,
  controller: object.isRequired
};

DataTagger.defaultProps = {
  disabled: false
};

export default DataTagger;