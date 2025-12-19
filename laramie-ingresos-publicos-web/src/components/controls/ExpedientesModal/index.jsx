import React, { useState } from 'react';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { func } from 'prop-types';
import { Loading, TableCustom, InputLista, AdvancedSearch } from '../../common';
import { useLista } from '../../hooks/useLista';
import { useForm } from '../../hooks/useForm';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { getDateToString } from '../../../utils/convert';
import { CloneObject } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';

import './index.css';

const ExpedientesModal = (props) => {

  //hooks
  const [state, setState] = useState({
      showMessage: false,
      loading: false,
      list: []
  });

  const [filters, setFilters] = useState({
    labels: [
      { title: 'Tipo Expediente', field: 'descTipoExpediente', value: '', valueIgnore: ''},
      { title: 'Expediente', field: 'expediente', value: '', valueIgnore: '' },
      { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
    ]
  });

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoExpediente: 0,
    descTipoExpediente: '', //no existe como control, se usa para tomar el text del tipo
    expediente: '',
    etiqueta: ''
  });

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

  const getDescTipoExpediente = (id) => {
    const row = getRowLista('TipoExpediente', id);
    return (row) ? row.nombre : '';
  }

  //definiciones
  const cellA = (props) =>    <div className='action'>
                                <div onClick={ (event) => handleClickAdd() } className="link">
                                    <i className="fa fa-plus" title="nuevo"></i>
                                </div>
                              </div>
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
    { Header: 'Tipo Expediente', Cell: (props) => {
        const row = props.row.original;
        return getDescTipoExpediente(row.idTipoExpediente);
      }, id: 'tipo', accessor: 'tipo', width: '20%' },
    { Header: 'Expediente', accessor: 'detalleExpediente', width: '55%' },
    { Header: 'Fecha creación', Cell: (data) => (data.value) ? getDateToString(data.value, false) : '', accessor: 'fechaCreacion', width: '20%' },
    { Header: cellA, Cell: cellV, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickSelect = (id) => {
    const row = state.list.find(f => f.id === id);
    props.onConfirm(id, CloneObject(row));
  }
  const handleClickAdd = (id) => {
    ShowToastMessage(ALERT_TYPE.ALERT_INFO, "Funcionalidad en construcción");
  }
  const handleClickView = (id) => {
    ShowToastMessage(ALERT_TYPE.ALERT_INFO, "Funcionalidad en construcción");
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
  function SearchExpedientes() {

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

      const paramsUrl = `/filter?`+
      `idTipoExpediente=${formValues.idTipoExpediente}&`+
      `expediente=${encodeURIComponent(formValues.expediente)}&`+
      `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;
      
      ServerRequest(
          REQUEST_METHOD.GET,
          null,
          true,
          APIS.URLS.EXPEDIENTE,
          paramsUrl,
          null,
          callbackSuccess,
          callbackNoSuccess,
          callbackError
      );        
  }

  function ApplyFilters() {
      UpdateFilters();
      SearchExpedientes();
  }
  function UpdateFilters() {
      let labels = [...filters.labels];
      labels.forEach((label) => {
          label.value = formValues[label.field];
      });
      setFilters(prevState => {
          return {...prevState, labels: labels};
      });
  }


  return (
    <div className='expediente-modal'>

      <Loading visible={state.loading}></Loading>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-xl">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Selección de Expediente</h5>
            </div>
            <div className="modal-body">

              <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
              >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idPersona" className="form-label">Tipo Expediente</label>
                        <InputLista
                            name="idTipoExpediente"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoExpediente }
                            onChange={({target}) =>{
                                let idTipoExpediente = 0;
                                let descTipoExpediente = '';
                                if (target.row) {
                                    idTipoExpediente = parseInt(target.value);
                                    descTipoExpediente = target.row.nombre;
                                }
                                formSet({...formValues, idTipoExpediente: idTipoExpediente, descTipoExpediente: descTipoExpediente});
                            }}
                            lista="TipoExpediente"
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="expediente" className="form-label">Expediente</label>
                        <input
                            name="expediente"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.expediente }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="etiqueta" className="form-label">Etiqueta</label>
                        <input
                            name="etiqueta"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.etiqueta }
                            onChange={ formHandle }
                        />
                    </div>
                </div>

              </AdvancedSearch>

              <TableCustom
                  showFilterGlobal={true}
                  showPagination={false}
                  className={'TableCustomBase m-top-30'}
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

ExpedientesModal.propTypes = {
  onConfirm: func.isRequired,
  onDismiss: func.isRequired
};

export default ExpedientesModal;
