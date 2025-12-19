import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { useForm } from '../../components/hooks/useForm';
import { useDispatch, useSelector } from 'react-redux';
import { useReporte } from '../../components/hooks/useReporte';
import { memoActionDel } from '../../context/redux/actions/memoAction';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, InputCuenta, InputNumber, DatePickerCustom } from '../../components/common';
import { getDateNow, getFormatNumber } from '../../utils/convert';
import { OpenObjectURL } from '../../utils/helpers';


function PagoACuentaView() {

    //parametros url
    const params = useParams();
    const dispatch = useDispatch();
    let navigate = useNavigate();

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
        }
    };

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        fechaVencimiento: null,
        items: [],
        loading: false,
        disbled: false
    });
    const [cuenta, setCuenta] = useState(entityInit.cuenta);
    const [itemsDeuda, setItemsDeuda] = useState([]);
    const [importeActualizadoTotal, setImporteActualizadoTotal] = useState(0);
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
                return {...prevState, idCuenta: data.value.idCuenta, fechaVencimiento: data.value.fechaVencimiento, reciboResumido: data.value.reciboResumido, items: data.value.items};
            });
        }
        else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, "No se pudo recuperar la información de la solicitud");
        }
    }, []);

    const [ generateReporte ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer)
                OpenObjectURL(`${reporte}.pdf`, buffer);
            else
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }
    });

    const [formValues, formHandle, , formSet] = useForm({
        importe: 0
    });

    //definiciones
    const cellV = (props) =>    <div className='action'>
                                    <div>
                                        <i className="fa fa-circle" style={{color: `#${props.row.original.color}`}}></i>
                                    </div>
                                </div>

    const tableColumns = [
        { Header: 'Periodo', accessor: 'periodo', width: '15%', alignCell: 'right', disableSortBy: true },
        { Header: 'Cuota', accessor: 'cuota', width: '15%', alignCell: 'right', disableSortBy: true },
        { Header: 'Importe Actualizado', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeTotal', width: '20%', alignCell: 'right', disableSortBy: true },
        { Header: 'Importe a Cancelar', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeACancelar', width: '20%', alignCell: 'right', disableSortBy: true },
        { Header: 'Pago', accessor: 'estado', width: '25%', disableSortBy: true },
        { Header: '', Cell: cellV, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickVolver = () => {
        dispatch(memoActionDel(params.processKey));
        navigate("../deuda/edit/" + cuenta.id, { replace: true });
    }
    const handleClickCheckPagoACuenta = () => {
        if (state.idCuenta === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "La cuenta no está definida");
            return;
        }
        if (formValues.importe === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe ingresar un importe mayor a cero");
            return;
        }
        if (state.fechaVencimiento === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe ingresar la fecha de Vencimiento");
            return;
        }

        let data = {
            idCuenta: state.idCuenta,
            importe: formValues.importe,
            fechaVencimiento: state.fechaVencimiento,
            items: state.items
        };
        CheckPagoACuenta(data);
    }
    const handleClickAddPagoACuenta = () => {
        if (state.idCuenta === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "La cuenta no está definida");
            return;
        }
        if (formValues.importe === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe ingresar un importe mayor a cero");
            return;
        }
        if (state.fechaVencimiento === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe ingresar la fecha de Vencimiento");
            return;
        }

        let data = {
            idCuenta: state.idCuenta,
            importe: formValues.importe,
            fechaVencimiento: state.fechaVencimiento,
            items: state.items
        };
        setMessageConfirm({
            show: true,
            title: "Está seguro de generar el pago a cuenta",
            data: data,
            callback: (data) => AddPagoACuenta(data)
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
    const callbackSuccessCheckPagoACuenta = (response) => {
        response.json()
        .then((data) => {

            let importeActualizadoTotal = 0;
            data.forEach((item, index) => {
                item.color = (item.importeACancelar > 0 && item.importeACancelar === item.importeTotal) ? '359538' : (item.importeACancelar > 0 && item.importeACancelar < item.importeTotal) ? 'e0df23' : 'f20c0c';
                item.estado = (item.importeACancelar > 0 && item.importeACancelar === item.importeTotal) ? 'COMPLETO' : (item.importeACancelar > 0 && item.importeACancelar < item.importeTotal) ? 'PARCIAL' : 'IMPAGO';
                importeActualizadoTotal += item.importeTotal;
            });
            setImporteActualizadoTotal(importeActualizadoTotal);

            setItemsDeuda(data);
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
    const callbackSuccessAddPagoACuenta = (response) => {
        response.json()
        .then((data) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Pago a Cuenta generado correctamente", () => {
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
        generateReporte("CuentaCorrientePagoACuenta", paramsReporte);
    }
    function CheckPagoACuenta(data) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const dataBody = data;
        const paramsUrl = `/pago-acuenta`;

        ServerRequest(
            REQUEST_METHOD.PUT,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_ITEM,
            paramsUrl,
            dataBody,
            callbackSuccessCheckPagoACuenta,
            callbackNoSuccess,
            callbackError
        );

    }
    function AddPagoACuenta(data) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const dataBody = data;
        const paramsUrl = `/pago-acuenta`;

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_ITEM,
            paramsUrl,
            dataBody,
            callbackSuccessAddPagoACuenta,
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

        <SectionHeading title={<>Recibos para Pago a Cuenta</>} />

        <section className='section-accordion'>

            <div className='row form-basic m-top-10'>
                <div className="col-12 col-lg-5">
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
            </div>
            <div className='row form-basic m-top-10'>
                <div className="col-12 col-lg-3">
                    <label htmlFor="importe" className="form-label">Importe de Pago a Cuenta ($)</label>
                    <InputNumber
                        name="importe"
                        placeholder=""
                        className="form-control"
                        onChange={formHandle}
                        value={formValues.importe}
                        precision={2}
                    />
                </div>
                <div className="col-12 col-lg-2">
                <label htmlFor="fechaVencimiento" className="form-label">Vto. Recibo</label>
                    <DatePickerCustom
                        name="fechaVencimiento"
                        placeholder=""
                        className="form-control"
                        onChange={formHandle}
                        value={ state.fechaVencimiento }
                        disabled={true}
                    />
                </div>
                <div className="col-12 col-lg-3">
                    <button className="btn btn-primary m-top-27 float-end" onClick={ (event) => handleClickCheckPagoACuenta() }>Generar</button>
                </div>
            </div>
            <div className='row form-basic m-top-10 m-bottom-20'>
                <div className="col-12 col-lg-8">
                    <label className="form-label">Verificación de Imputación</label>
                    <TableCustom
                        showFooter={false}
                        showPagination={false}
                        showFilterGlobal={false}
                        className={'TableCustomBase'}
                        columns={tableColumns}
                        data={itemsDeuda}
                    />
                </div>
            </div>
            <div className='row form-basic m-top-10 m-bottom-20'>
                <label className="form-label">Importe actualizado de períodos seleccionados: $ {getFormatNumber(importeActualizadoTotal,2)}</label>
            </div>

        </section>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
                {!state.disbled &&
                <button className="btn action-button float-end m-left-10" onClick={ (event) => handleClickAddPagoACuenta() }>Crear Pago a Cuenta</button>
                }
            </div>
        </footer>
        
    </>
    )
}

export default PagoACuentaView;
