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
import CertificadoEscribanoModal from '../CertificadoEscribanoModal';

const CuentaCertificadoEscribanoGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        list: [],
        loading: false,
        showForm: false,
        rowId: 0
    });

    const mount = () => {
        if(props.data.idCuenta > 0) {
            setState(prevState => {
                return {...prevState,
                    idCuenta: props.data.idCuenta
                };
            });

            FindCertificadosEscribano(props.data.idCuenta);
        }
    }
    useEffect(mount, [props.data.idCuenta]);

    const [, getRowLista ] = useLista({
        listas: ['TipoCertificado'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {

          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoCertificado',
          timeout: 0
        }
    });

    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                              </div>

    const getDescTipoCertificado = (id) => {
        const row = getRowLista('TipoCertificado', id);
        return (row) ? row.nombre : '';
    }

    const tableColumns = [
        { Header: 'Tipo de Certificado', Cell: (props) => getDescTipoCertificado(props.value), accessor: 'idTipoCertificado', width: '25%' },
        { Header: 'Número', accessor: 'numeroCertificado', width: '25%' },
        { Header: 'Fecha', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaEntrada', width: '25%' },
        { Header: 'Transferencia', accessor: 'transferencia', width: '15%' },
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, modeFormEdit: false, rowId: parseInt(id)};
        });
    }

    // funciones
    function FindCertificadosEscribano(idCuenta) {
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/filter?idCuenta=${idCuenta}&idTipoCertificado=0&idEscribano=0&anioCertificado=&numeroCertificado=&etiqueta=`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CERTIFICADO_ESCRIBANO,
            paramsUrl,
            null,
            callbackSuccessCertificadoEscribano,
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

    const callbackSuccessCertificadoEscribano = (response) => {
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
            <CertificadoEscribanoModal
                id={state.rowId}
                disabled={!state.modeFormEdit}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowId: 0};
                    });
                }}
                onConfirm={(id) => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowId: 0};
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

CuentaCertificadoEscribanoGrid.propTypes = {
    data: object.isRequired,
  };

export default CuentaCertificadoEscribanoGrid;