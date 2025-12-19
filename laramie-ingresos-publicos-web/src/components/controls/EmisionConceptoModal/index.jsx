import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { CloneObject } from '../../../utils/helpers';
import { ALERT_TYPE } from '../../../consts/alertType';
import { useForm } from '../../hooks/useForm';
import ShowToastMessage from '../../../utils/toast';
import { InputEntidad, InputFormula, InputLista, InputSubTasa, InputTasa, ToolbarFormula } from '../../common';
import { validateFormula } from '../../../utils/validator';

const EmisionConceptoModal = (props) => {

  const entityInit = {
    id: 0,
    idEmisionDefinicion: 0,
    idTasa: 0,
    idSubTasa: 0,
    idTipoMovimiento: 0,
    descripcion: "",
    formulaCondicion: "",
    formulaImporteTotal: "",
    formulaImporteNeto: "",
    vencimiento: 1,
    soloLectura: false,
    orden: 0
  };

  //hooks
  const [state, setState] = useState({
    entity: entityInit,
    accordions: {
      cabecera: true,
      formula: true
    },
    listCalculos: [],
    listFunciones: []
  });

  const [toolbar, setToolbar] = useState({
    show: false,
    horizontal: false
  });

  const [editor, setEditor] = useState({
    fontSize: "md"
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
        listFunciones: props.data.listFunciones
      };
    });
    formSet({
      idTasa: props.data.entity.idTasa,
      idSubTasa: props.data.entity.idSubTasa,
      idTipoMovimiento: props.data.entity.idTipoMovimiento,
      descripcion: props.data.entity.descripcion,
      formulaCondicion: props.data.entity.formulaCondicion,
      formulaImporteTotal: props.data.entity.formulaImporteTotal,
      formulaImporteNeto: props.data.entity.formulaImporteNeto,
      vencimiento: props.data.entity.vencimiento,
      orden: props.data.entity.orden
    });
  }
  useEffect(mount, [props.data.entity]);

  const [ formValues, formHandle, , formSet ] = useForm({
    idTasa: 0,
    idSubTasa: 0,
    idTipoMovimiento: 0,
    descripcion: "",
    formulaCondicion: "",
    formulaImporteTotal: "",
    formulaImporteNeto: "",
    vencimiento: 1,
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
    newQueue.push({queueName: queueEvents.queueNameCurrent, timestamps: timestamps, ...event});

    setQueueEvents({
      queue: newQueue,
      timestamps: timestamps
    });
  }

  const handleClickConfirm = () => {
    if (isFormValid()) {

      let row = CloneObject(state.entity);
      row.idTasa = parseInt(formValues.idTasa);
      row.idSubTasa = parseInt(formValues.idSubTasa);
      row.idTipoMovimiento = parseInt(formValues.idTipoMovimiento);
      row.descripcion = formValues.descripcion;
      row.formulaCondicion = formValues.formulaCondicion;
      row.formulaImporteTotal = formValues.formulaImporteTotal;
      row.formulaImporteNeto = formValues.formulaImporteNeto;
      row.vencimiento = parseInt(formValues.vencimiento);
      row.orden = parseInt(formValues.orden);

      props.onConfirm(row);
    };
  }

  //funciones
  function isFormValid() {

    if (formValues.idTasa <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Tasa');
      return false;
    }
    if (formValues.idSubTasa <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo SubTasa');
      return false;
    }
    if (formValues.idTipoMovimiento <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe seleccionar el campo Movimiento');
      return false;
    }
    if (formValues.descripcion.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el campo descripción');
      return false;
    }
    if (formValues.formulaImporteTotal.length <= 0) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe definir una formula');
      return false;
    }

    let error = validateFormula(formValues.formulaImporteNeto);
    if (error) {
      ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Fórmula A cancelar incorrecta: ' + error);
      return false;
    }
    if (formValues.formulaImporteTotal.length > 0) {
      error = validateFormula(formValues.formulaImporteTotal);
      if (error) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Fórmula Importe incorrecta: ' + error);
        return false;
      }
    }
    if (formValues.formulaCondicion.length > 0) {
      error = validateFormula(formValues.formulaCondicion);
      if (error) {
        ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Fórmula Condición incorrecta: ' + error);
        return false;
      }
    }

    return true;
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
            <h2 className="modal-title">Concepto: {(state.entity.id > 0) ? state.entity.descripcion : "Nuevo"}</h2>
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
                    <div className="col-12 col-lg-6">
                        <label htmlFor="idTasa" className="form-label">Tasa</label>
                        <InputTasa
                            name="idTasa"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTasa }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <label htmlFor="idSubTasa" className="form-label">Sub tasa</label>
                        <InputSubTasa
                            name="idSubTasa"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idSubTasa }
                            onChange={ formHandle }
                            disabled={ props.disabled}
                            idTasa={formValues.idTasa}
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
                        <label htmlFor="idTipoMovimiento" className="form-label">Movimiento</label>
                        <InputEntidad
                            name="idTipoMovimiento"
                            placeholder=""
                            className="form-control"
                            value={ formValues.idTipoMovimiento }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            entidad="TipoMovimiento"
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
                    <div className="col-6 col-lg-4">
                        <label htmlFor="vencimiento" className="form-label">Vencimiento</label>
                        <select
                            name="vencimiento"
                            placeholder="Tipo"
                            className="form-control"
                            value={ formValues.vencimiento }
                            onChange={ formHandle }
                            disabled={props.disabled}
                        >
                          <option value={1}>1er Vencimiento</option>
                          <option value={2}>2er Vencimiento</option>
                        </select>
                    </div>
                  </div>
                </div>
                }

                <div className='accordion-header m-top-15'>
                    <div className='row'>
                        <div className="col-8" onClick={() => ToggleAccordion('formula')}>
                            <div className='accordion-header-title'>
                                {(state.accordions.formula) ? accordionOpen : accordionClose}
                                <h3 className={state.accordions.formula ? 'active' : ''}>Fórmulas</h3>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className="action m-right-20 m-top-10">
                              {!props.disabled &&
                              <div onClick={ (event) => ToogleToolbarShow() } className="link float-end m-left-15">
                                  <i className="fa fa-bars" title={(toolbar.show) ? "ocultar asistente de fórmulas" : "mostrar asistente de fórmulas"}></i>
                              </div>
                              }
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
                  <div className="row ba">
                    <div className="mb-3 col-12">
                        <label htmlFor="formulaCondicion" className="form-label">Condición</label>
                        <InputFormula
                            name="formulaCondicion"
                            className="form-control"
                            fontSize={editor.fontSize}
                            heightNormal={50}
                            value={ formValues.formulaCondicion }
                            onChange={ formHandle }
                            onFocus={(event) => {
                              setQueueEvents(prevState => {
                                return {...prevState,
                                  queueNameCurrent: "Condicion"
                                };
                              });
                            }}
                            disabled={props.disabled}
                            data={{
                              listVariables: [],
                              listCalculos: state.listCalculos,
                              listFunciones: state.listFunciones,
                              listParametros: [],
                              listElementos: []
                            }}
                            queueEvents={queueEvents}
                            queueName="Condicion"
                        />
                    </div>
                    <div className="mb-3 col-12">
                        <label htmlFor="formulaImporteTotal" className="form-label">Importe</label>
                        <InputFormula
                            name="formulaImporteTotal"
                            className="form-control"
                            fontSize={editor.fontSize}
                            heightNormal={80}
                            value={ formValues.formulaImporteTotal }
                            onChange={ formHandle }
                            onFocus={(event) => {
                              setQueueEvents(prevState => {
                                return {...prevState,
                                  queueNameCurrent: "ImporteTotal"
                                };
                              });
                            }}
                            disabled={props.disabled}
                            data={{
                              listVariables: [],
                              listCalculos: state.listCalculos,
                              listFunciones: state.listFunciones,
                              listParametros: [],
                              listElementos: []
                            }}
                            queueEvents={queueEvents}
                            queueName="ImporteTotal"
                        />
                    </div>
                    <div className="mb-3 col-12">
                        <label htmlFor="formulaImporteNeto" className="form-label">A cancelar</label>
                        <InputFormula
                            name="formulaImporteNeto"
                            className="form-control"
                            fontSize={editor.fontSize}
                            heightNormal={80}
                            value={ formValues.formulaImporteNeto }
                            onChange={ formHandle }
                            onFocus={(event) => {
                              setQueueEvents(prevState => {
                                return {...prevState,
                                  queueNameCurrent: "ImporteNeto"
                                };
                              });
                            }}
                            disabled={props.disabled}
                            data={{
                              listVariables: [],
                              listCalculos: state.listCalculos,
                              listFunciones: state.listFunciones,
                              listParametros: [],
                              listElementos: []
                            }}
                            queueEvents={queueEvents}
                            queueName="ImporteNeto"
                        />
                    </div>
                  </div>

                </div>
                }

              </div>

              {toolbar.show &&
                <ToolbarFormula
                  data={{
                    listCalculos: state.listCalculos.filter(f => f.idTipoEmisionCalculo === 242), //Resultado
                    listVariables: [],
                    listFunciones: state.listFunciones,
                    listParametros: [],
                    listElementos: []
                  }}
                  showVariables={false}
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

EmisionConceptoModal.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onConfirm: func.isRequired,
  onDismiss: func.isRequired,
  onMovePrevious: func,
  onMoveNext: func,
};

EmisionConceptoModal.defaultProps = {
  disabled: false,
  onMovePrevious: null,
  onMoveNext:  null
};

export default EmisionConceptoModal;