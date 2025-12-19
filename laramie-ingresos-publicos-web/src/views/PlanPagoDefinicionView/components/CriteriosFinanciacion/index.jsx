import { InputLista, InputNumber, } from '../../../../components/common'
import { OPERATION_MODE } from '../../../../consts/operationMode'
import AccordionIcon from '../AccordionIcon'
import { DefinicionIntereses, DefinicionQuita } from './components'

const CriteriosFinanciacion = ({ open, toggle, formValues, handleInputProxy, params, otherValues, setOtherValues, setPendingChange }) => {
    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon {...{open}} />
                        <h3 className={open ? 'active' : ''}>Criterios de financiación</h3>
                    </div>
                </div>
            </div>
        </div>
        {open &&
            <div className='accordion-body'>
                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-3 form-check">
                        <label htmlFor="tieneAnticipo" className="form-check-label">Anticipo</label>
                        <input
                            name="tieneAnticipo"
                            type="checkbox"
                            className="form-check-input"
                            checked={formValues.tieneAnticipo}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="porcentajeAnticipo" className="form-label">Porcentaje de anticipo</label>
                        <InputNumber
                            name="porcentajeAnticipo"
                            placeholder=""
                            className="form-control"
                            value={formValues.porcentajeAnticipo}
                            onChange={handleInputProxy}
                            precision={2}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="periodicidad" className="form-label">Periodicidad</label>
                        <InputNumber
                            name="peridiocidad"
                            placeholder=""
                            className="form-control"
                            value={formValues.peridiocidad} // es un typo en el back
                            onChange={handleInputProxy}
                            precision={0}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="idTipoCalculoInteres" className="form-label">Tipo de cálculo</label>
                        <InputLista
                            name="idTipoCalculoInteres"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTipoCalculoInteres}
                            onChange={handleInputProxy}
                            lista="TipoCalculoInteres"
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="cuotaDesde" className="form-label">Cuotas desde</label>
                        <InputNumber
                            name="cuotaDesde"
                            placeholder=""
                            className="form-control"
                            value={formValues.cuotaDesde}
                            onChange={handleInputProxy}
                            precision={0}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="cuotaHasta" className="form-label">Cuotas hasta</label>
                        <InputNumber
                            name="cuotaHasta"
                            placeholder=""
                            className="form-control"
                            value={formValues.cuotaHasta}
                            onChange={handleInputProxy}
                            precision={0}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="montoCuotaDesde" className="form-label">Monto cuota desde</label>
                        <InputNumber
                            name="montoCuotaDesde"
                            placeholder=""
                            className="form-control"
                            value={formValues.montoCuotaDesde}
                            onChange={handleInputProxy}
                            precision={2}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="montoCuotaHasta" className="form-label">Monto cuota hasta</label>
                        <InputNumber
                            name="montoCuotaHasta"
                            placeholder=""
                            className="form-control"
                            value={formValues.montoCuotaHasta}
                            onChange={handleInputProxy}
                            precision={2}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <DefinicionIntereses
                        {...{params}}
                        data={otherValues.planPagosDefinicionInteres}
                        setData={data => setOtherValues(prev => ({...prev, planPagosDefinicionInteres: data}))}
                        params={params}
                        setPendingChange={setPendingChange} 
                    />
                    <DefinicionQuita
                        {...{params}}
                        data={otherValues.planPagosDefinicionQuitaCuota}
                        setData={data => setOtherValues(prev => ({...prev, planPagosDefinicionQuitaCuota: data}))}
                        params={params}
                        setPendingChange={setPendingChange}
                    />
                </div>
            </div>
        }
    </>
}

export default CriteriosFinanciacion
