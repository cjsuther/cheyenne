import React, { useEffect, useState } from 'react';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { func } from 'prop-types';
import {Loading, TableCustom} from '../../common';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { CloneObject } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import './index.css';

const UsuariosModal = (props) => {

  const [state, setState] = useState({
      showMessage: false,
      loading: false,
      list: []
  });

  useEffect(()=> {
    SearchUsuarios();
  },[])

  const cellS = (props) =>    <div className='action'>
                                <div onClick={ (event) => handleClickSelect(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                              </div>

  const tableColumns = [
    { Header: '', Cell: cellS, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Usuario/a', accessor: 'codigo', width: '25%' },
    { Header: 'Nombre y apellido', accessor: 'nombreApellido', width: '35%' },
    { Header: 'E-Mail', accessor: 'email', width: '35%' }
  ];
  
  //#region Handles
  const handleClickSelect = (id) => {
    const row = state.list.find(f => f.id === id);
    props.onConfirm(id, CloneObject(row));
  }

  const handleClickSinSeleccion = () => {
    props.onConfirm(0, null);
  }

  //#endregion

  //#region Callbacks
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
  //#endregion

  //#region Functions
  function SearchUsuarios() {

      setState(prevState => {
          return {...prevState, loading: true, list: []};
      });
      
      const callbackSuccess = (response) => {
          response.json()
          .then((data) => {
              data.forEach(row => {
                if (row.fechaAlta) row.fechaAlta = new Date(row.fechaAlta);
              });
              const listFilter = data.filter(props.filter);
              setState(prevState => {
                  return {...prevState, loading: false, list: listFilter};
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

      ServerRequest(
          REQUEST_METHOD.GET,
          null,
          true,
          APIS.URLS.USUARIO,
          null,
          null,
          callbackSuccess,
          callbackNoSuccess,
          callbackError
      );        
  }

  //#endregion

  return (
    <div className='usuario-modal'>

      <Loading visible={state.loading}></Loading>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-xl">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Selección de usuario/a</h5>
            </div>
            <div className="modal-body">
              <TableCustom
                  showFilterGlobal={true}
                  className={'TableCustomBase m-top-30'}
                  columns={tableColumns}
                  data={state.list}
                  onClickRow={({ original }, colId) => colId !== 'abm' && props.onClickRow(original.id, original, colId)}
              />

            </div>
            <div className="modal-footer">
              <div className='footer-action-container'>
                  <button className="btn btn-outline-primary float-end" data-dismiss="modal" onClick={ (event) => handleClickSinSeleccion() }>Sin selección</button>
                  <button className="btn back-button float-start" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Volver</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

UsuariosModal.propTypes = {
  onConfirm: func.isRequired,
  onDismiss: func.isRequired
};

export default UsuariosModal;
