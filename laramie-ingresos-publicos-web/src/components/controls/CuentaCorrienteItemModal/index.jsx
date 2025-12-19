import React, { useState, useEffect } from 'react';
import { object, func } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import ShowToastMessage from '../../../utils/toast';
import { DatePickerCustom, InputNumber, InputPersona, InputTasa, InputSubTasa, Loading, InputCuenta, InputLista, InputCodigo, TableCustom, InputEntidad } from '../../common';
import InputEjercicio from '../../common/InputEjercicio';
import { useUsuario } from '../../hooks/useUsuario';
import { APIS } from '../../../config/apis';
import { REQUEST_METHOD } from '../../../consts/requestMethodType';
import { ServerRequest } from '../../../utils/apiweb';
import { useEntidad } from '../../hooks/useEntidad';
import { getFormatNumber } from '../../../utils/convert';


const CuentaCorrienteItemModal = (props) => {

    //variables
    const entityInit = {
        cuentaCorrienteItem: {
            id: 0,
            idEmisionEjecucion: 0,
            idEmisionCuentaCorrienteResultado: 0,
            idPlanPago: 0,
            idPlanPagoCuota: 0,
            idCertificadoApremio: 0,
            idCuenta: 0,
            idTasa: 0,
            idSubTasa: 0,
            periodo: '',
            cuota: 0,
            codigoDelegacion: '',
            idTipoMovimiento: 0,
            numeroMovimiento: 0,
            idTipoValor: 0,
            importeDebe: 0,
            importeHaber: 0,
            idLugarPago: 0,
            fechaOrigen: null,
            fechaMovimiento: null,
            fechaVencimiento1: null,
            fechaVencimiento2: null,
            cantidad: 0,
            idEdesurCliente: 0,
            detalle: '',
            item: 0,
            idUsuarioRegistro: 0,
            fechaRegistro: null
        },
        emisionEjecucion: {
            id: 0,
            idEmisionDefinicion: 0,
            idEstadoEmisionEjecucion: 0,
            numero: '',
            descripcion: '',
            periodo: '',
            imprimeRecibosEmision: false,
            procesaPlanes: false,
            aplicaDebitoAutomatico: false,
            calculoMostradorWeb: false,
            calculoMasivo: false,
            calculoPrueba: false,
            calculoPagoAnticipado: false,
            fechaReliquidacionDesde: null,
            fechaReliquidacionHasta: null,
            fechaPagoAnticipadoVencimiento1: null,
            fechaPagoAnticipadoVencimiento2: null,
            fechaEjecucionInicio: null,
            fechaEjecucionFin: null
        },
        certificadoApremio: {
            id: 0,
            idApremio: 0,
            idEstadoCertificadoApremio: 0,
            numero: '',
            idCuenta: 0,
            idInspeccion: 0,
            montoTotal: 0,
            fechaCertificado: null,
            fechaCalculo: null,
            fechaNotificacion: null,
            fechaRecepcion: null
        },
        cuenta: {
            id: 0,
            numeroCuenta: '',
            numeroWeb: '',
            idEstadoCuenta: 0,
            idTipoTributo: 0,
            idTributo: 0,
            fechaAlta: null,
            fechaBaja: null,
            idContribuyentePrincipal: 0,
            idDireccionPrincipal: 0,
            idDireccionEntrega: 0
        },
        tasa: {
            id: 0,
            codigo: '',
            idTipoTributo: 0,
            idCategoriaTasa: 0,
            descripcion: '',
            porcentajeDescuento: 0
        },
        subTasa: {
            id: 0,
            idTasa: 0,
            codigo: '',
            descripcion: '',
            impuestoNacional: 0,
            impuestoProvincial: 0,
            ctasCtes: 0,
            timbradosExtras: 0,
            descripcionReducida: '',
            fechaDesde: null,
            fechaHasta: null,
            rubroGenerico: false,
            liquidableCtaCte: false,
            liquidableDDJJ: false,
            actualizacion: false,
            accesorios: false,
            internetDDJJ: false,
            imputXPorc: false
        },
        edesurCliente: {
            id: 0,
            idEdesur: 0,
            idPersona: 0,
            idTipoPersona: 0,
            nombrePersona: '',
            idTipoDocumento: 0,
            numeroDocumento: '',
            codigoCliente: '',
            fechaDesde: null,
            fechaHasta: null
        },
        cuotaPorcentajes: []
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit,
        accordions: {
            movimiento: false,
            emision: false,
            imputacion: false,
            auditoria: false
        }
    });

    const mount = () => {
        if (props.data.idCuentaCorrienteItem > 0) {
            FindCuentaCorrienteItem(props.data.idCuentaCorrienteItem);
        }
    }
    useEffect(mount, [props.data.idCuentaCorrienteItem]);


    const [getDataUsuario] = useUsuario({
        idUsuario: state.entity.cuentaCorrienteItem.idUsuarioRegistro,
        onLoaded: (idUsuario, isSuccess, error) => {
            if (!isSuccess) {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        }
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
        },
        memo: {
          key: 'Tasa_SubTasa',
          timeout: 0
        }
    });


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
    const callbackSuccessFindCuenta = (response) => {
        response.json()
        .then((data) => {

            if (data.cuentaCorrienteItem.fechaOrigen) data.cuentaCorrienteItem.fechaOrigen = new Date(data.cuentaCorrienteItem.fechaOrigen);
            if (data.cuentaCorrienteItem.fechaMovimiento) data.cuentaCorrienteItem.fechaMovimiento = new Date(data.cuentaCorrienteItem.fechaMovimiento);
            if (data.cuentaCorrienteItem.fechaVencimiento1) data.cuentaCorrienteItem.fechaVencimiento1 = new Date(data.cuentaCorrienteItem.fechaVencimiento1);
            if (data.cuentaCorrienteItem.fechaVencimiento2) data.cuentaCorrienteItem.fechaVencimiento2 = new Date(data.cuentaCorrienteItem.fechaVencimiento2);
            if (data.cuentaCorrienteItem.fechaRegistro) data.cuentaCorrienteItem.fechaRegistro = new Date(data.cuentaCorrienteItem.fechaRegistro);
            if (data.emisionEjecucion.fechaEjecucionInicio) data.emisionEjecucion.fechaEjecucionInicio = new Date(data.emisionEjecucion.fechaEjecucionInicio);
            if (data.emisionEjecucion.fechaEjecucionFin) data.emisionEjecucion.fechaEjecucionFin = new Date(data.emisionEjecucion.fechaEjecucionFin);
            if (data.certificadoApremio.fechaCertificado) data.certificadoApremio.fechaCertificado = new Date(data.certificadoApremio.fechaCertificado);

            setState(prevState => {
                return {...prevState, loading: false, entity: data};
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
    function FindCuentaCorrienteItem(idCuentaCuentaCorrienteItem) {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${idCuentaCuentaCorrienteItem}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_ITEM,
            paramsUrl,
            null,
            callbackSuccessFindCuenta,
            callbackNoSuccess,
            callbackError
        );

    }

    function ToggleAccordion(accordion) {
        let accordions = CloneObject(state.accordions);
        accordions[accordion] = !accordions[accordion];
        setState(prevState => {
            return {...prevState, accordions: accordions};
        });
    }

    const getCodigoTasa = (id) => {
        const row = getRowEntidad('Tasa', id);
        return (row) ? row.codigo : '';
    }
    const getCodigoSubTasa = (id) => {
        const row = getRowEntidad('SubTasa', id);
        return (row) ? row.codigo : '';
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
        { Header: 'Tasa', Cell: (props) => getCodigoTasa(props.value), accessor: 'idTasa', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: 'SubTasa', Cell: (props) => getCodigoSubTasa(props.value), accessor: 'idSubTasa', width: '10%', alignCell: 'right', disableSortBy: true },
        { Header: 'Tasa %', Cell: (props) => getDescTasa(props.value), accessor: 'idTasaPorcentaje', width: '35%', disableSortBy: true },
        { Header: 'SubTasa %', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasaPorcentaje', width: '35%', disableSortBy: true },
        { Header: 'Porcentaje', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'porcentaje', width: '10%', alignCell: 'right', disableSortBy: true }
    ];

    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i>

    return (
    <>

    <Loading visible={state.loading}></Loading>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-dialog-size">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Movimiento de Cuenta Corriente</h2>
          </div>
          <div className="modal-body">
            <div className="row">

                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="cuenta" className="form-label">Cuenta</label>
                    <InputCuenta
                        name="cuenta"
                        placeholder=""
                        className="form-control"
                        value={state.entity.cuentaCorrienteItem.idCuenta}
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-8 col-md-4">
                    <label htmlFor="periodo" className="form-label">Periodo</label>
                    <InputEjercicio
                        name="periodo"
                        placeholder=""
                        className="form-control"
                        value={ state.entity.cuentaCorrienteItem.periodo }
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-4 col-md-2">
                    <label htmlFor="cuota" className="form-label">Cuota</label>
                    <InputCodigo
                        name="cuota"
                        type="text"
                        className="form-control"
                        value={ state.entity.cuentaCorrienteItem.cuota.toString() }
                        disabled={true}
                    />
                </div>

                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idTasa" className="form-label">Tasa</label>
                    <InputTasa
                        name="idTasa"
                        placeholder=""
                        className="form-control"
                        value={ state.entity.cuentaCorrienteItem.idTasa }
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="idSubTasa" className="form-label">Sub tasa</label>
                    <InputSubTasa
                        name="idSubTasa"
                        placeholder=""
                        className="form-control"
                        value={ state.entity.cuentaCorrienteItem.idSubTasa }
                        disabled={true}
                    />
                </div>
                <div className="mb-3 col-12">
                    <label htmlFor="item" className="form-label">Observación</label>
                    <input
                        name="item"
                        type="text"
                        className="form-control"
                        value={ state.entity.cuentaCorrienteItem.detalle }
                        disabled={true}
                    />
                </div>

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('movimiento')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.movimiento) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.movimiento ? 'active' : ''}>Movimiento</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.movimiento &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="mb-3 col-12 col-md-4">
                                <label htmlFor="fechaMovimiento" className="form-label">Fecha</label>
                                <DatePickerCustom
                                    name="fechaMovimiento"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.fechaMovimiento }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-12 col-md-8">
                                <label htmlFor="idTipoMovimiento" className="form-label">Tipo Movimiento</label>
                                <InputEntidad
                                    name="idTipoMovimiento"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.idTipoMovimiento }
                                    disabled={true}
                                    entidad="TipoMovimiento"
                                />
                            </div>

                            <div className="mb-3 col-4 col-md-2">
                                <label htmlFor="codigoDelegacion" className="form-label">Delegación</label>
                                <InputCodigo
                                    name="codigoDelegacion"
                                    type="text"
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.codigoDelegacion }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-8">
                                <label htmlFor="numeroMovimiento" className="form-label">Número</label>
                                <InputCodigo
                                    name="numeroMovimiento"
                                    type="text"
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.numeroMovimiento.toString() }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-2">
                                <label htmlFor="item" className="form-label">Item</label>
                                <input
                                    name="item"
                                    type="text"
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.item }
                                    disabled={true}
                                />
                            </div>

                            <div className="mb-3 col-12">
                                <label htmlFor="idLugarPago" className="form-label">Lugar de Pago</label>
                                <InputLista
                                    name="idLugarPago"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.idLugarPago }
                                    disabled={true}
                                    lista="LugarPago"
                                />
                            </div>

                            <div className="mb-3 col-4">
                                <label htmlFor="idTipoValor" className="form-label">Tipo de Valor</label>
                                <InputLista
                                    name="idTipoValor"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.idTipoValor }
                                    disabled={true}
                                    lista="TipoValor"
                                />
                            </div>
                            <div className="mb-3 col-4">
                                <label htmlFor="importeDebe" className="form-label">DEBE</label>
                                <InputNumber
                                    name="importeDebe"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.importeDebe }
                                    disabled={true}
                                    precision={2}
                                />
                            </div>
                            <div className="mb-3 col-4">
                                <label htmlFor="importeHaber" className="form-label">HABER</label>
                                <InputNumber
                                    name="importeHaber"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.importeHaber }
                                    disabled={true}
                                    precision={2}
                                />
                            </div>

                        </div>
                    </div>
                    )}
                </div>
                
                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('emision')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.emision) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.emision ? 'active' : ''}>Emisión</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.emision &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="mb-3 col-12 col-md-4">
                                <label htmlFor="fechaOrigen" className="form-label">Origen</label>
                                <DatePickerCustom
                                    name="fechaOrigen"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.fechaOrigen }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-12 col-md-4">
                                <label htmlFor="fechaVencimiento1" className="form-label">Vencimiento</label>
                                <DatePickerCustom
                                    name="fechaVencimiento1"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.fechaVencimiento1 }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-12 col-md-4">
                                <label htmlFor="fechaVencimiento2" className="form-label">Cálculo</label>
                                <DatePickerCustom
                                    name="fechaVencimiento2"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.fechaVencimiento2 }
                                    disabled={true}
                                />
                            </div>

                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="periodoEmision" className="form-label">Periodo Emisión</label>
                                <InputEjercicio
                                    name="periodoEmision"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.emisionEjecucion.periodo }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="numeroEmision" className="form-label">Nro. Emisión</label>
                                <InputCodigo
                                    name="numeroEmision"
                                    type="text"
                                    className="form-control"
                                    value={ state.entity.emisionEjecucion.numero }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-6 col-md-4">
                                <label htmlFor="certificadoApremio" className="form-label">Nro. Juicio</label>
                                <InputCodigo
                                    name="certificadoApremio"
                                    type="text"
                                    className="form-control"
                                    value={ state.entity.certificadoApremio.numero }
                                    disabled={true}
                                />
                            </div>

                            <div className="mb-3 col-12">
                                <label htmlFor="edesurCliente" className="form-label">Cliente Edesur</label>
                                <InputPersona
                                    name="edesurCliente"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.edesurCliente.idPersona }
                                    disabled={true}
                                />
                            </div>

                        </div>
                    </div>
                    )}
                </div>

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('imputacion')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.imputacion) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.imputacion ? 'active' : ''}>Imputación Contable</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.imputacion &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <TableCustom
                                className={'TableCustomBase'}
                                columns={tableColumns}
                                data={state.entity.cuotaPorcentajes}
                                showFilterGlobal={false}
                                showPagination={false}
                            />
                        </div>
                    </div>
                    )}
                </div>

                <div className="mb-3 col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleAccordion('auditoria')}>
                                <div className='accordion-header-title'>
                                    {(state.accordions.auditoria) ? accordionOpen : accordionClose}
                                    <h3 className={state.accordions.auditoria ? 'active' : ''}>Actualización</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(state.accordions.auditoria &&
                    <div className='accordion-body'>
                        <div className='row form-basic'>
                            <div className="mb-3 col-4">
                                <label htmlFor="fechaRegistro" className="form-label">Fecha</label>
                                <DatePickerCustom
                                    name="fechaRegistro"
                                    placeholder=""
                                    className="form-control"
                                    value={ state.entity.cuentaCorrienteItem.fechaRegistro }
                                    disabled={true}
                                />
                            </div>
                            <div className="mb-3 col-12">
                                <label htmlFor="idUsuarioRegistro" className="form-label">Usuario</label>
                                <InputPersona
                                    name="idUsuarioRegistro"
                                    placeholder=""
                                    className="form-control"
                                    value={ getDataUsuario().idPersona }
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                    )}
                </div>

            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Salir</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

CuentaCorrienteItemModal.propTypes = {
    data: object.isRequired,
    onDismiss: func.isRequired
};

export default CuentaCorrienteItemModal;
