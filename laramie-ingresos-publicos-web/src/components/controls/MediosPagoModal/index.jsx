import React, { useState, useEffect } from 'react';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { func, number } from 'prop-types';
import { Loading, TableCustom } from '../../common';
import { useLista } from '../../hooks/useLista';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { CloneObject } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import MedioPagoModal from '../MedioPagoModal';

import './index.css';

const MediosPagoModal = (props) => {

  //hooks
  const [state, setState] = useState({
      showMessage: false,
      loading: false,
      showForm: false,
      rowForm: null,
      list: []
  });

  const [, getRowLista ] = useLista({
    listas: ['TipoMedioPago'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {

      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoMedioPago',
      timeout: 0
    }
  });

  const mount = () => {

    if (props.idCuenta > 0) {
      SearchMediosPago();
    }

  }
  useEffect(mount, [props.idCuenta]);

  const getDescTipoMedioPago = (id) => {
    const row = getRowLista('TipoMedioPago', id);
    return (row) ? row.nombre : '';
  }

  //definiciones
  const cellS = (props) =>    <div className='action'>
                                <div onClick={ (event) => handleClickSelect(props.value) } className="link">
                                    <i className="fa fa-arrow-left" title="seleccionar"></i>
                                </div>
                              </div>
  const cellV = (props) =>    <div className='action'>
                                <div onClick={ (event) => handleClickView(props.value) } className="link">
                                    <i className="fa fa-search" title="ver"></i>
                                </div>
                              </div>

  const tableColumns = [
    { Header: '', Cell: cellS, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Titular', accessor: 'titular', width: '35%' },
    { Header: 'Medio de Pago', accessor: 'detalleMedioPago', width: '55%' },
    { Header: '', Cell: cellV, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickSelect = (id) => {
    const row = state.list.find(f => f.id === id);
    props.onConfirm(id, CloneObject(row));
  }

  const handleClickView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, rowForm: rowForm};
    });
  }

  const handleClickSinSeleccion = () => {
    props.onConfirm(0, null);
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

  //funciones
  function SearchMediosPago() {

      setState(prevState => {
          return {...prevState, loading: true, list: []};
      });
      
      const callbackSuccess = (response) => {
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

      const paramsUrl = `/cuenta/${props.idCuenta}`;
      
      ServerRequest(
          REQUEST_METHOD.GET,
          null,
          true,
          APIS.URLS.MEDIO_PAGO,
          paramsUrl,
          null,
          callbackSuccess,
          callbackNoSuccess,
          callbackError
      );        
  }

  return (
    <div className='medio-pago-modal'>

      <Loading visible={state.loading}></Loading>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-xl">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Selección de Medio de Pago</h5>
            </div>
            <div className="modal-body">

            {state.showForm && 
                <MedioPagoModal
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
                  showFilterGlobal={true}
                  showPagination={false}
                  className={'TableCustomBase'}
                  columns={tableColumns}
                  data={state.list}
                  onClickRow={({ original }, colId) => colId !== 'abm' && props.onClickRow(original.id, original, colId)}
              />

            </div>
            <div className="modal-footer">
              <div className='footer-action-container'>
                <button className="btn back-button float-start" data-dismiss="modal" onClick={ (event) => handleClickSinSeleccion() }>Sin selección</button>
                <button className="btn btn-outline-primary float-end" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

MediosPagoModal.propTypes = {
  idCuenta: number.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired
};

export default MediosPagoModal;
