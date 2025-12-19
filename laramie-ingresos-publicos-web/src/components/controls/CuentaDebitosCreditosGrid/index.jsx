import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowToastMessage from '../../../utils/toast';
import { object } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { useForm } from '../../hooks/useForm';
import { Loading, TableCustom, MessageModal, InputCodigo, InputEntidad, DatePickerCustom, InputLista } from '../../common';
import { getDateNow, getDateToString, getFormatNumber } from '../../../utils/convert';
import { useEntidad } from '../../hooks/useEntidad';
import CuentaDebitoCreditoModal from '../CuentaDebitoCreditoModal';
import { APIS } from '../../../config/apis';
import { REQUEST_METHOD } from '../../../consts/requestMethodType';
import { ServerRequest } from '../../../utils/apiweb';
import { isValidNumber, OnKeyPress_validInteger } from '../../../utils/validator';
import CuentaAplicacionCreditosModal from '../CuentaAplicacionCreditosModal';

const CuentaDebitosCreditosGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        idTipoTributo: 0,
        rubrosComercio: [],
        showMessage: false,
        showFormDebitoCredito: false,
        showFormAplicacionCreditos: false,
        rowForm: null,
        list: [],
        loading: false,
        disabled: false
    });

    const [imputacion, setImputacion] = useState('');
    const [autonumerado, setAutonumerado] = useState(false);

    const dispatch = useDispatch();
    const sequenceValue = useSelector( (state) => state.sequence.value );


    const mount = () => {
        setState(prevState => {
            return {...prevState,
                idCuenta: props.data.idCuenta,
                idTipoTributo: props.data.idTipoTributo,
                rubrosComercio: props.data.rubrosComercio
            };
        });
    }
    useEffect(mount, [props.data]);

    const [ formValues, formHandle, , formSet ] = useForm({
        codigoDelegacion: "",
        idTipoMovimiento: 0,
        numeroMovimiento: "",
        idTipoValor: 0,
        idLugarPago: 0,
        fechaOrigen: getDateNow(false),
        fechaMovimiento: getDateNow(false),
        detalle: ""
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['Tasa', 'SubTasa'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        }
    });

    const cellA = (data) =>    <div className='action'>
                                    {!state.disabled && imputacion !== '' && state.list.length === 0 &&
                                    <div onClick={ (event) => handleClickDebitosCreditosAdd() } className="link">
                                       <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                    }
                                </div>
    const cellVMR = (data) =>   <div className='action'>
                                    {!state.disabled &&
                                    <div onClick={ (event) => handleClickDebitosCreditosRemove(data.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    }
                                </div>

    const getDescTasa = (id) => {
        const row = getRowEntidad('Tasa', id);
        return (row) ? `${row.codigo} - ${row.descripcion}` : '';
    } 
    const getDescSubTasa = (id) => {
        const row = getRowEntidad('SubTasa', id);
        return (row) ? `${row.codigo} - ${row.descripcion}` : '';
    }
    
    const tableColumns = [
        { Header: 'Tasa', Cell: (props) => getDescTasa(props.value), accessor: 'idTasa', width: '24%', disableSortBy: true },
        { Header: 'Sub Tasa', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasa', width: '24%', disableSortBy: true },
        { Header: 'Periodo', accessor: 'periodo', width: '9%', alignCell: 'right', disableSortBy: true },
        { Header: 'Cuota', accessor: 'cuota', width: '9%', alignCell: 'right', disableSortBy: true },
        { Header: 'Debe', Cell: (props) => getFormatNumber(props.value,2), accessor: 'importeDebe', width: '7%', alignCell: 'right', disableSortBy: true },
        { Header: 'Haber', Cell: (props) => getFormatNumber(props.value,2), accessor: 'importeHaber', width: '7%', alignCell: 'right', disableSortBy: true },
        { Header: 'Vto.', Cell: (props) => getDateToString(props.value), accessor: 'fechaVencimiento1', width: '8%', disableSortBy: true },
        { Header: 'Recargo', Cell: (props) => getDateToString(props.value), accessor: 'fechaVencimiento2', width: '8%', disableSortBy: true },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '3%', disableGlobalFilter: true, disableSortBy: true }
    ];


    // handlers
    const handleClickDebitosCreditosAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
            const rowForm = {
                id: idTemporal,
                idEmisionEjecucion: null,
                idEmisionCuentaCorrienteResultado: null,
                idPlanPago: null,
                idPlanPagoCuota: null,
                idCertificadoApremio: null,
                idCuenta: null,
                idTasa: 0,
                idSubTasa: 0,
                periodo: "",
                cuota: 0,
                codigoDelegacion: "",
                idTipoMovimiento: 0,
                numeroMovimiento: "",
                tasaCabecera: false,
                idTipoValor: 0,
                importeDebe: 0,
                importeHaber: 0,
                idLugarPago: 0,
                fechaOrigen: null,
                fechaMovimiento: null,
                fechaVencimiento1: null,
                fechaVencimiento2: null,
                cantidad: 0,
                idEdesurCliente: null,
                detalle: "",
                item: 0,
                idUsuarioRegistro: null,
                fechaRegistro: null
            };
            return {...prevState, showFormDebitoCredito: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }
    const handleClickDebitosCreditosRemove = (id) => {
        const list = state.list.filter(f => f.id !== id);
        setState(prevState => {
            return {...prevState, list: list};
        });
    }
    const handleClickConfirm = () => {
        if (isFormValid()) {

            if (state.list <= 0) {
                ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar débitos o créditos primero');
                return false;
            }
    
            setState(prevState => {
                return {...prevState, showMessage: true};
            });

        }
    }
    const handleClickAplicacionCreditos = () => {
        setState(prevState => {
            return {...prevState, showFormAplicacionCreditos: true};
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
    const callbackSuccessAddCuentaDebitoCredito = (response) => {
        response.json()
        .then((data) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Los débtios y/o créditos fueron ingresados correctamente");
            setState(prevState => {
                return {...prevState, loading: false, list: []};
            });
            formSet({...formValues,
                idTipoMovimiento: 0,
                numeroMovimiento: 0
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
    function isFormValid() {

        if (!isValidNumber(formValues.codigoDelegacion, false)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el código de delegación');
            return false;
        }
        if (formValues.idTipoMovimiento <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el tipo de movimiento');
            return false;
        }
        if (!isValidNumber(formValues.numeroMovimiento, true)) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el número de movimiento');
            return false;
        }

        if (formValues.idTipoValor <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el tipo de valor');
            return false;
        }
        // if (formValues.idLugarPago <= 0) {
        //     ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el lugar de pago');
        //     return false;
        // }
        if (formValues.fechaOrigen === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar la fecha de origen');
            return false;
        }

        if (formValues.detalle.length <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el detalle');
            return false;
        }

        return true;
    }
    function AddCuentaDebitoCredito() {
        setState(prevState => {
            return {...prevState, loading: true};
        });

        let cuentaCorrienteItems = [...state.list];
        cuentaCorrienteItems.forEach(item => {
            item.codigoDelegacion = formValues.codigoDelegacion;
            item.idTipoMovimiento = formValues.idTipoMovimiento;
            item.numeroMovimiento = formValues.numeroMovimiento;
            item.idTipoValor = formValues.idTipoValor;
            item.idLugarPago = formValues.idLugarPago;
            item.fechaOrigen = formValues.fechaOrigen;
            item.detalle = formValues.detalle;
        });

        const paramsUrl = `/debito-credito`;
        const dataBody = {
            idCuenta: state.idCuenta,
            cuentaCorrienteItems: cuentaCorrienteItems
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_ITEM,
            paramsUrl,
            dataBody,
            callbackSuccessAddCuentaDebitoCredito,
            callbackNoSuccess,
            callbackError
        );
    }

    return (
    <>

        <Loading visible={state.loading}></Loading>

        {state.showMessage && 
            <MessageModal
                title={"Confirmación"}
                message={"¿Está seguro de ingresar los débitos y/o créditos?"}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showMessage: false};
                    });
                }}
                onConfirm={() => {
                    setState(prevState => {
                        return {...prevState, showMessage: false};
                    });
                    AddCuentaDebitoCredito();
                }}
            />
        }


        {state.showFormDebitoCredito && 
            <CuentaDebitoCreditoModal
                data={{
                    entity: state.rowForm,
                    idTipoTributo: state.idTipoTributo,
                    imputacion: imputacion,
                    rubrosComercio: state.rubrosComercio
                }}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showFormDebitoCredito: false, rowForm: null};
                    });
                }}
                onConfirm={(row) => {
                    setState(prevState => {
                        return {...prevState, showFormDebitoCredito: false, rowForm: null};
                    });

                    const list = [...state.list];
                    list.push(row);
                    setState(prevState => {
                        return {...prevState, list: list};
                    });
                }}
            />
        }

        {state.showFormAplicacionCreditos && 
            <CuentaAplicacionCreditosModal
                idCuenta={state.idCuenta}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showFormAplicacionCreditos: false};
                    });
                }}
            />
        }

        <div className="row">

            <div className="mb-3 col-6 col-md-2">
                <label htmlFor="codigoDelegacion" className="form-label">Código Delegación</label>
                <InputCodigo
                    name="codigoDelegacion"
                    placeholder=""
                    className="form-control"
                    value={ formValues.codigoDelegacion }
                    onChange={ formHandle }
                    disabled={state.disabled}
                />
            </div>
            <div className="mb-3 col-6 col-md-7">
                <label htmlFor="idTipoMovimiento" className="form-label">Tipo Movimiento</label>
                <InputEntidad
                    name="idTipoMovimiento"
                    placeholder=""
                    className="form-control"
                    value={ formValues.idTipoMovimiento }
                    onChange={({target}) => {
                        if (target.row) {
                            setImputacion(target.row.imputacion);
                            setAutonumerado(target.row.autonumerado);
                            formSet({...formValues,
                                idTipoMovimiento: target.value,
                                numeroMovimiento: (target.row.autonumerado) ? target.row.numero : 0
                            });
                        }
                        else {
                            setImputacion('');
                            setAutonumerado(false);
                            formSet({...formValues,
                                idTipoMovimiento: null
                            });
                        }
                    }}
                    title="Tipo Movimiento"
                    entidad="TipoMovimiento"
                    disabled={state.disabled || state.list.length > 0}
                />
            </div>
            <div className="mb-3 col-6 col-md-3">
                <label htmlFor="numeroMovimiento" className="form-label">Número</label>
                <input
                    name="numeroMovimiento"
                    type="text"
                    placeholder=""
                    className="form-control align-right"
                    value={ formValues.numeroMovimiento}
                    onChange={ formHandle }
                    onKeyPress={ OnKeyPress_validInteger }
                    disabled={state.disabled || autonumerado}
                />
            </div>

            <div className="mb-3 col-12 col-md-2">
                <label htmlFor="idTipoValor" className="form-label">Tipo Valor</label>
                <InputLista
                    name="idTipoValor"
                    placeholder=""
                    className="form-control"
                    value={ formValues.idTipoValor }
                    onChange={ formHandle }
                    lista="TipoValor"
                    disabled={state.disabled}
                />
            </div>
            <div className="mb-3 col-12 col-md-4">
                <label htmlFor="idLugarPago" className="form-label">Lugar de Pago</label>
                <InputLista
                    name="idLugarPago"
                    placeholder=""
                    className="form-control"
                    value={ formValues.idLugarPago }
                    onChange={ formHandle }
                    lista="LugarPago"
                    disabled={state.disabled}
                />    
            </div>
            <div className="mb-3 col-12 col-md-3">
                <label htmlFor="fechaOrigen" className="form-label">Fecha Origen</label>
                <DatePickerCustom
                    name="fechaOrigen"
                    placeholder=""
                    className="form-control"
                    value={ formValues.fechaOrigen }
                    onChange={ formHandle }
                    disabled={state.disabled}
                />
            </div>
            <div className="mb-3 col-12 col-md-3">
                <label htmlFor="fechaMovimiento" className="form-label">Fecha Movimiento</label>
                <DatePickerCustom
                    name="fechaMovimiento"
                    placeholder=""
                    className="form-control"
                    value={ formValues.fechaMovimiento }
                    disabled={true}
                />
            </div>

            <div className="mb-3 col-12">
                <label htmlFor="detalle" className="form-label">Detalle</label>
                <input
                    name="detalle"
                    type="text"
                    placeholder=""
                    className="form-control"
                    value={ formValues.detalle }
                    onChange={ formHandle }
                    disabled={state.disabled}
                />
            </div>

            <div className="mb-3 col-12">

                <TableCustom
                    showFilterGlobal={false}
                    showPagination={false}
                    className={'TableCustomBase'}
                    columns={tableColumns}
                    data={state.list}
                />

            </div>

            {!state.disabled &&
            <div className="col-12 m-top-10">
                {state.list.length === 0 &&
                <button className="btn action-button float-start m-left-5" onClick={ (event) => handleClickAplicacionCreditos() } >Aplicación de Créditos</button>
                }
                {state.list.length > 0 &&
                <button className="btn action-button float-end" onClick={ (event) => handleClickConfirm() } >Confirmar Movimientos</button>    
                }
            </div>
            }

        </div>

    </>
    );
}

CuentaDebitosCreditosGrid.propTypes = {
    data: object.isRequired,
};

export default CuentaDebitosCreditosGrid;