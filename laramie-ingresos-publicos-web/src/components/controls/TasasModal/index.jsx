import React, { useState, useEffect } from 'react';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { func, number } from 'prop-types';
import { Loading, TableCustom, AdvancedSearch, InputFormat } from '../../common';
import { useLista } from '../../hooks/useLista';
import { useForm } from '../../hooks/useForm';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { CloneObject } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';

import './index.css';
import { useEntidad } from '../../hooks/useEntidad';

const TasasModal = (props) => {

  //hooks
  const [state, setState] = useState({
      showMessage: false,
      loading: false,
      list: []
  });

  const [filters, setFilters] = useState({
      labels: [
          { title: 'Codigo', field: 'codigo', value: '', valueIgnore: ''},
          { title: 'Descripción', field: 'descripcion', value: '', valueIgnore: '' },
          { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
      ]
  });

  const [ formValues, formHandle, , formSet] = useForm({
      codigo: '',
      descripcion: '',
      idTipoTributo: 0,
      descTipoTributo: '',
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
    listas: ['TipoTributo'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoTributo',
      timeout: 0
    }
  });

  const [, getRowEntidad] = useEntidad({
    entidades: ['CategoriaTasa'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'CategoriaTasa',
      timeout: 0
    }
  });

  const getDescTipoTributo = (id) => {
    const row = getRowLista('TipoTributo', id);
    return (row) ? row.nombre : '';
  }    

  const getDescCategoriaTasa = (id) => {
    const row = getRowEntidad('CategoriaTasa', id);
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
    { Header: 'Código', id: 'codigo', accessor: 'codigo', width: '10%' },        
    { Header: 'Descripción', accessor: 'descripcion', width: '40%' },
    { Header: 'Tipo tributo', Cell: (props) => {
        const row = props.row.original;
        const tipoTributo = getDescTipoTributo(row.idTipoTributo);
        return tipoTributo;
      }, accessor: 'tipoTributo', width: '20%' },
    { Header: 'Categoría', Cell: (props) => {
        const row = props.row.original;
        const categoriaTasa = getDescCategoriaTasa(row.idCategoriaTasa);
        return categoriaTasa;
      }, accessor: 'idCategoriaTasa', width: '20%' },
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
  function SearchTasas() {

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
    `codigo=${encodeURIComponent(formValues.codigo)}&`+
    `descripcion=${encodeURIComponent(formValues.descripcion)}&`+
    `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;
    
    ServerRequest(
        REQUEST_METHOD.GET,
        null,
        true,
        APIS.URLS.TASA,
        paramsUrl,
        null,
        callbackSuccess,
        callbackNoSuccess,
        callbackError
    );        
}

  function ApplyFilters() {
      UpdateFilters();
      SearchTasas();
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
    <div className='tasa-modal'>

      <Loading visible={state.loading}></Loading>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-xl">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Selección de Tasa</h5>
            </div>
            <div className="modal-body">

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>
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

TasasModal.propTypes = {
  idTipoTributo: number,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired
};

TasasModal.defaultProps = {
  idTipoTributo: null
};

export default TasasModal;
