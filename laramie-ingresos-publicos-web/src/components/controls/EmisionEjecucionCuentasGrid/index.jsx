import React, { useState, useEffect } from 'react';
import { object, func, bool } from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';
import { TableCustom, MessageModal, InputCuenta, Loading } from '../../common';
import ShowToastMessage from '../../../utils/toast';
import { ALERT_TYPE } from '../../../consts/alertType';
import { APIS } from '../../../config/apis';
import { REQUEST_METHOD } from '../../../consts/requestMethodType';
import { ServerRequest } from '../../../utils/apiweb';
import { useLista } from '../../hooks/useLista';
import { useEntidad } from '../../hooks/useEntidad';
import { useForm } from '../../hooks/useForm';
import { EMISION_EJECUCION_CUENTA_STATE } from '../../../consts/emisionEjecucionCuentaState';
import { getFormatNumber } from '../../../utils/convert';
import { isValidNumber } from '../../../utils/validator';


const EmisionEjecucionCuentasGrid = (props) => {

  const resultInit = {
    cuenta: {
      id: 0,
      numeroCuenta: '',
      numeroWeb: '',
      idEstadoCuenta: 0,
      idTipoTributo: 0,
      idTributo: 0,
      fechaAlta: null,
      fechaBaja: null
    },
    emisionEjecucionCuenta: {
      id: 0,
      idEmisionEjecucion: 0,
      idCuenta: 0,
      idEstadoEmisionEjecucionCuenta: 0,
      numeroBloque: 0,
      numero: 0,
      observacion: '',
      emisionCalculosResultado: []
    },
    emisionCalculos: []
  }

  //hooks
  const [state, setState] = useState({
      idCuenta: 0,
      emisionEjecucion: null,
      disabled: false,
      showMessage: false,
      loading: false,
      tabActive: "conceptos"
  });
  const [result, setResult] = useState(resultInit);

  const [ formValues, formHandle, , formSet] = useForm({
    numero: 0,
    idCuenta: 0
  });

  const mount = () => {
    if (props.data.emisionEjecucion) {
      setState(prevState => {
        return {...prevState,
          idCuenta: props.data.idCuenta,
          emisionEjecucion: props.data.emisionEjecucion
        };
      });
    }
    CleanEmisionEjecucionCuenta();
  }
  useEffect(mount, [props.data.emisionEjecucion]);

  useEffect(() => {
    if (state.idCuenta > 0) {
      FindEmisionEjecucionCuenta(state.emisionEjecucion.id, null, state.idCuenta);
    }
  }, [state.idCuenta]);

  const [, getRowLista] = useLista({
    listas: ['TipoEmisionCalculo'],
    onLoaded: (listas, isSuccess, error) => {
        if (!isSuccess) {
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
        }
    },
    memo: {
      key: 'TipoEmisionCalculo',
      timeout: 0
    }
  });

  const [, getRowEntidad] = useEntidad({
    entidades: ['Tasa', 'SubTasa'],
    onLoaded: (entidades, isSuccess, error) => {
      if (!isSuccess) {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: 'Tasa_SubTasa',
      timeout: 0
    }
  });

  const tableColumnsCalculos = [
      { Header: 'Cuota', accessor: 'cuota', width: '15%', disableSortBy: true },
      { Header: 'Tipo', accessor: 'tipo', width: '20%', disableSortBy: true },
      { Header: 'Cálculo', accessor: 'calculo', width: '45%', disableSortBy: true },
      { Header: 'Valor', Cell: (data) => isValidNumber(data.value) ? getFormatNumber(data.value, 2) : data.value, accessor: 'valor', width: '20%', alignCell: 'right', disableGlobalFilter: true, disableSortBy: true },
  ];
  const tableColumnsConceptos = [
      { Header: 'Recibo', Cell: (props) => {
          if (result && result.emisionEjecucionCuenta) {
            const row = props.row.original;
            const emisionEjecucionCuota = result.emisionEjecucionCuenta.emisionEjecucionCuotas.find(f => f.idEmisionCuota === row.idEmisionCuota);
            return emisionEjecucionCuota.numeroRecibo;
          }
          else {
            return '';
          }
        }, id: 'recibo', accessor: 'id', width: '10%', disableSortBy: true },
      { Header: 'Item', accessor: 'item', width: '30%', disableSortBy: true },
      { Header: 'Periodo', accessor: 'periodo', width: '9%', disableSortBy: true },
      { Header: 'Cuota', accessor: 'cuota', width: '8%', disableSortBy: true },
      { Header: 'Tasa', accessor: 'tasa', width: '8%', disableSortBy: true },
      { Header: 'Sub tasa', accessor: 'subTasa', width: '10%', disableSortBy: true },
      { Header: 'Importe', Cell: (data) => isValidNumber(data.value) ? getFormatNumber(data.value, 2) : data.value, accessor: 'valorImporteTotal', width: '10%', alignCell: 'right', disableGlobalFilter: true, disableSortBy: true },
      { Header: 'A cancelar', Cell: (data) => isValidNumber(data.value) ? getFormatNumber(data.value, 2) : data.value, accessor: 'valorImporteNeto', width: '10%', alignCell: 'right', disableGlobalFilter: true, disableSortBy: true },
      { Header: 'Vto.', accessor: 'vencimiento', width: '5%', disableSortBy: true }
  ];
  const tableColumnsCuentasCorrientes = [
    { Header: 'Item', accessor: 'item', width: '35%', disableSortBy: true },
    { Header: 'Periodo', accessor: 'periodo', width: '10%', disableSortBy: true },
    { Header: 'Cuota', accessor: 'cuota', width: '10%', disableSortBy: true },
    { Header: 'Tasa', accessor: 'tasa', width: '10%', disableSortBy: true },
    { Header: 'Sub tasa', accessor: 'subTasa', width: '10%', disableSortBy: true },
    { Header: 'Debe', Cell: (data) => isValidNumber(data.value) ? getFormatNumber(data.value, 2) : data.value, accessor: 'valorDebe', width: '10%', alignCell: 'right', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Haber', Cell: (data) => isValidNumber(data.value) ? getFormatNumber(data.value, 2) : data.value, accessor: 'valorHaber', width: '10%', alignCell: 'right', disableGlobalFilter: true, disableSortBy: true },
    { Header: 'Vto.', accessor: 'vencimiento', width: '5%', disableSortBy: true }
  ];
  const tableColumnsImputacionesContables = [
    { Header: 'Item', accessor: 'item', width: '30%', disableSortBy: true },
    { Header: 'Periodo', accessor: 'periodo', width: '9%', disableSortBy: true },
    { Header: 'Cuota', accessor: 'cuota', width: '10%', disableSortBy: true },
    { Header: 'Tasa', accessor: 'tasa', width: '9%', disableSortBy: true },
    { Header: 'Sub tasa', accessor: 'subTasa', width: '9%', disableSortBy: true },
    { Header: 'Tasa %', accessor: 'tasaPorcentaje', width: '9%', disableSortBy: true },
    { Header: 'Sub tasa %', accessor: 'subTasaPorcentaje', width: '9%', disableSortBy: true },
    { Header: 'Porcentaje', Cell: (data) => isValidNumber(data.value) ? getFormatNumber(data.value, 2) : data.value, accessor: 'valorPorcentaje', alignCell: 'right', width: '10%', disableGlobalFilter: true, disableSortBy: true }
  ]; 

  //handles
  const handleClickEmisionEjecucionCuentaPrevious = () => {
    FindEmisionEjecucionCuenta(state.emisionEjecucion.id, formValues.numero - 1, null);
  }
  const handleClickEmisionEjecucionCuentaNext = () => {
    FindEmisionEjecucionCuenta(state.emisionEjecucion.id, formValues.numero + 1, null);
  }

  //callbacks
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
  const callbackSuccessFindEmisionEjecucionCuenta = (response) => {
      response.json()
      .then((data) => {

        //if (data.emisionEjecucionCuenta.numero > 0 && data.emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta === EMISION_EJECUCION_CUENTA_STATE.FINALIZADA) {
        if (data.emisionEjecucionCuenta.numero > 0) {

          const sortResult = (a, b) => {
            if (a.ordenCuota < b.ordenCuota) return -1;
            else if (a.ordenCuota > b.ordenCuota) return 1;
            else if (a.ordenCuota === b.ordenCuota && a.orden < b.orden) return -1;
            else if (a.ordenCuota === b.ordenCuota && a.orden > b.orden) return 1;
            else return 0;
          };

          //calculos ordenados por el orden de la cuota y luego el orden de calculos
          data.emisionEjecucionCuenta.emisionCalculosResultado.forEach((row) => {
            const emisionCuota = data.emisionCuotas.find(f => f.id === row.idEmisionCuota);
            const emisionCalculo = data.emisionCalculos.find(f => f.id === row.idEmisionCalculo);
            const tipoEmisionCalculo = getRowLista('TipoEmisionCalculo', emisionCalculo.idTipoEmisionCalculo);
            row.cuota = emisionCuota.descripcion;
            row.ordenCuota = emisionCuota.orden;
            row.calculo = emisionCalculo.nombre;
            row.orden = emisionCalculo.orden;
            row.tipo = tipoEmisionCalculo.nombre;
          });
          data.emisionEjecucionCuenta.emisionCalculosResultado = data.emisionEjecucionCuenta.emisionCalculosResultado.sort(sortResult);

          //conceptos ordenados por el orden de la cuota y luego el orden de conceptos
          data.emisionEjecucionCuenta.emisionConceptosResultado.forEach((row) => {
            const emisionCuota = data.emisionCuotas.find(f => f.id === row.idEmisionCuota);
            const emisionConcepto = data.emisionConceptos.find(f => f.id === row.idEmisionConcepto);
            const tasa = getRowEntidad('Tasa', emisionConcepto.idTasa);
            const subTasa = getRowEntidad('SubTasa', emisionConcepto.idSubTasa);
            row.cuota = emisionCuota.descripcion;
            row.ordenCuota = emisionCuota.orden;
            row.item = emisionConcepto.descripcion;
            row.orden = emisionConcepto.orden;
            row.periodo = state.emisionEjecucion.periodo;
            row.vencimiento = emisionConcepto.vencimiento;
            row.tasa = tasa.codigo;
            row.subTasa = subTasa.codigo;
          });
          data.emisionEjecucionCuenta.emisionConceptosResultado = data.emisionEjecucionCuenta.emisionConceptosResultado.sort(sortResult);

          //cta cte ordenados por el orden de la cuota y luego el orden de cta cte
          data.emisionEjecucionCuenta.emisionCuentasCorrientesResultado.forEach((row) => {
            const emisionCuota = data.emisionCuotas.find(f => f.id === row.idEmisionCuota);
            const emisionCuentaCorriente = data.emisionCuentasCorrientes.find(f => f.id === row.idEmisionCuentaCorriente);
            const tasa = getRowEntidad('Tasa', emisionCuentaCorriente.idTasa);
            const subTasa = getRowEntidad('SubTasa', emisionCuentaCorriente.idSubTasa);
            row.cuota = emisionCuota.descripcion;
            row.ordenCuota = emisionCuota.orden;
            row.item = emisionCuentaCorriente.descripcion;
            row.orden = emisionCuentaCorriente.orden;
            row.periodo = state.emisionEjecucion.periodo;
            row.vencimiento = emisionCuentaCorriente.vencimiento;
            row.tasa = tasa.codigo;
            row.subTasa = subTasa.codigo;
          });
          data.emisionEjecucionCuenta.emisionCuentasCorrientesResultado = data.emisionEjecucionCuenta.emisionCuentasCorrientesResultado.sort(sortResult);

          //imp cont ordenados por el orden de la cuota y luego el orden de imp cont
          data.emisionEjecucionCuenta.emisionImputacionesContablesResultado.forEach((row) => {
            const emisionCuota = data.emisionCuotas.find(f => f.id === row.idEmisionCuota);
            const emisionImputacionContable = data.emisionImputacionesContables.find(f => f.id === row.idEmisionImputacionContable);
            const tasa = getRowEntidad('Tasa', emisionImputacionContable.idTasa);
            const subTasa = getRowEntidad('SubTasa', emisionImputacionContable.idSubTasa);
            const tasaPorcentaje = getRowEntidad('Tasa', emisionImputacionContable.idTasaPorcentaje);
            const subTasaPorcentaje = getRowEntidad('SubTasa', emisionImputacionContable.idSubTasaPorcentaje);
            row.cuota = emisionCuota.descripcion;
            row.ordenCuota = emisionCuota.orden;
            row.item = emisionImputacionContable.descripcion;
            row.orden = emisionImputacionContable.orden;
            row.periodo = state.emisionEjecucion.periodo;
            row.tasa = tasa.codigo;
            row.subTasa = subTasa.codigo;
            row.tasaPorcentaje = tasaPorcentaje.codigo;
            row.subTasaPorcentaje = subTasaPorcentaje.codigo;
          });
          data.emisionEjecucionCuenta.emisionImputacionesContablesResultado = data.emisionEjecucionCuenta.emisionImputacionesContablesResultado.sort(sortResult);

          setResult(data);
          formSet({
            numero: data.emisionEjecucionCuenta.numero,
            idCuenta: data.cuenta.id
          });
          setState(prevState => {
            return {...prevState, loading: false};
          });
        }
        else {
          CleanEmisionEjecucionCuenta();
          if (data.emisionEjecucionCuenta.numero === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, "No hay datos para mostrar");
          }
          setState(prevState => {
            return {...prevState, loading: false};
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
  }

  //funciones
  function CleanEmisionEjecucionCuenta() {
    setResult(resultInit);
    formSet({
      numero: 0,
      idCuenta: 0
    });
  }
  function FindEmisionEjecucionCuenta(idEmisionEjecucion, numero, idCuenta) {

    setState(prevState => {
      return {...prevState, loading: true};
    });

    const paramsUrl = (numero) ? `/numero/${idEmisionEjecucion}/${numero}` : `/cuenta/${idEmisionEjecucion}/${idCuenta}`;

    ServerRequest(
        REQUEST_METHOD.GET,
        null,
        true,
        APIS.URLS.EMISION_EJECUCION_CUENTA,
        paramsUrl,
        null,
        callbackSuccessFindEmisionEjecucionCuenta,
        callbackNoSuccess,
        callbackError
    );

  }

  function ExecuteEmisionEjecucionCuenta() {
    // props.onChange('ExecuteEmisionEjecucionCuenta', state.idCuenta);
  }


  function SetTabActive(tab) {
    setState(prevState => {
        return {...prevState, tabActive: tab};
    });
  }

  return (
  <>

    <Loading visible={state.loading}></Loading>

    {state.showMessage && 
        <MessageModal
            title={"Confirmación"}
            message={"¿Está seguro de volver a ejecutar la cuenta?"}
            onDismiss={() => {
              setState(prevState => {
                  return {...prevState, showMessage: false};
              });
            }}
            onConfirm={() => {
              setState(prevState => {
                  return {...prevState, showMessage: false};
              });
              ExecuteEmisionEjecucionCuenta();
            }}
        />
    }

    <div className='row'>

      <div className="col-12 col-lg-8">

        <div className='row form-basic m-bottom-10'>
          {state.idCuenta === 0 &&
          <>
          <div className="col-12 col-md-6">
              <label htmlFor="numeroCuenta" className="form-label">Cuenta</label>
              <InputCuenta
                  name="idCuenta"
                  placeholder=""
                  className="form-control"
                  value={formValues.idCuenta}
                  idTipoTributo={result.cuenta.idTipoTributo}
                  onChange={(event) => {
                      const {target} = event;
                      if (target.value > 0) {
                        const idCuenta = target.value;
                        FindEmisionEjecucionCuenta(state.emisionEjecucion.id, null, idCuenta);
                      }
                      formHandle(event);
                  }}
                  disabled={false}
              />
          </div>
          <div className="col-12 col-md-6">
            <button className="btn back-button no-m-horizontal m-left-20 m-top-27 float-end" data-dismiss="modal" onClick={ (event) => handleClickEmisionEjecucionCuentaNext() }>Siguiente</button>
            {(formValues.numero > 1) &&
            <button className="btn back-button no-m-horizontal m-top-27 float-end" data-dismiss="modal" onClick={ (event) => handleClickEmisionEjecucionCuentaPrevious() }>Anterior</button>
            }
          </div>
          </>
          }
          {result.emisionEjecucionCuenta.observacion.length > 0 &&
          <div className="col-12">
              <input
                  name="observacion"
                  type="text"
                  placeholder=""
                  maxLength={250}
                  className="form-control"
                  value={ result.emisionEjecucionCuenta.observacion }
                  disabled={true}
              />
          </div>
          }
        </div>

        <TableCustom
            showFilterGlobal={false}
            showPagination={false}
            className={'TableCustomBase'}
            columns={tableColumnsCalculos}
            data={result.emisionEjecucionCuenta.emisionCalculosResultado}
        />

      </div>
      <div className="col-12">

        <Tabs
            id="tabs-emision-ejecucion"
            activeKey={state.tabActive}
            className="m-top-20"
            onSelect={(tab) => SetTabActive(tab)}
        >
            <Tab eventKey="conceptos" title="Items/Conceptos">
                <div className='tab-panel'>

                    <TableCustom
                        showFilterGlobal={false}
                        showPagination={false}
                        className={'TableCustomBase'}
                        columns={tableColumnsConceptos}
                        data={result.emisionEjecucionCuenta.emisionConceptosResultado}
                    />

                </div>
            </Tab>
            <Tab eventKey="ctacte" title="Cuenta Corriente">
                <div className='tab-panel'>

                    <TableCustom
                        showFilterGlobal={false}
                        showPagination={false}
                        className={'TableCustomBase'}
                        columns={tableColumnsCuentasCorrientes}
                        data={result.emisionEjecucionCuenta.emisionCuentasCorrientesResultado}
                    />

                </div>
            </Tab>
            <Tab eventKey="contabilidad" title="Imputación contable">
                <div className='tab-panel'>

                    <TableCustom
                        showFilterGlobal={false}
                        showPagination={false}
                        className={'TableCustomBase'}
                        columns={tableColumnsImputacionesContables}
                        data={result.emisionEjecucionCuenta.emisionImputacionesContablesResultado}
                    />

                </div>
            </Tab>
        </Tabs>

      </div>

    </div>

  </>
  );
}

EmisionEjecucionCuentasGrid.propTypes = {
  disabled: bool,
  data: object.isRequired,
  onChange: func.isRequired
};

EmisionEjecucionCuentasGrid.defaultProps = {
  disabled: false
};

export default EmisionEjecucionCuentasGrid;