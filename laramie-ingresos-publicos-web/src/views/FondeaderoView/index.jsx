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

import { Loading, SectionHeading, SectionSidebar, DatePickerCustom, InputLista, InputFormat, InputTasa, InputSubTasa, MessageModal } from '../../components/common';
import { CloneObject } from '../../utils/helpers';
import { getDateId } from '../../utils/convert';
import ShowToastMessage from '../../utils/toast';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import RelacionesCuentasGrid from '../../components/controls/RelacionesCuentasGrid';
import DomiciliosGrid from '../../components/controls/DomiciliosGrid';
import VariablesGrid from '../../components/controls/VariablesGrid';
import VinculosFondeaderoGrid from '../../components/controls/VinculosFondeaderoGrid';
import ZonasEntregaGrid from '../../components/controls/ZonasEntregaGrid';
import ControladoresCuentasGrid from '../../components/controls/ControladoresCuentasGrid';
import CondicionesEspecialesGrid from '../../components/controls/CondicionesEspecialesGrid';
import RecargosDescuentosGrid from '../../components/controls/RecargosDescuentosGrid';
import DebitosAutomaticosGrid from '../../components/controls/DebitosAutomaticosGrid';
import DeclaracionesJuradasGrid from '../../components/controls/DeclaracionesJuradasGrid';
import CuentaCertificadoApremioGrid from '../../components/controls/CuentaCertificadoApremioGrid';
import CuentaCertificadoEscribanoGrid from '../../components/controls/CuentaCertificadoEscribanoGrid';
import CuentaExpedienteGrid from '../../components/controls/CuentaExpedienteGrid';
import { MASK_FORMAT } from '../../consts/maskFormat';
import CuentaDebitosCreditosGrid from '../../components/controls/CuentaDebitosCreditosGrid';
import CuentaPagosAnticipadosGrid from '../../components/controls/CuentaPagosAnticipadosGrid';
import CuentaPlanesPagosGrid from '../../components/controls/CuentaPlanesPagosGrid';
import { useBeforeunload } from 'react-beforeunload';
import CuentaEmisionEjecucionForm from '../../components/controls/CuentaEmisionEjecucionForm';


function FondeaderoView() {

    //parametros url
    const params = useParams();

    //variables
    const entityInit = {
        fondeadero: {
            id: 0,
            idCuenta: 0,
            idEstadoCarga: 20,
            fechaCargaInicio: null,
            fechaCargaFin: null,
            idTasa: 0,
            idSubtasa: 0,
            embarcacion: "",
            superficie: "",
            longitud: "",
            codigo: "",
            club: "",
            digitoVerificador: "",
            ubicacion: "",
            margen: "",
            fechaAlta: null  
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
        vinculosFondeadero: [],
        zonasEntrega: [],
        controladoresCuentas: [],
        condicionesEspeciales: [],
        recargosDescuentos: [],
        debitosAutomaticos: [],
        declaracionesJuradas: []
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
        processKey: `Fondeadero_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        accordions: {
            cuenta: true,
            datosFondeadero: false,
            vinculos: false,
            domicilios: false,
            estado: false,
            info: false
        },
        menues: menuesInit,
        showMenu: false,
        tabActive: "declaracionesJuradas"
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
            FindFondeadero();
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

    const [ fondeadero_formValues, fondeadero_formHandle, , fondeadero_formSet ] = useForm({
        idEstadoCarga: 20,
        idTasa: 0,
        idSubTasa: 0,
        embarcacion: "",
        superficie: "",
        longitud: "",
        codigo: "",
        club: "",
        digitoVerificador: "",
        ubicacion: "",
        margen: "",
        fechaAlta: null
    }, 'fondeadero_');

    const [ cuenta_formValues, cuenta_formHandle, , cuenta_formSet ] = useForm({
        numeroCuenta: '',
        numeroWeb: ''
    }, 'cuenta_');

    //handles
    const cuenta_formHandleProxy = (event) => {
        cuenta_formHandle(event);
        setPendingChange(true);
    }
    const fondeadero_formHandleProxy = (event) => {
        fondeadero_formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (isFormValid()) {
            if (state.id === 0) {
                AddFondeadero();
            }
            else {
                ModifyFondeadero();
            }
        };
    };
    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        const url = '/fondeaderos';
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
            if (data.fondeadero.fechaCargaInicio) data.fondeadero.fechaCargaInicio = new Date(data.fondeadero.fechaCargaInicio);
            if (data.fondeadero.fechaCargaFin) data.fondeadero.fechaCargaFin = new Date(data.fondeadero.fechaCargaFin);
            if (data.fondeadero.fechaAlta) data.fondeadero.fechaAlta = new Date(data.fondeadero.fechaAlta);
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
            data.vinculosFondeadero.forEach(x => {
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
            data.declaracionesJuradas.forEach(x => {
                if (x.fechaPresentacionDDJJ) x.fechaPresentacionDDJJ = new Date(x.fechaPresentacionDDJJ);
                if (x.fechaAlta) x.fechaAlta = new Date(x.fechaAlta);
                if (x.fechaBaja) x.fechaBaja = new Date(x.fechaBaja);
            });  

            setState(prevState => {
                return {...prevState, loading: false, entity: data};
            });
            setPendingChange(false);
            fondeadero_formSet({
                idEstadoCarga: data.fondeadero.idEstadoCarga,
                idTasa: data.fondeadero.idTasa,
                idSubTasa: data.fondeadero.idSubTasa,
                embarcacion: data.fondeadero.embarcacion,
                superficie: data.fondeadero.superficie,
                longitud: data.fondeadero.longitud,
                codigo: data.fondeadero.codigo,
                club: data.fondeadero.club,
                digitoVerificador: data.fondeadero.digitoVerificador,
                ubicacion: data.fondeadero.ubicacion,
                margen: data.fondeadero.margen,
                fechaAlta: data.fondeadero.fechaAlta             
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
        if (fondeadero_formValues.idEstadoCarga === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Estado de Carga incompleto');
            return false;
        }
        if (fondeadero_formValues.idTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Tasa incompleto');
            return false;
        }
        if (fondeadero_formValues.idSubTasa <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Sub Tasa incompleto');
            return false;
        }
        if (fondeadero_formValues.embarcacion === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Embarcacion incompleto');
            return false;
        }
        if (fondeadero_formValues.superficie === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Superficie incompleto');
            return false;
        }
        if (fondeadero_formValues.longitud === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Longitud incompleto');
            return false;
        }
        if (fondeadero_formValues.codigo === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Codigo incompleto');
            return false;
        }
        if (fondeadero_formValues.club === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Club incompleto');
            return false;
        }            
        if (fondeadero_formValues.digitoVerificador === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Dígito Verificador incompleto');
            return false;
        }
        if (fondeadero_formValues.ubicacion === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Ubicación incompleto');
            return false;
        }
        if (fondeadero_formValues.margen === "") {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Margen incompleto');
            return false;
        }
        if (fondeadero_formValues.fechaAlta === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Fecha Alta incompleto');
            return false;
        }

        return true;
    }

    function FindFondeadero() {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.FONDEADERO,
            paramsUrl,
            null,
            callbackSuccessFindImueble,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddFondeadero() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Fondeadero ingresado correctamente", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/fondeadero/' + OPERATION_MODE.EDIT + '/' + row.fondeadero.id;
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
            fondeadero: {
                ...state.entity.fondeadero,
                idEstadoCarga: fondeadero_formValues.idEstadoCarga,
                idTasa: fondeadero_formValues.idTasa,
                idSubTasa: fondeadero_formValues.idSubTasa,
                embarcacion: fondeadero_formValues.embarcacion,
                superficie: fondeadero_formValues.superficie,
                longitud: fondeadero_formValues.longitud,
                codigo: fondeadero_formValues.codigo,
                club: fondeadero_formValues.club,
                digitoVerificador: fondeadero_formValues.digitoVerificador,
                ubicacion: fondeadero_formValues.ubicacion,
                margen: fondeadero_formValues.margen,
                fechaAlta: fondeadero_formValues.fechaAlta
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
            vinculosFondeadero: [],
            zonasEntrega: [],
            controladoresCuentas: [],
            condicionesEspeciales: [],
            recargosDescuentos: [],
            debitosAutomaticos: [],
            declaracionesJuradas: []
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.FONDEADERO,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ModifyFondeadero() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Fondeadero actualizado correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                callbackSuccessFindImueble(response);
            });
        };

        const dataBody = {
            fondeadero: {
                ...state.entity.fondeadero,
                idEstadoCarga: fondeadero_formValues.idEstadoCarga,
                idTasa: fondeadero_formValues.idTasa,
                idSubTasa: fondeadero_formValues.idSubTasa,
                embarcacion: fondeadero_formValues.embarcacion,
                superficie: fondeadero_formValues.superficie,
                longitud: fondeadero_formValues.longitud,
                codigo: fondeadero_formValues.codigo,
                club: fondeadero_formValues.club,
                digitoVerificador: fondeadero_formValues.digitoVerificador,
                ubicacion: fondeadero_formValues.ubicacion,
                margen: fondeadero_formValues.margen,
                fechaAlta: fondeadero_formValues.fechaAlta
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
            vinculosFondeadero: state.entity.vinculosFondeadero, //en este caso hacen falta todos para calcular el referente de la cuenta
            zonasEntrega: state.entity.zonasEntrega.filter(f => f.state !== 'o'),
            controladoresCuentas: state.entity.controladoresCuentas.filter(f => f.state !== 'o'),
            condicionesEspeciales: state.entity.condicionesEspeciales.filter(f => f.state !== 'o'),
            recargosDescuentos: state.entity.recargosDescuentos.filter(f => f.state !== 'o'),
            debitosAutomaticos: state.entity.debitosAutomaticos.filter(f => f.state !== 'o'),
            declaracionesJuradas: state.entity.declaracionesJuradas.filter(f => f.state !== 'o')
        };

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.FONDEADERO,
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
                    const url = '/fondeadero/' + OPERATION_MODE.VIEW + '/' + row.idTributo;
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

        if (typeEntity === 'VinculoFondeadero') {
            if (row.state === 'a') {
                entity.vinculosFondeadero.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.vinculosFondeadero.indexOf(entity.vinculosFondeadero.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.vinculosFondeadero[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.vinculosFondeadero = entity.vinculosFondeadero.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.vinculosFondeadero.find(x => x.id === row.id);
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

        if (typeEntity === 'DeclaracionJurada') {
            if (row.state === 'a') {
                entity.declaracionesJuradas.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.declaracionesJuradas.indexOf(entity.declaracionesJuradas.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.declaracionesJuradas[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.declaracionesJuradas = entity.declaracionesJuradas.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.declaracionesJuradas.find(x => x.id === row.id);
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
                            Fondeadero ({(state.id === 0) ? 
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
                            <VinculosFondeaderoGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idFondeadero: state.id,
                                    list: state.entity.vinculosFondeadero
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
                                    <div className="col-12" onClick={() => ToggleAccordion('datosFondeadero')}>
                                        <div className='accordion-header-title'>
                                            {(state.accordions.datosFondeadero) ? accordionOpen : accordionClose}
                                            <h3 className={state.accordions.datosFondeadero ? 'active' : ''}>Información del tributo</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {(state.accordions.datosFondeadero &&
                            <div className='accordion-body'>
                                <div className='row form-basic'>
                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label htmlFor="fondeadero_idTasa" className="form-label">Tasa</label>
                                        <InputTasa
                                            name="fondeadero_idTasa"
                                            placeholder=""
                                            className="form-control"
                                            value={ fondeadero_formValues.idTasa }
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                        />
                                    </div>

                                    <div className="mb-3 col-6">
                                        <label htmlFor="fondeadero_idSubTasa" className="form-label">Sub Tasa</label>
                                        <InputSubTasa
                                            name="fondeadero_idSubTasa"
                                            placeholder=""
                                            className="form-control"
                                            value={ fondeadero_formValues.idSubTasa }
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={ state.mode === OPERATION_MODE.VIEW}
                                            idTasa={fondeadero_formValues.idTasa}
                                        />
                                    </div> 
                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label htmlFor="fondeadero_embarcacion" className="form-label">Embarcación</label>
                                        <input
                                            name="fondeadero_embarcacion"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={fondeadero_formValues.embarcacion}
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                            autoComplete="off"
                                            maxLength={250}
                                        />
                                    </div>
                                                                
                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label htmlFor="fondeadero_superficie" className="form-label">Superficie</label>
                                        <input
                                            name="fondeadero_superficie"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={fondeadero_formValues.superficie}
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                            autoComplete="off"
                                            maxLength={20}
                                        />
                                    </div>
                                                                
                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label htmlFor="fondeadero_longitud" className="form-label">Longitud</label>
                                        <input
                                            name="fondeadero_longitud"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={fondeadero_formValues.longitud}
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                            autoComplete="off"
                                            maxLength={20}
                                        />
                                    </div>
                                                                
                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label htmlFor="fondeadero_codigo" className="form-label">Código</label>
                                        <input
                                            name="fondeadero_codigo"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={fondeadero_formValues.codigo}
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                            autoComplete="off"
                                            maxLength={20}
                                        />
                                    </div>
                                                                
                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label htmlFor="fondeadero_club" className="form-label">Club</label>
                                        <input
                                            name="fondeadero_club"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={fondeadero_formValues.club}
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                            autoComplete="off"
                                            maxLength={20}
                                        />
                                    </div>
                                                                
                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label htmlFor="fondeadero_digitoVerificador" className="form-label">Dígito Verificador</label>
                                        <input
                                            name="fondeadero_digitoVerificador"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={fondeadero_formValues.digitoVerificador}
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                            autoComplete="off"
                                            maxLength={20}
                                        />
                                    </div>

                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label htmlFor="fondeadero_ubicacion" className="form-label">Ubicación</label>
                                        <input
                                            name="fondeadero_ubicacion"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={fondeadero_formValues.ubicacion}
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                            autoComplete="off"
                                            maxLength={250}
                                        />
                                    </div>

                                    <div className="col-6 col-md-4 col-lg-2">
                                        <label htmlFor="fondeadero_margen" className="form-label">Margen</label>
                                        <input
                                            name="fondeadero_margen"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={fondeadero_formValues.margen}
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                            autoComplete="off"
                                            maxLength={250}
                                        />
                                    </div>

                                    <div className="col-6 col-md-4 col-lg-2">                                    
                                        <label htmlFor="fondeadero_fechaAlta" className="form-label">Fecha Alta</label>
                                        <DatePickerCustom
                                            name="fondeadero_fechaAlta"
                                            placeholder=""
                                            className="form-control"
                                            value={fondeadero_formValues.fechaAlta}
                                            onChange={ fondeadero_formHandleProxy }
                                            disabled={state.mode === OPERATION_MODE.VIEW}
                                        />
                                    </div>

                                </div>
                            </div>
                        )}

                    {(state.mode !== OPERATION_MODE.NEW) && (
                        <>
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
                                    <label htmlFor="fondeadero_idEstadoCarga" className="form-label">Estado Carga</label>
                                    <InputLista
                                        name="fondeadero_idEstadoCarga"
                                        placeholder=""
                                        className="form-control"
                                        value={ fondeadero_formValues.idEstadoCarga }
                                        onChange={ fondeadero_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW || state.entity.fondeadero.idEstadoCarga !== 20}
                                        lista="EstadoCarga"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="fondeadero_fechaCargaInicio" className="form-label">Fecha Inicio Carga</label>
                                    <DatePickerCustom
                                        name="fondeadero_fechaCargaInicio"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.fondeadero.fechaCargaInicio }
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="fondeadero_fechaCargaFin" className="form-label">Fecha Fin Carga</label>
                                    <DatePickerCustom
                                        name="fondeadero_fechaCargaFin"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.fondeadero.fechaCargaFin }
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
                                title="Información adicional de Fondeadero"
                                processKey={state.processKey}
                                entidad="Fondeadero"
                                idEntidad={state.id}
                                disabled={(state.mode === OPERATION_MODE.VIEW)}
                                onChange={(row) => setPendingChange(true)}
                            />
                        </div>
                        )}


                        <Tabs
                            id="tabs-fondeadero"
                            activeKey={state.tabActive}
                            className="m-top-20"
                            onSelect={(tab) => SetTabActive(tab)}
                        >
                            <Tab eventKey="declaracionesJuradas" title="Declaraciones Juradas">
                                <div className='tab-panel'>
                                    <DeclaracionesJuradasGrid
                                        processKey={state.processKey}
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        data={{
                                            idCuenta: state.entity.cuenta.id,
                                            idTributo: state.entity.fondeadero.id,
                                            idTipoTributo: 14, // Id del tipo de tributo de fondeadero
                                            list: state.entity.declaracionesJuradas
                                        }}
                                        onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                    />
                                </div>
                            </Tab>
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

export default FondeaderoView;
