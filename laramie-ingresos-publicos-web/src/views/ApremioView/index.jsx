import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { APPCONFIG } from '../../app.config';
import { useForm } from '../../components/hooks/useForm';
import { useEntidad } from '../../components/hooks/useEntidad';
import { useReporte } from '../../components/hooks/useReporte';
import { Loading, SectionHeading, DatePickerCustom, InputEntidad, InputExpediente } from '../../components/common';
import { CloneObject, OpenObjectURL } from '../../utils/helpers';
import { OPERATION_MODE } from '../../consts/operationMode';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { getDateId } from '../../utils/convert';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import { Tab, Tabs } from 'react-bootstrap';
import ShowToastMessage from '../../utils/toast';
import { dataTaggerActionSet, dataTaggerActionClear } from '../../context/redux/actions/dataTaggerAction';
import CertificadosApremiosGrid from '../../components/controls/CertificadosApremiosGrid';
import JuiciosCitacionesGrid from '../../components/controls/JuiciosCitacionesGrid';
import ActosProcesalesGrid from '../../components/controls/ActosProcesalesGrid';
import { useBeforeunload } from 'react-beforeunload';


const ApremioView = (props) => {

    //parametros url
    const params = useParams();

    //variables
    const entityInit = {
        apremio: {
            id: 0,
            numero: '',
            idExpediente: 0,
            idOrganismoJudicial: 0,
            fechaInicioDemanda: null,
            carpeta: '',
            caratula: '',
            estado: ''     
        },
		certificadosApremio: [],
        juicioCitaciones: [],
        actosProcesales: [],
        archivos: [],
        observaciones: [],
        etiquetas: []
    };

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        processKey: `Apremio_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        idCertificadoApremio: params.idCertificadoApremio ? parseInt(params.idCertificadoApremio) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        accordions: {
            certificados: true,
            info: false
        },
        certificadosApremio: [],
        tabActive: "actosProcesales"
    });
    const [pendingChange, setPendingChange] = useState(false);
    const [stateOrganismoJudicial, setStateOrganismoJudicial] = useState({
        fueroOrganismoJudicial: '',
        secretariaOrganismoJudicial: '',
    });

    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );
  
    useBeforeunload((event) => {
        if ((pendingChange) && (state.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });  

    const mount = () => {
        if (state.mode != OPERATION_MODE.NEW) {  
            FindApremio();
        }
        else {
            dispatch(dataTaggerActionSet(state.processKey, {
                Archivo: [],
                Observacion: [],
                Etiqueta: []
            }));
        }          
    }
    useEffect(mount, []);

    const [, getRowEntidad, ready] = useEntidad({
        entidades: ['OrganoJudicial'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'OrganoJudicial',
          timeout: 0
        }
    });

    const mountOrganistmoJudicial = () => {
        if (ready && state.entity.apremio.idOrganismoJudicial > 0){
            setStateOrganismoJudicial({
                    fueroOrganismoJudicial:  getDescFuero(state.entity.apremio.idOrganismoJudicial),
                    secretariaOrganismoJudicial:  getDescSecretaria(state.entity.apremio.idOrganismoJudicial)
            });                     
        }
    }
    useEffect(mountOrganistmoJudicial, [state.entity, ready]);

    const [ apremio_formValues, apremio_formHandle, , apremio_formSet ] = useForm({
        numero: '',
        idExpediente: 0,
        idOrganismoJudicial: 0,
        fechaInicioDemanda: null,
        carpeta: '',
        caratula: '',
        estado: ''                    
    }, 'apremio_');

    const [ generateReporte, ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer)
                OpenObjectURL(`${reporte}.pdf`, buffer);
            else
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }
    });

    const getDescSecretaria = (id) => {
        const row = getRowEntidad('OrganoJudicial', id);
        return (row) ? row.secretaria : '';
    }

    const getDescFuero = (id) => {
        const row = getRowEntidad('OrganoJudicial', id);
        return (row) ? row.fuero : ''; 
    }

    //handles
    const apremio_formHandleProxy = (event) => {
        apremio_formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (isFormValid()) {
            if (state.mode === OPERATION_MODE.NEW) {
                AddApremio();
            }
            else{
                ModifyApremio();
            }
        };
    };
    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        let url = '';
        if (state.mode === OPERATION_MODE.NEW) {
            url = '/certificado-apremio/' + OPERATION_MODE.EDIT + '/' + state.id;
        }
        else{
            url = '/apremios';
        }

        navigate(url, { replace: true });    
    };

    const handleClickReporte = (reporte) => {
        const paramsReporte = {
            idApremio: state.id
        }
        generateReporte(reporte, paramsReporte);
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
    const callbackSuccessFindApremio = (response) => {
        response.json()
        .then((data) => {

            //deserialize date fields
            if (data.apremio.fechaInicioDemanda) data.apremio.fechaInicioDemanda = new Date(data.apremio.fechaInicioDemanda);
            data.archivos.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });
            data.observaciones.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });
            data.actosProcesales.forEach(x => {
                if (x.fechaDesde) x.fechaDesde = new Date(x.fechaDesde);
                if (x.fechaHasta) x.fechaHasta = new Date(x.fechaHasta);
            });
            data.juicioCitaciones.forEach(x => {
                if (x.fechaCitacion) x.fechaCitacion = new Date(x.fechaCitacion);
            });
            data.certificadosApremio.forEach(x => {
                if (x.fechaCalculo) x.fechaCalculo = new Date(x.fechaCalculo);
                if (x.fechaCertificado) x.fechaCertificado = new Date(x.fechaCertificado);
                if (x.fechaNotificacion) x.fechaNotificacion = new Date(x.fechaNotificacion);
                if (x.fechaRecepcion) x.fechaRecepcion = new Date(x.fechaRecepcion);
            });

            setState(prevState => {
                return {...prevState, loading: false, entity: data};
            });
            setPendingChange(false);
            apremio_formSet({
                numero: data.apremio.numero,
                idExpediente: data.apremio.idExpediente,
                idOrganismoJudicial: data.apremio.idOrganismoJudicial,
                fechaInicioDemanda: data.apremio.fechaInicioDemanda,
                carpeta: data.apremio.carpeta,
                caratula: data.apremio.caratula,
                estado: data.apremio.estado
            });

            if (data.apremio.id > 0){
                FindCertificadoApremio(data.apremio.id);
            }
            
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
    };

    const callbackSuccessCertificadoApremio = (response) => {
        response.json()
        .then((data) => {
            setState(prevState => {
                return {...prevState, loading: false, certificadosApremio: data};
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
        if (apremio_formValues.fechaInicioDemanda == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha inicio de demanda');
            return false;
        }
        if (apremio_formValues.idExpediente <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Expediente');
            return false;
        }
        if (apremio_formValues.idOrganismoJudicial <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Organismo Judicial');
            return false;
        }

        if (apremio_formValues.carpeta === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Carpeta');
            return false;
        }
        if (apremio_formValues.caratula === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Caratula');
            return false;
        }

        return true;
    }

    function FindApremio() {
        
        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.APREMIO,
            paramsUrl,
            null,
            callbackSuccessFindApremio,
            callbackNoSuccess,
            callbackError
        );

    }

    function FindCertificadoApremio(idApremio) {
        setState(prevState => {
            return {...prevState, loading: true};
        });
        
        const paramsUrl = `/filter?idCuenta=0&idApremio=${idApremio}&numero=&idEstadoCertificadoApremio=0&fechaCertificadoDesde=&fechaCertificadoHasta=`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CERTIFICADO_APREMIO,
            paramsUrl,
            null,
            callbackSuccessCertificadoApremio,
            callbackNoSuccess,
            callbackError
        );
    }

    function AddApremio() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Apremio ingresado correctamente", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/certificado-apremio/' + OPERATION_MODE.EDIT + '/' + state.id;
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
            apremio: {
                ...state.entity.apremio,
                numero: apremio_formValues.numero,
                idExpediente: apremio_formValues.idExpediente,
                idOrganismoJudicial: apremio_formValues.idOrganismoJudicial,
                fechaInicioDemanda: apremio_formValues.fechaInicioDemanda,
                carpeta: apremio_formValues.carpeta,
                caratula: apremio_formValues.caratula,
                estado: apremio_formValues.estado 
            },
            certificadosApremio: state.entity.certificadosApremio,
            juicioCitaciones: state.entity.juicioCitaciones.filter(f => f.state !== 'o'),
            actosProcesales: state.entity.actosProcesales.filter(f => f.state !== 'o'),
            archivos: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Etiqueta.filter(f => f.state !== 'o') : []
        };

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.APREMIO,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ModifyApremio() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Apremio actualizado correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                callbackSuccessFindApremio(response);
            });
        };

        const dataBody = {
            apremio: {
                ...state.entity.apremio,
                numero: apremio_formValues.numero,
                idExpediente: apremio_formValues.idExpediente,
                idOrganismoJudicial: apremio_formValues.idOrganismoJudicial,
                fechaInicioDemanda: apremio_formValues.fechaInicioDemanda,
                carpeta: apremio_formValues.carpeta,
                caratula: apremio_formValues.caratula,
                estado: apremio_formValues.estado 
            },
            certificadosApremio: state.entity.certificadosApremio,
            juicioCitaciones: state.entity.juicioCitaciones.filter(f => f.state !== 'o'),
            actosProcesales: state.entity.actosProcesales.filter(f => f.state !== 'o'),
            archivos: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Etiqueta.filter(f => f.state !== 'o') : []
        };

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.APREMIO,
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

        if (typeEntity === 'ActoProcesal') {
            if (row.state === 'a') {
                entity.actosProcesales.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.actosProcesales.indexOf(entity.actosProcesales.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.actosProcesales[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.actosProcesales = entity.actosProcesales.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.actosProcesales.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'JuicioCitacion') {
            if (row.state === 'a') {
                entity.juicioCitaciones.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.juicioCitaciones.indexOf(entity.juicioCitaciones.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.juicioCitaciones[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.juicioCitaciones = entity.juicioCitaciones.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.juicioCitaciones.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        setState(prevState => {
            return {...prevState, entity: entity};
        });
        setPendingChange(true);
    }

    function SetTabActive(tab) {
        setState(prevState => {
            return {...prevState, tabActive: tab};
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

                <SectionHeading
                    title={
                        <>
                            Apremio ({(state.mode === OPERATION_MODE.NEW) ? 
                                <span className='text-heading-selecction'>Nuevo</span> :
                                <span className='text-heading-selecction'>Número: {state.entity.apremio.numero}</span>
                            })
                        </>
                    }
                />

                <section className='section-accordion'>
                    <div className="m-top-20 m-bottom-20">

                        {state.mode !== OPERATION_MODE.NEW &&
                        <div className="row">
                            <div className="mb-3 col-6 col-md-3">
                                <label htmlFor="numero" className="form-label">Apremio</label>
                                <input
                                    name="numero"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={apremio_formValues.numero}
                                    onChange={ apremio_formHandleProxy }
                                    disabled={true}
                                />
                            </div>
                        </div>
                        }
                        <div className="row">
                            <div className="mb-3 col-6 col-md-3">
                                <label htmlFor="fechaInicioDemanda" className="form-label">Fecha inicio de demanda</label>
                                <DatePickerCustom
                                    name="fechaInicioDemanda"
                                    placeholder=""
                                    className="form-control"
                                    value={apremio_formValues.fechaInicioDemanda}
                                    onChange={ apremio_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-9">
                                <label htmlFor="idExpediente" className="form-label">Expediente</label>
                                <InputExpediente
                                    name="idExpediente"
                                    placeholder=""
                                    className="form-control"
                                    value={ apremio_formValues.idExpediente }
                                    onChange={ apremio_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-6">
                                <label htmlFor="idOrganismoJudicial" className="form-label">Organismo judicial</label>
                                <InputEntidad
                                    name="idOrganismoJudicial"
                                    placeholder=""
                                    className="form-control"
                                    value={ apremio_formValues.idOrganismoJudicial }
                                    onChange={({target}) =>{
                                        let idOrganismoJudicial = 0;
                                        let fuero = '';
                                        let secretaria = '';
                                        if (target.row) {
                                            idOrganismoJudicial = parseInt(target.value);
                                            fuero = target.row.fuero;
                                            secretaria = target.row.secretaria;
                                        }
                                        apremio_formSet({...apremio_formValues, idOrganismoJudicial: idOrganismoJudicial});
                                        
                                        setStateOrganismoJudicial(prevState => {
                                            return {...prevState,
                                                fueroOrganismoJudicial: fuero,
                                                secretariaOrganismoJudicial: secretaria
                                            };
                                        });
                                        setPendingChange(true);
                                    }} 
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    title="Organismo Judicial"
                                    entidad="OrganoJudicial"
                                    onFormat= {(row) => (row) ? `${row.codigoOrganoJudicial} - ${row.departamentoJudicial}` : ''}
                                    columns={[
                                        { Header: 'Codigo', accessor: 'codigoOrganoJudicial', width: '25%' },
                                        { Header: 'Departamento judicial', accessor: 'departamentoJudicial', width: '70%' }
                                    ]}
                                    memo={false}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-6">
                                <label htmlFor="fueroOrganismoJudicial" className="form-label">Fuero</label>
                                <input
                                    name="fueroOrganismoJudicial"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={stateOrganismoJudicial.fueroOrganismoJudicial}
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-6">
                                <label htmlFor="secretariaOrganismoJudicial" className="form-label">Secretaría</label>
                                <input
                                    name="secretariaOrganismoJudicial"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={stateOrganismoJudicial.secretariaOrganismoJudicial}
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-12 col-md-6">
                                <label htmlFor="carpeta" className="form-label">Carpeta</label>
                                <input
                                    name="carpeta"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={apremio_formValues.carpeta}
                                    onChange={ apremio_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="mb-3 col-12">
                                <label htmlFor="caratula" className="form-label">Caratula</label>
                                <input
                                    name="caratula"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={apremio_formValues.caratula}
                                    onChange={ apremio_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="mb-3 col-12">
                                <label htmlFor="estado" className="form-label">Estado</label>
                                <input
                                    name="estado"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={apremio_formValues.estado}
                                    onChange={ apremio_formHandleProxy }
                                    disabled={true}
                                />
                            </div>
                        </div>

                        <div className='accordion-header m-top-20'>
                                <div className='row'>
                                        <div className="col-12" onClick={() => ToggleAccordion('certificados')}>
                                            <div className='accordion-header-title'>
                                                {(state.accordions.certificados) ? accordionOpen : accordionClose}
                                                <h3 className={state.accordions.certificados ? 'active' : ''}>Certificados</h3>
                                            </div>
                                        </div>
                                </div>
                        </div>


                        {(state.accordions.certificados &&
                            <div className='accordion-body'>
                                    <CertificadosApremiosGrid
                                        data={{
                                            idCertificadoApremio: state.entity.apremio.id,
                                            list: state.certificadosApremio
                                        }}
                                    />   
                            </div>
                        )}


                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('info')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.info) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.info ? 'active' : ''}>Información adicional</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.info &&
                        <div className='accordion-body'>
                            <DataTaggerFormRedux
                                title="Información adicional de Apremio"
                                processKey={state.processKey}
                                entidad="Apremio"
                                idEntidad={state.id}
                                disabled={(state.mode === OPERATION_MODE.VIEW)}
                                onChange={(row) => setPendingChange(true)}
                            />
                        </div>
                        )}

                        {state.mode !== OPERATION_MODE.NEW &&
                            <Tabs
                                id="tabs-inmueble"
                                activeKey={state.tabActive}
                                className="m-top-20"
                                onSelect={(tab) => SetTabActive(tab)}
                            >
                                    <Tab eventKey="actosProcesales" title="Actos procesales">
                                        <div className='tab-panel'>
                                            <ActosProcesalesGrid
                                                processKey={state.processKey}
                                                disabled={state.mode === OPERATION_MODE.VIEW}
                                                data={{
                                                    idApremio: state.entity.apremio.id,
                                                    list: state.entity.actosProcesales
                                                }}
                                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                            />                                           
                                        </div>
                                    </Tab>
                                    <Tab eventKey="citaciones" title="Citaciones">
                                        <div className='tab-panel'>
                                            <JuiciosCitacionesGrid
                                                processKey={state.processKey}
                                                disabled={state.mode === OPERATION_MODE.VIEW}
                                                data={{
                                                    idApremio: state.entity.apremio.id,
                                                    list: state.entity.juicioCitaciones
                                                }}
                                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                            />                                           
                                        </div>
                                    </Tab>
                            </Tabs>
                        }
                            </div>

                    </section>

            </div>
        </div>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
                {state.mode !== OPERATION_MODE.VIEW &&
                <>
                    <button className="btn back-button m-left-50 float-start" onClick={ (event) => handleClickReporte("ApremioCaratula") }>Imprimir Carátula</button>
                    <button
                        className={pendingChange ? "btn action-button float-end" : "btn action-button btn-disabled float-end"}
                        onClick={ (event) => handleClickGuardar() }
                        disabled={!pendingChange}
                    >                    
                        Guardar
                    </button>
                </>
                }
            </div>
        </footer>

    </>
  );
}


export default ApremioView;