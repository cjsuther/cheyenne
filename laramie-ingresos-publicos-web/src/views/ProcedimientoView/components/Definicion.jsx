import { useMemo } from "react"
import { AccordionIcon, DatePickerCustom, InputLista } from "../../../components/common"
import { OPERATION_MODE } from "../../../consts/operationMode"

const Definicion = ({ formValues, handleInputProxy, otherValues, params, open, toggle, descUsuarioCreacion }) => {
    const procedimientoVariablesCount = useMemo(() =>(
        otherValues.procedimientoVariables.filter(x => x.state !== 'r').length
    ), [otherValues.procedimientoVariables])

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

                    <div className="col-12 col-md-6">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            name="nombre"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.nombre}
                            onChange={handleInputProxy}
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6">
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
                        <label htmlFor="idTipoTributo" className="form-label">Tipo de tributo</label>
                        <InputLista
                            name="idTipoTributo"
                            placeholder=""
                            className="form-control"
                            value={formValues.idTipoTributo}
                            onChange={handleInputProxy}
                            lista="TipoTributo"
                            disabled={params.mode === OPERATION_MODE.VIEW || procedimientoVariablesCount > 0}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="idEstadoProcedimiento" className="form-label">Estado</label>
                        <InputLista
                            name="idEstadoProcedimiento"
                            placeholder=""
                            className="form-control"
                            value={formValues.idEstadoProcedimiento}
                            onChange={handleInputProxy}
                            lista="EstadoProcedimiento"
                            disabled={params.mode === OPERATION_MODE.VIEW}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="fechaCreacion" className="form-label">Fecha de creación</label>
                        <DatePickerCustom
                            name="fechaCreacion"
                            placeholder=""
                            className="form-control"
                            value={formValues.fechaCreacion}
                            disabled
                        />
                    </div>
                    <div className="col-12 col-md-6">
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
                </div>
            </div>
        )}
    </>
}

export default Definicion
