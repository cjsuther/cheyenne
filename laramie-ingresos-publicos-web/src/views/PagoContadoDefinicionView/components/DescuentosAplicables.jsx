import { AccordionIcon, InputNumber } from "../../../components/common"
import { OPERATION_MODE } from "../../../consts/operationMode"

const DescuentosAplicables = ({ toggle, open, formValues, handleInputProxy, params }) => {
    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon open={open} />
                        <h3 className={open ? 'active' : ''}>Descuentos Aplicables</h3>
                    </div>
                </div>
            </div>
        </div>
        {open && (
            <div className='accordion-body'>
                <div className="row form-basic">
                    <div className="col-12 col-md-6">
                        <label htmlFor="porcentajeQuitaRecargos" className="form-label">% Quita de recargos</label>
                        <InputNumber
                            name="porcentajeQuitaRecargos"
                            placeholder=""
                            className="form-control"
                            precision={2}
                            value={formValues.porcentajeQuitaRecargos}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="porcentajeQuitaMultaInfracciones" className="form-label">% Quita de multas e infracciones</label>
                        <InputNumber
                            name="porcentajeQuitaMultaInfracciones"
                            placeholder=""
                            className="form-control"
                            precision={2}
                            value={formValues.porcentajeQuitaMultaInfracciones}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>

                    <div className='m-top-10'/>

                    <div className="col-12 col-md-6">
                        <label htmlFor="porcentajeQuitaHonorarios" className="form-label">% Quita de aportes</label>
                        <InputNumber
                            name="porcentajeQuitaHonorarios"
                            placeholder=""
                            className="form-control"
                            precision={2}
                            value={formValues.porcentajeQuitaHonorarios}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="porcentajeQuitaAportes" className="form-label">% Quita de honorarios</label>
                        <InputNumber
                            name="porcentajeQuitaAportes"
                            placeholder=""
                            className="form-control"
                            precision={2}
                            value={formValues.porcentajeQuitaAportes}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                </div>
            </div>
        )}
    </>
}

export default DescuentosAplicables
