import React, { useState, useEffect } from 'react';
import { number, func } from 'prop-types';
import { TableCustom, Loading, InputNumber } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import ShowToastMessage from '../../../utils/toast';
import { getFormatNumber, roundTo } from '../../../utils/convert';


const CuentaPlanePagoModal = (props) => {

    //variables
    const entityInit = {
        tipoPlanPago: {
            id: 0,
            codigo: "",
            nombre: "",
            idTipoTributo: 0,
            convenio: "",
            condiciones: ""
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
                codigo: "",
                nombre: "",
                idTipoTributo: 0,
                convenio: "",
                condiciones: ""
            }
        },
        planPago: {
            id: 0,
            idTipoPlanPago: 0,
            idTipoTributo: 0,
            idSubTasaPlanPago: 0,
            idSubTasaInteres: 0,
            idSubTasaSellados: 0,
            idSubTasaGastosCausidicos: 0,
            codigo: "",
            descripcion: "",
            numero: 0,
            idPlanPagoDefinicion: 0,
            idTributo: 0,
            idCuenta: 0,
            idTipoVinculoCuenta: 0,
            idVinculoCuenta: 0,
            importeNominal: 0,
            importeAccesorios: 0,
            importeCapital: 0,
            importeIntereses: 0,
            importeSellados: 0,
            importeGastosCausidicos: 0,
            importeQuita: 0,
            importeQuitaDevengar: 0,
            importePlanPago: 0,
            idUsuarioFirmante: 0,
            idUsuarioRegistro: 0,
            fechaRegistro: null,
            tipoPlanPago: {
                id: 0,
                codigo: "",
                nombre: "",
                idTipoTributo: 0,
                convenio: "",
                condiciones: ""
            }
        },
        planPagoCuotas: []
    }

    //hooks
    const [state, setState] = useState({
        idPlanPago: 0,
        entity: entityInit,
        loading: false
    });
    const [showPagadoDetalle, setShowPagadoDetalle] = useState(false);
    const [showSaldoDetalle, setShowSaldoDetalle] = useState(false);
    const [columnsPagadoDetalle, setColumnsPagadoDetalle] = useState([]);
    const [columnsSaldoDetalle, setColumnsSaldoDetalle] = useState([]);

    const mount = () => {
        if(props.idPlanPago > 0) {
            setState(prevState => {
                return {...prevState,
                    idPlanPago: props.idPlanPago
                };
            });

            FindPlanPago(props.idPlanPago);
        }
    }
    useEffect(mount, [props.idPlanPago]);

    const cellPagado = (props) =>   <div className='action'>
                                        Acumulado
                                        <div onClick={ (event) => setShowPagadoDetalle(!showPagadoDetalle) } className="link">
                                        {(showPagadoDetalle) ?
                                            <i className="fa fa-minus" title="ocultar detalle de monto acumulado"></i>
                                            :
                                            <i className="fa fa-plus" title="mostrar detalle de monto acumulado"></i>
                                        }
                                        </div>
                                    </div>
    const cellSaldo = (props) =>    <div className='action'>
                                        Saldo
                                        <div onClick={ (event) => setShowSaldoDetalle(!showSaldoDetalle) } className="link">
                                        {(showSaldoDetalle) ?
                                            <i className="fa fa-minus" title="ocultar detalle de monto saldo"></i>
                                            :
                                            <i className="fa fa-plus" title="mostrar detalle de monto saldo"></i>
                                        }
                                        </div>
                                    </div>

    useEffect(() => {
        const columns = (showPagadoDetalle) ? [
            { Header: 'Acum. Cap.', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeAcumuladoCapital', width: '10%', alignCell: 'right', disableSortBy: true },
            { Header: 'Acum. Int', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeAcumuladoIntereses', width: '10%', alignCell: 'right', disableSortBy: true }
        ] : [];
        setColumnsPagadoDetalle(columns);
    }, [showPagadoDetalle])

    useEffect(() => {
        const columns = (showSaldoDetalle) ? [
            { Header: 'Saldo Cap.', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeSaldoCapital', width: '10%', alignCell: 'right', disableSortBy: true },
            { Header: 'Saldo Int.', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeSaldoIntereses', width: '10%', alignCell: 'right', disableSortBy: true }
        ] : [];
        setColumnsSaldoDetalle(columns);
    }, [showSaldoDetalle])

    const tableColumnsCuotas = [
        { Header: 'Nro. Cuota', Cell: (props) => (props.value === 0) ? "Anticipo" : props.value, accessor: 'numero', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: 'Monto Cuota', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeFinal', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: 'Capital', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeCapital', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: 'Intereses', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeIntereses', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: cellPagado, Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeAcumulado', width: '10%', alignCell: 'right', disableSortBy: true },
        ...columnsPagadoDetalle,
        { Header: cellSaldo, Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeSaldo', width: '10%', alignCell: 'right', disableSortBy: true },
        ...columnsSaldoDetalle
    ];

    //handles


    // funciones
    function FindPlanPago(idPlanPago) {
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${idPlanPago}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PLAN_PAGO,
            paramsUrl,
            null,
            callbackSuccessFindPlanPago,
            callbackNoSuccess,
            callbackError
        );
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
    const callbackSuccessFindPlanPago = (response) => {
        response.json()
        .then((data) => {
            data.planPagoDefinicion.fechaDesde = new Date(data.planPagoDefinicion.fechaDesde);
            data.planPagoDefinicion.fechaHasta = new Date(data.planPagoDefinicion.fechaHasta);
            data.planPagoDefinicion.fechaDesdeAlcanceTemporal = new Date(data.planPagoDefinicion.fechaDesdeAlcanceTemporal);
            data.planPagoDefinicion.fechaHastaAlcanceTemporal = new Date(data.planPagoDefinicion.fechaHastaAlcanceTemporal);
            data.planPagoDefinicion.fechaCreacion = new Date(data.planPagoDefinicion.fechaCreacion);
            data.planPago.fechaRegistro = new Date(data.planPago.fechaRegistro);

            let importeAcumulado = 0;
            let importeAcumuladoCapital = 0;
            let importeAcumuladoIntereses = 0;
            
            data.planPago.imoprteTotal = (data.planPago.importePlanPago + data.planPago.importeSellados);
            data.planPagoCuotas.forEach((item, index) => {
                if (item.fechaVencimiento) item.fechaVencimiento = new Date(item.fechaVencimiento);
                importeAcumulado += (item.importeCuota - item.importeSellados);
                importeAcumuladoCapital += item.importeCapital;
                importeAcumuladoIntereses = item.importeIntereses;
                
                item.importeAcumulado = roundTo(importeAcumulado);
                item.importeAcumuladoCapital = roundTo(importeAcumuladoCapital);
                item.importeAcumuladoIntereses = roundTo(importeAcumuladoIntereses);
                item.importeSaldo =  roundTo(data.planPago.importePlanPago - item.importeAcumulado);
                item.importeSaldoCapital =  roundTo(data.planPago.importeCapital - data.planPago.importeQuita - item.importeAcumuladoCapital);
                item.importeSaldoIntereses = roundTo(item.importeSaldo - item.importeSaldoCapital);
                
                item.importeFinal = roundTo(item.importeCuota - item.importeSellados);
            });

            setState(prevState => {
                return {...prevState, loading: false, entity: data};
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


    return (
    <>
        <Loading visible={state.loading}></Loading>

        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-xl">
            <div className="modal-content animated fadeIn">
                <div className="modal-header">
                    <h2 className="modal-title">Detalle de Plan de Pago</h2>
                </div>
                <div className="modal-body">

                    <div className='row m-top-10 m-bottom-20'>
                        <div className="col-12">

                            <div className='row'>
                                <div className="col-12 col-lg-6">
                                    <label htmlFor="importeCapital" className="form-label">Deuda Nominal ($)</label>
                                    <InputNumber
                                        name="importeCapital"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.planPago.importeNominal }
                                        precision={2}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className='row m-top-20'>
                                <div className="col-12 col-lg-6">
                                    <label htmlFor="importeCapital" className="form-label">Accesorios ($)</label>
                                    <InputNumber
                                        name="importeCapital"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.planPago.importeAccesorios }
                                        precision={2}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 col-lg-6">
                                    <label htmlFor="importeCapital" className="form-label">Sellados ($)</label>
                                    <InputNumber
                                        name="importeCapital"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.planPago.importeSellados }
                                        precision={2}
                                        disabled={true}
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
                                        value={ state.entity.planPago.importeCapital }
                                        precision={2}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 col-lg-6">
                                    <label htmlFor="importeCapital" className="form-label">Anticipo ($)</label>
                                    <InputNumber
                                        name="importeCapital"
                                        placeholder=""
                                        className="form-control"
                                        value={ (state.entity.planPagoCuotas.length > 0 && state.entity.planPagoCuotas[0].numero === 0) ?
                                                 state.entity.planPagoCuotas[0].importeCapital : 0.00
                                        }
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
                                        value={ state.entity.planPago.importeQuita }
                                        precision={2}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 col-lg-6">
                                    <label htmlFor="importeCapital" className="form-label">Cantidad de Cuotas</label>
                                    <InputNumber
                                        name="importeCapital"
                                        placeholder=""
                                        className="form-control"
                                        value={ (state.entity.planPagoCuotas.length > 0 && state.entity.planPagoCuotas[0].numero === 0) ?
                                                 state.entity.planPagoCuotas.length - 1 : state.entity.planPagoCuotas.length
                                        }
                                        precision={0}
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
                                        value={ state.entity.planPago.importeIntereses }
                                        precision={2}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 col-lg-6">
                                    <label htmlFor="importeCapital" className="form-label">Monto por Cuota ($)</label>
                                    <InputNumber
                                        name="importeCapital"
                                        placeholder=""
                                        className="form-control"
                                        value={ (state.entity.planPagoCuotas.length > 1 && state.entity.planPagoCuotas[0].numero === 0) ?
                                                 state.entity.planPagoCuotas[1].importeCuota : 0.00
                                        }
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
                                        value={ state.entity.planPago.importePlanPago }
                                        precision={2}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 col-lg-6">
                                    <label htmlFor="importePlanPago" className="form-label">Monto Total ($)</label>
                                    <InputNumber
                                        name="importePlanPago"
                                        placeholder=""
                                        className="form-control"
                                        value={ state.entity.planPago.imoprteTotal }
                                        precision={2}
                                        disabled={true}
                                    />
                                </div>
                            </div>

                            <div className='row m-top-20'>
                                <div className="col-12">
                                    <label className="form-label">Cuotas del Plan de Pagos</label>
                                    <TableCustom
                                        showFooter={false}
                                        showPagination={false}
                                        showFilterGlobal={false}
                                        className={'TableCustomBase'}
                                        columns={tableColumnsCuotas}
                                        data={state.entity.planPagoCuotas}
                                    />
                                </div>
                            </div>
                            {/* 
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
                            */}

                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                    <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Salir</button>
                </div>
            </div>
        </div>
        </div>

    </>
    );
}

CuentaPlanePagoModal.propTypes = {
    idPlanPago: number.isRequired,
    onDismiss: func.isRequired
  };

export default CuentaPlanePagoModal;