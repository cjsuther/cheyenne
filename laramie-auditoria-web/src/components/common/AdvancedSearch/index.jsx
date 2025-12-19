import React, { useState, useEffect } from 'react';
import { array, func, bool, string } from 'prop-types';
import {Collapse} from 'react-bootstrap';
import { CloneObject } from '../../../utils/helpers';
import { useLocation } from 'react-router-dom';

import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';
import './index.scss';

function AdvancedSearch(props) {

    const location = useLocation();
    useEffect(() => { //init showFilters when change route
        setState(prevState => {
            return {...prevState,
                showFilters: props.initShowFilters
            };
        });
    }, [location]);

    //hooks
    const [state, setState] = useState({
        showFilters: props.initShowFilters,
        labels: []
    });

    const [onSearch, setOnSearch] = useState(false)

    useEffect(() => {
        setState(prevState => {
            return {...prevState, labels: props.labels};
        });
    }, [props.labels, props.initShowFilters]);

    useEffect(() => {
        if (onSearch){
            search();
            setOnSearch(false)
            setState(prevState => {
                return {...prevState, showFilters: true};
            });
        }
    }, [props.formValues]);
  

    const handleClick = (label) => {

        setOnSearch(true)

        let newFormValues = CloneObject(props.formValues)

        if (label.fieldOriginal){
            newFormValues[label.fieldOriginal] = label.valueIgnoreOriginal // label.valueIgnore
            newFormValues[label.field] = label.valueIgnore
            props.formSet(newFormValues)
        }
        else{
            newFormValues[label.field] = label.valueIgnore
            props.formSet(newFormValues)
        }
    }

    const handleClickBuscar = () => {
        if (isFormValid()){
            search()
        }       
    }

    const isFormValid = () => {
        if (props.requireFilter && !props.hasActiveFilters) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe introducir al menos un filtro');
            return false
        }        

        return true
    }

    const search = () => {
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
   
    const accordionClose = <span className="material-symbols-outlined search-i">chevron_right</span>
    const accordionOpen = <span className="material-symbols-outlined search-i">expand_more</span>

    return (
    <>

            <div className='busqueda-avanzada'>
                <div className="col-12">
                    <div className='accordion-header'>
                        <div className='row'>
                            <div className="col-12" onClick={() => ToggleFilters()}>
                                <div className='accordion-header-title'>
                                    {(state.showFilters) ? accordionOpen : accordionClose}
                                    <span className={state.showFilters ? 'active' : ''}>Búsqueda</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Collapse  in={state.showFilters}>
                    <div className='accordion-body '>
                        <div className='row'>
                            <div className="col-12">
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
                                    <span>{label.title}:&nbsp;
                                        <strong>{label.value?.toString()}
                                        {(props.formValues && props.formSet) &&
                                        <a href='#' className="link-no-color">
                                            <span onClick={ () => handleClick(label) } className="material-symbols-outlined span-close">close</span>
                                        </a>
                                        }
                                        </strong>
                                    </span>
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
