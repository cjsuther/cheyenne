import { APPCONFIG } from "../../../../app.config"
import { getAccess } from "../../../../utils/access"
import { Modal } from "../../../common"

const PersonasTipoModal = ({ close, onAccept }) => {
    const accept = (tipo) => {
        const { token } = getAccess()
        window.open(`${APPCONFIG.SITE.WEBAPP_ADMINISTRACION}persona-${tipo}/nh/new?token=${token}`, '_blank')
        close()
        onAccept()
    }

    const onClickJuridica = () => { accept('juridica') }

    const onClickFisica = () => { accept('fisica') }

    return (
        <Modal
            show
            title='Tipo de persona'
            body={<p>Seleccione el tipo de persona para crear</p>}
            footer={
                <div className='footer-action-container'>
                    <button className="btn btn-primary float-end m-left-10" data-dismiss="modal" onClick={onClickJuridica}>
                        Jurídica
                    </button>
                    <button className="btn btn-primary float-end" data-dismiss="modal" onClick={onClickFisica}>
                        Física
                    </button>
                    <button className="btn btn-outline-primary float-end m-right-10" data-dismiss="modal" onClick={close}>
                        Cancelar
                    </button>
                </div>
            }
        />
    )
}

export default PersonasTipoModal
