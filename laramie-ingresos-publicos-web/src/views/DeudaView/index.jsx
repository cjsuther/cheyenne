import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { useForm } from '../../components/hooks/useForm';
import { useDispatch } from 'react-redux';
import { memoActionSet } from '../../context/redux/actions/memoAction';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, MessageModal, SectionHeading, InputCuenta, InputPersona, DatePickerCustom } from '../../components/common';
import { useEntidad } from '../../components/hooks/useEntidad';
import { useReporte } from '../../components/hooks/useReporte';
import { getDateNow, getDateSerialize, getDateToString, getFormatNumber } from '../../utils/convert';
import { APPCONFIG } from '../../app.config';
import { MODE_SELECTION } from '../../consts/modeSelection';
import { OpenObjectURL } from '../../utils/helpers';
import PeriodoSeleccionModal from '../../components/controls/PeriodoSeleccionModal';
import CuentaCorrienteCondicionesEspecialesGrid from '../../components/controls/CuentaCorrienteCondicionesEspecialesGrid';
import uuid from 'react-uuid';


function DeudaView() {

    //parametros url
    const params = useParams();
    const dispatch = useDispatch();
    let navigate = useNavigate();


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
        mode: params.mode,
        loading: false,
        showPeriodo: false,
        list: []
    });
    const [cuenta, setCuenta] = useState(entityInit.cuenta);
    const [contribuyente, setContribuyente] = useState(entityInit.contribuyente);
    const [items, setItems] = useState([]);
    const [itemsGroup, setItemsGroup] = useState([]);
    const [resumenCertificados, setResumenCertificados] = useState([]);
    const [dataCondicionEspecial, setDataCondicionEspecial] = useState({
        id: 0,
        idCuenta: 0,
        numeroPartida: 0,
        codigoDelegacion: '',
        numeroMovimiento: 0,
        showForm: false,
        modeEdit: false
    });
    const [showAccesorios, setShowAccesorios] = useState(false);
    const [columnsAccesorios, setColumnsAccesorios] = useState([]);
    const [messageConfirm, setMessageConfirm] = useState({
        show: false,
        title: "",
        data: null,
        callback: null
    });
    const [showButtons, setShowButtons] = useState({
        PagoCuenta: false,
        PagoCuotas: false,
        PagoContado: false,
        ReciboComun: false
    });

    const [formValues, formHandle, , formSet] = useForm({
        idCuenta: parseInt(params.id),
        fechaDeudaHasta: getDateNow(false),
        selectedAll: false,
        reciboResumido: false
    });

    const [, getRowEntidad] = useEntidad({
        entidades: ['Tasa','SubTasa', 'TipoCondicionEspecial'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        }
    });

    const [ generateReporte, ] = useReporte({
        callback: (reporte, buffer, message) => {
            if (buffer)
                OpenObjectURL(`${reporte}.pdf`, buffer);
            else
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        }
    });

    useEffect(() => {
        let checkAny = false;
        let checkPlanPago = false;
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selected) {
                checkAny = true;
                if (list[index].esPlanPago) {
                    checkPlanPago = true;
                }
            }
        }

        const changeToDay = (!formValues.fechaDeudaHasta || formValues.fechaDeudaHasta.getTime() !== getDateNow(false).getTime()) 

        setShowButtons({
            PagoCuenta: checkAny && !checkPlanPago,
            PagoCuotas: checkAny && !checkPlanPago && !changeToDay,
            PagoContado: checkAny && !checkPlanPago && !changeToDay,
            ReciboComun: checkAny
        });

    }, [items]);

    useEffect(() => {
        if (formValues.fechaDeudaHasta && formValues.fechaDeudaHasta.getTime() >= getDateNow(false).getTime()) {
            SearchCuentaCorrienteItem();
        }
        else {
            ClearCuentaCorrienteItem();
        }
    }, [formValues.fechaDeudaHasta]);


    //definiciones
    const cellVMR = (props) =>      <div className='action'>
                                        {items[props.value].condicionEspecialCantidad > 0 &&
                                        <div onClick={ (event) => handleClickItemViewCondicionEspecial(props.value) } className="link">
                                            <i className="fa fa-exclamation-triangle"
                                                style={(items[props.value].condicionEspecialColor !== "FFFFFF") ? {color: `#${items[props.value].condicionEspecialColor}`} : {}}
                                                title={(items[props.value].condicionEspecialCantidad === 1) ? "1 condición especial" : `${items[props.value].condicionEspecialCantidad} codiciones especiales`}
                                            ></i>
                                        </div>
                                        }
                                    </div>

    const cellAcc = (props) =>      <div className='action'>
                                        Accesorios
                                        <div onClick={ (event) => handleClickItemToggleAccesorios() } className="link">
                                        {(showAccesorios) ?
                                            <i className="fa fa-minus" title="ocultar detalle de accesorios"></i>
                                            :
                                            <i className="fa fa-plus" title="mostrar detalle de accesorios"></i>
                                        }
                                        </div>
                                    </div>

    const cellSelAll = (props) =>   <div className='action-check'>
                                        <input name="selectedAll" type="checkbox" value={''}
                                            checked={ formValues.selectedAll }
                                            onChange={({target}) =>{
                                                const checked = target.checked;
                                                formSet({...formValues, selectedAll: checked});
                                                SelectAll(checked);
                                            }}
                                        />
                                    </div>

    const cellSel = (props) =>      <div className='action-check'>
                                        {items[props.value].selectable &&
                                        <input type="checkbox" value={''} checked={ items[props.value].selected } readOnly={true} />
                                        }
                                    </div>

    const cellSelTasa = (props) =>  <div className='action'>
                                        <div onClick={ (event) => handleClickSelectTasa(props.value) } className="link">
                                            <i className="fa fa-arrow-left" title="seleccionar"></i>
                                        </div>
                                    </div>

    const cellSelCert = (props) =>  <div className='action'>
                                        <div onClick={ (event) => handleClickSelectCertificado(props.value) } className="link">
                                            <i className="fa fa-arrow-left" title="seleccionar"></i>
                                        </div>
                                    </div>


    const getCodigoTasa = (id) => {
        const row = getRowEntidad('Tasa', id);
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

    const GetFooterTotal = (info, columnName) => {
        const total = useMemo(
            () =>
            info.rows.reduce((sum, row) => row.values[columnName] + sum, 0),
            [info.rows]
        )

        return <>{getFormatNumber(total,2)}</>
    }

    const tableColumnsGroups = [
        {
            Header: 'Deuda agrupada por Tasa', Footer: '', disableGlobalFilter: true, disableSortBy: true,
            columns: [
                { Header: '', Cell: cellSelTasa, accessor: 'idTasa', width:'3%', disableGlobalFilter: true, disableSortBy: true},
                { Header: 'Tasa', accessor: 'descTasa', width: '47%', disableSortBy: true }
            ]
        },
        {
            Header: 'Todos', Footer: '', disableGlobalFilter: true, disableSortBy: true,
            columns: [       
                { Header: 'Importe', Footer: (info) => GetFooterTotal(info ,'importeSaldo'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeSaldo', accessor: 'importeSaldo', width: '8%', alignCell: 'right', disableSortBy: true },
                { Header: 'Accesorios', Footer: (info) => GetFooterTotal(info ,'importeAccesorios'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeAccesorios', accessor: 'importeAccesorios', width: '8%', alignCell: 'right', disableSortBy: true },
                { Header: 'Total', Footer: (info) => GetFooterTotal(info ,'importeTotal'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeTotal', accessor: 'importeTotal', width: '8%', alignCell: 'right', disableSortBy: true }
            ]
        },
        {
            Header: 'Sólo Seleccionados', Footer: '', disableGlobalFilter: true, disableSortBy: true,
            columns: [
                { Header: 'Importe', Footer: (info) => GetFooterTotal(info ,'importeSaldoSel'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeSaldoSel', accessor: 'importeSaldoSel', width: '8%', alignCell: 'right', disableSortBy: true },
                { Header: 'Accesorios', Footer: (info) => GetFooterTotal(info ,'importeAccesoriosSel'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeAccesoriosSel', accessor: 'importeAccesoriosSel', width: '8%', alignCell: 'right', disableSortBy: true },
                { Header: 'Total', Footer: (info) => GetFooterTotal(info ,'importeTotalSel'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeTotalSel', accessor: 'importeTotalSel', width: '8%', alignCell: 'right', disableSortBy: true }
            ]
        }
    ];

    const tableColumnsResumenCertificados = [
        {
            Header: 'Deuda agrupada por Certificado', Footer: '', disableGlobalFilter: true, disableSortBy: true,
            columns: [
                { Header: '', Cell: cellSelCert, accessor: 'idCertificadoApremio', width:'5%', disableGlobalFilter: true, disableSortBy: true},
                { Header: 'Nro. Certif.', accessor: 'numero', width: '15%', alignCell: 'right', disableSortBy: true }, 
                { Header: 'Imp. Origen', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeOrigen', width: '15%', alignCell: 'right', disableSortBy: true },
                { Header: 'Accesorios', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeAccesorios', width: '15%', alignCell: 'right', disableSortBy: true },
                { Header: 'Causídicos', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeCausidicos', width: '15%', alignCell: 'right', disableSortBy: true },
                { Header: 'Total s/Causídicos', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeTotalSinCausidicos', width: '20%', alignCell: 'right', disableSortBy: true },
                { Header: 'Total', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeTotalConCausidicos', width: '15%', alignCell: 'right', disableSortBy: true }
            ]
        }
    ];

    useEffect(() => {
        const columns = (showAccesorios) ? [
            { Header: 'Multas', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeMultas', width: '5%', alignCell: 'right', disableSortBy: true },
            { Header: 'Recargos', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeRecargos', width: '5%', alignCell: 'right', disableSortBy: true },
            { Header: 'Honora.', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeHonorarios', width: '5%', alignCell: 'right', disableSortBy: true },
            { Header: 'Aportes', Cell: (props) => getFormatNumber(props.value, 2), accessor: 'importeAportes', width: '5%', alignCell: 'right', disableSortBy: true }
        ] : [];
        setColumnsAccesorios(columns);
    }, [showAccesorios])

    const tableColumns = [
        { Header: cellSelAll, Cell: cellSel, accessor: 'index', width:'3%', disableGlobalFilter: true, disableSortBy: true},
        { Header: 'Tasa', accessor: 'codigoTasa', width: '9%', disableSortBy: true },
        { Header: 'SubTasa', accessor: 'descSubTasa', width: '26%', disableSortBy: true },
        { Header: 'Periodo', accessor: 'periodo', width: '6%', alignCell: 'right', disableSortBy: true },
        { Header: 'Cuota', accessor: 'cuota', width: '6%', alignCell: 'right', disableSortBy: true },
        { Header: 'Importe', Footer: (info) => GetFooterTotal(info ,'importeSaldo'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeSaldo', accessor: 'importeSaldo', width: '8%', alignCell: 'right', disableSortBy: true },
        { Header: cellAcc, Footer: (info) => GetFooterTotal(info ,'importeAccesorios'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeAccesorios', accessor: 'importeAccesorios', width: '8%', alignCell: 'right', disableSortBy: true },
        ...columnsAccesorios,
        { Header: 'Total', Footer: (info) => GetFooterTotal(info ,'importeTotal'), Cell: (props) => getFormatNumber(props.value, 2), id: 'importeTotal', accessor: 'importeTotal', width: '8%', alignCell: 'right', disableSortBy: true },
        { Header: 'Vto.', Cell: (props) => (props.value) ? getDateToString(props.value, false) : '', accessor: 'fechaVencimiento2', width: '6%', disableSortBy: true  },
        { Header: 'Certif.', accessor: 'descCertificadoApremio', width: '5%', alignCell: 'right', disableSortBy: true },
        { Header: 'C.E.', Cell: cellVMR, id:'abm', accessor: 'index', width: '3%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
    const handleClickItemToggleAccesorios = () => {
        setShowAccesorios(!showAccesorios);
    }
    const handleClickItemViewCondicionEspecial = (index) => {
        const item = items[index];
        const dataCondicionEspecial = {
            idCuenta: item.idCuenta,
            numeroPartida: item.numeroPartida,
            codigoDelegacion: item.codigoDelegacion,
            numeroMovimiento: item.numeroMovimiento,
            showForm: true,
            modeEdit: false
          };
        setDataCondicionEspecial(dataCondicionEspecial);
    }
    const handleClickSalir = () => {
        window.close();
    }
    const handleClickSelected = (index) => {
        const list = [...items];
        if (list[index].selectable) {
            list[index].selected = !list[index].selected;
            if (list[index].idCertificadoApremio) {
                handleClickCertificado(list[index].idCertificadoApremio, list[index].selected);
            }
            else {
                UpdateItems(list);
            }
        }
    }

    const handleClickSelectTasa = (idTasa) => {
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selectable) {
                list[index].selected = (list[index].idTasa === idTasa);
            }
        }
        UpdateItems(list);
    }
    const handleClickSelectCertificado = (idCertificadoApremio) => {
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selectable) {
                list[index].selected = (list[index].idCertificadoApremio === idCertificadoApremio);
            }
        }
        UpdateItems(list);
    }
    const handleClickInvertir = () => {
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selectable) {
                list[index].selected = !list[index].selected;
            }
        }
        UpdateItems(list);
    }
    const handleClickAVencer = () => {
        const toDay = formValues.fechaDeudaHasta;
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selectable) {
                list[index].selected = (list[index].fechaVencimiento2.getTime() >= toDay.getTime());
            }
        }
        UpdateItems(list);
    }
    const handleClickAtrasadas = () => {
        const toDay = formValues.fechaDeudaHasta;
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selectable) {
                list[index].selected = (parseInt(list[index].periodo) < toDay.getFullYear());
            }
        }
        UpdateItems(list);
    }
    const handleClickVencidas = () => {
        const toDay = formValues.fechaDeudaHasta;
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selectable) {
                list[index].selected = (list[index].fechaVencimiento2.getTime() < toDay.getTime());
            }
        }
        UpdateItems(list);
    }
    const handleClickSoloJuicios = () => {
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selectable) {
                list[index].selected = (list[index].idCertificadoApremio);
            }
        }
        UpdateItems(list);
    }
    const handleClickCertificado = (idCertificadoApremio, selected) => {
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].idCertificadoApremio === idCertificadoApremio) {
                if (list[index].selectable) {
                    list[index].selected = selected;
                }
            }
        }
        UpdateItems(list);
    }
    const handleClickPeriodo = (data) => {
        setState(prevState => {
            return {...prevState, showPeriodo: true};
        });
    }
    const handleClickPeriodoCallback = (data) => {
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selectable) {
                if (data.modeSeleccion === MODE_SELECTION.PERIODO) {
                    list[index].selected = (list[index].periodo === data.periodo);
                }
                else if (data.modeSeleccion === MODE_SELECTION.RANGO_PERIODO_CUOTA) {
                    list[index].selected = (list[index].periodoCuota >= data.periodoDesde &&
                                            list[index].periodoCuota <= data.periodoHasta);
                }
            }
        }
        UpdateItems(list);
    }

    const handleClickReciboComun = () => {
        const data = GenerateData();
        if (data) {
            setMessageConfirm({
                show: true,
                title: "Está seguro de generar el recibo",
                data: data,
                callback: (data) => AddReciboComun(data)
            });
        }
    }
    const handleClickPagoContado = () => {
        const data = GenerateData();
        if (data) {
            const processKey = uuid();
            dispatch(memoActionSet(processKey, data, 0));
            navigate("../pago-contado/" + processKey, { replace: true });
        }
    }
    const handleClickPagoCuotas = () => {
        const data = GenerateData();
        if (data) {
            const processKey = uuid();
            dispatch(memoActionSet(processKey, data, 0));
            navigate("../plan-pago/" + processKey, { replace: true });
        }
    }
    const handleClickPagoCuenta = () => {
        const data = GenerateData();
        if (data) {
            const processKey = uuid();
            dispatch(memoActionSet(processKey, data, 0));
            navigate("../pago-acuenta/" + processKey, { replace: true });
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
        .then((data) => {
            let items = data.cuentaCorrienteItems;
            let itemsCertificados = [];

            items.forEach((item, index) => {
                if (item.fechaMovimiento) item.fechaMovimiento = new Date(item.fechaMovimiento);
                if (item.fechaVencimiento1) item.fechaVencimiento1 = new Date(item.fechaVencimiento1);
                if (item.fechaVencimiento2) item.fechaVencimiento2 = new Date(item.fechaVencimiento2);

                item.periodoCuota = item.periodo + item.cuota.toString().padStart(2,'0');                   
                item.codigoTasa = getCodigoTasa(item.idTasa);
                item.descTasa = getDescTasa(item.idTasa);
                item.descSubTasa = getDescSubTasa(item.idSubTasa);

                if (item.idCertificadoApremio) {
                    const certificadoApremio = data.certificadosApremio.find(f => f.id === item.idCertificadoApremio);
                    if (certificadoApremio) {
                        item.descCertificadoApremio = certificadoApremio.numero;
                        let itemCertificado = itemsCertificados.find(f => f.idCertificadoApremio === item.idCertificadoApremio);
                        if (!itemCertificado) {
                            itemCertificado = {
                                idCertificadoApremio: certificadoApremio.id,
                                numero: certificadoApremio.numero,
                                importeOrigen: 0,
                                importeAccesorios: 0,
                                importeCausidicos: 0,
                                importeTotalSinCausidicos: 0,
                                importeTotalConCausidicos: 0
                            };
                            itemsCertificados.push(itemCertificado);
                        }
                        itemCertificado.importeOrigen += item.importeSaldo;
                        itemCertificado.importeAccesorios += item.importeAccesorios;
                        itemCertificado.importeCausidicos += (item.importeHonorarios + item.importeAportes);
                        itemCertificado.importeTotalSinCausidicos += (item.importeTotal - item.importeHonorarios - item.importeAportes);
                        itemCertificado.importeTotalConCausidicos += item.importeTotal;
                    }
                    else {
                        item.descCertificadoApremio = "desconocido";
                    }
                }
                else {
                    item.descCertificadoApremio = "";
                }

                const condicionesEspecialesXItem = data.condicionesEspeciales.filter(f => f.codigoDelegacion === item.codigoDelegacion && f.numeroMovimiento === item.numeroMovimiento);
                item.condicionEspecialCantidad = condicionesEspecialesXItem.length;
                if (item.condicionEspecialCantidad > 0) {
                    let tipoCondicionEspecialPrincipal = null;
                    for (let i=0; i < condicionesEspecialesXItem.length; i++) {
                        const condicionEspecial = condicionesEspecialesXItem[i];
                        tipoCondicionEspecialPrincipal = getRowEntidad('TipoCondicionEspecial', condicionEspecial.idTipoCondicionEspecial);
                        if (tipoCondicionEspecialPrincipal && tipoCondicionEspecialPrincipal.inhibicion) {
                            break;
                        }
                    }
                    item.condicionEspecialColor = tipoCondicionEspecialPrincipal.color.toString().toUpperCase();
                    item.condicionEspecialDescripcion = tipoCondicionEspecialPrincipal.nombre;
                    item.condicionEspecialInhibicion = tipoCondicionEspecialPrincipal.inhibicion;
                }
                else {
                    item.condicionEspecialColor = "";
                    item.condicionEspecialDescripcion = "";
                    item.condicionEspecialInhibicion = false;
                }

            });

            setResumenCertificados(itemsCertificados);

            setState(prevState => {
                return {...prevState, loading: false, list: items};
            });
            FilterItems(items, formValues.fechaDeudaHasta);
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackSuccessAddReciboComun = (response) => {
        response.json()
        .then((data) => {
            ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Recibo común generado correctamente");
            setState(prevState => {
                return {...prevState, loading: false};
            });
            formSet({...formValues, selectedAll: false});
            SelectAll(false);
            PrintRecibo(data.idCuentaPago);
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
    function GenerateData() {
        const itemsSelected = items.filter(f => f.selected);
        if (itemsSelected.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe seleccionar al menos un item primero");
            return null;
        }
        if (!formValues.fechaDeudaHasta || formValues.fechaDeudaHasta.getTime() < getDateNow(false).getTime()) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "Debe seleccionar una fecha mayor o igual a la fecha actual");
            return null;
        }

        let data = {
            idCuenta: cuenta.id,
            fechaVencimiento: formValues.fechaDeudaHasta,
            reciboResumido: formValues.reciboResumido,
            items: []
        };
        itemsSelected.forEach(item =>  {
            const row = {
                numeroPartida: item.numeroPartida,
                idTasa: item.idTasa,
                idSubTasa: item.idSubTasa,
                codigoDelegacion: item.codigoDelegacion,
                numeroMovimiento: item.numeroMovimiento,
                periodo: item.periodo,
                cuota: item.cuota
            };
            data.items.push(row);
        });

        return data;
    }
    function PrintRecibo(idCuentaPago) {
        const paramsReporte = {
            idCuentaPago: idCuentaPago,
            reciboResumido: formValues.reciboResumido
        }
        generateReporte("CuentaCorrienteRecibo", paramsReporte);
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

        const paramsUrl = `/deuda/${formValues.idCuenta}/vencimiento/${encodeURIComponent(getDateSerialize(formValues.fechaDeudaHasta))}`;

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
    function AddReciboComun(data) {

        setState(prevState => {
        return {...prevState, loading: true};
        });

        const paramsUrl = `/recibo-comun`;
        const dataBody = data;

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.CUENTA_CORRIENTE_ITEM,
            paramsUrl,
            dataBody,
            callbackSuccessAddReciboComun,
            callbackNoSuccess,
            callbackError
        );

    }
    function ClearCuentaCorrienteItem() {
        let items = [];
        let itemsCertificados = [];

        setResumenCertificados(itemsCertificados);

        setState(prevState => {
            return {...prevState, loading: false, list: items};
        });
        FilterItems(items, formValues.fechaDeudaHasta);
    }

    function SelectAll(checked) {
        const list = [...items];
        for (let index=0; index < list.length; index++) {
            if (list[index].selectable) {
                list[index].selected = checked;
            }
        }
        setItems(list);
        LoadItemsGroup(list);
    }
    function UnSelectAll() {
        formSet({...formValues, selectedAll: false});
    }
    function ChangeCuenta(idCuenta) {
        const url = APPCONFIG.SITE.WEBAPP + 'deuda/' + state.mode + '/' + idCuenta;
        window.open(url, '_self');
    }
    function LoadCuenta(cuentaSelected) {
        if (cuentaSelected) {
            setCuenta(cuentaSelected);
            FindContribuyente(cuentaSelected.idContribuyentePrincipal);
        }
        else {
            setCuenta(entityInit.cuenta);
            setContribuyente(entityInit.contribuyente);
        }
    }

    function FilterItems(fullItems, fechaDeudaHasta) {
        let itemsFilter = [...fullItems].filter(f => {
            return (fechaDeudaHasta && f.fechaMovimiento.getTime() <= fechaDeudaHasta.getTime());
        });

        itemsFilter.sort((a,b) => b.indexMovimiento - a.indexMovimiento);
        itemsFilter.forEach((item, index) => {
            item.index = index;
            item.selected = false;
            item.selectable = (!item.condicionEspecialInhibicion);
        });

        setItems(itemsFilter);
        LoadItemsGroup(itemsFilter);
    }
    function LoadItemsGroup(items) {
        let importeSaldo = 0;
        let importeAccesorios = 0;
        let importeSaldoSel = 0;
        let importeAccesoriosSel = 0;
        let itemsGroup = [];
        
        const itemsXTasa = [...items];
        itemsXTasa.sort((a,b) => a.idTasa - b.idTasa);
        for (let index = 0; index < itemsXTasa.length; index++) {
            const item = itemsXTasa[index];
            importeSaldo += item.importeSaldo;
            importeAccesorios += item.importeAccesorios;
            if (item.selected) {
                importeSaldoSel += item.importeSaldo;
                importeAccesoriosSel += item.importeAccesorios;
            }

            if (index === itemsXTasa.length - 1 || item.idTasa !== itemsXTasa[index+1].idTasa) {
                const itemGroup = {
                    idTasa: item.idTasa,
                    descTasa: item.descTasa,
                    importeSaldo: importeSaldo,
                    importeAccesorios: importeAccesorios,
                    importeTotal: (importeSaldo + importeAccesorios),
                    importeSaldoSel: importeSaldoSel,
                    importeAccesoriosSel: importeAccesoriosSel,
                    importeTotalSel: (importeSaldoSel + importeAccesoriosSel)
                };
                itemsGroup.push(itemGroup);

                importeSaldo = 0;
                importeAccesorios = 0;
                importeSaldoSel = 0;
                importeAccesoriosSel = 0;
            }
        }

        setItemsGroup(itemsGroup);
    }
    function UpdateItems(list) {
        UnSelectAll();
        setItems(list);
        LoadItemsGroup(list);
    }

    function GetDataPeriodo() {
        const toDay = getDateNow(false);
        const periodoDesde = Math.min(...items.map(x => parseInt(x.periodo))).toString();
        const periodoHasta = toDay.getFullYear().toString();

        return {
            periodo: periodoHasta,
            periodoDesde: periodoDesde,
            periodoHasta: periodoHasta
        }
    }

    return (
    <>

        <Loading visible={state.loading}></Loading>

        {messageConfirm.show && 
            <MessageModal
                title={"Confirmación"}
                message={messageConfirm.title}
                onDismiss={() => {
                    setMessageConfirm({ show: false, title: "", data: null, callback: null });
                }}
                onConfirm={() => {
                    if (messageConfirm.callback) {
                        messageConfirm.callback(messageConfirm.data);
                    }
                    setMessageConfirm({ show: false, title: "", data: null, callback: null });
                }}
            />
        }

        {state.showPeriodo && 
            <PeriodoSeleccionModal
                data={GetDataPeriodo()}
                onConfirm={(data) => {
                    handleClickPeriodoCallback(data);
                    setState(prevState => {
                        return {...prevState, showPeriodo: false};
                    });
                }}
                onDismiss={() => {
                    setState(prevState => {
                        return {...prevState, showPeriodo: false};
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
                onlyActived={true}
            />
        }

        <SectionHeading title={<>Cálculo de Deuda</>} />

        <section className='section-accordion'>

            <div className='row form-basic mb-3'>
                <div className="col-12 col-md-6 col-lg-5">
                    <label htmlFor="cuenta" className="form-label">Cuenta</label>
                    <InputCuenta
                        name="cuenta"
                        placeholder=""
                        className="form-control"
                        value={formValues.idCuenta}
                        onUpdate={({target}) => {
                            LoadCuenta(target.row);
                        }}
                        onChange={({target}) => {
                            if (target.row) {
                                ChangeCuenta(target.value);
                            }
                        }}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-5">
                    <label htmlFor="contribuyente" className="form-label">Contribuyente</label>
                    <InputPersona
                        name="contribuyente"
                        placeholder=""
                        className="form-control"
                        value={contribuyente.idPersona}
                        disabled={true}
                    />
                </div>
                <div className="col-6 col-md-6 col-lg-2">
                    <label htmlFor="fechaDeudaHasta" className="form-label">Deuda al</label>
                    <DatePickerCustom
                        name="fechaDeudaHasta"
                        placeholder=""
                        className="form-control"
                        value={formValues.fechaDeudaHasta}
                        onChange={({target}) =>{
                            const fechaDeudaHasta = target.value;
                            formSet({...formValues, fechaDeudaHasta: fechaDeudaHasta});
                        }}
                    />
                </div>
            </div>

            <div className="m-top-20">

                <TableCustom
                    showFooter={true}
                    showPagination={false}
                    showFilterGlobal={false}
                    className={'TableCustomBase'}
                    columns={tableColumnsGroups}
                    data={itemsGroup}
                />

            </div>

            {resumenCertificados.length > 0 &&
            <div className="m-top-20">

                <div className="col-8">
                    <TableCustom
                        showFooter={true}
                        showPagination={false}
                        showFilterGlobal={false}
                        className={'TableCustomBase'}
                        columns={tableColumnsResumenCertificados}
                        data={resumenCertificados}
                    />
                </div>

            </div>
            }

            {formValues.fechaDeudaHasta &&
            <div className='display-row m-top-20'>
                <button className="btn back-button float-start m-right-10" onClick={ (event) => handleClickInvertir() }>Invertir</button>
                <button className="btn back-button float-start m-right-10" onClick={ (event) => handleClickAtrasadas() }>Atrasadas</button>
                <button className="btn back-button float-start m-right-10" onClick={ (event) => handleClickAVencer() }>A Vencer</button>
                <button className="btn back-button float-start m-right-10" onClick={ (event) => handleClickVencidas() }>Vencidas</button>
                <button className="btn back-button float-start m-right-10" onClick={ (event) => handleClickSoloJuicios() }>Sólo Juicios</button>
                <button className="btn back-button float-start m-right-10" onClick={ (event) => handleClickPeriodo() }>Periodo-Cuota</button>
            </div>
            }

            <div className="m-top-20">

                <TableCustom
                    showFooter={true}
                    showFilterGlobal={false}
                    className={'TableCustomBase'}
                    columns={tableColumns}
                    data={items}
                    onClickRow={(row, cellId) => {
                        if (cellId !== "abm") {
                            handleClickSelected(row.index);
                        }
                    }}
                />

            </div>

            <div className="height-20 m-top-10">
                <div className="form-check float-end">
                    <label htmlFor="reciboResumido" className="form-check-label">Imprimir recibo resumido</label>
                    <input
                        name="reciboResumido"
                        type="checkbox"
                        className="form-check-input"
                        value={''}
                        checked={formValues.reciboResumido }
                        onChange={formHandle}
                    />
                </div>
            </div>

        </section>

        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickSalir() }>Salir</button>
                <button className="btn action-button float-end m-left-10" disabled={!showButtons.PagoCuotas} onClick={ (event) => handleClickPagoCuotas() }>Pago en Cuotas</button>
                <button className="btn action-button float-end m-left-10" disabled={!showButtons.PagoContado} onClick={ (event) => handleClickPagoContado() }>Pago Contado</button>
                <button className="btn action-button float-end m-left-10" disabled={!showButtons.PagoCuenta} onClick={ (event) => handleClickPagoCuenta() }>Pago a Cuenta</button>
                <button className="btn action-button float-end m-left-10" disabled={!showButtons.ReciboComun} onClick={ (event) => handleClickReciboComun() }>Recibo Común</button>
            </div>
        </footer>
        
    </>
    )
}

export default DeudaView;
