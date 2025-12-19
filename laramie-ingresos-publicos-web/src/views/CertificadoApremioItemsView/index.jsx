import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from '../../config/apis';
import { APPCONFIG } from '../../app.config';
import { ServerRequest } from '../../utils/apiweb';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { getDateNow, getDateToString, getFormatNumber  } from '../../utils/convert';
import { useForm } from '../../components/hooks/useForm';
import { useLista } from '../../components/hooks/useLista';
import { useEntidad } from '../../components/hooks/useEntidad';
import ShowToastMessage from '../../utils/toast';
import { Loading, TableCustom, SectionHeading, DatePickerCustom, InputCuenta, AdvancedSearch } from '../../components/common';
import CuentaCorrienteCondicionesEspecialesGrid from '../../components/controls/CuentaCorrienteCondicionesEspecialesGrid';
import { isNull } from '../../utils/validator';


function CertificadoApremioItemsView() {

    //hooks
    let navigate = useNavigate();

    const [state, setState] = useState({
        loading: false,
        list: []
    });
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
            { title: 'Cuenta', field: 'descCuenta', value: '', valueIgnore: ''},
            { title: 'Titular', field: 'titular', value: '', valueIgnore: '' },
            { title: 'Fecha Venc. Desde', field: 'descFechaDesde', value: '', valueIgnore: '' },
            { title: 'Fecha Venc. Hasta', field: 'descFechaHasta', value: '', valueIgnore: '' },
            { title: 'Deuda al', field: 'descFechaDeudaAl', value: '', valueIgnore: '' },
            { title: 'Traer cuotas de planes', field: 'descTraePlanes', value: '', valueIgnore: '' }
        ]
    });

    const [ formValues, , , formSet ] = useForm({
        idCuenta: 0,
        descCuenta: '',
        titular: '',
        fechaDesde: null,
        descFechaDesde: '',
        fechaHasta: null,
        descFechaHasta: '',
        fechaDeudaAl: getDateNow(false),
        descFechaDeudaAl: getDateToString(getDateNow(false), false),
        traePlanes: false,
        descTraePlanes: ''
    });


    const [, getRowEntidad] = useEntidad({
        entidades: ['Tasa', 'SubTasa', 'TipoCondicionEspecial'],
        onLoaded: (entidades, isSuccess, error) => {
          if (isSuccess) {
            setState(prevState => ({...prevState}));
          }
          else {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        }
    });

    const [, getRowLista ] = useLista({
        listas: ['TipoDocumento'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'TipoDocumento',
          timeout: 0
        }
    });


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
    const getDescTipoDocumento = (id) => {
        const row = getRowLista('TipoDocumento', id);
        return (row) ? row.nombre : '';
    }


    //definiciones
    const cellSel = (props) =>      <div className='action-check'>
                                        {items[props.value].selectable &&
                                        <input type="checkbox" value={''} checked={ items[props.value].selected } readOnly={true} />
                                        }
                                    </div>

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

    const tableColumns = [
        { Header: '', Cell: cellSel, accessor: 'index', width:'3%', disableGlobalFilter: true, disableSortBy: true},
        { Header: 'Tasa', accessor: 'codigoTasa', width: '9%', disableSortBy: true },
        { Header: 'SubTasa', accessor: 'descSubTasa', width: '26%', disableSortBy: true },
        { Header: 'Periodo', accessor: 'periodo', width: '6%', alignCell: 'right', disableSortBy: true },
        { Header: 'Cuota', accessor: 'cuota', width: '6%', alignCell: 'right', disableSortBy: true },
        { Header: 'Importe', Cell: (props) => getFormatNumber(props.value, 2), id: 'importeSaldo', accessor: 'importeSaldo', width: '8%', alignCell: 'right', disableSortBy: true },
        { Header: 'Accesorios', Cell: (props) => getFormatNumber(props.value, 2), id: 'importeAccesorios', accessor: 'importeAccesorios', width: '8%', alignCell: 'right', disableSortBy: true },
        { Header: 'Total', Cell: (props) => getFormatNumber(props.value, 2), id: 'importeTotal', accessor: 'importeTotal', width: '8%', alignCell: 'right', disableSortBy: true },
        { Header: 'Vto.', Cell: (props) => (props.value) ? getDateToString(props.value, false) : '', accessor: 'fechaVencimiento2', width: '6%', disableSortBy: true  },
        { Header: 'Certif.', accessor: 'descCertificadoApremio', width: '5%', alignCell: 'right', disableSortBy: true },
        { Header: 'C.E.', Cell: cellVMR, id:'abm', accessor: 'index', width: '3%', disableGlobalFilter: true, disableSortBy: true }
    ];

    //handles
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
    const handleClickSelected = (index) => {
        const list = [...items];
        if (list[index].selectable) {
            list[index].selected = !list[index].selected;
            setItems(list);
        }
    }
    const handleClickVolver = () => {
        const url = '/certificados-apremio';
        navigate(url, { replace: true });
    }
    const handleClickGenerar = () => {
        if (isValid()) {
            CreateCertificadoApremio();
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
    const callbackSuccessSearchCuentaCorrienteItem = (response) => {
        response.json()
        .then((data) => {
            let items = data.cuentaCorrienteItems;

            items.forEach((item, index) => {
                if (item.fechaMovimiento) item.fechaMovimiento = new Date(item.fechaMovimiento);
                if (item.fechaVencimiento1) item.fechaVencimiento1 = new Date(item.fechaVencimiento1);
                if (item.fechaVencimiento2) item.fechaVencimiento2 = new Date(item.fechaVencimiento2);

                item.codigoTasa = getCodigoTasa(item.idTasa);
                item.descTasa = getDescTasa(item.idTasa);
                item.descSubTasa = getDescSubTasa(item.idSubTasa);

                if (item.idCertificadoApremio) {
                    const certificadoApremio = data.certificadosApremio.find(f => f.id === item.idCertificadoApremio);
                    if (certificadoApremio) {
                        item.descCertificadoApremio = certificadoApremio.numero;
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

            setState(prevState => {
                return {...prevState, loading: false, list: items};
            });
            FilterItems(items);
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
    function SearchCuentaCorrienteItem() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const paramsUrl = `/deuda/${formValues.idCuenta}`;

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
    function CreateCertificadoApremio() {

        setState(prevState => {
            return {...prevState, loading: true};
        });

        const callbackSuccess = (response) => {
            response.json()
            .then((row) => {
                ShowToastMessage(ALERT_TYPE.ALERT_SUCCESS, "Certificado Apremio ingresado correctamente", () => {
                    const url = '/certificado-apremio/' + OPERATION_MODE.EDIT + '/' + row.certificadoApremio.id;
                    navigate(url, { replace: true });
                });
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                    return {...prevState, loading: false};
                });
            });
        };

        const dataBody = {
            idCuenta: formValues.idCuenta,
            partidas: items.filter(f => f.selected).map(item => item.numeroPartida)
        };

        ServerRequest(
            REQUEST_METHOD.POST,
            null,
            true,
            APIS.URLS.CERTIFICADO_APREMIO,
            null,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );

    }  
    function isValid(){
        if (formValues.idCuenta === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Cuenta');
            return false;
        }
        if (items.filter(f => f.selected).length <= 0){
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar al menos un item del listado para generar el certificado');
            return false;
        }

        return true;
    }
    function FilterItems(fullItems) {
        let itemsFilter = [...fullItems].filter(f => {
            return (f.fechaMovimiento.getTime() <= formValues.fechaDeudaAl.getTime() &&
                    (isNull(formValues.fechaDesde) || f.fechaVencimiento2.getTime() >= formValues.fechaDesde.getTime()) &&
                    (isNull(formValues.fechaHasta) || f.fechaVencimiento2.getTime() <= formValues.fechaHasta.getTime()) &&
                    (formValues.traePlanes || !f.esPlanPago));
        });

        itemsFilter.sort((a,b) => a.indexMovimiento - b.indexMovimiento);
        itemsFilter.forEach((item, index) => {
            item.index = index;
            item.selected = false;
            item.selectable = (item.idCertificadoApremio === null && !item.condicionEspecialInhibicion);
        });

        setItems(itemsFilter);
    }

    function ValidFilters() {
        if (formValues.idCuenta === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe definir la Cuenta');
            return false;
        }
        if (formValues.fechaDeudaAl === null) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe definir la fecha Deuda al');
            return false;
        }

        return true;
    }
    function ApplyFilters() {
        UpdateFilters();
        SearchCuentaCorrienteItem();
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

        <SectionHeading title={<>Nuevo Certificado</>} />

        <section className='section-accordion'>

            <AdvancedSearch
                labels={filters.labels.filter(f => f.value !== f.valueIgnore)}
                onSearch={ApplyFilters}
                onValidation={ValidFilters}
            >

                <div className='row form-basic'>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idCuenta" className="form-label">Cuenta</label>
                        <InputCuenta
                            name="idCuenta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idCuenta }
                            onChange={({target}) =>{
                                let idCuenta = 0;
                                let descCuenta = '';
                                let nombreContribuyente = '';
                                let numeroDocumentoContribuyente = '';
                                let tipoDocumentoContribuyente = ''; 
                                let titular = '';
                                if (target.row) {
                                    idCuenta = parseInt(target.value);
                                    descCuenta = target.row.numeroCuenta;
                                    nombreContribuyente = target.row.nombreContribuyente;
                                    numeroDocumentoContribuyente = target.row.numeroDocumentoContribuyente;
                                    tipoDocumentoContribuyente = getDescTipoDocumento(target.row.idTipoDocumentoContribuyente);
                                    titular = `${nombreContribuyente} (${tipoDocumentoContribuyente} ${numeroDocumentoContribuyente})`
                                }
                                formSet({...formValues, 
                                    idCuenta: idCuenta, 
                                    descCuenta: descCuenta, 
                                    titular: titular
                                });
                            }}
                        />
                     </div>
                     <div className="col-12 col-md-6">
                        <label htmlFor="titular" className="form-label">Titular</label>
                        <input
                            name="titular"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.titular }
                            disabled={true}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6 col-lg-3">
                        <label htmlFor="fechaDesde" className="form-label">Fecha vencimiento desde</label>
                        <DatePickerCustom
                            name="fechaDesde"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaDesde }
                            onChange={({target}) =>{
                                let descFecha = '';
                                if (target.value) {
                                    descFecha = getDateToString(target.value, false);
                                }
                                formSet({...formValues, 
                                    fechaDesde: target.value, 
                                    descFechaDesde: descFecha
                                });
                            }}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6 col-lg-3">
                        <label htmlFor="fechaHasta" className="form-label">Fecha vencimiento hasta</label>
                        <DatePickerCustom
                            name="fechaHasta"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaHasta }
                            onChange={({target}) =>{
                                let descFecha = '';
                                if (target.value) {
                                    descFecha = getDateToString(target.value, false);
                                }
                                formSet({...formValues, 
                                    fechaHasta: target.value, 
                                    descFechaHasta: descFecha
                                });
                            }}
                            minValue={formValues.fechaDesde}
                        />
                    </div>
                    <div className="mb-3 col-12 col-md-6 col-lg-3">
                        <label htmlFor="fechaDeudaAl" className="form-label">Deuda al</label>
                        <DatePickerCustom
                            name="fechaDeudaAl"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaDeudaAl }
                            onChange={({target}) =>{
                                let descFecha = '';
                                if (target.value) {
                                    descFecha = getDateToString(target.value, false);
                                }
                                formSet({...formValues, 
                                    fechaDeudaAl: target.value, 
                                    descFechaDeudaAl: descFecha
                                });
                            }}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3 form-check">
                        <label htmlFor="traePlanes" className="form-label">Traer cuotas de planes</label>
                        <input
                            name="traePlanes"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            checked={formValues.traePlanes }
                            onChange={({target}) =>{
                                let traePlanes = target.checked;
                                let descTraePlanes = (target.checked) ? 'SI' : 'NO';
                                formSet({...formValues, traePlanes: traePlanes, descTraePlanes: descTraePlanes});
                            }}   
                        />  
                    </div>

                </div>

            </AdvancedSearch>

            <div className="m-top-20">

                <TableCustom
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

        </section>
        <footer className='footer footer-action'>
            <div className='footer-action-container'>
                <button className="btn back-button float-start" onClick={ (event) => handleClickVolver() }>Volver</button>
                <button className="btn action-button float-end" onClick={ (event) => handleClickGenerar() }>Generar</button>
            </div>
        </footer>

    </>
    )
}

export default CertificadoApremioItemsView;