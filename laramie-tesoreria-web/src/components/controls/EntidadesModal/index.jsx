import React, { useEffect, useState } from 'react';
import { string, func, array, bool } from 'prop-types';
import { Loading, TableCustom } from '../../common';
import { useEntidad } from '../../hooks/useEntidad';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';

import './index.css';
import { CloneObject } from '../../../utils/helpers';


const EntidadesModal = (props) => {

  //hooks
  const [state, setState] = useState({
      showMessage: false,
      loading: false,
      list: []
  });

  const [getListEntidad,] = useEntidad({
    entidades: props.data ? [] : [props.entidad],
    onLoaded: (entidades, isSuccess, error) => {
        if (isSuccess) {
          const listFilter = getListEntidad(props.entidad).filter(props.filter);
          setState(prevState => {
            return {...prevState, loading: false, list: listFilter};
          });
        }
        else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
        }
    },
    memo: (props.memo) ? {
      key: props.entidad,
      timeout: 0
    }: null
  });

  useEffect(() => {
    if (props.data) {
      const listFilter = props.data.filter(props.filter);
      setState(prevState => {
        return {...prevState, loading: false, list: listFilter};
      });
    }
  }, [props.data]);

  const cellS = (props) =>    <div className='action'>
                                  <div onClick={ (event) => handleClickSelect(props.value) } className="link">
                                      <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                  </div>
                              </div>

  const rowSelect = { Header: '', Cell: cellS, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true };
  const tableColumns = [rowSelect].concat(props.columns);

  //handles
  const handleClickSelect = (id) => {
    const row = state.list.find(f => f.id === id);
    props.onConfirm(id, CloneObject(row));
  }

  const handleClicWithoutSelection = () => {
    props.onConfirm(0, null);
  }


  return (
    <div className='entidad-modal'>

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
                {props.showWithoutSelection &&
                <button className="btn btn-outline-primary float-end" data-dismiss="modal" onClick={ (event) => handleClicWithoutSelection() }>Sin selección</button>
                }
                <button className="btn back-button float-start" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Volver</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

EntidadesModal.propTypes = {
  title: string.isRequired,
  entidad: string.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
  filter: func,
  columns: array.isRequired,
  data: array,
  showWithoutSelection: bool,
  memo: bool
};

EntidadesModal.defaultProps = {
  filter: x => true,
  data: null,
  showWithoutSelection: true,
  memo: true
};

export default EntidadesModal;
