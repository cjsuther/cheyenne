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
import { isEmptyString } from '../../utils/validator';
import { getDateId } from '../../utils/convert';
import { CloneObject } from '../../utils/helpers';
import ShowToastMessage from '../../utils/toast';
import DireccionForm, {GetDataDireccion, IsValidDireccion} from '../../components/controls/DireccionForm';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import DocumentosGrid from '../../components/controls/DocumentosGrid';
import ContactosGrid from '../../components/controls/ContactosGrid';
import MediosPagoGrid from '../../components/controls/MediosPagoGrid';

import userProfile from '../../assets/images/user-profile.png';
import userProfileMan from '../../assets/images/user-profile-man.png';
import userProfileWoman from '../../assets/images/user-profile-woman.png';
import { useBeforeunload } from 'react-beforeunload';


function PersonaFisicaView() {
     
    //parametros url
    const params = useParams();

     //variables
    const entityInit = {
        persona: {
            id: 0,
            idTipoDocumento: 0,
            numeroDocumento: '',
            idNacionalidad: 0,
            nombre: '',
            apellido: '',
            idGenero: 0,
            idEstadoCivil: 0,
            idNivelEstudio: 0,
            profesion: '',
            matricula: '',
            fechaNacimiento: null,
            fechaDefuncion: null,
            discapacidad: false,
            idCondicionFiscal: 0,
            idIngresosBrutos: 0,
            ganancias: false,
            pin: '',
            foto: ''
        },
        direccion: {
          id: 0,
          entidad: "PersonaFisica",
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
        mediosPago: []
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
            direcciones: false,
            mediosPago: false,
            datosImpositivos: false,
            estudios: false
        }
    });

    const [pendingChange, setPendingChange] = useState(false);

    const refInputFileFoto = useRef(null);

    const [processKey, setProcessKey] = useState(null);

    useBeforeunload((event) => {
        if ((pendingChange) && (state.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    const mount = () => {
        
        const _processKey = `PersonaFisica_${state.id??0}_${getDateId()}`;
        setProcessKey(_processKey);

        if (state.id > 0) {
            FindPersonaFisica();
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
        idNacionalidad: 0,
        nombre: '',
        apellido: '',
        idGenero: 0,
        idEstadoCivil: 0,
        idNivelEstudio: 0,
        profesion: '',
        matricula: '',
        fechaNacimiento: null,
        fechaDefuncion: null,
        discapacidad: false,
        idCondicionFiscal: 0,
        idIngresosBrutos: 0,
        ganancias: false,
        pin: '',
        foto: ''
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
                data.direccion.idTipoGeoreferencia = idTipoGeoreferencia;
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
                AddPersonaFisica();
            }
            else {
                ModifyPersonaFisica();
            }
        };
    }    
    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(processKey));
        const url = APPCONFIG.SITE.WEBAPP + 'personas-fisicas';
        window.location.href = url;
    }
    const handleInputFileFotoChange = (event) => {
        if (event.target.files.length === 0) {
            event.preventDefault();
            return;
        }

        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = (e) => {
            const urlFoto = e.target.result;
            formSet({...formValues, foto: urlFoto});
        }
        reader.onerror = (error) => {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
        }
        setPendingChange(true);
        reader.readAsDataURL(file);
        event.target.value = "";
    }
    const handleClickRermoveFoto = () => {
        formSet({...formValues, foto: ""});
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
    const callbackSuccessFindPersonaFisica = (response) => {
        response.json()
        .then((data) => {
            if (data.persona.fechaNacimiento) data.persona.fechaNacimiento = new Date(data.persona.fechaNacimiento);
            if (data.persona.fechaDefuncion) data.persona.fechaDefuncion = new Date(data.persona.fechaDefuncion);

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
                idNacionalidad: data.persona.idNacionalidad,
                nombre: data.persona.nombre,
                apellido: data.persona.apellido,
                idGenero: data.persona.idGenero,
                idEstadoCivil: data.persona.idEstadoCivil,
                idNivelEstudio: data.persona.idNivelEstudio,
                profesion: data.persona.profesion,
                matricula: data.persona.matricula,
                fechaNacimiento: data.persona.fechaNacimiento,
                fechaDefuncion: data.persona.fechaDefuncion,
                discapacidad: data.persona.discapacidad,
                idCondicionFiscal: data.persona.idCondicionFiscal,
                idIngresosBrutos: data.persona.idIngresosBrutos,
                ganancias: data.persona.ganancias,
                pin: data.persona.pin,
                foto: data.persona.foto                
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

    //funciones

    function isFormValid() {
        if (formValues.idTipoDocumento <= 0 || formValues.numeroDocumento.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar un Documento');
            return false;
        }
        if (formValues.idNacionalidad <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Nacionalidad');
            return false;
        }
        if (formValues.nombre.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Nombre');
            return false;
        }
        if (formValues.apellido.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Apellido');
            return false;
        }  
        if (formValues.idGenero <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Genero');
            return false;
        }    
        if (formValues.fechaNacimiento === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha Nacimiento');
            return false;
        }

        const isValidDireccion = IsValidDireccion.get("PersonaFisica_direccion")();
        if (!isValidDireccion.result) {
          ShowToastMessage(ALERT_TYPE.ALERT_WARNING, isValidDireccion.message);
          return false;
        }

        return true;
    }   

    function FindPersonaFisica() {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PERSONA_FISICA,
            paramsUrl,
            null,
            callbackSuccessFindPersonaFisica,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddPersonaFisica() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Persona Fisica ingresada correctamente", () => {
                    dispatch(dataTaggerActionClear(processKey));
                    const url = APPCONFIG.SITE.WEBAPP + 'persona-fisica/' + OPERATION_MODE.EDIT + '/' + row.persona.id;
                    //const url = APPCONFIG.SITE.WEBAPP + 'personas-fisicas';
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
                idNacionalidad: parseInt(formValues.idNacionalidad),
                nombre: formValues.nombre,
                apellido: formValues.apellido,
                idGenero: parseInt(formValues.idGenero),
                idEstadoCivil: !isEmptyString(formValues.idEstadoCivil) ? parseInt(formValues.idEstadoCivil) : 0,
                idNivelEstudio: !isEmptyString(formValues.idNivelEstudio) ? parseInt(formValues.idNivelEstudio) : 0,
                profesion: formValues.profesion,
                matricula: formValues.matricula,
                fechaNacimiento: formValues.fechaNacimiento,
                fechaDefuncion: formValues.fechaDefuncion,
                discapacidad: formValues.discapacidad,
                idCondicionFiscal: !isEmptyString(formValues.idCondicionFiscal) ? parseInt(formValues.idCondicionFiscal) : 0,
                idIngresosBrutos: !isEmptyString(formValues.idIngresosBrutos) ? parseInt(formValues.idIngresosBrutos) : 0,
                ganancias: formValues.ganancias,
                pin: formValues.pin,
                foto: formValues.foto
            },
            direccion: GetDataDireccion.get("PersonaFisica_direccion")(),
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            documentos: state.entity.documentos.filter(f => f.state !== 'o'),
            contactos: state.entity.contactos.filter(f => f.state !== 'o'),
            mediosPago: state.entity.mediosPago.filter(f => f.state !== 'o'),
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.PERSONA_FISICA,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }    

    function ModifyPersonaFisica() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Persona Fisica actualizada correctamente", () => {
                dispatch(dataTaggerActionClear(processKey));
                callbackSuccessFindPersonaFisica(response);
                //const url = APPCONFIG.SITE.WEBAPP + 'personas-fisicas';
                //window.location.href = url;
            });
        };

        const dataBody = {
            persona: {
                ...state.entity.persona,
                idTipoDocumento: parseInt(formValues.idTipoDocumento),
                numeroDocumento: formValues.numeroDocumento,
                idNacionalidad: parseInt(formValues.idNacionalidad),
                nombre: formValues.nombre,
                apellido: formValues.apellido,
                idGenero: parseInt(formValues.idGenero),
                idEstadoCivil: !isEmptyString(formValues.idEstadoCivil) ? parseInt(formValues.idEstadoCivil) : 0,
                idNivelEstudio: !isEmptyString(formValues.idNivelEstudio) ? parseInt(formValues.idNivelEstudio) : 0,
                profesion: formValues.profesion,
                matricula: formValues.matricula,
                fechaNacimiento: formValues.fechaNacimiento,
                fechaDefuncion: formValues.fechaDefuncion,
                discapacidad: formValues.discapacidad,
                idCondicionFiscal: !isEmptyString(formValues.idCondicionFiscal) ? parseInt(formValues.idCondicionFiscal) : 0,
                idIngresosBrutos: !isEmptyString(formValues.idIngresosBrutos) ? parseInt(formValues.idIngresosBrutos) : 0,
                ganancias: formValues.ganancias,
                pin: formValues.pin,
                foto: formValues.foto
            },
            direccion: GetDataDireccion.get("PersonaFisica_direccion")(),
            archivos: (dataTagger[processKey]) ? dataTagger[processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[processKey]) ? dataTagger[processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[processKey]) ? dataTagger[processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            documentos: state.entity.documentos.filter(f => f.state !== 'o'),
            contactos: state.entity.contactos.filter(f => f.state !== 'o'),
            mediosPago: state.entity.mediosPago.filter(f => f.state !== 'o'),
        };
        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.PERSONA_FISICA,
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

        setState(prevState => {
            return {...prevState, entity: entity};
        });
        setPendingChange(true);
    }


    function getFoto(idGenero, foto) {
        if (foto.length > 0)
            return foto;
        else if (idGenero === 560)
            return userProfileMan;
        else if (idGenero === 561)
            return userProfileWoman;
        else
            return userProfile;
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

        <SectionHeading title={<>Persona Física</>} />

        <div className="m-top-20">

            <section className='section-accordion'>

                <div className="m-top-20 m-bottom-20">

                    <div className="form-content">
                        <div className='row'>

                            <div className='img-content img-foto mb-3 col-md-2'>
                                <img
                                    src={getFoto(formValues.idGenero, formValues.foto)}
                                    alt="Foto"
                                    className='img-fluid img-foto-size'
                                    onClick={(event) => {
                                        if (state.mode !== OPERATION_MODE.VIEW) {
                                            refInputFileFoto.current.click();
                                        }
                                    }}
                                />
                                {(state.mode !== OPERATION_MODE.VIEW && formValues.foto.length > 0 &&
                                <div onClick={ (event) => handleClickRermoveFoto() } className="link">
                                    <i className="fa fa-times fa-lg" title="Quitar foto"></i>
                                </div>
                                )}

                                <input
                                    ref={refInputFileFoto}
                                    type="file"
                                    multiple={false}
                                    hidden
                                    onChange={handleInputFileFotoChange}
                                />
                            </div>

                            <div className='container-fluid mt-3 col-md-10'>
                                <div className="mb-3 col-md-12">
                                    <input
                                        name="persona"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={ `${formValues.nombre} ${formValues.apellido}` }
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
                                    <div className="mb-3 col-md-4">
                                    <label htmlFor="idNacionalidad" className="form-label">Nacionalidad</label>
                                    <InputEntidad
                                        name="idNacionalidad"
                                        placeholder=""
                                        className="form-control"
                                        value={ formValues.idNacionalidad }
                                        onChange={ formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        entidad="Pais"
                                    />
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className='row'>
                            
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input
                                    name="nombre"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.nombre }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    maxLength={250}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="apellido" className="form-label">Apellido</label>
                                <input
                                    name="apellido"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.apellido }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    maxLength={250}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="idGenero" className="form-label">Género</label>
                                <InputLista
                                    name="idGenero"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idGenero }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    lista="Genero"
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="idEstadoCivil" className="form-label">Estado Civil</label>
                                <InputLista
                                    name="idEstadoCivil"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idEstadoCivil }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    lista="EstadoCivil"
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4 col-xl-2">
                                <label htmlFor="fechaNacimiento" className="form-label">Fecha Nacimiento</label>
                                <DatePickerCustom
                                    name="fechaNacimiento"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.fechaNacimiento }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4 col-xl-2">
                                <label htmlFor="fechaDefuncion" className="form-label">Fecha Defunción</label>
                                <DatePickerCustom
                                    name="fechaDefuncion"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.fechaDefuncion }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="col-6 col-md-4 col-xl-2 form-check">
                                    <label htmlFor="discapacidad" className="form-check-label">¿Posee alguna discapacidad?</label>
                                    <input
                                        name="discapacidad"
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={ formHandleProxy }
                                        checked={ formValues.discapacidad }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                            </div>
                            <div className="mb-3 col-6 col-md-4 col-xl-2">
                                <label htmlFor="pin" className="form-label">PIN</label>
                                <input
                                    name="pin"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.pin }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    maxLength={20}
                                />
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
                                idTipoPersona: 500, //PersonaFisica
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
                                entidad: 'PersonaFisica',
                                idEntidad: state.id,
                                list: state.entity.contactos
                            }}
                            onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                        />
                    </div>
                    )}
                                        
                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('direcciones')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.direcciones) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.direcciones ? 'active' : ''}>Domicilio Personal</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={(state.accordions.direcciones) ? "accordion-body" : "accordion-hide"}>
                        <div className='row form-basic'>
                            <div className="col-12">
                                <DireccionForm
                                    id="PersonaFisica_direccion"
                                    data={{
                                        entity: state.entity.direccion
                                    }}
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    initFormEdit={(state.entity.direccion.id === 0 && state.entity.direccion.latitud === 0 && state.entity.direccion.longitud === 0)}
                                    setPendingChange={setPendingChange}
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
                                idTipoPersona: 500, //PersonaFisica
                                idPersona: state.id,
                                list: state.entity.mediosPago
                            }}
                            onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                        />
                    </div>
                    )}
                    
                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('datosImpositivos')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.datosImpositivos) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.datosImpositivos ? 'active' : ''}>Datos impositivos</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.datosImpositivos &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="col-12 col-md-4 col-lg-3">
                                <label htmlFor="idCondicionFiscal" className="form-label">Condición fiscal</label>
                                <InputLista
                                    name="idCondicionFiscal"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idCondicionFiscal }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    lista="CondicionFiscal"
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-3">
                                <label htmlFor="idIngresosBrutos" className="form-label">Inscripción Ingresos Brutos</label>
                                <InputLista
                                    name="idIngresosBrutos"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idIngresosBrutos }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    lista="IngresosBrutos"
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-3 form-check">
                                <label htmlFor="ganancias" className="form-check-label">Ganancias</label>
                                <input
                                    name="ganancias"
                                    type="checkbox"
                                    className="form-check-input"
                                    onChange={ formHandleProxy }
                                    checked={ formValues.ganancias }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>

                        </div>
                    </div>
                    )}
                    
                    <div className='accordion-header m-top-20'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('estudios')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.estudios) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.estudios ? 'active' : ''}>Estudios y profesión</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.estudios &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="col-12 col-md-4 col-lg-3">
                                <label htmlFor="idNivelEstudio" className="form-label">Nivel Estudio</label>
                                <InputLista
                                    name="idNivelEstudio"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.idNivelEstudio }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    lista="NivelEstudio"
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-3">
                                <label htmlFor="profesion" className="form-label">Profesión</label>
                                <input
                                    name="profesion"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.profesion }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    maxLength={250}
                                />
                            </div>
                            <div className="col-12 col-md-4 col-lg-3">
                                <label htmlFor="matricula" className="form-label">Matrícula</label>
                                <input
                                    name="matricula"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={ formValues.matricula }
                                    onChange={ formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    maxLength={50}
                                />
                            </div>
                            
                        </div>
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
                            title="Información adicional de Persona Física"
                            processKey={processKey}
                            entidad="PersonaFisica"
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

export default PersonaFisicaView;
