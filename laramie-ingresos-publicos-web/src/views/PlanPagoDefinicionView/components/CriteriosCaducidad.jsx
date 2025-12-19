import { InputNumber, } from '../../../components/common'
import { OPERATION_MODE } from '../../../consts/operationMode'
import AccordionIcon from "./AccordionIcon"

const CriteriosCaducidad = ({ open, toggle, formValues, handleInputProxy, params }) => {
    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon {...{open}} />
                        <h3 className={open ? 'active' : ''}>Criterios de caducidad</h3>
                    </div>
                </div>
            </div>
        </div>
        {open &&
            <div className='accordion-body'>
                <div className='row form-basic'>
                    <div className="col-12 col-md-6 col-lg-4 form-check">
                        <label htmlFor="caducidadAnticipoImpago" className="form-check-label">Anticipo Impago</label>
                        <input
                            name="caducidadAnticipoImpago"
                            type="checkbox"
                            className="form-check-input"
                            checked={formValues.caducidadAnticipoImpago}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="caducidadCantidadCuotasConsecutivas" className="form-label">Cantidad de cuotas consecutivas</label>
                        <InputNumber
                            name="caducidadCantidadCuotasConsecutivas"
                            placeholder=""
                            className="form-control"
                            value={formValues.caducidadCantidadCuotasConsecutivas}
                            onChange={handleInputProxy}
                            precision={0}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="caducidadCantidadCuotasNoConsecutivas" className="form-label">Cantidad cuotas no consecutivas</label>
                        <InputNumber
                            name="caducidadCantidadCuotasNoConsecutivas"
                            placeholder=""
                            className="form-control"
                            value={formValues.caducidadCantidadCuotasNoConsecutivas}
                            onChange={handleInputProxy}
                            precision={0}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                        <label htmlFor="caducidadCantidadDiasVencimiento" className="form-label">Cantidad de días de vencimiento</label>
                        <InputNumber
                            name="caducidadCantidadDiasVencimiento"
                            placeholder=""
                            className="form-control"
                            value={formValues.caducidadCantidadDiasVencimiento}
                            onChange={handleInputProxy}
                            precision={0}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-lg-4">
                        <label htmlFor="caducidadCantidadDeclaracionesJuradas" className="form-label">Cantidad de declaraciones juradas no presentadas</label>
                        <InputNumber
                            name="caducidadCantidadDeclaracionesJuradas"
                            placeholder=""
                            className="form-control"
                            value={formValues.caducidadCantidadDeclaracionesJuradas}
                            onChange={handleInputProxy}
                            precision={0}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                </div>
            </div>
        }
    </>
}

export default CriteriosCaducidad
