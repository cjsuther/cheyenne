import { bool, node, string } from 'prop-types'
import { useEffect, useRef, useState } from "react"

const Modal = ({ show, size, title, header, body, footer, allowFullscreen }) => {

    const [maximized, setMaximized] = useState(false)
    const [finalSize, setFinalSize] = useState(size)
    const modalRef = useRef(null)

    useEffect(() => {
		setFinalSize('modal-' + (maximized ? 'fullscreen' : size))
	}, [maximized,size])

    useEffect(() => {
        if (show && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }, [show]);

    return !show ? <></> : (
        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" ref={modalRef}>
            <div className={`modal-dialog ${finalSize}`}>
                <div className="modal-content animated fadeIn">
                    <div className="modal-header">
                        {!!title && <h2 className="modal-title">{title}</h2>}
                        {header}
                        {allowFullscreen && (
                            <div onClick={() => setMaximized(!maximized)} className="link float-end m-left-5">
                                {(maximized) ? (
                                    <span className="material-symbols-outlined" title="Minimizar editor de fórmula">zoom_in_map</span>
                                ) : (
                                    <span className="material-symbols-outlined" title="Maximizar editor de fórmula">zoom_out_map</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="modal-body">
                        {body}
                    </div>
                    <div className="modal-footer">
                        {footer}
                    </div>
                </div>
            </div>
        </div>
    )
}

Modal.propTypes = {
    show: bool,
    size: string,
    allowFullscreen: bool,
    title: string,
    header: node,
    body: node,
    footer: node,
}

Modal.defaultProps = {
    show: true,
    size: 'lg',
    allowFullscreen: false,
    title: "",
    header: null,
    body: null,
    footer: null
}

export default Modal
