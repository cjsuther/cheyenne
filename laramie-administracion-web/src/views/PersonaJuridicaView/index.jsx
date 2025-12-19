import React, { useState, useEffect, useRef } from 'react';
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

import { Loading, InputEntidad, InputLista, DatePickerCustom, SectionHeading } from '../../components/common';
import { getDateId } from '../../utils/convert';
import { CloneObject, GetMeses } from '../../utils/helpers';
import ShowToastMessage from '../../utils/toast';
import DireccionForm, {GetDataDireccion, IsValidDireccion} from '../../components/controls/DireccionForm';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import DocumentosGrid from '../../components/controls/DocumentosGrid';
import ContactosGrid from '../../components/controls/ContactosGrid';
import MediosPagoGrid from '../../components/controls/MediosPagoGrid';
import RubrosAfipGrid from '../../components/controls/RubrosAfipGrid';

import companyProfile from '../../assets/images/company-profile.png';
import { isNull } from '../../utils/validator';
import { useBeforeunload } from 'react-beforeunload';


function PersonaJuridicaView() {
     
    //parametros url
    const params = useParams();

    //variables
    const entityInit = {
        persona: {
            id: 0,
            idTipoDocumento: 0,
            numeroDocumento: '',
            denominacion: '',
            nombreFantasia: '',
            idFormaJuridica: 0,
            idJurisdiccion: 0,
            fechaConstitucion: null,
            mesCierre: 0,
            logo: ''
        },
        domicilioLegal: {
            id: 0,
            entidad: "PersonaJuridicaDomicilioLegal",
            idEntidad: 0,
            idTipoGeoreferencia: 0,
            idPais: 0,
            idProvincia: 0,
            idLocalidad: 0,
            idZonaGeoreferencia: 0,
            codigoPostal: "",
            calle: "",
            entreCalle1: "",
            entreCalle2: "",
            altura: "",
            piso: "",
            dpto: "",
            referencia: "",
            longitud: 0,
            latitud: 0
        },
        domicilioFiscal: {
            id: 0,
            entidad: "PersonaJuridicaDomicilioFiscal",
            idEntidad: 0,
            idTipoGeoreferencia: 0,
            idPais: 0,
            idProvincia: 0,
            idLocalidad: 0,
            idZonaGeoreferencia: 0,
            codigoPostal: "",
            calle: "",
            entreCalle1: "",
            entreCalle2: "",
            altura: "",
            piso: "",
            dpto: "",
            referencia: "",
            longitud: 0,
            latitud: 0
        },
        archivos: [],
        observaciones: [],
        etiquetas: [],
        documentos: [],
        contactos: [],
        mediosPago: [],
        rubrosAfip: []
    };     

    //hooks
    const [state, setState] = useState({
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        showInfo: false,    
        accordions: {
            documentos: false,
            contactos: false,
            domicilioLegal: false,
            domicilioFiscal: false,
            mediosPago: false,
            rubrosAfip: false
        },
        showMenu: false
    });

    const [pendingChange, setPendingChange] = useState(false);

    const refInputFileLogo = useRef(null);

    const [processKey, setProcessKey] = useState(null);

    useBeforeunload((event) => {
        if ((pendingChange) && (state.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    const mount = () => {

        const _processKey = `PersonaJuridica_${state.id??0}_${getDateId()}`;
        setProcessKey(_processKey);

        if (state.id > 0) {
            FindPersonaJuridica();
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
        if (processKey && state.entity.persona.id > 0) {
            dispatch(dataTaggerActionSet(processKey, {
                Archivo: state.entity.archivos,
                Observacion: state.entity.observaciones,
                Etiqueta: state.entity.etiquetas
            }));        
        }
    }, [processKey, state.entity]);

    const [ formValues, formHandle, , formSet ] = useForm({
		idTipoDocumento: 0,
		numeroDocumento: '',
		denominacion: '',
		nombreFantasia: '',
		idFormaJuridica: 0,
		idJurisdiccion: 0,
		fechaConstitucion: null,
		mesCierre: 0,
		logo: ''
    });

    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );
    
    const [getListLista, ] = useLista({
        listas: ['TipoGeoreferencia'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            const listTipoGeoreferencia = getListLista('TipoGeoreferencia');
            const idTipoGeoreferencia = (listTipoGeoreferencia.length > 0) ? listTipoGeoreferencia[0].id : 530; //el primero u Open Street Map
            setState(prevState => {
                let data = CloneObject(prevState.entity);
                data.domicilioLegal.idTipoGeoreferencia = idTipoGeoreferencia;
                data.domicilioFiscal.idTipoGeoreferencia = idTipoGeoreferencia;
                return {...prevState, entity: data};
            });
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoGeoreferencia',
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
                AddPersonaJuridica();
            }
            else {
                ModifyPersonaJuridica();
            }
        };
    } 
    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(processKey));
        const url = APPCONFIG.SITE.WEBAPP + 'personas-juridicas';
        window.location.href = url;
    }
    const handleInputFileLogoChange = (event) => {
        if (event.target.files.length === 0) {
            event.preventDefault();
            return;
        }

        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = (e) => {
            const urlLogo = e.target.result;
            formSet({...formValues, logo: urlLogo});
        }
        reader.onerror = (error) => {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
        }
        setPendingChange(true);
        reader.readAsDataURL(file);
        event.target.value = "";
    }
    const handleClickRermoveLogo = () => {
        formSet({...formValues, logo: ""});
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
    const callbackSuccessFindPersonaJuridica = (response) => {
        response.json()
        .then((data) => {
            if (data.persona.fechaConstitucion) data.persona.fechaConstitucion = new Date(data.persona.fechaConstitucion);
 
            data.mediosPago.forEach(x => {
                if (x.fechaVencimiento) x.fechaVencimiento = new Date(x.fechaVencimiento);
            });

            setState(prevState => {
                return {...prevState, loading: false, entity: data};
            });
            setPendingChange(false);
            formSet({
                idTipoDocumento: data.persona.idTipoDocumento,
                numeroDocumento: data.persona.numeroDocumento,
                denominacion: data.persona.denominacion,
                nombreFantasia: data.persona.nombreFantasia,
                idFormaJuridica: data.persona.idFormaJuridica,
                idJurisdiccion: data.persona.idJurisdiccion,
                fechaConstitucion: data.persona.fechaConstitucion,
                mesCierre: data.persona.mesCierre,
                logo: data.persona.logo             
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
    
    //funciones

    function isFormValid() {
        if (formValues.idTipoDocumento <= 0 || formValues.numeroDocumento.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar un Documento');
            return false;
        }
        if (formValues.denominacion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Denominación');
            return false;
        }
        if (formValues.nombreFantasia.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Nombre de fantasia');
            return false;
        }   
        if (formValues.idFormaJuridica <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Forma juridica');
            return false;
        }
        if (formValues.idJurisdiccion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Jurisdiccion');
            return false;
        }    
        if (formValues.fechaConstitucion === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Fecha de constitucion');
            return false;
        }
        
        const isValidDomicilioLegal = IsValidDireccion.get("PersonaJuridicaDomicilioLegal")();
        if (!isValidDomicilioLegal.result) {
          ShowToastMessage(ALERT_TYPE.ALERT_WARNING, isValidDomicilioLegal.message);
          return false;
        }
        const isValidDomicilioFiscal = IsValidDireccion.get("PersonaJuridicaDomicilioFiscal")();
        if (!isValidDomicilioFiscal.result) {
          ShowToastMessage(ALERT_TYPE.ALERT_WARNING, isValidDomicilioFiscal.message);
          return false;
        }

        return true;
    }   
    
    function FindPersonaJuridica() {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PERSONA_JURIDICA,
            paramsUrl,
            null,
            callbackSuccessFindPersonaJuridica,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddPersonaJuridica() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Persona Juridica ingresada correctamente", () => {
                    dispatch(dataTaggerActionClear(processKey));
                    const url = APPCONFIG.SITE.WEBAPP + 'persona-juridica/' + OPERATION_MODE.EDIT + '/' + row.persona.id;
                    //const url = APPCONFIG.SITE.WEBAPP + 'personas-juridicas';
                    window.location.href = url;
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
            persona: {
                ...state.entity.persona,
                idTipoDocumento: parseInt(formValues.idTipoDocumento),
                numeroDocumento: formValues.numeroDocumento,
                denominacion: formValues.denominacion,
                nombreFantasia: formValues.nombreFantasia,
                idFormaJuridica: parseInt(formValues.idFormaJuridica),
                idJurisdiccion: parseInt(formValues.idJurisdiccion),
                fechaConstitucion: formValues.fechaConstitucion,
                mesCierre: formValues.mesCierre,
                logo: formValues.logo
            },
            domicilioLegal: GetDataDireccion.get("PersonaJuridicaDomicilioLegal")(),
            domicilioFiscal: GetDataDireccion.get("PersonaJuridicaDomicilioFiscal")(),
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            documentos: state.entity.documentos.filter(f => f.state !== 'o'),
            contactos: state.entity.contactos.filter(f => f.state !== 'o'),
            mediosPago: state.entity.mediosPago.filter(f => f.state !== 'o'),
            rubrosAfip: state.entity.rubrosAfip.filter(f => f.state !== 'o'),
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.PERSONA_JURIDICA,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    } 

    function ModifyPersonaJuridica() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Persona Juridica actualizada correctamente", () => {
                dispatch(dataTaggerActionClear(processKey));
                callbackSuccessFindPersonaJuridica(response);
                // const url = APPCONFIG.SITE.WEBAPP + 'personas-juridicas';
                // window.location.href = url;
            });
        };

        const dataBody = {
            persona: {
                ...state.entity.persona,  
                idTipoDocumento: parseInt(formValues.idTipoDocumento),
                numeroDocumento: formValues.numeroDocumento,
                denominacion: formValues.denominacion,
                nombreFantasia: formValues.nombreFantasia,
                idFormaJuridica: parseInt(formValues.idFormaJuridica),
                idJurisdiccion: parseInt(formValues.idJurisdiccion),
                fechaConstitucion: formValues.fechaConstitucion,
                mesCierre: formValues.mesCierre,
                logo: formValues.logo
            },
            domicilioLegal: GetDataDireccion.get("PersonaJuridicaDomicilioLegal")(),
            domicilioFiscal: GetDataDireccion.get("PersonaJuridicaDomicilioFiscal")(),
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            documentos: state.entity.documentos.filter(f => f.state !== 'o'),
            contactos: state.entity.contactos.filter(f => f.state !== 'o'),
            mediosPago: state.entity.mediosPago.filter(f => f.state !== 'o'),
            rubrosAfip: state.entity.rubrosAfip.filter(f => f.state !== 'o'),
        };
        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.PERSONA_JURIDICA,
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

        if (typeEntity === 'Documento') {
            if (row.state === 'a') {
                entity.documentos.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.documentos.indexOf(entity.documentos.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.documentos[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.documentos = entity.documentos.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.documentos.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }

            const principal = entity.documentos.find(x => x.principal && x.state !== 'r');
            if (principal.idTipoDocumento !== parseInt(formValues.idTipoDocumento) || 
                principal.numeroDocumento !== formValues.numeroDocumento) {
                formSet({...formValues,
                    idTipoDocumento: principal.idTipoDocumento,
                    numeroDocumento: principal.numeroDocumento               
                });
            }

        }

        if (typeEntity === 'Contacto') {
            if (row.state === 'a') {
                entity.contactos.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.contactos.indexOf(entity.contactos.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.contactos[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.contactos = entity.contactos.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.contactos.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'MedioPago') {
            if (row.state === 'a') {
                entity.mediosPago.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.mediosPago.indexOf(entity.mediosPago.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.mediosPago[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.mediosPago = entity.mediosPago.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.mediosPago.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'RubroAfip') {
            if (row.state === 'a') {
                let item = entity.rubrosAfip.find(x => Math.abs(x.id) === Math.abs(row.id));
                if (isNull(item)) {
                    row.id = (-1)*row.id; //se pone negativo para identificar los registros nuevos
                    entity.rubrosAfip.push(row);
                }
                else {
                    if (item.state === 'r') {
                        item.state = 'o'; //recupero el original
                    }
                    else {
                        //cualquier otro estado lo estaría metiendo duplicado (seria un error)
                    }
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.rubrosAfip = entity.rubrosAfip.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.rubrosAfip.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        setState(prevState => {
            return {...prevState, entity: entity};
        });
        setPendingChange(true);
    }


    function getLogo(idGenero, logo) {
        if (logo.length > 0)
            return logo;
        else
            return companyProfile;
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

        <SectionHeading title={<>Persona Jurídica</>} />

        <div className="m-top-20">

            <section className='section-accordion'>

                <div className="m-top-20 m-bottom-20">

                    <div className="form-content">
                        <div className='row'>

                            <div className='img-content img-foto mb-3 col-md-2'>
                                <img
                                    src={getLogo(formValues.idGenero, formValues.logo)}
                                    alt="Logo"
                                    className='img-fluid img-foto-size'
                                    onClick={(event) => {
                                        if (state.mode !== OPERATION_MODE.VIEW) {
                                            refInputFileLogo.current.click();
                                        }
                                    }}
                                />
                                {(state.mode !== OPERATION_MODE.VIEW && formValues.logo.length > 0 &&
                                <div onClick={ (event) => handleClickRermoveLogo() } className="link">
                                    <i className="fa fa-times fa-lg" title="Quitar logo"></i>
                                </div>
                                )}

                                <input
                                    ref={refInputFileLogo}
                                    type="file"
                                    multiple={false}
                                    hidden
                                    onChange={handleInputFileLogoChange}
                                />
                            </div>

                            <div className='container-fluid mt-3 col-md-10'>  
                                <div className="mb-3 col-md-12">
                                    <input
                                        name="persona"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ `${formValues.denominacion}` }
                                        disabled={true}
                                    >
                                    </input>
                                </div>

                                <div className='row'>

                                    <div className="mb-3 col-md-4">
                                        <label htmlFor="idTipoDocumento" className="form-label">Tipo de documento</label>
                                        <InputLista
                                            name="idTipoDocumento"
                                            placeholder=""
                                            className="form-control"
                                            value={ formValues.idTipoDocumento }
                                            disabled={true}
                                            lista="TipoDocumento"
                                        />
                                    </div>
                                    <div className="mb-3 col-md-4">
                                        <label htmlFor="numeroDocumento" className="form-label">Documento</label>
                                        <input
                                            name="numeroDocumento"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={ formValues.numeroDocumento }
                                            disabled={true}
                                        />
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div className='row'>
                            
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="denominacion" className="form-label">Denominación</label>
                                <input
                                    name="denominacion"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.denominacion }
                                    onChange={ formHandleProxy }                                   
                                    disabled={false}
                                    maxLength={250}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="nombreFantasia" className="form-label">Nombre de fantasía</label>
                                <input
                                    name="nombreFantasia"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.nombreFantasia }
                                    onChange={ formHandleProxy }                                   
                                    disabled={false}
                                    maxLength={250}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="idFormaJuridica" className="form-label">Forma jurídica</label>
                                <InputLista
                                    name="idFormaJuridica"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idFormaJuridica }
                                    onChange={ formHandleProxy }                                   
                                    disabled={false}
                                    lista="FormaJuridica"
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="idJurisdiccion" className="form-label">Jurisdicción</label>
                                <InputEntidad
                                    name="idJurisdiccion"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idJurisdiccion }
                                    onChange={ formHandleProxy }                                   
                                    disabled={false}
                                    entidad="Provincia"
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="fechaConstitucion" className="form-label">Fecha de constitución</label>
                                <DatePickerCustom
                                    name="fechaConstitucion"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.fechaConstitucion }
                                    onChange={ formHandleProxy }                                   
                                    disabled={false}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="mesCierre" className="form-label">Mes de cierre</label>
                                <select
                                    name="mesCierre"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.mesCierre }
                                    onChange={ formHandleProxy }                                   
                                    disabled={false}
                                >
                                {GetMeses(true).map((item, index) =>
                                <option value={item.key} key={index}>{item.value}</option>
                                )}
                                </select>
                            </div>
                        
                        </div>

                    </div>

                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('documentos')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.documentos) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.documentos ? 'active' : ''}>Documentos</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.documentos &&
                    <div className='accordion-body'>
                        <DocumentosGrid
                            processKey={processKey}
                            disabled={state.mode === OPERATION_MODE.VIEW}
                            data={{
                                idTipoPersona: 501, //PersonaJuridica
                                idPersona: state.id,
                                list: state.entity.documentos
                            }}
                            onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                        />
                    </div>
                    )}

                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('contactos')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.contactos) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.contactos ? 'active' : ''}>Información de contacto</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.contactos &&
                    <div className='accordion-body'>
                        <ContactosGrid
                            processKey={processKey}
                            disabled={state.mode === OPERATION_MODE.VIEW}
                            data={{
                                entidad: 'PersonaJuridica',
                                idEntidad: state.id,
                                list: state.entity.contactos
                            }}
                            onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                        />
                    </div>
                    )}
                                        
                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('domicilioLegal')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.domicilioLegal) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.domicilioLegal ? 'active' : ''}>Domicilio Legal</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={(state.accordions.domicilioLegal) ? "accordion-body" : "accordion-hide"}>
                        <div className='row form-basic'>
                            <div className="col-12">
                                <h3 className='m-bottom-10'>Domicilio Legal</h3>
                                <DireccionForm
                                    id="PersonaJuridicaDomicilioLegal"
                                    data={{
                                        entity: state.entity.domicilioLegal
                                    }}
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    initFormEdit={(state.entity.domicilioLegal.id === 0 && state.entity.domicilioLegal.latitud === 0 && state.entity.domicilioLegal.longitud === 0)}
                                    setPendingChange={setPendingChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('domicilioFiscal')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.domicilioFiscal) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.domicilioFiscal ? 'active' : ''}>Domicilio Fiscal</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={(state.accordions.domicilioFiscal) ? "accordion-body" : "accordion-hide"}>
                        <div className='row form-basic'>
                            <div className="col-12">
                                <DireccionForm
                                    id="PersonaJuridicaDomicilioFiscal"
                                    data={{
                                        entity: state.entity.domicilioFiscal
                                    }}
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    initFormEdit={(state.entity.domicilioFiscal.id === 0 && state.entity.domicilioFiscal.latitud === 0 && state.entity.domicilioFiscal.longitud === 0)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('mediosPago')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.mediosPago) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.mediosPago ? 'active' : ''}>Medios de pago</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.mediosPago &&
                    <div className='accordion-body'>
                        <MediosPagoGrid
                            processKey={processKey}
                            disabled={state.mode === OPERATION_MODE.VIEW}
                            data={{
                                idTipoPersona: 501, //PersonaJuridica
                                idPersona: state.id,
                                list: state.entity.mediosPago
                            }}
                            onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                        />
                    </div>
                    )}

                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('rubrosAfip')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.rubrosAfip) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.rubrosAfip ? 'active' : ''}>Rubros AFIP</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.rubrosAfip &&
                    <div className='accordion-body'>
                        <RubrosAfipGrid
                            disabled={state.mode === OPERATION_MODE.VIEW}
                            data={{
                                list: state.entity.rubrosAfip
                            }}
                            onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                        />
                    </div>
                    )}

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
                            title="Información adicional de Persona Jurídica"
                            processKey={processKey}
                            entidad="PersonaJuridica"
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
                    Aceptar
                </button>
                }
            </div>
        </footer>

    </>
    )
}

export default PersonaJuridicaView;
