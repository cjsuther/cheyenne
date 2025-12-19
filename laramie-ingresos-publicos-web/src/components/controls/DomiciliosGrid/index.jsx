import React, { useState, useEffect } from 'react';
import { object } from 'prop-types';
import { TableCustom } from '../../common';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import DomicilioModal from '../DomicilioModal';
import ShowToastMessage from '../../../utils/toast';

const DomiciliosGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      showMessage: false,
      showForm: false,
      rowForm: null,
      list: []
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState, list: props.data.list};
    });
  }
  useEffect(mount, [props.data]);

  const [, getRowEntidad] = useEntidad({
    entidades: ['Provincia','Localidad'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Provincia_Localidad',
      timeout: 0
    }
  });

  const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickVinculoInmuebleView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                              </div>

  const getDescProvincia = (id) => {
    const row = getRowEntidad('Provincia', id);
    return (row) ? row.nombre : '';
  }
  const getDescLocalidad = (id) => {
    const row = getRowEntidad('Localidad', id);
    return (row) ? row.nombre : '';
  }

  const tableColumns = [
    { Header: 'Domicilio', accessor: 'domicilio', width: '15%' },
    { Header: 'Provincia', Cell: (props) => getDescProvincia(props.value), accessor: 'idProvincia', width: '15%' },
    { Header: 'Localidad', Cell: (props) => getDescLocalidad(props.value), accessor: 'idLocalidad', width: '15%' },
    { Header: 'Cód. Postal', accessor: 'codigoPostal', width: '10%' },
    { Header: 'Calle', Cell: (props) => {
        const row = props.row.original;
        const calle = `${row.calle} ${row.altura} ${row.piso} ${row.dpto}`;
        return calle;
      }, accessor: 'calle', width: '35%' },
    { Header: '', Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ];


  //handles
  const handleClickVinculoInmuebleView = (id) => {
    setState(prevState => {
      const rowForm = state.list.find(x => x.id === id);
      return {...prevState, showForm: true, rowForm: rowForm};
    });
  }


  return (
  <>

    {state.showForm && 
        <DomicilioModal
            data={{
              entity: state.rowForm
            }}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showForm: false, rowForm: null};
              });
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

DomiciliosGrid.propTypes = {
  data: object.isRequired
};

export default DomiciliosGrid;