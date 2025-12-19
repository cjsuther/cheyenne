import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { useForm } from '../../components/hooks/useForm';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, InputCuenta, InputPersona, InputCodigo, InputEjercicio, InputEntidad, DatePickerCustom } from '../../components/common';
import { useReporte } from '../../components/hooks/useReporte';
import { useEntidad } from '../../components/hooks/useEntidad';
import { getDateNow, getFormatNumber } from '../../utils/convert';
import { OpenObjectURL } from '../../utils/helpers';


function PagoReciboEspecialView() {

    //parametros url
    const params = useParams();
    let navigate = useNavigate();

    const entityInit = {
        reciboEspecial: {
            id: 0,
            codigo: '',
            descripcion: '',
            aplicaValorUF: false,
            recibosEspecialConcepto: []
        }
    };

    //hooks
    const [state, setState] = useState({
        idCuenta: params.idCuenta ? parseInt(params.idCuenta) : 0,
        loading: false,
        showMessage: false
    });
    const [reciboEspecial, setReciboEspecial] = useState(entityInit.reciboEspecial);
    const [valorUF, setValorUF] = useState(0);


    const mount = () => {
        FindValorUF();
    }
    useEffect(mount, []);


    const [ generateReporte ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer)
                OpenObjectURL(`${reporte}.pdf`, buffer);
            else
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }
    });

    const [formValues, formHandle, , formSet] = useForm({
        idPersona: 0,
        idReciboEspecial: 0,
        fechaVencimiento: getDateNow(false)
    });

    const [persona, setPersona] = useState({
        idTipoPersona: 0,
        idTipoDocumento: 0,
        numeroDocumento: "",
        nombrePersona: ""
      });

    const [messageConfirm, setMessageConfirm] = useState({
        show: false,
        title: "",
        data: null,
        callback: null
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['Tasa','SubTasa'],
        onLoaded: (entidades, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        }
    });


    //definiciones
    const getDescTasa = (id) => {
        const row = getRowEntidad('Tasa', id);
        return (row) ? `${row.codigo} - ${row.descripcion}` : '';
    }
    const getDescSubTasa = (id) => {
        const row = getRowEntidad('SubTasa', id);
        return (row) ? `${row.codigo} - ${row.descripcion}` : '';
    }

    const tableColumns = [
        { Header: 'Tasa', Cell: (props) => getDescTasa(props.value), accessor: 'idTasa', width: '35%', disableSortBy: true },
        { Header: 'SubTasa', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasa', width: '35%', disableSortBy: true },        
        { Header: 'Importe ($)', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importe', width: '15%', alignCell: 'right', disableSortBy: true }
    ];
    const tableColumnsSinUF = [
        ...tableColumns
    ];
    const tableColumnsConUF = [
        ...tableColumns,
        { Header: 'Unidades Fijas', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'valor', width: '15%', alignCell: 'right', disableSortBy: true }
    ];

    //handles
    const handleClickAddPagoReciboEspecial = () => {
        const today = getDateNow(false);

        if (formValues.idPersona === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "El contribuyente no está definido");
            return;
        }
        if (formValues.idReciboEspecial === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "El tipo de recibo especia no fue elegido");
            return;
        }
        if (formValues.fechaVencimiento === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe ingresar la fecha de Vencimiento");
            return;
        }
        if (formValues.fechaVencimiento.getTime() < today.getTime()) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "La fecha de Vencimiento debe ser igual o mayor a la fecha actual");
            return;
        }

        let data = {
            idCuenta: state.idCuenta,
            idPersona: formValues.idPersona,
            idTipoPersona: persona.idTipoPersona,
            idTipoDocumento: persona.idTipoDocumento,
            numeroDocumento: persona.numeroDocumento,
            nombrePersona: persona.nombrePersona,
            idReciboEspecial: formValues.idReciboEspecial,
            periodo: today.getFullYear().toString(),
            cuota: 0,
            fechaVencimiento: formValues.fechaVencimiento
        };
        setMessageConfirm({
            show: true,
            title: "Está seguro de generar el pago de recibo especial",
            data: data,
            callback: (data) => AddPagoReciboEspecial(data)
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
    const callbackSuccessAddPagoReciboEspecial = (response) => {
        response.json()
        .then((data) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Pago Recibo Especial generado correctamente", () => {
                navigate(0);
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
            idCuentaPago: idCuentaPago
        }
        generateReporte("CuentaCorrientePagoReciboEspecial", paramsReporte);
    }
    function FindContribuyente(idContribuyente) {

        const callbackSuccess = (response) => {
            response.json()
            .then((contribuyente) => {
                formSet({...formValues,
                    idPersona: contribuyente.idPersona
                });
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            });

            setState(prevState => {
                return {...prevState, loading: false};
            });
        };
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${idContribuyente}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CONTRIBUYENTE,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }
    function FindValorUF() {
    
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {
                setValorUF(parseFloat(data.valor));
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                  return {...prevState, loading: false};
                });
            });
        };

        const codigo = 'UF';    
        const paramsUrl = `/${codigo}/global`;
    
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.VARIABLE,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    function AddPagoReciboEspecial(data) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const dataBody = data;
        const paramsUrl = `/pago-recibo-especial`;

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_ITEM,
            paramsUrl,
            dataBody,
            callbackSuccessAddPagoReciboEspecial,
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

        <SectionHeading title={<>Pago de Recibo Especial</>} />

        <section className='section-accordion'>

            <h2 className="form-label m-top-10 m-bottom-20">Definición:</h2>
            <div className='row form-basic'>
                {state.idCuenta > 0 &&
                <div className="col-12 col-md-6">
                    <label htmlFor="cuenta" className="form-label">Cuenta</label>
                    <InputCuenta
                        name="cuenta"
                        placeholder=""
                        className="form-control"
                        onUpdate={({target}) => {
                            if (target.row) {
                                const cuenta = target.row;
                                FindContribuyente(cuenta.idContribuyentePrincipal);
                            }
                        }}
                        value={state.idCuenta}
                        disabled={true}
                    />
                </div>
                }
                <div className="col-12 col-md-6 col-lg-5">
                    <label htmlFor="idPersona" className="form-label">Contribuyente</label>
                    <InputPersona
                        name="idPersona"
                        placeholder=""
                        className="form-control"
                        onChange={(event) => {
                            const {target} = event;
                            const persona = (target.row) ? {
                              idTipoPersona: target.row.idTipoPersona,
                              idTipoDocumento: target.row.idTipoDocumento,
                              numeroDocumento: target.row.numeroDocumento,
                              nombrePersona: target.row.nombrePersona
                            } : {
                              idTipoPersona: 0,
                              idTipoDocumento: 0,
                              numeroDocumento: "",
                              nombrePersona: ""
                            };
                            setPersona(persona);
                            formHandle(event);
                          }}
                        value={formValues.idPersona}
                        idTipoPersona={0}
                        disabled={state.idCuenta > 0}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <label htmlFor="idReciboEspecial" className="form-label">Recibo Especial</label>
                    <InputEntidad
                        name="idReciboEspecial"
                        placeholder=""
                        className="form-control"
                        value={ formValues.idReciboEspecial }
                        title="Recibo Especial"
                        entidad="ReciboEspecial"
                        columns={[
                            { Header: 'Código', accessor: 'codigo', width: '25%' },
                            { Header: 'Descripción', accessor: 'descripcion', width: '70%' }
                        ]}
                        onChange={(event) => {
                            if (event.target.row) {
                                setReciboEspecial(event.target.row);
                            }
                            else {
                                setReciboEspecial(entityInit.reciboEspecial);
                            }
                            formHandle(event);
                        }}
                        memo={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-2">
                    <label htmlFor="fechaVencimiento" className="form-label">Vencimiento</label>
                    <DatePickerCustom
                        name="fechaVencimiento"
                        placeholder=""
                        className="form-control"
                        onChange={formHandle}
                        value={ formValues.fechaVencimiento }
                    />
                </div>
            </div>

            <h2 className="form-label m-top-20">Conceptos:</h2>
            <div className="m-bottom-50">

                <TableCustom
                    showFilterGlobal={false}
                    showPagination={false}
                    className={'TableCustomBase'}
                    columns={(reciboEspecial.aplicaValorUF) ? tableColumnsConUF : tableColumnsSinUF}
                    data={reciboEspecial.recibosEspecialConcepto.map(concepto => {
                        return {...concepto,
                            importe: (reciboEspecial.aplicaValorUF) ? (concepto.valor * valorUF) : concepto.valor
                        };
                    })}
                />

            </div>

        </section>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn action-button float-end m-left-10" onClick={ (event) => handleClickAddPagoReciboEspecial() }>Crear Pago de Recibo Especial</button>
            </div>
        </footer>
        
    </>
    )
}

export default PagoReciboEspecialView;
