import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useLista } from '../../hooks/useLista';
import ContactoModal from '../ContactoModal';
import ShowToastMessage from '../../../utils/toast';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import { isNull } from '../../../utils/validator';


const ContactosGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      entidad: '',
      idEntidad: 0,
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
        entidad: props.data.entidad,
        idEntidad: props.data.idEntidad,
        list: list };
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowLista] = useLista({
    listas: ['TipoContacto'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoContacto',
      timeout: 0
    }
  });

  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickContactoAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickContactoView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickContactoModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && !data.row.original.principal && (
                                  <div onClick={ (event) => handleClickContactoRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickContactosDataTagger(data.value) } className="link">
                                      <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                  
                              </div>

  const getDescTipoContacto = (id) => {
    const row = getRowLista('TipoContacto', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: 'Tipo Contacto', Cell: (props) => getDescTipoContacto(props.value), accessor: 'idTipoContacto', width: '30%' },
    { Header: 'Contacto', accessor: 'detalle', width: '60%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickContactoAdd = () => {
    const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
    setState(prevState => {
      const rowForm = {
        id: idTemporal,
        entidad: state.entidad,
        idEntidad: state.idEntidad,
        idTipoContacto: 0,
        detalle: '',
        state: 'a'
      };
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
    dispatch( sequenceActionNext() );
  }
  const handleClickContactoView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
    });
  }
  const handleClickContactoModify = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
    });
  }
  const handleClickContactoRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  const handleClickContactosDataTagger = (id) => {
    setState(prevState => {
      return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
    });
  }  

  //funciones
  function RemoveContacto(row) {
    row.state = 'r';
    props.onChange('Contacto', row);
  }

  function UpdateContacto(row) {
    row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
    props.onChange('Contacto', row);
  }

  return (
  <>

    {state.dataTagger.showModal &&
      <DataTaggerModalRedux
          title="Información adicional de Contacto"
          processKey={props.processKey}
          entidad="Contacto"
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
              RemoveContacto(row);
            }}
        />
    }

    {state.showForm && 
        <ContactoModal
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
              UpdateContacto(row);
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

ContactosGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

ContactosGrid.defaultProps = {
  disabled: false
};

export default ContactosGrid;