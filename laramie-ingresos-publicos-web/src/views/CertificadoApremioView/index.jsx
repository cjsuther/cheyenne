import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { Tab, Tabs } from 'react-bootstrap';
import { dataTaggerActionSet, dataTaggerActionClear } from '../../context/redux/actions/dataTaggerAction';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { useForm } from '../../components/hooks/useForm';
import { Loading, TableCustom, SectionHeading, DatePickerCustom, InputNumber, InputCuenta, InputLista, MessageModal} from '../../components/common';
import { CloneObject, OpenObjectURL } from '../../utils/helpers';
import { getDateId } from '../../utils/convert';
import ShowToastMessage from '../../utils/toast';
import CertificadosApremioItemGrid from '../../components/controls/CertificadosApremioItemGrid';
import CertificadoApremioPersonaGrid from '../../components/controls/CertificadoApremioPersonaGrid';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import { getDateToString  } from '../../utils/convert';
import { useEntidad } from '../../components/hooks/useEntidad';
import { useReporte } from '../../components/hooks/useReporte';
import { useBeforeunload } from 'react-beforeunload';


function CertificadoApremioView() {

    //parametros url
    const params = useParams();

    //variables
    const entityInit = {
        certificadoApremio: {
            id: 0,
            idApremio: 0,
            idEstadoCertificadoApremio: 0,
            numero: '',
            idCuenta: 0,
            idInspeccion: 0,
            montoTotal: 0,
            fechaCertificado: null,
            fechaCalculo: null,
            fechaNotificacion: null,
            fechaRecepcion: null       
        },
        certificadoApremioItems:[],
        certificadoApremioPersonas: [],
        archivos: [],
        observaciones: [],
        etiquetas: []
    };

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        processKey: `CertificadoApremio_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        accordions: {
            apremio: true,
            info: false
        },
        showMenu: false,
        showMessage: false,
        tabActive: "personas"
    });

    const [stateApremio, setStateApremio] = useState({
        numeroApremio: '',
        carpetaApremio: '',
        estadoApremio: '',
        caratulaApremio: ''
    });
    const [pendingChange, setPendingChange] = useState(false);
    const [stateAsignarApremio, setStateAsignarApremio] = useState({
        showApremios: false,
        list: []
    });

    const [, getRowEntidad] = useEntidad({
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

    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );

    useBeforeunload((event) => {
        if ((pendingChange) && (state.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    const mount = () => {
        if (state.id > 0) {
            FindCertificadoApremio();
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

    const [ certificadoApremio_formValues, certificadoApremio_formHandle, , certificadoApremio_formSet ] = useForm({
        idApremio: 0,
        idEstadoCertificadoApremio: 0,
        numero: '',
        idCuenta: 0,
        idInspeccion: 0,
        montoTotal: 0,
        fechaCertificado: null,
        fechaCalculo: null,
        fechaNotificacion: null,
        fechaRecepcion: null                  
    }, 'certificadoApremio_');


    const [ generateReporte, ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer)
                OpenObjectURL(`${reporte}.doc`, buffer);
            else
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }
    });


    //handles
    const certificadoApremio_formHandleProxy = (event) => {
        certificadoApremio_formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (state.id > 0) {
            ModifyCertificadoApremio();
        }
    }
    const handleClickRechazar = () => {
        setState(prevState => {
            return {...prevState, showMessage: true};
        });
    }

    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        const url = '/certificados-apremio';
        navigate(url, { replace: true });
    }
    const handleClickNuevoApremio = () => {
        const url = '/apremio/' + OPERATION_MODE.NEW + '/' + state.id;
        navigate(url, { replace: true });
    };
    const handleClickVerApremio = () => {
        const url = '/apremio/' + OPERATION_MODE.VIEW + '/' + state.entity.certificadoApremio.idApremio;
        navigate(url, { replace: true });
    };
    const handleClickAsignarApremio = () => {
        SearchApremios();
    };
    const handleClickAsignarApremioCancelar = () => {
        setStateAsignarApremio(prevState => {
            return {...prevState, showApremios: false};
        });      
    }
    const handleClickAsignarApremioSelect = (row) => {
        let idApremio = parseInt(row.original.id);
        
        certificadoApremio_formSet({
            ...certificadoApremio_formValues,
            idApremio: idApremio
        });
        FindApremio(idApremio);

        setStateAsignarApremio(prevState => {
             return {...prevState, showApremios: false};
        });  
    }

    const handleClickReporte = (reporte) => {
        const paramsReporte = {
            idCertificadoApremio: state.id
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
    const callbackSuccessFindCertificadoApremio = (response) => {
        response.json()
        .then((data) => {

            if (state.mode !== OPERATION_MODE.VIEW && data.certificadoApremio.idEstadoCertificadoApremio === 403) {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Certificado cancelado, no se podrá modificar", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/certificado-apremio/' + OPERATION_MODE.VIEW + '/' + state.id;
                    navigate(url, { replace: true });
                    navigate(0);
                });
                return;
            }

            //deserialize date fields
            if (data.certificadoApremio.fechaCertificado) data.certificadoApremio.fechaCertificado = new Date(data.certificadoApremio.fechaCertificado);
            if (data.certificadoApremio.fechaCalculo) data.certificadoApremio.fechaCalculo = new Date(data.certificadoApremio.fechaCalculo);
            if (data.certificadoApremio.fechaNotificacion) data.certificadoApremio.fechaNotificacion = new Date(data.certificadoApremio.fechaNotificacion);
            if (data.certificadoApremio.fechaRecepcion) data.certificadoApremio.fechaRecepcion = new Date(data.certificadoApremio.fechaRecepcion);
            data.archivos.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });
            data.observaciones.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });
            data.certificadoApremioPersonas.forEach(x => {
                if (x.fechaDesde) x.fechaDesde = new Date(x.fechaDesde);
                if (x.fechaHasta) x.fechaHasta = new Date(x.fechaHasta);
            });

            setState(prevState => {
                return {...prevState, loading: false, entity: data};
            });
            setPendingChange(false);
            certificadoApremio_formSet({
                idApremio: data.certificadoApremio.idApremio,
                idEstadoCertificadoApremio: data.certificadoApremio.idEstadoCertificadoApremio,
                numero: data.certificadoApremio.numero,
                idCuenta: data.certificadoApremio.idCuenta,
                idInspeccion: data.certificadoApremio.idInspeccion,
                montoTotal: data.certificadoApremio.montoTotal,
                fechaCertificado: data.certificadoApremio.fechaCertificado,
                fechaCalculo: data.certificadoApremio.fechaCalculo,
                fechaNotificacion: data.certificadoApremio.fechaNotificacion,
                fechaRecepcion: data.certificadoApremio.fechaRecepcion
            });

            dispatch(dataTaggerActionSet(state.processKey, {
                Archivo: data.archivos,
                Observacion: data.observaciones,
                Etiqueta: data.etiquetas
            }));

            if (data.certificadoApremio.idApremio > 0)
                FindApremio(data.certificadoApremio.idApremio);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackSuccessFindApremio = (response) => {
        response.json()
        .then((data) => {

            setState(prevState => {
                return {...prevState, loading: false};
            });

            setStateApremio(prevState => {
                return {...prevState, 
                    numeroApremio: data.apremio.numero,
                    carpetaApremio: data.apremio.carpeta,
                    caratulaApremio: data.apremio.caratula,
                    estadoApremio: data.apremio.estado};
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
    function FindCertificadoApremio() {
        
        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CERTIFICADO_APREMIO,
            paramsUrl,
            null,
            callbackSuccessFindCertificadoApremio,
            callbackNoSuccess,
            callbackError
        );

    }
    function ModifyCertificadoApremio() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Certificado actualizado correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                FindCertificadoApremio();
                //callbackSuccessFindCertificadoApremio(response);
            });
        };

        const dataBody = {
            certificadoApremio: {
                ...state.entity.certificadoApremio,
                idApremio: certificadoApremio_formValues.idApremio,
                idEstadoCertificadoApremio: certificadoApremio_formValues.idEstadoCertificadoApremio,
                numero: certificadoApremio_formValues.numero,
                idCuenta: certificadoApremio_formValues.idCuenta,
                idInspeccion: certificadoApremio_formValues.idInspeccion,
                montoTotal: certificadoApremio_formValues.montoTotal,
                fechaCertificado: certificadoApremio_formValues.fechaCertificado,
                fechaCalculo: certificadoApremio_formValues.fechaCalculo,
                fechaNotificacion: certificadoApremio_formValues.fechaNotificacion,
                fechaRecepcion: certificadoApremio_formValues.fechaRecepcion               
            },
            certificadoApremioItems: state.entity.certificadoApremioItems,
            certificadoApremioPersonas: state.entity.certificadoApremioPersonas.filter(f => f.state !== 'o'),
            archivos: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Etiqueta.filter(f => f.state !== 'o') : []
        };

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CERTIFICADO_APREMIO,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }
    function FindApremio(id) {
        
        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/${id}`;

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
    function ModifyCancelCertificadoApremio() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Certificado rechazado", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                const url =  '/certificado-apremio/' + OPERATION_MODE.VIEW + '/' + state.id;
                navigate(url, { replace: true });
                navigate(0);
            });
        };

        const paramsUrl = `/cancel/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CERTIFICADO_APREMIO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }
    function SearchApremios() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {

                data.forEach(x => {
                    if (x.fechaInicioDemanda) x.fechaInicioDemanda = new Date(x.fechaInicioDemanda);
                });

                data.sort((a,b) => b.fechaInicioDemanda.getTime() - Date.now());

                setStateAsignarApremio(prevState => {
                    return {...prevState, showApremios: true, list: data};
                });

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
        };

        const paramsUrl = '/filter?' +
        `numero=&`+
        `caratula=&`+
        `idExpediente=0&`+
        `idOrganismoJudicial=0&`+
        `fechaInicioDemandaDesde=&`+
        `fechaInicioDemandaHasta=`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.APREMIO,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }
    
    function UpdateEntity(typeEntity, row) {
        // o:original a:add m:modify r:remove c:modify only childs

        let entity = CloneObject(state.entity);

        if (typeEntity === 'CertificadoApremioPersona') {
            if (row.state === 'a') {
                entity.certificadoApremioPersonas.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.certificadoApremioPersonas.indexOf(entity.certificadoApremioPersonas.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.certificadoApremioPersonas[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.certificadoApremioPersonas = entity.certificadoApremioPersonas.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.certificadoApremioPersonas.find(x => x.id === row.id);
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

    const getDescOrganismoJudicial = (id) => {
        const row = getRowEntidad('OrganoJudicial', id);
        return (row) ? `${row.codigoOrganoJudicial} - ${row.departamentoJudicial}` : '';
    }

    const getDescFuero = (id) => {
        const row = getRowEntidad('OrganoJudicial', id);
        return (row) ? row.fuero : '';
    }

    const cellS = (props) =>    <div className='action'>
                                    <div onClick={ (event) => handleClickAsignarApremioSelect(props.row) } className="link">
                                        <i className="fa fa-arrow-left" title="seleccionar"></i>
                                    </div>
                                </div>

    const tableColumnsApremio = [
        { Header: '', Cell: cellS, id:'select', accessor: '', width: '5%', disableGlobalFilter: true, disableSortBy: true },
        { Header: 'Apremio', accessor: 'numero', width: '15%' },
        { Header: 'Inicio de demanda', Cell: (data) => (data.value) ? getDateToString(data.value, false) : '', accessor: 'fechaInicioDemanda', width: '25%' },
        { Header: 'Organismo judicial', Cell: (data) => getDescOrganismoJudicial(data.value), accessor: 'idOrganismoJudicial', width: '30%' },
        { Header: 'Fuero', Cell: (data) => getDescFuero(data.value), id:'fuero', accessor: 'idOrganismoJudicial', width: '25%' }
    ];

    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i>

    return (
    <>

        <Loading visible={state.loading}></Loading>

        {state.showMessage && 
            <MessageModal
                title={"Confirmación"}
                message={"¿Está seguro de rechazar el certificado?"}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showMessage: false};
                    });
                }}
                onConfirm={() => {
                    const id = state.rowId;
                    setState(prevState => {
                        return {...prevState, showMessage: false};
                    });
                    ModifyCancelCertificadoApremio();
                }}
            />
        }

        {stateAsignarApremio.showApremios && 
            <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content animated fadeIn">
                    <div className="modal-header">
                        <h5 className="modal-title">Apremios</h5>
                    </div>
                    <div className="modal-body">

                        <TableCustom
                            showFilterGlobal={true}
                            showPagination={false}
                            className={'TableCustomBase'}
                            columns={tableColumnsApremio}
                            data={stateAsignarApremio.list}
                        />

                    </div>
                    <div className="modal-footer">
                        <div className='footer-action-container'>
                        <button className="btn btn-outline-primary float-end" data-dismiss="modal" onClick={ () => handleClickAsignarApremioCancelar() }>Cancelar</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        }

        <div className='section-frames'>

            <div className='section-main'>

                <SectionHeading
                    title={
                        <>
                            Certificado (
                                <span className='text-heading-selecction'>Número: {state.entity.certificadoApremio.numero}</span>
                                                )
                        </>
                    }
                />

                <section className='section-accordion'>
                    <div className="m-top-20 m-bottom-20">

                        <div className="row">
                            <div className="mb-3 col-12 col-md-3">
                                <label htmlFor="numero" className="form-label">Número de certificado</label>
                                <input
                                    name="numero"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={certificadoApremio_formValues.numero}
                                    onChange={ certificadoApremio_formHandleProxy }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-12 col-md-3">
                                <label htmlFor="idEstadoCertificadoApremio" className="form-label">Estado</label>
                                <InputLista
                                    name="idEstadoCertificadoApremio"
                                    type="text"
                                    placeholder=""
                                    className="form-control"
                                    value={certificadoApremio_formValues.idEstadoCertificadoApremio}
                                    onChange={ certificadoApremio_formHandleProxy }
                                    disabled={true}
                                    lista="EstadoCertificadoApremio"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-12 col-md-6">
                                <label htmlFor="idCuenta" className="form-label">Cuenta</label>
                                <InputCuenta
                                    name="idCuenta"
                                    placeholder=""
                                    className="form-control"
                                    value={certificadoApremio_formValues.idCuenta}
                                    onChange={ certificadoApremio_formHandleProxy }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-12 col-md-3">
                                <label htmlFor="idInspeccion" className="form-label">Número de inspección</label>
                                <InputLista
                                    name="idInspeccion"
                                    placeholder=""
                                    className="form-control"
                                    value={certificadoApremio_formValues.idInspeccion}
                                    onChange={ certificadoApremio_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    lista="InspeccionCertificadoApremio"
                                />
                            </div>
                            <div className="mb-3 col-12 col-md-3">
                                <label htmlFor="montoTotal" className="form-label">Total deuda</label>
                                <InputNumber
                                    type="number"
                                    name="montoTotal"
                                    placeholder=""
                                    className="form-control"
                                    value={certificadoApremio_formValues.montoTotal}
                                    onChange={ certificadoApremio_formHandleProxy }
                                    precision={2}
                                    disabled={true}
                                />
                            </div>

                            <div className="col-6 col-md-3">
                                <label htmlFor="fechaCertificado" className="form-label">Fecha certificado</label>
                                <DatePickerCustom
                                    name="fechaCertificado"
                                    placeholder=""
                                    className="form-control"
                                    value={certificadoApremio_formValues.fechaCertificado}
                                    onChange={ certificadoApremio_formHandleProxy }
                                    disabled={true}
                                />
                            </div>
                            <div className="col-6 col-md-3">
                                <label htmlFor="fechaCalculo" className="form-label">Fecha cálculo</label>
                                <DatePickerCustom
                                    name="fechaCalculo"
                                    placeholder=""
                                    className="form-control"
                                    value={certificadoApremio_formValues.fechaCalculo}
                                    onChange={ certificadoApremio_formHandleProxy }
                                    disabled={true}
                                />
                            </div>
                            <div className="col-6 col-md-3">
                                <label htmlFor="fechaNotificacion" className="form-label">Fecha notificación</label>
                                <DatePickerCustom
                                    name="fechaNotificacion"
                                    placeholder=""
                                    className="form-control"
                                    value={certificadoApremio_formValues.fechaNotificacion}
                                    onChange={ certificadoApremio_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                            <div className="col-6 col-md-3">
                                <label htmlFor="fechaRecepcion" className="form-label">Fecha recepción</label>
                                <DatePickerCustom
                                    name="fechaRecepcion"
                                    placeholder=""
                                    className="form-control"
                                    value={certificadoApremio_formValues.fechaRecepcion}
                                    onChange={ certificadoApremio_formHandleProxy }
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                />
                            </div>
                        </div>

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('apremio')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.apremio) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.apremio ? 'active' : ''}>Apremio</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.apremio &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>

                                <div className="col-12 col-md-3">
                                    <label htmlFor="numeroApremio" className="form-label">Número de Apremio</label>
                                    <input
                                        name="numeroApremio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={stateApremio.numeroApremio}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 col-md-9">
                                    <label htmlFor="carpetaApremio" className="form-label">Carpeta</label>
                                    <input
                                        name="carpetaApremio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={stateApremio.carpetaApremio}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="caratulaApremio" className="form-label">Caratula</label>
                                    <input
                                        name="caratulaApremio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={stateApremio.caratulaApremio}
                                        disabled={true}
                                    />
                                </div>    
                                <div className="col-12">
                                    <label htmlFor="estadoApremio" className="form-label">Estado</label>
                                    <input
                                        name="estadoApremio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={stateApremio.estadoApremio}
                                        disabled={true}
                                    />
                                </div>

                            </div>
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
                                title="Información adicional de Certificado Apremio"
                                processKey={state.processKey}
                                entidad="CertificadoApremio"
                                idEntidad={state.id}
                                disabled={(state.mode === OPERATION_MODE.VIEW)}         
                                onChange={(row) => setPendingChange(true)}                   
                            />
                        </div>
                        )}

                        <Tabs
                            id="tabs-apremio"
                            activeKey={state.tabActive}
                            className="m-top-20"
                            onSelect={(tab) => SetTabActive(tab)}
                        >
                            <Tab eventKey="personas" title="Personas">
                                <div className='tab-panel'>
                                    <CertificadoApremioPersonaGrid
                                        processKey={state.processKey}
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        data={{
                                            idCertificadoApremio: state.entity.certificadoApremio.id,
                                            list: state.entity.certificadoApremioPersonas
                                        }}
                                        onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                    />    
                                </div>
                            </Tab>
                            <Tab eventKey="saldos" title="Saldos certificados">
                                <div className='tab-panel'>
                                    <CertificadosApremioItemGrid
                                        data={{
                                            idCertificadoApremio: state.entity.certificadoApremio.id,
                                            list: state.entity.certificadoApremioItems
                                        }}
                                    />                                    
                                </div>
                            </Tab>

                        </Tabs>

                    </div>

                </section>

            </div>

        </div>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
                    {state.mode !== OPERATION_MODE.VIEW &&
                        <>
                            <button className="btn back-button m-left-50 float-start" onClick={ (event) => handleClickReporte("CertificadoApremioJuicio") }>Imprimir</button>
                            <button className="btn decline-button m-left-50 float-start" onClick={ (event) => handleClickRechazar() } >Rechazar</button>
                            <button
                                className={pendingChange ? "btn action-button float-end" : "btn action-button btn-disabled float-end"}
                                onClick={ (event) => handleClickGuardar() }
                                disabled={!pendingChange}
                            >
                                Guardar
                            </button>
                        {!state.entity.certificadoApremio.idApremio > 0 &&
                        <>     
                            <button className="btn btn-outline-primary m-left-50 float-end" onClick={ (event) => handleClickAsignarApremio() }>Asignar Apremio</button>
                            <button className="btn btn-outline-primary float-end" onClick={ (event) => handleClickNuevoApremio() } >Nuevo Apremio</button>
                        </>
                        }
                    </>
                    }
                    {state.entity.certificadoApremio.idApremio > 0 && 
                    <>     
                        <button className="btn btn-outline-primary float-end" onClick={ (event) => handleClickVerApremio() } >Ver Apremio</button>
                    </>
                    }
            </div>
        </footer>

    </>
    )
}

export default CertificadoApremioView;