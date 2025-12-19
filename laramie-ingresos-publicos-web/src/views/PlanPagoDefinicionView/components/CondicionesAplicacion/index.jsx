/* eslint eqeqeq: 'off' */  // --> OFF

import { useMemo } from 'react'

import { AccordionIcon } from '..'
import { Tasas } from './components'
import { DatePickerCustom, InputLista, InputListaMulti, InputNumber, } from '../../../../components/common'
import { OPERATION_MODE } from '../../../../consts/operationMode'

const CondicionesAplicacion = ({ toggle, open, formValues, handleInputProxy, params, otherValues, setOtherValues, setPendingChange }) => {

    const aplicaDeudaValue = useMemo(() => {
        if (formValues.aplicaDeudaAdministrativa && formValues.aplicaDeudaLegal) return 1
        if (formValues.aplicaDeudaAdministrativa) return 2
        return 3
    }, [formValues.aplicaDeudaAdministrativa, formValues.aplicaDeudaLegal])
    const onAplicaDeudaChange = ({ target: { value }}) => {
        handleInputProxy({ target: { name: 'aplicaDeudaAdministrativa', value: value == 1 || value == 2 }})
        handleInputProxy({ target: { name: 'aplicaDeudaLegal', value: value == 1 || value == 3 }})
    }

    const tipoContribuyenteValue = useMemo(() => {
        if (formValues.aplicaPequenioContribuyente && formValues.aplicaGranContribuyente) return 1
        if (formValues.aplicaPequenioContribuyente) return 2
        return 3
    }, [formValues.aplicaPequenioContribuyente, formValues.aplicaGranContribuyente])
    const onTipoContribuyenteChange = ({ target: { value }}) => {
        handleInputProxy({ target: { name: 'aplicaPequenioContribuyente', value: value == 1 || value == 2 }})
        handleInputProxy({ target: { name: 'aplicaGranContribuyente', value: value == 1 || value == 3 }})
    }

    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon {...{open}} />
                        <h3 className={open ? 'active' : ''}>Condiciones de aplicación</h3>
                    </div>
                </div>
            </div>
        </div>
        {open && (
            <div className='accordion-body'>
                <div className='row form-basic'>
                    <div className="col-12 col-md-4 form-check">
                        <label htmlFor="aplicaDerechosEspontaneos" className="form-check-label">Derechos espontáneos</label>
                        <input
                            name="aplicaDerechosEspontaneos"
                            type="checkbox"
                            className="form-check-input"
                            checked={formValues.aplicaDerechosEspontaneos}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-4 form-check">
                        <label htmlFor="aplicaCancelacionAnticipada" className="form-check-label">Cancelación anticipada</label>
                        <input
                            name="aplicaCancelacionAnticipada"
                            type="checkbox"
                            className="form-check-input"
                            checked={formValues.aplicaCancelacionAnticipada}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label htmlFor="aplicaDeuda" className="form-label">Deuda aplicable</label>
                        <select
                            name="aplicaDeuda"
                            placeholder=""
                            className="form-control"
                            value={aplicaDeudaValue}
                            onChange={onAplicaDeudaChange}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        >
                            <option value="1">Todo tipo de deuda</option>
                            <option value="2">Deuda Administrativa</option>
                            <option value="3">Deuda Legal</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 form-check">
                        <label htmlFor="aplicaTotalidadDeudaAdministrativa" className="form-label">Totalidad deuda</label>
                        <input
                            name="aplicaTotalidadDeudaAdministrativa"
                            type="checkbox"
                            className="form-check-input"
                            checked={formValues.aplicaTotalidadDeudaAdministrativa}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="montoDeudaAdministrativaDesde" className="form-label">Monto mínimo aplicable</label>
                        <InputNumber
                            name="montoDeudaAdministrativaDesde"
                            placeholder=""
                            className="form-control"
                            value={formValues.montoDeudaAdministrativaDesde}
                            onChange={handleInputProxy}
                            precision={2}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="montoDeudaAdministrativaHasta" className="form-label">Monto máximo aplicable</label>
                        <InputNumber
                            name="montoDeudaAdministrativaHasta"
                            placeholder=""
                            className="form-control"
                            value={formValues.montoDeudaAdministrativaHasta}
                            onChange={handleInputProxy}
                            precision={2}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="tipoContribuyente" className="form-label">Tipo de contribuyente</label>
                        <select
                            name="tipoContribuyente"
                            placeholder=""
                            className="form-control"
                            value={tipoContribuyenteValue}
                            onChange={onTipoContribuyenteChange}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        >
                            <option value="1">Todo tipo de Contribuyente</option>
                            <option value="2">Pequeño Contribuyente</option>
                            <option value="3">Gran Contribuyente</option>
                        </select>
                    </div>
                    <InputListaMulti
                        title='Condición Fiscal'
                        name='CondicionFiscal'
                        type='lista'
                        idField='idCondicionFiscal'
                        data={otherValues.planPagosDefinicionAlcanceCondicionFiscal}
                        setData={data => {setOtherValues(prev => ({...prev, planPagosDefinicionAlcanceCondicionFiscal: data})); setPendingChange(true)}}
                        newItemFiller={{ idPlanPagoDefinicion: parseInt(params.id) }}
                        disabled={params.mode === OPERATION_MODE.VIEW}
                    />
                    <InputListaMulti
                        title='Forma Jurídica'
                        name='FormaJuridica'
                        type='lista'
                        idField='idFormaJuridica'
                        data={otherValues.planPagosDefinicionAlcanceFormaJuridica}
                        setData={data => {setOtherValues(prev => ({...prev, planPagosDefinicionAlcanceFormaJuridica: data})); setPendingChange(true)}}
                        newItemFiller={{ idPlanPagoDefinicion: parseInt(params.id) }}
                        disabled={params.mode === OPERATION_MODE.VIEW}
                    />
                    <InputListaMulti
                        title='Rubros de Comercio'
                        name='Rubro'
                        type='entidad'
                        key='Rubro'
                        idField='idRubro'
                        data={otherValues.planPagosDefinicionAlcanceRubro}
                        setData={data => {setOtherValues(prev => ({...prev, planPagosDefinicionAlcanceRubro: data})); setPendingChange(true)}}
                        newItemFiller={{ idPlanPagoDefinicion: parseInt(params.id) }}
                        disabled={params.mode === OPERATION_MODE.VIEW}
                    />
                    <InputListaMulti
                        title='Zonas Tarifarias'
                        name='ZonaTarifaria'
                        type='entidad'
                        idField='idZonaTarifaria'
                        data={otherValues.planPagosDefinicionAlcanceZonaTarifaria}
                        setData={data => {setOtherValues(prev => ({...prev, planPagosDefinicionAlcanceZonaTarifaria: data})); setPendingChange(true)}}
                        newItemFiller={{ idPlanPagoDefinicion: parseInt(params.id) }}
                        disabled={params.mode === OPERATION_MODE.VIEW}
                    />
                    <InputListaMulti
                        title='Grupos'
                        name='Grupo'
                        type='entidad'
                        idField='idGrupo'
                        data={otherValues.planPagosDefinicionAlcanceGrupo}
                        setData={data => {setOtherValues(prev => ({...prev, planPagosDefinicionAlcanceGrupo: data})); setPendingChange(true)}}
                        newItemFiller={{ idPlanPagoDefinicion: parseInt(params.id) }}
                        disabled={params.mode === OPERATION_MODE.VIEW}
                    />
                    <InputListaMulti
                        title='Rubros AFIP'
                        name='RubroAfip'
                        type='lista'
                        idField='idRubroAfip'
                        className="col-12"
                        data={otherValues.planPagosDefinicionAlcanceRubroAfip}
                        setData={data => {setOtherValues(prev => ({...prev, planPagosDefinicionAlcanceRubroAfip: data})); setPendingChange(true)}}
                        newItemFiller={{ idPlanPagoDefinicion: parseInt(params.id) }}
                        disabled={params.mode === OPERATION_MODE.VIEW}
                    />
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="idTipoAlcanceTemporal" className="form-label">Tipo alcance temporal</label>
                        <InputLista
                            name="idTipoAlcanceTemporal"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTipoAlcanceTemporal}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            lista="TipoAlcanceTemporal"
                        />
                    </div>
                    {formValues.idTipoAlcanceTemporal === 420 && <>
                        <div className="col-12 col-md-6 col-lg-2">
                            <label htmlFor="fechaDesdeAlcanceTemporal" className="form-label">Fecha desde</label>
                            <DatePickerCustom
                                name="fechaDesdeAlcanceTemporal"
                                placeholder=""
                                className="form-control"
                                value={formValues.fechaDesdeAlcanceTemporal}
                                onChange={handleInputProxy}
                                disabled={params.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                            <label htmlFor="fechaHastaAlcanceTemporal" className="form-label">Fecha hasta</label>
                            <DatePickerCustom
                                name="fechaHastaAlcanceTemporal"
                                placeholder=""
                                className="form-control"
                                value={formValues.fechaHastaAlcanceTemporal}
                                onChange={handleInputProxy}
                                disabled={params.mode === OPERATION_MODE.VIEW}
                                minValue={formValues.fechaDesdeAlcanceTemporal}
                            />
                        </div>
                    </>}
                    {formValues.idTipoAlcanceTemporal === 421 && <>
                        <div className="col-12 col-md-6 col-lg-2">
                            <label htmlFor="mesDesdeAlcanceTemporal" className="form-label">Mes desde</label>
                            <InputNumber
                                name="mesDesdeAlcanceTemporal"
                                placeholder=""
                                className="form-control"
                                value={formValues.mesDesdeAlcanceTemporal}
                                onChange={handleInputProxy}
                                precision={0}
                                disabled={params.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                            <label htmlFor="mesHastaAlcanceTemporal" className="form-label">Mes hasta</label>
                            <InputNumber
                                name="mesHastaAlcanceTemporal"
                                placeholder=""
                                className="form-control"
                                value={formValues.mesHastaAlcanceTemporal}
                                onChange={handleInputProxy}
                                precision={0}
                                disabled={params.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                    </>}
                    <Tasas
                        tasas={otherValues.planPagosDefinicionAlcanceTasa}
                        setTasas={data => setOtherValues(prev => ({...prev, planPagosDefinicionAlcanceTasa: data}))}
                        params={params}
                        setPendingChange={setPendingChange}
                    />
                </div>
            </div>
        )}
    </>
}

export default CondicionesAplicacion
