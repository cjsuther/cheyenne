import React, { useState } from 'react';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { func, number } from 'prop-types';
import {Loading, TableCustom, AdvancedSearch, InputWithEnterEvent} from '../../common';
import { useLista } from '../../hooks/useLista';
import { useForm } from '../../hooks/useForm';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { CloneObject } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { MASK_FORMAT } from '../../../consts/maskFormat';

import './index.css';
import { APPCONFIG } from '../../../app.config';
import PersonasTipoModal from './components/PersonasTipoModal';
import { getAccess } from '../../../utils/access';

const PersonasModal = (props) => {

  //#region Hooks
  const [state, setState] = useState({
      showMessage: false,
      loading: false,
      list: []
  });

  const [filters, setFilters] = useState({
    labels: [
        { title: 'Documento', field: 'numeroDocumento', value: '', valueIgnore: ''},
        { title: 'Nombre', field: 'nombrePersona', value: '', valueIgnore: '' },
        { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
    ]
  });

  const [showPersonasTipoModal, setShowPersonasTipoModal] = useState(false)

  const [ formValues, formHandle, , formSet] = useForm({
    numeroDocumento: '',
    nombrePersona: '',
    etiqueta: ''
  });

  const [, getRowLista ] = useLista({
    listas: ['TipoDocumento', 'TipoPersona'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {

      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoDocumento_TipoPersona',
      timeout: 0
    }
  });

  const getDescTipoDocumento = (id) => {
    const row = getRowLista('TipoDocumento', id);
    return (row) ? row.nombre : '';
  }
  const getDescTipoPersona = (id) => {
    const row = getRowLista('TipoPersona', id);
    return (row) ? row.nombre : '';
  }
  
  //#endregion

  //#region Definiciones
  const cellA = (props) =>    <div className='action'>
                                <div onClick={ (event) => handleClickAdd() } className="link">
                                    <span className="material-symbols-outlined" title="Nuevo">add</span>
                                </div>
                              </div>
  const cellS = (props) =>    <div className='action'>
                                <div onClick={ (event) => handleClickSelect(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                              </div>
  const cellV = (props) =>    <div className='action'>
                                <div onClick={ (event) => handleClickView(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Ver">search</span>
                                </div>
                              </div>

  const tableColumns = [
    { Header: '', Cell: cellS, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Tipo persona', accessor: 'descTipoPersona', width: '20%' },
    { Header: 'Documento', accessor: 'descDocumento', width: '25%' },
    { Header: 'Nombre', accessor: 'nombrePersona', width: '45%' },
    { Header: cellA, Cell: cellV, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
  ];
  //#endregion

  //#region Handles
  const handleClickSelect = (id) => {
    const row = state.list.find(f => f.id === id);
    props.onConfirm(id, CloneObject(row));
  }
  const handleClickAdd = (id) => {
    setShowPersonasTipoModal(true)
  }
  const handleClickView = (id) => {
    const persona = state.list.find(x => x.id === id)
    const tipo = persona.idTipoPersona === 500 ? 'fisica' : 'juridica'
    const { token } = getAccess()
    window.open(`${APPCONFIG.SITE.WEBAPP_ADMINISTRACION}persona-${tipo}/nh/view/${id}?token=${token}`, '_blank')
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
  function SearchPersonas() {

      setState(prevState => {
          return {...prevState, loading: true, list: []};
      });
      
      const callbackSuccess = (response) => {
          response.json()
          .then((data) => {
              data.forEach(x => {
                  if (x.idTipoPersona === 500/*PersonaFísica*/) {
                    if (x.fechaNacimiento) x.fechaNacimiento = new Date(x.fechaNacimiento);
                    if (x.fechaDefuncion) x.fechaDefuncion = new Date(x.fechaDefuncion);
                  }
                  else if (x.idTipoPersona === 501/*PersonaJuridica*/){
                    if (x.fechaConstitucion) x.fechaConstitucion = new Date(x.fechaConstitucion);
                  }
                  x.descTipoPersona = getDescTipoPersona(x.idTipoPersona);
                  x.descDocumento = `${getDescTipoDocumento(x.idTipoDocumento)} ${x.numeroDocumento}`;
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

      const paramsUrl = `/filter?`+
      `idTipoPersona=${props.idTipoPersona??0}&`+
      `numeroDocumento=${encodeURIComponent(formValues.numeroDocumento)}&`+
      `nombrePersona=${encodeURIComponent(formValues.nombrePersona)}&`+
      `etiqueta=${encodeURIComponent(formValues.etiqueta)}`;
      
      ServerRequest(
          REQUEST_METHOD.GET,
          null,
          true,
          APIS.URLS.PERSONA,
          paramsUrl,
          null,
          callbackSuccess,
          callbackNoSuccess,
          callbackError
      );        
  }

  function ApplyFilters() {
      UpdateFilters();
      SearchPersonas();
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
  //#endregion

  return (
    <div className='persona-modal'>

      <Loading visible={state.loading}></Loading>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-xl">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Selección de persona</h5>
            </div>
            <div className="modal-body">
              {showPersonasTipoModal && (
                <PersonasTipoModal
                  onAccept={() => { setState(prev => ({ ...prev, list: [] })) }}
                  close={() => setShowPersonasTipoModal(false)}
                />
              )}

              <AdvancedSearch
                formValues={formValues}
                formSet={formSet}
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
              >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="numeroDocumento" className="form-label">Número de documento</label>
                        <InputWithEnterEvent
                            useInputFormat={true}
                            name="numeroDocumento"
                            placeholder=""
                            className="form-control"
                            mask={MASK_FORMAT.DOCUMENTO}
                            maskPlaceholder={null}
                            value={ formValues.numeroDocumento }
                            onChange={ formHandle }
                            onEnter={ApplyFilters}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="nombrePersona" className="form-label">Nombre</label>
                        <InputWithEnterEvent
                            name="nombrePersona"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.nombrePersona }
                            onChange={ formHandle }
                            onEnter={ApplyFilters}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="etiqueta" className="form-label">Etiqueta</label>
                        <InputWithEnterEvent
                            name="etiqueta"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.etiqueta }
                            onChange={ formHandle }
                            onEnter={ApplyFilters}
                        />
                    </div>
                </div>

              </AdvancedSearch>

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

PersonasModal.propTypes = {
  idTipoPersona: number.isRequired,
  filter: func,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired
};

PersonasModal.defaultProps = {
  filter: x => true
};

export default PersonasModal;
