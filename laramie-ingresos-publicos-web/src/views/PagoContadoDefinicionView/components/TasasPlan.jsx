import { InputTasa, InputSubTasa, AccordionIcon, } from '../../../components/common'
import { OPERATION_MODE } from '../../../consts/operationMode'

const TasasPlan = ({ toggle, open, formValues, handleInputProxy, params }) => {
    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon open={open} />
                        <h3 className={open ? 'active' : ''}>Tasas del plan</h3>
                    </div>
                </div>
            </div>
        </div>
        {open && (
            <div className='accordion-body'>
                <div className='row form-basic'>

                    <div className="col-12 col-md-6">
                        <label htmlFor="idTasaPagoContado" className="form-label">Tasa del plan</label>
                        <InputTasa
                            name="idTasaPagoContado"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTasaPagoContado}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            hideLoading
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idSubTasaPagoContado" className="form-label">Sub tasa del plan</label>
                        <InputSubTasa
                            name="idSubTasaPagoContado"
                            placeholder=""
                            className="form-control"
                            value={formValues.idSubTasaPagoContado}
                            onChange={handleInputProxy}
                            idTasa={formValues.idTasaPagoContado}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            hideLoading
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idTasaSellados" className="form-label">Tasa de sellado</label>
                        <InputTasa
                            name="idTasaSellados"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTasaSellados}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            hideLoading
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idSubTasaSellados" className="form-label">Sub tasa de sellado</label>
                        <InputSubTasa
                            name="idSubTasaSellados"
                            placeholder=""
                            className="form-control"
                            value={formValues.idSubTasaSellados}
                            onChange={handleInputProxy}
                            idTasa={formValues.idTasaSellados}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            hideLoading
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idTasaGastosCausidicos" className="form-label">Tasa de gastos causídicos</label>
                        <InputTasa
                            name="idTasaGastosCausidicos"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTasaGastosCausidicos}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            hideLoading
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idSubTasaGastosCausidicos" className="form-label">Sub tasa de gastos causídicos</label>
                        <InputSubTasa
                            name="idSubTasaGastosCausidicos"
                            placeholder=""
                            className="form-control"
                            value={formValues.idSubTasaGastosCausidicos}
                            onChange={handleInputProxy}
                            idTasa={formValues.idTasaGastosCausidicos}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            hideLoading
                        />
                    </div>
                </div>
            </div>
        )}
    </>
}

export default TasasPlan
