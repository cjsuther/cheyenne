import { useState } from 'react'
import { string } from 'prop-types'

import './index.scss'
import TokenModal from '../../controls/TokenModal'

const InputToken = (props) => {
    const [copied, setCopied] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const onClickCopy = () => {
        navigator.clipboard.writeText(props.value)
        setCopied(true)
        setTimeout(() => setCopied(false), [2500])
    }

    const onClickSearch = () => {
        setShowModal(true)
    }

    return <>
        <div className="input-token-container">
            <input
                className="form-control"
                readOnly
                aria-hidden
                tabIndex={-1}
                disabled
            />
            <div className="input-token-sub-container">
                <input
                    type="text"
                    name={props.name}
                    className="form-control input-token-input"
                    value={props.value}
                    disabled
                />
                <div className="input-token-icon-container">
                    {!copied && <span className="material-symbols-outlined" onClick={onClickCopy} title="Copiar contenido">content_copy</span>}
                    {copied && <span className="material-symbols-outlined" title="Contenido copiado">check</span>}
                    <span className="material-symbols-outlined" onClick={onClickSearch} title="Ver detalles">search</span>
                </div>
            </div>
        </div>

        {showModal && (
            <TokenModal
                token={props.value}
                onDismiss={() => setShowModal(false)}
            />
        )}
    </>
}

InputToken.propTypes = {
    name: string.isRequired,
    value: string,
}

export default InputToken
