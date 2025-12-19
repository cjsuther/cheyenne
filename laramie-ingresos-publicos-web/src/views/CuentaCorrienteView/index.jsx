import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { useForm } from '../../components/hooks/useForm';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, AdvancedSearch, InputCuenta, InputPersona, InputTasa, InputSubTasa, InputCodigo, InputEjercicio, DatePickerCustom } from '../../components/common';
import CuentaCorrienteItemModal from '../../components/controls/CuentaCorrienteItemModal';
import { useEntidad } from '../../components/hooks/useEntidad';
import { getDateToString, getFormatNumber } from '../../utils/convert';
import { useLista } from '../../components/hooks/useLista';
import { OPERATION_MODE } from '../../consts/operationMode';
import CuentaCorrienteCondicionesEspecialesGrid from '../../components/controls/CuentaCorrienteCondicionesEspecialesGrid';


function CuentaCorrienteView() {

    //parametros url
    const params = useParams();

    const entityInit = {
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
        contribuyente: {
            id: 0,
            idPersona: 0,
            idTipoPersona: 0,
            idTipoDocumento: 0,
            numeroDocumento: '',
            nombrePersona: '',
            fechaAlta: null
        }
    };

    //hooks
    const [state, setState] = useState({
        filter: params.filter,
        mode: params.mode,
        idCuenta: (params.filter === 'cuenta') ? parseInt(params.id) : 0,
        idContribuyente: (params.filter === 'contribuyente') ? parseInt(params.id) : 0,
        loading: false,
        showMessage: false,
        showForm: false,
        rowId: 0,
        list: []
    });
    const [cuenta, setCuenta] = useState(entityInit.cuenta);
    const [contribuyente, setContribuyente] = useState(entityInit.contribuyente);
    const [items, setItems] = useState([]);
    const [dataCondicionEspecial, setDataCondicionEspecial] = useState({
        id: 0,
        idCuenta: 0,
        numeroPartida: 0,
        codigoDelegacion: '',
        numeroMovimiento: 0,
        showForm: false,
        modeEdit: false
    });

    const [filters, setFilters] = useState({
        labels: [
            { title: 'Tasa', field: 'descTasa', value: '', valueIgnore: ''},
            { title: 'SubTasa', field: 'descSubTasa', value: '', valueIgnore: ''},
            { title: 'Periodo/Cuota Desde', field: 'descPeriodoCuotaDesde', value: '0000-00', valueIgnore: '0000-00'},
            { title: 'Periodo/Cuota Hasta', field: 'descPeriodoCuotaHasta', value: '0000-00', valueIgnore: '0000-00'},
            { title: 'Fecha Desde', field: 'descFechaMovimientoDesde', value: '', valueIgnore: ''},
            { title: 'Fecha Hasta', field: 'descFechaMovimientoHasta', value: '', valueIgnore: ''},
            { title: 'Nro. Movimiento Desde', field: 'numeroMovimientoDesde', value: '', valueIgnore: ''},
            { title: 'Nro. Movimiento Hasta', field: 'numeroMovimientoHasta', value: '', valueIgnore: ''},
            { title: 'Considerar el saldo anterior', field: 'descSaldoAnterior', value: 'Sí', valueIgnore: ''},
            { title: 'Mostrar movimientos en cero', field: 'descMovimientoCero', value: 'No', valueIgnore: ''}
        ]
    });

    const mount = () => {

        if (params.filter === 'cuenta' && state.idCuenta > 0) {
            FindCuenta(state.idCuenta);
        }
        else if (params.filter === 'contribuyente' && state.idContribuyente > 0) {
            FindContribuyente(state.idContribuyente);
        }

        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [formValues, formHandle, , formSet] = useForm({
        idTasa: 0,
        descTasa: '', //no existe como control, se usa para tomar el text de idTasa
        idSubTasa: 0,
        descSubTasa: '',

        periodoDesde: '',
        cuotaDesde: '',
        descPeriodoCuotaDesde: '0000-00',
        periodoHasta: '',
        cuotaHasta: '',
        descPeriodoCuotaHasta: '0000-00',

        fechaMovimientoDesde: null,
        descFechaMovimientoDesde: '',
        fechaMovimientoHasta: null,
        descFechaMovimientoHasta: '',
        
        numeroMovimientoDesde: '',
        numeroMovimientoHasta: '',
        saldoAnterior: true,
        descSaldoAnterior: 'Sí',
        movimientoCero: false,
        descMovimientoCero: 'No',
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['Tasa','SubTasa','TipoMovimiento'],
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
    const cellVMR = (props) =>  <div className='action'>
                                    <div onClick={ (event) => handleClickItemView(props.value) } className="link">
                                        <i className="fa fa-search" title="ver"></i>
                                    </div>
                                    <div onClick={ (event) => handleClickItemViewCondicionEspecial(props.value) } className="link">
                                        <i className="fa fa-exclamation-triangle" title="ver condiciones especiales"></i>
                                    </div>
                                </div>

    const getDescTipoMovimiento = (id) => {
        const row = getRowEntidad('TipoMovimiento', id);
        return (row) ? row.nombre : '';
    }

    const getCodigoTasa = (id) => {
        const row = getRowEntidad('Tasa', id);
        return (row) ? row.codigo : '';
    }

    const getDescSubTasa = (id) => {
        const row = getRowEntidad('SubTasa', id);
        return (row) ? `${row.codigo} - ${row.descripcion}` : '';
    }

    const GetFooterTotal = (info, columnName) => {
        const total = useMemo(
            () =>
            info.rows.reduce((sum, row) => row.values[columnName] + sum, 0),
            [info.rows]
        )

        return <>{getFormatNumber(total,2)}</>
    }

    const tableColumns = [
        { Header: 'ID', accessor: 'operacion', width: '4%', alignCell: 'right', disableSortBy: true },
        { Header: 'Tasa', Cell: (props) => getCodigoTasa(props.value), accessor: 'idTasa', width: '5%', disableSortBy: true },
        { Header: 'SubTasa', Cell: (props) => getDescSubTasa(props.value), accessor: 'idSubTasa', width: '19%', disableSortBy: true },
        { Header: 'Periodo', accessor: 'periodo', width: '6%', alignCell: 'right', disableSortBy: true },
        { Header: 'Cuota', accessor: 'cuota', width: '5%', alignCell: 'right', disableSortBy: true },
        { Header: 'Fecha', Cell: (props) => (props.value) ? getDateToString(props.value, false) : '', accessor: 'fechaMovimiento', width: '7%', disableSortBy: true  },
        { Header: 'Movimiento', Cell: (props) => getDescTipoMovimiento(props.value), accessor: 'idTipoMovimiento', width: '10%', disableSortBy: true },
        { Header: 'Número', accessor: 'codigoMovimiento', alignCell: 'right', width: '8%', disableSortBy: true },
        { Header: 'Debe', Footer: (info) => GetFooterTotal(info ,'importeDebe'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeDebe', accessor: 'importeDebe', width: '7%', alignCell: 'right', disableSortBy: true },
        { Header: 'Haber', Footer: (info) => GetFooterTotal(info ,'importeHaber'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeHaber', accessor: 'importeHaber', width: '7%', alignCell: 'right', disableSortBy: true },
        { Header: 'Saldo', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeSaldo', width: '7%', alignCell: 'right', disableSortBy: true },
        { Header: 'Vto.', Cell: (props) => getDateToString(props.value), accessor: 'fechaVencimiento2', width: '7%', alignCell: 'right', disableSortBy: true },
        { Header: '', Cell: cellVMR, id:'abm', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true }
    ];
    const tableColumnsCuenta = [
        ...tableColumns
    ];
    const tableColumnsContribuyente = [
        { Header: 'Cuenta', accessor: 'idCuenta', width: '10%', disableSortBy: true },
        ...tableColumns
    ];

    //handles
    const handleClickItemView = (id) => {
        setState(prevState => {
            return {...prevState, showForm: true, rowId: parseInt(id)};
        });
    }
    const handleClickItemViewCondicionEspecial = (id) => {
        const item = items.find(x => x.id === id);
        const dataCondicionEspecial = {
            idCuenta: item.idCuenta,
            numeroPartida: item.numeroPartida,
            codigoDelegacion: item.codigoDelegacion,
            numeroMovimiento: item.numeroMovimiento,
            showForm: true,
            modeEdit: (state.mode === OPERATION_MODE.EDIT)
        };
        setDataCondicionEspecial(dataCondicionEspecial);
    }
    const handleClickViewCondicionEspecial = () => {
        const dataCondicionEspecial = {
            idCuenta: state.idCuenta,
            numeroPartida: 0,
            codigoDelegacion: '',
            numeroMovimiento: 0,
            showForm: true,
            modeEdit: false
        };
        setDataCondicionEspecial(dataCondicionEspecial);
    }
    const handleClickSalir = () => {
        window.close();
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
    const callbackSuccessFindCuenta = (response) => {
        response.json()
        .then((cuenta) => {
            setCuenta(cuenta);
            setState(prevState => {
                return {...prevState, loading: false, idContribuyente: cuenta.idContribuyentePrincipal};
            });
            FindContribuyente(cuenta.idContribuyentePrincipal);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackSuccessFindContribuyente = (response) => {
        response.json()
        .then((contribuyente) => {
            setContribuyente(contribuyente);
            setState(prevState => {
                return {...prevState, loading: false};
            });
            SearchCuentaCorrienteItem();
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackSuccessSearchCuentaCorrienteItem = (response) => {
        response.json()
        .then((items) => {

            let importeSaldoAnterior = 0;
            items.forEach((item, index) => {
                if (item.fechaMovimiento) item.fechaMovimiento = new Date(item.fechaMovimiento);
                if (item.fechaOrigen) item.fechaOrigen = new Date(item.fechaOrigen);
                if (item.fechaRegistro) item.fechaRegistro = new Date(item.fechaRegistro);
                if (item.fechaVencimiento1) item.fechaVencimiento1 = new Date(item.fechaVencimiento1);
                if (item.fechaVencimiento2) item.fechaVencimiento2 = new Date(item.fechaVencimiento2);

                importeSaldoAnterior += (item.importeDebe-item.importeHaber);
                item.index = index;
                item.selected = false;
                item.importeSaldo = 0;
                item.importeSaldoFiltro = 0;
                item.importeSaldoAnterior = importeSaldoAnterior;
                item.codigoMovimiento = `${item.codigoDelegacion}-${item.numeroMovimiento}-${item.item}`
                item.operacion = `${item.numeroPartida}-${item.id}`;
            });

            setState(prevState => {
                return {...prevState, loading: false, list: items};
            });
            FilterCuentaCorrienteItem(items);
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
    function FindCuenta(idCuenta) {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${idCuenta}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CUENTA,
            paramsUrl,
            null,
            callbackSuccessFindCuenta,
            callbackNoSuccess,
            callbackError
        );

    }
    function FindContribuyente(idContribuyente) {
        
        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/${idContribuyente}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CONTRIBUYENTE,
            paramsUrl,
            null,
            callbackSuccessFindContribuyente,
            callbackNoSuccess,
            callbackError
        );

    }
    function SearchCuentaCorrienteItem() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = (params.filter === 'cuenta') ? `/cuenta/${state.idCuenta}` : `/contribuyente/${state.idContribuyente}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_ITEM,
            paramsUrl,
            null,
            callbackSuccessSearchCuentaCorrienteItem,
            callbackNoSuccess,
            callbackError
        );

    }
    function FilterCuentaCorrienteItem(fullItems) {
        const items = [...fullItems].filter(f => {

            if (!(formValues.idTasa === 0 || f.idTasa === formValues.idTasa )) return false;

            if (!(formValues.idSubTasa === 0 || f.idSubTasa === formValues.idSubTasa )) return false;

            const periodoCuota = `${f.periodo.padStart(4,'0')}-${f.cuota.toString().padStart(2,'0')}`;
            if (!((formValues.descPeriodoCuotaDesde === '0000-00' || periodoCuota.localeCompare(formValues.descPeriodoCuotaDesde) >= 0) &&
                  (formValues.descPeriodoCuotaHasta === '0000-00' || periodoCuota.localeCompare(formValues.descPeriodoCuotaHasta) <= 0))) return false;

            if (!((!formValues.fechaMovimientoDesde || f.fechaMovimiento.getTime() >= formValues.fechaMovimientoDesde.getTime()) &&
                  (!formValues.fechaMovimientoHasta || f.fechaMovimiento.getTime() <= formValues.fechaMovimientoHasta.getTime()))) return false;

            if (!((formValues.numeroMovimientoDesde === '' || f.numeroMovimiento >= parseInt(formValues.numeroMovimientoDesde)) &&
                  (formValues.numeroMovimientoHasta === '' || f.numeroMovimiento <= parseInt(formValues.numeroMovimientoHasta)))) return false;

            if (!(formValues.movimientoCero || f.importeDebe > 0 || f.importeHaber > 0)) return false;

            return true;
        });

        let importeSaldoFiltro = 0;
        items.forEach((item, index) => {
            importeSaldoFiltro += (item.importeDebe-item.importeHaber);
            item.index = index;
            item.importeSaldoFiltro = importeSaldoFiltro;
            item.importeSaldo = (formValues.saldoAnterior) ? item.importeSaldoAnterior : item.importeSaldoFiltro;
        });

        items.sort((a,b) => (b.numeroPartida === a.numeroPartida) ? (b.cuota === a.cuota) ?  a.item - b.item : b.cuota - a.cuota : b.numeroPartida - a.numeroPartida);

        setItems(items);
    }

    function ApplyFilters() {
        UpdateFilters();
        FilterCuentaCorrienteItem(state.list);
    }
    function UpdateFilters() {
        let labels = [...filters.labels];
        labels.forEach((label) => {
            label.value = formValues[label.field];
        });
        setFilters(prevState => {
            return {...prevState, labels: labels};
        });
    }


    return (
    <>

        <Loading visible={state.loading}></Loading>

        {state.showMessage && 
            <MessageModal
                title={"Confirmación"}
                message={"¿Está seguro de borrar el registro?"}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showMessage: false, rowId: 0};
                    });
                }}
                onConfirm={() => {
                    const id = state.rowId;
                    setState(prevState => {
                        return {...prevState, showMessage: false, rowId: 0};
                    });
                    // RemoveEmisionDefinicion(id);
                }}
            />
        }

        {state.showForm && 
            <CuentaCorrienteItemModal
                data={{
                    idCuentaCorrienteItem: state.rowId
                }}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showForm: false, rowId: 0};
                    });
                }}
            />
        }

        {dataCondicionEspecial.showForm && 
            <CuentaCorrienteCondicionesEspecialesGrid
                data={{
                    idCuenta: dataCondicionEspecial.idCuenta,
                    numeroPartida: dataCondicionEspecial.numeroPartida,
                    codigoDelegacion: dataCondicionEspecial.codigoDelegacion,
                    numeroMovimiento: dataCondicionEspecial.numeroMovimiento
                }}
                onDismiss={() => {
                    setDataCondicionEspecial(prevState => { return {...prevState, showForm: false}; });
                }}
                disabled={!dataCondicionEspecial.modeEdit}
            />
        }

        <SectionHeading title={<>Cuenta Corriente</>} />

        <section className='section-accordion'>

            <div className='row form-basic mb-3'>
                {cuenta.id > 0 &&
                <div className="col-12 col-md-6">
                    <label htmlFor="cuenta" className="form-label">Cuenta</label>
                    <InputCuenta
                        name="cuenta"
                        placeholder=""
                        className="form-control"
                        value={cuenta.id}
                        disabled={true}
                    />
                </div>
                }
                <div className="col-12 col-md-6">
                    <label htmlFor="contribuyente" className="form-label">Contribuyente</label>
                    <InputPersona
                        name="contribuyente"
                        placeholder=""
                        className="form-control"
                        value={contribuyente.idPersona}
                        disabled={true}
                    />
                </div>
            </div>

            <AdvancedSearch
                initShowFilters={false}
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
            >

                <div className='row form-basic'>

                    <div className="col-12 col-md-6">
                        <label htmlFor="idTasa" className="form-label">Tasa</label>
                        <InputTasa
                            name="idTasa"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTasa }
                            onChange={({target}) =>{
                                let idTasa = 0;
                                let descTasa = '';
                                if (target.row) {
                                    idTasa = parseInt(target.value);
                                    descTasa = `${target.row.codigo} - ${target.row.descripcion}`;
                                }
                                formSet({...formValues, idTasa: idTasa, descTasa: descTasa});
                            }}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idTasa" className="form-label">SubTasa</label>
                        <InputSubTasa
                            name="idSubTasa"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idSubTasa }
                            onChange={({target}) =>{
                                let idSubTasa = 0;
                                let descSubTasa = '';
                                if (target.row) {
                                    idSubTasa = parseInt(target.value);
                                    descSubTasa = `${target.row.codigo} - ${target.row.descripcion}`;
                                }
                                formSet({...formValues, idSubTasa: idSubTasa, descSubTasa: descSubTasa});
                            }}
                            idTasa={formValues.idTasa}
                        />
                    </div>

                    <div className="col-6 col-md-4 col-lg-2">
                        <label htmlFor="periodoDesde" className="form-label">Periodo desde</label>
                        <InputEjercicio
                            name="periodoDesde"
                            placeholder=""
                            className="form-control"
                            value={ formValues.periodoDesde }
                            onChange={({target}) =>{
                                const descPeriodoCuotaDesde = `${target.value.padStart(4,'0')}-${formValues.cuotaDesde.padStart(2,'0')}`;
                                formSet({...formValues, periodoDesde: target.value, descPeriodoCuotaDesde: descPeriodoCuotaDesde});
                            }}
                        />
                    </div>
                    <div className="col-6 col-md-2 col-lg-1">
                        <label htmlFor="cuotaDesde" className="form-label">Cuota</label>
                        <InputCodigo
                            maxLength={2}
                            name="cuotaDesde"
                            placeholder=""
                            className="form-control"
                            value={ formValues.cuotaDesde }
                            onChange={({target}) =>{
                                const descPeriodoCuotaDesde = `${formValues.periodoDesde.padStart(4,'0')}-${target.value.padStart(2,'0')}`;
                                formSet({...formValues, cuotaDesde: target.value, descPeriodoCuotaDesde: descPeriodoCuotaDesde});
                            }}
                        />
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 offset-lg-1">
                        <label htmlFor="periodoHasta" className="form-label">Periodo hasta</label>
                        <InputEjercicio
                            name="periodoHasta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.periodoHasta }
                            onChange={({target}) =>{
                                const descPeriodoCuotaHasta = `${target.value.padStart(4,'0')}-${formValues.cuotaHasta.padStart(2,'0')}`;
                                formSet({...formValues, periodoHasta: target.value, descPeriodoCuotaHasta: descPeriodoCuotaHasta});
                            }}
                        />
                    </div>
                    <div className="col-6 col-md-2 col-lg-1">
                        <label htmlFor="cuotaHasta" className="form-label">Cuota</label>
                        <InputCodigo
                            maxLength={2}
                            name="cuotaHasta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.cuotaHasta }
                            onChange={({target}) =>{
                                const descPeriodoCuotaHasta = `${formValues.periodoHasta.padStart(4,'0')}-${target.value.padStart(2,'0')}`;
                                formSet({...formValues, cuotaHasta: target.value, descPeriodoCuotaHasta: descPeriodoCuotaHasta});
                            }}
                        />
                    </div>
                    <div className="col-6 col-md-6 col-lg-2 offset-lg-1">
                        <label htmlFor="fechaMovimientoDesde" className="form-label">Fecha desde</label>
                        <DatePickerCustom
                            name="fechaMovimientoDesde"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaMovimientoDesde }
                            onChange={({target}) =>{
                                const descFechaMovimientoDesde = getDateToString(target.value, false);
                                formSet({...formValues, fechaMovimientoDesde: target.value, descFechaMovimientoDesde: descFechaMovimientoDesde});
                            }}
                        />
                    </div>
                    <div className="col-6 col-md-6 col-lg-2">
                        <label htmlFor="fechaMovimientoHasta" className="form-label">Fecha hasta</label>
                        <DatePickerCustom
                            name="fechaMovimientoHasta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaMovimientoHasta }
                            onChange={({target}) =>{
                                const descFechaMovimientoHasta = getDateToString(target.value, false);
                                formSet({...formValues, fechaMovimientoHasta: target.value, descFechaMovimientoHasta: descFechaMovimientoHasta});
                            }}
                            minValue={formValues.fechaMovimientoDesde}
                        />
                    </div>

                    <div className="col-6 col-md-6 col-lg-2">
                        <label htmlFor="numeroMovimientoDesde" className="form-label">Nro. Movimiento desde</label>
                        <InputCodigo
                            name="numeroMovimientoDesde"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numeroMovimientoDesde }
                            onChange={formHandle}
                        />
                    </div>
                    <div className="col-6 col-md-6 col-lg-2">
                        <label htmlFor="numeroMovimientoHasta" className="form-label">Nro. Movimiento hasta</label>
                        <InputCodigo
                            name="numeroMovimientoHasta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.numeroMovimientoHasta }
                            onChange={formHandle}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3 offset-lg-2 form-check">
                        <label htmlFor="saldoAnterior" className="form-check-label">Considerar el saldo anterior</label>
                        <input
                            name="saldoAnterior"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            checked={formValues.saldoAnterior}
                            onChange={({target}) =>{
                                const descSaldoAnterior = (target.checked) ? 'Sí' : 'No';
                                formSet({...formValues, saldoAnterior: target.checked, descSaldoAnterior: descSaldoAnterior});
                            }}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3 form-check">
                        <label htmlFor="movimientoCero" className="form-check-label">Mostrar movimientos en cero</label>
                        <input
                            name="movimientoCero"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            checked={formValues.movimientoCero }
                            onChange={({target}) =>{
                                const descMovimientoCero = (target.checked) ? 'Sí' : 'No';
                                formSet({...formValues, movimientoCero: target.checked, descMovimientoCero: descMovimientoCero});
                            }}
                        />
                    </div>

                </div>

            </AdvancedSearch>

            <div className="m-top-20">

                <TableCustom
                    showFooter={true}
                    className={'TableCustomBase'}
                    columns={(params.filter === 'cuenta') ? tableColumnsCuenta :
                             (params.filter === 'contribuyente') ? tableColumnsContribuyente : []}
                    data={items}
                    pageSize={50}
                    disabledEllipsis={true}
                />

            </div>

        </section>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickSalir() }>Salir</button>
                {state.idCuenta > 0 &&
                <button className="btn back-button float-end" onClick={ (event) => handleClickViewCondicionEspecial() }>Condiciones Especiales</button>
                }
            </div>
        </footer>
        
    </>
    )
}

export default CuentaCorrienteView;
