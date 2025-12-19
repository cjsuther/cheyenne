import DataTaggerFormRedux from "../../../components/controls/DataTaggerFormRedux"  
import { AccordionIcon } from "../../../components/common"
import { OPERATION_MODE } from "../../../consts/operationMode"

const InfoAdicional = ({open, toggle, title, entity, idEntity, mode, processKey, setPendingChange}) => {
    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={toggle}>
                    <div className='accordion-header-title'>
                        <AccordionIcon {...{open}} />
                        <h3 className={open ? 'active' : ''}>Información adicional</h3>
                    </div>
                </div>
            </div>
        </div>
        {open &&
            <div className='accordion-body'>
                <DataTaggerFormRedux
                    title={title}
                    processKey={processKey}
                    entidad={entity}
                    idEntidad={idEntity}
                    disabled={(mode === OPERATION_MODE.VIEW)}
                    onChange={(row) => setPendingChange(true)}
                />
            </div>
        }
    </>
}

export default InfoAdicional