import React from 'react';
import { string, func, array, bool } from 'prop-types';
import { TableCustom } from '../../common';

import './index.css';
import { CloneObject } from '../../../utils/helpers';


const StaticEntidadesModal = (props) => {


  const cellS = (props) =>    <div className='action'>
                                  <div onClick={ (event) => handleClickSelect(props.value) } className="link">
                                      <i className="fa fa-arrow-left" title="seleccionar"></i>
                                  </div>
                              </div>

  const rowSelect = { Header: '', Cell: cellS, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true };
  const tableColumns = [rowSelect].concat(props.columns);

  //handles
  const handleClickSelect = (id) => {
    const row = props.list.find(f => f.id === id);
    props.onConfirm(id, CloneObject(row));
  }

  const handleClicWithoutSelection = () => {
    props.onConfirm(0, null);
  }


  return (
    <div className='entidad-modal'>

      <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
        <div className="modal-dialog modal-lg">
          <div className="modal-content animated fadeIn">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
            </div>
            <div className="modal-body">

              <TableCustom
                  showFilterGlobal={true}
                  showPagination={false}
                  className={'TableCustomBase'}
                  columns={tableColumns}
                  data={props.list}
              />

            </div>
            <div className="modal-footer">
              <div className='footer-action-container'>
                {props.showWithoutSelection &&
                <button className="btn back-button float-start" data-dismiss="modal" onClick={ (event) => handleClicWithoutSelection() }>Sin selección</button>
                }
                <button className="btn btn-outline-primary float-end" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

StaticEntidadesModal.propTypes = {
  title: string.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
  columns: array.isRequired,
  list: array.isRequired,
  showWithoutSelection: bool
};

StaticEntidadesModal.defaultProps = {
  showWithoutSelection: true
};

export default StaticEntidadesModal;
