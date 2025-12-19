import React, { useState, useEffect } from 'react';
import { number, func } from 'prop-types';
import { TableCustom, Loading } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import ShowToastMessage from '../../../utils/toast';
import { getDateToString, getFormatNumber } from '../../../utils/convert';
import { OpenObjectURL } from '../../../utils/helpers';
import { useReporte } from '../../hooks/useReporte';


const EmisionPlanPagoGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idPlanPago: 0,
        list: [],
        loading: false
    });
    const [selectedAll, setSelectedAll] = useState(false);

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

    const [ generateReporte, ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (message) {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            }
            else {
                OpenObjectURL(`${reporte}.pdf`, buffer);
            }
        }
    });

    const cellSelAll = (props) =>   <div className='action-check'>
                                        <input name="selectedAll" type="checkbox" value={''}
                                            checked={selectedAll}
                                            onChange={({target}) =>{
                                                const checked = target.checked;
                                                setSelectedAll(checked);
                                                SelectAll(checked);
                                            }}
                                        />
                                    </div>

    const cellSel = (props) =>      <div className='action-check'>
                                        <input type="checkbox" value={''} checked={ state.list[props.value].selected } readOnly={true} />
                                    </div>

    const tableColumns = [
        { Header: cellSelAll, Cell: cellSel, accessor: 'index', width:'10%', disableGlobalFilter: true, disableSortBy: true},
        { Header: 'Cuota', Cell: (props) => (props.value === 0) ? "Anticipo" : props.value, accessor: 'numero', width: '25%', alignCell: 'right', disableSortBy: true },
        { Header: 'Importe', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeCuota', width: '35%', alignCell: 'right', disableSortBy: true },
        { Header: 'Vencimiento', Cell: (props) => getDateToString(props.value), accessor: 'fechaVencimiento', width: '30%', alignCell: 'right', disableSortBy: true }
    ];

    //handles
    const handleClickSelected = (index) => {
        const list = [...state.list];
        list[index].selected = !list[index].selected;
        setState(prevState => {
            return {...prevState,
                list: list
            };
        });
        setSelectedAll(false);
    }
    const handleClickImprimirConvenio = () => {
        PrintConvenio(state.idPlanPago);
    }
    const handleClickImprimirCuotas = () => {
        let planPagoCuota = [];
        state.list.forEach(cuota => {
            if(cuota.selected) {
                planPagoCuota.push(cuota.id);
            }
        });
        if (planPagoCuota.length > 0) {
            PrintRecibo(state.idPlanPago, planPagoCuota);
        }
        else {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe seleccionar cuotas primero");
        }
    }

    // funciones
    function PrintRecibo(idPlanPago, planPagoCuota) {
        const paramsReporte = {
            idPlanPago: idPlanPago,
            planPagoCuota: planPagoCuota
        }
        generateReporte("PlanPagoRecibo", paramsReporte);
    }
    function PrintConvenio(idPlanPago) {
        const paramsReporte = {
            idPlanPago: idPlanPago
        }
        generateReporte("PlanPagoConvenio", paramsReporte);
    }
    function SelectAll(checked) {
        const list = [...state.list];
        for (let index=0; index < list.length; index++) {
            if (!list[index].condicionEspecialInhibicion) {
                list[index].selected = checked;
            }
        }
        setState(prevState => {
            return {...prevState,
                list: list
            };
        });
    }
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
            data.planPagoCuotas.forEach((item, index) => {
                item.index = index;
                item.selected = false;
                if (item.fechaVencimiento) item.fechaVencimiento = new Date(item.fechaVencimiento);
            });
            setState(prevState => {
                return {...prevState, loading: false, list: data.planPagoCuotas};
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
        <div className="modal-dialog">
            <div className="modal-content animated fadeIn">
                <div className="modal-header">
                    <h2 className="modal-title">Impresión de Planes de Pago</h2>
                </div>
                <div className="modal-body">
                    <div className="row">
                        <div className="mb-3 col-12">
                            <TableCustom
                                showFilterGlobal={false}
                                showPagination={false}
                                className={'TableCustomBase'}
                                columns={tableColumns}
                                data={state.list}
                                onClickRow={(row, cellId) => {
                                    handleClickSelected(row.index);
                                }}
                            />
                        </div>
                    </div>
                </div> 
                <div className="modal-footer footer-center">
                    <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickImprimirConvenio() }>Imprimir Convenio</button>
                    <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickImprimirCuotas() }>Imprimir Cuotas</button>
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

EmisionPlanPagoGrid.propTypes = {
    idPlanPago: number.isRequired,
    onDismiss: func.isRequired
  };

export default EmisionPlanPagoGrid;