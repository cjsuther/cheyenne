import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import EdesurModal from '../EdesurModal';
import { isNull } from '../../../utils/validator';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import EdesurClienteGrid from '../EdesurClienteGrid';

const EdesurGrid = (props) => {

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

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && state.list.length < 1 && (
                                  <div onClick={ (event) => handleClickEdesurAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickEdesurView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickEdesurModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickEdesurRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickEdesurDataTagger(data.value) } className="link">
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
    { Header: 'Medidor', accessor: 'medidor', width: '38%' },
    { Header: 'Plan', accessor: 'plan', width: '25%' },
    { Header: 'Clase Servicio', accessor: 'claseServicio', width: '25%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];

  const subComponent = ({row}) => (

    <div className='form-sub-component'>
      <div className='row'>
        <div className="col-12 p-top-10">
          <label className="form-label">Clientes</label>
          <EdesurClienteGrid
              processKey={props.processKey}
              disabled={props.disabled}
              data={{
                idEdesur: row.original.id,
                list: row.original.edesurClientes
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
  const handleClickEdesurAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idInmueble: state.idInmueble,
        ultPeriodoEdesur: "",
        ultCuotaEdesur: "",
        ultImporteEdesur: 0,
        medidor: "",
        idFrecuenciaFacturacion: 0,
        plan: "",
        radio: "",
        manzana: "",
        idAnteriorEdesur: "",
        tarifa: 0,
        tarifa1: 0,
        claseServicio: "",
        porcDesc: 0,
        cAnual: "",
        recorrido: "",
        planB: "",
        lzEdesur: false,
        facturarABL: false,
        facturar: false,
        facturarEdesur: false,
        comuna: "",
        calleEdesur: "",
        numeroEdesur: "",
        edesurClientes: [],
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickEdesurView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickEdesurModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickEdesurRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }
  const handleClickEdesurDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }

  //funciones
  function RemoveEdesur(row) {
    row.state = 'r';
    props.onChange('Edesur', row);
  }

  function UpdateEdesur(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('Edesur', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
        <DataTaggerModalRedux
            title="Información adicional de Edesur"
            processKey={props.processKey}
            entidad="Edesur"
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
              RemoveEdesur(row);
            }}
        />
    }

    {state.showForm && 
        <EdesurModal
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
              UpdateEdesur(row);
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

EdesurGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

EdesurGrid.defaultProps = {
  disabled: false
};

export default EdesurGrid;