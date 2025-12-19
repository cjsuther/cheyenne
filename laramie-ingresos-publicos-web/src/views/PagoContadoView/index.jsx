import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { useReporte } from '../../components/hooks/useReporte';
import { useDispatch, useSelector } from 'react-redux';
import { memoActionDel } from '../../context/redux/actions/memoAction';
import ShowToastMessage from '../../utils/toast';
import { Loading, MessageModal, SectionHeading, InputCuenta, InputStaticEntidad, InputNumber } from '../../components/common';
import { getDateNow } from '../../utils/convert';
import { OpenObjectURL } from '../../utils/helpers';


function PagoContadoView() {

    //parametros url
    const params = useParams();
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const toDay = getDateNow(false);

    const {cache} = useSelector( (state) => state.memo );

    const entityInit = {
        cuenta: {
            id: 0,
            numeroCuenta: '',
            numeroWeb: '',
            idEstadoCuenta: 0,
            idTipoTributo: 0,
            idTributo: 0,
            fechaAlta: null,
            fechaBaja: null,
            idContribuyentePrincipal: 0,
            idDireccionPrincipal: 0,
            idDireccionEntrega: 0
        },
        pagoContadoDefinicion: {
            id: 0,
            idEstadoPagoContadoDefinicion: 0,
            idTipoPlanPago: 0,
            idTipoTributo: 0,
            idTasaPagoContado: 0,
            idSubTasaPagoContado: 0,
            idTasaSellados: 0,
            idSubTasaSellados: 0,
            idTasaGastosCausidicos: 0,
            idSubTasaGastosCausidicos: 0,
            codigo: "",
            descripcion: "",
            fechaDesde: null,
            fechaHasta: null,
            idTipoAlcanceTemporal: 0,
            fechaDesdeAlcanceTemporal: null,
            fechaHastaAlcanceTemporal: null,
            mesDesdeAlcanceTemporal: 0,
            mesHastaAlcanceTemporal: 0,
            aplicaDerechosEspontaneos: false,
            aplicaTotalidadDeudaAdministrativa: false,
            aplicaDeudaAdministrativa: false,
            aplicaDeudaLegal: false,
            aplicaGranContribuyente: false,
            aplicaPequenioContribuyente: false,
            montoDeudaAdministrativaDesde: 0,
            montoDeudaAdministrativaHasta: 0,
            idViaConsolidacion: 0,
            porcentajeQuitaRecargos: 0,
            porcentajeQuitaMultaInfracciones: 0,
            porcentajeQuitaHonorarios: 0,
            porcentajeQuitaAportes: 0,
            idUsuarioCreacion: 0,
            fechaCreacion: null,
            tipoPlanPago: {
                id: 0,
                codigo: '',
                nombre: '',
                idTipoTributo: 0,
                convenio: '',
                condiciones: ''
            }
        },
        opcionCuota: {
            numeroCuota: 0,
            cantidadCuotas: 0,
            importeCapital: 0,
            importeIntereses: 0,
            importeSellados: 0,
            importeAnticipo: 0,
            importeQuita: 0,
            importeCuota: 0
        }
    };

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        items: [],
        loading: false,
        disbled: false
    });
    const [cuenta, setCuenta] = useState(entityInit.cuenta);
    const [pagoContadoDefinicion, setPagoContadoDefinicion] = useState(entityInit.pagoContadoDefinicion);
    const [definiciones, setDefiniciones] = useState([]);
    const [opcionCuotaSelected, setOpcionCuotaSelected] = useState(entityInit.opcionCuota);
    const [messageConfirm, setMessageConfirm] = useState({
        show: false,
        title: "",
        data: null,
        callback: null
    });

    useEffect(() => {
        const data = cache[params.processKey];
        if (data) { //el cache tiene datos
            setState(prevState => {
                return {...prevState, idCuenta: data.value.idCuenta, reciboResumido: data.value.reciboResumido, items: data.value.items};
            });
            SearchPagoContadoDefinicionCuenta(data.value.idCuenta, data.value.items);
        }
        else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, "No se pudo recuperar la información de la solicitud");
        }
    }, []);

    useEffect(() => {
        if (pagoContadoDefinicion.id > 0) {
            SearchPagoContadoDefinicionCuotas();
        }
        else {
            setOpcionCuotaSelected(entityInit.opcionCuota);
        }
    }, [pagoContadoDefinicion]);

    const [ generateReporte ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer)
                OpenObjectURL(`${reporte}.pdf`, buffer);
            else
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }
    });

    //handles
    const handleClickVolver = () => {
        dispatch(memoActionDel(params.processKey));
        navigate("../deuda/edit/" + cuenta.id, { replace: true });
    }
    const handleClickCrearPagoContado = () => {
        if (state.idCuenta === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "La cuenta no está definida");
            return;
        }
        if (pagoContadoDefinicion.id === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe seleccionar un plan de pagos");
            return;
        }

        let data = {
            idCuenta: state.idCuenta,
            idPagoContadoDefinicion: pagoContadoDefinicion.id,
            items: state.items
        };
        setMessageConfirm({
            show: true,
            title: "Está seguro de generar el pago contado",
            data: data,
            callback: (data) => AddPagoContado(data)
        });
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
    const callbackSearchPagoContadoDefinicionCuenta = (response) => {
        response.json()
        .then((data) => {
            const definiciones = data.filter(f => f.valid);
            setDefiniciones(definiciones);
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
    const callbackSuccessSearchPagoContadoDefinicionCuotas = (response) => {
        response.json()
        .then((opcionCuotas) => {
            setOpcionCuotaSelected(opcionCuotas[0]);
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
    const callbackSuccessAddPagoContado = (response) => {
        response.json()
        .then((data) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Pago Contado generado correctamente", () => {
                handleClickVolver();
            });
            setState(prevState => {
                return {...prevState, loading: false};
            });
            PrintRecibo(data.idCuentaPago);
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
    function PrintRecibo(idCuentaPago) {
        const paramsReporte = {
            idCuentaPago: idCuentaPago,
            reciboResumido: state.reciboResumido
        }
        generateReporte("CuentaCorrientePagoContado", paramsReporte);
    }
    function SearchPagoContadoDefinicionCuenta(idCuenta, items) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const dataBody = {
            items: items
        }
        const paramsUrl = `/cuenta/${idCuenta}`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.PAGO_CONTADO_DEFINICION,
            paramsUrl,
            dataBody,
            callbackSearchPagoContadoDefinicionCuenta,
            callbackNoSuccess,
            callbackError
        );

    }
    function SearchPagoContadoDefinicionCuotas() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const dataBody = {
            idCuenta: state.idCuenta,
            items: state.items
        }
        const paramsUrl = `/${pagoContadoDefinicion.id}/cuotas`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.PAGO_CONTADO_DEFINICION,
            paramsUrl,
            dataBody,
            callbackSuccessSearchPagoContadoDefinicionCuotas,
            callbackNoSuccess,
            callbackError
        );

    }
    function AddPagoContado(data) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const dataBody = data;

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.PAGO_CONTADO,
            null,
            dataBody,
            callbackSuccessAddPagoContado,
            callbackNoSuccess,
            callbackError
        );

    }
    
    return (
    <>

        <Loading visible={state.loading}></Loading>

        {messageConfirm.show && 
            <MessageModal
                title={"Confirmación"}
                message={messageConfirm.title}
                onDismiss={() => {
                    setMessageConfirm({ show: false, title: "", data: null, callback: null });
                }}
                onConfirm={() => {
                    if (messageConfirm.callback) {
                        messageConfirm.callback(messageConfirm.data);
                    }
                    setMessageConfirm({ show: false, title: "", data: null, callback: null });
                }}
            />
        }

        <SectionHeading title={<>Pago Contado</>} />

        <section className='section-accordion'>

            <div className='row form-basic m-top-10 m-bottom-20'>
                <div className="col-12 col-lg-4">
                    <label htmlFor="cuenta" className="form-label">Cuenta</label>
                    <InputCuenta
                        name="cuenta"
                        placeholder=""
                        className="form-control"
                        value={state.idCuenta}
                        onUpdate={({target}) => {
                            const cuenta = target.row;
                            if (cuenta) {
                                setCuenta(cuenta);
                            }
                            else {
                                setCuenta(entityInit.cuenta);
                            }
                        }}
                        disabled={true}
                    />
                </div>
                <div className="col-12 col-lg-8">
                    <label htmlFor="pagoContadoDefinicion" className="form-label">Convenio</label>
                    <InputStaticEntidad
                        name="pagoContadoDefinicion"
                        placeholder=""
                        className="form-control"
                        value={pagoContadoDefinicion.id}
                        title="Convenio"
                        onChange={({target}) => {
                            const definicion = target.row;
                            if (definicion) {
                                setPagoContadoDefinicion(definicion);
                            }
                            else {
                                setPagoContadoDefinicion(entityInit.pagoContadoDefinicion);
                            }
                        }}
                        onFormat={(row) => (row && row.id)
                                            ? (row.tipoPlanPago.convenio.length > 0)
                                                ? `${row.descripcion} (Convenio: ${row.tipoPlanPago.convenio})`
                                                : row.descripcion
                                            : ''}
                        columns={[
                            { Header: 'Código', accessor: 'codigo', width: '25%' },
                            { Header: 'Descripción', accessor: 'descripcion', width: '70%' }
                        ]}
                        list={definiciones}
                        disabled={state.disbled}
                    />
                </div>
            </div>

            {pagoContadoDefinicion.id > 0 &&
            <div className='row m-top-10 m-bottom-20'>
                <div className="col-12 col-lg-6">

                    <div className='row m-top-20'>
                        <div className="col-12 col-lg-6">
                            <label htmlFor="importeCapital" className="form-label">Deuda Actualizada ($)</label>
                            <InputNumber
                                name="importeCapital"
                                placeholder=""
                                className="form-control"
                                value={ opcionCuotaSelected.importeCapital }
                                precision={2}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className='row m-top-10'>
                        <div className="col-12 col-lg-6">
                            <label htmlFor="importeQuita" className="form-label">(-) Total Quita ($)</label>
                            <InputNumber
                                name="importeQuita"
                                placeholder=""
                                className="form-control"
                                value={ opcionCuotaSelected.importeQuita }
                                precision={2}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className='row m-top-10'>
                        <div className="col-12 col-lg-6">
                            <label htmlFor="importePlanPago" className="form-label">Monto de Pago Contado ($)</label>
                            <InputNumber
                                name="importePlanPago"
                                placeholder=""
                                className="form-control"
                                value={ opcionCuotaSelected.importePlanPago }
                                precision={2}
                                disabled={true}
                            />
                        </div>
                    </div>

                </div>

            </div>
            }

        </section>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
                {!state.disbled &&
                <button className="btn action-button float-end m-left-10" onClick={ (event) => handleClickCrearPagoContado() }>Crear Pago Contado</button>
                }
            </div>
        </footer>
        
    </>
    )
}

export default PagoContadoView;
