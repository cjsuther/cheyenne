import CuentaService from "../../cuenta-service";
import ControladorService from '../../controlador-service';
import EmisionEjecucionCuentaService from "../../emision-ejecucion-cuenta-service";

import CuentaOrdenamiento from '../../../dto/cuenta-ordenamiento';
import Controlador from '../../../entities/controlador';
import EmisionDefinicion from '../../../entities/emision-definicion';
import EmisionEjecucion from '../../../entities/emision-ejecucion';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { CloneObject } from '../../../../infraestructure/sdk/utils/helper';
import ValidationError from "../../../../infraestructure/sdk/error/validation-error";
import { EMISION_EJECUCION_STATE } from "../../../../infraestructure/sdk/consts/emisionEjecucionState";


export default class OrdenamientoExecute {

    cuentaService: CuentaService;
    controladorService: ControladorService;
    emisionEjecucionCuentaService: EmisionEjecucionCuentaService;

	constructor(cuentaService: CuentaService, controladorService: ControladorService,
                emisionEjecucionCuentaService: EmisionEjecucionCuentaService) {
		this.cuentaService = cuentaService;
        this.controladorService = controladorService;
        this.emisionEjecucionCuentaService = emisionEjecucionCuentaService;
	}

    async execute(idEmisionEjecucion:number, sorter:any) {
        return new Promise( async (resolve, reject) => {
            try {
                let requests = [];
                requests.push(this.cuentaService.listByOrdenamiento(idEmisionEjecucion));
                requests.push(this.controladorService.list());
                
                Promise.all(requests)
                .then(async responses => {
                    let items = (responses[0]) as Array<CuentaOrdenamiento>;
                    const controladores = (responses[1]) as Array<Controlador>;

                    let rowInit = {
                        idEmisionEjecucionCuenta: 0,
                        number: 0,
                        numeroCuenta: "",
                        calle: "",
                        altura: "",
                        cuentaCatastral: "",
                        idControlador: 0,
                        controladorLegajo: "",
                        controladorCatastral: ""
                    };

                    const rows = items.sort((a,b) => a.numero - b.numero).map((item, index) => {
                        const controlador = controladores.find(f => f.id === item.idControlador) as Controlador;

                        let row = CloneObject(rowInit);
                        row.idEmisionEjecucionCuenta = item.idEmisionEjecucionCuenta;
                        row.number = item.numero;
                        row.numeroCuenta = item.numeroCuenta;
                        if (item.zonCalle.length > 0) {
                            row.calle = item.zonCalle;
                            row.altura = item.zonAltura.padStart(10,'0');
                        }
                        else {
                            row.calle = item.inmCalle;
                            row.altura = item.inmAltura.padStart(10,'0');
                        }
                        row.cuentaCatastral = this.getCatastral(item, 15);
                        row.idControlador = (controlador) ? controlador.id : 0;
                        row.controladorLegajo = (controlador) ? controlador.legajo.padStart(10,'0') : "";
                        row.controladorCatastral = (controlador) ? this.getCatastral(controlador, 15) : "";

                        return row;
                    });

                    const updates = sorter.execute(rows);

                    const result = await this.emisionEjecucionCuentaService.modifyByEmisionEjecucion(updates);
                    if (!result) {
						reject(new ReferenceError('No se pudo completar el proceso de ordenamiento'));
						return;
					}
                    resolve(result);
                })
                .catch(reject);
            }
            catch(error) {
                reject(new ProcessError('Error generando ordenamiento', error));
            }
        });
    }

    getCatastral(row, levelEnd) {
        let level= 1;
        let catastral = "";
        catastral += (levelEnd >= level++) ? row.catastralCir.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralSec.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralChacra.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralLchacra.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralQuinta.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralLquinta.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralFrac.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralLfrac.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralManz.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralLmanz.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralParc.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralLparc.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralSubparc.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralUfunc.padStart(4,'0') + "-" : "";
        catastral += (levelEnd >= level++) ? row.catastralUcomp.padStart(4,'0') + "-" : "";
        if (catastral.length > 0) catastral = catastral.substring(0, catastral.length - 1);

        return catastral;
    }


}