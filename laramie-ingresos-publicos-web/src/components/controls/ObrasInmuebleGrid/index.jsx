import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import ObraInmuebleModal from '../ObraInmuebleModal';
import ObrasInmuebleDetalleGrid from '../ObrasInmuebleDetalleGrid';
import ShowToastMessage from '../../../utils/toast';
import { getDateToString } from '../../../utils/convert';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';

const ObrasInmuebleGrid = (props) => {

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

  const [, getRowEntidad] = useEntidad({
    entidades: ['Tasa','SubTasa'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Tasa_SubTasa',
      timeout: 0
    }
  });

  const getDescTasa = (id) => {
    const row = getRowEntidad('Tasa', id);
    return (row) ? `${row.codigo} - ${row.descripcion}` : '';
  }
  const getDescSubTasa = (id) => {
    const row = getRowEntidad('SubTasa', id);
    return (row) ? `${row.codigo} - ${row.descripcion}` : '';
}

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickObraInmuebleAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickObraInmuebleView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickObraInmuebleModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickObraInmuebleRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickObraInmuebleDataTagger(data.value) } className="link">
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

  const tableColumns = [
    { Header: '', Cell: cellE, id:'expnader', width: '2%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Tasa', Cell: (data) => getDescTasa(data.value), accessor: 'idTasa', width: '20%' },
    { Header: 'Sub Tasa', Cell: (data) => getDescSubTasa(data.value), accessor: 'idSubTasa', width: '30%' },
    { Header: 'Número', accessor: 'numero', width: '10%' },
    { Header: 'Cuota', accessor: 'cuota', width: '10%' },
    { Header: '1° Vto.', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaPrimerVencimiento', width: '10%' },
    { Header: '2° Vto.', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaSegundoVencimiento', width: '10%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '8%', disableGlobalFilter: true, disableSortBy: true }
  ];

  const subComponent = ({row}) => (

    <div className='form-sub-component'>
      <div className='row'>
        <div className="col-12 p-top-10">
          <label className="form-label">Detalles</label>
          <ObrasInmuebleDetalleGrid
              processKey={props.processKey}
              disabled={props.disabled}
              data={{
                idObraInmueble: row.original.id,
                list: row.original.obrasInmuebleDetalle
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
  const handleClickObraInmuebleAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idInmueble: state.idInmueble,
        idTasa: 0,
        idSubTasa: 0,
        idTipoMovimiento: 0,
        numero: '',
        cuota: 0,
        fechaPrimerVencimiento: null,
        fechaSegundoVencimiento: null,
        idExpediente: 0,
        detalleExpediente: '',
        idTipoPersona: 0,
        idPersona: 0,
        nombrePersona: '',
        idTipoDocumento: 0,
        numeroDocumento: '',
        fechaPresentacion: null,
        fechaInspeccion: null,
        fechaAprobacion: null,
        fechaInicioDesglose: null,
        fechaFinDesglose: null,
        fechaFinObra: null,
        fechaArchivado: null,
        fechaIntimado: null,
        fechaVencidoIntimado: null,
        fechaMoratoria: null,
        fechaVencidoMoratoria: null,
        obrasInmuebleDetalle: [],
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickObraInmuebleView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickObraInmuebleModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickObraInmuebleRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickObraInmuebleDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }  

  //funciones
  function RemoveObraInmueble(row) {
    row.state = 'r';
    props.onChange('ObraInmueble', row);
  }

  function UpdateObraInmueble(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('ObraInmueble', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Obra"
          processKey={props.processKey}
          entidad="ObraInmueble"
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
              RemoveObraInmueble(row);
            }}
        />
    }

    {state.showForm && 
        <ObraInmuebleModal
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
              UpdateObraInmueble(row);
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

ObrasInmuebleGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

ObrasInmuebleGrid.defaultProps = {
  disabled: false
};

export default ObrasInmuebleGrid;