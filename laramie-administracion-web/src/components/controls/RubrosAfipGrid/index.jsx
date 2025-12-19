import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import ListasModal from '../ListasModal';
import ShowToastMessage from '../../../utils/toast';


const RubrosAfipGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      disabled: false,
      showMessage: false,
      showList: false,
      rowForm: null,  
      list: []
  });

  const mount = () => {
    setState(prevState => {
      const list = props.data.list.filter(x => x.state !== 'r');
      return {...prevState,
        list: list };
    });
  }
  useEffect(mount, [props.data]);


  const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                  <div onClick={ (event) => handleClickRubroAfipAdd() } className="link">
                                      <i className="fa fa-plus" title="nuevo"></i>
                                  </div>
                                )}
                              </div>
  const cellVMR = (data) =>  <div className='action'>
                                  {!props.disabled && !data.row.original.principal && (
                                  <div onClick={ (event) => handleClickRubroAfipRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}                                
                              </div>

  const tableColumns = [
    { Header: 'Código', accessor: 'codigo', width: '20%' },
    { Header: 'Rubro', accessor: 'nombre', width: '75%' },
    { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickRubroAfipAdd = () => {
    setState(prevState => {
      return {...prevState, showList: true};
    });
  }
  const handleClickRubroAfipRemove = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showMessage: true, rowForm: rowForm};
    });
  }

  //funciones
  function RemoveRubroAfip(row) {
    row.state = 'r';
    props.onChange('RubroAfip', row);
  }

  function UpdateRubroAfip(row) {
    row.state = 'a';
    props.onChange('RubroAfip', row);
  }

  return (
  <>

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
              RemoveRubroAfip(row);
            }}
        />
    }

    {state.showList && (
        <ListasModal
            title="Rubros AFIP"
            lista="RubroAfip"
            showCode={true}
            onDismiss={() => {
                setState(prevState => {
                    return {...prevState, showList: false};
                });
            }}
            onConfirm={(id, row) => {
                setState(prevState => {
                    return {...prevState, showList: false};
                });
                if (id > 0) {
                  UpdateRubroAfip(row);
                }
            }}
            filter={(row) => { return (!state.list.map(x => Math.abs(x.id)).includes(row.id)) }}
        />
    )}

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

RubrosAfipGrid.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

RubrosAfipGrid.defaultProps = {
  disabled: false
};

export default RubrosAfipGrid;