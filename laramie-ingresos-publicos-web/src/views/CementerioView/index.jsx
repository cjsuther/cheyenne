import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { Tab, Tabs } from 'react-bootstrap';

import { dataTaggerActionSet, dataTaggerActionClear } from '../../context/redux/actions/dataTaggerAction';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APPCONFIG } from '../../app.config';
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { CUENTA_STATE } from '../../consts/cuentaState';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { useForm } from '../../components/hooks/useForm';

import { Loading, SectionHeading, SectionSidebar, DatePickerCustom, InputLista, InputFormat, InputEntidad, MessageModal } from '../../components/common';
import { CloneObject } from '../../utils/helpers';
import { getDateId } from '../../utils/convert';
import ShowToastMessage from '../../utils/toast';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import RelacionesCuentasGrid from '../../components/controls/RelacionesCuentasGrid';
import DomiciliosGrid from '../../components/controls/DomiciliosGrid';
import VariablesGrid from '../../components/controls/VariablesGrid';
import VinculosCementerioGrid from '../../components/controls/VinculosCementerioGrid';
import InhumadosGrid from '../../components/controls/InhumadosGrid';
import ZonasEntregaGrid from '../../components/controls/ZonasEntregaGrid';
import ControladoresCuentasGrid from '../../components/controls/ControladoresCuentasGrid';
import CondicionesEspecialesGrid from '../../components/controls/CondicionesEspecialesGrid';
import RecargosDescuentosGrid from '../../components/controls/RecargosDescuentosGrid';
import DebitosAutomaticosGrid from '../../components/controls/DebitosAutomaticosGrid';
import CuentaCertificadoApremioGrid from '../../components/controls/CuentaCertificadoApremioGrid';
import CuentaCertificadoEscribanoGrid from '../../components/controls/CuentaCertificadoEscribanoGrid';
import CuentaExpedienteGrid from '../../components/controls/CuentaExpedienteGrid';
import { MASK_FORMAT } from '../../consts/maskFormat';
import InputNumber from '../../components/common/InputNumber';
import CuentaDebitosCreditosGrid from '../../components/controls/CuentaDebitosCreditosGrid';
import CuentaPagosAnticipadosGrid from '../../components/controls/CuentaPagosAnticipadosGrid';
import CuentaPlanesPagosGrid from '../../components/controls/CuentaPlanesPagosGrid';
import { useBeforeunload } from 'react-beforeunload';
import CuentaEmisionEjecucionForm from '../../components/controls/CuentaEmisionEjecucionForm';


function CementerioView() {

    //parametros url
    const params = useParams();

    //variables
    const entityInit = {
        cementerio: {
            id: 0,
            idCuenta: 0,
            idEstadoCarga: 20,
            fechaCargaInicio: null,
            fechaCargaFin: null,
            idTipoConstruccionFuneraria: 0,
            idCementerio: 0,
            circunscripcionCementerio: '',
            seccionCementerio: '',
            manzanaCementerio: '',
            parcelaCementerio: '',
            frenteCementerio: '',
            filaCementerio: '',
            numeroCementerio: '',
            fechaAlta: null,
            fechaBaja: null,
            fechaPresentacion: null,
            digitoVerificador: '',
            fechaConcesion: null,
            fechaEscritura: null,
            fechaSucesion: null,
            libroEscritura: '',
            folioEscritura: '',
            numeroSucesion: '',
            superficie: 0,
            largo: 0,
            ancho: 0    
        },
        cuenta: {
            id: 0,
            numeroCuenta: '',
            numeroWeb: '',
            idEstadoCuenta: 1,
            idTipoTributo: 0,
            idTributo: 0,
            fechaAlta: null,
            fechaBaja: null
        },
        relacionesCuentas: [],
        archivos: [],
        observaciones: [],
        etiquetas: [],
        variablesCuenta: [],
        vinculosCementerio: [],
        zonasEntrega: [],
        controladoresCuentas: [],
        condicionesEspeciales: [],
        recargosDescuentos: [],
        debitosAutomaticos: [],
        inhumados: []
    };
    const menuesInit = {
        expedientes: false,
        certificadosEscribanos: false,
        relacionesCuentas: false,
        controladoresCuentas: false,
        zonasEntrega: false,
        debitosCreditos: false,
        pagosAnticipados: false,
        planesPago: false
    };

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        processKey: `Cementerio_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        accordions: {
            cuenta: true,
            vinculos: false,
            datosUbicacion: false,
            datosCementerio: false,
            inhumados: false,
            domicilios: false,
            estado: false,
            info: false
        },
        menues: menuesInit,
        showMenu: false,
        tabActive: "exenciones"
    });

    const [toggledSidebarLeft, setToggledSidebarLeft] = useState(true);
    const [pendingChange, setPendingChange] = useState(state.mode === OPERATION_MODE.NEW);
    const [message, setMessage] = useState({ show: false, text: "", callback: null, id: 0 });

    const dispatch = useDispatch();
    const dataTagger = useSelector( (state) => state.dataTagger.data );

    useBeforeunload((event) => {
        if ((pendingChange) && (state.mode === OPERATION_MODE.EDIT)) {
            event.preventDefault();
        }
    });

    const mount = () => {
        if (state.id > 0) {
            FindCementerio();
        }
        else {
            dispatch(dataTaggerActionSet(state.processKey, {
                Archivo: [],
                Observacion: [],
                Etiqueta: []
            }));
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Ingrese los datos y presione siguiente para confirmar el alta');
        }
    }
    useEffect(mount, []);

    const [listExpedientes, setListExpedientes] = useState([]);

    const updateListExpedientes = () => {
        var list = []
        const listsWithExpediente = [
            ...state.entity.recargosDescuentos
        ];
        listsWithExpediente.filter(f => f.state !== 'r').forEach(x => {
            if (x.idExpediente && x.idExpediente > 0 && list.indexOf(x.idExpediente) === -1) list.push(x.idExpediente)
        });

        setListExpedientes(list);
    }

    useEffect(updateListExpedientes, [state.entity.recargosDescuentos]);

    const [ cementerio_formValues, cementerio_formHandle, , cementerio_formSet ] = useForm({
        idEstadoCarga: 20,
        idTipoConstruccionFuneraria: 0,
        idCementerio: 0,
        circunscripcionCementerio: '',
        seccionCementerio: '',
        manzanaCementerio: '',
        parcelaCementerio: '',
        frenteCementerio: '',
        filaCementerio: '',
        numeroCementerio: '',
        fechaAlta: null,
        fechaBaja: null,
        fechaPresentacion: null,
        digitoVerificador: '',
        fechaConcesion: null,
        fechaEscritura: null,
        fechaSucesion: null,
        libroEscritura: '',
        folioEscritura: '',
        numeroSucesion: '',
        superficie: 0,
        largo: 0,
        ancho: 0        
    }, 'cementerio_');

    const [ cuenta_formValues, cuenta_formHandle, , cuenta_formSet ] = useForm({
        numeroCuenta: '',
        numeroWeb: ''
    }, 'cuenta_');

    //handles
    const cuenta_formHandleProxy = (event) => {
        cuenta_formHandle(event);
        setPendingChange(true);
    }
    const cementerio_formHandleProxy = (event) => {
        cementerio_formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (isFormValid()) {
            if (state.id === 0) {
                AddCementerio();
            }
            else {
                ModifyCementerio();
            }
        };
    };
    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        const url = '/cementerios';
        navigate(url, { replace: true });
    }
    const handleClickBaja = () => {
        setMessage({ show: true, text: "Confirma dar la baja de la cuenta", callback: ModifyBajaCuenta, id: state.entity.cuenta.id });
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
    const callbackSuccessFindImueble = (response) => {
        response.json()
        .then((data) => {

            //deserialize date fields
            if (data.cementerio.fechaCargaInicio) data.cementerio.fechaCargaInicio = new Date(data.cementerio.fechaCargaInicio);
            if (data.cementerio.fechaCargaFin) data.cementerio.fechaCargaFin = new Date(data.cementerio.fechaCargaFin);         
            if (data.cementerio.fechaAlta) data.cementerio.fechaAlta = new Date(data.cementerio.fechaAlta);
            if (data.cementerio.fechaBaja) data.cementerio.fechaBaja = new Date(data.cementerio.fechaBaja);
            if (data.cementerio.fechaPresentacion) data.cementerio.fechaPresentacion = new Date(data.cementerio.fechaPresentacion);
            if (data.cementerio.fechaConcesion) data.cementerio.fechaConcesion = new Date(data.cementerio.fechaConcesion);
            if (data.cementerio.fechaEscritura) data.cementerio.fechaEscritura = new Date(data.cementerio.fechaEscritura);
            if (data.cementerio.fechaSucesion) data.cementerio.fechaSucesion = new Date(data.cementerio.fechaSucesion);
            
            if (data.cuenta.fechaAlta) data.cuenta.fechaAlta = new Date(data.cuenta.fechaAlta);
            if (data.cuenta.fechaBaja) data.cuenta.fechaBaja = new Date(data.cuenta.fechaBaja);

            data.archivos.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });
            data.observaciones.forEach(x => {
                if (x.fecha) x.fecha = new Date(x.fecha);
            });
            data.variablesCuenta.forEach(x => {
                if (x.fechaDesde) x.fechaDesde = new Date(x.fechaDesde);
                if (x.fechaHasta) x.fechaHasta = new Date(x.fechaHasta);
            });
            data.vinculosCementerio.forEach(x => {
                if (x.fechaInstrumentoDesde) x.fechaInstrumentoDesde = new Date(x.fechaInstrumentoDesde);
                if (x.fechaInstrumentoHasta) x.fechaInstrumentoHasta = new Date(x.fechaInstrumentoHasta);
            });
            data.condicionesEspeciales.forEach(x => {
                if (x.fechaDesde) x.fechaDesde = new Date(x.fechaDesde);
                if (x.fechaHasta) x.fechaHasta = new Date(x.fechaHasta);
            });
            data.recargosDescuentos.forEach(x => {
                if (x.fechaDesde) x.fechaDesde = new Date(x.fechaDesde);
                if (x.fechaHasta) x.fechaHasta = new Date(x.fechaHasta);
                if (x.fechaOtorgamiento) x.fechaOtorgamiento = new Date(x.fechaOtorgamiento);
            });
            data.debitosAutomaticos.forEach(x => {
                if (x.fechaDesde) x.fechaDesde = new Date(x.fechaDesde);
                if (x.fechaAlta) x.fechaAlta = new Date(x.fechaAlta);
                if (x.fechaBaja) x.fechaBaja = new Date(x.fechaBaja);
            });  
            data.inhumados.forEach(x => {
                if (x.fechaNacimiento) x.fechaNacimiento = new Date(x.fechaNacimiento);
                if (x.fechaDefuncion) x.fechaDefuncion = new Date(x.fechaDefuncion);
                if (x.fechaIngreso) x.fechaIngreso = new Date(x.fechaIngreso);
                if (x.fechaEgreso) x.fechaEgreso = new Date(x.fechaEgreso);
                if (x.fechaTraslado) x.fechaTraslado = new Date(x.fechaTraslado);
                if (x.fechaExhumacion) x.fechaExhumacion = new Date(x.fechaExhumacion);
                if (x.fechaReduccion) x.fechaReduccion = new Date(x.fechaReduccion);
                if (x.fechaHoraInicioVelatorio) x.fechaHoraInicioVelatorio = new Date(x.fechaHoraInicioVelatorio);
                if (x.fechaHoraFinVelatorio) x.fechaHoraFinVelatorio = new Date(x.fechaHoraFinVelatorio);
            });


            setState(prevState => {
                return {...prevState, loading: false, entity: data};
            });
            setPendingChange(false);
            cementerio_formSet({
                idEstadoCarga: data.cementerio.idEstadoCarga,
                idTipoConstruccionFuneraria: data.cementerio.idTipoConstruccionFuneraria,
                idCementerio: data.cementerio.idCementerio,
                circunscripcionCementerio: data.cementerio.circunscripcionCementerio,
                seccionCementerio: data.cementerio.seccionCementerio,
                manzanaCementerio: data.cementerio.manzanaCementerio,
                parcelaCementerio: data.cementerio.parcelaCementerio,
                frenteCementerio: data.cementerio.frenteCementerio,
                filaCementerio: data.cementerio.filaCementerio,
                numeroCementerio: data.cementerio.numeroCementerio,
                fechaAlta: data.cementerio.fechaAlta,
                fechaBaja: data.cementerio.fechaBaja,
                fechaPresentacion: data.cementerio.fechaPresentacion,
                digitoVerificador: data.cementerio.digitoVerificador,
                fechaConcesion: data.cementerio.fechaConcesion,
                fechaEscritura: data.cementerio.fechaEscritura,
                fechaSucesion: data.cementerio.fechaSucesion,
                libroEscritura: data.cementerio.libroEscritura,
                folioEscritura: data.cementerio.folioEscritura,
                numeroSucesion: data.cementerio.numeroSucesion,
                superficie: data.cementerio.superficie,
                largo: data.cementerio.largo,
                ancho: data.cementerio.ancho                
            });
            cuenta_formSet({
                numeroCuenta: data.cuenta.numeroCuenta,
                numeroWeb: data.cuenta.numeroWeb
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
    };

    //funciones
    function makeListDomicilios() {
        let listDomicilios = [];

        if (state.entity.zonasEntrega.length > 0 && state.entity.cuenta.idDireccionEntrega) {
            let direccion = null;
            state.entity.zonasEntrega.forEach(x => {
                if (x.direccion.id === state.entity.cuenta.idDireccionEntrega) {
                    direccion = x.direccion;
                }
            });
            if (direccion) {
                const domicilioEntrega = {...direccion, domicilio: "Entrega"};
                listDomicilios.push(domicilioEntrega);
            }
        }

        return listDomicilios;
    }

    function isFormValid() {
        if (cementerio_formValues.idEstadoCarga === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Estado de Carga incompleto');
            return false;
        }

        if (cementerio_formValues.idTipoConstruccionFuneraria <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo de construcción');
            return false;
        }      
        
        if (cementerio_formValues.idCementerio <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Cementerio');
            return false;
        }   
        
        if (cementerio_formValues.circunscripcionCementerio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Circunscripción');
            return false;
        }  

        if (cementerio_formValues.seccionCementerio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Sección');
            return false;
        }  

        if (cementerio_formValues.manzanaCementerio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Manzana');
            return false;
        }  

        if (cementerio_formValues.parcelaCementerio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Parcela');
            return false;
        }  

        if (cementerio_formValues.frenteCementerio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Frente');
            return false;
        }  

        if (cementerio_formValues.filaCementerio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fila');
            return false;
        }  

        if (cementerio_formValues.numeroCementerio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número');
            return false;
        }  

        if (cementerio_formValues.fechaAlta == null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Fecha alta');
            return false;
        } 
        
        if (cementerio_formValues.libroEscritura.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Libro escritura');
            return false;
        }   

        if (cementerio_formValues.folioEscritura.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Folio escritura');
            return false;
        }  

        if (cementerio_formValues.numeroSucesion.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número sucesión');
            return false;
        }  

        if (cementerio_formValues.superficie <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El campo Superficie debe ser mayor a cero');
            return false;
        }  

        if (cementerio_formValues.largo <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El campo Largo debe ser mayor a cero');
            return false;
        }  

        if (cementerio_formValues.ancho <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El campo Ancho debe ser mayor a cero');
            return false;
        }   
        
        if (cementerio_formValues.digitoVerificador.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Dígito verificador');
            return false;
        }                

        return true;
    }

    function FindCementerio() {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CEMENTERIO,
            paramsUrl,
            null,
            callbackSuccessFindImueble,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddCementerio() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Cementerio ingresado correctamente", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/cementerio/' + OPERATION_MODE.EDIT + '/' + row.cementerio.id;
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
            cementerio: {
                ...state.entity.cementerio,
                idEstadoCarga: cementerio_formValues.idEstadoCarga,
                idTipoConstruccionFuneraria: cementerio_formValues.idTipoConstruccionFuneraria,
                idCementerio: cementerio_formValues.idCementerio,
                circunscripcionCementerio: cementerio_formValues.circunscripcionCementerio,
                seccionCementerio: cementerio_formValues.seccionCementerio,
                manzanaCementerio: cementerio_formValues.manzanaCementerio,
                parcelaCementerio: cementerio_formValues.parcelaCementerio,
                frenteCementerio: cementerio_formValues.frenteCementerio,
                filaCementerio: cementerio_formValues.filaCementerio,
                numeroCementerio: cementerio_formValues.numeroCementerio,
                fechaAlta: cementerio_formValues.fechaAlta,
                fechaBaja: cementerio_formValues.fechaBaja,
                fechaPresentacion: cementerio_formValues.fechaPresentacion,
                digitoVerificador: cementerio_formValues.digitoVerificador,
                fechaConcesion: cementerio_formValues.fechaConcesion,
                fechaEscritura: cementerio_formValues.fechaEscritura,
                fechaSucesion: cementerio_formValues.fechaSucesion,
                libroEscritura: cementerio_formValues.libroEscritura,
                folioEscritura: cementerio_formValues.folioEscritura,
                numeroSucesion: cementerio_formValues.numeroSucesion,
                superficie: cementerio_formValues.superficie,
                largo: cementerio_formValues.largo,
                ancho: cementerio_formValues.ancho
            },
            cuenta: {
                ...state.entity.cuenta,
                numeroCuenta: cuenta_formValues.numeroCuenta,
                numeroWeb: cuenta_formValues.numeroWeb
            },
            relacionesCuentas: [],
            archivos: [],
            observaciones: [],
            etiquetas: [],
            variablesCuenta: [],
            vinculosCementerio: [],
            zonasEntrega: [],
            controladoresCuentas: [],
            condicionesEspeciales: [],
            recargosDescuentos: [],
            debitosAutomaticos: [],
            inhumados: []
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.CEMENTERIO,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ModifyCementerio() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Cementerio actualizado correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                callbackSuccessFindImueble(response);
            });
        };

        const dataBody = {
            cementerio: {
                ...state.entity.cementerio,
                idEstadoCarga: cementerio_formValues.idEstadoCarga,
                idTipoConstruccionFuneraria: cementerio_formValues.idTipoConstruccionFuneraria,
                idCementerio: cementerio_formValues.idCementerio,
                circunscripcionCementerio: cementerio_formValues.circunscripcionCementerio,
                seccionCementerio: cementerio_formValues.seccionCementerio,
                manzanaCementerio: cementerio_formValues.manzanaCementerio,
                parcelaCementerio: cementerio_formValues.parcelaCementerio,
                frenteCementerio: cementerio_formValues.frenteCementerio,
                filaCementerio: cementerio_formValues.filaCementerio,
                numeroCementerio: cementerio_formValues.numeroCementerio,
                fechaAlta: cementerio_formValues.fechaAlta,
                fechaBaja: cementerio_formValues.fechaBaja,
                fechaPresentacion: cementerio_formValues.fechaPresentacion,
                digitoVerificador: cementerio_formValues.digitoVerificador,
                fechaConcesion: cementerio_formValues.fechaConcesion,
                fechaEscritura: cementerio_formValues.fechaEscritura,
                fechaSucesion: cementerio_formValues.fechaSucesion,
                libroEscritura: cementerio_formValues.libroEscritura,
                folioEscritura: cementerio_formValues.folioEscritura,
                numeroSucesion: cementerio_formValues.numeroSucesion,
                superficie: cementerio_formValues.superficie,
                largo: cementerio_formValues.largo,
                ancho: cementerio_formValues.ancho
            },
            cuenta: {
                ...state.entity.cuenta,
                numeroCuenta: cuenta_formValues.numeroCuenta,
                numeroWeb: cuenta_formValues.numeroWeb
            },
            relacionesCuentas: state.entity.relacionesCuentas.filter(f => f.state !== 'o'),
            archivos: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Archivo.filter(f => f.state !== 'o') : [],
            observaciones: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Observacion.filter(f => f.state !== 'o') : [],
            etiquetas: (dataTagger[state.processKey]) ? dataTagger[state.processKey].Etiqueta.filter(f => f.state !== 'o') : [],
            variablesCuenta: state.entity.variablesCuenta, //en este caso hacen falta todos para validar los rangos
            vinculosCementerio: state.entity.vinculosCementerio, //en este caso hacen falta todos para calcular el referente de la cuenta
            zonasEntrega: state.entity.zonasEntrega.filter(f => f.state !== 'o'),
            controladoresCuentas: state.entity.controladoresCuentas.filter(f => f.state !== 'o'),
            condicionesEspeciales: state.entity.condicionesEspeciales.filter(f => f.state !== 'o'),
            recargosDescuentos: state.entity.recargosDescuentos.filter(f => f.state !== 'o'),
            debitosAutomaticos: state.entity.debitosAutomaticos.filter(f => f.state !== 'o'),
            inhumados: state.entity.inhumados.filter(f => f.state !== 'o').map(x => {
                x.verificaciones = x.verificaciones.filter(f => f.state !== 'o');
                return x;
            })              
        };

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CEMENTERIO,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ModifyBajaCuenta(idCuenta) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "La cuenta fue dada de baja correctamente", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/cementerio/' + OPERATION_MODE.VIEW + '/' + row.idTributo;
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

        const paramsUrl = `/baja/${idCuenta}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CUENTA,
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

        if (typeEntity === 'RelacionCuenta') {
            if (row.state === 'a') {
                entity.relacionesCuentas.push(row);
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.relacionesCuentas = entity.relacionesCuentas.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.relacionesCuentas.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'VariableCuenta') {
            if (row.state === 'a') {
                entity.variablesCuenta.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.variablesCuenta.indexOf(entity.variablesCuenta.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.variablesCuenta[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.variablesCuenta = entity.variablesCuenta.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.variablesCuenta.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'VinculoCementerio') {
            if (row.state === 'a') {
                entity.vinculosCementerio.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.vinculosCementerio.indexOf(entity.vinculosCementerio.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.vinculosCementerio[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.vinculosCementerio = entity.vinculosCementerio.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.vinculosCementerio.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'ZonaEntrega') {
            if (row.state === 'a') {
                entity.zonasEntrega.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.zonasEntrega.indexOf(entity.zonasEntrega.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.zonasEntrega[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.zonasEntrega = entity.zonasEntrega.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.zonasEntrega.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }
        
        if (typeEntity === 'ControladorCuenta') {
            if (row.state === 'a') {
                entity.controladoresCuentas.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.controladoresCuentas.indexOf(entity.controladoresCuentas.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.controladoresCuentas[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.controladoresCuentas = entity.controladoresCuentas.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.controladoresCuentas.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'CondicionEspecial') {
            if (row.state === 'a') {
                entity.condicionesEspeciales.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.condicionesEspeciales.indexOf(entity.condicionesEspeciales.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.condicionesEspeciales[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.condicionesEspeciales = entity.condicionesEspeciales.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.condicionesEspeciales.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'RecargoDescuento') {
            if (row.state === 'a') {
                entity.recargosDescuentos.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.recargosDescuentos.indexOf(entity.recargosDescuentos.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.recargosDescuentos[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.recargosDescuentos = entity.recargosDescuentos.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.recargosDescuentos.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'DebitosAutomaticos') {
            if (row.state === 'a') {
                entity.debitosAutomaticos.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.debitosAutomaticos.indexOf(entity.debitosAutomaticos.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.debitosAutomaticos[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.debitosAutomaticos = entity.debitosAutomaticos.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.debitosAutomaticos.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'Inhumado') {
            if (row.state === 'a') {
                entity.inhumados.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.inhumados.indexOf(entity.inhumados.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.inhumados[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.inhumados = entity.inhumados.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.inhumados.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }  
        
        if (typeEntity === 'Verificacion') {
            let inhumado = entity.inhumados.find(x => x.id === row.idInhumado);
            if (inhumado.state === 'o') {
                inhumado.state = 'c';
            }

            if (row.state === 'a') {
                inhumado.verificaciones.push(row);
            }
            else if (row.state === 'm') {
                const index = inhumado.verificaciones.indexOf(inhumado.verificaciones.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //sigue siendo un alta porque no existe en la bd
                    inhumado.verificaciones[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    inhumado.verificaciones = inhumado.verificaciones.filter(f => f.id !== row.id);
                }
                else {
                    let item = inhumado.verificaciones.find(x => x.id === row.id);
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

    function ShowPopupMenu(menu) {
        let menues = CloneObject(menuesInit);
        menues[menu] = true;
        setState(prevState => {
            return {...prevState, showMenu: true, menues: menues};
        });
    }

    function HidePopupMenu() {
        setState(prevState => {
            return {...prevState, showMenu: false, menues: menuesInit};
        });
    }

    function ShowPage(partialUrl) {
        const url = APPCONFIG.SITE.WEBAPP + partialUrl + '/' + state.mode + '/' + state.entity.cuenta.id;
        window.open(url, '_blank');
    }

    const listMenu = [

        {menu: '1', items: [
            {title: 'Expedientes', icon: 'fa fa-file', onClick: () => {ShowPopupMenu('expedientes')}}
        ]},
    
        {menu: '2', items: [
            {title: 'Gestión', icon: 'fa fa-gavel', items: [
                {title: 'Certificados Escribanos', onClick: () => {ShowPopupMenu('certificadosEscribanos')}},
                {title: 'Relaciones', onClick: () => {ShowPopupMenu('relacionesCuentas')}},
                {title: 'Controladores', onClick: () => {ShowPopupMenu('controladoresCuentas')}},
                {title: 'Zonas Entregas', onClick: () => {ShowPopupMenu('zonasEntrega')}}
            ]},
            {title: 'Movimientos', icon: 'fa fa-calculator', items: [
                {title: 'Cuenta Corriente', onClick: () => {ShowPage('cuenta-corriente/cuenta')}},
                {title: 'Débitos y Créditos', onClick: () => {ShowPopupMenu('debitosCreditos')}},
                {title: 'Pagos Anticipados', onClick: () => {ShowPopupMenu('pagosAnticipados')}},
                {title: 'Deuda', onClick: () => {ShowPage('deuda')}},
                {title: 'Planes de Pago', onClick: () => {ShowPopupMenu('planesPago')}},
                {title: 'Liquidaciones', onClick: () => {ShowPopupMenu('liquidaciones')}}
            ]}
        ]},
    
    ];
    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i>

    return (
    <>

        <Loading visible={state.loading}></Loading>

        {message.show && 
            <MessageModal
                title={"Confirmación"}
                message={message.text}
                onDismiss={() => {
                    setMessage({ show: false, text: "", callback: null, id: 0 });
                }}
                onConfirm={() => {
                    if (message.callback) {
                        message.callback(message.id);
                    }
                    setMessage({ show: false, text: "", callback: null, id: 0 });
                }}
            />
        }

        {state.showMenu && 
            <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content animated fadeIn">
                    <div className="modal-header">
                        {state.menues.expedientes && (
                            <h5 className="modal-title">Expedientes</h5>
                        )}
                        {state.menues.certificadosEscribanos && (
                            <h5 className="modal-title">Certificados Escribanos</h5>
                        )}
                        {state.menues.relacionesCuentas && (
                            <h5 className="modal-title">Relaciones con otras Cuentas</h5>
                        )}
                        {state.menues.controladoresCuentas && (
                            <h5 className="modal-title">Controladores de la Cuenta</h5>
                        )}
                        {state.menues.zonasEntrega && (
                            <h5 className="modal-title">Zonas de Entrega</h5>
                        )}
                        {state.menues.debitosCreditos && (
                            <h5 className="modal-title">Débitos y Créditos</h5>
                        )}
                        {state.menues.pagosAnticipados && (
                            <h5 className="modal-title">Pagos Anticipos</h5>
                        )}
                        {state.menues.planesPago && (
                            <h5 className="modal-title">Planes de Pago</h5>
                        )}
                        {state.menues.liquidaciones && (
                            <h5 className="modal-title">Liquidaciones</h5>
                        )}
                        </div>
                        <div className="modal-body">
                        {state.menues.expedientes && (
                            <CuentaExpedienteGrid
                                data={{
                                    listIdExpedientes: listExpedientes
                                }}
                            />
                        )}
                        {state.menues.certificadosEscribanos && (
                            <CuentaCertificadoEscribanoGrid
                                data={{
                                    idCuenta: state.entity.cuenta.id
                                }}
                            />
                        )}
                        {state.menues.relacionesCuentas && (
                            <RelacionesCuentasGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idCuenta: state.entity.cuenta.id,
                                    list: state.entity.relacionesCuentas
                                }}
                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                            />
                        )}
                        {state.menues.controladoresCuentas && (
                            <ControladoresCuentasGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idCuenta: state.entity.cuenta.id,
                                    list: state.entity.controladoresCuentas
                                }}
                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                            />
                        )}
                        {state.menues.zonasEntrega && (
                            <ZonasEntregaGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idCuenta: state.entity.cuenta.id,
                                    list: state.entity.zonasEntrega
                                }}
                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                            />
                        )}
                        {state.menues.debitosCreditos && (
                            <CuentaDebitosCreditosGrid
                                data={{
                                    idCuenta: state.entity.cuenta.id,
                                    idTipoTributo: state.entity.cuenta.idTipoTributo,
                                    rubrosComercio: []
                                }}
                            />
                        )}
                        {state.menues.pagosAnticipados && (
                            <CuentaPagosAnticipadosGrid
                                data={{
                                    idCuenta: state.entity.cuenta.id,
                                    rubrosComercio: []
                                }}
                            />
                        )}
                        {state.menues.planesPago && (
                            <CuentaPlanesPagosGrid
                                data={{
                                    idCuenta: state.entity.cuenta.id
                                }}
                            />
                        )}
                        {state.menues.liquidaciones && (
                            <CuentaEmisionEjecucionForm
                                data={{
                                    idCuenta: state.entity.cuenta.id,
                                    idTipoTributo: state.entity.cuenta.idTipoTributo
                                }}
                                onDismiss={() => HidePopupMenu()}
                            />
                        )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => HidePopupMenu() }>Salir</button>
                        </div>
                    </div>
                </div>
            </div>
        }

        <div className='section-frames'>

            <div className='section-sidebar-left'>
                <SectionSidebar
                    collapsed={toggledSidebarLeft}
                    listMenu={listMenu}
                />
            </div>

            <div className='section-main'>

                <SectionHeading
                    handleToggleSidebar={(state.mode !== OPERATION_MODE.NEW) ? () => { setToggledSidebarLeft(prevState => !prevState) } : null}
                    title={
                        <>
                            Cementerio ({(state.id === 0) ? 
                                <span className='text-heading-selecction'>Nuevo</span> :
                                <span className='text-heading-selecction'>Número de Cuenta: {state.entity.cuenta.numeroCuenta}</span>
                            })
                        </>
                    }
                />

                <section className='section-accordion'>

                    <div className="m-top-20 m-bottom-20">

                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('cuenta')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.cuenta) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.cuenta ? 'active' : ''}>Cuenta</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.cuenta &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cuenta_numeroCuenta" className="form-label">Número de Cuenta</label>
                                    <InputFormat
                                        name="cuenta_numeroCuenta"
                                        placeholder="[autonumérico]"
                                        className="form-control"
                                        mask={MASK_FORMAT.CUENTA}
                                        maskPlaceholder={null}
                                        value={cuenta_formValues.numeroCuenta}
                                        onChange={ cuenta_formHandleProxy }
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cuenta_numeroWeb" className="form-label">Clave Web</label>
                                    <InputFormat
                                        name="cuenta_numeroWeb"
                                        placeholder=""
                                        className="form-control"
                                        mask={MASK_FORMAT.CLAVE_WEB}
                                        maskPlaceholder={null}
                                        value={cuenta_formValues.numeroWeb}
                                        onChange={ cuenta_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                {(state.mode !== OPERATION_MODE.NEW) && (
                                <>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cuenta_idEstadoCuenta" className="form-label">Estado de Cuenta</label>
                                    <InputLista
                                        name="cuenta_idEstadoCuenta"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.cuenta.idEstadoCuenta }
                                        disabled={true}
                                        lista="EstadoCuenta"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cuenta_fechaAlta" className="form-label">Fecha Alta</label>
                                    <DatePickerCustom
                                        name="cuenta_fechaAlta"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.cuenta.fechaAlta }
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cuenta_fechaBaja" className="form-label">Fecha Baja</label>
                                    <DatePickerCustom
                                        name="cuenta_fechaBaja"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.cuenta.fechaBaja }
                                        disabled={true}
                                    />
                                </div>
                                </>
                                )}
                            </div>
                        </div>
                        )}

                        {(state.mode !== OPERATION_MODE.NEW) && (
                        <>

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('vinculos')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.vinculos) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.vinculos ? 'active' : ''}>Personas vinculadas</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.vinculos &&
                        <div className='accordion-body'>
                            <VinculosCementerioGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idCementerio: state.id,
                                    list: state.entity.vinculosCementerio
                                }}
                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                            />
                        </div>
                        )}

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('domicilios')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.domicilios) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.domicilios ? 'active' : ''}>Domicilios</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.domicilios &&
                        <div className='accordion-body'>
                            <DomiciliosGrid
                                data={{
                                    list: makeListDomicilios()
                                }}
                            />
                        </div>
                        )}   

                        </>
                        )}                     

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('datosUbicacion')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.datosUbicacion) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.datosUbicacion ? 'active' : ''}>Datos de ubicación</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.datosUbicacion &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-12 col-md-4">
                                    <label htmlFor="cementerio_idTipoConstruccionFuneraria" className="form-label">Tipo de construcción</label>
                                    <InputEntidad
                                        name="cementerio_idTipoConstruccionFuneraria"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.idTipoConstruccionFuneraria}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        title="Tipo Construccion Funeraria"
                                        entidad="TipoConstruccionFuneraria"
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <label htmlFor="cementerio_idCementerio" className="form-label">Cementerio</label>
                                    <InputLista
                                        name="cementerio_idCementerio"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.idCementerio}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        title="Cementerio"
                                        lista="Cementerio"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_circunscripcionCementerio" className="form-label">Circunscripción</label>
                                    <input
                                        name="cementerio_circunscripcionCementerio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.circunscripcionCementerio}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_seccionCementerio" className="form-label">Sección</label>
                                    <input
                                        name="cementerio_seccionCementerio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.seccionCementerio}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_manzanaCementerio" className="form-label">Manzana</label>
                                    <input
                                        name="cementerio_manzanaCementerio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.manzanaCementerio}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_parcelaCementerio" className="form-label">Parcela</label>
                                    <input
                                        name="cementerio_parcelaCementerio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.parcelaCementerio}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_frenteCementerio" className="form-label">Frente</label>
                                    <input
                                        name="cementerio_frenteCementerio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.frenteCementerio}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_filaCementerio" className="form-label">Fila</label>
                                    <input
                                        name="cementerio_filaCementerio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.filaCementerio}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_numeroCementerio" className="form-label">Número</label>
                                    <input
                                        name="cementerio_numeroCementerio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.numeroCementerio}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </div>
                        )}

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('datosCementerio')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.datosCementerio) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.datosCementerio ? 'active' : ''}>Datos del cementerio</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.datosCementerio &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_fechaAlta" className="form-label">Fecha Alta</label>
                                    <DatePickerCustom
                                        name="cementerio_fechaAlta"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.fechaAlta}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_fechaBaja" className="form-label">Fecha baja</label>
                                    <DatePickerCustom
                                        name="cementerio_fechaBaja"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.fechaBaja}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_fechaPresentacion" className="form-label">Fecha presentación</label>
                                    <DatePickerCustom
                                        name="cementerio_fechaPresentacion"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.fechaPresentacion}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_fechaConcesion" className="form-label">Fecha concesión</label>
                                    <DatePickerCustom
                                        name="cementerio_fechaConcesion"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.fechaConcesion}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_fechaEscritura" className="form-label">Fecha escritura</label>
                                    <DatePickerCustom
                                        name="cementerio_fechaEscritura"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.fechaEscritura}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_fechaSucesion" className="form-label">Fecha sucesión</label>
                                    <DatePickerCustom
                                        name="cementerio_fechaSucesion"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.fechaSucesion}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_libroEscritura" className="form-label">Libro escritura</label>
                                    <input
                                        name="cementerio_libroEscritura"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.libroEscritura}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_folioEscritura" className="form-label">Folio escritura</label>
                                    <input
                                        name="cementerio_folioEscritura"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.folioEscritura}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_numeroSucesion" className="form-label">Número sucesión</label>
                                    <input
                                        name="cementerio_numeroSucesion"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.numeroSucesion}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_superficie" className="form-label">Superficie (m)</label>
                                    <InputNumber
                                        name="cementerio_superficie"
                                        placeholder=""
                                        className="form-control"
                                        value={ cementerio_formValues.superficie }
                                        precision={2}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />                                        
                                 </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_largo" className="form-label">Largo (m)</label>
                                    <InputNumber
                                        name="cementerio_largo"
                                        placeholder=""
                                        className="form-control"
                                        value={ cementerio_formValues.largo }
                                        precision={2}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />                                      
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_ancho" className="form-label">Ancho (m)</label>
                                    <InputNumber
                                        name="cementerio_ancho"
                                        placeholder=""
                                        className="form-control"
                                        value={ cementerio_formValues.ancho }
                                        precision={2}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />                                      
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                    <label htmlFor="cementerio_digitoVerificador" className="form-label">Dígito verificador</label>
                                    <input
                                        name="cementerio_digitoVerificador"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={cementerio_formValues.digitoVerificador}
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </div>
                        )}

                        {(state.mode !== OPERATION_MODE.NEW) && (
                        <>         

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('inhumados')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.inhumados) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.inhumados ? 'active' : ''}>Inhumados</h3>
                                    </div>
                                </div>
                            </div>
                        </div>  
                        {(state.accordions.inhumados &&
                        <div className='accordion-body'>
                            <InhumadosGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idCementerio: state.id,
                                    list: state.entity.inhumados
                                }}
                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                            />
                        </div>
                        )}                                                                   

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('estado')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.estado) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.estado ? 'active' : ''}>Estado</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.estado &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="cementerio_idEstadoCarga" className="form-label">Estado Carga</label>
                                    <InputLista
                                        name="cementerio_idEstadoCarga"
                                        placeholder=""
                                        className="form-control"
                                        value={ cementerio_formValues.idEstadoCarga }
                                        onChange={ cementerio_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW || state.entity.cementerio.idEstadoCarga !== 20}
                                        lista="EstadoCarga"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="cementerio_fechaCargaInicio" className="form-label">Fecha Inicio Carga</label>
                                    <DatePickerCustom
                                        name="cementerio_fechaCargaInicio"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.cementerio.fechaCargaInicio }
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="cementerio_fechaCargaFin" className="form-label">Fecha Fin Carga</label>
                                    <DatePickerCustom
                                        name="cementerio_fechaCargaFin"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.cementerio.fechaCargaFin }
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
                                title="Información adicional de Cementerio"
                                processKey={state.processKey}
                                entidad="Cementerio"
                                idEntidad={state.id}
                                disabled={(state.mode === OPERATION_MODE.VIEW)}
                                onChange={(row) => setPendingChange(true)}
                            />
                        </div>
                        )}

                        <Tabs
                            id="tabs-cementerio"
                            activeKey={state.tabActive}
                            className="m-top-20"
                            onSelect={(tab) => SetTabActive(tab)}
                        >
                            <Tab eventKey="exenciones" title="Exenciones">
                                <div className='tab-panel'>
                                    <RecargosDescuentosGrid
                                        processKey={state.processKey}
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        data={{
                                            idCuenta: state.entity.cuenta.id,
                                            idTipoTributo: state.entity.cuenta.idTipoTributo,
                                            list: state.entity.recargosDescuentos
                                        }}
                                        onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                    />
                                </div>
                            </Tab>
                            <Tab eventKey="condiciones" title="Condiciones Especiales">
                                <div className='tab-panel'>
                                    <CondicionesEspecialesGrid
                                        processKey={state.processKey}
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        data={{
                                            idCuenta: state.entity.cuenta.id,
                                            list: state.entity.condicionesEspeciales
                                        }}
                                        onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                    />
                                </div>
                            </Tab>
                            <Tab eventKey="debitos" title="Débitos Automáticos">
                                <div className='tab-panel'>
                                    <DebitosAutomaticosGrid
                                        processKey={state.processKey}
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        data={{
                                            idCuenta: state.entity.cuenta.id,
                                            list: state.entity.debitosAutomaticos
                                        }}
                                        onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                    />
                                </div>
                            </Tab>
                            <Tab eventKey="legal" title="Información Legal">
                                <div className='tab-panel'>
                                    <CuentaCertificadoApremioGrid
                                        data={{
                                            idCuenta: state.entity.cuenta.id
                                        }}
                                    />
                                </div>
                            </Tab>
                            <Tab eventKey="variables" title="Variables">
                                <div className='tab-panel'>
                                    <VariablesGrid
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        data={{
                                            idTipoTributo: state.entity.cuenta.idTipoTributo,
                                            idCuenta: state.entity.cuenta.id,
                                            listVariableCuenta: state.entity.variablesCuenta
                                        }}
                                        onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                    />
                                </div>
                            </Tab>
                        </Tabs>

                        </>
                        )}

                    </div>

                </section>

            </div>
        
        </div>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
                {state.mode === OPERATION_MODE.EDIT && state.entity.cuenta.idEstadoCuenta === CUENTA_STATE.ACTIVA &&
                <button className="btn decline-button float-start m-left-50" onClick={ (event) => handleClickBaja() } >Baja</button>
                }
                {state.mode !== OPERATION_MODE.VIEW &&
                <button
                    className={pendingChange ? "btn action-button float-end" : "btn action-button btn-disabled float-end"}
                    onClick={ (event) => handleClickGuardar() }
                    disabled={!pendingChange}
                >
                    {(state.mode === OPERATION_MODE.NEW) ? "Siguiente" : "Guardar"}
                </button>
                }
            </div>
        </footer>

    </>
    )
}

export default CementerioView;
