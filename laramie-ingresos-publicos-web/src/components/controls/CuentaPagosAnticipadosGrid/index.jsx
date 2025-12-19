import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowToastMessage from '../../../utils/toast';
import { object } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { OpenObjectURL } from '../../../utils/helpers';
import { TableCustom, MessageModal } from '../../common';
import { getDateToString, getFormatNumber } from '../../../utils/convert';
import { useReporte } from '../../hooks/useReporte';
import { useEntidad } from '../../hooks/useEntidad';
import CuentaPagoAnticipadoModal from '../CuentaPagoAnticipadoModal';
import { APIS } from '../../../config/apis';
import { REQUEST_METHOD } from '../../../consts/requestMethodType';
import { ServerRequest } from '../../../utils/apiweb';

const CuentaPagosAnticipadosGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        rubrosComercio: [],
        showMessage: false,
        showForm: false,
        rowForm: null,
        list: [],
        loading: false,
        disabled: false
    });

    const dispatch = useDispatch();
    const sequenceValue = useSelector( (state) => state.sequence.value );


    const mount = () => {
        setState(prevState => {
            return {...prevState,
                idCuenta: props.data.idCuenta,
                rubrosComercio: props.data.rubrosComercio
            };
        });
    }
    useEffect(mount, [props.data]);

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

    const [ generateReporte, ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer)
                OpenObjectURL(`${reporte}.pdf`, buffer);
            else
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }
    });

    const cellA = (data) =>    <div className='action'>
                                    {!state.disabled &&
                                    <div onClick={ (event) => handleClickPagosAnticipadosAdd() } className="link">
                                       <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                    }
                                </div>
    const cellVMR = (data) =>   <div className='action'>
                                    {!state.disabled &&
                                    <div onClick={ (event) => handleClickPagosAnticipadosRemove(data.value) } className="link">
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
        { Header: 'Tasa', Cell: (props) => getDescTasa(props.value), accessor: 'idTasa', width: '28%', disableSortBy: true },
        { Header: 'Sub Tasa', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasa', width: '28%', disableSortBy: true },
        { Header: 'Periodo', accessor: 'periodo', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: 'Cuota', accessor: 'cuota', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: 'Importe', Cell: (props) => getFormatNumber(props.value,2), accessor: 'importeTotal', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: 'Vencimiento', Cell: (props) => getDateToString(props.value), accessor: 'fechaVencimientoTermino', width: '10%', disableSortBy: true },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '4%', disableGlobalFilter: true, disableSortBy: true }
    ];


    // handlers
    const handleClickPagosAnticipadosAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
            const rowForm = {
                id: idTemporal,
                idEmisionEjecucion: null,
                idEmisionConceptoResultado: null,
                idPlanPagoCuota: null,
                idCuentaPago: null,
                idCuenta: null,
                idTasa: 0,
                idSubTasa: 0,
                periodo: '',
                cuota: 0,
                importeNominal: 0,
                importeAccesorios: 0,
                importeRecargos: 0,
                importeMultas: 0,
                importeHonorarios: 0,
                importeAportes: 0,
                importeTotal: 0,
                importeNeto: 0,
                importeDescuento: 0,
                fechaVencimientoTermino: null,
                fechaCobro: null,
                idEdesurCliente: null,
                item: 0
            };
            return {...prevState, showForm: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }
    const handleClickPagosAnticipadosRemove = (id) => {
        const list = state.list.filter(f => f.id !== id);
        setState(prevState => {
            return {...prevState, list: list};
        });
    }
    const handleClickConfirm = () => {
        if (state.list <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar pagos primero');
            return false;
        }

        setState(prevState => {
            return {...prevState, showMessage: true};
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
    const callbackSuccessAddCuentaPagoAnticipado = (response) => {
        response.json()
        .then((data) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Pago anticipado generado correctamente");
            setState(prevState => {
                return {...prevState, loading: false, disabled: true};
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
        generateReporte("CuentaCorrientePagoAnticipado", paramsReporte);
    }
    function AddCuentaPagoAnticipado() {
        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/anticipado`;
        const dataBody = {
            idCuenta: state.idCuenta,
            cuentaPagoItems: state.list
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.CUENTA_PAGO,
            paramsUrl,
            dataBody,
            callbackSuccessAddCuentaPagoAnticipado,
            callbackNoSuccess,
            callbackError
        );
    }

    return (
    <>

        {state.showMessage && 
            <MessageModal
                title={"Confirmación"}
                message={"¿Está seguro de ingresar el pago anticipado?"}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showMessage: false};
                    });
                }}
                onConfirm={() => {
                    setState(prevState => {
                        return {...prevState, showMessage: false};
                    });
                    AddCuentaPagoAnticipado();
                }}
            />
        }


        {state.showForm && 
            <CuentaPagoAnticipadoModal
                data={{
                    entity: state.rowForm,
                    rubrosComercio: state.rubrosComercio
                }}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowForm: null};
                    });
                }}
                onConfirm={(row) => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowForm: null};
                    });

                    const list = [...state.list];
                    list.push(row);
                    setState(prevState => {
                        return {...prevState, list: list};
                    });
                }}
            />
        }

        <div className="row">

            <div className="mb-3 col-12">

                <TableCustom
                    showFilterGlobal={false}
                    showPagination={false}
                    className={'TableCustomBase'}
                    columns={tableColumns}
                    data={state.list}
                />

            </div>

            <div className="col-12 m-top-10">
                {!state.disabled &&
                <button className="btn action-button float-end" onClick={ (event) => handleClickConfirm() } >Confirmar</button>
                }
            </div>

        </div>

    </>
    );
}

CuentaPagosAnticipadosGrid.propTypes = {
    data: object.isRequired,
};

export default CuentaPagosAnticipadosGrid;