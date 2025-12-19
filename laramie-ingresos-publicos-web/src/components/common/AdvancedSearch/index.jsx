import React, { useState, useEffect } from 'react';
import { array, func, bool, string } from 'prop-types';
import {Collapse} from 'react-bootstrap';

import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';
import './index.scss';

function AdvancedSearch(props) {

    //hooks
    const [state, setState] = useState({
        showFilters: props.initShowFilters,
        labels: []
    });

    useEffect(() => {
        setState(prevState => {
            return {...prevState, labels: props.labels};
        });
    }, [props.labels, props.initShowFilters]);

    const handleClickBuscar = () => {
        if (props.requireFilter && !props.hasActiveFilters) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe introducir al menos un filtro');
            return
        }
        let valid = true;
        if (props.onValidation) {
            valid = props.onValidation();
        }
        if (valid) {
            ToggleFilters();
            props.onSearch();
        }
    }

    function ToggleFilters() {
        setState(prevState => {
            return {...prevState, showFilters: !prevState.showFilters};
        });
    }
   
    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i>


    return (
    <>

            <div className='busqueda-avanzada'>
                <div className="col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleFilters()}>
                                <div className='accordion-header-title'>
                                    {(state.showFilters) ? accordionOpen : accordionClose}
                                    <span className={state.showFilters ? 'active' : ''}>Búsqueda Avanzada</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Collapse  in={state.showFilters}>
                    <div className='accordion-body '>
                        <div className='row'>
                            <div className="col-12 m-top-10">
                                {props.children}
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-12 m-top-10">
                                <button className="btn btn-busqueda float-end" onClick={ (event) => handleClickBuscar() }>{props.textButton}</button>
                            </div>
                        </div>
                    </div>
                    </Collapse >
                    <div className='marcador-body'>
                        <div className='row'>
                            {state.labels.map((label, index) =>
                                <div className="marcador" key={index}>
                                    <span>{label.title}: <strong>{label.value}</strong></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        
    </>
    )
}

AdvancedSearch.propTypes = {
    initShowFilters: bool,
    requireFilter: bool,
    hasActiveFilters: bool,
    onValidation: func,
    onSearch: func.isRequired,
    labels: array.isRequired,
    textButton: string,
};

AdvancedSearch.defaultProps = {
    requireFilter: false,
    hasActiveFilters: false,
    onValidation: null,
    initShowFilters: true,
    textButton: "Buscar"
}


export default AdvancedSearch;
