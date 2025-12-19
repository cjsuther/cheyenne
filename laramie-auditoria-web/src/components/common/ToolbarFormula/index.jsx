import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { CloneObject, GetTipoDato } from '../../../utils/helpers';
import { TableCustom } from '../../common';

import './index.scss';


const ToolbarFormula = (props) => {


  //hooks
  const [state, setState] = useState({
    listCalculos: [],
    listVariables: [],
    listFunciones: [],
    listParametros: [],
    listRubros: [],
    listElementos: [],
    listEntidades: []
  });

  //atributos
  const listFields = [
    {id: -1, codigo: "CAMPO_TIPO", nombre: "Tipo", grupo: 'EXCD'},
    {id: -2, codigo: "CAMPO_CANTIDAD", nombre: "Cantidad", grupo:'E'},
    {id: -3, codigo: "CAMPO_VALOR", nombre: "Valor", grupo: 'E'},
    {id: -4, codigo: "CAMPO_PORCENTAJE", nombre: "Porcentaje de Exención", grupo: 'X'},
    {id: -5, codigo: "CAMPO_IMPORTE", nombre: "Importe de Exención", grupo: 'X'},
    {id: -6, codigo: "CAMPO_TASA", nombre: "Código de Tasa", grupo: 'X'},
    {id: -7, codigo: "CAMPO_SUBTASA", nombre: "Código de SubTasa", grupo: 'X'},
    {id: -8, codigo: "CAMPO_RUBRO", nombre: "Código Rubro", grupo: 'X'},
    {id: -9, codigo: "CAMPO_NUMERO", nombre: "Número de Controlador", grupo: 'C'},
    {id: -10, codigo: "CAMPO_TIPO_CARTEL", nombre: "Tipo de Cartel", grupo: 'T'},
    {id: -11, codigo: "CAMPO_TIPO_PROD_PUBLI", nombre: "Tipo Producto Publicitario", grupo: 'T'},
    {id: -12, codigo: "CAMPO_CAT_UBICACION", nombre: "Categoría Ubicación", grupo: 'T'},
    {id: -13, codigo: "CAMPO_CANT_PUBLI", nombre: "Cantidad de Publicidad", grupo: 'T'},
    {id: -14, codigo: "CAMPO_ALTO", nombre: "Alto", grupo: 'T'},
    {id: -15, codigo: "CAMPO_ANCHO", nombre: "Ancho", grupo: 'T'},
    {id: -16, codigo: "CAMPO_SUPERFICIE", nombre: "Superficie", grupo: 'T'}
  ]

  const [toolbar, setToolbar] = useState({
    horizontal: false,
    accordions: {
      funciones: false,
      variables: false,
      calculos: false,
      parametros: false,
      rubros: false,
      elementos: false,
      entidades: false
    }
  });


  const mount = () => {
    setState(prevState => {
      return {...prevState,
        listCalculos: props.data.listCalculos,
        listVariables: props.data.listVariables,
        listFunciones: props.data.listFunciones,
        listParametros: props.data.listParametros,
        listRubros: [
          {id: -1, codigo: "RUBRO_CODIGO", nombre: "Código Rubro"},
          {id: -2, codigo: "RUBRO_ALICUOTA", nombre: "Alicuota"},
          {id: -3, codigo: "RUBRO_MINIMO", nombre: "Mínimo"},
          {id: -4, codigo: "RUBRO_REG_GENERAL", nombre: "Rubro de Régimen General"},
          {id: -5, codigo: "RUBRO_CATEGORIA", nombre: "Cateoría de Rubro"},
          {id: -6, codigo: "RUBRO_AGRUPAMIENTO", nombre: "Agrupamiento de Rubro"},
          {id: -7, codigo: "RUBRO_MINIMO_APLICABLE", nombre: "Aplica Mínimo"},
          {id: -8, codigo: "RUBRO_TIPO_LIQUIDACION", nombre: "Tipo Liquidación"},
          ...props.data.listTiposDeclaracionJurada
        ],
        listEntidades: props.showCarteles ? [
          {id: -1, codigo: "LISTA_CARTELES", nombre: "Carteles", grupo: 'T'},
          {id: -2, codigo: "LISTA_EXENCIONES", nombre: "Exenciones", grupo: 'X'},
          {id: -3, codigo: "LISTA_CONDIC_ESPECIALES", nombre: "Condiciones Especiales", grupo: 'D'},
          {id: -4, codigo: "LISTA_CONTROLADORES", nombre: "Controladores", grupo: 'C'}
        ] : [
          {id: -2, codigo: "LISTA_EXENCIONES", nombre: "Exenciones", grupo: 'X'},
          {id: -3, codigo: "LISTA_CONDIC_ESPECIALES", nombre: "Condiciones Especiales", grupo: 'D'},
          {id: -4, codigo: "LISTA_CONTROLADORES", nombre: "Controladores", grupo: 'C'}
        ],
        listElementos: props.data.listElementos.map(x => { return {...x, grupo: 'E'}})
      };
    });
  }
  useEffect(mount, [props.data]);


  const cellExpanded = ({row}) =>    <div className='action' {...row.getToggleRowExpandedProps()}>
                                <div className="link">
                                  {row.isExpanded ? 
                                    <span className="material-symbols-outlined icon-expanded">expand_more</span> :
                                    <span className="material-symbols-outlined">chevron_right</span>
                                  }
                                </div>
                              </div>

  const cellSF = (props) => <div className='action'>
                                <div onClick={ (event) => handleClickSelectFuncion(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                            </div>
  const tableColumnsFunciones =
  [
    { Header: '', Cell: cellSF, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Código', Cell: (data) =>
      <span title={`${data.row.original.descripcion}. Definición: ${getFunctionDefinition(data.row.original, true)}`}><strong className="input-formula-funcion">{data.row.original.codigo}</strong>: {data.row.original.nombre}</span>,
      accessor: 'codigo', width: '95%' }
  ]

  const cellSP = (props) => <div className='action'>
                                <div onClick={ (event) => handleClickSelectParametro(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                            </div>
  const tableColumnsParametros =
  [
    { Header: '', Cell: cellSP, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Código', Cell: (data) =>
      <span><strong className="input-formula-parametro">{data.row.original.codigo}</strong>: {data.row.original.nombre}</span>,
      accessor: 'codigo', width: '95%' }
  ]

  const cellSV = (props) => <div className='action'>
                                <div onClick={ (event) => handleClickSelectVariable(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                            </div>
  const tableColumnsVariables =
  [
    { Header: '', Cell: cellSV, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Código', Cell: (data) =>
      <span><strong className="input-formula-variable">{data.row.original.codigo}</strong>: {data.row.original.nombre}</span>,
      accessor: 'codigo', width: '95%' }
  ]

  const cellSR = (props) => <div className='action'>
                                <div onClick={ (event) => handleClickSelectRubro(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                            </div>
  const tableColumnsRubros =
  [
    { Header: '', Cell: cellSR, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Código', Cell: (data) =>
      <span><strong className="input-formula-rubro">{data.row.original.codigo}</strong>: {data.row.original.nombre}</span>,
      accessor: 'codigo', width: '95%' }
  ]

  const cellSE = (props) => <div className='action'>
                                <div onClick={ (event) => handleClickSelectElemento(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                            </div>
  const tableColumnsElementos =
  [
    { Header: '', Cell: cellSE, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: '', Cell: cellExpanded, id:'expnader', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Código', Cell: (data) =>
      <span><strong className="input-formula-elemento">{data.row.original.codigo}</strong>: {data.row.original.nombre}</span>,
      accessor: 'codigo', width: '90%' }
  ]

  const cellST = (props) => <div className='action'>
                                <div onClick={ (event) => handleClickSelectEntidad(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                            </div>
  const tableColumnsEntidades =
  [
    { Header: '', Cell: cellST, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: '', Cell: cellExpanded, id:'expnader', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Código', Cell: (data) =>
      <span><strong className="input-formula-elemento">{data.row.original.codigo}</strong>: {data.row.original.nombre}</span>,
      accessor: 'codigo', width: '90%' }
  ]

  const cellSC = (props) => <div className='action'>
                                <div onClick={ (event) => handleClickSelectCalculo(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                            </div>
  const tableColumnsCalculos =
  [
    { Header: '', Cell: cellSC, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Código', Cell: (data) =>
      <span title={data.row.original.descripcion}><strong className="input-formula-calculo">{data.row.original.codigo}</strong>: {data.row.original.nombre}</span>,
      accessor: 'codigo', width: '95%' }
  ]


  const cellSD = (props) => <div className='action'>
                                <div onClick={ (event) => handleClickSelectFields(props.value) } className="link">
                                <span className="material-symbols-outlined" title="Seleccionar">west</span>
                                </div>
                            </div>
  const tableColumnsFields =
  [
    { Header: '', Cell: cellSD, id:'select', accessor: 'id', width: '5%', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Código', Cell: (data) =>
      <span><strong className="input-formula-field">{data.row.original.codigo}</strong>: {data.row.original.nombre}</span>,
      accessor: 'codigo', width: '95%' }
  ]


  //handles
  const handleClickSelectFuncion = (id) => {
    if (props.onSelect) {
      const row = state.listFunciones.find(f => f.id === id);
      const event = {code: 'insert_text', value: getFunctionDefinition(row, false)};
      props.onSelect(event);
    }
  }
  const handleClickSelectParametro = (id) => {
    if (props.onSelect) {
      const row = state.listParametros.find(f => f.id === id);
      const event = {code: 'insert_text', value: row.codigo};
      props.onSelect(event);
    }
  }
  const handleClickSelectVariable = (id) => {
    if (props.onSelect) {
      const row = state.listVariables.find(f => f.id === id);
      const event = {code: 'insert_text', value: row.codigo};
      props.onSelect(event);
    }
  }
  const handleClickSelectRubro = (id) => {
    if (props.onSelect) {
      const row = state.listRubros.find(f => f.id === id);
      const event = {code: 'insert_text', value: row.codigo};
      props.onSelect(event);
    }
  }
  const handleClickSelectElemento = (id) => {
    if (props.onSelect) {
      const row = state.listElementos.find(f => f.id === id);
      const event = {code: 'insert_text', value: row.codigo};
      props.onSelect(event);
    }
  }
  const handleClickSelectEntidad = (id) => {
    if (props.onSelect) {
      const row = state.listEntidades.find(f => f.id === id);
      const event = {code: 'insert_text', value: row.codigo};
      props.onSelect(event);
    }
  }
  const handleClickSelectCalculo = (id) => {
    if (props.onSelect) {
      const row = state.listCalculos.find(f => f.id === id);
      const event = {code: 'insert_text', value: row.codigo};
      props.onSelect(event);
    }
  }
  const handleClickSelectFields = (id) => {
    if (props.onSelect) {
      const row = listFields.find(f => f.id === id);
      const event = {code: 'insert_text', value: row.codigo};
      props.onSelect(event);
    }
  }

  //funciones
  function getFunctionDefinition(row, widthParamName) {
    let paramFuncion = '';
    row.funcionParametros.forEach((param, index) => {
      const delimiter = (index === 0) ? '' : (widthParamName) ? ', ' : ',';
      const value = (widthParamName) ? `${delimiter}${param.codigo} [${GetTipoDato(param.tipoDato)}]` : delimiter;
      paramFuncion += value;
    });
    return `${row.codigo}(${paramFuncion})`;
  }

  function ToogleToolbarHorizontal() {
    const toggleHorizontal = !toolbar.horizontal;
    setToolbar(prevState => {
        return {...prevState, horizontal: toggleHorizontal};
    });
    if (props.onToogleHorizontal) {
      props.onToogleHorizontal(toggleHorizontal);
    }
  }
  function ToggleToolbarAccordion(accordion) {
    let accordions = CloneObject(toolbar.accordions);
    accordions[accordion] = !accordions[accordion];
    setToolbar(prevState => {
        return {...prevState, accordions: accordions};
    });
  }

  const accordionClose = <span className="material-symbols-outlined search-i">chevron_right</span>
  const accordionOpen = <span className="material-symbols-outlined search-i">expand_more</span>


  const subComponentFields = ({row}) => {
    return (

    <div className='form-sub-component'>
      <div className='row'>
        <TableCustom
            showDownloadCSV={false}
            showHeader={false}
            showFilterGlobal={false}
            showPageSize={false}
            showPageCountOnlyPage={false}
            className={'TableCustomBase'}
            columns={tableColumnsFields}
            data={listFields.filter(f => f.grupo.includes(row.original.grupo))}
        />
      </div>
    </div>

  );
    }

  return (

    <div id="panel-toolbar" className={(toolbar.horizontal) ? "col-12 panel-horizontal" : "col-12 col-lg-4 panel-vertical"}>

      <div className="action">
        <label className="form-label">Asistente de fórmulas</label>
        <div onClick={ (event) => ToogleToolbarHorizontal() } className="link float-end">
           {// <i className={(toolbar.horizontal) ? "fas fa-grip-vertical" : "fas fa-grip-horizontal"}
            //  title={(toolbar.horizontal) ? "cambiar a modo vertical" : "cambiar a modo horizontal"}></i>
          }
              {(toolbar.horizontal) ? 
              <span className= "material-symbols-outlined" title="Cambiar a modo vertical">vertical_split</span> :
              <span className="material-symbols-outlined" title="Cambiar a modo horizontal">horizontal_split</span>
              }
        </div>
      </div>

      {props.showFunciones &&
      <div className='accordion-header'>
          <div className='row'>
              <div className="col-12" onClick={() => ToggleToolbarAccordion('funciones')}>
                  <div className='accordion-header-title'>
                      {(toolbar.accordions.funciones) ? accordionOpen : accordionClose}
                      <h3 className={toolbar.accordions.funciones ? 'active' : ''}>Funciones</h3>
                  </div>
              </div>
          </div>
      </div>
      }
      {props.showFunciones && toolbar.accordions.funciones &&
      <div className='accordion-body'>
        <TableCustom
            showDownloadCSV={false}
            showHeader={false}
            showFilterGlobal={true}
            showPagination={true}
            showPageSize={false}
            showPageCountOnlyPage={true}
            className={'TableCustomBase'}
            columns={tableColumnsFunciones}
            data={state.listFunciones}
            messageEmpty="No se encontraron funciones"
        />
      </div>
      }

      {props.showParametros &&
      <div className='accordion-header m-top-10'>
          <div className='row'>
              <div className="col-12" onClick={() => ToggleToolbarAccordion('parametros')}>
                  <div className='accordion-header-title'>
                      {(toolbar.accordions.parametros) ? accordionOpen : accordionClose}
                      <h3 className={toolbar.accordions.parametros ? 'active' : ''}>Parámetros</h3>
                  </div>
              </div>
          </div>
      </div>
      }
      {props.showParametros && toolbar.accordions.parametros &&
      <div className='accordion-body'>
        <TableCustom
            showDownloadCSV={false}
            showHeader={false}
            showFilterGlobal={true}
            showPagination={true}
            showPageSize={false}
            showPageCountOnlyPage={true}
            className={'TableCustomBase'}
            columns={tableColumnsParametros}
            data={state.listParametros}
            messageEmpty="No se encontraron parámetros"
        />
      </div>
      }

      {props.showVariables &&
      <div className='accordion-header m-top-10'>
          <div className='row'>
              <div className="col-12" onClick={() => ToggleToolbarAccordion('variables')}>
                  <div className='accordion-header-title'>
                      {(toolbar.accordions.variables) ? accordionOpen : accordionClose}
                      <h3 className={toolbar.accordions.variables ? 'active' : ''}>Variables</h3>
                  </div>
              </div>
          </div>
      </div>
      }
      {props.showVariables && toolbar.accordions.variables &&
      <div className='accordion-body'>
        <TableCustom
            showDownloadCSV={false}
            showHeader={false}
            showFilterGlobal={true}
            showPagination={true}
            showPageSize={false}
            showPageCountOnlyPage={true}
            className={'TableCustomBase'}
            columns={tableColumnsVariables}
            data={state.listVariables}
            messageEmpty="No se encontraron variables"
        />
      </div>
      }

      {props.showRubros &&
      <div className='accordion-header m-top-10'>
          <div className='row'>
              <div className="col-12" onClick={() => ToggleToolbarAccordion('rubros')}>
                  <div className='accordion-header-title'>
                      {(toolbar.accordions.rubros) ? accordionOpen : accordionClose}
                      <h3 className={toolbar.accordions.rubros ? 'active' : ''}>Datos por Rubro</h3>
                  </div>
              </div>
          </div>
      </div>
      }
      {props.showRubros && toolbar.accordions.rubros &&
      <div className='accordion-body'>
        <TableCustom
            showDownloadCSV={false}
            showHeader={false}
            showFilterGlobal={true}
            showPagination={true}
            showPageSize={false}
            showPageCountOnlyPage={true}
            className={'TableCustomBase'}
            columns={tableColumnsRubros}
            data={state.listRubros}
            messageEmpty="No se encontraron datos por rubro"
        />
      </div>
      }

      {props.showElementos &&
      <div className='accordion-header m-top-10'>
          <div className='row'>
              <div className="col-12" onClick={() => ToggleToolbarAccordion('elementos')}>
                  <div className='accordion-header-title'>
                      {(toolbar.accordions.elementos) ? accordionOpen : accordionClose}
                      <h3 className={toolbar.accordions.elementos ? 'active' : ''}>Lista de Elementos</h3>
                  </div>
              </div>
          </div>
      </div>
      }
      {props.showElementos && toolbar.accordions.elementos &&
      <div className='accordion-body'>
        <TableCustom
            showDownloadCSV={false}
            showHeader={false}
            showFilterGlobal={true}
            showPagination={true}
            showPageSize={false}
            showPageCountOnlyPage={true}
            className={'TableCustomBase'}
            columns={tableColumnsElementos}
            data={state.listElementos}
            messageEmpty="No se encontraron elementos"
            subComponent={subComponentFields}
        />
      </div>
      }

      {props.showEntidades &&
      <div className='accordion-header m-top-10'>
          <div className='row'>
              <div className="col-12" onClick={() => ToggleToolbarAccordion('entidades')}>
                  <div className='accordion-header-title'>
                      {(toolbar.accordions.entidades) ? accordionOpen : accordionClose}
                      <h3 className={toolbar.accordions.entidades ? 'active' : ''}>Lista de Entidades</h3>
                  </div>
              </div>
          </div>
      </div>
      }
      {props.showEntidades && toolbar.accordions.entidades &&
      <div className='accordion-body'>
        <TableCustom
            showDownloadCSV={false}
            showHeader={false}
            showFilterGlobal={true}
            showPagination={true}
            showPageSize={false}
            showPageCountOnlyPage={true}
            className={'TableCustomBase'}
            columns={tableColumnsEntidades}
            data={state.listEntidades}
            messageEmpty="No se encontraron entidades"
            subComponent={subComponentFields}
        />
      </div>
      }

      {props.showCalculo &&
      <div className='accordion-header m-top-10'>
          <div className='row'>
              <div className="col-12" onClick={() => ToggleToolbarAccordion('calculos')}>
                  <div className='accordion-header-title'>
                      {(toolbar.accordions.calculos) ? accordionOpen : accordionClose}
                      <h3 className={toolbar.accordions.calculos ? 'active' : ''}>Cálculos</h3>
                  </div>
              </div>
          </div>
      </div>
      }
      {props.showCalculo && toolbar.accordions.calculos &&
      <div className='accordion-body'>
        <TableCustom
            showDownloadCSV={false}
            showHeader={false}
            showFilterGlobal={true}
            showPagination={true}
            showPageSize={false}
            showPageCountOnlyPage={true}
            className={'TableCustomBase'}
            columns={tableColumnsCalculos}
            data={state.listCalculos}
            messageEmpty="No se encontraron cálculos"
        />
      </div>
      }

    </div>

  );
}

ToolbarFormula.propTypes = {
  data: object.isRequired,
  showFunciones: bool,
  showParametros: bool,
  showVariables: bool,
  showCalculo: bool,
  showRubros: bool,
  showCarteles: bool,
  showElementos: bool,
  showEntidades: bool,
  onToogleHorizontal: func,
  onSelect: func
};

ToolbarFormula.defaultProps = {
  showFunciones: true,
  showParametros: true,
  showVariables: true,
  showCalculo: true,
  showRubros: false,
  showCarteles: false,
  showElementos: true,
  showEntidades: true,
  onToogleHorizontal: null,
  onSelect:  null
};

export default ToolbarFormula;