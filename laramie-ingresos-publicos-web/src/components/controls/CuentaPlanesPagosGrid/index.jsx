import React, { useState, useEffect } from 'react';
import { object } from 'prop-types';
import { TableCustom, Loading } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import ShowToastMessage from '../../../utils/toast';
import EmisionPlanPagoGrid from '../EmisionPlanPagoGrid';
import { getFormatNumber } from '../../../utils/convert';
import CuentaPlanePagoModal from '../CuentaPlanePagoModal';


const CuentaPlanesPagosGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        list: [],
        loading: false,
        showFormGrid: false,
        showFormModal: false,
        rowId: 0
    });

    const mount = () => {
        if(props.data.idCuenta > 0) {
            setState(prevState => {
                return {...prevState,
                    idCuenta: props.data.idCuenta
                };
            });

            SearchPlanesPagos(props.data.idCuenta);
        }
    }
    useEffect(mount, [props.data.idCuenta]);

    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  <div onClick={ (event) => handleClickPrint(data.value) } className="link">
                                      <i className="fa fa-print" title="reimprimir"></i>
                                  </div>
                              </div>

    const tableColumns = [
        { Header: 'Número', accessor: 'numero', width: '20%', alignCell: 'right' },
        { Header: 'Código', accessor: 'codigo', width: '20%', alignCell: 'right' },
        { Header: 'Descripcion', accessor: 'descripcion', width: '35%' },
        { Header: 'Importe', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importePlanPago', width: '20%', alignCell: 'right' },
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickView = (id) => {
        setState(prevState => {
            return {...prevState, showFormModal: true, rowId: parseInt(id)};
        });
    }
    const handleClickPrint = (id) => {
        setState(prevState => {
            return {...prevState, showFormGrid: true, rowId: parseInt(id)};
        });
    }

    // funciones
    function SearchPlanesPagos(idCuenta) {
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/cuenta/${idCuenta}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PLAN_PAGO,
            paramsUrl,
            null,
            callbackSuccessPlanesPagos,
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
    const callbackSuccessPlanesPagos = (response) => {
        response.json()
        .then((data) => {
            setState(prevState => {
                return {...prevState, loading: false, list: data};
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

        {state.showFormGrid && 
            <EmisionPlanPagoGrid
                idPlanPago={state.rowId}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showFormGrid: false, rowId: 0};
                    });
                }}
            />
        }
        {state.showFormModal && 
            <CuentaPlanePagoModal
                idPlanPago={state.rowId}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showFormModal: false, rowId: 0};
                    });
                }}
            />
        }

        <TableCustom
            showFilterGlobal={false}
            showPagination={false}
            className={'TableCustomBase'}
            columns={tableColumns}
            data={ state.list }
        />
    </>
    );
}

CuentaPlanesPagosGrid.propTypes = {
    data: object.isRequired,
  };

export default CuentaPlanesPagosGrid;