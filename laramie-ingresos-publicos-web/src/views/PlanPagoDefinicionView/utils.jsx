export const initialFormValues = {
    id: -1,
    idEstadoPlanPagoDefinicion: 0,
    idTipoPlanPago: 0,
    idTipoTributo: 0,
    idTasaPlanPago: 0,
    idSubTasaPlanPago: 0,
    idTasaInteres: 0,
    idSubTasaInteres: 0,
    idTasaSellados: 0,
    idSubTasaSellados: 0,
    idTasaGastosCausidicos: 0,
    idSubTasaGastosCausidicos: 0,
    codigo: '',
    descripcion: '',
    fechaDesde: null,
    fechaHasta: null,
    tieneAnticipo: false,
    cuotaDesde: 0,
    cuotaHasta: 0,
    peridiocidad: 1,
    idTipoVencimientoAnticipo: 0,
    idTipoVencimientoCuota1: 0,
    idTipoVencimientoCuotas: 0,
    porcentajeAnticipo: 0,
    idTipoAlcanceTemporal: 0,
    fechaDesdeAlcanceTemporal: null,
    fechaHastaAlcanceTemporal: null,
    mesDesdeAlcanceTemporal: 0,
    mesHastaAlcanceTemporal: 0,
    aplicaDerechosEspontaneos: false,
    aplicaCancelacionAnticipada: false,
    aplicaTotalidadDeudaAdministrativa: false,
    aplicaDeudaAdministrativa: false,
    aplicaDeudaLegal: false,
    aplicaGranContribuyente: false,
    aplicaPequenioContribuyente: false,
    caducidadAnticipoImpago: false,
    caducidadCantidadCuotasConsecutivas: 0,
    caducidadCantidadCuotasNoConsecutivas: 0,
    caducidadCantidadDiasVencimiento: 0,
    caducidadCantidadDeclaracionesJuradas: 0,
    montoDeudaAdministrativaDesde: 0,
    montoDeudaAdministrativaHasta: 0,
    montoCuotaDesde: 0,
    montoCuotaHasta: 0,
    idTipoCalculoInteres: 0,
    idUsuarioCreacion: 0,
    fechaCreacion: null
}

export const initialOtherValues = {
    archivos: [],
    observaciones: [],
    etiquetas: [],
    planPagosDefinicionAlcanceTasa: [],
    planPagosDefinicionAlcanceRubro: [],
    planPagosDefinicionAlcanceGrupo: [],
    planPagosDefinicionAlcanceZonaTarifaria: [],
    planPagosDefinicionAlcanceCondicionFiscal: [],
    planPagosDefinicionAlcanceRubroAfip: [],
    planPagosDefinicionAlcanceFormaJuridica: [],
    planPagosDefinicionQuitaCuota: [],
    planPagosDefinicionInteres: [],
    planPagosDefinicionTipoVinculoCuenta: [],
}

export const formatDataForPost = (data, otherValues) => {
    const newOtherValues = {}
    Object.keys(otherValues).forEach(key => {
        if (key !== 'planPagoDefinicion') newOtherValues[key] = otherValues[key].filter(item => item.state !== 'o')
    })
    return {
        ...otherValues,
        planPagoDefinicion: data,
    }
}

export const buildCellAVMR = ({ onAdd, onView, onModify, onRemove, readOnly }) => ({
    id:'abm', accessor: 'id', width: '10%', disableGlobalFilter: true, disableSortBy: true,
    Header: (props) => readOnly ? <div/> : (
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
            {!readOnly && <>
                <div onClick={() => onModify(props.row.original)} className="link">
                    <i className="fa fa-pen" title="modificar"></i>
                </div>
                <div onClick={() => onRemove(props.row.original)} className="link">
                    <i className="fa fa-trash" title="borrar"></i>
                </div>
            </>}
        </div>
    ),
})
