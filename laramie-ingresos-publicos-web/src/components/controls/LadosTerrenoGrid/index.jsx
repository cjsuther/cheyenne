import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { object, func, bool, string } from 'prop-types';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import LadoTerrenoModal from '../LadoTerrenoModal';
import LadosTerrenoServicioGrid from '../LadosTerrenoServicioGrid';
import LadosTerrenoObraGrid from '../LadosTerrenoObraGrid';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';
import { getFormatNumber } from '../../../utils/convert';

const LadosTerrenoGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idInmueble: 0,
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
        idInmueble: props.data.idInmueble,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [getListLista, getRowLista] = useLista({
    listas: ['TipoLado','TipoGeoreferencia'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoLado_TipoGeoreferencia',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickLadoTerrenoAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickLadoTerrenoView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickLadoTerrenoModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickLadoTerrenoRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickLadoTerrenoDataTagger(data.value) } className="link">
                                      <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>
                              </div>
  const cellE = ({row}) =>    <div className='action' {...row.getToggleRowExpandedProps()}>
                                <div className="link">
                                  {row.isExpanded ? 
                                    <i className="fa fa-angle-down icon-expanded"></i> :
                                    <i className="fa fa-angle-right"></i>
                                  }
                                </div>
                              </div>

  const getDescTipoLado = (id) => {
    const row = getRowLista('TipoLado', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: '', Cell: cellE, id:'expnader', width: '2%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Número', accessor: 'numero', width: '20%' },
    { Header: 'Tipo', Cell: (props) => getDescTipoLado(props.value), accessor: 'idTipoLado', width: '30%' },
    { Header: 'Metros', Cell: (props) => getFormatNumber(props.value,2), accessor: 'metros', width: '30%', alignCell: 'right' },
    { Header: 'Reducción', Cell: (props) => getFormatNumber(props.value,2), accessor: 'reduccion', width: '20%', alignCell: 'right' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '8%', disableGlobalFilter: true, disableSortBy: true }
  ];

  const subComponent = ({row}) => (

    <div className='form-sub-component'>
      <div className='row'>
        <div className="col-md-6 col-12 p-top-10">
          <label className="form-label">Servicios</label>
          <LadosTerrenoServicioGrid
              processKey={props.processKey}
              disabled={props.disabled}
              data={{
                idLadoTerreno: row.original.id,
                list: row.original.ladosTerrenoServicio
              }}
              onChange={(typeEntity, row) => {
                props.onChange(typeEntity, row);
              }}
          />
        </div>
        <div className="col-md-6 col-12 p-top-10">
          <label className="form-label">Obras</label>
          <LadosTerrenoObraGrid
              processKey={props.processKey}
              disabled={props.disabled}
              data={{
                idLadoTerreno: row.original.id,
                list: row.original.ladosTerrenoObra
              }}
              onChange={(typeEntity, row) => {
                props.onChange(typeEntity, row);
              }}
          />
        </div>
      </div>
    </div>

  );

  //handles
  const handleClickLadoTerrenoAdd = () => {
    const listTipoGeoreferencia = getListLista('TipoGeoreferencia');
    const idTipoGeoreferencia = (listTipoGeoreferencia.length > 0) ? listTipoGeoreferencia[0].id : 530; //el primero u Open Street Map

    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idInmueble: state.idInmueble,
        idTipoLado: 0,
        numero: 0,
        metros: 0,
        reduccion: 0,
        direccion: {
          id: 0,
          entidad: "LadoTerreno",
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
        ladosTerrenoServicio: [],
        ladosTerrenoObra: [],
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickLadoTerrenoView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickLadoTerrenoModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickLadoTerrenoRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }
  const handleClickLadoTerrenoDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }

  //funciones
  function RemoveLadoTerreno(row) {
    row.state = 'r';
    props.onChange('LadoTerreno', row);
  }

  function UpdateLadoTerreno(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('LadoTerreno', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
        <DataTaggerModalRedux
            title="Información adicional de Lado del Terreno"
            processKey={props.processKey}
            entidad="LadoTerreno"
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
              RemoveLadoTerreno(row);
            }}
        />
    }

    {state.showForm && 
        <LadoTerrenoModal
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
              UpdateLadoTerreno(row);
            }}
        />
    }

    <TableCustom
        showFilterGlobal={false}
        showPagination={false}
        className={'TableCustomBase'}
        columns={tableColumns}
        data={state.list}
        subComponent={subComponent}
    />

  </>
  );
}

LadosTerrenoGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

LadosTerrenoGrid.defaultProps = {
  disabled: false
};

export default LadosTerrenoGrid;