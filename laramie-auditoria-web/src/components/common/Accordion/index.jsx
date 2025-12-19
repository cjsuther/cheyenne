import { string, bool } from 'prop-types';
import { useState } from 'react';

import AccordionIcon from "../AccordionIcon"

const Accordion = ({ title, startOpen, children }) => {
    const [open, setOpen] = useState(startOpen)

    return <>
        <div className='accordion-header m-top-20'>
            <div className='row'>
                <div className="col-12" onClick={() => setOpen(x => !x)}>
                    <div className='accordion-header-title'>
                        <AccordionIcon open={open} />
                        <h3 className={open ? 'active' : ''}>{title}</h3>
                    </div>
                </div>
            </div>
        </div>
        {(open &&
            <div className='accordion-body'>
                {children}
            </div>
        )}
    </>
}

Accordion.propTypes = {
    title: string,
    startOpen: bool,
}

Accordion.defaultProps = {
    title: '',
    startOpen: false,
}

export default Accordion
