import React, { useState } from 'react';
import { string, func, bool } from 'prop-types';
import { Loading, TableCustom } from '../../common';
import { useLista } from '../../hooks/useLista';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';

import './index.css';
import { CloneObject } from '../../../utils/helpers';


const ListasModal = (props) => {

  //hooks
  const [state, setState] = useState({
      showMessage: false,
      loading: false,
      list: []
  });

  const [getListLista,] = useLista({
    listas: [props.lista],
    onLoaded: (listas, isSuccess, error) => {
        if (isSuccess) {
          const listFilter = getListLista(props.lista).filter(props.filter);
          setState(prevState => {
            return {...prevState, loading: false, list: listFilter};
          });
        }
        else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
        }
    },
    memo: {
      key: props.lista,
      timeout: 0
    }
  });

  const cellS = (props) =>    <div className='action'>
                                  <div onClick={ (event) => handleClickSelect(props.value) } className="link">
                                  <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                  </div>
                              </div>

  const tableColumns = (props.showCode) ?
  [
    { Header: '', Cell: cellS, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Código', accessor: 'codigo', width: '25%' },
    { Header: 'Nombre', accessor: 'nombre', width: '70%' }
  ]:
  [
    { Header: '', Cell: cellS, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Nombre', accessor: 'nombre', width: '95%' }
  ];

  //handles
  const handleClickSelect = (id) => {
    const row = state.list.find(f => f.id === id);
    props.onConfirm(id, CloneObject(row));
  }

  const handleClickSinSeleccion = () => {
    props.onConfirm(0, null);
  }


  return (
    <div className='lista-modal'>

      <Loading visible={state.loading}></Loading>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-lg">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
            </div>
            <div className="modal-body">

              <TableCustom
                  showFilterGlobal={true}
                  className={'TableCustomBase'}
                  columns={tableColumns}
                  data={state.list}
                  onClickRow={({ original }) => props.onConfirm(original.id, CloneObject(original))}
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

ListasModal.propTypes = {
  title: string.isRequired,
  lista: string.isRequired,
  showCode: bool,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
  filter: func,
};

ListasModal.defaultProps = {
  showCode: false,
  filter: (row) => { return true }
};

export default ListasModal;
