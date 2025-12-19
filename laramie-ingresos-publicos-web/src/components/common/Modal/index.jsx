const Modal = ({ show, title, header, body, footer }) => {


    return !show ? <></> : (
        <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
            <div className="modal-dialog modal-lg">
                <div className="modal-content animated fadeIn">
                    <div className="modal-header">
                        {!!title && <h2 className="modal-title">{title}</h2>}
                        {header}
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

export default Modal
