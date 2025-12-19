import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { useEntidad } from '../../hooks/useEntidad';
import { getDateToString, getFormatNumber } from '../../../utils/convert';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { isNull } from '../../../utils/validator';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import InspeccionModal from '../InspeccionModal';


const InspeccionesGrid = (props) => {

  //hooks
  const [state, setState] = useState({
      idComercio: 0,
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
            idComercio: props.data.idComercio,
            list: list };
        });
    }
    useEffect(mount, [props.data]);

    const [, getRowEntidad] = useEntidad({
        entidades: ['Controlador'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'Controlador',
          timeout: 0
        }
    });

    const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickInspeccionAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickInspeccionView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickInspeccionModify(data.value) } className="link">
                                      <i className="fa fa-pen" title="modificar"></i>
                                  </div>
                                  )}
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickInspeccionRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickInspeccionDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>   
                              </div>

    const getDescNombreInspector = (id) => {
        const row = getRowEntidad('Controlador', id);
        return (row) ? row.nombre : '';
    }

    const tableColumns = [
        { Header: 'Número', accessor: 'numero', width: '10%' },
        { Header: 'Inspector', Cell: (props) => getDescNombreInspector(props.value), accessor: 'idInspector', width: '50%' },
        { Header: 'Inicio', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaInicio', width: '15%' },
        { Header: 'Finalización', Cell: (props) => getDateToString(props.value, false), accessor: 'fechaFinalizacion', width: '15%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickInspeccionAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
            const rowForm = {
                id: idTemporal,
                idComercio: state.idComercio,
                numero: '',
                idMotivoInspeccion: 0,
                idSupervisor: 0,
                idInspector: 0,
                fechaInicio: null,
                fechaFinalizacion: null,
                fechaNotificacion: null,
                fechaBaja: null,
                anioDesde: '',
                mesDesde: 0,
                anioHasta: '',
                mesHasta: 0,
                numeroResolucion: '',
                letraResolucion: '',
                anioResolucion: '',
                fechaResolucion: null,
                numeroLegajillo: '',
                letraLegajillo: '',
                anioLegajillo: '',
                activo: 0,
                porcentajeMulta: 0,
                emiteConstancia: 0,
                pagaPorcentaje: false,
                idExpediente: 0,
                state: 'a'
            };
            return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }

    const handleClickInspeccionView = (id) => {
        setState(prevState => {
          const rowForm = state.list.find(x => x.id === id);
          return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
        });
    }

    const handleClickInspeccionModify = (id) => {
        setState(prevState => {
          const rowForm = state.list.find(x => x.id === id);
          return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
    }

    const handleClickInspeccionRemove = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    const handleClickInspeccionDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
    }    

    //funciones
    function RemoveInspeccion(row) {
        row.state = 'r';
        props.onChange('Inspeccion', row);
    }

    function UpdateInspeccion(row) {
        row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
        props.onChange('Inspeccion', row);
    }

    return (
    <>

        {state.dataTagger.showModal &&
            <DataTaggerModalRedux
                title="Información adicional de Inspeccion"
                processKey={props.processKey}
                entidad="Inspeccion"
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
                    RemoveInspeccion(row);
                }}
            />
        }

        {state.showForm && 
            <InspeccionModal
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
                    UpdateInspeccion(row);
                  }}
            />
        }

        <TableCustom
            showFilterGlobal={false}
            showPagination={false}
            className={'TableCustomBase'}
            columns={tableColumns}
            data={ state.list }
        />

    </>
    );
}

InspeccionesGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
  };
  
  InspeccionesGrid.defaultProps = {
    disabled: false
  };

export default InspeccionesGrid;
