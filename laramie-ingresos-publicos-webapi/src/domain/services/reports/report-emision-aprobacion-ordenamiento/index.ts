import * as XLSX from 'xlsx';
import CuentaService from "../../cuenta-service";
import ControladorService from '../../controlador-service';

import CuentaOrdenamiento from '../../../dto/cuenta-ordenamiento';
import Controlador from '../../../entities/controlador';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { CloneObject } from '../../../../infraestructure/sdk/utils/helper';
import config from '../../../../server/configuration/config';


export default class ReportEmisionAprobacionOrdenamiento {

    cuentaService: CuentaService;
    controladorService: ControladorService;

	constructor(cuentaService: CuentaService, controladorService: ControladorService) {
		this.cuentaService = cuentaService;
        this.controladorService = controladorService;
	}

    async generateReport(idEmisionEjecucion:number) {
        return new Promise<{ buffer: Buffer, fileExtension: string }>( async (resolve, reject) => {
            try {
                let requests = [];
                requests.push(this.cuentaService.listByOrdenamiento(idEmisionEjecucion));
                requests.push(this.controladorService.list());
                
                Promise.all(requests)
                .then(responses => {
                    let items = (responses[0]) as Array<CuentaOrdenamiento>;
                    const controladores = (responses[1]) as Array<Controlador>;

                    let headers = ["ORDEN", "NRO CUENTA", "DIRECCIÓN ENTREGA", "CUENTA CATASTRAL", "CONTROLADOR LEGAJO", "CONTROLADOR NOMBRE", "CONTROLADOR CATASTRAL", "ENTREGA RECIBO"];
                    let rowInit = {
                        number: 0,
                        numeroCuenta: "",
                        direccion: "",
                        cuentaCatastral: "",
                        controladorLegajo: "",
                        controladorNombre: "",
                        controladorCatastral: "",
                        entregaRecibo: ""
                    };

                    const rows = items.sort((a,b) => a.numero - b.numero).map((item, index) => {

                        const controlador = controladores.find(f => f.id === item.idControlador) as Controlador;

                        let row = CloneObject(rowInit);
                        row.number = item.numero;
                        row.numeroCuenta = item.numeroCuenta;
                        if (item.zonCalle.length > 0) {
                            row.direccion = `${item.zonCalle} ${item.zonAltura} ${item.zonPiso} ${item.zonDpto}`;
                        }
                        else {
                            row.direccion = `${item.inmCalle} ${item.inmAltura} ${item.inmPiso} ${item.inmDpto}`;
                        }
                        if (item.email.length > 0) {
                            row.entregaRecibo = 'No';
                        }
                        else {
                            row.entregaRecibo = `Si`;
                        }
                        row.cuentaCatastral = this.getCatastral(item, 15);
                        row.controladorLegajo = (controlador) ? controlador.legajo : "";
                        row.controladorNombre = (controlador) ? controlador.nombrePersona : "";
                        row.controladorCatastral = (controlador) ? this.getCatastral(controlador, 15) : "";

                        return row;
                    });

                    if (rows.length > config.XLSX_MAX_ROWS) {
                        const reducer = (prev, curr) => prev + ';' + curr
                        let csv = headers.reduce(reducer)
                        rows.forEach(row => csv += `\n` + Object.values(row).reduce(reducer))
                        resolve({
                            buffer: Buffer.from(csv, 'utf8'),
                            fileExtension: 'csv',
                        })
                    }
                    else {
                        const worksheet = XLSX.utils.json_to_sheet(rows);
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, "Informe");
                        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
                        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

                        resolve({ buffer, fileExtension: 'xlsx', });
                    }
                })
                .catch(reject);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
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