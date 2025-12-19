import { AccordionIcon } from '..'
import { RelacionesPermitidas } from './components'
import { DatePickerCustom, InputLista, InputEntidad, } from '../../../../components/common'
import { OPERATION_MODE } from '../../../../consts/operationMode'

const Definicion = ({ toggle, open, formValues, handleInputProxy, params, otherValues, setOtherValues, setPendingChange, descUsuarioCreacion }) => {
    return <>
        <div className='accordion-header'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon open={open} />
                        <h3 className={open ? 'active' : ''}>Definición</h3>
                    </div>
                </div>
            </div>
        </div>
        {(open &&
            <div className='accordion-body'>
                <div className='row form-basic'>

                    <div className="col-12 col-md-4 col-lg-3">
                        <label htmlFor="codigo" className="form-label">Código</label>
                        <input
                            name="codigo"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.codigo}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-8 col-lg-9">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <input
                            name="descripcion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.descripcion}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idTipoPlanPago" className="form-label">Tipo de plan</label>
                        <InputEntidad
                            name="idTipoPlanPago"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTipoPlanPago}
                            onChange={handleInputProxy}
                            entidad="TipoPlanPago"
                            title="Tipo de Plan de Pago"
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idTipoTributo" className="form-label">Tipo de tributo</label>
                        <InputLista
                            name="idTipoTributo"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTipoTributo}
                            onChange={handleInputProxy}
                            lista="TipoTributo"
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    
                    {params.mode !== OPERATION_MODE.NEW && <>
                        <RelacionesPermitidas 
                            {...{params}}
                            data={otherValues.planPagosDefinicionTipoVinculoCuenta}
                            setData={data => {setOtherValues(prev => ({...prev, planPagosDefinicionTipoVinculoCuenta: data})); setPendingChange(true)}}
                            idTipoTributo={formValues.idTipoTributo}
                        />
                        <div className="col-12 col-md-4 col-lg-3">
                            <label htmlFor="idEstadoPlanPagoDefinicion" className="form-label">Estado</label>
                            <InputLista
                                name="idEstadoPlanPagoDefinicion"
                                placeholder=""
                                className="form-control"
                                value={formValues.idEstadoPlanPagoDefinicion}
                                onChange={handleInputProxy}
                                lista="EstadoPlanPagoDefinicion"
                                disabled={params.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label htmlFor="fechaDesde" className="form-label">Fecha vigencia desde</label>
                            <DatePickerCustom
                                name="fechaDesde"
                                placeholder=""
                                className="form-control"
                                value={formValues.fechaDesde}
                                onChange={handleInputProxy}
                                disabled={params.mode === OPERATION_MODE.VIEW}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label htmlFor="fechaHasta" className="form-label">Fecha vigencia hasta</label>
                            <DatePickerCustom
                                name="fechaHasta"
                                placeholder=""
                                className="form-control"
                                value={formValues.fechaHasta}
                                onChange={handleInputProxy}
                                disabled={params.mode === OPERATION_MODE.VIEW}
                                minValue={formValues.fechaDesde}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label htmlFor="descUsuarioCreacion" className="form-label">Usuario de creación</label>
                            <input
                                name="descUsuarioCreacion"
                                type="text"
                                placeholder=""
                                className="form-control"
                                value={descUsuarioCreacion}
                                disabled
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label htmlFor="fechaCreacion" className="form-label">Fecha de creación</label>
                            <DatePickerCustom
                                name="fechaCreacion"
                                placeholder=""
                                className="form-control"
                                value={formValues.fechaCreacion}
                                disabled
                            />
                        </div>
                    </>}

                </div>
            </div>
        )}
    </>
}

export default Definicion
