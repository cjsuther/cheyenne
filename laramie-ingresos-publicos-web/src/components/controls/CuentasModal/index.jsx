import React, { useState, useEffect } from 'react';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { func, number } from 'prop-types';
import { Loading, TableCustom, InputLista, AdvancedSearch, InputFormat, InputPersona } from '../../common';
import { useLista } from '../../hooks/useLista';
import { useForm } from '../../hooks/useForm';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { CloneObject } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { MASK_FORMAT } from '../../../consts/maskFormat';

import './index.css';

const CuentasModal = (props) => {

  //hooks
  const [state, setState] = useState({
      showMessage: false,
      loading: false,
      list: []
  });

  const [filters, setFilters] = useState({
    labels: [
      { title: 'Tipo Tributo', field: 'descTipoTributo', value: '', valueIgnore: ''},
      { title: 'Persona', field: 'descPersona', value: '', valueIgnore: ''},
      { title: 'Nro. Cuenta', field: 'numeroCuenta', value: '', valueIgnore: '' },
      { title: 'Nro. Web', field: 'numeroWeb', value: '', valueIgnore: '' },
      { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
    ]
  });

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoTributo: 0,
    descTipoTributo: '', //no existe como control, se usa para tomar el text de idTipoTributo
    idPersona: 0,
    descPersona: '', //no existe como control, se usa para tomar el text de idPersona
    numeroCuenta: '',
    numeroWeb: '',
    etiqueta: ''
  });

  useEffect(() => {

    if (props.idTipoTributo) {
      formSet({...formValues,
        idTipoTributo: props.idTipoTributo
      });
    }

}, [props.idTipoTributo]);

  const [, getRowLista ] = useLista({
    listas: ['TipoTributo','TipoDocumento'],
    onLoaded: (listas, isSuccess, error) => {
      if (!isSuccess) {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoTributo_TipoDocumento',
      timeout: 0
    }
  });

  const getDescTipoTributo = (id) => {
    const row = getRowLista('TipoTributo', id);
    return (row) ? row.nombre : '';
  }
  const getDescTipoDocumento = (id) => {
    const row = getRowLista('TipoDocumento', id);
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
    { Header: 'Tipo Tributo', Cell: (props) => { return getDescTipoTributo(props.value); }, accessor: 'idTipoTributo', width: '20%' },
    { Header: 'Nro. Cuenta', accessor: 'numeroCuenta', width: '20%' },
    { Header: 'Clave Web', accessor: 'numeroWeb', width: '20%' },
    { Header: 'Títular', Cell: (props) => {
        const row = props.row.original;
        const tipoDocumentoContribuyente = getDescTipoDocumento(row.idTipoDocumentoContribuyente);
        return `${row.nombreContribuyente} (${tipoDocumentoContribuyente} ${row.numeroDocumentoContribuyente})`; 
      }, accessor: 'idContribuyente', width: '30%' },
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
  function SearchCuentas() {

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
      `idCuenta=0&`+
      `idTipoTributo=${formValues.idTipoTributo}&`+
      `numeroCuenta=${encodeURIComponent(formValues.numeroCuenta)}&`+
      `numeroWeb=${encodeURIComponent(formValues.numeroWeb)}&`+
      `idPersona=${formValues.idPersona}&`+
      `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;
      
      ServerRequest(
          REQUEST_METHOD.GET,
          null,
          true,
          APIS.URLS.CUENTA,
          paramsUrl,
          null,
          callbackSuccess,
          callbackNoSuccess,
          callbackError
      );        
  }

  function ApplyFilters() {
      UpdateFilters();
      SearchCuentas();
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
    <div className='cuenta-modal'>

      <Loading visible={state.loading}></Loading>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-xl">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Selección de Cuenta</h5>
            </div>
            <div className="modal-body">

              <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
              >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="idPersona" className="form-label">Tipo Tributo</label>
                        <InputLista
                            name="idTipoTributo"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoTributo }
                            onChange={({target}) =>{
                                let idTipoTributo = 0;
                                let descTipoTributo = '';
                                if (target.row) {
                                    idTipoTributo = parseInt(target.value);
                                    descTipoTributo = target.row.nombre;
                                }
                                formSet({...formValues, idTipoTributo: idTipoTributo, descTipoTributo: descTipoTributo});
                            }}
                            lista="TipoTributo"
                            disabled={(props.idTipoTributo !== null)}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                        <label htmlFor="numeroCuenta" className="form-label">Número Cuenta</label>
                        <InputFormat
                            name="numeroCuenta"
                            placeholder=""
                            className="form-control"
                            mask={MASK_FORMAT.CUENTA}
                            maskPlaceholder={null}
                            value={ formValues.numeroCuenta }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                        <label htmlFor="numeroWeb" className="form-label">Clave Web</label>
                        <InputFormat
                            name="numeroWeb"
                            placeholder=""
                            className="form-control"
                            mask={MASK_FORMAT.CLAVE_WEB}
                            maskPlaceholder={null}
                            value={ formValues.numeroWeb }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-5">
                        <label htmlFor="idPersona" className="form-label">Persona</label>
                        <InputPersona
                            name="idPersona"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idPersona }
                            idTipoPersona={0}
                            onChange={({target}) =>{
                                let idPersona = 0;
                                let descPersona = '';
                                if (target.row) {
                                    idPersona = parseInt(target.value);
                                    descPersona = target.row.nombrePersona;
                                }
                                formSet({...formValues, idPersona: idPersona, descPersona: descPersona});
                            }}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
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
                  className={'TableCustomBase m-top-30'}
                  columns={tableColumns}
                  data={state.list}
                  onClickRow={({ original }, colId) => !['select', 'abm'].includes(colId) && props.onClickRow(original.id, original, colId)}
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

CuentasModal.propTypes = {
  idTipoTributo: number,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired
};

CuentasModal.defaultProps = {
  idTipoTributo: null
};

export default CuentasModal;
