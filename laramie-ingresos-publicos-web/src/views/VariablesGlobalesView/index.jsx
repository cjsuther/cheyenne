import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sequenceActionNext } from "../../context/redux/actions/sequenceAction";
import { TableCustom, Loading, SectionHeading, AdvancedSearch, InputLista} from "../../components/common";
import { ALERT_TYPE } from "../../consts/alertType";
import { useEntidad } from "../../components/hooks/useEntidad";
import { useForm } from "../../components/hooks/useForm";
import VariableGlobalModal from "../../components/controls/VariableGlobalModal";
import VariableModal from "../../components/controls/VariableModal";
import VariablesGlobalGrid from "../../components/controls/VariablesGlobalGrid";
import EntidadesModal from "../../components/controls/EntidadesModal";
import ShowToastMessage from "../../utils/toast";
import { getDateNow, getFormatValueGrid } from "../../utils/convert";
import { ServerRequest } from "../../utils/apiweb";
import { REQUEST_METHOD } from "../../consts/requestMethodType";
import { APIS } from "../../config/apis";
import { isNull } from "../../utils/validator";

function VariablesGlobalesView() {
  //hooks
  const [state, setState] = useState({
    loading: false,
    showMessage: false,
    showForm: false,
    showVariables: false,
    showFormVariableGlobalModal: false,
    showFormVariableModal: false,
		rowFormVariableGlobal: null,
		rowIdVariable: null,
    modeFormEdit: false,
    rowId: 0,
    listVariable: [],
    listVariableGlobal: [],
  });

  const [filters, setFilters] = useState({
    labels: [
      {
        title: "Código / Descripción",
        field: "codigo",
        value: "",
        valueIgnore: "",
      },
      { title: "Activo", field: "activo", value: "", valueIgnore: "" },
    ],
  });

  const [formValues, formHandle, , formSet] = useForm({
    codigo: "",
    activo: "",
  });

  const dispatch = useDispatch();
  const sequenceValue = useSelector((state) => state.sequence.value);

  const [getListEntidad] = useEntidad({
    entidades: ["Variable"],
    onLoaded: (entidades, isSuccess, error) => {
      if (isSuccess) {
        SearchVariablesGlobales();
        const list = getListEntidad("Variable").filter((x) => x.global);
        setState((prevState) => ({ ...prevState, listVariable: list }));
      } else {
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, error);
      }
    },
    memo: {
      key: "Variable",
      timeout: 0,
    },
  });

  let listVariableVisible = useMemo(() => {
    if (state.listVariableGlobal && state.listVariableGlobal.length !== 0) {
      const listVariableId = state.listVariableGlobal.map( x => x.idVariable);
      const listVisible = state.listVariable.filter(f => f.predefinido || listVariableId.includes(f.id));
      return listVisible;
    }
  }, [state.listVariableGlobal, state.listVariable]);

  const getVariableValor = (id) => {
    const today = getDateNow();
    let currentValue = "";
    if (state.listVariableGlobal.length > 0) {
      const listVariableGlobalXVariable = state.listVariableGlobal.filter(f => f.idVariable === id);
      const currentRow = listVariableGlobalXVariable.find( x =>
          (x.fechaDesde <= today || isNull(x.fechaDesde)) &&
          (x.fechaHasta >= today || isNull(x.fechaHasta))
      );
      if (!isNull(currentRow)) {
        const variable = state.listVariable.find(f => f.id === id);
        if (variable) {
          currentValue = getFormatValueGrid(currentRow.valor, variable.tipoDato, true);
        }
      }
    }
    return currentValue;
  };

  // Table definition
  const cellA = (data) => (
    <div className="action">
      <div onClick={(event) => handleClickVariableAdd()} className="link">
        <i className="fa fa-plus" title="nuevo"></i>
      </div>
    </div>
  );

  const cellV = (data) => (
    <div className="action">
      <div
        onClick={(event) => handleClickVariableView(data.value)}
        className="link"
      >
        <i className="fa fa-search" title="ver"></i>
      </div>
    </div>
  );

  const cellE = ({ row }) => (
    <div
      className="action"
      {...row.getToggleRowExpandedProps({ title: "ver historial de cambios" })}
    >
      <div className="link">
        {row.isExpanded ? (
          <i className="fa fa-angle-down icon-expanded"></i>
        ) : (
          <i className="fa fa-angle-right"></i>
        )}
      </div>
    </div>
  );

  const tableColumns = [
    {
      Header: "", Cell: cellE, id: "expander", width: "2%", disableGlobalFilter: true, disableSortBy: true},
    { Header: "Código", accessor: "codigo", width: "15%" },
    { Header: "Descripción", accessor: "descripcion", width: "30%" },
    {
      Header: "Valor actual", Cell: (props) => {
        const row = props.row.original;
        const valorActual = getVariableValor(row.id);
        return valorActual;
      }, id: "valorActual", accessor: "id", width: "20%"},
    {
      Header: "Activo", Cell: (props) => {
        const row = props.row.original;
        return row.activo ? "Sí" : "No";
      }, id: "activo", accessor: "id", width: "10%"},
    {
      Header: cellA, Cell: cellV, id: "abm", accessor: "id", width: "8%",  disableGlobalFilter: true, disableSortBy: true },
  ];

  const subComponent = ({ row }) => (
    <div className="form-sub-component">
      <div className="row">
        <div className="col-12 col-lg-8 p-top-10">
          <label className="form-label">Historial de cambios</label>
          <VariablesGlobalGrid
						disabled={!row.original.activo}
						data={{
							idVariable: row.original.id,
							list: state.listVariableGlobal.filter(f => f.idVariable === row.original.id)
						}}
						onChange={row => {
							ActionVariableGlobal(row);
						}}
					/>
        </div>
      </div>
    </div>
  );

  //handles
  const handleClickVariableAdd = () => {
    setState((prevState) => {
      return { ...prevState, showVariables: true };
    });
  };

  const handleClickVariableView = (id) => {
    setState((prevState) => {
      return {...prevState, showFormVariableModal: true, rowIdVariable: parseInt(id)};
    });
  };

  const handleClickVariableGlobalAdd = (idVariable) => {
    const idTemporal = -1 * sequenceValue; //los registros temporales tienen id negativa
    setState((prevState) => {
      const rowFormVariableGlobal = {
        id: idTemporal,
        idVariable: idVariable,
        valor: "",
        fechaDesde: null,
        fechaHasta: null,
      };
      return {
        ...prevState,
        showVariables: false,
        showFormVariableGlobalModal: true,
        rowFormVariableGlobal: rowFormVariableGlobal,
      };
    });
    dispatch(sequenceActionNext());
  };

  //callbacks
  const callbackNoSuccess = (response) => {
    response
      .json()
      .then((error) => {
        const message = error.message;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState((prevState) => {
          return { ...prevState, loading: false };
        });
      })
      .catch((error) => {
        const message = "Error procesando respuesta: " + error;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
        setState((prevState) => {
          return { ...prevState, loading: false };
        });
      });
  };

  const callbackError = (error) => {
    const message = "Error procesando solicitud: " + error.message;
    ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
    setState((prevState) => {
      return { ...prevState, loading: false };
    });
  };

  //funciones

  function SearchVariables(filterFunc = null) {
    setState((prevState) => {
      return { ...prevState, loading: true, listVariable: [] };
    });

    const callbackSuccess = (response) => {
      response.json()
        .then((data) => {
					let list = filterFunc ? filterFunc(data) : data;
					list = list.filter(x => x.global);
          setState((prevState) => {
            return { ...prevState, loading: false, listVariable: list };
          });
        })
        .catch((error) => {
          const message = "Error procesando respuesta: " + error;
          ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
          setState((prevState) => {
            return { ...prevState, loading: false };
          });
        });
    };

    ServerRequest(
      REQUEST_METHOD.GET,
      null,
      true,
      APIS.URLS.VARIABLE,
      null,
      null,
      callbackSuccess,
      callbackNoSuccess,
      callbackError
    );
  }

  function SearchVariablesGlobales() {
    setState((prevState) => {
      return { ...prevState, loading: true, listVariableGlobal: [] };
    });

    const callbackSuccess = (response) => {
      response.json()
        .then((data) => {
					const list = data.map(x => {
						x.fechaDesde = x.fechaDesde ? new Date(x.fechaDesde) : null;
						x.fechaHasta = x.fechaHasta ? new Date(x.fechaHasta) : null;
						return x;
					});
          setState((prevState) => {
            return { ...prevState, loading: false, listVariableGlobal: data };
          });
        })
        .catch((error) => {
          const message = "Error procesando respuesta: " + error;
          ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
          setState((prevState) => {
            return { ...prevState, loading: false };
          });
        });
    };

    ServerRequest(
      REQUEST_METHOD.GET,
      null,
      true,
      APIS.URLS.VARIABLE_GLOBAL,
      null,
      null,
      callbackSuccess,
      callbackNoSuccess,
      callbackError
    );
  }

	function ActionVariableGlobal(row) {
		const action = row.state;
		delete row.state;
		switch (action) {
			case 'a':
				AddVariableGlobal(row);
				break;
			case 'm':
				ModifyVariableGlobal(row);
				break;
			case 'r':
				RemoveVariableGlobal(row);
				break;
		}
	}

  function AddVariableGlobal(row) {
    const method = REQUEST_METHOD.POST;
    const paramsUrl = null;
    SaveVariableGlobal(method, paramsUrl, row);
  }

  function ModifyVariableGlobal(row) {
    const method = REQUEST_METHOD.PUT;
    const paramsUrl = `/${row.id}`;
    SaveVariableGlobal(method, paramsUrl, row);
  }

	function RemoveVariableGlobal(row) {
    const method = REQUEST_METHOD.DELETE;
    const paramsUrl = `/${row.id}`;
    SaveVariableGlobal(method, paramsUrl);
  }

  function SaveVariableGlobal(method, paramsUrl, dataBody = null) {
    setState((prevState) => {
      return { ...prevState, loading: true };
    });

    const callbackSuccess = (response) => {
      response.json().then((row) => {
				SearchVariablesGlobales();
				setState((prevState) => {
          return { ...prevState, loading: false };
        });
      })
      .catch((error) => {
        const message = "Error procesando respuesta: " + error;
        ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
 		    setState((prevState) => {
          return { ...prevState, loading: false };
        });
      });
    };

    ServerRequest(
      method,
      null,
      true,
      APIS.URLS.VARIABLE_GLOBAL,
      paramsUrl,
      dataBody,
      callbackSuccess,
      callbackNoSuccess,
      callbackError
    );
  }

  function ValidateVariableGlobal(row) {
    const listOthers = state.listVariableGlobal.filter( f => f.idVariable === row.idVariable && f.id !== row.id
    );

    const conflicts = listOthers.filter( f =>
        (f.fechaDesde <= row.fechaHasta || isNull(f.fechaDesde) || isNull(row.fechaHasta)) &&
        (f.fechaHasta >= row.fechaDesde || isNull(f.fechaHasta) || isNull(row.fechaDesde))
    );

    return conflicts.length === 0;
  }

  function ApplyFilters() {
    SearchVariables(FilterVariables);
    UpdateFilters();
  }

  function FilterVariables(data) {
    let newList = data;

    if (formValues.codigo.length > 0) {
      newList = newList.filter( f => `${f.codigo}|${f.descripcion}`.indexOf(formValues.codigo) >= 0);
    }

    if (formValues.activo) {
      newList = newList.filter((f) => f.activo);
    }

		return newList;
  }

  function UpdateFilters() {
    let labels = [...filters.labels];
    labels.forEach((label) => {
      label.value = formValues[label.field];
    });
    setFilters((prevState) => {
      return { ...prevState, labels: labels };
    });
  }

  return (
    <>
      <Loading visible={state.loading}></Loading>

      <SectionHeading title={<>Variables Globales</>} />

      <section className="section-accordion">
        <AdvancedSearch
          labels={filters.labels.filter((f) => f.value !== f.valueIgnore)}
          onSearch={ApplyFilters}
          initShowFilters={true}
        >
          <div className="row form-basic">
            <div className="col-12 col-md-6 col-lg-6">
              <label htmlFor="codigo" className="form-label">
                Código / Descripción
              </label>
              <input
                name="codigo"
                type="text"
                placeholder=""
                className="form-control"
                value={formValues.codigo}
                onChange={formHandle}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3 form-check">
              <label htmlFor="activo" className="form-check-label">Sólo activo</label>
              <input
                name="activo"
                type="checkbox"
                className="form-check-input"
                value={""}
                checked={formValues.activo}
                onChange={formHandle}
              />
            </div>
          </div>
        </AdvancedSearch>

        <div className="m-top-20">
          {state.showVariables && (
            <EntidadesModal
              title="Seleccione el tipo de variable a cargar"
              entidad="Variable"
              onDismiss={() => {
                setState((prevState) => {
                  return { ...prevState, showVariables: false };
                });
              }}
              onConfirm={(id, row) => {
                handleClickVariableGlobalAdd(id);
              }}
              filter={(row) => {
                return row.activo && row.global;
              }}
              columns={[
                { Header: "Código", accessor: "codigo", width: "25%" },
                { Header: "Descripción", accessor: "descripcion", width: "50%" },
              ]}
              showWithoutSelection={false}
            />
          )}

					{state.showFormVariableModal && 
						<VariableModal
								id={state.rowIdVariable}
								disabled={true}
								onDismiss={() => {
									setState(prevState => {
											return {...prevState, showFormVariableModal: false};
									});
								}}
								onConfirm={(id) => { }}
						/>
					}	

          {state.showFormVariableGlobalModal && (
            <VariableGlobalModal
              disabled={false}
              data={{
                entity: state.rowFormVariableGlobal,
              }}
              onDismiss={() => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    showFormVariableGlobalModal: false,
                    rowFormVariableGlobal: null,
                  };
                });
              }}
              onConfirm={(row) => {
                if (ValidateVariableGlobal(row)) {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      showFormVariableGlobalModal: false,
                      rowFormVariableGlobal: null,
                    };
                  });
                  AddVariableGlobal(row);
                } else {
                  ShowToastMessage(ALERT_TYPE.ALERT_WARNING,"Los rangos de fechas se superponen con otros");
                }
              }}
            />
          )}

          <TableCustom
            showFilterGlobal={false}
            showPagination={false}
            className={"TableCustomBase"}
            columns={tableColumns}
            data={listVariableVisible}
            subComponent={subComponent}
          />
        </div>
      </section>
    </>
  );
}

export default VariablesGlobalesView;
