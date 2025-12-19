import { string, func } from "prop-types"
import { InputJson, Modal } from "../../common"
import { useMemo } from "react"
import { parseJwt } from "../../../utils/convert"

const TokenModal = (props) => {
    const data = useMemo(() => parseJwt(props.token), [props.token])

    return (
        <Modal
            title="Datos del Token"
            body={(
                <div className='row form-basic'>
                    <InputJson data={data} />
                </div>
            )}
            footer={(
            <div className='footer-action-container'>
                <button className="btn back-button float-start" data-dismiss="modal" onClick={props.onDismiss}>Volver</button>
              </div>
            )}
        />
    )
}

TokenModal.propTypes = {
  token: string.isRequired,
  onDismiss: func.isRequired,
}

export default TokenModal
