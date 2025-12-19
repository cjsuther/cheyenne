import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { useForm } from '../../components/hooks/useForm';
import { useDispatch, useSelector } from 'react-redux';
import { memoActionDel } from '../../context/redux/actions/memoAction';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, InputCuenta, InputNumber, InputStaticEntidad } from '../../components/common';
import { getDateNow, getFormatNumber } from '../../utils/convert';
import { CloneObject } from '../../utils/helpers';
import { useLista } from '../../components/hooks/useLista';
import EmisionPlanPagoGrid from '../../components/controls/EmisionPlanPagoGrid';
import { useEntidad } from '../../components/hooks/useEntidad';


function PlanPagoView() {

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
        planPagoDefinicion: {
            id: 0,
            idEstadoPlanPagoDefinicion: 0,
            idTipoPlanPago: 0,
            idTipoTributo: 0,
            idTasaPlanPago: 0,
            idSubTasaPlanPago: 0,
            idTasaInteres: 0,
            idSubTasaInteres: 0,
            idTasaSellados: 0,
            idSubTasaSellados: 0,
            idTasaGastosCausidicos: 0,
            idSubTasaGastosCausidicos: 0,
            codigo: "",
            descripcion: "",
            fechaDesde: null,
            fechaHasta: null,
            tieneAnticipo: false,
            cuotaDesde: 0,
            cuotaHasta: 0,
            peridiocidad: 0,
            idTipoVencimientoAnticipo: 0,
            idTipoVencimientoCuota1: 0,
            idTipoVencimientoCuotas: 0,
            porcentajeAnticipo: 0,
            idTipoAlcanceTemporal: 0,
            fechaDesdeAlcanceTemporal: null,
            fechaHastaAlcanceTemporal: null,
            mesDesdeAlcanceTemporal: 0,
            mesHastaAlcanceTemporal: 0,
            aplicaDerechosEspontaneos: false,
            aplicaCancelacionAnticipada: false,
            aplicaTotalidadDeudaAdministrativa: false,
            aplicaDeudaAdministrativa: false,
            aplicaDeudaLegal: false,
            aplicaGranContribuyente: false,
            aplicaPequenioContribuyente: false,
            caducidadAnticipoImpago: false,
            caducidadCantidadCuotasConsecutivas: 0,
            caducidadCantidadCuotasNoConsecutivas: 0,
            caducidadCantidadDiasVencimiento: 0,
            caducidadCantidadDeclaracionesJuradas: 0,
            montoDeudaAdministrativaDesde: 0,
            montoDeudaAdministrativaHasta: 0,
            montoCuotaDesde: 0,
            montoCuotaHasta: 0,
            idTipoCalculoInteres: 0,
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
        idPlanPago: 0,
        items: [],
        loading: false,
        showResumen: false,
        disbled: false
    });
    const [cuenta, setCuenta] = useState(entityInit.cuenta);
    const [planPagoDefinicion, setPlanPagoDefinicion] = useState(entityInit.planPagoDefinicion);
    const [definiciones, setDefiniciones] = useState([]);
    const [tipoVinculoCuentaPermitidos, setTipoVinculoCuentaPermitidos] = useState([]);
    const [opcionCuotas, setOpcionCuotas] = useState([]);
    const [opcionCuotaSelected, setOpcionCuotaSelected] = useState(entityInit.opcionCuota);
    const [cuotas, setCuotas] = useState([]);
    const [vinculosCuenta, setVinculosCuenta] = useState([]);
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
                return {...prevState, idCuenta: data.value.idCuenta, items: data.value.items};
            });
            SearchPlanPagoDefinicionCuenta(data.value.idCuenta, data.value.items);
        }
        else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, "No se pudo recuperar la información de la solicitud");
        }
    }, []);

    useEffect(() => {
        if (planPagoDefinicion.id > 0) {
            SearchPlanPagoDefinicionCuotas();
        }
        else {
            setOpcionCuotas([]);
            setCuotas([]);
            setOpcionCuotaSelected(entityInit.opcionCuota);
            formSet({
                idTipoVinculoCuenta: 0,
                idVinculoCuenta: 0,
                idUsuarioFirmante: 0
            });
        }
    }, [planPagoDefinicion]);

    const [getListEntidad,] = useEntidad({
        entidades: ['TipoVinculoCuenta'],
        onLoaded: (entidades, isSuccess, error) => {
            if (isSuccess) {
                setState(prevState => ({...prevState}));
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: {
            key: 'TipoVinculoCuenta',
            timeout: 0
        }
    });

    const [, getRowLista] = useLista({
        listas: ['TipoDocumento'],
        onLoaded: (listas, isSuccess, error) => {
            if (isSuccess) {
                setState(prevState => ({...prevState}));
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: {
          key: 'TipoDocumento',
          timeout: 0
        }
    });

    const [formValues, formHandle, , formSet] = useForm({
        idTipoVinculoCuenta: 0,
        idVinculoCuenta: 0,
        idUsuarioFirmante: 0
    });

    //definiciones
    const cellSel = (props) =>      <div className='action-check'>
                                        <input type="radio" value={''} checked={ opcionCuotas[props.value].selected } readOnly={true} />
                                    </div>

    const tableColumnsOpcionCuotas = [
        { Header: '', Cell: cellSel, accessor: 'index', width:'5%', disableGlobalFilter: true, disableSortBy: true},
        { Header: 'Cuotas', accessor: 'cantidadCuotas', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: 'Tot. Capital', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeCapital', width: '16%', alignCell: 'right', disableSortBy: true },
        { Header: 'Intereses', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeIntereses', width: '12%', alignCell: 'right', disableSortBy: true },
        { Header: 'Sellados', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeSellados', width: '12%', alignCell: 'right', disableSortBy: true },
        { Header: 'Anticipo', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeAnticipoTotal', width: '15%', alignCell: 'right', disableSortBy: true },
        { Header: 'Quita', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeQuita', width: '15%', alignCell: 'right', disableSortBy: true },
        { Header: 'Imp. Cuota', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeCuota', width: '15%', alignCell: 'right', disableSortBy: true }
    ];

    const tableColumnsCuotas = [
        { Header: 'Cuota', Cell: (props) => (props.value === 0) ? "Anticipo" : props.value, accessor: 'numeroCuota', width: '15%', alignCell: 'right', disableSortBy: true },
        { Header: 'Imp. Capital', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeCapital', width: '20%', alignCell: 'right', disableSortBy: true },
        { Header: 'Intereses', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeIntereses', width: '20%', alignCell: 'right', disableSortBy: true },
        { Header: 'Sellados', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeSellados', width: '20%', alignCell: 'right', disableSortBy: true },
        { Header: 'Imp. Final', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeCuota', width: '25%', alignCell: 'right', disableSortBy: true }
    ];

    //handles
    const handleClickSelected = (indexSelected) => {
        const list = [...opcionCuotas];
        for (let index=0; index < list.length; index++) {
            list[index].selected = false;
        }
        list[indexSelected].selected = true;
        const opcionCuota =  CloneObject(list[indexSelected]);

        setOpcionCuotas(list);
        setCuotas(opcionCuota.cuotas);
        setOpcionCuotaSelected(opcionCuota);
    }
    const handleClickVolver = () => {
        dispatch(memoActionDel(params.processKey));
        navigate("../deuda/edit/" + cuenta.id, { replace: true });
    }
    const handleClickCrearPlanPago = () => {
        if (state.idCuenta === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "La cuenta no está definida");
            return;
        }
        if (planPagoDefinicion.id === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe seleccionar un plan de pagos");
            return;
        }
        if (formValues.idTipoVinculoCuenta === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe seleccionar el tipo de relación");
            return;
        }
        if (formValues.idVinculoCuenta === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe seleccionar un solicitante");
            return;
        }

        let data = {
            idCuenta: state.idCuenta,
            idPlanPagoDefinicion: planPagoDefinicion.id,
            idTipoVinculoCuenta: formValues.idTipoVinculoCuenta,
            idVinculoCuenta: formValues.idVinculoCuenta,
            cantidadCuotas: opcionCuotaSelected.cantidadCuotas,
            items: state.items
        };
        setMessageConfirm({
            show: true,
            title: "Está seguro de generar el plan de pagos",
            data: data,
            callback: (data) => AddPlanPago(data)
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
    const callbackSearchPlanPagoDefinicionCuenta = (response) => {
        response.json()
        .then((data) => {
            const definiciones = data.filter(f => f.valid);
            setDefiniciones(definiciones);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackSuccessSearchPlanPagoDefinicionCuotas = (response) => {
        response.json()
        .then((data) => {
            if (data.opcionCuotas.length > 0) {
                data.opcionCuotas.forEach((opcionCuota, index) => {
                    opcionCuota.importeAnticipoTotal = (opcionCuota.importeAnticipo + opcionCuota.importeSellados);
                    opcionCuota.index = index;
                    opcionCuota.selected = (index === 0);
                });

                setTipoVinculoCuentaPermitidos(data.tiposVinculoCuenta.map(x => x.idTipoVinculoCuenta));
                setOpcionCuotas(data.opcionCuotas);
                setCuotas(data.opcionCuotas[0].cuotas);
                setOpcionCuotaSelected(data.opcionCuotas[0]);

                formSet({
                    idTipoVinculoCuenta: planPagoDefinicion.idTipoVinculoCuentaPredeterminado,
                    idVinculoCuenta: 0,
                    idUsuarioFirmante: 0
                });
            }
            else {
                const message = 'No hay opciones disponibles para el monto seleccionado';
                ShowToastMessage(ALERT_TYPE.ALERT_WARNING, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            }

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
    const callbackSuccessSearchVinculoCuenta = (response) => {
        response.json()
        .then((data) => {
            setVinculosCuenta(data);
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
    const callbackSuccessAddPlanPago = (response) => {
        response.json()
        .then((planPago) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Plan de pagos generado correctamente");
            setState(prevState => {
                return {...prevState, loading: false, disbled: true, idPlanPago: planPago.id, showResumen: true};
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
    function SearchPlanPagoDefinicionCuenta(idCuenta, items) {

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
            APIS.URLS.PLAN_PAGO_DEFINICION,
            paramsUrl,
            dataBody,
            callbackSearchPlanPagoDefinicionCuenta,
            callbackNoSuccess,
            callbackError
        );

    }
    function SearchPlanPagoDefinicionCuotas() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const dataBody = {
            idCuenta: state.idCuenta,
            items: state.items
        }
        const paramsUrl = `/${planPagoDefinicion.id}/cuotas`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.PLAN_PAGO_DEFINICION,
            paramsUrl,
            dataBody,
            callbackSuccessSearchPlanPagoDefinicionCuotas,
            callbackNoSuccess,
            callbackError
        );

    }
    function SearchVinculoCuenta(idTipoTributo, idTributo) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/tributo/${idTipoTributo}/${idTributo}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.VINCULO_CUENTA,
            paramsUrl,
            null,
            callbackSuccessSearchVinculoCuenta,
            callbackNoSuccess,
            callbackError
        );

    }
    function AddPlanPago(data) {

        setState(prevState => {
        return {...prevState, loading: true};
        });

        const dataBody = data;

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.PLAN_PAGO,
            null,
            dataBody,
            callbackSuccessAddPlanPago,
            callbackNoSuccess,
            callbackError
        );

    }
    
    const getDescTipoDocumento = (id) => {
        const row = getRowLista('TipoDocumento', id);
        return (row) ? row.nombre : '';
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

        {state.showResumen && 
            <EmisionPlanPagoGrid
                idPlanPago={state.idPlanPago}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showResumen: false};
                    });
                    handleClickVolver();
                }}
            />
        }

        <SectionHeading title={<>Planes de Pago</>} />

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
                                SearchVinculoCuenta(cuenta.idTipoTributo, cuenta.idTributo);
                            }
                            else {
                                setCuenta(entityInit.cuenta);
                                setVinculosCuenta([]);
                            }
                        }}
                        disabled={true}
                    />
                </div>
                <div className="col-12 col-lg-8">
                    <label htmlFor="planPagoDefinicion" className="form-label">Convenio</label>
                    <InputStaticEntidad
                        name="planPagoDefinicion"
                        placeholder=""
                        className="form-control"
                        value={planPagoDefinicion.id}
                        title="Convenio"
                        onChange={({target}) => {
                            const definicion = target.row;
                            if (definicion) {
                                setPlanPagoDefinicion(definicion);
                            }
                            else {
                                setPlanPagoDefinicion(entityInit.planPagoDefinicion);
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

            {planPagoDefinicion.id > 0 &&
            <div className='row m-top-10 m-bottom-20'>
                <div className="col-12 col-lg-6">

                    <div className='row'>
                        <div className="col-12">
                            <label className="form-label">Opciones disponibles</label>
                            <TableCustom
                                showFooter={false}
                                showPagination={false}
                                showFilterGlobal={false}
                                className={'TableCustomBase'}
                                columns={tableColumnsOpcionCuotas}
                                data={opcionCuotas}
                                onClickRow={(row, cellId) => {
                                    if (cellId !== "abm" && !state.disbled) {
                                        handleClickSelected(row.index);
                                    }
                                }}
                            />
                        </div>
                    </div>
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
                            <label htmlFor="importeIntereses" className="form-label">(+) Total Intereses ($)</label>
                            <InputNumber
                                name="importeIntereses"
                                placeholder=""
                                className="form-control"
                                value={ opcionCuotaSelected.importeIntereses }
                                precision={2}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className='row m-top-10'>
                        <div className="col-12 col-lg-6">
                            <label htmlFor="importePlanPago" className="form-label">Monto del Plan de Pagos ($)</label>
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
                <div className="col-12 col-lg-6">

                    <div className='row'>
                        <div className="col-12">
                            <label className="form-label">Cuotas del Plan de Pagos</label>
                            <TableCustom
                                showFooter={false}
                                showPagination={false}
                                showFilterGlobal={false}
                                className={'TableCustomBase'}
                                columns={tableColumnsCuotas}
                                data={cuotas}
                            />
                        </div>
                    </div>
                    <div className='row m-top-20'>
                        <div className="col-12 col-lg-6 m-top-10">
                            <label htmlFor="idTipoVinculoCuenta" className="form-label">Relación</label>
                            <select
                                name="idTipoVinculoCuenta"
                                placeholder=""
                                className={`input-lista form-control`}
                                value={formValues.idTipoVinculoCuenta}
                                onChange={formHandle}
                                disabled={state.disbled}
                            >
                                <option value={0}></option>
                                {getListEntidad('TipoVinculoCuenta').filter(f => tipoVinculoCuentaPermitidos.includes(f.id)).map((item, index) =>
                                <option value={item.id} key={index}>
                                    {item.nombre}
                                </option>
                                )}
                            </select>
                        </div>
                        <div className="col-12 col-lg-6 m-top-10">
                            <label htmlFor="idVinculoCuenta" className="form-label">Solicitante</label>
                            <select
                                name="idVinculoCuenta"
                                placeholder=""
                                className={`input-lista form-control`}
                                value={formValues.idVinculoCuenta}
                                onChange={formHandle}
                                disabled={state.disbled}
                            >
                                <option value={0}></option>
                                {vinculosCuenta.filter(f => f.idTipoVinculoCuenta === formValues.idTipoVinculoCuenta).map((item, index) =>
                                <option value={item.id} key={index}>
                                    {`${item.nombrePersona} (${getDescTipoDocumento(item.idTipoDocumento)} ${item.numeroDocumento})`}
                                </option>
                                )}
                            </select>
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
                <button className="btn action-button float-end m-left-10" onClick={ (event) => handleClickCrearPlanPago() }>Crear Plan de Pagos</button>
                }
            </div>
        </footer>
        
    </>
    )
}

export default PlanPagoView;
