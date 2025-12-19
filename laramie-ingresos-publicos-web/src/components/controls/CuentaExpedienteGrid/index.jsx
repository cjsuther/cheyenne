import React, { useState, useEffect } from 'react';
import { object } from 'prop-types';
import { TableCustom, Loading } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import ShowToastMessage from '../../../utils/toast';
import { getDateToString } from '../../../utils/convert';
import { useLista } from '../../hooks/useLista';
import ExpedienteModal from '../ExpedienteModal';

const CuentaExpedienteGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        listIdExpedientes: [],
        list: [],
        showForm: false,
        rowForm: null,
        loading: false
    });

    let countRequest = 0;
    let listExpedientes = [];

    const mount = () => {
        if(props.data.listIdExpedientes.length > 0) {
            listExpedientes = [];
            setState(prevState => {
                return {...prevState,
                    listExpedientes: props.data.listIdExpedientes
                };
            });

            FindCuentasExpediente(props.data.listIdExpedientes);
        }
    }
    useEffect(mount, [props.data.listIdExpedientes]);

    const [, getRowLista ] = useLista({
        listas: ['TipoExpediente'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {

          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoExpediente',
          timeout: 0
        }
    });

    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                              </div>

    const getDescTipoExpediente = (id) => {
        const row = getRowLista('TipoExpediente', id);
        return (row) ? row.nombre : '';
    }

    const tableColumns = [
        { Header: 'Tipo de expediente', Cell: (props) => getDescTipoExpediente(props.value), accessor: 'idTipoExpediente', width: '20%' },
        { Header: 'Ejercicio', accessor: 'ejercicio', width: '20%' },
        { Header: 'Número', accessor: 'numero', width: '15%' },
        { Header: 'Letra', accessor: 'letra', width: '15%' },
        { Header: 'Fecha de creación', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaCreacion', width: '20%' },
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickView = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showForm: true, rowForm: rowForm};
        });
    }

    // funciones
    function FindCuentasExpediente(listIdExpedientes) {

        countRequest = listIdExpedientes.length;

        listIdExpedientes.forEach(id => {
            const paramsUrl = `/${id}`;

            ServerRequest(
                REQUEST_METHOD.GET,
                null,
                true,
                APIS.URLS.EXPEDIENTE,
                paramsUrl,
                null,
                callbackSuccessCuentaExpediente,
                callbackNoSuccess,
                callbackError
            );
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

    const callbackSuccessCuentaExpediente = (response) => {
        response.json()
        .then((data) => {
            countRequest--;
            listExpedientes.push(data);
            //se guarda en el state, recien cuando finaliza el ultimo request
            if (countRequest === 0) {
                setState(prevState => {
                    return {...prevState, list: listExpedientes};
                });
            }
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

        {state.showForm && 
            <ExpedienteModal
                disabled={true}
                data={{
                    entity: state.rowForm
                }}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowForm: null};
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

CuentaExpedienteGrid.propTypes = {
    data: object.isRequired,
  };

export default CuentaExpedienteGrid;