export const initialFormValues = {
    id: -1,
    idEstadoPagoContadoDefinicion: 0,
    idTipoPlanPago: 0,
    idTipoTributo: 0,
    idTasaPagoContado: 0,
    idSubTasaPagoContado: 0,
    idTasaSellados: 0,
    idSubTasaSellados: 0,
    idTasaGastosCausidicos: 0,
    idSubTasaGastosCausidicos: 0,
    codigo: '',
    descripcion: '',
    fechaDesde: null,
    fechaHasta: null,
    idTipoAlcanceTemporal: 0,
    fechaDesdeAlcanceTemporal: null,
    fechaHastaAlcanceTemporal: null,
    mesDesdeAlcanceTemporal: 0,
    mesHastaAlcanceTemporal: 0,
    aplicaDerechosEspontaneos: false,
    aplicaTotalidadDeudaAdministrativa: false,
    aplicaDeudaAdministrativa: false,
    aplicaDeudaLegal: false,
    aplicaGranContribuyente: false,
    aplicaPequenioContribuyente: false,
    montoDeudaAdministrativaDesde: 0,
    montoDeudaAdministrativaHasta: 0,
    idViaConsolidacion: 0,
    porcentajeQuitaRecargos: 0,
    porcentajeQuitaMultaInfracciones: 0,
    porcentajeQuitaHonorarios: 0,
    porcentajeQuitaAportes: 0,
    idUsuarioCreacion: 0,
    fechaCreacion: null
}

export const initialOtherValues = {
    archivos: [],
    observaciones: [],
    etiquetas: [],
    pagosContadoDefinicionAlcanceTasa: [],
    pagosContadoDefinicionAlcanceRubro: [],
    pagosContadoDefinicionAlcanceGrupo: [],
    pagosContadoDefinicionAlcanceZonaTarifaria: [],
    pagosContadoDefinicionAlcanceCondicionFiscal: [],
    pagosContadoDefinicionAlcanceRubroAfip: [],
    pagosContadoDefinicionAlcanceFormaJuridica: [],
    pagosContadoDefinicionTipoVinculoCuenta: [],
}

export const formatDataForPut = (data, otherValues) => {
    const newOtherValues = {}
    Object.keys(otherValues).forEach(key => {
        if (key !== 'pagoContadoDefinicion') newOtherValues[key] = otherValues[key].filter(item => item.state !== 'o')
    })

    return {
        ...newOtherValues,
        pagoContadoDefinicion: data,
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