import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { getDateToString, getFormatNumber  } from '../../../utils/convert';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import SuperficieModal from '../SuperficieModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';

const SuperficiesGrid = (props) => {

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

  const [superficies, setSuperficies] = useState([]);

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
    entidades: ['TipoSuperficie'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoSuperficie',
      timeout: 0
    }
  });  


  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickSuperficieAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickSuperficieView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickSuperficieModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickSuperficieRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickSuperficieDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>
                              </div>

  const getDescTipoSuperficie = (id) => {
    const row = getRowEntidad('TipoSuperficie', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: 'Número', accessor: 'nroSuperficie', width: '10%' },
    { Header: 'Tipo Superficie', Cell: (props) => getDescTipoSuperficie(props.value), accessor: 'idTipoSuperficie', width: '40%' },
    { Header: 'Metros', Cell: (props) => getFormatNumber(props.value,2), accessor: 'metros', width: '10%', alignCell: 'right' },
    { Header: 'Plano', accessor: 'plano', width: '20%' },
    { Header: 'Vigencia', Cell: (data) => (data.value) ? getDateToString(data.value, false) : '', accessor: 'fechaVigenteDesde', width: '10%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];

  //handles
  const handleClickSuperficieAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        idInmueble: state.idInmueble,
        nroSuperficie: "",
        nroInterno: "",
        nroDeclaracionJurada: "",
        idTipoSuperficie: 0,
        metros: 0,
        plano: "",
        idGrupoSuperficie: 0,
        idTipoObraSuperficie: 0,
        idDestinoSuperficie: 0,
        fechaIntimacion: null,
        nroIntimacion: "",
        nroAnterior: "",
        fechaPresentacion: null,
        fechaVigenteDesde: null,
        fechaRegistrado: null,
        fechaPermisoProvisorio: null,
        fechaAprobacion: null,
        conformeObra: false,
        fechaFinObra: null,
        ratificacion: "",
        derechos: "",
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    setSuperficies(state.list.map(x => x.nroSuperficie));
    dispatch( sequenceActionNext() );
  }
  const handleClickSuperficieView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickSuperficieModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    setSuperficies(state.list.filter(x => x.id !== id).map(x => x.nroSuperficie));
  }
  const handleClickSuperficieRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickSuperficieDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }
  

  //funciones
  function RemoveSuperficie(row) {
    row.state = 'r';
    props.onChange('Superficie', row);
  }

  function UpdateSuperficie(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('Superficie', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Superficie"
          processKey={props.processKey}
          entidad="Superficie"
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
              RemoveSuperficie(row);
            }}
        />
    }

    {state.showForm && 
        <SuperficieModal
            processKey={props.processKey}
            disabled={!state.modeFormEdit}
            data={{
              entity: state.rowForm,
              listSuperficies: superficies
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
              UpdateSuperficie(row);
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

SuperficiesGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

SuperficiesGrid.defaultProps = {
  disabled: false
};

export default SuperficiesGrid;