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

import { Loading, SectionHeading, SectionSidebar, DatePickerCustom, InputLista, InputFormat, MessageModal } from '../../components/common';
import { CloneObject } from '../../utils/helpers';
import { getDateId } from '../../utils/convert';
import { MASK_FORMAT } from '../../consts/maskFormat';
import ShowToastMessage from '../../utils/toast';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import RelacionesCuentasGrid from '../../components/controls/RelacionesCuentasGrid';
import LadosTerrenoGrid from '../../components/controls/LadosTerrenoGrid';
import VinculosInmuebleGrid from '../../components/controls/VinculosInmuebleGrid';
import SuperficiesGrid from '../../components/controls/SuperficiesGrid';
import DomiciliosGrid from '../../components/controls/DomiciliosGrid';
import VariablesGrid from '../../components/controls/VariablesGrid';
import ZonasEntregaGrid from '../../components/controls/ZonasEntregaGrid';
import ControladoresCuentasGrid from '../../components/controls/ControladoresCuentasGrid';
import ValuacionesGrid from '../../components/controls/ValuacionesGrid';
import CondicionesEspecialesGrid from '../../components/controls/CondicionesEspecialesGrid';
import RecargosDescuentosGrid from '../../components/controls/RecargosDescuentosGrid';
import ObrasInmuebleGrid from '../../components/controls/ObrasInmuebleGrid';
import EdesurGrid from '../../components/controls/EdesurGrid';
import DebitosAutomaticosGrid from '../../components/controls/DebitosAutomaticosGrid';
import CuentaCertificadoEscribanoGrid from '../../components/controls/CuentaCertificadoEscribanoGrid';
import CuentaCertificadoApremioGrid from '../../components/controls/CuentaCertificadoApremioGrid';
import CuentaExpedienteGrid from '../../components/controls/CuentaExpedienteGrid';
import CatastroForm from '../../components/controls/CatastroForm';
import CuentaPlanesPagosGrid from '../../components/controls/CuentaPlanesPagosGrid';
import CuentaPagosAnticipadosGrid from '../../components/controls/CuentaPagosAnticipadosGrid';
import CuentaDebitosCreditosGrid from '../../components/controls/CuentaDebitosCreditosGrid';
import { useBeforeunload } from 'react-beforeunload';
import CuentaEmisionEjecucionForm from '../../components/controls/CuentaEmisionEjecucionForm';

function InmuebleView() {

    //parametros url
    const params = useParams();

    //variables
    const entityInit = {
        inmueble: {
            id: 0,
            idCuenta: 0,
            idEstadoCarga: 20,
            fechaCargaInicio: null,
            fechaCargaFin: null,
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
            catastralRtasPrv: '',
            tributoManz: '',
            tributoLote: '',
            tributoEsquina: false
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
        ladosTerreno: [],
        vinculosInmueble: [],
        zonasEntrega: [],
        controladoresCuentas: [],
        valuaciones: [],
        obrasInmueble: [],
        condicionesEspeciales: [],
        superficies: [],
        edesur: [],
        recargosDescuentos: [],
        debitosAutomaticos: []
    };
    const menuesInit = {
        obras: false,
        expedientes: false,
        certificadosEscribanos: false,
        relacionesCuentas: false,
        controladoresCuentas: false,
        zonasEntrega: false,
        valuaciones: false,
        edesur: false,
        catastro: false,
        debitosCreditos: false,
        pagosAnticipados: false,
        planesPago: false,
        liquidaciones: false
    };

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        processKey: `Inmueble_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        accordions: {
            cuenta: true,
            vinculos: false,
            domicilios: false,
            catastral: false,
            estado: false,
            info: false
        },
        menues: menuesInit,
        showMenu: false,
        tabActive: "terreno"
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
            FindInmueble();
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
            ...state.entity.recargosDescuentos,
            ...state.entity.obrasInmueble
        ];
        listsWithExpediente.filter(f => f.state !== 'r').forEach(x => {
            if (x.idExpediente && x.idExpediente > 0 && list.indexOf(x.idExpediente) === -1) list.push(x.idExpediente)
        });

        setListExpedientes(list);
    }

    useEffect(updateListExpedientes, [state.entity.recargosDescuentos, state.entity.obrasInmueble]);    

    const [ inmueble_formValues, inmueble_formHandle, , inmueble_formSet ] = useForm({
        idEstadoCarga: 20,
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
        catastralRtasPrv: '',
        tributoManz: '',
        tributoLote: '',
        tributoEsquina: false
    }, 'inmueble_');

    const [ cuenta_formValues, cuenta_formHandle, , cuenta_formSet ] = useForm({
        numeroCuenta: '',
        numeroWeb: ''
    }, 'cuenta_');

    //handles
    const cuenta_formHandleProxy = (event) => {
        cuenta_formHandle(event);
        setPendingChange(true);
    }
    const inmueble_formHandleProxy = (event) => {
        inmueble_formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (isFormValid()) {
            if (state.id === 0) {
                AddInmueble();
            }
            else {
                ModifyInmueble();
            }
        };
    }
    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        const url = '/inmuebles';
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
            if (data.inmueble.fechaCargaInicio) data.inmueble.fechaCargaInicio = new Date(data.inmueble.fechaCargaInicio);
            if (data.inmueble.fechaCargaFin) data.inmueble.fechaCargaFin = new Date(data.inmueble.fechaCargaFin);
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
            data.ladosTerreno.forEach(x => {
                x.ladosTerrenoServicio.forEach(x2 => {
                    if (x2.fechaDesde) x2.fechaDesde = new Date(x2.fechaDesde);
                    if (x2.fechaHasta) x2.fechaHasta = new Date(x2.fechaHasta);
                });
            });
            data.ladosTerreno.forEach(x => {
                x.ladosTerrenoObra.forEach(x2 => {
                    if (x2.fecha) x2.fecha = new Date(x2.fecha);
                });
            });
            data.vinculosInmueble.forEach(x => {
                if (x.fechaInstrumentoDesde) x.fechaInstrumentoDesde = new Date(x.fechaInstrumentoDesde);
                if (x.fechaInstrumentoHasta) x.fechaInstrumentoHasta = new Date(x.fechaInstrumentoHasta);
            });
            data.controladoresCuentas.forEach(x => {
                if (x.fechaDesde) x.fechaDesde = new Date(x.fechaDesde);
                if (x.fechaHasta) x.fechaHasta = new Date(x.fechaHasta);
            });
            data.obrasInmueble.forEach(x => {
                if (x.fechaPrimerVencimiento) x.fechaPrimerVencimiento = new Date(x.fechaPrimerVencimiento);
                if (x.fechaSegundoVencimiento) x.fechaSegundoVencimiento = new Date(x.fechaSegundoVencimiento);
                if (x.fechaPresentacion) x.fechaPresentacion = new Date(x.fechaPresentacion);
                if (x.fechaInspeccion) x.fechaInspeccion = new Date(x.fechaInspeccion);
                if (x.fechaAprobacion) x.fechaAprobacion = new Date(x.fechaAprobacion);
                if (x.fechaInicioDesglose) x.fechaInicioDesglose = new Date(x.fechaInicioDesglose);
                if (x.fechaFinDesglose) x.fechaFinDesglose = new Date(x.fechaFinDesglose);
                if (x.fechaFinObra) x.fechaFinObra = new Date(x.fechaFinObra);
                if (x.fechaArchivado) x.fechaArchivado = new Date(x.fechaArchivado);
                if (x.fechaIntimado) x.fechaIntimado = new Date(x.fechaIntimado);
                if (x.fechaVencidoIntimado) x.fechaVencidoIntimado = new Date(x.fechaVencidoIntimado);
                if (x.fechaMoratoria) x.fechaMoratoria = new Date(x.fechaMoratoria);
                if (x.fechaVencidoMoratoria) x.fechaVencidoMoratoria = new Date(x.fechaVencidoMoratoria);
            });
            data.condicionesEspeciales.forEach(x => {
                if (x.fechaDesde) x.fechaDesde = new Date(x.fechaDesde);
                if (x.fechaHasta) x.fechaHasta = new Date(x.fechaHasta);
            });
            data.superficies.forEach(x => {
                if (x.fechaIntimacion) x.fechaIntimacion = new Date(x.fechaIntimacion);
                if (x.fechaPresentacion) x.fechaPresentacion = new Date(x.fechaPresentacion);
                if (x.fechaVigenteDesde) x.fechaVigenteDesde = new Date(x.fechaVigenteDesde);
                if (x.fechaRegistrado) x.fechaRegistrado = new Date(x.fechaRegistrado);
                if (x.fechaPermisoProvisorio) x.fechaPermisoProvisorio = new Date(x.fechaPermisoProvisorio);
                if (x.fechaAprobacion) x.fechaAprobacion = new Date(x.fechaAprobacion);
                if (x.fechaFinObra) x.fechaFinObra = new Date(x.fechaFinObra);
            });
            data.edesur.forEach(x => {
                if (x.fechaDesdeCliente) x.fechaDesdeCliente = new Date(x.fechaDesdeCliente);
                if (x.fechaHastaCliente) x.fechaHastaCliente = new Date(x.fechaHastaCliente);
                x.edesurClientes.forEach(x2 => {
                    if (x2.fechaDesde) x2.fechaDesde = new Date(x2.fechaDesde);
                    if (x2.fechaHasta) x2.fechaHasta = new Date(x2.fechaHasta);
                });
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

            setState(prevState => {
                return {...prevState, loading: false, entity: data};
            });
            setPendingChange(false);
            inmueble_formSet({
                idEstadoCarga: data.inmueble.idEstadoCarga,
                catastralCir: data.inmueble.catastralCir,
                catastralSec: data.inmueble.catastralSec,
                catastralChacra: data.inmueble.catastralChacra,
                catastralLchacra: data.inmueble.catastralLchacra,
                catastralQuinta: data.inmueble.catastralQuinta,
                catastralLquinta: data.inmueble.catastralLquinta,
                catastralFrac: data.inmueble.catastralFrac,
                catastralLfrac: data.inmueble.catastralLfrac,
                catastralManz: data.inmueble.catastralManz,
                catastralLmanz: data.inmueble.catastralLmanz,
                catastralParc: data.inmueble.catastralParc,
                catastralLparc: data.inmueble.catastralLparc,
                catastralSubparc: data.inmueble.catastralSubparc,
                catastralUfunc: data.inmueble.catastralUfunc,
                catastralUcomp: data.inmueble.catastralUcomp,
                catastralRtasPrv: data.inmueble.catastralRtasPrv,
                tributoManz: data.inmueble.tributoManz,
                tributoLote: data.inmueble.tributoLote,
                tributoEsquina: data.inmueble.tributoEsquina                
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

        if (state.entity.ladosTerreno.length > 0 && state.entity.cuenta.idDireccionPrincipal) {
            let direccion = null;
            state.entity.ladosTerreno.forEach(x => {
                if (x.direccion.id === state.entity.cuenta.idDireccionPrincipal) {
                    direccion = x.direccion;
                }
            });
            if (direccion) {
                const domicilioInmueble = {...direccion, domicilio: "Inmueble"};
                listDomicilios.push(domicilioInmueble);
            }
        }
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
        if (inmueble_formValues.idEstadoCarga === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Estado de Carga incompleto');
            return false;
        }

        return true;
    }

    function FindInmueble() {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.INMUEBLE,
            paramsUrl,
            null,
            callbackSuccessFindImueble,
            callbackNoSuccess,
            callbackError
        );

    } 

    function AddInmueble() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Inmueble ingresado correctamente", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/inmueble/' + OPERATION_MODE.EDIT + '/' + row.inmueble.id;
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
            inmueble: {
                ...state.entity.inmueble,
                idEstadoCarga: inmueble_formValues.idEstadoCarga,
                catastralCir: inmueble_formValues.catastralCir,
                catastralSec: inmueble_formValues.catastralSec,
                catastralChacra: inmueble_formValues.catastralChacra,
                catastralLchacra: inmueble_formValues.catastralLchacra,
                catastralQuinta: inmueble_formValues.catastralQuinta,
                catastralLquinta: inmueble_formValues.catastralLquinta,
                catastralFrac: inmueble_formValues.catastralFrac,
                catastralLfrac: inmueble_formValues.catastralLfrac,
                catastralManz: inmueble_formValues.catastralManz,
                catastralLmanz: inmueble_formValues.catastralLmanz,
                catastralParc: inmueble_formValues.catastralParc,
                catastralLparc: inmueble_formValues.catastralLparc,
                catastralSubparc: inmueble_formValues.catastralSubparc,
                catastralUfunc: inmueble_formValues.catastralUfunc,
                catastralUcomp: inmueble_formValues.catastralUcomp,
                catastralRtasPrv: inmueble_formValues.catastralRtasPrv,
                tributoManz: inmueble_formValues.tributoManz,
                tributoLote: inmueble_formValues.tributoLote,
                tributoEsquina: inmueble_formValues.tributoEsquina
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
            ladosTerreno: [],
            vinculosInmueble: [],
            zonasEntrega: [],
            controladoresCuentas: [],
            valuaciones: [],
            obrasInmueble: [],
            condicionesEspeciales: [],
            superficies: [],
            edesur: [],
            recargosDescuentos: [],
            debitosAutomaticos: []
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.INMUEBLE,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ModifyInmueble() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Inmueble actualizado correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                callbackSuccessFindImueble(response);
            });
        };

        const dataBody = {
            inmueble: {
                ...state.entity.inmueble,
                idEstadoCarga: inmueble_formValues.idEstadoCarga,
                catastralCir: inmueble_formValues.catastralCir,
                catastralSec: inmueble_formValues.catastralSec,
                catastralChacra: inmueble_formValues.catastralChacra,
                catastralLchacra: inmueble_formValues.catastralLchacra,
                catastralQuinta: inmueble_formValues.catastralQuinta,
                catastralLquinta: inmueble_formValues.catastralLquinta,                
                catastralFrac: inmueble_formValues.catastralFrac,
                catastralLfrac: inmueble_formValues.catastralLfrac,
                catastralManz: inmueble_formValues.catastralManz,
                catastralLmanz: inmueble_formValues.catastralLmanz,
                catastralParc: inmueble_formValues.catastralParc,
                catastralLparc: inmueble_formValues.catastralLparc,
                catastralSubparc: inmueble_formValues.catastralSubparc,
                catastralUfunc: inmueble_formValues.catastralUfunc,
                catastralUcomp: inmueble_formValues.catastralUcomp,
                catastralRtasPrv: inmueble_formValues.catastralRtasPrv,
                tributoManz: inmueble_formValues.tributoManz,
                tributoLote: inmueble_formValues.tributoLote,
                tributoEsquina: inmueble_formValues.tributoEsquina
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
            ladosTerreno: state.entity.ladosTerreno.filter(f => f.state !== 'o').map(y => {
                let x = CloneObject(y);
                x.ladosTerrenoServicio = x.ladosTerrenoServicio.filter(f => f.state !== 'o');
                x.ladosTerrenoObra = x.ladosTerrenoObra.filter(f => f.state !== 'o');
                return x;
            }),
            vinculosInmueble: state.entity.vinculosInmueble, //en este caso hacen falta todos para calcular el referente de la cuenta
            zonasEntrega: state.entity.zonasEntrega.filter(f => f.state !== 'o'),
            controladoresCuentas: state.entity.controladoresCuentas.filter(f => f.state !== 'o'),
            valuaciones: state.entity.valuaciones.filter(f => f.state !== 'o'),
            obrasInmueble: state.entity.obrasInmueble.filter(f => f.state !== 'o').map(y => {
                let x = CloneObject(y);
                x.obrasInmuebleDetalle = x.obrasInmuebleDetalle.filter(f => f.state !== 'o');
                return x;
            }),
            condicionesEspeciales: state.entity.condicionesEspeciales.filter(f => f.state !== 'o'),
            superficies: state.entity.superficies.filter(f => f.state !== 'o'),
            edesur: state.entity.edesur.filter(f => f.state !== 'o').map(y => {
                let x = CloneObject(y);
                x.edesurClientes = x.edesurClientes.filter(f => f.state !== 'o');
                return x;
            }),
            recargosDescuentos: state.entity.recargosDescuentos.filter(f => f.state !== 'o'),
            debitosAutomaticos: state.entity.debitosAutomaticos.filter(f => f.state !== 'o')
        };

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.INMUEBLE,
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
                    const url = '/inmueble/' + OPERATION_MODE.VIEW + '/' + row.idTributo;
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

        if (typeEntity === 'LadoTerreno') {
            if (row.state === 'a') {
                entity.ladosTerreno.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.ladosTerreno.indexOf(entity.ladosTerreno.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.ladosTerreno[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.ladosTerreno = entity.ladosTerreno.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.ladosTerreno.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'LadoTerrenoServicio') {
            let ladoTerreno = entity.ladosTerreno.find(x => x.id === row.idLadoTerreno);
            if (ladoTerreno.state === 'o') {
                ladoTerreno.state = 'c';
            }

            if (row.state === 'a') {
                ladoTerreno.ladosTerrenoServicio.push(row);
            }
            else if (row.state === 'm') {
                const index = ladoTerreno.ladosTerrenoServicio.indexOf(ladoTerreno.ladosTerrenoServicio.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //sigue siendo un alta porque no existe en la bd
                    ladoTerreno.ladosTerrenoServicio[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    ladoTerreno.ladosTerrenoServicio = ladoTerreno.ladosTerrenoServicio.filter(f => f.id !== row.id);
                }
                else {
                    let item = ladoTerreno.ladosTerrenoServicio.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'LadoTerrenoObra') {
            let ladoTerreno = entity.ladosTerreno.find(x => x.id === row.idLadoTerreno);
            if (ladoTerreno.state === 'o') {
                ladoTerreno.state = 'c';
            }

            if (row.state === 'a') {
                ladoTerreno.ladosTerrenoObra.push(row);
            }
            else if (row.state === 'm') {
                const index = ladoTerreno.ladosTerrenoObra.indexOf(ladoTerreno.ladosTerrenoObra.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //sigue siendo un alta porque no existe en la bd
                    ladoTerreno.ladosTerrenoObra[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    ladoTerreno.ladosTerrenoObra = ladoTerreno.ladosTerrenoObra.filter(f => f.id !== row.id);
                }
                else {
                    let item = ladoTerreno.ladosTerrenoObra.find(x => x.id === row.id);
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

        if (typeEntity === 'VinculoInmueble') {
            if (row.state === 'a') {
                entity.vinculosInmueble.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.vinculosInmueble.indexOf(entity.vinculosInmueble.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.vinculosInmueble[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.vinculosInmueble = entity.vinculosInmueble.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.vinculosInmueble.find(x => x.id === row.id);
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

        if (typeEntity === 'Valuacion') {
            if (row.state === 'a') {
                entity.valuaciones.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.valuaciones.indexOf(entity.valuaciones.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.valuaciones[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.valuaciones = entity.valuaciones.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.valuaciones.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'ObraInmueble') {
            if (row.state === 'a') {
                entity.obrasInmueble.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.obrasInmueble.indexOf(entity.obrasInmueble.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.obrasInmueble[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.obrasInmueble = entity.obrasInmueble.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.obrasInmueble.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'ObraInmuebleDetalle') {
            let obraInmueble = entity.obrasInmueble.find(x => x.id === row.idObraInmueble);
            if (obraInmueble.state === 'o') {
                obraInmueble.state = 'c';
            }

            if (row.state === 'a') {
                obraInmueble.obrasInmuebleDetalle.push(row);
            }
            else if (row.state === 'm') {
                const index = obraInmueble.obrasInmuebleDetalle.indexOf(obraInmueble.obrasInmuebleDetalle.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //sigue siendo un alta porque no existe en la bd
                    obraInmueble.obrasInmuebleDetalle[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    obraInmueble.obrasInmuebleDetalle = obraInmueble.obrasInmuebleDetalle.filter(f => f.id !== row.id);
                }
                else {
                    let item = obraInmueble.obrasInmuebleDetalle.find(x => x.id === row.id);
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

        if (typeEntity === 'Superficie') {
            if (row.state === 'a') {
                entity.superficies.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.superficies.indexOf(entity.superficies.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.superficies[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.superficies = entity.superficies.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.superficies.find(x => x.id === row.id);
                    item.state = 'r';
                }
            }
        }

        if (typeEntity === 'Edesur') {
            if (row.state === 'a') {
                entity.edesur.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.edesur.indexOf(entity.edesur.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a';
                    entity.edesur[index] = row;
                }
            }
            else if (row.state === 'r') {
                let item = entity.edesur.find(x => x.id === row.id);
                item.state = 'r';
            }
        }

        if (typeEntity === 'EdesurCliente') {
            let edesur = entity.edesur.find(x => x.id === row.idEdesur);
            if (edesur.state === 'o') {
                edesur.state = 'c';
            }

            if (row.state === 'a') {
                edesur.edesurClientes.push(row);
            }
            else if (row.state === 'm') {
                const index = edesur.edesurClientes.indexOf(edesur.edesurClientes.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //sigue siendo un alta porque no existe en la bd
                    edesur.edesurClientes[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    edesur.edesurClientes = edesur.edesurClientes.filter(f => f.id !== row.id);
                }
                else {
                    let item = edesur.edesurClientes.find(x => x.id === row.id);
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
            {title: 'Obras', icon: 'far fa-building', onClick: () => {ShowPopupMenu('obras')}},
            {title: 'Expedientes', icon: 'fa fa-file', onClick: () => {ShowPopupMenu('expedientes')}}
        ]},
    
        {menu: '2', items: [
            {title: 'Gestión', icon: 'fa fa-gavel', items: [
                {title: 'Certificados Escribanos', onClick: () => {ShowPopupMenu('certificadosEscribanos')}},
                {title: 'Relaciones', onClick: () => {ShowPopupMenu('relacionesCuentas')}},
                {title: 'Controladores', onClick: () => {ShowPopupMenu('controladoresCuentas')}},
                {title: 'Zonas Entregas', onClick: () => {ShowPopupMenu('zonasEntrega')}},
                {title: 'Valuaciones', onClick: () => {ShowPopupMenu('valuaciones')}},
                {title: 'Edesur', onClick: () => {ShowPopupMenu('edesur')}},
                {title: 'Catastro (ARBA)', onClick: () => {ShowPopupMenu('catastro')}}
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
                        {state.menues.obras && (
                            <h5 className="modal-title">Obras</h5>
                        )}
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
                        {state.menues.valuaciones && (
                            <h5 className="modal-title">Valuaciones</h5>
                        )}
                        {state.menues.edesur && (
                            <h5 className="modal-title">Edesur</h5>
                        )}
                        {state.menues.catastro && (
                            <h5 className="modal-title">Catastro (ARBA)</h5>
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
                        {state.menues.obras && (
                            <ObrasInmuebleGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idInmueble: state.id,
                                    list: state.entity.obrasInmueble
                                }}
                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                            />
                        )}
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
                        {state.menues.valuaciones && (
                            <ValuacionesGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idInmueble: state.id,
                                    list: state.entity.valuaciones
                                }}
                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                            />
                        )}
                        {state.menues.edesur && (
                            <EdesurGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idInmueble: state.id,
                                    list: state.entity.edesur
                                }}
                                onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                            />
                        )}
                        {state.menues.catastro && (
                            <CatastroForm
                                disabled={true}
                                data={{
                                    partida: inmueble_formValues.catastralRtasPrv,
                                    circunscripcion: inmueble_formValues.catastralCir,
                                    seccion: inmueble_formValues.catastralSec,
                                    chacra: inmueble_formValues.catastralChacra,
                                    letraChacra: inmueble_formValues.catastralLchacra,
                                    quinta: inmueble_formValues.catastralQuinta,
                                    letraQuinta: inmueble_formValues.catastralLquinta,
                                    fraccion: inmueble_formValues.catastralFrac,
                                    letraFraccion: inmueble_formValues.catastralLfrac,
                                    manzana: inmueble_formValues.catastralManz,
                                    letraManzana: inmueble_formValues.catastralLmanz,
                                    parcela: inmueble_formValues.catastralParc,
                                    letraParcela: inmueble_formValues.catastralLparc,
                                    subparcela: inmueble_formValues.catastralSubparc
                                }}
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
                            Inmueble ({(state.id === 0) ? 
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
                                        <h3 className={state.accordions.vinculos ? 'active' : ''}>Personas del Inmueble</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.vinculos &&
                        <div className='accordion-body'>
                            <VinculosInmuebleGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idInmueble: state.id,
                                    list: state.entity.vinculosInmueble
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

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('catastral')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.catastral) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.catastral ? 'active' : ''}>Información catastral</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.catastral &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralCir" className="form-label">Cir.</label>
                                    <input
                                        name="inmueble_catastralCir"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralCir }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralSec" className="form-label">Sec.</label>
                                    <input
                                        name="inmueble_catastralSec"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralSec }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralChacra" className="form-label">Chacra</label>
                                    <input
                                        name="inmueble_catastralChacra"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralChacra }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralLchacra" className="form-label">L.Chacra</label>
                                    <input
                                        name="inmueble_catastralLchacra"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralLchacra }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        
                                    />
                                </div>    
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralQuinta" className="form-label">Quinta</label>
                                    <input
                                        name="inmueble_catastralQuinta"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralQuinta }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralLquinta" className="form-label">L.Quinta</label>
                                    <input
                                        name="inmueble_catastralLquinta"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralLquinta }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>                                
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralFrac" className="form-label">Frac.</label>
                                    <input
                                        name="inmueble_catastralFrac"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralFrac }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralLfrac" className="form-label">L.Frac.</label>
                                    <input
                                        name="inmueble_catastralLfrac"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralLfrac }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralManz" className="form-label">Manz.</label>
                                    <input
                                        name="inmueble_catastralManz"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralManz }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralLmanz" className="form-label">L.Manz.</label>
                                    <input
                                        name="inmueble_catastralLmanz"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralLmanz }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralParc" className="form-label">Parc.</label>
                                    <input
                                        name="inmueble_catastralParc"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralParc }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralLparc" className="form-label">L.Parc.</label>
                                    <input
                                        name="inmueble_catastralLparc"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralLparc }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralSubparc" className="form-label">SubParc.</label>
                                    <input
                                        name="inmueble_catastralSubparc"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralSubparc }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>                                
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralUfunc" className="form-label">U.Func.</label>
                                    <input
                                        name="inmueble_catastralUfunc"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralUfunc }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralUcomp" className="form-label">U.Comp.</label>
                                    <input
                                        name="inmueble_catastralUcomp"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralUcomp }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_catastralRtasPrv" className="form-label">Rtas. Prv.</label>
                                    <input
                                        name="inmueble_catastralRtasPrv"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.catastralRtasPrv }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_tributoManz" className="form-label">Manz. (Escritura)</label>
                                    <input
                                        name="inmueble_tributoManz"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.tributoManz }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_tributoLote" className="form-label">Lote (Escritura)</label>
                                    <input
                                        name="inmueble_tributoLote"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={inmueble_formValues.tributoLote }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2 form-check">
                                    <label htmlFor="inmueble_tributoEsquina" className="form-check-label">Es esquina</label>
                                    <input
                                        name="inmueble_tributoEsquina"
                                        type="checkbox"
                                        className="form-check-input"
                                        value={''}
                                        checked={inmueble_formValues.tributoEsquina }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                            </div>
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
                                    <label htmlFor="inmueble_idEstadoCarga" className="form-label">Estado Carga</label>
                                    <InputLista
                                        name="inmueble_idEstadoCarga"
                                        placeholder=""
                                        className="form-control"
                                        value={ inmueble_formValues.idEstadoCarga }
                                        onChange={ inmueble_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW || state.entity.inmueble.idEstadoCarga !== 20}
                                        lista="EstadoCarga"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_fechaCargaInicio" className="form-label">Fecha Inicio Carga</label>
                                    <DatePickerCustom
                                        name="inmueble_fechaCargaInicio"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.inmueble.fechaCargaInicio }
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="inmueble_fechaCargaFin" className="form-label">Fecha Fin Carga</label>
                                    <DatePickerCustom
                                        name="inmueble_fechaCargaFin"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.inmueble.fechaCargaFin }
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
                                title="Información adicional de Inmueble"
                                processKey={state.processKey}
                                entidad="Inmueble"
                                idEntidad={state.id}
                                disabled={(state.mode === OPERATION_MODE.VIEW)}
                                onChange={(row) => setPendingChange(true)}
                            />
                        </div>
                        )}

                        <Tabs
                            id="tabs-inmueble"
                            activeKey={state.tabActive}
                            className="m-top-20"
                            onSelect={(tab) => SetTabActive(tab)}
                        >
                            <Tab eventKey="terreno" title="Lados del Terreno">
                                <div className='tab-panel'>
                                    <LadosTerrenoGrid
                                        processKey={state.processKey}
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        data={{
                                            idInmueble: state.id,
                                            list: state.entity.ladosTerreno
                                        }}
                                        onChange={(typeEntity, row) => UpdateEntity(typeEntity, row)}
                                    />
                                </div>
                            </Tab>
                            <Tab eventKey="superficie" title="Superficies">
                                <div className='tab-panel'>
                                    <SuperficiesGrid
                                        processKey={state.processKey}
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        data={{
                                            idInmueble: state.id,
                                            list: state.entity.superficies
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

export default InmuebleView;
