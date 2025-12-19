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
import { useEntidad } from '../../components/hooks/useEntidad';
import { useReporte } from '../../components/hooks/useReporte';

import { Loading, SectionHeading, SectionSidebar, DatePickerCustom, InputLista, InputEntidad, InputFormat, MessageModal } from '../../components/common';
import { CloneObject, OpenObjectURL } from '../../utils/helpers';
import { getDateId } from '../../utils/convert';
import ShowToastMessage from '../../utils/toast';
import DataTaggerFormRedux from '../../components/controls/DataTaggerFormRedux';
import RelacionesCuentasGrid from '../../components/controls/RelacionesCuentasGrid';
import DomiciliosGrid from '../../components/controls/DomiciliosGrid';
import VariablesGrid from '../../components/controls/VariablesGrid';
import VinculosVehiculoGrid from '../../components/controls/VinculosVehiculoGrid';
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
import CuentaPlanesPagosGrid from '../../components/controls/CuentaPlanesPagosGrid';
import CuentaPagosAnticipadosGrid from '../../components/controls/CuentaPagosAnticipadosGrid';
import CuentaDebitosCreditosGrid from '../../components/controls/CuentaDebitosCreditosGrid';
import { useBeforeunload } from 'react-beforeunload';
import CuentaEmisionEjecucionForm from '../../components/controls/CuentaEmisionEjecucionForm';


function VehiculoView() {

    //parametros url
    const params = useParams();

    //variables
    const entityInit = {
        vehiculo: {
            id: 0,
            idCuenta: 0,
            idEstadoCarga: 20,
            fechaCargaInicio: null,
            fechaCargaFin: null,
            dominio: '',
            dominioAnterior: '',
            anioModelo: '',
            marca: '',
            codigoMarca: '',
            modelo: '',
            idIncisoVehiculo: 0,
            idTipoVehiculo: 0,
            idCategoriaVehiculo: 0,
            numeroMotor: '',
            marcaMotor: '',
            numeroChasis: '',
            serieMotor: '',
            legajo: '',
            valuacion: 0,
            peso: '',
            carga: '',
            cilindrada: '',
            idOrigenFabricacion: 0,
            idCombustible: 0,
            idUsoVehiculo: 0,
            idMotivoBajaVehiculo: 0,
            recupero: '',
            radicacionAnterior: '',
            fechaAlta: null,
            fechaPatentamiento: null,
            fechaRadicacion: null,
            fechaTransferencia: null,
            fechaCompra: null,
            fechaBaja: null,
            fechaHabilitacionDesde: null,
            fechaHabilitacionHasta: null,
            fechaDDJJ: null            
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
        vinculosVehiculo: [],
        zonasEntrega: [],
        controladoresCuentas: [],
        condicionesEspeciales: [],
        recargosDescuentos: [],
        debitosAutomaticos: []
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
        processKey: `Vehiculo_${params.id??0}_${getDateId()}`,
        id: params.id ? parseInt(params.id) : 0,
        mode: params.mode,
        loading: false,
        entity: entityInit,
        accordions: {
            cuenta: true,
            vinculos: false,
            domicilios: false,
            estado: false,
            datoVehiculo:false,
            datoAdministrativo:false,
            info: false
        },
        menues: menuesInit,
        showMenu: false,
        tabActive: "exenciones",
        showInfoVehiculoMenor: false
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['IncisoVehiculo'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'IncisoVehiculo',
          timeout: 0
        }
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
            FindVehiculo();
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

    const [ vehiculo_formValues, vehiculo_formHandle, , vehiculo_formSet ] = useForm({
        idEstadoCarga: 20,
        dominio: '',
        dominioAnterior: '',
        anioModelo: '',
        marca: '',
        codigoMarca: '',
        modelo: '',
        idIncisoVehiculo: 0,
        idTipoVehiculo: 0,
        idCategoriaVehiculo: 0,
        numeroMotor: '',
        marcaMotor: '',
        numeroChasis: '',
        serieMotor: '',
        legajo: '',
        valuacion: 0,
        peso: '',
        carga: '',
        cilindrada: '',
        idOrigenFabricacion: 0,
        idCombustible: 0,
        idUsoVehiculo: 0,
        idMotivoBajaVehiculo: 0,
        recupero: '',
        radicacionAnterior: '',
        fechaAlta: null,
        fechaPatentamiento: null,
        fechaRadicacion: null,
        fechaTransferencia: null,
        fechaCompra: null,
        fechaBaja: null,
        fechaHabilitacionDesde: null,
        fechaHabilitacionHasta: null,
        fechaDDJJ: null                    
    }, 'vehiculo_');

    const [ cuenta_formValues, cuenta_formHandle, , cuenta_formSet ] = useForm({
        numeroCuenta: '',
        numeroWeb: ''
    }, 'cuenta_');

    const [ generateReporte, ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer)
                OpenObjectURL(`${reporte}.pdf`, buffer);
            else
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }
    });

    //handles
    const cuenta_formHandleProxy = (event) => {
        cuenta_formHandle(event);
        setPendingChange(true);
    }
    const vehiculo_formHandleProxy = (event) => {
        vehiculo_formHandle(event);
        setPendingChange(true);
    }
    const handleClickGuardar = () => {
        if (isFormValid()) {
            if (state.id === 0) {
                AddVehiculo();
            }
            else {
                ModifyVehiculo();
            }
        };
    };
    const handleClickVolver = () => {
        if (!pendingChange) dispatch(dataTaggerActionClear(state.processKey));
        const url = '/vehiculos';
        navigate(url, { replace: true });    
    }
    const handleClickBaja = () => {
        setMessage({ show: true, text: "Confirma dar la baja de la cuenta", callback: ModifyBajaCuenta, id: state.entity.cuenta.id });
    } 

    const handleClickReporte = (reporte) => {
        const paramsReporte = {
            idVehiculo: state.id
        }
        generateReporte(reporte, paramsReporte);
    }

    const handleChangeInciso = (event) => {
        const {target} = event;
        let idIncisoVehiculo = 0;
        let showInfoVehiculoMenor = false;
        if (target.row) {
            idIncisoVehiculo = parseInt(target.value);
            showInfoVehiculoMenor = target.row.vehiculoMenor;
        }
        
        vehiculo_formSet({...vehiculo_formValues,
            idIncisoVehiculo: idIncisoVehiculo,
            idTipoVehiculo: 0,
            idCategoriaVehiculo: 0,
            dominioAnterior: (showInfoVehiculoMenor) ? '' : vehiculo_formValues.dominioAnterior,
            codigoMarca: (showInfoVehiculoMenor) ? '' : vehiculo_formValues.codigoMarca,
            peso: (showInfoVehiculoMenor) ? '' : vehiculo_formValues.peso,
            carga: (showInfoVehiculoMenor) ? '' : vehiculo_formValues.carga,
            cilindrada: (!showInfoVehiculoMenor) ? '' : vehiculo_formValues.cilindrada
        });
        setState(prevState => {
            return {...prevState, showInfoVehiculoMenor: showInfoVehiculoMenor};
        });
        setPendingChange(true);
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
    const callbackSuccessFindImueble = (response) => {
        response.json()
        .then((data) => {

            //deserialize date fields
            if (data.vehiculo.fechaCargaInicio) data.vehiculo.fechaCargaInicio = new Date(data.vehiculo.fechaCargaInicio);
            if (data.vehiculo.fechaCargaFin) data.vehiculo.fechaCargaFin = new Date(data.vehiculo.fechaCargaFin);
            if (data.vehiculo.fechaAlta) data.vehiculo.fechaAlta = new Date(data.vehiculo.fechaAlta);
            if (data.vehiculo.fechaPatentamiento) data.vehiculo.fechaPatentamiento = new Date(data.vehiculo.fechaPatentamiento);
            if (data.vehiculo.fechaRadicacion) data.vehiculo.fechaRadicacion = new Date(data.vehiculo.fechaRadicacion);
            if (data.vehiculo.fechaTransferencia) data.vehiculo.fechaTransferencia = new Date(data.vehiculo.fechaTransferencia);
            if (data.vehiculo.fechaCompra) data.vehiculo.fechaCompra = new Date(data.vehiculo.fechaCompra);
            if (data.vehiculo.fechaBaja) data.vehiculo.fechaBaja = new Date(data.vehiculo.fechaBaja);
            if (data.vehiculo.fechaHabilitacionDesde) data.vehiculo.fechaHabilitacionDesde = new Date(data.vehiculo.fechaHabilitacionDesde);
            if (data.vehiculo.fechaHabilitacionHasta) data.vehiculo.fechaHabilitacionHasta = new Date(data.vehiculo.fechaHabilitacionHasta);
            if (data.vehiculo.fechaDDJJ) data.vehiculo.fechaDDJJ = new Date(data.vehiculo.fechaDDJJ);

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
            data.vinculosVehiculo.forEach(x => {
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
            setPendingChange(false);
            vehiculo_formSet({
                idEstadoCarga: data.vehiculo.idEstadoCarga,
                dominio: data.vehiculo.dominio,
                dominioAnterior: data.vehiculo.dominioAnterior,
                anioModelo: data.vehiculo.anioModelo,
                marca: data.vehiculo.marca,
                codigoMarca: data.vehiculo.codigoMarca,
                modelo: data.vehiculo.modelo,
                idIncisoVehiculo: data.vehiculo.idIncisoVehiculo,
                idTipoVehiculo: data.vehiculo.idTipoVehiculo,
                idCategoriaVehiculo: data.vehiculo.idCategoriaVehiculo,
                numeroMotor: data.vehiculo.numeroMotor,
                marcaMotor: data.vehiculo.marcaMotor,
                numeroChasis: data.vehiculo.numeroChasis,
                serieMotor: data.vehiculo.serieMotor,
                legajo: data.vehiculo.legajo,
                valuacion: data.vehiculo.valuacion,
                peso: data.vehiculo.peso,
                carga: data.vehiculo.carga,
                cilindrada: data.vehiculo.cilindrada,
                idOrigenFabricacion: data.vehiculo.idOrigenFabricacion,
                idCombustible: data.vehiculo.idCombustible,
                idUsoVehiculo: data.vehiculo.idUsoVehiculo,
                idMotivoBajaVehiculo: data.vehiculo.idMotivoBajaVehiculo,
                recupero: data.vehiculo.recupero,
                radicacionAnterior: data.vehiculo.radicacionAnterior,
                fechaAlta: data.vehiculo.fechaAlta,
                fechaPatentamiento: data.vehiculo.fechaPatentamiento,
                fechaRadicacion: data.vehiculo.fechaRadicacion,
                fechaTransferencia: data.vehiculo.fechaTransferencia,
                fechaCompra: data.vehiculo.fechaCompra,
                fechaBaja: data.vehiculo.fechaBaja,
                fechaHabilitacionDesde: data.vehiculo.fechaHabilitacionDesde,
                fechaHabilitacionHasta: data.vehiculo.fechaHabilitacionHasta,
                fechaDDJJ: data.vehiculo.fechaDDJJ                                     
            });

            let showInfoVehiculoMenor = false;
            if (data.vehiculo.idIncisoVehiculo !== 0) {
                const row = getRowEntidad('IncisoVehiculo', data.vehiculo.idIncisoVehiculo);
                showInfoVehiculoMenor = row.vehiculoMenor;
            }

            setState(prevState => {
                return {...prevState, loading: false, entity: data, showInfoVehiculoMenor: showInfoVehiculoMenor};
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
        if (vehiculo_formValues.idEstadoCarga === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Estado de Carga incompleto');
            return false;
        }
     
        if (vehiculo_formValues.anioModelo.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Año/Modelo');
            return false;
        }        
        if (vehiculo_formValues.dominio.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Dominio');
            return false;
        }
        if (vehiculo_formValues.idIncisoVehiculo <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Inciso');
            return false;
        }
        if (vehiculo_formValues.idTipoVehiculo <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo');
            return false;
        }
        if (vehiculo_formValues.idCategoriaVehiculo <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Categoría');
            return false;
        }
        if (vehiculo_formValues.marca.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Marca');
            return false;
        }
        if ((!state.showInfoVehiculoMenor) && (vehiculo_formValues.codigoMarca.length === 0)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Código de marca');
            return false;
        }
        if (vehiculo_formValues.modelo.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Modelo');
            return false;
        }                      
        if (vehiculo_formValues.legajo.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Clave N°/Legajo');
            return false;
        }
        if (vehiculo_formValues.numeroMotor.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número de motor');
            return false;
        }
        if (vehiculo_formValues.marcaMotor.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Marca del motor');
            return false;
        }
        if (vehiculo_formValues.numeroChasis.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Número de chasis');
            return false;
        }
        if (vehiculo_formValues.serieMotor.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Serie motor');
            return false;
        }
        if (vehiculo_formValues.valuacion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El campo Valuación debe ser mayor a cero');
            return false;
        }
        if ((!state.showInfoVehiculoMenor) && (vehiculo_formValues.peso.length === 0)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Peso');
            return false;
        }
        // if ((!state.showInfoVehiculoMenor) && (vehiculo_formValues.carga.length === 0)) {
        //     ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Carga');
        //     return false;
        // }
        if ((state.showInfoVehiculoMenor) && (vehiculo_formValues.cilindrada.length === 0)){
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Cilindrada');
            return false;
        }
        if (vehiculo_formValues.idOrigenFabricacion <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Nacionalidad');
            return false;
        }
        if (vehiculo_formValues.idCombustible <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Combustible');
            return false;
        }
        if (vehiculo_formValues.idUsoVehiculo <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Uso');
            return false;
        }
        if (vehiculo_formValues.recupero.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo Recupero');
            return false;
        }                 


        return true;
    }

    function FindVehiculo() {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.VEHICULO,
            paramsUrl,
            null,
            callbackSuccessFindImueble,
            callbackNoSuccess,
            callbackError
        );

    }

    function AddVehiculo() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Vehiculo ingresado correctamente", () => {
                    dispatch(dataTaggerActionClear(state.processKey));
                    setState(prevState => {
                        return {...prevState, loading: false};
                    });
                    const url = '/vehiculo/' + OPERATION_MODE.EDIT + '/' + row.vehiculo.id;
                    navigate(url, { replace: true });
                    navigate(0)
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
            vehiculo: {
                ...state.entity.vehiculo,
                idEstadoCarga: vehiculo_formValues.idEstadoCarga,
                dominio: vehiculo_formValues.dominio,
                dominioAnterior: vehiculo_formValues.dominioAnterior,
                anioModelo: vehiculo_formValues.anioModelo,
                marca: vehiculo_formValues.marca,
                codigoMarca: vehiculo_formValues.codigoMarca,
                modelo: vehiculo_formValues.modelo,
                idIncisoVehiculo: vehiculo_formValues.idIncisoVehiculo,
                idTipoVehiculo: vehiculo_formValues.idTipoVehiculo,
                idCategoriaVehiculo: vehiculo_formValues.idCategoriaVehiculo,
                numeroMotor: vehiculo_formValues.numeroMotor,
                marcaMotor: vehiculo_formValues.marcaMotor,
                numeroChasis: vehiculo_formValues.numeroChasis,
                serieMotor: vehiculo_formValues.serieMotor,
                legajo: vehiculo_formValues.legajo,
                valuacion: vehiculo_formValues.valuacion,
                peso: vehiculo_formValues.peso,
                carga: vehiculo_formValues.carga,
                cilindrada: vehiculo_formValues.cilindrada,
                idOrigenFabricacion: vehiculo_formValues.idOrigenFabricacion,
                idCombustible: vehiculo_formValues.idCombustible,
                idUsoVehiculo: vehiculo_formValues.idUsoVehiculo,
                idMotivoBajaVehiculo: vehiculo_formValues.idMotivoBajaVehiculo,
                recupero: vehiculo_formValues.recupero,
                radicacionAnterior: vehiculo_formValues.radicacionAnterior,
                fechaAlta: vehiculo_formValues.fechaAlta,
                fechaPatentamiento: vehiculo_formValues.fechaPatentamiento,
                fechaRadicacion: vehiculo_formValues.fechaRadicacion,
                fechaTransferencia: vehiculo_formValues.fechaTransferencia,
                fechaCompra: vehiculo_formValues.fechaCompra,
                fechaBaja: vehiculo_formValues.fechaBaja,
                fechaHabilitacionDesde: vehiculo_formValues.fechaHabilitacionDesde,
                fechaHabilitacionHasta: vehiculo_formValues.fechaHabilitacionHasta,
                fechaDDJJ: vehiculo_formValues.fechaDDJJ                  
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
            vinculosVehiculo: [],
            zonasEntrega: [],
            controladoresCuentas: [],
            condicionesEspeciales: [],
            recargosDescuentos: [],
            debitosAutomaticos: []
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.VEHICULO,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }

    function ModifyVehiculo() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Vehiculo actualizado correctamente", () => {
                dispatch(dataTaggerActionClear(state.processKey));
                callbackSuccessFindImueble(response);
            });
        };

        const dataBody = {
            vehiculo: {
                ...state.entity.vehiculo,
                idEstadoCarga: vehiculo_formValues.idEstadoCarga,
                dominio: vehiculo_formValues.dominio,
                dominioAnterior: vehiculo_formValues.dominioAnterior,
                anioModelo: vehiculo_formValues.anioModelo,
                marca: vehiculo_formValues.marca,
                codigoMarca: vehiculo_formValues.codigoMarca,
                modelo: vehiculo_formValues.modelo,
                idIncisoVehiculo: vehiculo_formValues.idIncisoVehiculo,
                idTipoVehiculo: vehiculo_formValues.idTipoVehiculo,
                idCategoriaVehiculo: vehiculo_formValues.idCategoriaVehiculo,
                numeroMotor: vehiculo_formValues.numeroMotor,
                marcaMotor: vehiculo_formValues.marcaMotor,
                numeroChasis: vehiculo_formValues.numeroChasis,
                serieMotor: vehiculo_formValues.serieMotor,
                legajo: vehiculo_formValues.legajo,
                valuacion: vehiculo_formValues.valuacion,
                peso: vehiculo_formValues.peso,
                carga: vehiculo_formValues.carga,
                cilindrada: vehiculo_formValues.cilindrada,
                idOrigenFabricacion: vehiculo_formValues.idOrigenFabricacion,
                idCombustible: vehiculo_formValues.idCombustible,
                idUsoVehiculo: vehiculo_formValues.idUsoVehiculo,
                idMotivoBajaVehiculo: vehiculo_formValues.idMotivoBajaVehiculo,
                recupero: vehiculo_formValues.recupero,
                radicacionAnterior: vehiculo_formValues.radicacionAnterior,
                fechaAlta: vehiculo_formValues.fechaAlta,
                fechaPatentamiento: vehiculo_formValues.fechaPatentamiento,
                fechaRadicacion: vehiculo_formValues.fechaRadicacion,
                fechaTransferencia: vehiculo_formValues.fechaTransferencia,
                fechaCompra: vehiculo_formValues.fechaCompra,
                fechaBaja: vehiculo_formValues.fechaBaja,
                fechaHabilitacionDesde: vehiculo_formValues.fechaHabilitacionDesde,
                fechaHabilitacionHasta: vehiculo_formValues.fechaHabilitacionHasta,
                fechaDDJJ: vehiculo_formValues.fechaDDJJ                    
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
            vinculosVehiculo: state.entity.vinculosVehiculo, //en este caso hacen falta todos para calcular el referente de la cuenta
            zonasEntrega: state.entity.zonasEntrega.filter(f => f.state !== 'o'),
            controladoresCuentas: state.entity.controladoresCuentas.filter(f => f.state !== 'o'),
            condicionesEspeciales: state.entity.condicionesEspeciales.filter(f => f.state !== 'o'),
            recargosDescuentos: state.entity.recargosDescuentos.filter(f => f.state !== 'o'),
            debitosAutomaticos: state.entity.debitosAutomaticos.filter(f => f.state !== 'o')
        };

        const paramsUrl = `/${state.id}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.VEHICULO,
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
                    const url = '/vehiculo/' + OPERATION_MODE.VIEW + '/' + row.idTributo;
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

        if (typeEntity === 'VinculoVehiculo') {
            if (row.state === 'a') {
                entity.vinculosVehiculo.push(row);
            }
            else if (row.state === 'm') {
                const index = entity.vinculosVehiculo.indexOf(entity.vinculosVehiculo.find(x => x.id === row.id));
                if (index !== -1) {
                    if (row.id < 0) row.state = 'a'; //originalmente era un alta
                    entity.vinculosVehiculo[index] = row;
                }
            }
            else if (row.state === 'r') {
                if (row.id < 0) { //lo elimino directamente porque no existe en la bd
                    entity.vinculosVehiculo = entity.vinculosVehiculo.filter(f => f.id !== row.id);
                }
                else {
                    let item = entity.vinculosVehiculo.find(x => x.id === row.id);
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
                            Vehículo ({(state.id === 0) ? 
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
                                        <h3 className={state.accordions.vinculos ? 'active' : ''}>Personas del Vehiculo</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.vinculos &&
                        <div className='accordion-body'>
                            <VinculosVehiculoGrid
                                processKey={state.processKey}
                                disabled={state.mode === OPERATION_MODE.VIEW}
                                data={{
                                    idVehiculo: state.id,
                                    list: state.entity.vinculosVehiculo
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
                                <div className="col-12" onClick={() => ToggleAccordion('datoVehiculo')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.datoVehiculo) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.datoVehiculo ? 'active' : ''}>Datos del vehículo</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.datoVehiculo &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-12 col-sm-4 col-lg-3">
                                    <label htmlFor="vehiculo_anioModelo" className="form-label">Año/Modelo</label>
                                    <input
                                        name="vehiculo_anioModelo"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.anioModelo}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-12 col-sm-4 col-lg-3">
                                    <label htmlFor="vehiculo_dominio" className="form-label">Dominio</label>
                                    <input
                                        name="vehiculo_dominio"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.dominio}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                {!state.showInfoVehiculoMenor &&
                                <div className="col-12 col-sm-4 col-lg-3">
                                    <label htmlFor="vehiculo_dominioAnterior" className="form-label">Dominio anterior</label>
                                    <input
                                        name="vehiculo_dominioAnterior"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.dominioAnterior}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                }
                                
                                <div className="w-100 d-none d-lg-block"></div>

                                <div className="col-12 col-sm-12 col-lg-6">
                                    <label htmlFor="vehiculo_idIncisoVehiculo" className="form-label">Inciso</label>
                                    <InputEntidad
                                        name="vehiculo_idIncisoVehiculo"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.idIncisoVehiculo}
                                        onChange={handleChangeInciso}                                                                  
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        title="Inciso Vehiculo"
                                        entidad="IncisoVehiculo"
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_idTipoVehiculo" className="form-label">Tipo</label>
                                    <InputEntidad
                                        name="vehiculo_idTipoVehiculo"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.idTipoVehiculo}
                                        onChange={({target}) => {
                                            vehiculo_formSet({...vehiculo_formValues,
                                                idTipoVehiculo: target.value
                                            });
                                            setPendingChange(true);
                                        }}                                                                  
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        title="Tipo Vehiculo"
                                        entidad="TipoVehiculo"
                                        filter={(row) => row.idIncisoVehiculo === vehiculo_formValues.idIncisoVehiculo}
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3">
                                <label htmlFor="vehiculo_idCategoriaVehiculo" className="form-label">Categoría</label>
                                <InputEntidad
                                    name="vehiculo_idCategoriaVehiculo"
                                    placeholder=""
                                    className="form-control"
                                    value={vehiculo_formValues.idCategoriaVehiculo}
                                    onChange={({target}) => {
                                        vehiculo_formSet({...vehiculo_formValues,
                                            idCategoriaVehiculo: target.value
                                        });
                                        setPendingChange(true);
                                    }}                                   
                                    disabled={state.mode === OPERATION_MODE.VIEW}
                                    title="Categoria Vehiculo"
                                    entidad="CategoriaVehiculo"
                                    filter={(row) => row.idIncisoVehiculo === vehiculo_formValues.idIncisoVehiculo}
                                />
                                </div>

                                <div className="w-100 d-none d-lg-block"></div>

                                <div className={(!state.showInfoVehiculoMenor) ? "col-12 col-sm-6 col-lg-3" : "col-12 col-sm-6 col-lg-6"}>
                                    <label htmlFor="vehiculo_marca" className="form-label">Marca</label>
                                    <input
                                        name="vehiculo_marca"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.marca}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                {!state.showInfoVehiculoMenor &&
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_codigoMarca" className="form-label">Código de marca</label>
                                    <input
                                        name="vehiculo_codigoMarca"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.codigoMarca}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                }
                                <div className="col-12 col-md-6 col-lg-3">
                                    <label htmlFor="vehiculo_modelo" className="form-label">Modelo</label>
                                    <input
                                        name="vehiculo_modelo"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.modelo}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-12 col-md-6 col-lg-3">
                                    <label htmlFor="vehiculo_legajo" className="form-label">Clave N° / Legajo</label>
                                    <input
                                        name="vehiculo_legajo"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.legajo}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className='row form-basic'>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_numeroMotor" className="form-label">Número de motor</label>
                                    <input
                                        name="vehiculo_numeroMotor"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.numeroMotor}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_marcaMotor" className="form-label">Marca del motor</label>
                                    <input
                                        name="vehiculo_marcaMotor"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.marcaMotor}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_numeroChasis" className="form-label">Número de chasis / Bastidor</label>
                                    <input
                                        name="vehiculo_numeroChasis"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.numeroChasis}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_serieMotor" className="form-label">Serie motor</label>
                                    <input
                                        name="vehiculo_serieMotor"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.serieMotor}
                                        onChange={ vehiculo_formHandleProxy }    
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="col-12 col-sm-6 col-lg-3" >
                                    <label htmlFor="vehiculo_valuacion" className="form-label">Valuación</label>
                                    <InputNumber
                                        name="vehiculo_valuacion"
                                        placeholder=""
                                        className="form-control"
                                        value={ vehiculo_formValues.valuacion }
                                        precision={2}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />                                    
                                </div>
                                {!state.showInfoVehiculoMenor &&
                                <>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_peso" className="form-label">Peso</label>
                                    <input
                                        name="vehiculo_peso"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.peso}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_carga" className="form-label">Carga</label>
                                    <input
                                        name="vehiculo_carga"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.carga}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                </>
                                }
                                {state.showInfoVehiculoMenor &&
                                <div className="col-12 col-md-6 col-lg-3">
                                    <label htmlFor="vehiculo_cilindrada" className="form-label">Cilindrada</label>
                                    <input
                                        name="vehiculo_cilindrada"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.cilindrada}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                            }
                            </div>

                            <div className='row form-basic'>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_idOrigenFabricacion" className="form-label">Nacionalidad</label>
                                    <InputLista
                                        name="vehiculo_idOrigenFabricacion"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.idOrigenFabricacion}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        lista="OrigenFabricacion"
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_idCombustible" className="form-label">Combustible</label>
                                    <InputLista
                                        name="vehiculo_idCombustible"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.idCombustible}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        lista="Combustible"
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_idUsoVehiculo" className="form-label">Uso</label>
                                    <InputLista
                                        name="vehiculo_idUsoVehiculo"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.idUsoVehiculo}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        lista="FinalidadVehiculo"
                                    />
                                </div>
                                <div className="col-12 col-sm-6 col-lg-3">
                                    <label htmlFor="vehiculo_recupero" className="form-label">Recupero</label>
                                    <input
                                        name="vehiculo_recupero"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.recupero}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>  
                            </div>
                        </div>
                        )}                        

                        <div className='accordion-header m-top-20'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('datoAdministrativo')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.datoAdministrativo) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.datoAdministrativo ? 'active' : ''}>Datos administrativos</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.datoAdministrativo &&
                        <div className='accordion-body'>
                            <div className='row form-basic'>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaAlta" className="form-label">Fecha Alta/Trib.</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaAlta"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.fechaAlta}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaPatentamiento" className="form-label">Fecha de patentamiento</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaPatentamiento"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.fechaPatentamiento}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaRadicacion" className="form-label">Fecha de radicación</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaRadicacion"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.fechaRadicacion}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_radicacionAnterior" className="form-label">Radicación anterior</label>
                                    <input
                                        name="vehiculo_radicacionAnterior"
                                        type="text"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.radicacionAnterior}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaTransferencia" className="form-label">Fecha de transferencia</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaTransferencia"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.fechaTransferencia}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaCompra" className="form-label">Fecha de compra</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaCompra"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.fechaCompra}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaHabilitacionDesde" className="form-label">Habilitación desde</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaHabilitacionDesde"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.fechaHabilitacionDesde}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaHabilitacionHasta" className="form-label">Habilitación hasta</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaHabilitacionHasta"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.fechaHabilitacionHasta}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        minValue={vehiculo_formValues.fechaHabilitacionDesde}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaDDJJ" className="form-label">Fecha UI DDJJ</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaDDJJ"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.fechaDDJJ}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaBaja" className="form-label">Fecha de baja</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaBaja"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.fechaBaja}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                    />
                                </div>
                                <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                                    <label htmlFor="vehiculo_idMotivoBajaVehiculo" className="form-label">Motivo baja</label>
                                    <InputLista
                                        name="vehiculo_idMotivoBajaVehiculo"
                                        placeholder=""
                                        className="form-control"
                                        value={vehiculo_formValues.idMotivoBajaVehiculo}
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW}
                                        lista="MotivoBajaVehiculo"
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
                                    <label htmlFor="vehiculo_idEstadoCarga" className="form-label">Estado Carga</label>
                                    <InputLista
                                        name="vehiculo_idEstadoCarga"
                                        placeholder=""
                                        className="form-control"
                                        value={ vehiculo_formValues.idEstadoCarga }
                                        onChange={ vehiculo_formHandleProxy }
                                        disabled={state.mode === OPERATION_MODE.VIEW || state.entity.vehiculo.idEstadoCarga !== 20}
                                        lista="EstadoCarga"
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaCargaInicio" className="form-label">Fecha Inicio Carga</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaCargaInicio"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.vehiculo.fechaCargaInicio }
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <label htmlFor="vehiculo_fechaCargaFin" className="form-label">Fecha Fin Carga</label>
                                    <DatePickerCustom
                                        name="vehiculo_fechaCargaFin"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.vehiculo.fechaCargaFin }
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
                                title="Información adicional de Vehiculo"
                                processKey={state.processKey}
                                entidad="Vehiculo"
                                idEntidad={state.id}
                                disabled={(state.mode === OPERATION_MODE.VIEW)}
                                onChange={(row) => setPendingChange(true)}
                            />
                        </div>
                        )}

                        <Tabs
                            id="tabs-vehiculo"
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
                {state.entity.cuenta.idEstadoCuenta === CUENTA_STATE.INACTIVA &&
                <button className="btn decline-button float-start m-left-50" onClick={ (event) => handleClickReporte("VehiculoBaja") } >Certificado de Baja</button>
                }
                {state.mode !== OPERATION_MODE.NEW &&
                <button className="btn decline-button float-start m-left-50" onClick={ (event) => handleClickReporte("VehiculoLibreDeuda") } >Certificado de Libre Deuda</button>
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

export default VehiculoView;
