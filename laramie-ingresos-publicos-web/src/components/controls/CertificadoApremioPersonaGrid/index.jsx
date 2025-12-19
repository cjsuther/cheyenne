import React, { useState, useEffect } from 'react';
import { object, func, bool, string } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { sequenceActionNext } from '../../../context/redux/actions/sequenceAction';
import { TableCustom, MessageModal } from '../../common';
import { CloneObject } from '../../../utils/helpers';
import { getDateToString } from '../../../utils/convert';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useEntidad } from '../../hooks/useEntidad';
import { useLista } from '../../hooks/useLista';
import CertificadoApremioPersonaModal from '../CertificadoApremioPersonaModal';
import ShowToastMessage from '../../../utils/toast';
import { isNull } from '../../../utils/validator';

const CertificadoApremioPersonaGrid = (props) => {

    //hooks
    const [state, setState] = useState({
        idCertificadoApremio: 0,
        disabled: false,
        showMessage: false,
        showForm: false,
        modeFormEdit: false,
        rowForm: null,  
        list: []
    });

    const dispatch = useDispatch();
    const sequenceValue = useSelector( (state) => state.sequence.value );

    const mount = () => {
        setState(prevState => {
        const list = props.data.list.filter(x => x.state !== 'r');
        return {...prevState,
            idCertificadoApremio: props.data.idCertificadoApremio,
            list: list };
        });
    }
    useEffect(mount, [props.data]);

    const [, getRowEntidad] = useEntidad({
        entidades: ['TipoRelacionCertificadoApremioPersona'],
        onLoaded: (entidades, isSuccess, error) => {
            if (isSuccess) {
                setState(prevState => ({...prevState}));
            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: {
            key: 'TipoRelacionCertificadoApremioPersona',
            timeout: 0
        }
    });  

    const [, getRowLista ] = useLista({
        listas: ['TipoDocumento'],
        onLoaded: (listas, isSuccess, error) => {
          if (isSuccess) {

          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoDocumento',
          timeout: 0
        }
    });

    const cellA = (data) =>    <div className='action'>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickCertificadoApremioPersonaAdd() } className="link">
                                        <i className="fa fa-plus" title="nuevo"></i>
                                    </div>
                                    )}
                                </div>
    const cellVMR = (data) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickCertificadoApremioPersonaView(data.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickCertificadoApremioPersonaModify(data.value) } className="link">
                                        <i className="fa fa-pen" title="modificar"></i>
                                    </div>
                                    )}
                                    {!props.disabled && (
                                    <div onClick={ (event) => handleClickCertificadoApremioPersonaRemove(data.value) } className="link">
                                        <i className="fa fa-trash" title="borrar"></i>
                                    </div>
                                    )}
                                </div>

    const getDescTipoRelacionCertificadoApremioPersona = (id) => {
        const row = getRowEntidad('TipoRelacionCertificadoApremioPersona', id);
        return (row) ? row.descripcion : '';
    }

    const getDescTipoDocumento = (id) => {
        const row = getRowLista('TipoDocumento', id);
        return (row) ? row.nombre : '';
    }

    const tableColumns = [
        { Header: 'Tipo relación', Cell: (data) => getDescTipoRelacionCertificadoApremioPersona(data.value), accessor: 'idTipoRelacionCertificadoApremioPersona', width: '20%' },
        { Header: 'Titular', Cell: (data) => 
                                    `${data.row.original.nombrePersona} 
                                    (${getDescTipoDocumento(data.row.original.idTipoDocumento)}
                                    ${data.row.original.numeroDocumento})`
                                    , width: '40%' },        
        { Header: 'Vigencia desde', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaDesde', width: '15%' },
        { Header: 'Vigencia hasta', Cell: (data) => getDateToString(data.value, false), accessor: 'fechaHasta', width: '15%' },
        { Header: cellA, Cell: cellVMR, id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickCertificadoApremioPersonaAdd = () => {
        const idTemporal = (-1)*sequenceValue; //los registros temporales tienen id negativa
        setState(prevState => {
        const rowForm = {
            id: idTemporal,
            idCertificadoApremio: state.idCertificadoApremio,
            idTipoRelacionCertificadoApremioPersona: 0,
            fechaDesde: null,
            fechaHasta: null,
            idPersona: 0,
            state: 'a'
        };
        return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
        dispatch( sequenceActionNext() );
    }

    const handleClickCertificadoApremioPersonaView = (id) => {
        setState(prevState => {
        const rowForm = state.list.find(x => x.id === id);
        return {...prevState, showForm: true, modeFormEdit: false, rowForm: rowForm};
        });
    }

    const handleClickCertificadoApremioPersonaModify = (id) => {
        setState(prevState => {
        const rowForm = state.list.find(x => x.id === id);
        return {...prevState, showForm: true, modeFormEdit: true, rowForm: rowForm};
        });
    }
    
    const handleClickCertificadoApremioPersonaRemove = (id) => {
        setState(prevState => {
        const rowForm = state.list.find(x => x.id === id);
        return {...prevState, showMessage: true, rowForm: rowForm};
        });
    }

    //funciones
    function RemoveCertificadoApremioPersona(row) {
        row.state = 'r';
        props.onChange('CertificadoApremioPersona', row);
    }

    function UpdateCertificadoApremioPersona(row) {
        row.state = isNull(state.list.find(x => x.id === row.id)) ? 'a' : 'm';
        props.onChange('CertificadoApremioPersona', row);
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
                RemoveCertificadoApremioPersona(row);
                }}
            />
        }

        {state.showForm && 
            <CertificadoApremioPersonaModal
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
                    UpdateCertificadoApremioPersona(row);
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

CertificadoApremioPersonaGrid.propTypes = {
  processKey: string.isRequired,
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

CertificadoApremioPersonaGrid.defaultProps = {
  disabled: false
};

export default CertificadoApremioPersonaGrid;