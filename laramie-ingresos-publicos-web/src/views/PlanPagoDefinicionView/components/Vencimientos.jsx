import { AccordionIcon } from './'
import { InputEntidad, } from '../../../components/common'
import { OPERATION_MODE } from '../../../consts/operationMode'

const Vencimientos = ({ toggle, open, formValues, handleInputProxy, params }) => {
    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon {...{open}} />
                        <h3 className={open ? 'active' : ''}>Vencimientos</h3>
                    </div>
                </div>
            </div>
        </div>

        {open && (
            <div className='accordion-body'>
                <div className='row form-basic'>
                    <div className="col-12 col-md-4">
                        <label htmlFor="idTipoVencimientoAnticipo" className="form-label">Vencimiento anticipo</label>
                        <InputEntidad
                            name="idTipoVencimientoAnticipo"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTipoVencimientoAnticipo}
                            onChange={handleInputProxy}
                            entidad="TipoVencimientoPlanPago"
                            title="Tipo de Vencimiento para el anticipo"
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            columns={[
                                { Header: 'Descripción', accessor: 'descripcion', width: '95%' }
                            ]}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label htmlFor="idTipoVencimientoCuota1" className="form-label">Vencimiento primera cuota</label>
                        <InputEntidad
                            name="idTipoVencimientoCuota1"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTipoVencimientoCuota1}
                            onChange={handleInputProxy}
                            entidad="TipoVencimientoPlanPago"
                            title="Tipo de Vencimiento para la cuota 1"
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            columns={[
                                { Header: 'Descripción', accessor: 'descripcion', width: '95%' }
                            ]}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label htmlFor="idTipoVencimientoCuotas" className="form-label">Vencimiento cuotas restantes</label>
                        <InputEntidad
                            name="idTipoVencimientoCuotas"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTipoVencimientoCuotas}
                            onChange={handleInputProxy}
                            entidad="TipoVencimientoPlanPago"
                            title="Tipo de Vencimiento para el resto de las cuotas"
                            disabled={params.mode === OPERATION_MODE.VIEW}
                            columns={[
                                { Header: 'Descripción', accessor: 'descripcion', width: '95%' }
                            ]}
                        />
                    </div>
                </div>
            </div>
        )}
    </>
}

export default Vencimientos
