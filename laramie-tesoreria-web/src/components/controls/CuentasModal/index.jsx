import React, { useState, useEffect } from 'react';
import { func, number } from 'prop-types';

import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import {
    TableCustom,
    InputLista,
    AdvancedSearch,
    InputPersona,
    InputWithEnterEvent
} from '../../common';
import { useForm, useLista, useManagedContext } from '../../hooks';
import { ServerRequest } from '../../../utils/apiweb';
import ShowToastMessage from '../../../utils/toast';
import { CloneObject } from '../../../utils/helpers';
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { MASK_FORMAT } from '../../../consts/maskFormat';
import { APPCONFIG } from '../../../app.config';
import { TIPO_TRIBUTO_URLS } from './consts';
import { openTempView } from '../../../utils/openTempView';
import { SelectTipoTributoModal } from './components/SelectTipoTributoModal';

import './index.css';

const CuentasModal = (props) => {
  const { setIsLoading } = useManagedContext()

  //hooks
 const [list, setList] = useState()
 const [showSelectTributoModal, setShowSelectTributoModal] = useState(false)

  const [filters, setFilters] = useState({
    labels: [
      { title: 'Tipo de tributo', field: 'descTipoTributo', value: '', valueIgnore: '', fieldOriginal: 'idTipoTributo', valueIgnoreOriginal: 0},
      { title: 'Persona', field: 'descPersona', value: '', valueIgnore: '', fieldOriginal: 'idPersona', valueIgnoreOriginal: 0},
      { title: 'N° cuenta', field: 'numeroCuenta', value: '', valueIgnore: '' },
      { title: 'Etiqueta', field: 'etiqueta', value: '', valueIgnore: '' }
    ]
  });

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoTributo: 0,
    descTipoTributo: '', //no existe como control, se usa para tomar el text de idTipoTributo
    idPersona: 0,
    descPersona: '', //no existe como control, se usa para tomar el text de idPersona
    numeroCuenta: '',
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
    { Header: 'Tipo de tributo', Cell: (props) => { return getDescTipoTributo(props.value); }, accessor: 'idTipoTributo', width: '25%' },
    { Header: 'N° cuenta', accessor: 'numeroCuenta', width: '25%' },
    { Header: 'Títular', Cell: (props) => {
        const row = props.row.original;
        const tipoDocumentoContribuyente = getDescTipoDocumento(row.idTipoDocumentoContribuyente);
        return `${row.nombreContribuyente} (${tipoDocumentoContribuyente} ${row.numeroDocumentoContribuyente})`; 
      }, accessor: 'idContribuyente', width: '40%' },
    { Header: cellA, Cell: cellV, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickSelect = (id) => {
    const row = list.find(f => f.id === id);
    props.onConfirm(id, CloneObject(row));
  }
  const handleClickAdd = (id) => {
    setList([])
    setShowSelectTributoModal(true)
  }
  const handleClickView = (id) => {
    const { idTipoTributo, idTributo } = list.find(x => x.id === id)
    const urlTributo = TIPO_TRIBUTO_URLS[idTipoTributo]
    openTempView(`${APPCONFIG.SITE.WEBAPP}${urlTributo}/view/${idTributo}`)
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
      setIsLoading(false)
    })
    .catch((error) => {
        const message = 'Error procesando respuesta: ' + error;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setIsLoading(false)
    });
  }
  const callbackError = (error) => {
    const message = 'Error procesando solicitud: ' + error.message;
    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
    setIsLoading(false)
  }

  //funciones
  function SearchCuentas() {
      setIsLoading(true)
      setList([])
      
      const callbackSuccess = (response) => {
          response.json()
          .then((data) => {
              setIsLoading(false)
              setList(data)
          })
          .catch((error) => {
              const message = 'Error procesando respuesta: ' + error;
              ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
              setIsLoading(false)
          });
      };

      const paramsUrl = `/filter?`+
      `idCuenta=0&`+
      `idTipoTributo=${formValues.idTipoTributo}&`+
      `numeroCuenta=${encodeURIComponent(formValues.numeroCuenta)}&`+
      `numeroWeb=&`+
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
      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-xl">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">Selección de cuenta</h5>
            </div>
            <div className="modal-body">

              <SelectTipoTributoModal
                show={showSelectTributoModal}
                close={() => setShowSelectTributoModal(false)}
              />

              <AdvancedSearch
                formValues={formValues}
                formSet={formSet}
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
              >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="idPersona" className="form-label">Tipo de tributo</label>
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
                        <label htmlFor="numeroCuenta" className="form-label">Número de cuenta</label>
                        <InputWithEnterEvent
                            useInputFormat={true}
                            name="numeroCuenta"
                            placeholder=""
                            className="form-control"
                            mask={MASK_FORMAT.CUENTA}
                            maskPlaceholder={null}
                            value={ formValues.numeroCuenta }
                            onChange={ formHandle }
                            onEnter={ApplyFilters}
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
                    <div className="col-12 col-md-6 col-lg-2">
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
                  className={'TableCustomBase m-top-30'}
                  columns={tableColumns}
                  data={list}
                  onClickRow={({ original }, colId) => !['select', 'abm'].includes(colId) && props.onClickRow(original.id, original, colId)}
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

CuentasModal.propTypes = {
  idTipoTributo: number,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired
};

CuentasModal.defaultProps = {
  idTipoTributo: null
};

export default CuentasModal;
