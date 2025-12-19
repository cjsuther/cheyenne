import React, { useState, useEffect } from 'react';
import { object, bool } from 'prop-types';
import { REQUEST_METHOD } from '../../../consts/requestMethodType';
import {APIS} from '../../../config/apis';
import { ServerRequest } from '../../../utils/apiweb';
import { useForm } from '../../hooks/useForm';
import { CloneObject } from '../../../utils/helpers';
import { Loading, DatePickerCustom } from '../../common';
import InputNumber from '../../common/InputNumber';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';


const CatastroForm = (props) => {

    const entityInit = {
        id: 0,
        partida: "",
        digitoVerificador: "",
        partido: "",
        circunscripcion: "",
        seccion: "",
        chacra: "",
        letraChacra: "",
        quinta: "",
        letraQuinta: "",
        fraccion: "",
        letraFraccion: "",
        manzana: "",
        letraManzana: "",
        parcela: "",
        letraParcela: "",
        subparcela: "",
        destinatario: "",
        calle: "",
        altura: "",
        piso: "",
        departamento: "",
        barrio: "",
        entreCalle1: "",
        entreCalle2: "",
        localidad: 0,
        codigoPostal: "",
        vigencia: null,
        codigoPostalArgentina: "",
        superficie: 0,
        caracteristica: 0,
        valorTierra: 0,
        superficieEdificada: 0,
        valorEdificado: 0,
        valor1998: 0,
        valorMejoras: 0,
        edif1997: 0,
        valorFiscal: 0,
        mejoras1997: 0,
        origen: "",
        motivoMovimiento: "",
        titular: "",
        codigoTitular: "",
        dominioOrigen: "",
        dominioInscripcion: "",
        dominioTipo: "",
        dominioAnio: "",
        unidadesFuncionales: "",
        serie: ""
    };

    //hooks
    const [state, setState] = useState({
        entity: entityInit,
        accordions: {
            dominio: false,
            edilicia: false,
            domicilio: false
        },
        loading: false,
        showMessage: false,
        showForm: false
    });

    const mount = () => {
        if (props.data.partida.length > 0) {
            FindCatastroPorPartida();
        }
        else if (props.data.circunscripcion.length > 0) {
            FindCatastroPorNomenclatura();
        }
        else {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Faltan datos para vincular un catástro');
        }
    }
    useEffect(mount, [props.data.partida, props.data.circunscripcion]);

    const [ formValues, formHandle, , formSet ] = useForm({
        partida: "",
        digitoVerificador: "",
        partido: "",
        circunscripcion: "",
        seccion: "",
        chacra: "",
        letraChacra: "",
        quinta: "",
        letraQuinta: "",
        fraccion: "",
        letraFraccion: "",
        manzana: "",
        letraManzana: "",
        parcela: "",
        letraParcela: "",
        subparcela: "",
        destinatario: "",
        calle: "",
        altura: "",
        piso: "",
        departamento: "",
        barrio: "",
        entreCalle1: "",
        entreCalle2: "",
        localidad: 0,
        codigoPostal: "",
        vigencia: null,
        codigoPostalArgentina: "",
        superficie: 0,
        caracteristica: 0,
        valorTierra: 0,
        superficieEdificada: 0,
        valorEdificado: 0,
        valor1998: 0,
        valorMejoras: 0,
        edif1997: 0,
        valorFiscal: 0,
        mejoras1997: 0,
        origen: "",
        motivoMovimiento: "",
        titular: "",
        codigoTitular: "",
        dominioOrigen: "",
        dominioInscripcion: "",
        dominioTipo: "",
        dominioAnio: "",
        unidadesFuncionales: "",
        serie: ""
    });


    // Callbacks
    const callbackNoSuccess = (response) => {
        response.json()
        .then((error) => {
            const message = error.message;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    }
    const callbackError = (error) => {
        const message = 'Error procesando solicitud: ' + error.message;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState(prevState => {
            return {...prevState, loading: false};
        });
    }
    const callbackSuccessFindCatastro = (response) => {
        response.json()
        .then((data) => {

            if (data.id > 0) {
                if (data.vigencia) data.vigencia = new Date(data.vigencia);
                setState(prevState => {
                    return {...prevState, loading: false, showForm: true};
                });
                formSet({
                    ...formValues,
                    partida: data.partida,
                    digitoVerificador: data.digitoVerificador,
                    partido: data.partido,
                    circunscripcion: data.circunscripcion,
                    seccion: data.seccion,
                    chacra: data.chacra,
                    letraChacra: data.letraChacra,
                    quinta: data.quinta,
                    letraQuinta: data.letraQuinta,
                    fraccion: data.fraccion,
                    letraFraccion: data.letraFraccion,
                    manzana: data.manzana,
                    letraManzana: data.letraManzana,
                    parcela: data.parcela,
                    letraParcela: data.letraParcela,
                    subparcela: data.subparcela,
                    destinatario: data.destinatario,
                    calle: data.calle,
                    altura: data.altura,
                    piso: data.piso,
                    departamento: data.departamento,
                    barrio: data.barrio,
                    entreCalle1: data.entreCalle1,
                    entreCalle2: data.entreCalle2,
                    localidad: data.localidad,
                    codigoPostal: data.codigoPostal,
                    vigencia: data.vigencia,
                    codigoPostalArgentina: data.codigoPostalArgentina,
                    superficie: data.superficie,
                    caracteristica: data.caracteristica,
                    valorTierra: data.valorTierra,
                    superficieEdificada: data.superficieEdificada,
                    valorEdificado: data.valorEdificado,
                    valor1998: data.valor1998,
                    valorMejoras: data.valorMejoras,
                    edif1997: data.edif1997,
                    valorFiscal: data.valorFiscal,
                    mejoras1997: data.mejoras1997,
                    origen: data.origen,
                    motivoMovimiento: data.motivoMovimiento,
                    titular: data.titular,
                    codigoTitular: data.codigoTitular,
                    dominioOrigen: data.dominioOrigen,
                    dominioInscripcion: data.dominioInscripcion,
                    dominioTipo: data.dominioTipo,
                    dominioAnio: data.dominioAnio,
                    unidadesFuncionales: data.unidadesFuncionales,
                    serie: data.serie
                });
            }
            else {
                setState(prevState => {
                    return {...prevState, loading: false, showMessage: true};
                });
            }

        })
        .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
                return {...prevState, loading: false};
            });
        });
    };

    // Funciones
    function FindCatastroPorPartida() {
            
        setState(prevState => {
            return {...prevState, loading: true,};
        });

        const paramsUrl = `/partida/${props.data.partida}`;

        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CATASTRO,
            paramsUrl,
            null,
            callbackSuccessFindCatastro,
            callbackNoSuccess,
            callbackError
        );

    }

    function FindCatastroPorNomenclatura() {
        setState(prevState => {
            return {...prevState, loading: true};
        });
        
        let paramsUrl = '';
        
        paramsUrl = `/nomenclatura/filters?`+
        `circunscripcion=${encodeURIComponent(props.data.circunscripcion)}&`+
        `seccion=${encodeURIComponent(props.data.seccion)}&`+
        `chacra=${encodeURIComponent(props.data.chacra)}&`+
        `letraChacra=${encodeURIComponent(props.data.letraChacra)}&`+
        `quinta=${encodeURIComponent(props.data.quinta)}&`+
        `letraQuinta=${encodeURIComponent(props.data.letraQuinta)}&`+
        `fraccion=${encodeURIComponent(props.data.fraccion)}&`+
        `letraFraccion=${encodeURIComponent(props.data.letraFraccion)}&`+
        `manzana=${encodeURIComponent(props.data.manzana)}&`+
        `letraManzana=${encodeURIComponent(props.data.letraManzana)}&`+
        `parcela=${encodeURIComponent(props.data.parcela)}&`+
        `letraParcela=${encodeURIComponent(props.data.letraParcela)}&`+
        `subparcela=${encodeURIComponent(props.data.subparcela)}`;
    
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.CATASTRO,
            paramsUrl,
            null,
            callbackSuccessFindCatastro,
            callbackNoSuccess,
            callbackError
        );
    }


    function ToggleAccordion(accordion) {
        let accordions = CloneObject(state.accordions);
        accordions[accordion] = !accordions[accordion];
        setState(prevState => {
            return {...prevState, accordions: accordions};
        });
    }
    
    const accordionClose = <i className="fa fa-angle-right"></i>
    const accordionOpen = <i className="fa fa-angle-down"></i>

    return (
    <>
        <Loading visible={state.loading}></Loading>

        {state.showMessage && 
            <div className="body">
                <div className="row">

                    <div className="col-12">
                        <h3 className="form-label">No existe ningún registro asociado a la nomenclatura catastral ingresada.</h3>
                    </div>

                </div>
            </div>
        }

        {state.showForm && 
            <div className="body">
                <div className="row">

                    <div className="mb-3 col-6 col-lg-8">
                        <label htmlFor="partida" className="form-label">Partida</label>
                        <input
                            name="partida"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.partida }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-6 col-lg-4">
                    <label htmlFor="digitoVerificador" className="form-label">Dígito verificador</label>
                        <input
                            name="digitoVerificador"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.digitoVerificador }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                    <div className="col-12">
                        <h3 className="form-label">Nomenclatura catastral</h3>
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="circunscripcion" className="form-label">Circunscripción</label>
                        <input
                            name="circunscripcion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.circunscripcion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="seccion" className="form-label">Sección</label>
                        <input
                            name="seccion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.seccion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="chacra" className="form-label">Chacra</label>
                        <input
                            name="chacra"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.chacra }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="letraChacra" className="form-label">Letra chacra</label>
                        <input
                            name="letraChacra"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.letraChacra }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="quinta" className="form-label">Quinta</label>
                        <input
                            name="quinta"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.quinta }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="letraQuinta" className="form-label">Letra quinta</label>
                        <input
                            name="letraQuinta"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.letraQuinta }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="fraccion" className="form-label">Fracción</label>
                        <input
                            name="fraccion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.fraccion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="letraFraccion" className="form-label">Letra fracción</label>
                        <input
                            name="letraFraccion"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.letraFraccion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="manzana" className="form-label">Manzana</label>
                        <input
                            name="manzana"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.manzana }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="letraManzana" className="form-label">Letra manzana</label>
                        <input
                            name="letraManzana"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.letraManzana }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="parcela" className="form-label">Parcela</label>
                        <input
                            name="parcela"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.parcela }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="letraParcela" className="form-label">Letra parcela</label>
                        <input
                            name="letraParcela"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.letraParcela }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="subparcela" className="form-label">Sub parcela</label>
                        <input
                            name="subparcela"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.subparcela }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="unidadesFuncionales" className="form-label">Unidades funcionales</label>
                        <input
                            name="unidadesFuncionales"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.unidadesFuncionales }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="mb-3 col-4 col-lg-2">
                        <label htmlFor="partido" className="form-label">Partido</label>
                        <input
                            name="partido"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={formValues.partido }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>

                </div>
                <hr className="solid m-bottom-10"></hr>
                <div className="row">
                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('dominio')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.dominio) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.dominio ? 'active' : ''}>Información de dominio</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.dominio &&
                            <div className='accordion-body'>
                                <div className='row form-basic'>
                                    <div className="mb-3 col-6 col-lg-5">
                                        <label htmlFor="destinatario" className="form-label">Destinatario</label>
                                        <input
                                            name="destinatario"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.destinatario }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-5">
                                        <label htmlFor="titular" className="form-label">Titular</label>
                                        <input
                                            name="titular"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.titular}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-2">
                                        <label htmlFor="codigoTitular" className="form-label">Código titular</label>
                                        <input
                                            name="codigoTitular"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.codigoTitular}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-3">
                                        <label htmlFor="vigencia" className="form-label">Vigencia</label>
                                        <DatePickerCustom
                                            name="vigencia"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.vigencia }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-3">
                                        <label htmlFor="origen" className="form-label">Origen</label>
                                        <input
                                            name="origen"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.origen}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-3">
                                        <label htmlFor="motivoMovimiento" className="form-label">Motivo movimiento</label>
                                        <input
                                            name="motivoMovimiento"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.motivoMovimiento}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-3">
                                        <label htmlFor="dominioOrigen" className="form-label">Dominio origen</label>
                                        <input
                                            name="dominioOrigen"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.dominioOrigen}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-3">
                                        <label htmlFor="dominioInscripcion" className="form-label">Dominio inscripción</label>
                                        <input
                                            name="dominioInscripcion"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.dominioInscripcion}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-3">
                                        <label htmlFor="dominioTipo" className="form-label">Dominio tipo</label>
                                        <input
                                            name="dominioTipo"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.dominioTipo}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-3">
                                        <label htmlFor="dominioAnio" className="form-label">Dominio año</label>
                                        <input
                                            name="dominioAnio"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.dominioAnio}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-3">
                                        <label htmlFor="serie" className="form-label">Serie</label>
                                        <input
                                            name="serie"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.serie}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('edilicia')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.edilicia) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.edilicia ? 'active' : ''}>Información edilicia</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.edilicia &&
                            <div className='accordion-body'>
                                <div className='row form-basic'>
                                    <div className="mb-3 col-6 col-lg-12">
                                        <label htmlFor="caracteristica" className="form-label">Característica</label>
                                        <input
                                            name="caracteristica"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.caracteristica }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="superficie" className="form-label">Superficie</label>
                                        <InputNumber
                                            name="superficie"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.superficie }
                                            precision={2}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="superficieEdificada" className="form-label">Superficie edificada</label>
                                        <InputNumber
                                            name="superficieEdificada"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.superficieEdificada }
                                            precision={2}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="valorEdificado" className="form-label">Valor edificado</label>
                                        <InputNumber
                                            name="valorEdificado"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.valorEdificado }
                                            precision={2}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="valorTierra" className="form-label">Valor tierra</label>
                                        <InputNumber
                                            name="valorTierra"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.valorTierra }
                                            precision={2}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="valorFiscal" className="form-label">Valor fiscal</label>
                                        <InputNumber
                                            name="valorFiscal"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.valorFiscal }
                                            precision={2}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="valorMejoras" className="form-label">Valor mejoras</label>
                                        <InputNumber
                                            name="valorMejoras"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.valorMejoras }
                                            precision={2}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="valor1998" className="form-label">Valor 1998</label>
                                        <InputNumber
                                            name="valor1998"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.valor1998 }
                                            precision={2}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="edif1997" className="form-label">Edif. 1997</label>
                                        <InputNumber
                                            name="edif1997"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.edif1997 }
                                            precision={2}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="mejoras1997" className="form-label">Mejoras 1997</label>
                                        <InputNumber
                                            name="mejoras1997"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.mejoras1997 }
                                            precision={2}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-3 col-12">
                        <div className='accordion-header'>
                            <div className='row'>
                                <div className="col-12" onClick={() => ToggleAccordion('domicilio')}>
                                    <div className='accordion-header-title'>
                                        {(state.accordions.domicilio) ? accordionOpen : accordionClose}
                                        <h3 className={state.accordions.domicilio ? 'active' : ''}>Domicilio</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(state.accordions.domicilio &&
                            <div className='accordion-body'>
                                <div className='row form-basic'>
                                    <div className="mb-3 col-6 col-lg-6">
                                        <label htmlFor="calle" className="form-label">Calle</label>
                                        <input
                                            name="calle"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.calle }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-2">
                                        <label htmlFor="altura" className="form-label">Altura</label>
                                        <input
                                            name="altura"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.altura }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-2">
                                        <label htmlFor="piso" className="form-label">Piso</label>
                                        <input
                                            name="piso"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.piso}
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-2">
                                        <label htmlFor="departamento" className="form-label">Departamento</label>
                                        <input
                                            name="departamento"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.departamento }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-2">
                                        <label htmlFor="codigoPostal" className="form-label">Código postal</label>
                                        <input
                                            name="codigoPostal"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.codigoPostal }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-4">
                                        <label htmlFor="codigoPostalArgentina" className="form-label">Código postal Argentina (CPA)</label>
                                        <input
                                            name="codigoPostalArgentina"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.codigoPostalArgentina }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-6">
                                        <label htmlFor="barrio" className="form-label">Barrio</label>
                                        <input
                                            name="barrio"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.barrio }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-6">
                                        <label htmlFor="entreCalle1" className="form-label">Entre Calle (1)</label>
                                        <input
                                            name="entreCalle1"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.entreCalle1 }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-6">
                                        <label htmlFor="entreCalle2" className="form-label">Entre Calle (2)</label>
                                        <input
                                            name="entreCalle2"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.entreCalle2 }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                    <div className="mb-3 col-6 col-lg-6">
                                        <label htmlFor="localidad" className="form-label">Localidad</label>
                                        <input
                                            name="localidad"
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            value={formValues.localidad }
                                            onChange={ formHandle }
                                            disabled={props.disabled}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        }
    </>
    );
}

CatastroForm.propTypes = {
  disabled: bool,
  data: object.isRequired,
};

CatastroForm.defaultProps = {
  disabled: false
};

export default CatastroForm;
