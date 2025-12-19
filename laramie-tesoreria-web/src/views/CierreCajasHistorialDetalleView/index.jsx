import { useEffect, useState } from "react"
import { useForm, useLista, useManagedContext } from "../../components/hooks"
import { ServerRequest } from "../../utils/apiweb"
import { REQUEST_METHOD } from "../../consts/requestMethodType"
import { APIS } from "../../config/apis"
import { useParams } from "react-router-dom";
import { InputNumber, InputUsuario, SectionHeading, TableCustom } from "../../components/common"
import { onRequestError, onRequestNoSuccess } from "../../utils/requests"
import ShowToastMessage from "../../utils/toast"
import { ALERT_TYPE } from "../../consts/alertType"
import { getDateToString, getFormatNumber, getNumeroRecibo_ObjectToIdentificador } from "../../utils/convert"
import { CloneObject, GetValuesResumen } from "../../utils/helpers"
import { printTicket } from "../../utils/printTicket"
import { useReporte } from "../../components/hooks/useReporte"
import { useNav } from '../../components/hooks/useNav';
import { TIPO_MOVIMIENTO_CAJA } from "../../consts/tipoMovimientoCaja"
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

const CierreCajasHistorialDetalleView = () => {
    const { setIsLoading } = useManagedContext()
    const navigate = useNav();

    //parametros url
    const params = useParams();

    const [state, setState] = useState({
        idCaja: params.id ? parseInt(params.id) : 0,
    })

    const [cajaResumen, setCajaResumen] = useState(cajaDtoInit)
    const [formValues, , , formSet ] = useForm(cobranzaInit)

    const [showMovimientoCajaDetalle, setShowMovimientoCajaDetalle] = useState(false)
    const [idMovimientoCajaDetalle, setIdMovimientoCajaDetalle] = useState(0)
    const [accordions, setAccordions] = useState({
        movimientos: true,
        resumen: true
    })

    useEffect(() => {
        if (state.idCaja > 0) {
            FindCaja_Resumen(state.idCaja, (cajaDto) => {
                setCajaResumen(cajaDto)
            })
        }
    }, []);

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

    const FindCaja_Resumen = (idCaja, callbackSuccess) => {
        setIsLoading(true)

        const paramsUrl = `/resumen/caja-asignacion/${idCaja}`

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

    const avmrMovimientos = {
        customActions: [
            {
                icon: 'search',
                title: 'Ver detalle',
                onClick: ({ id }) => {
                    setIdMovimientoCajaDetalle(id)
                    setShowMovimientoCajaDetalle(true)
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

    const handleClickVolver = () => {
        navigate({ to: `../historial/cierre-caja` });
    }

    const accordionClose = <span className="material-symbols-outlined search-i">chevron_right</span>
    const accordionOpen = <span className="material-symbols-outlined search-i">expand_more</span>

    return <>
        <SectionHeading titles={[{ title: 'Cajas' }, { title: 'Historial de cierre de cajas' }, { title: 'Detalle' }]} />

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
                <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
            </div>
        </footer>

    </>
}

export default CierreCajasHistorialDetalleView
