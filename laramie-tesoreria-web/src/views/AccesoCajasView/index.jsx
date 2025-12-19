import { useEffect, useMemo, useRef, useState } from "react"
import { useForm, useLista, useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { InputEntidad, InputNumber, InputUsuario, SectionHeading, TableCustom } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { getDateNow, getDateToString, getFormatNumber, getNumeroRecibo_ObjectToString } from "../../utils/convert"
import { CloneObject, GetValuesResumen } from "../../utils/helpers"
import { getAccess } from "../../utils/access"
import { ESTADO_CAJA } from "../../consts/estadoCaja"
import { TIPO_MOVIMIENTO_CAJA } from "../../consts/tipoMovimientoCaja"
import MovimientoCajaModal from "../../components/controls/MovimientoCajaModal"
import CobranzaCajaModal from "../../components/controls/CobranzaCajaModal"
import { isValidNumber } from "../../utils/validator"
import { printTicket } from "../../utils/printTicket"
import { useReporte } from "../../components/hooks/useReporte"
import PagoRecibosModal from "../../components/controls/PagoRecibosModal"
import MovimientosCajaDetalleModal from "../../components/controls/MovimientosCajaDetalleModal"


const cajaDtoInit = {
    caja: {
        id: 0,
        codigo: '',
        nombre: '',
        orden: 0,
        idDependencia: 0,
        idEstadoCaja: 0,
        idUsuarioActual: 0,
        idCajaAsignacionActual: 0,
        idRecaudadora: 0
    },
    asignacion: {
        id: 0,
        idCaja: 0,
        idUsuario: 0,
        fechaApertura: null,
        fechaCierre: null,
        importeSaldoInicial: 0,
        importeSaldoFinal: 0,
        idRecaudacionLote: 0
    },
    movimientos: []
}
const aperturaInit = {
    idDependencia: 0,
    idCaja: 0,
    saldoActual: 0
}
const cobranzaInit = {
    codigoBarras: '',
    efectivo: 0,
    tarjetaCredito: 0,
    tarjetaDebito: 0,
    cheque: 0,
    transferencia: 0,
    cobranzas: 0,
    saldoInicial: 0,
    ingresos: 0,
    retiros: 0,
    saldoFinal: 0
}

const AccesoCajasView = () => {
    const { setIsLoading, showMessageModal } = useManagedContext()

    const inputCodigoBarrasRef = useRef(null);

    const [state, setState] = useState({
        idUsuarioLogin: 0
    })
    const [recibos, setRecibos] = useState([])
    const [mediosPagos, setMediosPagos] = useState([])
    const [cajaResumen, setCajaResumen] = useState(cajaDtoInit)
    const [apertura_formValues, , apertura_formReset, apertura_formSet ] = useForm(aperturaInit, "apertura_")
    const [formValues, formHandle, , formSet ] = useForm(cobranzaInit)

    const [showAperturaCaja, setShowAperturaCaja] = useState(false)
    const [showCobranzaCaja, setShowCobranzaCaja] = useState(false)
    const [showPagoRecibos, setShowPagoRecibos] = useState(false)
    const [showMovimientoCaja, setShowMovimientoCaja] = useState(false)
    const [showMovimientoCajaDetalle, setShowMovimientoCajaDetalle] = useState(false)
    const [idMovimientoCajaDetalle, setIdMovimientoCajaDetalle] = useState(0)
    const [idTipoMovimientoCaja, setIdTipoMovimientoCaja] = useState(0)
    const [accordions, setAccordions] = useState({
        cobranzas: true,
        movimientos: false,
        resumen: false
    })

    useEffect(() => {
        const access = getAccess();
        setState(prevState => {
            return {...prevState, idUsuarioLogin: access.idUsuario};
        });
    }, []);

    useEffect(() => {
        if (state.idUsuarioLogin > 0) {
            FindCaja_UsuarioLogin();
        }
    }, [state.idUsuarioLogin]);

    useEffect(() => {

        const {
            efectivo,
            tarjetaCredito,
            tarjetaDebito,
            cheque,
            transferencia,
            cobranzas,
            saldoInicial,
            ingresos,
            retiros,
            saldoFinal
        } = GetValuesResumen(cajaResumen.asignacion.importeSaldoInicial, cajaResumen.movimientos)

        formSet({...formValues,
            efectivo: efectivo,
            tarjetaCredito: tarjetaCredito,
            tarjetaDebito: tarjetaDebito,
            cheque: cheque,
            transferencia: transferencia,
            cobranzas: cobranzas,
            saldoInicial: saldoInicial,
            ingresos: ingresos,
            retiros: retiros,
            saldoFinal: saldoFinal
        })

    }, [cajaResumen])

    const [, getRowLista ] = useLista({
        listas: ['TipoMovimientoCaja','MedioPago'],
        onLoaded: (_, isSuccess, error) => {
          if (!isSuccess) ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error)
        },
        memo: {
          key: 'TipoMovimientoCaja_MedioPago',
          timeout: 0
        }
    })

    const [ generateReporte, ] = useReporte({
        callback: (reporte, data, message) => {
            if (data) {
                printTicket(data)
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message)
            }
        },
        mode: 'json'
    })

    
    const FindCaja_UsuarioLogin = () => {
        setIsLoading(true)

        const paramsUrl = `/usuario/login`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            null,
            res => res.json().then(caja => {
                if (caja.id > 0) {
                    FindCaja_Resumen(caja.id, (cajaDto) => {
                        setCajaResumen(cajaDto)
                    })
                }
                else {
                    setShowAperturaCaja(true)
                }
                setIsLoading(false)
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }
    const FindCaja_Resumen = (idCaja, callbackSuccess) => {
        setIsLoading(true)

        const paramsUrl = `/resumen/${idCaja}`

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            null,
            res => res.json().then(cajaDto => {
                callbackSuccess(cajaDto);
                setIsLoading(false)
                if (inputCodigoBarrasRef.current) inputCodigoBarrasRef.current.focus()
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }
    const FindRecibo = () => {
        let codigoDelegacion = "";
        let numeroRecibo = "";
        let paramsUrl = "";

        const codigoBarrasCliente = formValues.codigoBarras;
        if (codigoBarrasCliente.length === 13) {
            codigoDelegacion = parseInt(codigoBarrasCliente.substring(0,3))
            numeroRecibo = parseInt(codigoBarrasCliente.substring(3,15))
            paramsUrl = `/recibo/numero/${codigoDelegacion}/${numeroRecibo}`
        }
        else if (codigoBarrasCliente.length > 0) {
            paramsUrl = `/recibo/codigo-barras-cliente/${codigoBarrasCliente}`
        }
        else {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe completar el código de barras')
            return;
        }

        setIsLoading(true)

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.RECIBO_PUBLICACION_LOTE,
            paramsUrl,
            null,
            res => res.json().then(recibo => {
                recibo.fechaVencimiento1 = new Date(recibo.fechaVencimiento1)
                recibo.fechaVencimiento2 = new Date(recibo.fechaVencimiento2)
                const fechaCobro = getDateNow(false)
                if (recibos.filter(f => f.id === recibo.id).length > 0) {
                    ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El recibo ya fue ingresado')
                }
                else if (fechaCobro.getTime() > recibo.fechaVencimiento2.getTime()) {
                    ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'El recibo está vencido')
                }
                else {
                    const data = [...recibos, recibo]
                    setRecibos(data)
                }
                formSet({...formValues, codigoBarras: ''})
                setIsLoading(false)
                if (inputCodigoBarrasRef.current) inputCodigoBarrasRef.current.focus()
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
                if (inputCodigoBarrasRef.current) inputCodigoBarrasRef.current.focus()
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }
    const AbrirCaja = () => {

        setIsLoading(true)

        const paramsUrl = `/apertura/${apertura_formValues.idCaja}`
        const dataBody = {
            idUsuario: state.idUsuarioLogin
        }

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            dataBody,
            res => res.json().then(({idCajaAsignacion}) => {
                FindCaja_Resumen(apertura_formValues.idCaja, (cajaDto) => {
                    setCajaResumen(cajaDto)
                })
                setShowAperturaCaja(false);
                setIsLoading(false)
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }
    const CerrarCaja = () => {

        setIsLoading(true)

        const paramsUrl = `/cierre/${cajaResumen.caja.id}`

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            null,
            res => res.json().then(({idCajaAsignacion}) => {
                emitirCajaCierre(idCajaAsignacion)
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, 'Cierre de caja exitoso')
                setCajaResumen(cajaDtoInit)
                setRecibos([])
                apertura_formReset()
                setIsLoading(false)
                setShowAperturaCaja(true)
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }
    const BorrarMovimiento = (idMovimientoCaja) => {

        setIsLoading(true)

        const paramsUrl = `/movimiento/${idMovimientoCaja}`

        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.CAJA,
            paramsUrl,
            null,
            res => res.json().then(({idCajaAsignacion}) => {
                setRecibos([])
                setMediosPagos([])
                FindCaja_Resumen(cajaResumen.caja.id, (cajaDto) => setCajaResumen(cajaDto))
            }),
            res => {
                onRequestNoSuccess(res)
                setIsLoading(false)
            },
            err => {
                onRequestError(err)
                setIsLoading(false)
            },
        )
    }

    const confirmRemoveRecibo = (id) => {
        setRecibos(prev => prev.filter(x => x.id !== id))
    }
    const confirmRemoveMedioPago = (id) => {
        setMediosPagos(prev => prev.filter(x => x.id !== id))
    }
    const confirmRemoveMovimientoCaja = (id) => {
        BorrarMovimiento(id);
    }

    const handlePagarRecibos = () => {
        if (recibos.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar recibos para cobrar primero')
            return
        }
        setShowPagoRecibos(true)
    }
    const handleCobrarRecibos = () => {
        if (recibos.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar recibos para cobrar primero')
            return
        }
        setShowCobranzaCaja(true)
    }
    const handleIngresar = () => {
        setIdTipoMovimientoCaja(TIPO_MOVIMIENTO_CAJA.INGRESO)
        setShowMovimientoCaja(true)
    }
    const handleRetirar = () => {
        setIdTipoMovimientoCaja(TIPO_MOVIMIENTO_CAJA.RETIRO)
        setShowMovimientoCaja(true)
    }
    const handleAbrirCaja = () => {
        if (!isValidNumber(apertura_formValues.idCaja, true)) return ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar una caja')

        showMessageModal({
            title: "Confirmación",
            message: "¿Está seguro/a de abrir la caja?",
            onConfirm: () => AbrirCaja(),
        })
    }
    const handleCerrarCaja = () => {
        showMessageModal({
            title: "Confirmación",
            message: "¿Está seguro/a de cerrar la caja?",
            onConfirm: () => CerrarCaja(),
        })
    }

    const emitirCajaCierre = (idCajaAsignacion) => {
        const paramsReporte = {
            idCajaAsignacion: idCajaAsignacion
        }
        generateReporte("CajaCierre", paramsReporte);
    }

    const avmrRecibo = useMemo(() => {
            return mediosPagos.length === 0 ? {
                onRemove: ({ id }) => {
                    showMessageModal({
                        title: "Confirmación",
                        message: "¿Está seguro/a de quitar el recibo?",
                        onConfirm: () => confirmRemoveRecibo(id),
                    })
                }
            } : {}
        }, [mediosPagos]
    )
    const avmrMedioPago = {
        onRemove: ({ id }) => {
            showMessageModal({
                title: "Confirmación",
                message: "¿Está seguro/a de quitar el medio de pago?",
                onConfirm: () => confirmRemoveMedioPago(id),
            })
        }
    }
    const avmrMovimientos = {
        customActions: [
            {
                icon: 'search',
                title: 'Ver detalle del movimiento',
                onClick: ({ id }) => {
                    setIdMovimientoCajaDetalle(id)
                    setShowMovimientoCajaDetalle(true)
                },
                show: ({idTipoMovimientoCaja}) => (idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.COBRANZA)
            },
            {
                icon: 'delete',
                title: 'Borrar movimiento',
                onClick: ({ id }) => {
                    showMessageModal({
                        title: "Confirmación",
                        message: "¿Está seguro/a de borrar el movimiento?",
                        onConfirm: () => confirmRemoveMovimientoCaja(id),
                    })
                },
                show: ({idTipoMovimientoCaja}) => (idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.COBRANZA)
            },
            {
                icon: 'print',
                title: 'Reimprimir Ticket',
                onClick: ({ id }) => {
                    const paramsReporte = {
                        idMovimientoCaja: id
                    }
                    generateReporte("CajaTicket", paramsReporte);
                },
                show: ({idTipoMovimientoCaja}) => (idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.COBRANZA)
            }
        ]
    }

    function ToggleAccordion(accordion) {
        let accordions2 = CloneObject(accordions);
        accordions2[accordion] = !accordions2[accordion];
        setAccordions(accordions2);
    }

    const accordionClose = <span className="material-symbols-outlined search-i">chevron_right</span>
    const accordionOpen = <span className="material-symbols-outlined search-i">expand_more</span>

    return <>
        <SectionHeading titles={[{ title: 'Cajas' }, { title: 'Acceso a cajas' }]} />

        {(showAperturaCaja &&
        <section className='section-accordion'>
            <div className="m-top-20">
                <div className="row form-basic">
                    <div className="col-12 col-md-6">
                        <label htmlFor="apertura_idDependencia" className="form-label">Dependencia</label>
                        <InputEntidad
                            name="apertura_idDependencia"
                            placeholder=""
                            className="form-control"
                            value={apertura_formValues.idDependencia}
                            onChange={({target}) => {
                                if (target.row) {
                                    const idDependencia = parseInt(target.value);
                                    apertura_formSet({...apertura_formValues, idDependencia: idDependencia, idCaja: 0, saldoActual: 0})
                                }
                                else {
                                    apertura_formSet({...apertura_formValues, idDependencia: 0, idCaja: 0, saldoActual: 0})
                                }
                            }}
                            entidad="Dependencia"
                        />
                    </div>
                    <div className="col-6 col-md-3">
                        <label htmlFor="apertura_idCaja" className="form-label">Caja</label>
                        <InputEntidad
                            name="apertura_idCaja"
                            placeholder=""
                            className="form-control"
                            value={apertura_formValues.idCaja}
                            onChange={({target}) => {
                                if (target.row) {
                                    const idCaja = parseInt(target.value);
                                    FindCaja_Resumen(idCaja, (cajaDto) => {
                                        apertura_formSet({...apertura_formValues, idCaja: cajaDto.caja.id, saldoActual: cajaDto.asignacion.importeSaldoFinal})
                                    })
                                }
                                else {
                                    apertura_formSet({...apertura_formValues, idCaja: 0, saldoActual: 0})
                                }
                            }}
                            entidad="Caja"
                            filter={(row) => { return row.idEstadoCaja === ESTADO_CAJA.CERRADA && row.idDependencia === apertura_formValues.idDependencia }}
                            memo={null}
                        />
                    </div>
                    <div className="col-6 col-lg-3">
                        <label htmlFor="apertura_saldoActual" className="form-label">Saldo Actual</label>
                        <InputNumber
                            precision={2}
                            name="apertura_saldoActual"
                            placeholder=""
                            className="form-control"
                            value={apertura_formValues.saldoActual}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
        </section>
        )}

        {(cajaResumen.caja.id > 0 &&
        <section className='section-accordion'>
            <div className="m-top-20">
                <div className="row form-basic">
                    <div className="col-12 col-lg-3">
                        <label htmlFor="nombre" className="form-label">Caja</label>
                        <input
                            name="nombre"
                            placeholder=""
                            className="form-control"
                            value={cajaResumen.caja.nombre}
                            disabled={true}
                        />
                    </div>
                    <div className="col-12 col-lg-5">
                        <label htmlFor="idUsuario" className="form-label">Usuario/a</label>
                        <InputUsuario
                            name="idUsuario"
                            placeholder=""
                            className="form-control"
                            value={cajaResumen.asignacion.idUsuario}
                            disabled={true}
                        />
                    </div>
                    <div className="col-6 col-lg-2">
                        <label htmlFor="fechaApertura" className="form-label">Apertura</label>
                        <input
                            name="fechaApertura"
                            placeholder=""
                            className="form-control"
                            value={getDateToString(cajaResumen.asignacion.fechaApertura,true)}
                            disabled={true}
                        />
                    </div>
                    <div className="col-6 col-lg-2">
                        <label htmlFor="importeSaldoInicial" className="form-label">Saldo inicial</label>
                        <input
                            name="importeSaldoInicial"
                            placeholder=""
                            className="form-control"
                            value={getFormatNumber(cajaResumen.asignacion.importeSaldoInicial,2)}
                            disabled={true}
                        />
                    </div>
                </div>

                <div className='accordion-header m-top-20'>
                    <div className='row'>
                        <div className="col-12" onClick={() => ToggleAccordion('cobranzas')}>
                            <div className='accordion-header-title'>
                                {(accordions.cobranzas) ? accordionOpen : accordionClose}
                                <h3 className={accordions.cobranzas ? 'active' : ''}>Cobranzas</h3>
                            </div>
                        </div>
                    </div>
                </div>
                {(accordions.cobranzas &&
                <div className='accordion-body'>
                <>
                    {(mediosPagos.length === 0) &&
                    <div className="row form-basic">
                        <div className="col-12 col-lg-11 col-md-10">
                            <label htmlFor="codigoBarras" className="form-label">Código de barras</label>
                            <input
                                ref={inputCodigoBarrasRef}
                                name="codigoBarras"
                                placeholder=""
                                className="form-control"
                                value={formValues.codigoBarras}
                                onChange={formHandle}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        FindRecibo()
                                    }
                                }}
                                tabIndex={1}
                            />
                        </div>
                        <div className="col-12 col-lg-1 col-md-2">
                            <button className="btn btn-outline-primary float-end m-top-25" onClick={ (event) => FindRecibo() } tabIndex={2}>Buscar</button>
                        </div>
                    </div>
                    }
                    <TableCustom
                        className={'TableCustomBase m-top-10'}
                        data={recibos}
                        avmr={avmrRecibo}
                        columns={[
                            { Header: 'Cuenta', accessor: 'numeroCuenta', width: '15%' },
                            { Header: 'Número', Cell: ({ row }) => getNumeroRecibo_ObjectToString(row.original), accessor: 'numeroRecibo', width: '15%' },
                            { Header: 'Periodo', accessor: 'periodo', width: '7%' },
                            { Header: 'Cuota', accessor: 'cuota', width: '7%' },
                            { Header: 'Fecha 1° Vto.', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaVencimiento1', width: '13%' },
                            { Header: 'Imp. 1° Vto.', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeVencimiento1', width: '13%', alignCell: 'right' },
                            { Header: 'Fecha 2° Vto.', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaVencimiento2', width: '13%' },
                            { Header: 'Imp. 2° Vto.', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeVencimiento2', width: '13%', alignCell: 'right' },
                        ]}
                        showDownloadCSV={false}
                        showFilterGlobal={false}
                    />
                    <div className="row form-basic m-top-30">
                        <div className="col-12">
                            <button className="btn btn-outline-primary float-end" onClick={ (event) => handlePagarRecibos() } tabIndex={3}>Ingresar medio de pago</button>
                        </div>
                    </div>
                    <TableCustom
                        className={'TableCustomBase m-top-10'}
                        data={mediosPagos}
                        avmr={avmrMedioPago}
                        columns={[
                            { Header: 'Medio de pago', accessor: 'idMedioPago', width: '30%', Cell: ({ value }) => getRowLista('MedioPago', value)?.nombre ?? '' },
                            { Header: 'Entidad', accessor: 'bancoMedioPago', width: '25%' },
                            { Header: 'Número', accessor: 'numeroMedioPago', width: '25%' },
                            { Header: 'Importe de pago', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeCobro', width: '20%', alignCell: 'right' }
                        ]}
                        showDownloadCSV={false}
                        showFilterGlobal={false}
                    />
                    <div className="row form-basic m-top-30">
                        <div className="col-12">
                            <button className="btn action-button float-end" onClick={ (event) => handleCobrarRecibos() } tabIndex={4}>Cobrar</button>
                        </div>
                    </div>
                </>
                </div>
                )}

                <div className='accordion-header m-top-10'>
                    <div className='row'>
                        <div className="col-12" onClick={() => ToggleAccordion('movimientos')}>
                            <div className='accordion-header-title'>
                                {(accordions.movimientos) ? accordionOpen : accordionClose}
                                <h3 className={accordions.movimientos ? 'active' : ''}>Movimientos</h3>
                            </div>
                        </div>
                    </div>
                </div>
                {(accordions.movimientos &&
                <div className='accordion-body'>
                <>
                    <TableCustom
                        className={'TableCustomBase m-top-10'}
                        data={cajaResumen.movimientos}
                        avmr={avmrMovimientos}
                        columns={[
                            { Header: 'Tipo de movimiento', accessor: 'idTipoMovimientoCaja', width: '20%', Cell: ({ value }) => getRowLista('TipoMovimientoCaja', value)?.nombre ?? '' },
                            { Header: 'Fecha de movimiento', Cell: (data) => getDateToString(data.value, true), accessor: 'fechaCobro', width: '15%'},
                            { Header: 'Importe ($)', Cell: (data) => getFormatNumber(data.value, 2), accessor: 'importeCobro', width: '15%', alignCell: 'right' },
                            { Header: 'Observación', accessor: 'observacion', width: '50%' },
                        ]}
                        showDownloadCSV={false}
                        showFilterGlobal={false}
                    />
                    <div className="row form-basic m-top-10">
                        <div className="col-12">
                            <button className="btn action-button float-end" onClick={ (event) => handleRetirar() }>Retirar</button>
                            <button className="btn action-button float-end m-right-10" onClick={ (event) => handleIngresar() }>Ingresar</button>
                        </div>
                    </div>
                </>
                </div>
                )}

                <div className='accordion-header m-top-10'>
                    <div className='row'>
                        <div className="col-12" onClick={() => ToggleAccordion('resumen')}>
                            <div className='accordion-header-title'>
                                {(accordions.resumen) ? accordionOpen : accordionClose}
                                <h3 className={accordions.resumen ? 'active' : ''}>Resumen diario</h3>
                            </div>
                        </div>
                    </div>
                </div>
                {(accordions.resumen &&
                <div className='accordion-body'>
                    <div className="row form-basic">
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="efectivo" className="form-label">Efectivo</label>
                            <InputNumber
                                precision={2}
                                name="efectivo"
                                placeholder=""
                                className="form-control"
                                value={formValues.efectivo}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="tarjetaCredito" className="form-label">Tarjeta de crédito</label>
                            <InputNumber
                                precision={2}
                                name="tarjetaCredito"
                                placeholder=""
                                className="form-control"
                                value={formValues.tarjetaCredito}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="tarjetaDebito" className="form-label">Tarjeta de débito</label>
                            <InputNumber
                                precision={2}
                                name="tarjetaDebito"
                                placeholder=""
                                className="form-control"
                                value={formValues.tarjetaDebito}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="cheque" className="form-label">Cheques</label>
                            <InputNumber
                                precision={2}
                                name="cheque"
                                placeholder=""
                                className="form-control"
                                value={formValues.cheque}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="transferencia" className="form-label">Transferencias</label>
                            <InputNumber
                                precision={2}
                                name="transferencia"
                                placeholder=""
                                className="form-control"
                                value={formValues.transferencia}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="cobranzas" className="form-label">Total cobranzas</label>
                            <InputNumber
                                precision={2}
                                name="cobranzas"
                                placeholder=""
                                className="form-control"
                                value={formValues.cobranzas}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="row form-basic">
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="saldoInicial" className="form-label">Saldo inicial</label>
                            <InputNumber
                                precision={2}
                                name="saldoInicial"
                                placeholder=""
                                className="form-control"
                                value={formValues.saldoInicial}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="efectivo" className="form-label">Cobranzas efectivo (+)</label>
                            <InputNumber
                                precision={2}
                                name="efectivo"
                                placeholder=""
                                className="form-control"
                                value={formValues.efectivo}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="ingresos" className="form-label">Ingresos de dinero (+)</label>
                            <InputNumber
                                precision={2}
                                name="ingresos"
                                placeholder=""
                                className="form-control"
                                value={formValues.ingresos}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="retiros" className="form-label">Retiros de dinero (-)</label>
                            <InputNumber
                                precision={2}
                                name="retiros"
                                placeholder=""
                                className="form-control"
                                value={formValues.retiros}
                                disabled={true}
                            />
                        </div>
                        <div className="col-12 col-lg-2 col-md-4">
                            <label htmlFor="saldoFinal" className="form-label">Saldo final</label>
                            <InputNumber
                                precision={2}
                                name="saldoFinal"
                                placeholder=""
                                className="form-control"
                                value={formValues.saldoFinal}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
                )}
            </div>
        </section>
        )}

        {(showPagoRecibos &&
        <PagoRecibosModal
            recibos={recibos}
            mediosPagos={mediosPagos}
            onConfirm={(medioPago) => {
                setShowPagoRecibos(false)
                const data = [...mediosPagos, medioPago]
                setMediosPagos(data)
            }}
            onCancel={() => {
                setShowPagoRecibos(false)
            }}
        />
        )}

        {(showCobranzaCaja &&
        <CobranzaCajaModal
            recibos={recibos}
            mediosPagos={mediosPagos}
            cajaResumen={cajaResumen}
            onConfirm={() => {
                setShowCobranzaCaja(false)
                setRecibos([])
                setMediosPagos([])
                FindCaja_Resumen(cajaResumen.caja.id, (cajaDto) => setCajaResumen(cajaDto))
            }}
            onCancel={() => {
                setShowCobranzaCaja(false)
            }}
        />
        )}

        {(showMovimientoCaja &&
        <MovimientoCajaModal
            idTipoMovimientoCaja={idTipoMovimientoCaja}
            cajaResumen={cajaResumen}
            onConfirm={() => {
                setIdTipoMovimientoCaja(0)
                setShowMovimientoCaja(false)
                FindCaja_Resumen(cajaResumen.caja.id, (cajaDto) => setCajaResumen(cajaDto))
            }}
            onCancel={() => {
                setIdTipoMovimientoCaja(0)
                setShowMovimientoCaja(false)
            }}
        />
        )}

        {(showMovimientoCajaDetalle && idMovimientoCajaDetalle > 0 &&
        <MovimientosCajaDetalleModal
            movimiento={cajaResumen.movimientos.find(f => f.id === idMovimientoCajaDetalle)}
            onCancel={() => {
                setShowMovimientoCajaDetalle(false)
                setIdMovimientoCajaDetalle(null)
            }}
        />
        )}


        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                {(showAperturaCaja &&
                    <button className="btn action-button float-end" onClick={ (event) => handleAbrirCaja() }>Abrir caja</button>
                )}
                {(cajaResumen.caja.id > 0 &&
                    <button className="btn action-button float-end" onClick={ (event) => handleCerrarCaja() }>Cerrar caja</button>
                )}
            </div>
        </footer>

    </>
}

export default AccesoCajasView
