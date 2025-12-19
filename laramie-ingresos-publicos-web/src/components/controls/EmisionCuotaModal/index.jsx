import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { CloneObject, GetMeses } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import ShowToastMessage from '../../../utils/toast';
import { DatePickerCustom, InputEjercicio, InputFormula, ToolbarFormula } from '../../common';
import { OnKeyPress_validInteger, validateFormula } from '../../../utils/validator';

const EmisionCuotaModal = (props) => {

  const entityInit = {
    id: 0,
    idEmisionEjecucion: 0,
    cuota: "",
    mes: 0,
    descripcion: "",
    formulaCondicion: "",
    anioDDJJ: "",
    mesDDJJ: 0,
    fechaVencimiento1: null,
    fechaVencimiento2: null,
    orden: 0
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    accordions: {
      cabecera: true,
      formula: false
    },
    listVariables: [],
    listFunciones: []
  });

  const [toolbar, setToolbar] = useState({
    show: false,
    horizontal: false
  });

  const [editor, setEditor] = useState({
    fontSize: "md",
    expand: false
  });

  const [queueEvents, setQueueEvents] = useState({
    timestamps: null,
    queue: []
  });

  const mount = () => {
    setState(prevState => {
      return {...prevState,
        entity: props.data.entity,
        listVariables: props.data.listVariables,
        listFunciones: props.data.listFunciones
      };
    });
    formSet({
      cuota: props.data.entity.cuota,
      mes: props.data.entity.mes,
      descripcion: props.data.entity.descripcion,
      formulaCondicion: props.data.entity.formulaCondicion,
      anioDDJJ: props.data.entity.anioDDJJ,
      mesDDJJ: props.data.entity.mesDDJJ,
      fechaVencimiento1: props.data.entity.fechaVencimiento1,
      fechaVencimiento2: props.data.entity.fechaVencimiento2,
      orden: props.data.entity.orden
    });
  }
  useEffect(mount, [props.data.entity]);

  const [ formValues, formHandle, , formSet ] = useForm({
    cuota: "",
    mes: 0,
    descripcion: "",
    formulaCondicion: "",
    anioDDJJ: "",
    mesDDJJ: 0,
    fechaVencimiento1: null,
    fechaVencimiento2: null,
    orden: 0
  });

  //handles
  const handleToolbarFormulaToogleHorizontal = (horizontal) => {
    setToolbar(prevState => {
      return {...prevState, horizontal: horizontal};
    });
  }
  const handleToolbarFormulaSelect = (event) => {
    const timestamps = new Date();
    let newQueue = queueEvents.queue.slice();
    newQueue.push({queueName: "Cuota", timestamps: timestamps, ...event});

    setQueueEvents({
      queue: newQueue,
      timestamps: timestamps
    });
  }

  const handleClickConfirm = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.cuota = formValues.cuota;
      row.mes = parseInt(formValues.mes);
      row.descripcion = formValues.descripcion;
      row.formulaCondicion = formValues.formulaCondicion;
      row.anioDDJJ = formValues.anioDDJJ;
      row.mesDDJJ = parseInt(formValues.mesDDJJ);
      row.fechaVencimiento1 = formValues.fechaVencimiento1;
      row.fechaVencimiento2 = formValues.fechaVencimiento2;
      row.orden = parseInt(formValues.orden);

      props.onConfirm(row);
    };
  }

  //funciones
  function isFormValid() {

    if (formValues.cuota.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo cuota');
      return false;
    }
    if (formValues.mes <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo mes');
      return false;
    }
    if (formValues.descripcion.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo descripción');
      return false;
    }
    if (formValues.fechaVencimiento1 == null) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo primer vencimiento');
      return false;
    }
    if (formValues.fechaVencimiento2 == null) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo segundo vencimiento');
      return false;
    }

    if (formValues.formulaCondicion.length > 0) {
      const error = validateFormula(formValues.formulaCondicion);
      if (error) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Fórmula Condición incorrecta: ' + error);
        return false;
      }
    }

    return true;
  }

  function ToggleFormulaExpand() {
    if (!editor.expand && state.accordions.cabecera) {
      ToggleAccordion('cabecera');
    }
    setEditor(prevState => {
      return {...prevState, expand: !prevState.expand};
    });
  }
  function SetFormulaFontSizeUp() {
    let fontSize = editor.fontSize;
    if (fontSize === "xm") fontSize = "sm";
    else if (fontSize === "sm") fontSize = "md";
    else if (fontSize === "md") fontSize = "lg";

    if (fontSize !== editor.fontSize) {
      setEditor(prevState => {
        return {...prevState, fontSize: fontSize};
      });
    }
  }
  function SetFormulaFontSizeDown() {
    let fontSize = editor.fontSize;
    if (fontSize === "lg") fontSize = "md";
    else if (fontSize === "md") fontSize = "sm";
    else if (fontSize === "sm") fontSize = "xm";

    if (fontSize !== editor.fontSize) {
      setEditor(prevState => {
        return {...prevState, fontSize: fontSize};
      });
    }
  }

  function ToogleToolbarShow() {
    setToolbar(prevState => {
      return {
        show: !prevState.show,
        horizontal: false
      };
    });
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

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className={(toolbar.show && !toolbar.horizontal) ? "modal-dialog modal-xl" : "modal-dialog modal-lg"}>
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
            <h2 className="modal-title">Cuota: {(state.entity.id > 0) ? state.entity.descripcion : "Nuevo"}</h2>
          </div>
          <div className="modal-body">
            <div className="row">

              <div id="panel-main" className={(toolbar.show && !toolbar.horizontal) ? "col-12 col-lg-8" : "col-12"}>
                    
                <div className='accordion-header'>
                    <div className='row'>
                        <div className="col-12" onClick={() => ToggleAccordion('cabecera')}>
                            <div className='accordion-header-title'>
                                {(state.accordions.cabecera) ? accordionOpen : accordionClose}
                                <h3 className={state.accordions.cabecera ? 'active' : ''}>Datos</h3>
                            </div>
                        </div>
                    </div>
                </div>
                {state.accordions.cabecera &&
                <div className='accordion-body'>
                  <div className="row form-basic">
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="cuota" className="form-label">Cuota</label>
                        <input
                            name="cuota"
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={ formValues.cuota}
                            onChange={ formHandle }
                            onKeyPress={ OnKeyPress_validInteger }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="mes" className="form-label">Mes</label>
                        <select
                            name="mes"
                            placeholder="Mes"
                            className="form-control"
                            value={ formValues.mes }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        >
                        {GetMeses(true).map((item, index) =>
                          <option value={item.key} key={index}>{item.name}</option>
                        )}
                        </select>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="orden" className="form-label">Orden</label>
                        <input
                            name="orden"
                            type="number"
                            placeholder=""
                            className="form-control"
                            value={ formValues.orden }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <input
                            name="descripcion"
                            type="text"
                            placeholder=""
                            maxLength={1000}
                            className="form-control"
                            value={ formValues.descripcion }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="anioDDJJ" className="form-label">Año DDJJ</label>
                        <InputEjercicio
                            name="anioDDJJ"
                            placeholder=""
                            className="form-control"
                            value={ formValues.anioDDJJ }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="mesDDJJ" className="form-label">Mes DDJJ</label>
                        <select
                            name="mesDDJJ"
                            placeholder="Mes DDJJ"
                            className="form-control"
                            value={ formValues.mesDDJJ }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        >
                        {GetMeses(true).map((item, index) =>
                          <option value={item.key} key={index}>{item.name}</option>
                        )}
                        </select>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="fechaVencimiento1" className="form-label">1° Vencimiento</label>
                        <DatePickerCustom
                            name="fechaVencimiento1"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaVencimiento1 }
                            onChange={ formHandle }
                            disabled={props.disabled || props.disabledDates}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                        <label htmlFor="fechaVencimiento2" className="form-label">2° Vencimiento</label>
                        <DatePickerCustom
                            name="fechaVencimiento2"
                            placeholder=""
                            className="form-control"
                            value={ formValues.fechaVencimiento2 }
                            onChange={ formHandle }
                            disabled={props.disabled || props.disabledDates}
                            minValue={formValues.fechaVencimiento1}
                        />
                    </div>
                  </div>
                </div>
                }

                <div className='accordion-header m-top-15 invisible'>
                    <div className='row'>
                        <div className="col-8" onClick={() => ToggleAccordion('formula')}>
                            <div className='accordion-header-title'>
                                {(state.accordions.formula) ? accordionOpen : accordionClose}
                                <h3 className={state.accordions.formula ? 'active' : ''}>Condición</h3>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className="action m-right-20 m-top-10">
                              {!props.disabled &&
                              <div onClick={ (event) => ToogleToolbarShow() } className="link float-end m-left-15">
                                  <i className="fa fa-bars" title={(toolbar.show) ? "ocultar asistente de fórmulas" : "mostrar asistente de fórmulas"}></i>
                              </div>
                              }
                              <div onClick={ (event) => ToggleFormulaExpand() } className="link float-end m-left-15">
                                  <i className={(editor.expand) ? "fas fa-compress" : "fas fa-expand"} 
                                      title={(editor.expand) ? "contraer editor de fórmula" : "expandir editor de fórmula"}></i>
                              </div>
                              <div onClick={ (event) => SetFormulaFontSizeDown() } className="link float-end m-left-5">
                                  <i className="fas fa-sort-amount-down" title="disminuir tamaño de fuente"></i>
                              </div>
                              <div onClick={ (event) => SetFormulaFontSizeUp() } className="link float-end m-left-5">
                                  <i className="fas fa-sort-amount-up" title="aumentar tamaño de fuente"></i>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                {state.accordions.formula &&
                <div className='accordion-body'>
                  <div className="row">
                    <div className="col-12">
                      <InputFormula
                          name="formulaCondicion"
                          className="form-control"
                          fontSize={editor.fontSize}
                          editorExpanded={editor.expand}
                          value={ formValues.formulaCondicion }
                          onChange={ formHandle }
                          disabled={props.disabled}
                          data={{
                            listCalculos: [],
                            listVariables: state.listVariables,
                            listFunciones: state.listFunciones,
                            listParametros: [],
                            listElementos: []
                          }}
                          queueEvents={queueEvents}
                          queueName="Cuota"
                      />
                    </div>
                  </div>
                </div>
                }

              </div>

              {toolbar.show &&
                <ToolbarFormula
                  data={{
                    listCalculos: [],
                    listVariables: state.listVariables,
                    listFunciones: state.listFunciones,
                    listParametros: [],
                    listElementos: []
                  }}
                  showCalculo={false}
                  showParametros={false}
                  showElementos={false}
                  showEntidades={false}
                  onToogleHorizontal={handleToolbarFormulaToogleHorizontal}
                  onSelect={handleToolbarFormulaSelect}
                />
              }

            </div>

          </div>
          <div className="modal-footer modal-footer-unset">
            <button className="btn btn-outline-primary float-end" data-dismiss="modal" onClick={ (event) => props.onDismiss() }>Cancelar</button>
            {!props.disabled &&
              <button className="btn btn-primary float-end" data-dismiss="modal" onClick={ (event) => handleClickConfirm() }>Aceptar</button>
            }
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

EmisionCuotaModal.propTypes = {
  disabled: bool,
  disabledDates: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired
};

EmisionCuotaModal.defaultProps = {
  disabled: false,
  disabledDates: false
};

export default EmisionCuotaModal;