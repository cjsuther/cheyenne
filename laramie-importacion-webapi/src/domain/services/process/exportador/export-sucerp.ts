import moment from 'moment';
import CuentaService from '../../cuenta-service';
import ConfiguracionService from '../../configuracion-service';
import TasaService from '../../tasa-service';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { getNamespace } from 'cls-hooked';
import PublishService from '../../publish-service';
import VehiculoService from '../../vehiculo-service';
import TasaDTO from '../../../dto/tasa-dto';
import Tasa from '../../../entities/tasa';
import NumeracionService from '../../numeracion-service';
import VehiculoDeuda from '../../../entities/vehiculo-deuda';
import config from '../../../../server/configuration/config';
import fs from 'fs'
import Configuracion from '../../../entities/configuracion';
import CategoriaTasa from '../../../entities/categoria-tasa';
import CategoriaTasaService from '../../categoria-tasa-service';
import { ensureDirectoryExistence } from '../../../../infraestructure/sdk/utils/helper';
import md5 from 'md5';

export default class ExportSUCERP {

    cuentaService: CuentaService;
    configuracionService: ConfiguracionService;
    tasaService: TasaService;
    categoriaTasaService: CategoriaTasaService;
    publishService: PublishService;
    vehiculoService: VehiculoService;
    numeracionService: NumeracionService;

    codigoOrganismoSucerp:string;

	constructor(cuentaService: CuentaService, configuracionService: ConfiguracionService,
                tasaService: TasaService, categoriaTasaService: CategoriaTasaService,
                publishService: PublishService, vehiculoService: VehiculoService,
                numeracionService: NumeracionService) {
		this.cuentaService = cuentaService;
        this.configuracionService = configuracionService;
        this.tasaService = tasaService;
        this.categoriaTasaService = categoriaTasaService;
        this.publishService = publishService;
        this.vehiculoService = vehiculoService;
        this.numeracionService = numeracionService;
        this.codigoOrganismoSucerp = "";
	}

    async export() {
        return new Promise<{ buffer: Buffer, fileName: string }>( async (resolve, reject) => {
            try {
                const localStorage = getNamespace('LocalStorage');
                const token = localStorage.get("accessToken");

                const BASE_PATH = config.PATH.EXPORTS
                const PATH_SEPARATOR = config.PATH.PATH_SEPARATOR

                const today = moment(new Date());
                const exportFolder = `${BASE_PATH}sucerp`;
                const fileName = `sucerp_${today.format('YYYYMMDD')}.txt`;
                const filePath = `${exportFolder}${PATH_SEPARATOR}${fileName}`;
                ensureDirectoryExistence(filePath);

                const deudas = await this.vehiculoService.listByDeuda(token) as VehiculoDeuda[];
                const configCodigoOrganismoSucerp = await this.configuracionService.findByNombre(token, "CodigoOrganismoSucerp") as Configuracion;
                if (!configCodigoOrganismoSucerp) {
                    reject(new ReferenceError('No se pudo obtener los parámetros de configuración SUCERP'));
                    return;
                }
                this.codigoOrganismoSucerp = configCodigoOrganismoSucerp.valor;

                const categoriaTasas = await this.categoriaTasaService.list(token) as CategoriaTasa[];
                const categorias: { [id: string]: CategoriaTasa } = { };
                const tasas: { [id: string]: Tasa } = { };

                const numeroEnvio = today.format('YYYYMMDDHHmmss')
                const fechaHoraEnvio = today.format('YYYY-MM-DD HH:mm:ss');

                let contentHeader = `E0|01.40|01.40|${this.codigoOrganismoSucerp}|${numeroEnvio}|${fechaHoraEnvio}|`;

                let lsContentBody = [];
                for (const deuda of deudas) {
                    if (!tasas[deuda.idTasa]) {
                        const dto = await this.tasaService.findById(token, deuda.idTasa) as TasaDTO;
                        tasas[deuda.idTasa] = dto.tasa;
                    }
                    const tasa = tasas[deuda.idTasa];

                    if (!categorias[tasa.idCategoriaTasa]) {
                        const item = categoriaTasas.find(f => f.id === tasa.idCategoriaTasa);
                        categorias[tasa.idCategoriaTasa] = item;
                    }
                    const categoria = categorias[tasa.idCategoriaTasa];
                    const tipoDeuda = categoria.esPlan ? '4' : '1';

                    const blocks = []

                    blocks.push(...[
                        `C4`,
                        this.codigoOrganismoSucerp.padStart(8,'0'),
                        ''.padStart(7," "),
                        '1', //Código de deuda -> Constante "1", valores posibles 1 (Alta deuda), 2 (Cancelación deuda) y 3 (Pago deuda)
                        tipoDeuda, //Tipo de deuda -> Valores posibles 1 (cuota), 4 (planes de pago), 5 (derechos de oficina), 6 (Cuotas ARBA), 7 (intereses planes de pago)
                        deuda.dominio.trim(),
                        deuda.dominioAnterior.trim(),
                        deuda.periodo,
                        deuda.cuota.toString().padStart(3, '0'),
                        '',
                        moment(deuda.fechaVencimiento).format('YYYY-MM-DD'),
                        //Flag de vencimiento -> Determina si la deuda vence o no se tiene en cuenta la fecha de vencimiento (S=Vence – N=No vence)
                       'S',
                        '',
                        deuda.importeSaldo.toFixed(2),
                        today.format('YYYY-MM-DD HH:mm:ss'),
                        '|||||||||||', //Se pone un pipe de menos porque el proceso agrega uno de más
                        `${deuda.numeroPartida.toString().padStart(16,'0')}`,
                        ''
                    ]);

                    let contentRow = '';
                    blocks.forEach(block => contentRow += block + '|');

                    lsContentBody.push(contentRow);
                }

                let contentBody = '';
                lsContentBody.forEach(row => contentBody += row + '\n');
                const checksum = md5(contentBody);

                //"3ba7b75aa446516ccd84248d6117818a" Checksum -> Hash de verificación de redundancia cíclica, la misma se calcula utilizando 
                // el algoritmo MD5 sobre el contenido del archivo sin incluir el encabezado ni pie del mismo.
                //const checksum = '3ba7b75aa446516ccd84248d6117818a';

                const contentFooter = `P0|${deudas.length}|${checksum}|`;

                const content = `${contentHeader}\n${contentBody}${contentFooter}\n`;

                fs.writeFileSync(filePath, content, 'utf8');

                resolve({ buffer: Buffer.from(content, 'utf8'), fileName: fileName, });
            }
            catch(error) {
                reject(new ProcessError('Error procesando exportacion', error));
            }
        });
    }

}