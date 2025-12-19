import React, { useState, useEffect } from 'react';
import { number, func, bool, array } from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { isNull, isValidNumber, isValidPercent } from '../../../utils/validator';
import ShowToastMessage from '../../../utils/toast';
import { CloneObject, OpenObjectURL } from '../../../utils/helpers';
import { DatePickerCustom, InputNumber, InputCodigo, TableCustom } from '../../common';
import { useLista } from '../../hooks/useLista';


const TipoActoProcesalModal = (props) => {

    //variables
    const entityInit = {
        id: 0,
        idTipoActoProcesal: 0,
        codigoActoProcesal: '',
        descripcion: '',
        plazoDias: 0,
        porcentajeHonorarios: 0,
        fechaBaja: null,
        nivel: 1,
        orden: 1
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit,
        accordions: {
            modelosAsociados: false
          },
        showInfo: false
    });   
    
    const [plantillasDocumentos, setPlantillasDocumentos] = useState([]);
    
    const mount = () => {

        if (props.id > 0) {
            FindTipoActoProcesal();
            SearchPlantillasDocumentos();
        }
   
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, , formSet ] = useForm({
        codigoActoProcesal: '',
        descripcion: '',
        plazoDias: 0,
        porcentajeHonorarios: 0,
        fechaBaja: null,
        idPlantillaDocumentoDisponible: 0
    });

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

    const cellVMR = (data) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickDocDownload(data.value) } className="link">
                                        <i className="fa fa-download" title="descargar"></i>
                                    </div>
                                    {!props.disabled &&
                                    <div onClick={ (event) => handleClickDocRemove(data.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    }
                                </div>

    const tableColumns = [
        { Header: 'Tipo Plantilla', Cell: (data) => { return getDescTipoPlantillaDocumento(data.value); }, accessor: 'idTipoPlantillaDocumento', width: '40%' },
        { Header: 'Descripción', accessor: 'descripcion', width: '50%' },
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];
    
    //handles
    const handleClickDocDownload = (id) => {

        const rowForm = plantillasDocumentos.find(x => x.id === id);
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
        const paramsUrl = `/${rowForm.path}`;
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
    const handleClickDocAdd = () => {
        const id = formValues.idPlantillaDocumentoDisponible;
        let list = [...plantillasDocumentos];
        let doc = list.find(f => f.id === id);
        doc.selected = true;
        doc.modified = true;
        formSet({...formValues, idPlantillaDocumentoDisponible: 0});
        setPlantillasDocumentos(list);
    }
    const handleClickDocRemove = (id) => {
        let list = [...plantillasDocumentos];
        let doc = list.find(f => f.id === id);
        doc.selected = false;
        doc.modified = true;
        setPlantillasDocumentos(list);
    }

    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.id == 0 || props.addChildren) {
                AddTipoActoProcesal();
            }
            else {
                ModifyTipoActoProcesal();
            }
        };
    }
    const handleClickCancelar = () => {
        props.onDismiss();
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

        if (formValues.codigoActoProcesal.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Acto Procesal');
            return false;
        }    
        if (formValues.descripcion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Descripción');
            return;
        }    
        if (!isValidNumber(formValues.plazoDias, true)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Plazo días');
            return false;
        }
        if (!isValidNumber(formValues.porcentajeHonorarios, true)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo % Honorarios');
            return false;
        }

        return true;
    }   
    
    function FindTipoActoProcesal() {
    
        setState(prevState => {
          return {...prevState, loading: true};
        });

        
    
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {       
                if (data.fechaBaja) data.fechaBaja = new Date(data.fechaBaja);     
                
                if (props.addChildren){
                    setState(prevState => {
                        return{...prevState,
                            entity: {
                                idTipoActoProcesal: data.id,
                                nivel: data.nivel + 1,
                                orden: data.orden + 1
                            }
                        }
                    });
                }
                else{
                    setState(prevState => {
                        return {...prevState, loading: false, entity: data};
                      });
                }

                formSet({
                    codigoActoProcesal: (!props.addChildren) ? data.codigoActoProcesal : "",
                    descripcion: (!props.addChildren) ? data.descripcion : "",
                    plazoDias: (!props.addChildren) ? data.plazoDias : 0,
                    porcentajeHonorarios: (!props.addChildren) ? data.porcentajeHonorarios : 0,
                    fechaBaja: (!props.addChildren) ? data.fechaBaja : null,
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
            APIS.URLS.TIPO_ACTO_PROCESAL,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    function AddTipoActoProcesal() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = null;
        SaveTipoActoProcesal(method, paramsUrl);
    }
    function ModifyTipoActoProcesal() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.id}`;
        SaveTipoActoProcesal(method, paramsUrl);
    }    
    function SaveTipoActoProcesal(method, paramsUrl) {

        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
          response.json()
          .then((row) => {
            setState(prevState => {
                return {...prevState, loading: false};
            });

            if (plantillasDocumentos.filter(f => f.modified).length > 0) {
                SavePlantillasDocumentos();
            }
            else {
                props.onConfirm(row.id);
            }

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
            idTipoActoProcesal: state.entity.idTipoActoProcesal,
            codigoActoProcesal: formValues.codigoActoProcesal,
            descripcion: formValues.descripcion,
            plazoDias: formValues.plazoDias,
            porcentajeHonorarios: formValues.porcentajeHonorarios,
            fechaBaja: formValues.fechaBaja,
            nivel: state.entity.nivel,
            orden: state.entity.orden
        };  
    
        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.TIPO_ACTO_PROCESAL,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    function SearchPlantillasDocumentos() {

        setState(prevState => {
            return {...prevState, loading: true};
        });
        setPlantillasDocumentos([]);

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                let list = props.list.map(x => {
                    x.selected = (!isNull(data.find(f => f.id === x.id)));
                    x.modified = false;
                    return x;
                });
                setPlantillasDocumentos(list);
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const paramsUrl = `/tipo-acto-procesal/${props.id}`;

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
    function SavePlantillasDocumentos() {

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
            plantillasDocumentos: plantillasDocumentos.filter(f => f.selected).map(x => x.id)
        };
        const paramsUrl = `/${props.id}/plantilla-documento`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.TIPO_ACTO_PROCESAL,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }


    function ToggleAccordion(accordion) {
        let accordions = CloneObject(state.accordions);
        accordions[accordion] = !accordions[accordion];
        setState(prevState => {
            return {...prevState, accordions: accordions};
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
            <h2 className="modal-title">Tipo Acto Procesal: {(props && props.id > 0) ? state.entity.codigoActoProcesal : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-12 col-md-6 col-xl-4">
                    <label htmlFor="codigoActoProcesal" className="form-label">Acto Procesal</label>
                    <input
                        type="text"
                        name="codigoActoProcesal"
                        placeholder=""
                        className="form-control"
                        value={ formValues.codigoActoProcesal }
                        onChange={ formHandle }
                        disabled={props.disabled}
                        maxLength={20}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6 col-xl-8">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <input
                        name="descripcion"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.descripcion }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6 col-xl-4">
                    <label htmlFor="plazoDias" className="form-label m-left-10">Plazo días</label>
                    <InputNumber
                        name="plazoDias"
                        placeholder=""
                        className="form-control"
                        value={formValues.plazoDias }
                        precision={0}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6 col-xl-4">
                    <label htmlFor="porcentajeHonorarios" className="form-label m-left-10">% Honorarios</label>
                    <InputNumber
                        name="porcentajeHonorarios"
                        placeholder=""
                        className="form-control"
                        value={formValues.porcentajeHonorarios }
                        precision={2}
                        validation={isValidPercent}
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-xl-4">
                    <label htmlFor="fechaBaja" className="form-label">Baja</label>
                    <DatePickerCustom
                        name="fechaBaja"
                        placeholder=""
                        className="form-control"
                        value={ formValues.fechaBaja }
                        onChange={ formHandle }
                        disabled={props.disabled}
                    />
                </div>

                {props.id > 0 && 
                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('modelosAsociados')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.modelosAsociados) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.modelosAsociados ? 'active' : ''}>Modelos asociados</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.modelosAsociados &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>

                            {!props.disabled &&
                            <>
                            <div className="mb-3 col-8">
                                <label htmlFor="idPlantillaDocumentoDisponible" className="form-label">Plantillas disponibles</label>
                                <select
                                    name="idPlantillaDocumentoDisponible"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idPlantillaDocumentoDisponible }
                                    onChange={ formHandle }
                                >
                                <option value={0}></option>
                                {plantillasDocumentos.filter(f => !f.selected).map((item, index) =>
                                    <option value={item.id} key={index}>{`${getDescTipoPlantillaDocumento(item.idTipoPlantillaDocumento)} - ${item.descripcion}`}</option>
                                )}
                                </select>
                            </div>
                            <div className="mb-3 col-4 m-top-32">
                                {formValues.idPlantillaDocumentoDisponible > 0 &&
                                <button className="btn btn-primary float-end" data-dismiss="modal" onClick={ (event) => handleClickDocAdd() }>Agregar Modelo</button>
                                }
                            </div>
                            </>
                            }
                            <div className="mb-3 col-12">
                                <TableCustom
                                    showFilterGlobal={false}
                                    showPagination={false}
                                    className={'TableCustomBase'}
                                    columns={tableColumns}
                                    data={ plantillasDocumentos.filter(f => f.selected) }
                                />
                            </div>

                        </div>
                    </div>
                    )}
                </div>
                }

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

TipoActoProcesalModal.propTypes = {
    disabled: bool,
    id: number.isRequired,
    addChildren: bool.isRequired,
    list: array.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

TipoActoProcesalModal.defaultProps = {
    disabled: false
};

export default TipoActoProcesalModal;