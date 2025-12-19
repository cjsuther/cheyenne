import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { TableCustom, Loading } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import ShowToastMessage from '../../../utils/toast';
import { getDateToString, getFormatNumber } from '../../../utils/convert';
import { useLista } from '../../hooks/useLista';
import CertificadoApremioModal from '../CertificadoApremioModal';

const CuentaCertificadoApremioGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        list: [],
        rowForm: null,
        showForm: false,
        loading: false
    });

    const mount = () => {
        if(props.data.idCuenta > 0) {
            setState(prevState => {
                return {...prevState,
                    idCuenta: props.data.idCuenta
                };
            });

            FindCertificadoApremio(props.data.idCuenta);
        }
    }
    useEffect(mount, [props.data.idCuenta]);

    const [, getRowLista ] = useLista({
        listas: ['EstadoCertificadoApremio'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {

          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'EstadoCertificadoApremio',
          timeout: 0
        }
    });

    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                              </div>

    const getDescEstadoCertificadoApremio = (id) => {
        const row = getRowLista('EstadoCertificadoApremio', id);
        return (row) ? row.nombre : '';
    }

    const tableColumns = [
        { Header: 'Número', accessor: 'numero', width: '25%' },
        { Header: 'Estado', Cell: (props) => getDescEstadoCertificadoApremio(props.value), accessor: 'idEstadoCertificadoApremio', width: '25%' },
        { Header: 'Fecha', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaCertificado', width: '25%' },
        { Header: 'Monto total', Cell: (data) => getFormatNumber(data.value, 2),  accessor: 'montoTotal', width: '15%', alignCell: 'right' },
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
    function FindCertificadoApremio(idCuenta) {
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/filter?idCuenta=${idCuenta}&idApremio=0&numero=&idEstadoCertificadoApremio=0&fechaCertificadoDesde=&fechaCertificadoHasta=`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CERTIFICADO_APREMIO,
            paramsUrl,
            null,
            callbackSuccessCertificadoApremio,
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

    const callbackSuccessCertificadoApremio = (response) => {
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

        {state.showForm && 
            <CertificadoApremioModal
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

CuentaCertificadoApremioGrid.propTypes = {
    data: object.isRequired,
  };

export default CuentaCertificadoApremioGrid;