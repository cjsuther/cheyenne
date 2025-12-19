import React, { useState, useEffect } from 'react';
import { func, bool, number, object } from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { REQUEST_METHOD } from "../../../consts/requestMethodType";
import { APIS } from '../../../config/apis';
import { ALERT_TYPE } from '../../../consts/alertType';
import { ServerRequest } from '../../../utils/apiweb';
import { InputCustom, Loading } from '../../common';
import ShowToastMessage from '../../../utils/toast';
import { isValidString } from '../../../utils/validator';
import { GetInitDato, GetTitleFromField } from '../../../utils/helpers';


const EntidadModal = (props) => {

    //variables
    const entityInit = {
        id: 0,
        codigo: '',
        nombre: '',
        orden: 0
    };

    //hooks
    const [state, setState] = useState({
        loading: false,
        entity: entityInit
    });

    const [fields, setFields] = useState([]);


    const mount = () => {

        let fields = [];
        for (let i=1; i<=10; i++) {
            const nombre = props.definition[`nombre${i}`];
            if (isValidString(nombre, true)) {
                const tipoDato = props.definition[`tipoDato${i}`];
                const descripcion = props.definition[`descripcion${i}`];
                const obligatorio = props.definition[`obligatorio${i}`];
                const field = {
                    nombre: nombre,
                    descripcion: descripcion,
                    tipoDato: tipoDato,
                    obligatorio: obligatorio,
                    valor: GetInitDato(tipoDato)
                }
                fields.push(field);
            }
        }
        setFields(fields);
   
        const unmount = () => {}
        return unmount;
    }
    useEffect(mount, []);

    const [ formValues, formHandle, , formSet ] = useForm({
        codigo: '',
        nombre: '',
        orden: 0
    });

    useEffect(() => {

        if (props.id > 0) {
            FindEntidad();
        }
        else {
            let newFormValues = {
                codigo: '',
                nombre: '',
                descripcion: '',
                obligatorio: false,
                orden: 0
            };
            fields.forEach(field => {
                newFormValues[field.nombre] = field.valor;
            });
            formSet(newFormValues);
        }

    }, [fields]);

    //handles
    const handleClickAceptar = () => {
        if (isFormValid()) {
            if (props.id === 0) {
                AddEntidad();
            }
            else {
                ModifyEntidad();
            }
        };
    };
    const handleClickCancelar = () => {
        props.onDismiss();
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

    // funciones
    function isFormValid() {

        if (formValues.codigo.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el código');
            return false;
        }        
        if (formValues.nombre.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el nombre');
            return false;
        }
        if (formValues.orden.length === 0) {
            ShowToastMessage(ALERT_TYPE.ALERT_WARNING, 'Debe cargar el orden');
            return false;
        }

        fields.forEach(field => {
            if (field.obligatorio) {
                const valor = formValues[field.nombre];
                //falta validar dependiendo el tipo de dato
            }
            
        });

        return true;
    }
    
    function FindEntidad() {
    
        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
            response.json()
            .then((data) => {

                fields.forEach(field => {
                    if (field.nombre.startsWith('fecha')) {
                        if (data[field.nombre] !== null) data[field.nombre] = new Date(data[field.nombre]);
                    }
                });

                setState(prevState => {
                  return {...prevState, loading: false, entity: data};
                });

                let newFormValues = {
                    codigo: data.codigo,
                    nombre: data.nombre,
                    orden: data.orden
                };
                fields.forEach(field => {
                    newFormValues[field.nombre] = data[field.nombre];
                });
                formSet(newFormValues);
            })
            .catch((error) => {
                const message = 'Error procesando respuesta: ' + error;
                ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
                setState(prevState => {
                  return {...prevState, loading: false};
                });
            });
        };
    
        const paramsUrl = `/${props.definition.tipo}/${props.id}`;
    
        ServerRequest(
            REQUEST_METHOD.GET,
            null,
            true,
            APIS.URLS.ENTIDAD,
            paramsUrl,
            null,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }
    
    function AddEntidad() {
        const method = REQUEST_METHOD.POST;
        const paramsUrl = `/${props.definition.tipo}`;
        SaveEntidad(method, paramsUrl);
    }
    
    function ModifyEntidad() {
        const method = REQUEST_METHOD.PUT;
        const paramsUrl = `/${props.definition.tipo}/${props.id}`;
        SaveEntidad(method, paramsUrl);
    }    

    function SaveEntidad(method, paramsUrl) {

        setState(prevState => {
          return {...prevState, loading: true};
        });
    
        const callbackSuccess = (response) => {
          response.json()
          .then((row) => {
            setState(prevState => {
                return {...prevState, loading: false};
            });
            props.onConfirm(row.id);
          })
          .catch((error) => {
            const message = 'Error procesando respuesta: ' + error;
            ShowToastMessage(ALERT_TYPE.ALERT_ERROR, message);
            setState(prevState => {
              return {...prevState, loading: false};
            });
          });
        };
    
        const dataBody = {
            ...state.entity,
            codigo: formValues.codigo,
            nombre: formValues.nombre,
            orden: parseInt(formValues.orden)
        };
        fields.forEach(field => {
            dataBody[field.nombre] = formValues[field.nombre];
        });
    
        ServerRequest(
            method,
            null,
            true,
            APIS.URLS.ENTIDAD,
            paramsUrl,
            dataBody,
            callbackSuccess,
            callbackNoSuccess,
            callbackError
        );
    
    }

  return (
    <>

    <Loading visible={state.loading}></Loading>

    <div className="modal modal-block" role="dialog" data-keyboard="false" data-backdrop="static" >
      <div className="modal-dialog modal-lg">
        <div className="modal-content animated fadeIn">
          <div className="modal-header">
           <h2 className="modal-title">{props.definition.descripcion}: {(props && props.id > 0) ? state.entity.nombre : "Nuevo"}</h2>
          </div>
          <div className="modal-body">

            <div className="row">

                <div className="mb-3 col-12 col-md-6 col-lg-4">
                    <label htmlFor="codigo" className="form-label">Código</label>
                    <input
                        name="codigo"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.codigo }
                        onChange={ formHandle }
                        maxLength={50}
                        disabled={props.disabled}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6 col-lg-4">
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
                <div className="mb-3 col-12">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        name="nombre"
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={ formValues.nombre }
                        onChange={ formHandle }
                        maxLength={250}
                        disabled={props.disabled}
                    />
                </div>

            </div>

            <div className="row">
                {fields.map(field => (
                    <div className="mb-3 col-12 col-md-6" key={field.nombre}>
                        <label htmlFor={field.nombre} className="form-label">{field.descripcion}</label>
                        <InputCustom
                            name={field.nombre}
                            type={field.tipoDato}
                            placeholder=""
                            className="form-control"
                            value={ formValues[field.nombre] }
                            onChange={ formHandle }
                            disabled={props.disabled}
                            serialize={false}
                        />
                    </div>
                )
            )}

            </div>

          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-dismiss="modal" onClick={ (event) => handleClickAceptar() }>Aceptar</button>
            <button className="btn btn-outline-primary" data-dismiss="modal" onClick={ (event) => handleClickCancelar() }>Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}

EntidadModal.propTypes = {
    disabled: bool,
    id: number.isRequired,
    definition: object.isRequired,
    onConfirm: func.isRequired,
    onDismiss: func.isRequired,
};

EntidadModal.defaultProps = {
    disabled: false
};

export default EntidadModal;