import React, { useState, useEffect } from 'react';
import { number, func, bool } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { dataTaggerActionSet, dataTaggerActionClear } from '../../../context/redux/actions/dataTaggerAction';
import { InputLista, InputEntidad, InputPersona, DatePickerCustom, InputNumber } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { getDateId } from '../../../utils/convert';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerFormRedux from '../DataTaggerFormRedux';

const ControladorModal = (props) => {

    //variables
    const entityInit = {
        controlador: {
            id: 0,
            idTipoControlador: 0,
            numero: '',
            esSupervisor: false,
            fechaAlta: null,
            fechaBaja: null,
            catastralCir: '',
            catastralSec: '',
            catastralChacra: '',
            catastralLchacra: '',
            catastralQuinta: '',
            catastralLquinta: '',
            catastralFrac: '',
            catastralLfrac: '',
            catastralManz: '',
            catastralLmanz: '',
            catastralParc: '',
            catastralLparc: '',
            catastralSubparc: '',
            catastralUfunc: '',
            catastralUcomp: '',
            idPersona: 0,
            idTipoPersona: 0,
            nombrePersona: '',
            idTipoDocumento: 0,
            numeroDocumento: '',
            legajo: '',
            idOrdenamiento: 0,
            idControladorSupervisor: 0,
            clasificacion: '',
            fechaUltimaIntimacion: null,
            cantidadIntimacionesEmitidas: 0,
            cantidadIntimacionesAnuales: 0,
            porcentaje: 0
        },
        archivos: [],
        observaciones: [],
        etiquetas: []
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit,
        showInfo: false,
        accordions: {
            nomenclaturaCatastral: true,
            datosAdministrativos: false,
            datosSupervisor: false
        }
    });

    const [persona, setPersona] = useState({
        idTipoPersona: 0,
        nombrePersona: "",
        numeroDocumento: "",
        idTipoDocumento: 0  
    });

    const [processKey, setProcessKey] = useState(null);

    const mount = () => {

    const _processKey = `Controlador_${props.id??0}_${getDateId()}`;
        setProcessKey(_processKey);

        if (props.id > 0) {
            FindControlador();
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
        if (processKey && state.entity.controlador.id > 0) {
            dispatch(dataTaggerActionSet(processKey, {
                Archivo: state.entity.archivos,
                Observacion: state.entity.observaciones,
                Etiqueta: state.entity.etiquetas
            }));        
        }
    }, [processKey, state.entity]);

    const [ formValues, formHandle, , formSet ] = useForm({
        idTipoControlador: 0,
        numero: '',
        esSupervisor: false,
        fechaAlta: null,
        fechaBaja: null,
        catastralCir: '',
        catastralSec: '',
        catastralChacra: '',
        catastralLchacra: '',
        catastralQuinta: '',
        catastralLquinta: '',
        catastralFrac: '',
        catastralLfrac: '',
        catastralManz: '',
        catastralLmanz: '',
        catastralParc: '',
        catastralLparc: '',
        catastralSubparc: '',
        catastralUfunc: '',
        catastralUcomp: '',
        idPersona: 0,
        legajo: '',
        idOrdenamiento: 0,
        idControladorSupervisor: 0,
        clasificacion: '',
        fechaUltimaIntimacion: null,
        cantidadIntimacionesEmitidas: 0,
        cantidadIntimacionesAnuales: 0,
        porcentaje: 0
    });

    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.id === 0) {
                AddControlador();
            }
            else {
                ModifyControlador();
            }
        };
    };
    const handleClickCancelar = () => {
        dispatch(dataTaggerActionClear(processKey));
        props.onDismiss();
    }

    const handleChangeTipoControlador = (event) => {
        const {target} = event;
        let idTipoControlador = 0;
        let esSupervisor = false;
        if (target.row) {
            idTipoControlador = parseInt(target.value);
            esSupervisor = target.row.esSupervisor;
        }
        
        formSet({...formValues,
            idTipoControlador: idTipoControlador,
            esSupervisor: esSupervisor,
        });
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

        if (formValues.idTipoControlador <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo controlador');
            return false;
        }        
        if (formValues.numero.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número');
            return false;
        }
        if (formValues.fechaAlta === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha alta');
            return false;
        }
        if (formValues.idPersona <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Apellido y nombre');
            return false;
        }
        if (formValues.legajo.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Legajo');
            return false;
        }   
        if (formValues.idOrdenamiento <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Ordenamiento');
            return false;
        }               
        if (formValues.clasificacion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Clasificación');
            return false;
        }

        return true;
    }   

    function FindControlador() {

        setState(prevState => {
          return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                if (data.controlador.fechaAlta) data.controlador.fechaAlta = new Date(data.controlador.fechaAlta);
                if (data.controlador.fechaBaja) data.controlador.fechaBaja = new Date(data.controlador.fechaBaja);
                if (data.controlador.fechaUltimaIntimacion) data.controlador.fechaUltimaIntimacion = new Date(data.controlador.fechaUltimaIntimacion);
                data.archivos.forEach(x => {
                    if (x.fecha) x.fecha = new Date(x.fecha);
                });
                data.observaciones.forEach(x => {
                    if (x.fecha) x.fecha = new Date(x.fecha);
                });

                setState(prevState => {
                  return {...prevState, loading: false, entity: data};
                });
                formSet({
                    idTipoControlador: data.controlador.idTipoControlador,
                    numero: data.controlador.numero,
                    esSupervisor: data.controlador.esSupervisor,
                    fechaAlta: data.controlador.fechaAlta,
                    fechaBaja: data.controlador.fechaBaja,
                    catastralCir: data.controlador.catastralCir,
                    catastralSec: data.controlador.catastralSec,
                    catastralChacra: data.controlador.catastralChacra,
                    catastralLchacra: data.controlador.catastralLchacra,
                    catastralQuinta: data.controlador.catastralQuinta,
                    catastralLquinta: data.controlador.catastralLquinta,
                    catastralFrac: data.controlador.catastralFrac,
                    catastralLfrac: data.controlador.catastralLfrac,
                    catastralManz: data.controlador.catastralManz,
                    catastralLmanz: data.controlador.catastralLmanz,
                    catastralParc: data.controlador.catastralParc,
                    catastralLparc: data.controlador.catastralLparc,
                    catastralSubparc: data.controlador.catastralSubparc,
                    catastralUfunc: data.controlador.catastralUfunc,
                    catastralUcomp: data.controlador.catastralUcomp,
                    idPersona: data.controlador.idPersona,
                    legajo: data.controlador.legajo,
                    idOrdenamiento: data.controlador.idOrdenamiento,
                    idControladorSupervisor: data.controlador.idControladorSupervisor,
                    clasificacion: data.controlador.clasificacion,
                    fechaUltimaIntimacion: data.controlador.fechaUltimaIntimacion,
                    cantidadIntimacionesEmitidas: data.controlador.cantidadIntimacionesEmitidas,
                    cantidadIntimacionesAnuales: data.controlador.cantidadIntimacionesAnuales,
                    porcentaje: data.controlador.porcentaje
                });
                setPersona({
                    idTipoPersona: data.controlador.idTipoPersona,
                    nombrePersona: data.controlador.nombrePersona,
                    numeroDocumento: data.controlador.numeroDocumento,
                    idTipoDocumento: data.controlador.idTipoDocumento
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
            APIS.URLS.CONTROLADOR,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddControlador() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = null;
        SaveControlador(method, paramsUrl);
    }

    function ModifyControlador() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.id}`;
        SaveControlador(method, paramsUrl);
    }    

    function SaveControlador(method, paramsUrl) {

        setState(prevState => {
          return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
          response.json()
          .then((row) => {
            setState(prevState => {
                return {...prevState, loading: false};
            });
            dispatch(dataTaggerActionClear(processKey));
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
            controlador: {
                ...state.entity.controlador,
                idTipoControlador: parseInt(formValues.idTipoControlador),
                numero: formValues.numero,
                esSupervisor: formValues.esSupervisor,
                fechaAlta: formValues.fechaAlta,
                fechaBaja: formValues.fechaBaja,
                catastralCir: formValues.catastralCir,
                catastralSec: formValues.catastralSec,
                catastralChacra: formValues.catastralChacra,
                catastralLchacra: formValues.catastralLchacra,
                catastralQuinta: formValues.catastralQuinta,
                catastralLquinta: formValues.catastralLquinta,
                catastralFrac: formValues.catastralFrac,
                catastralLfrac: formValues.catastralLfrac,
                catastralManz: formValues.catastralManz,
                catastralLmanz: formValues.catastralLmanz,
                catastralParc: formValues.catastralParc,
                catastralLparc: formValues.catastralLparc,
                catastralSubparc: formValues.catastralSubparc,
                catastralUfunc: formValues.catastralUfunc,
                catastralUcomp: formValues.catastralUcomp,
                idPersona: parseInt(formValues.idPersona),
                idTipoPersona: parseInt(persona.idTipoPersona),
                nombrePersona: persona.nombrePersona,
                idTipoDocumento: parseInt(persona.idTipoDocumento),
                numeroDocumento: persona.numeroDocumento,
                legajo: formValues.legajo,
                idOrdenamiento: parseInt(formValues.idOrdenamiento),
                idControladorSupervisor: parseInt(formValues.idControladorSupervisor),
                clasificacion: formValues.clasificacion,
                fechaUltimaIntimacion: formValues.fechaUltimaIntimacion,
                cantidadIntimacionesEmitidas: formValues.cantidadIntimacionesEmitidas,
                cantidadIntimacionesAnuales: formValues.cantidadIntimacionesAnuales,
                porcentaje: formValues.porcentaje
            },
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(f => f.state !== 'o') : []
        };

        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.CONTROLADOR,
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

    function ToggleAccordionInfo() {
        setState(prevState => {
            return {...prevState, showInfo: !prevState.showInfo};
        });
    }

    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i>

    return (
        <>

        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-dialog-size">
            <div className="modal-content animated fadeIn">
            <div className="modal-header">
                <h2 className="modal-title">Controlador: {(props && props.id > 0) ? state.entity.controlador.numero : "Nuevo"}</h2>
            </div>
            <div className="modal-body">
                <div className="row">

                    <div className="mb-3 col-8">
                        <label htmlFor="idTipoControlador" className="form-label">Tipo controlador</label>
                        <InputEntidad
                            name="idTipoControlador"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeTipoControlador}
                            value={ formValues.idTipoControlador }
                            disabled={props.disabled}
                            title="Tipo Controlador"
                            entidad="TipoControlador"
                            onFormat= {(row) => (row) ? `${row.codigo} - ${row.nombre}` : ''}
                        />
                    </div>
                    <div className="col-4 p-top-35 form-check">
                        <label htmlFor="esSupervisor" className="form-label">Supervisor</label>
                        <input
                            name="esSupervisor"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            onChange={ formHandle }
                            checked={ formValues.esSupervisor }
                            disabled={true}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-4">
                        <label htmlFor="numero" className="form-label">Número</label>
                        <input
                            name="numero"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numero }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaAlta" className="form-label">Fecha alta</label>
                        <DatePickerCustom
                            name="fechaAlta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaAlta }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-md-4">
                        <label htmlFor="fechaBaja" className="form-label">Fecha baja</label>
                        <DatePickerCustom
                            name="fechaBaja"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaBaja }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            minValue={formValues.fechaAlta}
                        />
                    </div>

                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('nomenclaturaCatastral')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.nomenclaturaCatastral) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.nomenclaturaCatastral ? 'active' : ''}>Nomenclatura catastral</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.nomenclaturaCatastral &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralCir" className="form-label">Circunscripcion</label>
                                    <input
                                        name="catastralCir"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralCir }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralSec" className="form-label">Sección</label>
                                    <input
                                        name="catastralSec"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralSec }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralChacra" className="form-label">Chacra</label>
                                    <input
                                        name="catastralChacra"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralChacra }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralLchacra" className="form-label">Letra chacra</label>
                                    <input
                                        name="catastralLchacra"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralLchacra }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralQuinta" className="form-label">Quinta</label>
                                    <input
                                        name="catastralQuinta"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralQuinta }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralLquinta" className="form-label">Letra quinta</label>
                                    <input
                                        name="catastralLquinta"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralLquinta }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralFrac" className="form-label">Fracción</label>
                                    <input
                                        name="catastralFrac"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralFrac }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralLfrac" className="form-label">Letra fracción</label>
                                    <input
                                        name="catastralLfrac"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralLfrac }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralManz" className="form-label">Manzana</label>
                                    <input
                                        name="catastralManz"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralManz }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralLmanz" className="form-label">Letra manzana</label>
                                    <input
                                        name="catastralLmanz"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralLmanz }
                                        onChange={ formHandle }
                                        disabled={props.disabled}                                    
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralParc" className="form-label">Parcela</label>
                                    <input
                                        name="catastralParc"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralParc }
                                        onChange={ formHandle }
                                        disabled={props.disabled}   
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralLparc" className="form-label">Letra Parcela</label>
                                    <input
                                        name="catastralLparc"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralLparc }
                                        onChange={ formHandle }
                                        disabled={props.disabled}   
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralSubparc" className="form-label">Sub parcela</label>
                                    <input
                                        name="catastralSubparc"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralSubparc }
                                        onChange={ formHandle }
                                        disabled={props.disabled}   
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralUfunc" className="form-label">Unidad funcional</label>
                                    <input
                                        name="catastralUfunc"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralUfunc }
                                        onChange={ formHandle }
                                        disabled={props.disabled}   
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3">
                                    <label htmlFor="catastralUcomp" className="form-label">Unidad comp</label>
                                    <input
                                        name="catastralUcomp"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.catastralUcomp }
                                        onChange={ formHandle }
                                        disabled={props.disabled} 
                                    />
                                </div>

                            </div>
                        </div>
                        )}
                    </div>

                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('datosAdministrativos')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.datosAdministrativos) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.datosAdministrativos ? 'active' : ''}>Datos administrativos</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.datosAdministrativos &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-12">
                                    <label htmlFor="idPersona" className="form-label">Apellido y nombre</label>
                                    <InputPersona
                                        name="idPersona"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.idPersona }
                                        idTipoPersona={0}
                                        onChange={(event) => {
                                            const {target} = event;
                                            const persona = (target.row) ? {
                                              idTipoPersona: target.row.idTipoPersona,
                                              idTipoDocumento: target.row.idTipoDocumento,
                                              numeroDocumento: target.row.numeroDocumento,
                                              nombrePersona: target.row.nombrePersona
                                            } : {
                                              idTipoPersona: 0,
                                              idTipoDocumento: 0,
                                              numeroDocumento: "",
                                              nombrePersona: ""
                                            };
                                            setPersona(persona);
                                            formHandle(event);
                                          }}
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label htmlFor="legajo" className="form-label">Legajo / Matrícula</label>
                                    <input
                                        name="legajo"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.legajo }
                                        onChange={ formHandle }
                                        disabled={props.disabled} 
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label htmlFor="idOrdenamiento" className="form-label">Ordenamiento</label>
                                    <InputLista
                                        name="idOrdenamiento"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.idOrdenamiento }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                        lista="Ordenamiento"
                                    />
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                 
                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('datosSupervisor')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.datosSupervisor) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.datosSupervisor ? 'active' : ''}>Datos del supervisor</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.datosSupervisor &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-12">
                                    <label htmlFor="idControladorSupervisor" className="form-label">Apellido y nombre</label>
                                    <InputEntidad
                                        name="idControladorSupervisor"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.idControladorSupervisor }
                                        onChange={ formHandle }
                                        disabled={props.disabled}
                                        title="Supervisor"
                                        entidad="Controlador"
                                        onFormat={(row) => (row && row.id) ? `${row.nombrePersona} (Legajo: ${row.legajo})` : ''}
                                        filter={(row) => { return row.esSupervisor; }}
                                        columns={[
                                            { Header: 'Legajo', accessor: 'legajo', width: '25%' },
                                            { Header: 'Nombre y Apellido', accessor: 'nombrePersona', width: '70%' }
                                        ]}
                                        memo={false}
                                    />
                                </div>
                            </div>
                        </div>
                        )}
                    </div>

                    <div className="mb-3 col-12 col-md-8">
                        <label htmlFor="clasificacion" className="form-label">Clasificación</label>
                        <input
                            name="clasificacion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.clasificacion }
                            onChange={ formHandle }
                            disabled={props.disabled} 
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-4">
                        <label htmlFor="fechaUltimaIntimacion" className="form-label">Ultima intimación</label>
                        <DatePickerCustom
                            name="fechaUltimaIntimacion"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaUltimaIntimacion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-4">
                        <label htmlFor="cantidadIntimacionesEmitidas" className="form-label m-left-10">Cantidad intimaciones emitidas</label>
                        <InputNumber
                            name="cantidadIntimacionesEmitidas"
                            placeholder=""
                            className="form-control"
                            value={ formValues.cantidadIntimacionesEmitidas }
                            precision={0}
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-4">
                        <label htmlFor="cantidadIntimacionesAnuales" className="form-label m-left-10">Cantidad intimaciones anuales</label>
                        <InputNumber
                            name="cantidadIntimacionesAnuales"
                            placeholder=""
                            className="form-control"
                            value={ formValues.cantidadIntimacionesAnuales }
                            precision={0}
                            onChange={ formHandle }
                            disabled={true}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-4">
                        <label htmlFor="porcentaje" className="form-label m-left-10">Porcentaje</label>
                        <InputNumber
                            name="porcentaje"
                            placeholder=""
                            className="form-control"
                            value={ formValues.porcentaje }
                            precision={2}
                            onChange={ formHandle }
                            validation={(value => {
                                return (value >= 0 && value <= 100);
                            })}
                            disabled={true}
                        />
                    </div>

                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordionInfo()}>
                                    <div className='accordion-header-title'>
                                        {(state.showInfo) ? accordionOpen : accordionClose}
                                        <h3 className={state.showInfo ? 'active' : ''}>Información adicional</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {state.showInfo &&
                        <div className='accordion-body'>
                            <DataTaggerFormRedux
                                title="Información adicional de Controlador"
                                processKey={processKey}
                                entidad="Controlador"
                                idEntidad={props.id}
                                disabled={props.disabled}
                            />
                        </div>
                        }
                    </div>                    

                </div>
            </div>
            <div className="modal-footer">
                {!props.disabled &&
                <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
                }
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => handleClickCancelar() }>Cancelar</button>
            </div>
            </div>
        </div>
        </div>

        </>
    );
}

ControladorModal.propTypes = {
    disabled: bool,
    id: number.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
  };
  
ControladorModal.defaultProps = {
    disabled: false
};

export default ControladorModal;