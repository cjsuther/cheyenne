import React, { useState, useEffect } from 'react';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { func, number } from 'prop-types';
import { Loading, TableCustom, AdvancedSearch, InputFormat, InputTasa } from '../../common';
import { useForm } from '../../hooks/useForm';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { CloneObject } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';

import './index.css';
import { useEntidad } from '../../hooks/useEntidad';

const SubTasasModal = (props) => {

  //hooks
  const [state, setState] = useState({
      showMessage: false,
      loading: false,
      list: []
  });

  const [filters, setFilters] = useState({
      labels: [
          { title: 'Tasa', field: 'descTasa', value: '', valueIgnore: ''},
          { title: 'Código', field: 'codigo', value: '', valueIgnore: ''},
          { title: 'Descripción', field: 'descripcion', value: '', valueIgnore: '' },
          { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
      ]
  });

  const [ formValues, formHandle, , formSet] = useForm({
      idTasa: 0,
      descTasa: '',
      codigo: '',
      descripcion: '',
      etiqueta: ''
  });

  useEffect(() => {

    if (props.idTasa) {
      formSet({...formValues,
        idTasa: props.idTasa
      });
      if (props.idTasa > 0) {
        SearchSubTasas(props.idTasa);
      }
    }

  }, [props.idTasa]);


  const [, getRowEntidad] = useEntidad({
    entidades: ['Tasa'],
    onLoaded: (entidades, isSuccess, error) => {
      if (!isSuccess) {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Tasa',
      timeout: 0
    }
  });

  const getDescTasa = (id) => {
    const row = getRowEntidad('Tasa', id);
    return (row) ? `${row.codigo} - ${row.descripcion}` : '';
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
    { Header: 'Tasa', Cell: (props) => { return getDescTasa(props.value); }, accessor: 'idTasa', width: '40%' },
    { Header: 'Sub Tasa', Cell: (props) => {
        const row = props.row.original;
        const descripcionTasa = `${row.codigo} - ${row.descripcion}`;
        return descripcionTasa;
      }, id: 'subTasa', accessor: 'id', width: '50%' },
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
  function SearchSubTasas(idTasa = null) {

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

    let paramsUrl = `/filter?`+
    `idTasa=${(idTasa) ? idTasa : formValues.idTasa}&`+
    `codigo=${encodeURIComponent(formValues.codigo)}&`+
    `descripcion=${encodeURIComponent(formValues.descripcion)}&`+
    `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;
    
    ServerRequest(
        REQUEST_METHOD.GET,
        null,
        true,
        APIS.URLS.SUB_TASA,
        paramsUrl,
        null,
        callbackSuccess,
        callbackNoSuccess,
        callbackError
    );        
}

  function ApplyFilters() {
      UpdateFilters();
      SearchSubTasas();
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
    <div className='sub-tasa-modal'>

      <Loading visible={state.loading}></Loading>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-xl">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Selección de Sub Tasa</h5>
            </div>
            <div className="modal-body">

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idTasa" className="form-label">Tasa</label>
                        <InputTasa
                            name="idTasa"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTasa }
                            onChange={({target}) =>{
                              let idTasa = 0;
                              let descTasa = '';
                              if (target.row) {
                                idTasa = parseInt(target.value);
                                descTasa = target.row.descripcion;
                              }
                              formSet({...formValues, idTasa: idTasa, descTasa: descTasa});
                          }}
                            disabled={(props.idTasa !== null)}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="codigo" className="form-label">Código</label>
                        <InputFormat
                            name="codigo"
                            placeholder=""
                            className="form-control"
                            maskPlaceholder={null}
                            value={ formValues.codigo }
                            onChange={ formHandle }
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <input
                            name="descripcion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.descripcion }
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

SubTasasModal.propTypes = {
  idTasa: number,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired
};

SubTasasModal.defaultProps = {
  idTasa: null
};

export default SubTasasModal;
