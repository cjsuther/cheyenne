import React, { useState, useEffect } from 'react';
import ShowToastMessage from '../../../utils/toast';
import { number, func } from 'prop-types';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import { Loading, TableCustom } from '../../common';
import { getFormatNumber } from '../../../utils/convert';
import { useEntidad } from '../../hooks/useEntidad';
import { APIS } from '../../../config/apis';
import { REQUEST_METHOD } from '../../../consts/requestMethodType';
import { ServerRequest } from '../../../utils/apiweb';


const CuentaAplicacionCreditosModal = (props) => {

    //hooks
    const [state, setState] = useState({
        idCuenta: 0,
        loading: false
    });

    const [listCreditos, setListCreditos] = useState([]);
    const [listSaldos, setListSaldos] = useState([]);

    const mount = () => {
        setState(prevState => {
            return {...prevState,
                idCuenta: props.idCuenta
            };
        });
        SearchCuentaCorrienteCreditos(props.idCuenta);
    }
    useEffect(mount, [props.idCuenta]);

    const [ formValues, formHandle, , ] = useForm({
        detalle: ""
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['Tasa', 'SubTasa'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        }
    });

    //definiciones
    const cellSel = (props) => {
        const row = props.row.original;
        const list = (row.credito) ? listCreditos : listSaldos;     
        return  <div className='action-check'>
                    <input type="radio" value={''} checked={ list[row.index].selected } readOnly={true} />
                </div>;
    }

    const getDescTasa = (id) => {
        const row = getRowEntidad('Tasa', id);
        return (row) ? `${row.codigo} - ${row.descripcion}` : '';
    } 
    const getDescSubTasa = (id) => {
        const row = getRowEntidad('SubTasa', id);
        return (row) ? `${row.codigo} - ${row.descripcion}` : '';
    }
    
    const tableColumns = [
        { Header: '', Cell: cellSel, accessor: 'index', width:'5%', disableGlobalFilter: true, disableSortBy: true},
        { Header: 'Tasa', Cell: (props) => getDescTasa(props.value), accessor: 'idTasa', width: '35%', disableSortBy: true },
        { Header: 'Sub Tasa', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasa', width: '35%', disableSortBy: true },
        { Header: 'Periodo', accessor: 'periodo', width: '8%', alignCell: 'right', disableSortBy: true },
        { Header: 'Cuota', accessor: 'cuota', width: '7%', alignCell: 'right', disableSortBy: true },
        { Header: 'Importe', Cell: (props) => getFormatNumber(props.value,2), accessor: 'importeSaldo', width: '10%', alignCell: 'right', disableSortBy: true }
    ];


    // handlers
    const handleClickAceptar = () => {
        if (isFormValid()) {

            if (!listCreditos.find(f => f.selected) || !listSaldos.find(f => f.selected)) {
                ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el origen y destino de la transferencia de crédito');
                return false;
            }
    
            AddCuentaCredito();
        }
    }

    //callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
            return {...prevState, loading: false};
            });
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState(prevState => {
            return {...prevState, loading: false};
        });
    }
    const callbackSuccessSearchCuentaCorrienteCreditos = (response) => {
        response.json()
        .then((data) => {
            data.cuentaCorrienteItemsCredito.forEach((item, index) => {
                item.index = index;
                item.selected = false;
                item.credito = true;
            });
            data.cuentaCorrienteItemsSaldo.forEach((item, index) => {
                item.index = index;
                item.selected = false;
                item.credito = false;
            });

            setListCreditos(data.cuentaCorrienteItemsCredito);
            setListSaldos(data.cuentaCorrienteItemsSaldo);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackSuccessAddCuentaCredito = (response) => {
        response.json()
        .then((data) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "La transferencia de créditos fue realizada correctamente", () => {
                SearchCuentaCorrienteCreditos(state.idCuenta);
            });
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }

    //funciones
    function isFormValid() {

        if (formValues.detalle.length <= 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe ingresar el detalle');
            return false;
        }

        return true;
    }
    function SearchCuentaCorrienteCreditos(idCuenta) {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/credito/${idCuenta}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_ITEM,
            paramsUrl,
            null,
            callbackSuccessSearchCuentaCorrienteCreditos,
            callbackNoSuccess,
            callbackError
        );

    }
    function AddCuentaCredito() {
        setState(prevState => {
            return {...prevState, loading: true};
        });

        const numeroPartidaOrigen = listCreditos.find(f => f.selected).numeroPartida;
        const numeroPartidaDestino = listSaldos.find(f => f.selected).numeroPartida;

        const paramsUrl = `/credito`;
        const dataBody = {
            idCuenta: state.idCuenta,
            numeroPartidaOrigen: numeroPartidaOrigen,
            numeroPartidaDestino: numeroPartidaDestino,
            detalle: formValues.detalle
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_ITEM,
            paramsUrl,
            dataBody,
            callbackSuccessAddCuentaCredito,
            callbackNoSuccess,
            callbackError
        );
    }

    return (
    <>

        <Loading visible={state.loading}></Loading>

        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
          <div className="modal-dialog modal-xl">
            <div className="modal-content animated fadeIn">

            <div className="modal-header">
                <h2 className="modal-title">Aplicación de Créditos</h2>
            </div>
            
            <div className="modal-body">
                <div className="row">

                    <div className="mb-3 col-12">
                        <label htmlFor="detalle" className="form-label">Detalle</label>
                        <input
                            name="detalle"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.detalle }
                            onChange={ formHandle }
                        />
                    </div>

                    <div className="mb-3 col-12 m-top-20">

                        <label className="form-label label-subtitle">Créditos a favor</label>
                        <TableCustom
                            className={'TableCustomBase'}
                            columns={tableColumns}
                            data={listCreditos}
                            onClickRow={(row, cellId) => {
                                const list = [...listCreditos];
                                for (let index=0; index < list.length; index++) list[index].selected = false;
                                list[row.index].selected = true;
                                setListCreditos(list);
                            }}
                        />

                    </div>

                    <div className="mb-3 col-12 m-top-20">

                        <label className="form-label label-subtitle">Saldos pendientes</label>
                        <TableCustom
                            className={'TableCustomBase'}
                            columns={tableColumns}
                            data={listSaldos}
                            onClickRow={(row, cellId) => {
                                const list = [...listSaldos];
                                for (let index=0; index < list.length; index++) list[index].selected = false;
                                list[row.index].selected = true;
                                setListSaldos(list);
                            }}
                        />

                    </div>


                </div>
            </div>

            <div className="modal-footer">
                <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() } >Trasnferir</button>
                <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
            </div>
            </div>
          </div>
        </div>

    </>
    );
}

CuentaAplicacionCreditosModal.propTypes = {
    idCuenta: number.isRequired,
    onDismiss: func.isRequired
};

export default CuentaAplicacionCreditosModal;