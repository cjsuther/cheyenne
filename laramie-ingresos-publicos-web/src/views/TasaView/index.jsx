import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { dataTaggerActionSet, dataTaggerActionClear } from '../../context/redux/actions/dataTaggerAction';
import { useForm } from '../../components/hooks/useForm';
import { useLista } from '../../components/hooks/useLista';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { OPERATION_MODE } from '../../consts/operationMode';
import { ALERT_TYPE } from '../../consts/alertType';
import { ServerRequest } from '../../utils/apiweb';

import { Loading, InputEntidad, InputLista, SectionHeading } from '../../components/common';
import { getDateId } from '../../utils/convert';
import { CloneObject } from '../../utils/helpers';
import ShowToastMessage from '../../utils/toast';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import { useBeforeunload } from 'react-beforeunload';

function TasaView() {
     
    //parametros url
    const params = useParams();

     //variables
    const entityInit = {
        tasa: {
            id: 0,
            codigo: '',
            idTipoTributo: 0,
            idCategoriaTasa: 0,
            descripcion: '',
            porcentajeDescuento: 0
        },
        subtasas: [],
        archivos: [],
        observaciones: [],
        etiquetas: []
        }; 

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        showInfo: false,
        accordions: {
            subTasas: false
        }
    });

    const [processKey, setProcessKey] = useState(null);
    const [pendingChange, setPendingChange] = useState(false);

    useBeforeunload((event) => {
        if ((pendingChange) && (state.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    const mount = () => {
        
        const _processKey = `Tasa_${state.id??0}_${getDateId()}`;
        setProcessKey(_processKey);

        if (state.id > 0) {
            FindTasa();
        }
        else {
            dispatch(dataTaggerActionSet(_processKey, {
                Archivo: [],
                Observacion: [],
                Etiqueta: []
            }));
        }

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);    

    useEffect(() => {
        if (processKey && state.entity.tasa.id > 0) {
            dispatch(dataTaggerActionSet(processKey, {
                Archivo: state.entity.archivos,
                Observacion: state.entity.observaciones,
                Etiqueta: state.entity.etiquetas
            }));        
        }
    }, [processKey, state.entity]);

    const [ formValues, formHandle, , formSet ] = useForm({
        codigo: '',
        idTipoTributo: 0,
        idCategoriaTasa: 0,
        descripcion: '',
        porcentajeDescuento: 0
    });

    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );
  
    const [getListLista, ] = useLista({
        listas: ['TipoTributo'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            const listTipoTributo = getListLista('TipoTributo');
            const idTipoTributo = (listTipoTributo.length > 0) ? listTipoTributo[0].id : 'Todos los tributos'; 
            setState(prevState => {
                let data = CloneObject(prevState.entity);
                data.idTipoTributo = idTipoTributo;
                return {...prevState, entity: data};
            });
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoTributo',
          timeout: 0
        }
    });

    //handles
    const formHandleProxy = (event) => {
        formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (isFormValid()) {
            if (state.id === 0) {
                AddTasa();
            }
            else {
                ModifyTasa();
            }
        };
    }    

    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(processKey));
        const url = '/tasas';
        navigate(url, { replace: true });
    }
    
    // Callbacks

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
    const callbackSuccessFindTasa = (response) => {
        response.json()
        .then((data) => {
            setState(prevState => {
                return {...prevState, loading: false, entity: data};
            });
            setPendingChange(false);
            formSet({
                codigo: data.tasa.codigo,
                idTipoTributo: data.tasa.idTipoTributo,
                idCategoriaTasa: data.tasa.idCategoriaTasa,
                descripcion: data.tasa.descripcion,
                porcentajeDescuento: data.tasa.porcentajeDescuento
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

    // Functions

    function isFormValid() {
        if (formValues.codigo.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar un código de tasa');
            return false;
        }
        if (formValues.idTipoTributo <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar un tipo de tributo afectado');
            return false;
        }
        if (formValues.idCategoriaTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar una categoría de tasa');
            return false;
        }
        if (formValues.descripcion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo descripción');
            return false;
        }
        
        return true;
    }   

    function FindTasa() {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.TASA,
            paramsUrl,
            null,
            callbackSuccessFindTasa,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddTasa() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Tasa ingresada correctamente", () => {
                    dispatch(dataTaggerActionClear(processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/tasa/' + OPERATION_MODE.EDIT + '/' + row.tasa.id;
                    navigate(url, { replace: true });
                    navigate(0);
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

        const dataBody = {
            tasa: {
                ...state.entity.tasa,
                codigo: formValues.codigo,
                idTipoTributo: parseInt(formValues.idTipoTributo),
                idCategoriaTasa: parseInt(formValues.idCategoriaTasa),
                descripcion: formValues.descripcion,
                porcentajeDescuento: formValues.porcentajeDescuento
            },
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(f => f.state !== 'o') : [],
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.TASA,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }    

    function ModifyTasa() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Tasa actualizada correctamente", () => {
                dispatch(dataTaggerActionClear(processKey));
                callbackSuccessFindTasa(response);
            });
        };

        const dataBody = {
            tasa: {
                ...state.entity.tasa,
                codigo: formValues.codigo,
                idTipoTributo: parseInt(formValues.idTipoTributo),
                idCategoriaTasa: parseInt(formValues.idCategoriaTasa),
                descripcion: formValues.descripcion,
                porcentajeDescuento: formValues.porcentajeDescuento
            },
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            //subtasas: state.entity.subTasas.filter(f => f.state !== 'o'),
            
        };
        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.TASA,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ToggleAccordionInfo() {
        setState(prevState => {
            return {...prevState, showInfo: !prevState.showInfo};
        });
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
    
            <Loading visible={state.loading}></Loading>
    
            <SectionHeading title={
                <>
                Tasa ({(state.id === 0) ? 
                    <span className='text-heading-selecction'>Nueva</span> :
                    <span className='text-heading-selecction'>{state.entity.tasa.codigo}</span>
                })
                </>
            } />
    
            <div className="m-top-20">

                <section className='section-accordion'>

                    <div className="m-top-20 m-bottom-20">

                        <div className="form-content">
                            <div className='row'>

                                <div className="mb-3 col-12 col-md-4">
                                    <label htmlFor="codigo" className="form-label">Código</label>
                                    <input
                                        name="codigo"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.codigo }
                                        onChange={ formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-4">
                                <label htmlFor="idTipoTributo" className="form-label">Tipo tributo</label>
                                    <InputLista
                                        name="idTipoTributo"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.idTipoTributo }
                                        onChange={({target}) =>{
                                            let idTipoTributo = 0;
                                            let descTipoTributo = '';
                                            if (target.row) {
                                                idTipoTributo = parseInt(target.value);
                                                descTipoTributo = target.row.nombre;
                                            }
                                            formSet({...formValues, idTipoTributo: idTipoTributo, descTipoTributo: descTipoTributo});
                                            setPendingChange(true);
                                        }}
                                        lista="TipoTributo"
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-4">
                                    <label htmlFor="idCategoriaTasa" className="form-label">Categoría</label>
                                    <InputEntidad
                                        name="idCategoriaTasa"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.idCategoriaTasa }
                                        onChange={({target}) =>{
                                            let idCategoriaTasa = 0;
                                            let descCategoriaTasa = '';
                                            if (target.row) {
                                                idCategoriaTasa = parseInt(target.value);
                                                descCategoriaTasa = target.row.nombre;
                                            }
                                            formSet({...formValues, idCategoriaTasa: idCategoriaTasa, descCategoriaTasa: descCategoriaTasa});
                                            setPendingChange(true);
                                        }}
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        entidad="CategoriaTasa"
                                    />
                                </div>
                            </div>
                            
                            <div className='row'>
                                <div className="mb-3 col-12 col-md-8">
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <input
                                        name="descripcion"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.descripcion }
                                        onChange={ formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        maxLength={250}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-4">
                                    <label htmlFor="porcentajeDescuento" className="form-label">Descuento</label>
                                    <input
                                        name="porcentajeDescuento"
                                        type="number"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.porcentajeDescuento }
                                        onChange={ formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>

                            </div>
                        </div>

                        <div style={{display: "none"}}>
                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('subTasas')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.subTasas) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.subTasas ? 'active' : ''}>Sub Tasas</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.subTasas &&
                        <div className='accordion-body'>
                            {/* TODO: Insertar grilla Subtasa */}
                        </div>
                        )}
                        </div>

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordionInfo()}>
                                    <div className='accordion-header-title'>
                                        {(state.showInfo) ? accordionOpen : accordionClose}
                                        <h3 className={state.showInfo ? 'active' : ''}>Información adicional</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.showInfo &&
                        <div className='accordion-body'>
                            <DataTaggerFormRedux
                                title="Información adicional de Tasa"
                                processKey={processKey}
                                entidad="Tasa"
                                idEntidad={state.id}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                onChange={(row) => setPendingChange(true)}
                            />
                        </div>
                        )}

                    </div>
                </section>
            </div>

            <footer className='footer footer-action'>
                <div className='footer-action-container'>
                    <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
                    {state.mode !== OPERATION_MODE.VIEW &&
                    <button
                        className={pendingChange ? "btn action-button float-end" : "btn action-button btn-disabled float-end"}
                        onClick={ (event) => handleClickGuardar() }
                        disabled={!pendingChange}
                    >                    
                        Guardar
                    </button>
                    }
                </div>
            </footer>

        </>
    )
}

export default TasaView;
