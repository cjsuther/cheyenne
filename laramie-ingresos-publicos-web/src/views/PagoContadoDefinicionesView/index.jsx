import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { APPCONFIG } from '../../app.config';
import { AdvancedSearch, DatePickerCustom, InputEntidad, InputLista, InputSubTasa, InputTasa, Loading, MessageModal, SectionHeading, TableCustom } from '../../components/common';
import DataTaggerModalApi from '../../components/controls/DataTaggerModalApi';
import { useEntidad } from '../../components/hooks/useEntidad';
import { useLista } from '../../components/hooks/useLista';
import { APIS } from '../../config/apis';
import { ALERT_TYPE } from '../../consts/alertType';
import { OPERATION_MODE } from '../../consts/operationMode';
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { ServerRequest } from '../../utils/apiweb';
import { getDateSerialize, getDateToString } from '../../utils/convert';
import ShowToastMessage from '../../utils/toast';

const labelSchema = [
    { title: 'Tipo Plan Pago', field: 'idTipoPlanPago' },
    { title: 'Tipo Tributo', field: 'idTipoTributo', },
    { title: 'Tasa', field: 'idTasa', },
    { title: 'SubTasa', field: 'idSubTasa', },
    { title: 'Estado', field: 'idEstadoPagoContadoDefinicion', },
    { title: 'Fecha Desde', field: 'fechaDesde', },
    { title: 'Fecha Hasta', field: 'fechaHasta', },
    { title: 'Descripcion', field: 'descripcion', },
    { title: 'Etiqueta', field: 'etiqueta', },
]

const PagoContadoDefinicionesView = () => {
    let navigate = useNavigate();    

    const [data, setData] = useState([])
    const [filters, setFilters] = useState({
        idTipoPlanPago: { value: 0, label: '' },
        idTipoTributo: { value: 0, label: '' },
        idTasa: { value: 0, label: '', },
        idSubTasa: { value: 0, label: '', },
        idEstadoPagoContadoDefinicion: { value: 0, label: '', },
        fechaDesde: { value: null, label: '', },
        fechaHasta: { value: null, label: '', },
        descripcion: { value: '', label: '', },
        etiqueta: { value: '', label: '', },
    })
    const [appliedFilters, setAppliedFilters] = useState(filters)
    const [removingId, setRemovingId] = useState(null)
    const [dataTaggerId, setDataTaggerId] = useState(null)
    const [loading, setLoading] = useState(false)

    const labels = useMemo(() => {
        return labelSchema.filter(x => appliedFilters[x.field].value).map(x => ({ title: x.title, value: appliedFilters[x.field].label }))
    }, [appliedFilters])

    const onSuccess = (res) => {
        res.json().then(data => {
            data.forEach(x => {
                if (x.fechaCreacion) x.fechaCreacion = new Date(x.fechaCreacion);
                if (x.fechaDesde) x.fechaDesde = new Date(x.fechaDesde);
                if (x.fechaHasta) x.fechaHasta = new Date(x.fechaHasta);
                if (x.fechaDesdeAlcanceTemporal) x.fechaDesdeAlcanceTemporal = new Date(x.fechaDesdeAlcanceTemporal);
                if (x.fechaHastaAlcanceTemporal) x.fechaHastaAlcanceTemporal = new Date(x.fechaHastaAlcanceTemporal);
            });
            setData(data);
        })
        setLoading(false)
    }

    const onNoSuccess = (response) => {
        response.json()
            .then((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error.message);
                setLoading(false)
            })
            .catch((error) => {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando respuesta: ' + error);
                setLoading(false)
            });
    }

    const onError = (error) => {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, 'Error procesando solicitud: ' + error.message)
        setLoading(false)
    }

    //#region entidades/listas
    const [getEntidades, _getEntidad, entidadesReady] = useEntidad({
        entidades: ['TipoPlanPago', 'Tasa', 'SubTasa'],
        onLoaded: (entidades, isSuccess, error) => {
            if (isSuccess) {

            }
            else {
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
            }
        },
        memo: {
            key: 'PagoContadoDefinicionesEntidades',
            timeout: 0
          },
    })
    const getEntidad = (type, id) => _getEntidad(type, id) ?? {}

    const [getLista, _getRowLista ] = useLista({
        listas: ['TipoTributo', 'EstadoPagoContadoDefinicion'],
        onLoaded: (listas, isSuccess, error) => {
          if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
          }
        },
        memo: {
          key: 'PagoContadoDefinicionesListas',
          timeout: 0
        },
    })
    const getRowLista = (lista, id) => _getRowLista(lista, id) ?? {}
    //#endregion

    //#region events
    const onAdd = () => {
        const url = '/pago-contado-definicion/' + OPERATION_MODE.NEW;
        navigate(url, { replace: true });
    }

    const onView = (item) => {
        const url = '/pago-contado-definicion/' + OPERATION_MODE.VIEW + '/' + item.id;
        navigate(url, { replace: true });
    }

    const onModify = (item) => {
        const url = '/pago-contado-definicion/' + OPERATION_MODE.EDIT + '/' + item.id;
        navigate(url, { replace: true });
    }

    const confirmRemoveId = (id) => {
        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.DELETE,
            null,
            true,
            APIS.URLS.PAGO_CONTADO_DEFINICION,
            `/${id}`,
            null,
            () => {
                setData(prev => prev.filter(x => x.id !== id))
                setLoading(false)
            },
            onNoSuccess,
            onError,
        )
        setRemovingId(null)
    }

    const onAdditionalInfo = (item) => {
        setDataTaggerId(item.id)
    }

    const onSearch = () => {
        setAppliedFilters(filters)
        const paramsUrl = `/filter?` +
            `idTipoPlanPago=${filters.idTipoPlanPago.value}&` +
            `idTipoTributo=${filters.idTipoTributo.value}&` +
            `idTasaPagoContado=${filters.idTasa.value}&` + 
            `idSubTasaPagoContado=${filters.idSubTasa.value}&` + 
            `idEstadoPagoContadoDefinicion=${filters.idEstadoPagoContadoDefinicion.value}&` +
            `fechaDesde=${encodeURIComponent(getDateSerialize(filters.fechaDesde.value))}&` +
            `fechaHasta=${encodeURIComponent(getDateSerialize(filters.fechaHasta.value))}&` +
            `descripcion=${filters.descripcion.value}&` +
            `etiqueta=${filters.etiqueta.value}`

        setLoading(true)
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.PAGO_CONTADO_DEFINICION,
            paramsUrl,
            null,
            onSuccess,
            onNoSuccess,
            onError,
        )
    }
    //#endregion

    const cellAVMR = {
        id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true,
        Header: (props) => (
            <div className='action'>
                <div onClick={onAdd} className="link">
                    <i className="fa fa-plus" title="nuevo"></i>
                </div>
            </div>
        ),
        Cell: (props) =>  (
            <div className='action'>
                <div onClick={() => onView(props.row.original)} className="link">
                    <i className="fa fa-search" title="ver"></i>
                </div>
                <div onClick={() => onModify(props.row.original)} className="link">
                    <i className="fa fa-pen" title="modificar"></i>
                </div>
                <div onClick={() => setRemovingId(props.row.original.id)} className="link">
                    <i className="fa fa-trash" title="borrar"></i>
                </div>
                <div onClick={() => onAdditionalInfo(props.row.original)} className="link">
                    <i className="fa fa-info-circle" title="Información adicional"></i>
                </div>
            </div>
        ),
    }

    const subTasaCell = ({ value }) => {
        const item = getEntidad('SubTasa', value)
        if (item.codigo && item.descripcion) return `${item.codigo} - ${item.descripcion}`
        else return ''
    }

    return (
        <>

        <SectionHeading title={<>Definición de Pagos Contados</>} />

        <section className='section-accordion'>

            <Loading visible={loading} />

            <AdvancedSearch
                labels={labels}
                onSearch={onSearch}
            >
                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idTipoPlanPago" className="form-label">Tipo Plan Pago</label>
                        <InputEntidad
                            name="idTipoPlanPago"
                            placeholder=""
                            className="form-control"
                            value={filters.idTipoPlanPago.value}
                            title="Tipo Plan Pago"
                            entidad="TipoPlanPago"
                            onChange={({ target: { row } }) => setFilters(prev => ({
                                ...prev,
                                idTipoPlanPago: { value: row ? row.id : 0 , label: row ? row.codigo : null }
                            }))}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idTipoTributo" className="form-label">Tipo Tributo</label>
                        <InputLista
                            name="idTipoTributo"
                            placeholder=""
                            className="form-control"
                            value={filters.idTipoTributo.value}
                            title="Tipo Tributo"
                            lista="TipoTributo"
                            onChange={({ target: { row } }) => setFilters(prev => ({
                                ...prev,
                                idTipoTributo: { value: row ? row.id : 0 , label: row ? row.nombre : null }
                            }))}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idEstadoPagoContadoDefinicion" className="form-label">Estado</label>
                        <InputLista
                            name="idEstadoPagoContadoDefinicion"
                            placeholder=""
                            className="form-control"
                            value={filters.idEstadoPagoContadoDefinicion.value}
                            title="Estado"
                            lista="EstadoPagoContadoDefinicion"
                            onChange={({ target: { row } }) => setFilters(prev => ({
                                ...prev,
                                idEstadoPagoContadoDefinicion: { value: row ? row.id : 0 , label: row ? row.nombre : null }
                            }))}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="etiqueta" className="form-label">Etiqueta</label>
                        <input
                            name="etiqueta"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={filters.etiqueta.value}
                            onChange={({ target: { value } }) => setFilters(prev => ({
                                ...prev,
                                etiqueta: { value, label: value }
                            }))}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idTasa" className="form-label">Tasa</label>
                        <InputTasa
                            name="idTasa"
                            placeholder=""
                            className="form-control"
                            value={filters.idTasa.value}
                            onChange={({ target: { row } }) => setFilters(prev => ({
                                ...prev,
                                idTasa: { value: row ? row.id : 0 , label: row ? row.codigo : null }
                            }))}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idSubTasa" className="form-label">SubTasa</label>
                        <InputSubTasa
                            name="idSubTasa"
                            placeholder=""
                            className="form-control"
                            idTasa={filters.idTasa.value}
                            value={filters.idSubTasa.value}
                            onChange={({ target: { row } }) => setFilters(prev => ({
                                ...prev,
                                idSubTasa: { value: row ? row.id : 0, label: row ? `${row.codigo} - ${row.descripcion}` : null }
                            }))}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="fechaDesde" className="form-label">Fecha Desde</label>
                        <DatePickerCustom
                            name="fechaDesde"
                            placeholder=""
                            className="form-control"
                            value={filters.fechaDesde.value}
                            onChange={({ target: { value } }) => setFilters(prev => ({
                                ...prev,
                                fechaDesde: { value, label: getDateToString(value) }
                            }))}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="fechaHasta" className="form-label">Fecha Hasta</label>
                        <DatePickerCustom
                            name="fechaHasta"
                            placeholder=""
                            className="form-control"
                            value={filters.fechaHasta.value}
                            onChange={({ target: { value } }) => setFilters(prev => ({
                                ...prev,
                                fechaHasta: { value, label: getDateToString(value) }
                            }))}
                            minValue={filters.fechaDesde.value}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <input
                            name="descripcion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={filters.descripcion.value}
                            onChange={({ target: { value } }) => setFilters(prev => ({
                                ...prev,
                                descripcion: { value, label: value }
                            }))}
                        />
                    </div>
                </div>

            </AdvancedSearch>

            <div className="m-top-20">

                <TableCustom
                    className={'TableCustomBase'}
                    data={data}
                    columns={[
                        { Header: 'Plan Pago', accessor: 'idTipoPlanPago', Cell: ({ value }) => getEntidad('TipoPlanPago', value).codigo ?? '', width: '10%', },
                        { Header: 'Tipo Tributo', accessor: 'idTipoTributo', Cell: ({ value }) => getRowLista('TipoTributo', value).nombre ?? '', width: '10%', },
                        { Header: 'Tasa', accessor: 'idTasaPagoContado', Cell: ({ value }) => getEntidad('Tasa', value).codigo ?? '', width: '10%', },
                        { Header: 'SubTasa', accessor: 'idSubTasaPagoContado', Cell: subTasaCell, width: '10%', },
                        { Header: 'Código', accessor: 'codigo', width: '10%', },
                        { Header: 'Descripción', accessor: 'descripcion', width: '10%', },
                        { Header: 'Desde', accessor: 'fechaDesde', Cell: ({ value }) => getDateToString(value, false), width: '7%', },
                        { Header: 'Hasta', accessor: 'fechaHasta', Cell: ({ value }) => getDateToString(value, false), width: '7%', },
                        { Header: 'Estado', accessor: 'idEstadoPagoContadoDefinicion', Cell: ({ value }) => getRowLista('EstadoPagoContadoDefinicion', value).nombre ?? '',  width: '7%', },
                        cellAVMR,
                    ]}
                />

            </div>
            
            {removingId && 
                <MessageModal
                    title={"Confirmación"}
                    message={"¿Está seguro de borrar el registro?"}
                    onDismiss={() => setRemovingId(null)}
                    onConfirm={() => confirmRemoveId(removingId)}
                />
            }

            {dataTaggerId &&
                <DataTaggerModalApi
                    title="Información adicional de Pago Contado"
                    entidad="PagoContadoDefinicion"
                    idEntidad={dataTaggerId}
                    disabled={false}
                    onConfirm={() => setDataTaggerId(null)}
                    onDismiss={() => setDataTaggerId(null)}
                />
            }

        </section>

        </>
    )
}

export default PagoContadoDefinicionesView
