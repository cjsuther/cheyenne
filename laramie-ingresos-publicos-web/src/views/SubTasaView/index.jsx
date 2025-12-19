import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { dataTaggerActionSet, dataTaggerActionClear } from '../../context/redux/actions/dataTaggerAction';
import { useForm } from '../../components/hooks/useForm';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { OPERATION_MODE } from '../../consts/operationMode';
import { ALERT_TYPE } from '../../consts/alertType';
import { ServerRequest } from '../../utils/apiweb';

import { Loading, InputNumber, DatePickerCustom, SectionHeading, InputTasa } from '../../components/common';
import { getDateId } from '../../utils/convert';
import { CloneObject } from '../../utils/helpers';
import ShowToastMessage from '../../utils/toast';
import SubTasaImputacionesGrid from '../../components/controls/SubTasaImputacionesGrid';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import { useBeforeunload } from 'react-beforeunload';

function SubTasaView() {
     
    //parametros url
    const params = useParams();
    
    let navigate = useNavigate();

     //variables
    const entityInit = {
        subTasa: {
            id: 0,
            idTasa: 0,
            descTasa: '',
            descTipoTributo: '',
            descCategoriaTasa: '',
            codigo: '',
            descripcion: '',
            impuestoNacional: 0,
            impuestoProvincial: 0,
            ctasCtes: 0,
            timbradosExtras: 0,
            descripcionReducida: '',
            fechaDesde: null,
            fechaHasta: null,
            rubroGenerico: false,
            liquidableCtaCte: false,
            liquidableDDJJ: false,
            actualizacion: false,
            accesorios: false,
            internetDDJJ: false,
            imputXPorc: false
        },
        archivos: [],
        observaciones: [],
        etiquetas: [],
        subTasaImputaciones: []
    }; 

    // Hooks

    const [state, setState] = useState({
        processKey: `SubTasa_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        accordions:
        {
            imputaciones: false,
        },
        showInfo: false
    });
    const [pendingChange, setPendingChange] = useState(false);
    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );

    useBeforeunload((event) => {
        if ((pendingChange) && (state.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    const mount = () => {        
        if (state.id > 0) {
            FindSubTasa();
        }
        else {
            dispatch(dataTaggerActionSet(state.processKey, {
                Archivo: [],
                Observacion: [],
                Etiqueta: []
            }));
        }

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, , formSet ] = useForm({
        idTasa: 0,
        descTasa: '',
        codigo: '',
        descripcion: '',
        impuestoNacional: 0,
        impuestoProvincial: 0,
        ctasCtes: 0,
        timbradosExtras: 0,
        descripcionReducida: '',
        fechaDesde: null,
        fechaHasta: null,
        rubroGenerico: false,
        liquidableCtaCte: false,
        liquidableDDJJ: false,
        actualizacion: false,
        accesorios: false,
        internetDDJJ: false,
        imputXPorc: false
    });

    // Handlers
    const formHandleProxy = (event) => {
        formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (isFormValid()) {
            if (state.id === 0) {
                AddSubTasa();
            }
            else {
                ModifySubTasa();
            }
        };
    }    

    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        navigate("/sub-tasas", { replace: true });
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
    const callbackSuccessFindSubTasa = (response) => {
        response.json()
        .then((data) => {

            //deserialize date fields
            if (data.subTasa.fechaDesde) data.subTasa.fechaDesde = new Date(data.subTasa.fechaDesde);
            if (data.subTasa.fechaHasta) data.subTasa.fechaHasta = new Date(data.subTasa.fechaHasta);

            data.archivos.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });
            data.observaciones.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });

            setState(prevState => {
                return {...prevState, loading: false, entity: data};
            });
            setPendingChange(false);
            formSet({
                idTasa: data.subTasa.idTasa,
                codigo: data.subTasa.codigo,
                descripcion: data.subTasa.descripcion,
                impuestoNacional: data.subTasa.impuestoNacional,
                impuestoProvincial: data.subTasa.impuestoProvincial,
                ctasCtes: data.subTasa.ctasCtes,
                timbradosExtras: data.subTasa.timbradosExtras,
                descripcionReducida: data.subTasa.descripcionReducida,
                fechaDesde: data.subTasa.fechaDesde,
                fechaHasta: data.subTasa.fechaHasta,
                rubroGenerico: data.subTasa.rubroGenerico,
                liquidableCtaCte: data.subTasa.liquidableCtaCte,
                liquidableDDJJ: data.subTasa.liquidableDDJJ,
                actualizacion: data.subTasa.actualizacion,
                accesorios: data.subTasa.accesorios,
                internetDDJJ: data.subTasa.internetDDJJ,
                imputXPorc: data.subTasa.imputXPorc
            });
            dispatch(dataTaggerActionSet(state.processKey, {
                Archivo: data.archivos,
                Observacion: data.observaciones,
                Etiqueta: data.etiquetas
            }));
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
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar un código de sub tasa');
            return false;
        }
        if (formValues.descripcion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo descripción');
            return false;
        }
        
        return true;
    }   

    function FindSubTasa() {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.SUB_TASA,
            paramsUrl,
            null,
            callbackSuccessFindSubTasa,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddSubTasa() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Sub tasa ingresada correctamente", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/sub-tasa/' + OPERATION_MODE.EDIT + '/' + row.subTasa.id
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
            subTasa: {
                ...state.entity.subTasa,
                idTasa: parseInt(formValues.idTasa),
                codigo: formValues.codigo,
                descripcion: formValues.descripcion,
                impuestoNacional: formValues.impuestoNacional,
                impuestoProvincial: formValues.impuestoProvincial,
                ctasCtes: formValues.ctasCtes,
                timbradosExtras: formValues.timbradosExtras,
                descripcionReducida: formValues.descripcionReducida,
                fechaDesde: formValues.fechaDesde,
                fechaHasta: formValues.fechaHasta,
                rubroGenerico: formValues.rubroGenerico,
                liquidableCtaCte: formValues.liquidableCtaCte,
                liquidableDDJJ: formValues.liquidableDDJJ,
                actualizacion: formValues.actualizacion,
                accesorios: formValues.accesorios,
                internetDDJJ: formValues.internetDDJJ,
                imputXPorc: formValues.imputXPorc
            },
            archivos: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            subTasaImputaciones: []
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.SUB_TASA,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }    

    function ModifySubTasa() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Sub tasa actualizada correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                callbackSuccessFindSubTasa(response);
            });
        };

        const dataBody = {
            subTasa: {
                ...state.entity.subTasa,
                idTasa: parseInt(formValues.idTasa),
                codigo: formValues.codigo,
                descripcion: formValues.descripcion,
                impuestoNacional: formValues.impuestoNacional,
                impuestoProvincial: formValues.impuestoProvincial,
                ctasCtes: formValues.ctasCtes,
                timbradosExtras: formValues.timbradosExtras,
                descripcionReducida: formValues.descripcionReducida,
                fechaDesde: formValues.fechaDesde,
                fechaHasta: formValues.fechaHasta,
                rubroGenerico: formValues.rubroGenerico,
                liquidableCtaCte: formValues.liquidableCtaCte,
                liquidableDDJJ: formValues.liquidableDDJJ,
                actualizacion: formValues.actualizacion,
                accesorios: formValues.accesorios,
                internetDDJJ: formValues.internetDDJJ,
                imputXPorc: formValues.imputXPorc
            },
            archivos: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            subTasaImputaciones: state.entity.subTasaImputaciones.filter(f => f.state !== 'o'),
            
        };
        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.SUB_TASA,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function UpdateEntity(typeEntity, row) {
        // o:original a:add m:modify r:remove c:modify only childs

        let entity = CloneObject(state.entity);

        if (typeEntity === 'SubTasaImputacion') {
            if (row.state === 'a') {
                entity.subTasaImputaciones.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.subTasaImputaciones.indexOf(entity.subTasaImputaciones.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.subTasaImputaciones[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.subTasaImputaciones = entity.subTasaImputaciones.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.subTasaImputaciones.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        setState(prevState => {
            return {...prevState, entity: entity};
        });
        setPendingChange(true);
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
    
            <div className='section-frames'>
            <div className='section-main'>

            <SectionHeading title={
                <>
                Sub Tasa ({(state.id === 0) ? 
                    <span className='text-heading-selecction'>Nueva</span> :
                    <span className='text-heading-selecction'>{state.entity.subTasa.codigo}</span>
                })
                </>
            } />

                <section className='section-accordion'>

                    <div className='row form-basic'>

                        <div className="col-12">
                            <label htmlFor="idTasa" className="form-label">Tasa</label>
                            <InputTasa
                                name="idTasa"
                                placeholder=""
                                className="form-control"
                                value={formValues.idTasa}
                                disabled={state.mode !== OPERATION_MODE.NEW} // Unicamente se puede modificar cuando se crea la subtasa.
                                onChange={({target}) =>{
                                    let idTasa = 0;
                                    let descTasa = '';
                                    if (target.row) {
                                        idTasa = parseInt(target.value);
                                        descTasa = target.row.descripcion;
                                    }
                                    formSet({...formValues, idTasa: idTasa, descTasa: descTasa});
                                }}
                            />
                        </div>
                        <hr className="mb-3"></hr>
                        <div className="col-12 col-md-4 col-lg-4">
                            <label htmlFor="codigo" className="form-label">Subtasa</label>
                            <input
                                name="codigo"
                                type="text"
                                placeholder=""
                                className="form-control"
                                value={ formValues.codigo }
                                onChange={ formHandleProxy }
                                disabled={ state.mode === OPERATION_MODE.VIEW }
                            />
                        </div>    
                        <div className="col-12 col-md-8 col-lg-8">
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <input
                                name="descripcion"
                                type="text"
                                placeholder=""
                                className="form-control"
                                value={ formValues.descripcion }
                                onChange={ formHandleProxy }
                                disabled={ state.mode === OPERATION_MODE.VIEW }
                            />
                        </div>
                        <div className="col-12 col-md-4">
                            <label htmlFor="impuestoNacional" className="form-label">Imp. Nacional</label>
                            <InputNumber
                                name="impuestoNacional"
                                placeholder=""
                                className="form-control"
                                value={ formValues.impuestoNacional }
                                onChange={ formHandleProxy }
                                precision={2}
                                disabled={ state.mode === OPERATION_MODE.VIEW }
                            />
                        </div>                                
                        <div className="col-6 col-md-4">
                            <label htmlFor="impuestoProvincial" className="form-label">Imp. Provincial</label>
                            <InputNumber
                                name="impuestoProvincial"
                                placeholder=""
                                className="form-control"
                                value={ formValues.impuestoProvincial }
                                onChange={ formHandleProxy }
                                precision={2}
                                disabled={ state.mode === OPERATION_MODE.VIEW }
                            />
                        </div>
                        <div className="col-6 col-md-4">
                            <label htmlFor="ctasCtes" className="form-label">Ctas. Ctes.</label>
                            <InputNumber
                                name="ctasCtes"
                                placeholder=""
                                className="form-control"
                                value={ formValues.ctasCtes }
                                onChange={ formHandleProxy }
                                precision={2}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-12 col-md-4 col-lg-4">
                            <label htmlFor="timbradosExtras" className="form-label">Timbrados extras</label>
                            <InputNumber
                                name="timbradosExtras"
                                placeholder=""
                                className="form-control"
                                value={ formValues.timbradosExtras }
                                onChange={ formHandleProxy }
                                precision={2}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-12 col-md-8 col-lg-8">
                            <label htmlFor="descripcionReducida" className="form-label">Descripción reducida</label>
                            <input
                                name="descripcionReducida"
                                type="text"
                                placeholder=""
                                className="form-control"
                                value={ formValues.descripcionReducida }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-6 col-md-4 col-lg-4">
                            <label htmlFor="fechaDesde" className="form-label">Fecha desde</label>
                            <DatePickerCustom
                                name="fechaDesde"
                                placeholder=""
                                className="form-control"
                                value={ formValues.fechaDesde }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-6 col-md-4 col-lg-4">
                            <label htmlFor="fechaHasta" className="form-label">Fecha hasta</label>
                            <DatePickerCustom
                                name="fechaHasta"
                                placeholder=""
                                className="form-control"
                                value={ formValues.fechaHasta }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                minValue={formValues.fechaDesde}
                            />
                        </div>
                        <div className="mb-3 col-6 col-md-4 col-lg-4 p-top-35 form-check">
                            <label htmlFor="rubroGenerico" className="form-check-label">Rubro genérico</label>
                            <input
                                name="rubroGenerico"
                                type="checkbox"
                                className="form-check-input"
                                value={ '' }
                                checked={ formValues.rubroGenerico }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 form-check">
                            <label htmlFor="liquidableCtaCte" className="form-check-label">Liquidable Cta Cte</label>
                            <input
                                name="liquidableCtaCte"
                                type="checkbox"
                                className="form-check-input"
                                value={''}
                                checked={ formValues.liquidableCtaCte }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 form-check">
                            <label htmlFor="liquidableDDJJ" className="form-check-label">Liquidable DDJJ</label>
                            <input
                                name="liquidableDDJJ"
                                type="checkbox"
                                className="form-check-input"
                                value={ '' }
                                checked={ formValues.liquidableDDJJ }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 form-check">
                            <label htmlFor="actualizacion" className="form-check-label">Actualización</label>
                            <input
                                name="actualizacion"
                                type="checkbox"
                                className="form-check-input"
                                value={ '' }
                                checked={ formValues.actualizacion }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 form-check">
                            <label htmlFor="accesorios" className="form-check-label">Accesorios</label>
                            <input
                                name="accesorios"
                                type="checkbox"
                                className="form-check-input"
                                value={ '' }
                                checked={ formValues.accesorios }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 form-check">
                            <label htmlFor="internetDDJJ" className="form-check-label">DDJJ Internet</label>
                            <input
                                name="internetDDJJ"
                                type="checkbox"
                                className="form-check-input"
                                value={ '' }
                                checked={ formValues.internetDDJJ }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className=" col-6 col-md-4 col-lg-2 form-check">
                            <label htmlFor="imputXPorc" className="form-check-label">Imput x Porc</label>
                            <input
                                name="imputXPorc"
                                type="checkbox"
                                className="form-check-input"
                                value={ '' }
                                checked={ formValues.imputXPorc }
                                onChange={ formHandleProxy }
                                disabled={state.mode === OPERATION_MODE.VIEW}
                            />
                        </div>

                    </div>

                    {state.mode !== OPERATION_MODE.NEW &&
                    <>
                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('imputaciones')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.imputaciones) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.imputaciones ? 'active' : ''}>Imputaciones</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.imputaciones &&
                    <div className='accordion-body'>
                        <SubTasaImputacionesGrid
                            processKey={state.processKey}
                            disabled={state.mode !== OPERATION_MODE.EDIT}
                            data={{
                                idTasa: formValues.idTasa,
                                idSubTasa: state.id,
                                list: state.entity.subTasaImputaciones
                            }}
                            onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                        />
                    </div>
                    )}
                    </>
                    }

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
                            title="Información adicional de la Sub Tasa"
                            processKey={state.processKey}
                            entidad="SubTasa"
                            idEntidad={state.id}
                            disabled={state.mode !== OPERATION_MODE.EDIT}
                            onChange={(row) => setPendingChange(true)}
                        />
                    </div>
                    )}

                </section>
            </div>

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

export default SubTasaView;
