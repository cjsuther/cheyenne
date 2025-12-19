import React, { useState, useEffect, useMemo } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal, InputCuenta } from '../../common';
import { useLista } from '../../hooks/useLista';
import { useEntidad } from '../../hooks/useEntidad';
import { CloneObject } from '../../../utils/helpers';
import DataTaggerModalRedux from '../DataTaggerModalRedux';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useNavigate } from 'react-router-dom';

const RelacionesCuentasGrid = (props) => {
    const navigate = useNavigate();

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        disabled: false,
        showMessage: false,
        showMessageRedirect: false,
        rowForm: null,
        cuentaForm: null,
        dataTagger: {
            showModal: false,
            idEntidad: null
        },
        list: []
    });

    const [triggerClick_idCuenta, setTriggerClick_idCuenta] = useState(0);

    const dispatch = useDispatch();
    const sequenceValue = useSelector( (state) => state.sequence.value );

    const mount = () => {
        setState(prevState => {
            const list = props.data.list.filter(x => x.state !== 'r');
            return {...prevState,
                idCuenta: props.data.idCuenta,
                list: list };
        });
    }
    useEffect(mount, [props.data]);
    
    const [, getRowLista, readyLista ] = useLista({
        listas: ['TipoTributo','TipoDocumento'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
            key: 'TipoTributo_TipoDocumento',
            timeout: 0
        }
    });

    const [, getRowEntidad, readyEntidad] = useEntidad({
        entidades: ['Cuenta'],
        idFilter: props.data.idCuenta,
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        }
    });

    const listCuentas = useMemo(() => {
        if (readyLista && readyEntidad && state.list.length > 0) {
            const data = state.list.map(relacionCuenta => {
                if (relacionCuenta.cuenta) {
                    const cuenta = relacionCuenta.cuenta;
                    const cuentaRelacionada = (cuenta) ? { ...cuenta, idCuenta: cuenta.id, id: relacionCuenta.id } : { id: relacionCuenta.id };
                    return cuentaRelacionada;
                }
                else {
                    const idCuentaRelacionada = (relacionCuenta.idCuenta1 !== state.idCuenta) ? relacionCuenta.idCuenta1 : relacionCuenta.idCuenta2;
                    const cuenta = getRowEntidad('Cuenta', idCuentaRelacionada);
                    const cuentaRelacionada = (cuenta) ? { ...cuenta, idCuenta: cuenta.id, id: relacionCuenta.id } : { id: relacionCuenta.id };
                    return cuentaRelacionada;
                }
            });
            return data;
        }
        else {
            return [];
        }
    }, [readyLista, readyEntidad, state.list])

    const getDescTipoTributo = (id) => {
        const row = getRowLista('TipoTributo', id);
        return (row) ? row.nombre : '';
    }
    const getDescTipoDocumento = (id) => {
        const row = getRowLista('TipoDocumento', id);
        return (row) ? row.nombre : '';
    }

    //definiciones
    const cellA = (data) =>    <div className='action'>
                                {!props.disabled && (
                                    <div onClick={ (event) => handleClickRelacionCuentaAdd() } className="link">
                                       <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                )}
                              </div>
    const cellVMR = (data) =>  <div className='action'>
                                  <div onClick={ (event) => handleClickRelacionCuentaView(data.value) } className="link">
                                      <i className="fa fa-search" title="ver"></i>
                                  </div>
                                  {!props.disabled && (
                                  <div onClick={ (event) => handleClickRelacionCuentaRemove(data.value) } className="link">
                                      <i className="fa fa-trash" title="borrar"></i>
                                  </div>
                                  )}
                                  <div onClick={ (event) => handleClickRelacionCuentaDataTagger(data.value) } className="link">
                                    <i className="fa fa-info-circle" title="Información adicional"></i>
                                  </div>                                  
                              </div>

    const tableColumns = [
        { Header: 'Tipo Tributo', Cell: (props) => { return getDescTipoTributo(props.value); }, accessor: 'idTipoTributo', width: '15%' },
        { Header: 'Nro. Cuenta', accessor: 'numeroCuenta', width: '20%' },
        { Header: 'Clave Web', accessor: 'numeroWeb', width: '20%' },
        { Header: 'Títular', Cell: (props) => {
            const row = props.row.original;
            if (row.idContribuyente > 0) {
                const tipoDocumentoContribuyente = getDescTipoDocumento(row.idTipoDocumentoContribuyente);
                return `${row.nombreContribuyente} (${tipoDocumentoContribuyente} ${row.numeroDocumentoContribuyente})`; 
            }
            else {
                return '';
            }
          }, accessor: 'idContribuyente', width: '35%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickRelacionCuentaAdd = () => {
        setTriggerClick_idCuenta(prevState => {
            return (prevState + 1);
        });
    }

    const handleClickRelacionCuentaView = (id) => {
        setState(prevState => {
            const cuenta = listCuentas.find(x => x.id == id);
            return {...prevState, showMessageRedirect: true, cuentaForm: cuenta};
        });
    }

    const handleClickRelacionCuentaRemove = (id) => {
        setState(prevState => {
            const rowForm = state.list.find(x => x.id === id);
            return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    const handleClickRelacionCuentaDataTagger = (id) => {
        setState(prevState => {
          return {...prevState, dataTagger: {showModal: true, idEntidad: id}};
        });
    }    

    //funciones
    function RemoveRelacionCuenta(row) {
        row.state = 'r';
        props.onChange('RelacionCuenta', row);
    }

    function UpdateRelacionCuenta(cuenta) {
        const rowInvalid = listCuentas.find(f => f.idCuenta === cuenta.id);
        if (rowInvalid) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "La cuenta ya se encontraba relacionada");
            return;
        }

        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        const row = {
            id: idTemporal,
            idCuenta1: state.idCuenta,
            idCuenta2: cuenta.id,
            state: 'a',
            cuenta: cuenta
        };
        dispatch( sequenceActionNext() );
        props.onChange('RelacionCuenta', row);
    }

    function GetTipoTributoName (idTipoTributo) {
        var tributes = {
            "10":	"inmueble",
            "11":	"comercio",
            "12":	"vehiculo",
            "13":	"cementerio",
            "14":	"fondeadero",
            "15":	"cuentas-especiales"
        };
        return tributes[idTipoTributo.toString()];
      }

    function RedirectToTribute (cuenta) {
        const tipoTributo = GetTipoTributoName(cuenta.idTipoTributo);
        const url = `/${tipoTributo}/view/${cuenta.idTributo}`;
        
        navigate(url, { replace: true });        
    } 

    return (
    <>

        {state.dataTagger.showModal &&
            <DataTaggerModalRedux
                title="Información adicional de Relaciones con otras Cuentas"
                processKey={props.processKey}
                entidad="RelacionCuenta"
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
                    RemoveRelacionCuenta(row);
                }}
            />
        }

        {state.showMessageRedirect && 
            <MessageModal
                title={"Esta por salir del tributo actual"}
                message={"¿Está seguro de hacerlo?"}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showMessageRedirect: false, cuentaForm: null};
                    });
                }}
                onConfirm={() => {
                    const row = CloneObject(state.cuentaForm);
                    setState(prevState => {
                        return {...prevState, showMessageRedirect: false, cuentaForm: null};
                    });
                    RedirectToTribute(row);
                }}
            />
        }

        <div className='m-bottom-10'>
        <InputCuenta
            name="idCuenta"
            placeholder=""
            className="form-control"
            value={state.idCuenta}
            onChange={(event) => {
                const {target} = event;
                if (target.value > 0) {
                    UpdateRelacionCuenta(target.row);
                }
            }}
            triggerClick={triggerClick_idCuenta}
            disabled={props.disabled}
        />
        </div>

        <TableCustom
            showFilterGlobal={false}
            showPagination={false}
            className={'TableCustomBase'}
            columns={tableColumns}
            data={ listCuentas }
        />

    </>
    );
}

RelacionesCuentasGrid.propTypes = {
    processKey: string.isRequired,
    disabled: bool,
    data: object.isRequired,
    onChange: func.isRequired
  };
  
  RelacionesCuentasGrid.defaultProps = {
    disabled: false
  };

export default RelacionesCuentasGrid;