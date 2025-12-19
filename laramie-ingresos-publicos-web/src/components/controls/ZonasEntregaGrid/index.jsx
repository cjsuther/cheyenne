import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import { useEntidad } from '../../hooks/useEntidad';
import ZonaEntregaModal from '../ZonaEntregaModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';


const ZonasEntregaGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idCuenta: 0,
      disabled: false,
      showMessage: false,
      showForm: false,
      modeFormEdit: false,
      rowForm: null,
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
        idCuenta: props.data.idCuenta,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [getListLista, ] = useLista({
    listas: ['TipoGeoreferencia'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {

      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoGeoreferencia',
      timeout: 0
    }
  });

  const [, getRowEntidad] = useEntidad({
    entidades: ['TipoControlador','Provincia','Localidad'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoControlador_Provincia_Localidad',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && state.list.length < 1 && (
                                  <div onClick={ (event) => handleClickZonaEntregaAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickZonaEntregaView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickZonaEntregaModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickZonaEntregaRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickZonaEntregaDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                 
                              </div>

  const getDescTipoControlador = (id) => {
    const row = getRowEntidad('TipoControlador', id);
    return (row) ? row.nombre : '';
  }
  const getDescProvincia = (id) => {
    const row = getRowEntidad('Provincia', id);
    return (row) ? row.nombre : '';
  }
  const getDescLocalidad = (id) => {
    const row = getRowEntidad('Localidad', id);
    return (row) ? row.nombre : '';
  }

  const getDomicilioPostal = (direccion) => {

    const calle = getDescProvincia(direccion.idProvincia) + ', ' +
                  getDescLocalidad(direccion.idLocalidad) + ', ' +
                  `${direccion.calle} ${direccion.altura} ${direccion.piso} ${direccion.dpto} (CP ${direccion.codigoPostal})`;

    return calle;
  }

  const tableColumns = [
    { Header: 'Tipo Controlador', Cell: (props) => getDescTipoControlador(props.value), accessor: 'idTipoControlador', width: '20%' },
    { Header: 'Datos de entrega', Cell: (props) => {
        const rowZonaEntrega = props.row.original;
        const rowTipoControlador = getRowEntidad('TipoControlador', rowZonaEntrega.idTipoControlador);
        return (rowTipoControlador && rowTipoControlador.email) ? rowZonaEntrega.email :
               (rowTipoControlador && rowTipoControlador.direccion) ? getDomicilioPostal(rowZonaEntrega.direccion) : '';
      }, id: 'calle', accessor: 'id', width: '75%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickZonaEntregaAdd = () => {
    const listTipoGeoreferencia = getListLista('TipoGeoreferencia');
    const idTipoGeoreferencia = (listTipoGeoreferencia.length > 0) ? listTipoGeoreferencia[0].id : 530; //el primero u Open Street Map

    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idCuenta: state.idCuenta,
        idTipoControlador: 0,
        email: "",
        direccion: {
          id: 0,
          entidad: "ZonaEntrega",
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
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickZonaEntregaView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickZonaEntregaModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickZonaEntregaRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickZonaEntregaDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }  

  //funciones
  function RemoveZonaEntrega(row) {
    row.state = 'r';
    props.onChange('ZonaEntrega', row);
  }

  function UpdateZonaEntrega(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('ZonaEntrega', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Zona de Entrega"
          processKey={props.processKey}
          entidad="ZonaEntrega"
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
              RemoveZonaEntrega(row);
            }}
        />
    }

    {state.showForm && 
        <ZonaEntregaModal
            processKey={props.processKey}
            disabled={!state.modeFormEdit}
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
              UpdateZonaEntrega(row);
            }}
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

ZonasEntregaGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

ZonasEntregaGrid.defaultProps = {
  disabled: false
};

export default ZonasEntregaGrid;