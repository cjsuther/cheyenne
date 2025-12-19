import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import ShowToastMessage from '../../../utils/toast';
import { InputFormula, InputLista, ToolbarFormula } from '../../common';
import { validateFormula } from '../../../utils/validator';


const EmisionCalculoModal = (props) => {

  const entityInit = {
    id: 0,
    idEmisionDefinicion: 0,
    idTipoEmisionCalculo: 0,
    codigo: "",
    nombre: "",
    descripcion: "",
    guardaValor: false,
    formula: "",
    soloLectura: false,
    orden: 0,
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    accordions: {
      cabecera: true,
      formula: true
    },
    listCalculos: [],
    listVariables: [],
    listFunciones: [],
    listParametros: [],
    listElementos: []
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
        listCalculos: props.data.listCalculos,
        listVariables: props.data.listVariables,
        listFunciones: props.data.listFunciones,
        listParametros: props.data.listParametros,
        listElementos: props.data.listElementos
      };
    });
    formSet({
      idTipoEmisionCalculo: props.data.entity.idTipoEmisionCalculo,
      codigo: props.data.entity.codigo,
      nombre: props.data.entity.nombre,
      descripcion: props.data.entity.descripcion,
      guardaValor: props.data.entity.guardaValor,
      formula: props.data.entity.formula,
      orden: props.data.entity.orden
    });
  }
  useEffect(mount, [props.data.entity]);

  const [ formValues, formHandle, , formSet ] = useForm({
    idTipoEmisionCalculo: 0,
    codigo: "",
    nombre: "",
    descripcion: "",
    guardaValor: false,
    formula: "",
    orden: 0,
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
    newQueue.push({queueName: "Calculo", timestamps: timestamps, ...event});

    setQueueEvents({
      queue: newQueue,
      timestamps: timestamps
    });
  }

  const handleClickConfirm = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTipoEmisionCalculo = parseInt(formValues.idTipoEmisionCalculo);
      row.codigo = formValues.codigo;
      row.nombre = formValues.nombre;
      row.descripcion = formValues.descripcion;
      row.guardaValor = formValues.guardaValor;
      row.formula = formValues.formula;
      row.orden = parseInt(formValues.orden);

      props.onConfirm(row);
    };
  }

  //funciones
  function isFormValid() {

    if (formValues.idTipoEmisionCalculo <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tipo Cálculo');
      return false;
    }
    if (formValues.codigo.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo código');
      return false;
    }
    if (formValues.nombre.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo nombre');
      return false;
    }
    if (formValues.descripcion.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo descripción');
      return false;
    }
    if (formValues.formula.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe definir una formula');
      return false;
    }

    const error = validateFormula(formValues.formula);
    if (error) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Fórmula incorrecta: ' + error);
      return false;
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
            <h2 className="modal-title">Cálculo: {(state.entity.id > 0) ? state.entity.nombre : "Nuevo"}</h2>
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
                    <div className="col-12 col-lg-4">
                        <label htmlFor="codigo" className="form-label">Código</label>
                        <input
                            name="codigo"
                            type="text"
                            placeholder=""
                            maxLength={50}
                            className="form-control"
                            value={ formValues.codigo }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="col-12 col-lg-8">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            name="nombre"
                            type="text"
                            placeholder=""
                            maxLength={250}
                            className="form-control"
                            value={ formValues.nombre }
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
                    <div className="col-12 col-lg-4">
                        <label htmlFor="idTipoEmisionCalculo" className="form-label">Tipo Cálculo</label>
                        <InputLista
                            name="idTipoEmisionCalculo"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoEmisionCalculo }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            lista="TipoEmisionCalculo"
                        />
                    </div>
                    <div className="col-6 col-lg-4">
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
                    <div className="col-6 col-lg-4 p-top-25 text-center">
                        <label htmlFor="guardaValor" className="form-check-label p-right-10">Guardar Valor</label>
                        <input
                            name="guardaValor"
                            type="checkbox"
                            className="form-check-input"
                            value={''}
                            checked={formValues.guardaValor }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                  </div>
                </div>
                }

                <div className='accordion-header m-top-15'>
                    <div className='row'>
                        <div className="col-8" onClick={() => ToggleAccordion('formula')}>
                            <div className='accordion-header-title'>
                                {(state.accordions.formula) ? accordionOpen : accordionClose}
                                <h3 className={state.accordions.formula ? 'active' : ''}>Fórmula</h3>
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
                          name="formula"
                          className="form-control"
                          fontSize={editor.fontSize}
                          editorExpanded={editor.expand}
                          value={ formValues.formula }
                          onChange={ formHandle }
                          disabled={props.disabled}
                          data={{
                            listCalculos: state.listCalculos,
                            listVariables: state.listVariables,
                            listFunciones: state.listFunciones,
                            listParametros: state.listParametros,
                            listElementos: state.listElementos
                          }}
                          queueEvents={queueEvents}
                          queueName="Calculo"
                      />
                    </div>
                  </div>
                </div>
                }

              </div>

              {toolbar.show &&
                <ToolbarFormula
                  data={{
                    listCalculos: state.listCalculos.filter(f => f.orden < formValues.orden),
                    listVariables: state.listVariables,
                    listFunciones: state.listFunciones,
                    listParametros: state.listParametros,
                    listElementos: state.listElementos
                  }}
                  onToogleHorizontal={handleToolbarFormulaToogleHorizontal}
                  onSelect={handleToolbarFormulaSelect}
                  showElementos={props.showElementos}
                  showEntidades={props.showEntidades}
                />
              }

            </div>

          </div>
          <div className="modal-footer modal-footer-unset">
            {props.onMovePrevious &&
              <button className="btn back-button float-start" data-dismiss="modal" onClick={ (event) => props.onMovePrevious() }>Anterior</button>
            }
            {props.onMoveNext &&
              <button className="btn back-button float-start" data-dismiss="modal" onClick={ (event) => props.onMoveNext() }>Siguiente</button>
            }
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

EmisionCalculoModal.propTypes = {
  disabled: bool,
  showEntidades: bool,
  showElementos: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
  onMovePrevious: func,
  onMoveNext: func,
};

EmisionCalculoModal.defaultProps = {
  disabled: false,
  showEntidades: false,
  showElementos: false,
  onMovePrevious: null,
  onMoveNext:  null
};

export default EmisionCalculoModal;