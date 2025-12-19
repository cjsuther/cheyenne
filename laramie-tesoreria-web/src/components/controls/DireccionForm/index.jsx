import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { func, object, bool, string } from 'prop-types';

import { useGeoOSM } from '../../hooks/useGeoOSM';
import { useGeoGSV } from '../../hooks/useGeoGSV';
import { useGeoLocal } from '../../hooks/useGeoLocal';
import { useForm } from '../../hooks/useForm';
import { useLista } from '../../hooks/useLista';
import { useEntidad } from '../../hooks/useEntidad';
import { CloneObject } from '../../../utils/helpers';
import { InputLista, InputEntidad, MessageModal, GeoLoadingModal } from '../../common';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';
import { APPCONFIG } from '../../../app.config';
import Maps from '../../common/Maps';
import { PATTERNS } from '../../../utils/patterns';

import './index.scss';

//export method
export let GetDataDireccion = new Map();
export let IsValidDireccion = new Map();

const DireccionForm = forwardRef((props, ref) => {

  if (props.id) {
    GetDataDireccion.set(props.id, () => getFormData());
    IsValidDireccion.set(props.id, () => isFormValid(false));
  }

  const locationInit = {
    lat: parseFloat(APPCONFIG.MAPS.LAT),
    lng: parseFloat(APPCONFIG.MAPS.LNG)
  }

  const entityInit = {
    id: 0,
    entidad: "",
    idEntidad: 0,
    idTipoGeoreferencia: 0,
    idPais: 0,
    idProvincia: 0,
    idLocalidad: 0,
    idZonaGeoreferencia: 0,
    codigoPostal: "",
    calle: "",
    entreCalle1: "",
    entreCalle2: "",
    altura: "",
    piso: "",
    dpto: "",
    referencia: "",
    longitud: 0,
    latitud: 0
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    showGeoLoading: false,
    showMessage: false,
    textMessage: "",
    modeFormEdit: false
  });

  const [location, setLocation] = useState(locationInit);

  const [valueTipoGeoreferencia, setTipoGeoreferencia] = useState({listTipoGeoreferencia: [], indexTipoGeoreferencia: 0});

  const [valuePais, setPais] = useState({nombrePais: ''});
  const [valueProvincia, setProvincia] = useState({nombreProvincia: ''});
  const [valueLocalidad, setLocalidad] = useState({nombreLocalidad: ''});

  const [copy, setCopy] = useState({form: null, location: null});


  const mount = () => {
    setState(prevState => {
      return {...prevState, entity: props.data.entity, modeFormEdit: !props.disabled && props.initFormEdit};
    });
    formSet({
      idTipoGeoreferencia: props.data.entity.idTipoGeoreferencia,
      idPais: props.data.entity.idPais,
      idProvincia: props.data.entity.idProvincia,
      idLocalidad: props.data.entity.idLocalidad,
      idZonaGeoreferencia: props.data.entity.idZonaGeoreferencia ?? 0,
      codigoPostal: props.data.entity.codigoPostal,
      calle: props.data.entity.calle,
      entreCalle1: props.data.entity.entreCalle1,
      entreCalle2: props.data.entity.entreCalle2,
      altura: props.data.entity.altura,
      piso: props.data.entity.piso,
      dpto: props.data.entity.dpto,
      referencia: props.data.entity.referencia
    });
    setLocation({
      lat: props.data.entity.latitud,
      lng: props.data.entity.longitud
    });
  }
  useEffect(mount, [props.data.entity, props.data.entity.idTipoGeoreferencia]);

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoGeoreferencia: 0,
    idPais: 0,
    idProvincia: 0,
    idLocalidad: 0,
    idZonaGeoreferencia: 0,
    codigoPostal: "",
    calle: "",
    entreCalle1: "",
    entreCalle2: "",
    altura: "",
    piso: "",
    dpto: "",
    referencia: ""
  });

  useImperativeHandle(ref, () => ({
    getDataDireccion: getFormData,
    isValidDireccion: isFormValid,
  }))

  //Open Street Map
  const [ locationOSM, setAddressOSM ] = useGeoOSM();
  useEffect(() => {
    if (locationOSM.status === 3) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, locationOSM.message);
      setState(prevState => {return {...prevState, showMessage: true, textMessage: createMessage()};});
    }
    else if (locationOSM.status === 2) {
      setState(prevState => {return {...prevState, showMessage: true, textMessage: createMessage()};});
    }
    else if (locationOSM.status === 1) {
      if ((locationOSM.lat !== 0 && location.lat !== locationOSM.lat) || (locationOSM.lng !== 0 && location.lng !== locationOSM.lng)) {
        setLocation({lat: locationOSM.lat, lng: locationOSM.lng});
      }
      if (locationOSM.street)
        formSet({...formValues, calle: locationOSM.street})
      confirmEdit();
    }
  }, [locationOSM]);

  //GSV Street View
  const [ locationGSV, setAddressGSV ] = useGeoGSV();
  useEffect(() => {
    if (locationGSV.status === 3) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, locationGSV.message);
      setState(prevState => {return {...prevState, showMessage: true, textMessage: createMessage()};});
    }
    else if (locationGSV.status === 2) {
      setState(prevState => {return {...prevState, showMessage: true, textMessage: createMessage()};});
    }
    else if (locationGSV.status === 1) {
      if (locationGSV.lat !== 0 && location.lat !== locationGSV.lat || locationGSV.lng !== 0 && location.lng !== locationGSV.lng) {
        setLocation({lat: locationGSV.lat, lng: locationGSV.lng});
      }
      confirmEdit();
    }
  }, [locationGSV]);

  //API Local
  const [ locationLocal, setAddressLocal ] = useGeoLocal();
  useEffect(() => {
    if (locationLocal.status === 3) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, locationLocal.message);
      setState(prevState => {return {...prevState, showMessage: true, textMessage: createMessage()};});
    }
    else if (locationLocal.status === 2) {
      setState(prevState => {return {...prevState, showMessage: true, textMessage: createMessage()};});
    }
    else if (locationLocal.status === 1) {
      if (locationLocal.lat !== 0 && location.lat !== locationLocal.lat || locationLocal.lng !== 0 && location.lng !== locationLocal.lng) {
        setLocation({lat: locationLocal.lat, lng: locationLocal.lng});
      }
      confirmEdit();
    }
  }, [locationLocal]);

  //Carga por Zona
  const [ getListZonaGeoreferencia, getRowZonaGeoreferencia ] = useEntidad({
    entidades: ['ZonaGeoreferencia'],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        setState(prevState => ({...prevState}));
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'ZonaGeoreferencia',
      timeout: 0
    }
  });
  //Secuencia de Tipo Georeferencia
  const [ getListTipoGeoreferencia, ] = useLista({
    listas: ['TipoGeoreferencia'],
    onLoaded: (listas, isSuccess, error) => {
      if (isSuccess) {
        const listTipoGeoreferencia = getListTipoGeoreferencia('TipoGeoreferencia');
        setTipoGeoreferencia({listTipoGeoreferencia: listTipoGeoreferencia, indexTipoGeoreferencia: 0});
      }
      else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'TipoGeoreferencia',
      timeout: 0
    }
  });

  //function
  const getFormData = () => {
    let row = CloneObject(state.entity);
    row.idTipoGeoreferencia = parseInt(formValues.idTipoGeoreferencia);
    row.idPais = parseInt(formValues.idPais);
    row.idProvincia = parseInt(formValues.idProvincia);
    row.idLocalidad = parseInt(formValues.idLocalidad);
    row.codigoPostal = formValues.codigoPostal;

    row.calle = formValues.calle;
    row.entreCalle1 = formValues.entreCalle1;
    row.entreCalle2 = formValues.entreCalle2;
    row.altura = formValues.altura;
    row.piso = formValues.piso;
    row.dpto = formValues.dpto;

    row.idZonaGeoreferencia = parseInt(formValues.idZonaGeoreferencia);
    row.referencia = formValues.referencia;

    row.longitud = location.lng;
    row.latitud = location.lat;

    return row;
  }

  const isFormValid = (partial) => {

    if (!partial && state.modeFormEdit) {
      return {result: false, message: 'Debe finalizar el proceso de geolocalización primero'};
    }

    if (formValues.idPais <= 0) {
      return {result: false, message: 'Debe seleccionar el país'};
    }
    if (formValues.idProvincia <= 0) {
      return {result: false, message: 'Debe seleccionar la provincia'};
    }
    if (formValues.idLocalidad <= 0) {
      return {result: false, message: 'Debe seleccionar la localidad'};
    }
    if (formValues.codigoPostal.length <= 0) {
      return {result: false, message: 'Debe ingresar el código postal'};
    }
    
    if ([530,531,532].includes(formValues.idTipoGeoreferencia)) { //con api o carga directa
      if (formValues.calle.length <= 0) {
        return {result: false, message: 'Debe ingresar la calle'};
      }
      if (formValues.altura.length <= 0) {
        return {result: false, message: 'Debe ingresar la altura'};
      }
    }
    if ([533].includes(formValues.idTipoGeoreferencia)) { //con zona
      if (formValues.idZonaGeoreferencia <= 0) {
        return {result: false, message: 'Debe ingresar la zona'};
      }
    }
    if ([533,534].includes(formValues.idTipoGeoreferencia)) { //con zona o carga manual
      if (formValues.referencia <= 0) {
        return {result: false, message: 'Debe ingresar la referencia'};
      }
    }

    if (!partial && (location.lat === 0 || location.lng === 0)) {
      return {result: false, message: 'Debe georeferenciar la ubicación'};
    }

    return {result: true, message: null};
  }

  const executeGeoreferencia = () => {

    if (formValues.idTipoGeoreferencia === 530) //Open Street Map
    {
      setAddressOSM({
        country: valuePais.nombrePais,
        state: valueProvincia.nombreProvincia,
        city: valueLocalidad.nombreLocalidad,
        town: '',
        street: formValues.calle,
        number: formValues.altura
      });
    }
    else if (formValues.idTipoGeoreferencia === 531) //GSV Street View
    {
      setAddressGSV({
        country: valuePais.nombrePais,
        state: valueProvincia.nombreProvincia,
        city: valueLocalidad.nombreLocalidad,
        town: '',
        street: formValues.calle,
        number: formValues.altura
      });
    }
    else if (formValues.idTipoGeoreferencia === 532) //API Local
    {
      setAddressLocal({
        country: valuePais.nombrePais,
        state: valueProvincia.nombreProvincia,
        city: valueLocalidad.nombreLocalidad,
        town: '',
        street: formValues.calle,
        number: formValues.altura
      });
    }

  }

  const confirmEdit = () => {
    if (props.setPendingChange) {
        props.setPendingChange(true);
    }
    setState(prevState => {return {...prevState, modeFormEdit: false};});
    setCopy({form: null, location: null});
  }


  const createGeoLoadingMessage = () => {
    if (valueTipoGeoreferencia.listTipoGeoreferencia.length > 0) {
      const rowNext = valueTipoGeoreferencia.listTipoGeoreferencia[valueTipoGeoreferencia.indexTipoGeoreferencia + 1];
      const message = `Georeferenciando con "${rowNext.nombre}"...`;
      return message;
    }
    else {
      return "Mensaje indefinido";
    }
  }

  const createMessage = () => {
    if (valueTipoGeoreferencia.listTipoGeoreferencia.length > 0) {
      const rowCurrent = valueTipoGeoreferencia.listTipoGeoreferencia[valueTipoGeoreferencia.indexTipoGeoreferencia];
      const rowNext = valueTipoGeoreferencia.listTipoGeoreferencia[valueTipoGeoreferencia.indexTipoGeoreferencia + 1];
      const message = `"${rowCurrent.nombre}" no ha podido encontrar la ubicación. ¿Desea intentar con "${rowNext.nombre}"?`;
      return message;
    }
    else {
      return "Mensaje indefinido";
    }
  }

  const resetTipoGeoreferencia = () => {
    setTipoGeoreferencia(prevState => {return {...prevState, indexTipoGeoreferencia: 0}});
    const idTipoGeoreferencia = valueTipoGeoreferencia.listTipoGeoreferencia[0].id;
    changeTipoGeoreferencia(idTipoGeoreferencia);
  }

  const nextTipoGeoreferencia = () => {
    if (valueTipoGeoreferencia.indexTipoGeoreferencia < valueTipoGeoreferencia.listTipoGeoreferencia.length) {
      const nextIndex = valueTipoGeoreferencia.indexTipoGeoreferencia + 1;
      setTipoGeoreferencia(prevState => {return {...prevState, indexTipoGeoreferencia: nextIndex}});
      const idTipoGeoreferencia = valueTipoGeoreferencia.listTipoGeoreferencia[nextIndex].id;
      changeTipoGeoreferencia(idTipoGeoreferencia);

      if([530,531,532].includes(idTipoGeoreferencia)) {
        setState(prevState => {return {...prevState, showGeoLoading: true, textMessage: createGeoLoadingMessage()};});
      }
    }
  }

  const changeTipoGeoreferencia = (idTipoGeoreferencia) => {
    let formValuesCleaned = CloneObject(formValues);
    formValuesCleaned.idTipoGeoreferencia = idTipoGeoreferencia;

    if ([530,531,532].includes(idTipoGeoreferencia)) { //con api
      formValuesCleaned.idZonaGeoreferencia = 0;
      formValuesCleaned.referencia = "";
    }
    else if ([533].includes(idTipoGeoreferencia)) { //con zona
      formValuesCleaned.calle = "";
      formValuesCleaned.entreCalle1 = "";
      formValuesCleaned.entreCalle2 = "";
      formValuesCleaned.altura = "";
      formValuesCleaned.piso = "";
      formValuesCleaned.dpto = "";
    }
    else if ([534].includes(idTipoGeoreferencia)) { //carga manual
      formValuesCleaned.idZonaGeoreferencia = 0;
      formValuesCleaned.calle = "";
      formValuesCleaned.entreCalle1 = "";
      formValuesCleaned.entreCalle2 = "";
      formValuesCleaned.altura = "";
      formValuesCleaned.piso = "";
      formValuesCleaned.dpto = "";
      setLocation(locationInit);
    }

    formSet(formValuesCleaned);
  }


  const callbackGeoLoading = () => {
    handleClickConfirmEdit();
    setState(prevState => {return {...prevState, showGeoLoading: false};});
  }

  //handle
 
  const handleChangeZonaGeoreferencia = ({ target }) => {
    const idZonaGeoreferencia = parseInt(target.value);
    if (idZonaGeoreferencia > 0) {
      const rowZonaGeoreferencia = getRowZonaGeoreferencia('ZonaGeoreferencia',idZonaGeoreferencia);
      formSet({...formValues, idZonaGeoreferencia: idZonaGeoreferencia});
      const newLocation = {lat: rowZonaGeoreferencia.latitud, lng: rowZonaGeoreferencia.longitud};
      setLocation(newLocation);
    }
    else {
      formSet({...formValues, idZonaGeoreferencia: 0});
    }
  }

  const handleChangeTipoGeoreferencia = ({ target }) => {
    const idTipoGeoreferencia = parseInt(target.value);
    changeTipoGeoreferencia(idTipoGeoreferencia);
  }


  const handleClickInitEdit = () => {
    setCopy({
      form: CloneObject(formValues),
      location: CloneObject(location)
    });
    setState(prevState => {return {...prevState, modeFormEdit: true};});
    resetTipoGeoreferencia();
  }

  const handleClickConfirmEdit = () => {
    const validation = isFormValid(true);
    if (!validation.result)
    {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, validation.message);
      return;
    }

    if ([530,531,532].includes(formValues.idTipoGeoreferencia)) {
      executeGeoreferencia();
    }
    else {
      confirmEdit();
    }
  }

  const handleClickDismissEdit = () => {
    if (copy.form) {
      formSet(CloneObject(copy.form));
    }
    if (copy.location) {
      setLocation(CloneObject(copy.location));
    }
    setState(prevState => {return {...prevState, modeFormEdit: false};});
    setCopy({form: null, location: null});
  }

  const handleClickCargaManual = () => {
    nextTipoGeoreferencia();
  }


  return (
    <>

    {state.showGeoLoading && 
        <GeoLoadingModal
            active={state.showGeoLoading}
            message={state.textMessage}
            callbackGeoLoading={callbackGeoLoading}
        />
    }

    {state.showMessage && 
        <MessageModal
            title={"Aviso"}
            message={state.textMessage}
            onDismiss={() => {
              setState(prevState => {return {...prevState, showMessage: false};});
            }}
            onConfirm={() => {
              setState(prevState => {return {...prevState, showMessage: false};});
              nextTipoGeoreferencia();
            }}
        />
    }

    <div className='direccion-form'>
    
      <div className='row m-top-10'>
          <div className="col-6 col-lg-2">
              <label htmlFor="idTipoGeoreferencia" className="form-label">Tipo georeferencia</label>
              <InputLista
                  name="idTipoGeoreferencia"
                  placeholder=""
                  className="form-control"
                  value={ formValues.idTipoGeoreferencia }
                  onChange={ handleChangeTipoGeoreferencia }
                  disabled={true}
                  title="Tipo Georeferencia"
                  lista="TipoGeoreferencia"
              />
          </div>
          <div className="col-6 col-lg-3">
              <label htmlFor="idPais" className="form-label">País</label>
              <InputEntidad
                  name="idPais"
                  placeholder=""
                  className="form-control"
                  value={ formValues.idPais }
                  onChange={({target}) => {
                    formSet({...formValues,
                      idPais: target.value,
                      idProvincia: 0,
                      idLocalidad: 0
                    });
                  }}
                  onUpdate={({target}) => {
                    setPais({nombrePais: (target.row) ? target.row.nombre: ''});
                  }}
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
                  title="País"
                  entidad="Pais"
                  columns= {[{ Header: 'Nombre', accessor: 'nombre', width: '95%' }]}
              />
          </div>
          <div className="col-6 col-lg-3">
              <label htmlFor="idProvincia" className="form-label">Provincia</label>
              <InputEntidad
                  name="idProvincia"
                  placeholder=""
                  className="form-control"
                  value={ formValues.idProvincia }
                  onChange={({target}) => {
                    formSet({...formValues,
                      idProvincia: target.value,
                      idLocalidad: 0
                    });
                  }}
                  onUpdate={({target}) => {
                    setProvincia({nombreProvincia: (target.row) ? target.row.nombre: ''});
                  }}
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
                  title="Provincia"
                  entidad="Provincia"
                  filter={(row) => row.idPais === formValues.idPais}
                  columns= {[{ Header: 'Nombre', accessor: 'nombre', width: '95%' }]}
              />
          </div>
          <div className="col-6 col-lg-3">
              <label htmlFor="idLocalidad" className="form-label">Localidad</label>
              <InputEntidad
                  name="idLocalidad"
                  placeholder=""
                  className="form-control"
                  value={ formValues.idLocalidad }
                  onChange={({target}) => {
                    formSet({...formValues,
                      idLocalidad: target.value
                    });
                  }}
                  onUpdate={({target}) => {
                    setLocalidad({nombreLocalidad: (target.row) ? target.row.nombre: ''});
                  }}
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
                  title="Localidad"
                  entidad="Localidad"
                  filter={(row) => row.idProvincia === formValues.idProvincia}
                  columns= {[{ Header: 'Nombre', accessor: 'nombre', width: '95%' }]}
              />
          </div>
          <div className="col-2 col-lg-1">
              <label htmlFor="codigoPostal" className="form-label">CP</label>
              <input
                  name="codigoPostal"
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={formValues.codigoPostal }
                  onChange={({target}) =>{
                    if (target.validity.valid) {
                        formSet({...formValues, codigoPostal: target.value});
                    }
                  }}
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
                  pattern={PATTERNS.onlyNumbersAndLetters}
              />
          </div>
          {[530,531,532,535].includes(formValues.idTipoGeoreferencia) && (
          <>
          <div className="col-12 col-md-3 m-top-10">
              <label htmlFor="calle" className="form-label">Calle</label>
              <input
                  name="calle"
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={formValues.calle }
                  onChange={ formHandle }
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
              />
          </div>
          <div className="col-6 col-md-1 m-top-10">
              <label htmlFor="altura" className="form-label">Altura</label>
              <input
                  name="altura"
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={formValues.altura }
                  onChange={({target}) =>{
                    if (target.validity.valid) {
                        formSet({...formValues, altura: target.value});
                    }
                  }}
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
                  pattern={PATTERNS.onlyNumbersAndLetters}
              />
          </div>
          <div className="col-6 col-md-1 m-top-10">
              <label htmlFor="piso" className="form-label">Piso</label>
              <input
                  name="piso"
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={formValues.piso }
                  onChange={({target}) =>{
                    if (target.validity.valid) {
                        formSet({...formValues, piso: target.value});
                    }
                  }}
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
                  pattern={PATTERNS.onlyNumbersAndLetters}
              />
          </div>
          <div className="col-6 col-md-1 m-top-10">
              <label htmlFor="dpto" className="form-label">Dpto</label>
              <input
                  name="dpto"
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={formValues.dpto }
                  onChange={({target}) =>{
                    if (target.validity.valid) {
                        formSet({...formValues, dpto: target.value});
                    }
                  }}
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
                  pattern={PATTERNS.onlyNumbersAndLetters}
              />
          </div>
          <div className="col-12 col-md-3 m-top-10">
              <label htmlFor="entreCalle1" className="form-label">Entre calle (1)</label>
              <input
                  name="entreCalle1"
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={formValues.entreCalle1 }
                  onChange={ formHandle }
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
              />
          </div>
          <div className="col-12 col-md-3 m-top-10">
              <label htmlFor="entreCalle2" className="form-label">Entre calle (2)</label>
              <input
                  name="entreCalle2"
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={formValues.entreCalle2 }
                  onChange={ formHandle }
                  disabled={props.disabled || !state.modeFormEdit || valueTipoGeoreferencia.indexTipoGeoreferencia > 0}
              />
          </div>
          </>
          )}
          {[533,535].includes(formValues.idTipoGeoreferencia) && (
          <>
          <div className="col-12 col-md-8">
              <label htmlFor="idZonaGeoreferencia" className="form-label">Zona</label>
              <select
                  name="idZonaGeoreferencia"
                  placeholder=""
                  className="form-control"
                  value={ formValues.idZonaGeoreferencia }
                  onChange={ handleChangeZonaGeoreferencia }
                  disabled={props.disabled || !state.modeFormEdit}
              >
              <option value={0}></option>
              {getListZonaGeoreferencia('ZonaGeoreferencia').map((item, index) =>
                <option value={item.id} key={index}>{item.nombre}</option>
              )}
              </select>
          </div>
          {!props.disabled && state.modeFormEdit && (
          <div className="col-12 col-md-4 m-top-30">
            <button className="btn btn-primary float-end" onClick={ (event) => handleClickCargaManual() }>
              Carga Manual
            </button>
          </div>
          )}
          </>
          )}
          {[533,534,535].includes(formValues.idTipoGeoreferencia) && (
          <>
          <div className="col-12">
              <label htmlFor="referencia" className="form-label">Referencia</label>
              <input
                  name="referencia"
                  type="text"
                  placeholder=""
                  className="form-control"
                  value={formValues.referencia }
                  onChange={ formHandle }
                  disabled={props.disabled || !state.modeFormEdit}
              />
          </div>
          </>
          )}
      </div>

      <div className='row'>
        <div className="col-12 m-top-10">
          {!props.disabled && !state.modeFormEdit && (
            <button className="btn btn-primary btn-map float-end" onClick={ (event) => handleClickInitEdit() }>
              <span className="material-symbols-outlined" title="modificar dirección">location_on</span>
            </button>
          )}
          {!props.disabled && state.modeFormEdit && (
            <>
            <button className="btn btn-primary btn-map float-end  m-left-5" onClick={ (event) => handleClickConfirmEdit() }>
              <span className="material-symbols-outlined" title="aceptar">done</span>
            </button>
            <button className="btn btn-outline-primary btn-map float-end" onClick={ (event) => handleClickDismissEdit() }>
              <span className="material-symbols-outlined" title="cancelar">close</span>
            </button>
            </>
          )}
        </div>
      </div>
      
      <div className='row m-top-20'>
        <div className="col-12">
            
            <Maps
              disabled={!([534,535].includes(formValues.idTipoGeoreferencia) && !props.disabled && state.modeFormEdit)}
              position={location}
              onChange={setLocation}
            />

        </div>
      </div>

    </div>

    </>
  );
})

DireccionForm.propTypes = {
  id: string,
  disabled: bool,
  initFormEdit: bool,
  data: object.isRequired,
  setPendingChange: func
};

DireccionForm.defaultProps = {
  id: null,
  disabled: false,
  initFormEdit: false,
  setPendingChange: null
};

export default DireccionForm
