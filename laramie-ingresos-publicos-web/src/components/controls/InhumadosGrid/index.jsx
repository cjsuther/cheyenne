import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import InhumadoModal from '../InhumadoModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { getDateToString } from '../../../utils/convert';
import { isNull } from '../../../utils/validator';

const InhumadosGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idCementerio: 0,
      disabled: false,
      showMessage: false,
      showForm: false,
      modeFormEdit: false,
      rowForm: null,
      showChildren: false,
      dataTagger: {
        showModal: false,
        idEntidad: null
      },      
      list: []
  });

  const dispatch = useDispatch();
  const sequenceValue = useSelector( (state) => state.sequence.value );

  const mount = () => {
    setState(prevState => {
      const list = props.data.list.filter(x => x.state !== 'r');
      return {...prevState,
        idCementerio: props.data.idCementerio,
        list: list };
    });
  }
  useEffect(mount, [props.data]);
  
  const [getListLista, getRowLista] = useLista({
    listas: ['TipoDocumento','TipoGeoreferencia'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoDocumento_TipoGeoreferencia',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickInhumadoAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickInhumadoView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickInhumadoModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickInhumadoRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickInhumadoDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>
                              </div>


  const getDescTipoDocumento = (id) => {
    const row = getRowLista('TipoDocumento', id);
    return (row) ? row.nombre : '';
  }
    
  const tableColumns = [
    { Header: 'Inhumado', Cell: (props) => {
        const row = props.row.original;
        return `${row.nombre} ${row.apellido}`;
        }, id: 'inhumado', accessor: 'inhumado', width: '40%' },      
    { Header: 'Documento', Cell: (props) => {
        const row = props.row.original;
        const tipoDocumento = getDescTipoDocumento(row.idTipoDocumento);
        return `${tipoDocumento} ${row.numeroDocumento}`;
        }, id: 'documento', accessor: 'documento', width: '20%' },      
    { Header: 'Fecha Defunción', Cell: (data) => (data.value) ? getDateToString(data.value, false) : '', accessor: 'fechaDefuncion', width: '15%' },
    { Header: 'Fecha Ingreso', Cell: (data) => (data.value) ? getDateToString(data.value, false) : '', accessor: 'fechaIngreso', width: '15%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];

  //handles
  const handleClickInhumadoAdd = () => {
    const listTipoGeoreferencia = getListLista('TipoGeoreferencia');
    const idTipoGeoreferencia = (listTipoGeoreferencia.length > 0) ? listTipoGeoreferencia[0].id : 530; //el primero u Open Street Map

    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idCementerio: state.idCementerio,
        idTipoDocumento: 0,
        numeroDocumento: '',
        apellido: '',
        nombre: '',
        fechaNacimiento: null,
        idGenero: 0,
        idEstadoCivil: 0,
        idNacionalidad: 0,
        fechaDefuncion: null,
        fechaIngreso: null,
        idMotivoFallecimiento: 0,
        idCocheria: 0,
        numeroDefuncion: '',
        libro: '',
        folio: '',
        idRegistroCivil: 0,
        acta: '',
        idTipoOrigenInhumacion: 0,
        observacionesOrigen: '',
        idTipoCondicionEspecial: 0,
        fechaEgreso: null,
        fechaTraslado: null,
        idTipoDestinoInhumacion: 0,
        observacionesDestino: '',
        fechaExhumacion: null,
        fechaReduccion: null,
        numeroReduccion: '',
        unidad: '',
        idTipoDocumentoResponsable: 0,
        numeroDocumentoResponsable: '',
        apellidoResponsable: '',
        nombreResponsable: '',
        fechaHoraInicioVelatorio: null,
        fechaHoraFinVelatorio: null,
        direccion: {
          id: 0,
          entidad: "Inhumado",
          idEntidad: idTemporal,
          idTipoGeoreferencia: idTipoGeoreferencia,
          idPais: 0,
          idProvincia: 0,
          idLocalidad: 0,
          idZonaGeoreferencia: 0,
          codigoPostal: "",
          calle: "",
          entreCalle1: "",
          entreCalle2: "",
          altura: "",
          piso: "",
          dpto: "",
          referencia: "",
          longitud: 0,
          latitud: 0
        },
        verificaciones: [],  
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm, showChildren: false};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickInhumadoView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm, showChildren: true};
    });
  }
  const handleClickInhumadoModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm, showChildren: true};
    });
  }
  const handleClickInhumadoRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }
  const handleClickInhumadoDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }

  //funciones
  function RemoveInhumado(row) {
    row.state = 'r';
    props.onChange('Inhumado', row);
  }

  function UpdateInhumado(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('Inhumado', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Inhumados"
          processKey={props.processKey}
          entidad="Inhumado"
          idEntidad={state.dataTagger.idEntidad}
          disabled={props.disabled}
          onDismiss={() => {
            setState(prevState => {
              return {...prevState, dataTagger: {showModal: false, idEntidad: null}};
            });
          }}
      />
    }  

    {state.showMessage && 
        <MessageModal
            title={"Confirmación"}
            message={"¿Está seguro de borrar el registro?"}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showMessage: false, rowForm: null};
              });
            }}
            onConfirm={() => {
              const row = CloneObject(state.rowForm);
              setState(prevState => {
                  return {...prevState, showMessage: false, rowForm: null};
              });
              RemoveInhumado(row);
            }}
        />
    }

    {state.showForm && 
        <InhumadoModal
            processKey={props.processKey}
            disabled={!state.modeFormEdit}
            showChildren={state.showChildren}
            data={{
              entity: state.rowForm
            }}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showForm: false, rowForm: null};
              });
            }}
            onConfirm={(row) => {
              setState(prevState => {
                  return {...prevState, showForm: false, rowForm: null};
              });
              UpdateInhumado(row);
            }}
            onChangeChildren={props.onChange}
        />
    }

    <TableCustom
        showFilterGlobal={false}
        showPagination={false}
        className={'TableCustomBase'}
        columns={tableColumns}
        data={state.list}
    />

  </>
  );
}

InhumadosGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

InhumadosGrid.defaultProps = {
  disabled: false
};

export default InhumadosGrid;