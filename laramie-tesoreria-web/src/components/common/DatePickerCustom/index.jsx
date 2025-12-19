import React, { useState, useEffect, useRef } from 'react';
import { bool, string, object, func } from 'prop-types';
import { isNull, isValidDate } from '../../../utils/validator';
import moment from 'moment';
import 'moment/locale/es';

import './index.scss';
import { InputFormat } from '../';
import { GetArrayNumbers } from '../../../utils/helpers';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DatePickerCustom = (props) => {
    const dateTimeFormat = 'DD/MM/YYYY HH:mm';
    const dateTextFormat = (props.time) ? dateTimeFormat : 'DD/MM/YYYY';
    const dateFormat = 'YYYY-MM-DD';

    const [valueDate, setValueDate] = useState(new Date());
    const [activeStartDate, setActiveStartDate] = useState(undefined);
    const [valueTextTime, setValueTextTime] = useState("");

    const [valueHour, setValueHour] = useState("00");
    const [valueMinute, setValueMinute] = useState("00");

    const [toggle, setToggle] = useState(false);

    const [ready, setReady] = useState(false);

    const firstRenderRef = useRef(true);

    useEffect(() => {
        if (!ready) return;
        if (!valueDate) return;

        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }

        let toClear = false;
        if (props.minValue && valueDate.getTime() < props.minValue.getTime()) {
            toClear = true;
        }
        if (props.maxValue && valueDate.getTime() > props.maxValue.getTime()) {
            toClear = true;
        }

        if (toClear) {
            setValueDate(null);
            setValueTextTime("");
            if (props.onChange) {
                props.onChange({
                    target: { name: props.name, type: "date", value: null }
                });
            }
        }
    }, [props.minValue, props.maxValue, valueDate, ready]);


    useEffect(() => {

        const date = (props.value) ? props.value : new Date();
        setValueDate(date);

        const text = (props.value) ? moment(props.value).format(dateTextFormat) : "";
        setValueTextTime(text);

        if (props.time) {
            const hour = (props.value) ? moment(props.value).format('HH') : "";
            setValueHour(hour);

            const minutes = (props.value) ? moment(props.value).format('mm') : "";
            setValueMinute(minutes);
        }

        setReady(true);
    }, [props.value]);

    const wrapperRef = useRef(null)
    const calendarIconRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target) &&
                calendarIconRef.current &&
                !calendarIconRef.current.contains(event.target)
            ) {
                setToggle(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [wrapperRef, calendarIconRef])

    const returnDate = (date) => {
        if (props.time){
            const dateFormat = moment(date).format("DD/MM/YYYY");
            const textTime = `${dateFormat} ${valueHour}:${valueMinute}`;
            const dateFinal = moment(textTime, dateTimeFormat).toDate();
            return dateFinal;
        }

        return date;
    }

    const getCalendarValue = (date) => {
        const isValid = isValidDate(moment(date).format(dateFormat));

        if (isValid &&
            (isNull(props.minValue) || date.getTime() >= props.minValue.getTime()) &&
            (isNull(props.maxValue) || date.getTime() <= props.maxValue.getTime())) {
            return returnDate(date);
        }
        else {
            return null;
        }
    }

    return (

    <div className={`datepicker-custom-container`}>
        <div className='wrapper'>
            <InputFormat 
                name={props.name}
                value={valueTextTime}
                onChange={(event) => {
                    setValueTextTime(event.target.value);
                }} 
                onBlur={(event) => {
                    const value = moment(event.target.value, dateTextFormat);
                    const isValid = isValidDate(value.format('YYYY-MM-DD')) && value.isValid();
                    const valueDate = (isValid) ? value.toDate() : null;
                    let resultDate = null;
                    if (isValid &&
                        (isNull(props.minValue) || valueDate.getTime() >= props.minValue.getTime()) &&
                        (isNull(props.maxValue) || valueDate.getTime() <= props.maxValue.getTime())){
                        resultDate = valueDate;
                    } else {
                        const text = (props.value) ? moment(props.value).format(dateTextFormat) : "";
                        setValueTextTime(text); // hay que forzarlo porque sino el props es el mismo y no se actualiza el textbox
                        resultDate = props.value;
                    }

                    if (resultDate != null){
                        const beginOfMonth = new Date(resultDate.getFullYear(), resultDate.getMonth(), 1);
                        setActiveStartDate(beginOfMonth);
    
                        const resultDateMoment = moment(resultDate);
                        setValueHour(resultDateMoment.hour());
                        setValueMinute(resultDateMoment.minute());
                        setToggle(false);
    
                        if (props.onChange) {
                            props.onChange({
                                target: {
                                    name: props.name,
                                    type: 'date',
                                    value: resultDate
                                }
                            });
                        }
                    }

                }}
                onFocus={()=>setToggle(true)}
                mask= {(props.time) ? "99/99/9999 99:99" : "99/99/9999"} 
                disabled={props.disabled}
                placeholder={props.placeholder}
                className={props.className}
            />
            {!props.disabled &&
            <>
                <span
                    className="material-symbols-outlined icon-calendar"
                    ref={calendarIconRef}
                    onClick={() => setToggle(!toggle)}
                >calendar_month</span>
                <span 
                    className="material-symbols-outlined icon-cruz"
                    onClick={() => {
                        if (props.onChange) {
                            props.onChange({
                                target: {
                                    name: props.name,
                                    type: 'date',
                                    value: null
                                }
                            });
                        }

                        setToggle(false);
                    }}
                    disabled={props.disabled}
                >close</span>
            </>
            }
        </div>
        
        <div className='wrapper-date' ref={wrapperRef}>
        { toggle &&
            <div className='wrapper-calendar p-top-5'>
                <Calendar
                    value={valueDate}
                    className={props.className}
                    calendarType={"gregory"}
                    formatMonth={(locale, date) => moment(date).format('MMM').toUpperCase()}
                    formatMonthYear={(locale, date) => moment(date).format('MMM YYYY').toUpperCase()}
                    minDate={props.minValue}
                    maxDate={props.maxValue}
                    onChange={date => {
                        setValueDate(date);
                        if (props.onChange) {
                            props.onChange({
                                target: {
                                    name: props.name,
                                    type: 'date',
                                    value: getCalendarValue(date)
                                }
                            });
                        }
                        if (!props.time) {
                            setToggle(!toggle);
                        }
                    }}
                    activeStartDate={activeStartDate}
                    onActiveStartDateChange={(event) => {
                        setActiveStartDate(event.activeStartDate);
                    }}
                />
            </div>
        }

        {props.time && toggle &&
            <div className='wrapper-time p-top-5 '>
                <span className='m-left-5 m-right-5'>Hora:</span>
                <select
                    name="hour"
                    placeholder=""
                    className="form-control"
                    value={valueHour}
                    onChange={ (event) => {
                        const value = valueTextTime.split(" ")[0]
                        const textTime = `${value} ${event.target.value}:${valueMinute}`;

                        const dateMoment = moment(textTime, dateTimeFormat);
                        const dateFinal = dateMoment.toDate();

                        setValueHour(event.target.value);
                        if (props.onChange) {
                            props.onChange({
                                target: {
                                    name: props.name,
                                    type: 'date',
                                    value: isValidDate(moment(dateFinal).format(dateFormat)) ? dateFinal : null
                                }
                            });
                        }
                        
                    }}
                    disabled={ props.disabled }
                >
                {GetArrayNumbers(24, 2).map((item) =>
                    <option value={item.value} key={item.key}>{item.name}</option>
                )}
                </select>
                
                <span className='m-left-5 m-right-5'>:</span>
                
                <select
                    name="minutes"
                    placeholder=""
                    className="form-control"
                    value={valueMinute}
                    onChange={ (event) => {
                        const value = valueTextTime.split(" ")[0]
                        const textTime = `${value} ${valueHour}:${event.target.value}`;
                        
                        const dateMoment = moment(textTime, dateTimeFormat);
                        const dateFinal = dateMoment.toDate();
                        
                        setValueMinute(event.target.value);
                        if (props.onChange) {
                            props.onChange({
                                target: {
                                    name: props.name,
                                    type: 'date',
                                    value: isValidDate(moment(dateFinal).format(dateFormat)) ? dateFinal : null
                                }
                            });
                        }
                    }}
                    disabled={ props.disabled }
                >
                {GetArrayNumbers(60, 2).map((item) =>
                    <option value={item.value} key={item.key}>{item.name}</option>
                )}
                </select>
                <span className='m-left-5 m-right-5'>min.</span>

            </div>
        }
        </div>

    </div>
    
    )
}

DatePickerCustom.propTypes = {
    name: string.isRequired,
    placeholder: string,
    className: string,
    value: object,
    onChange: func,
    time: bool,
    disabled: bool,
    minValue: object,
    maxValue: object
};

DatePickerCustom.defaultProps = {
    placeholder: "",
    className: "",
    value: null,
    onChange: null,
    time: false,
    disabled: false
};

export default DatePickerCustom;
