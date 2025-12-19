import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import ShowToastMessage from '../../../utils/toast';
import { getDateNow, getDateToString } from '../../../utils/convert';
import { APIS } from '../../../config/apis';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from '../../../consts/requestMethodType';
import CuentaCorrienteCondicionEspecialModal from '../CuentaCorrienteCondicionEspecialModal';


const CuentaCorrienteCondicionesEspecialesGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        numeroPartida: 0,
        codigoDelegacion: '',
        numeroMovimiento: 0,
        disabled: false,
        showMessage: false,
        showForm: false,
        modeFormEdit: false,
        rowData: null,
        list: []
    });

    const mount = () => {
        setState(prevState => {
            return {...prevState,
                idCuenta: props.data.idCuenta,
                numeroPartida: props.data.numeroPartida,
                codigoDelegacion: props.data.codigoDelegacion,
                numeroMovimiento: props.data.numeroMovimiento,
                disabled: props.disabled
            };
        });
        SearchCondicionesEspeciales(props.data.idCuenta);
    }
    useEffect(mount, [props.data]);

    const [, getRowEntidad] = useEntidad({
        entidades: ['TipoCondicionEspecial'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoCondicionEspecial',
          timeout: 0
        }
      });

    const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickCondicionEspecialAdd() } className="link">
                                       <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickCondicionEspecialView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickCondicionEspecialModify(data.value) } className="link">
                                    <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickCondicionEspecialRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}                               
                              </div>

    const getDescTipoCondicionEspecial = (id) => {
        const row = getRowEntidad('TipoCondicionEspecial', id);
        return (row) ? row.nombre : '';
    }

    const tableColumns = [
        { Header: 'Número', accessor: 'numero', width: '10%', alignCell: 'right' },
        { Header: 'Tipo', Cell: (props) => getDescTipoCondicionEspecial(props.value), accessor: 'idTipoCondicionEspecial', width: '30%' },
        { Header: 'Desde', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaDesde', width: '12%' },
        { Header: 'Hasta', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaHasta', width: '12%' },
        { Header: 'Movimiento', Cell: (props) => {
            const row = props.row.original;
            return `${row.codigoDelegacion}-${row.numeroMovimiento}`;
        }, accessor: 'numeroMovimiento', width: '17%', alignCell: 'right' },
        { Header: 'Comprobante', accessor: 'numeroComprobante', width: '17%', alignCell: 'right' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '8%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickCondicionEspecialAdd = () => {
        setState(prevState => {
            const rowData = {
                id: 0,
                idCuenta: state.idCuenta,
                numeroPartida: state.numeroPartida,
                codigoDelegacion: state.codigoDelegacion,
                numeroMovimiento: state.numeroMovimiento
            };
            return {...prevState, showForm: true, modeFormEdit: true, rowData: rowData};
        });
    }

    const handleClickCondicionEspecialView = (id) => {
        setState(prevState => {
          const row = state.list.find(x => x.id === id);
          const rowData = {
            id: row.id,
            idCuenta: state.idCuenta,
            numeroPartida: state.numeroPartida,
            codigoDelegacion: state.codigoDelegacion,
            numeroMovimiento: state.numeroMovimiento
        };
          return {...prevState, showForm: true, modeFormEdit: false, rowData: rowData};
        });
    }

    const handleClickCondicionEspecialModify = (id) => {
        setState(prevState => {
            const row = state.list.find(x => x.id === id);
            const rowData = {
              id: row.id,
              idCuenta: state.idCuenta,
              numeroPartida: state.numeroPartida,
              codigoDelegacion: state.codigoDelegacion,
              numeroMovimiento: state.numeroMovimiento
          };
            return {...prevState, showForm: true, modeFormEdit: true, rowData: rowData};
        });
    }
    
    const handleClickCondicionEspecialRemove = (id) => {
        setState(prevState => {
            const row = state.list.find(x => x.id === id);
            const rowData = {
                id: row.id,
                idCuenta: state.idCuenta,
                numeroPartida: state.numeroPartida,
                codigoDelegacion: state.codigoDelegacion,
                numeroMovimiento: state.numeroMovimiento
            };
            return {...prevState, showMessage: true, rowData: rowData};
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
    const callbackSuccessSearchCondicionesEspeciales = (response) => {
        response.json()
        .then((data) => {

            let items = null;
            if (props.data.numeroPartida > 0) {
                items = data.filter(f => f.numeroPartida === props.data.numeroPartida);
            }
            else {
                items = data;
            }

            items.forEach((item, index) => {
                if (item.fechaDesde) item.fechaDesde = new Date(item.fechaDesde);
                if (item.fechaHasta) item.fechaHasta = new Date(item.fechaHasta);
            });

            if (props.onlyActived) {
                const toDay = getDateNow(false);
                items = items.filter(f => f.fechaDesde <= toDay && f.fechaHasta >= toDay);
            }

            setState(prevState => {
                return {...prevState, loading: false, list: items};
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
    function SearchCondicionesEspeciales(idCuenta) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl =  `/cuenta/${idCuenta}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_CONDICION_ESPECIAL,
            paramsUrl,
            null,
            callbackSuccessSearchCondicionesEspeciales,
            callbackNoSuccess,
            callbackError
        );

    }

    function RemoveCondicionEspecial(id) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((id) => {
                setState(prevState => {
                    return {...prevState, loading: false};
                });
                SearchCondicionesEspeciales(state.idCuenta);
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const paramsUrl = `/${id}`;

        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_CONDICION_ESPECIAL,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }


    return (
    <>

        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
            <div className="modal-dialog modal-xl">
                <div className="modal-content animated fadeIn">
                    <div className="modal-header">
                        <h5 className="modal-title">Condiciones Especiales de Cuenta Corriente {
                            (state.numeroPartida > 0) ? `(${state.codigoDelegacion}-${state.numeroMovimiento})` : ''
                        }</h5>
                    </div>
                    <div className="modal-body">

                        {state.showMessage && 
                            <MessageModal
                                title={"Confirmación"}
                                message={"¿Está seguro de borrar el registro?"}
                                onDismiss={() => {
                                    setState(prevState => {
                                        return {...prevState, showMessage: false, rowData: null};
                                    });
                                }}
                                onConfirm={() => {
                                    const rowData = CloneObject(state.rowData);
                                    setState(prevState => {
                                        return {...prevState, showMessage: false, rowData: null};
                                    });
                                    RemoveCondicionEspecial(rowData.id);
                                }}
                            />
                        }

                        {state.showForm && 
                            <CuentaCorrienteCondicionEspecialModal
                                disabled={!state.modeFormEdit}
                                data={state.rowData}
                                onDismiss={() => {
                                    setState(prevState => {
                                        return {...prevState, showForm: false, rowData: null};
                                    });
                                }}
                                onConfirm={(row) => {
                                    setState(prevState => {
                                        return {...prevState, showForm: false, rowData: null};
                                    });
                                    SearchCondicionesEspeciales(state.idCuenta);
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

CuentaCorrienteCondicionesEspecialesGrid.propTypes = {
    disabled: bool,
    data: object.isRequired,
    onDismiss: func.isRequired,
    onlyActived: bool,
  };
  
  CuentaCorrienteCondicionesEspecialesGrid.defaultProps = {
    disabled: false,
    onlyActived: false
  };

export default CuentaCorrienteCondicionesEspecialesGrid;