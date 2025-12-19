import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import ejs from 'ejs';
import writtenNumber from 'written-number';
import { getFormatNumber, getParseDecimalToString } from '../../../../infraestructure/sdk/utils/convert';
import ListaService from '../../lista-service';
import Lista from '../../../entities/lista';
import TipoControladorService from '../../tipo-controlador-service';
import TipoControlador from '../../../entities/tipo-controlador';
import TipoRelacionCertificadoApremioPersonaService from '../../tipo-relacion-certificado-apremio-persona-service';
import TipoRelacionCertificadoApremioPersona from '../../../entities/tipo-relacion-certificado-apremio-persona';
import ControladorService from '../../controlador-service';
import CertificadoApremioDTO from '../../../dto/certificado-apremio-dto';
import CertificadoApremioService from '../../certificado-apremio-service';
import CuentaService from '../../cuenta-service';
import VinculoCuentaService from '../../vinculo-cuenta-service';
import Controlador from '../../../entities/controlador';
import Cuenta from '../../../entities/cuenta';
import VinculoCuenta from '../../../entities/vinculo-cuenta';
import Direccion from '../../../entities/direccion';
import Localidad from '../../../entities/localidad';
import Provincia from '../../../entities/provincia';
import LocalidadService from '../../localidad-service';
import ProvinciaService from '../../provincia-service';
import DireccionService from '../../direccion-service';

export default class ReportCertificadoApremioJuicio {

    listaService: ListaService;
    tipoControladorService: TipoControladorService;
    tipoRelacionCertificadoApremioPersonaService: TipoRelacionCertificadoApremioPersonaService;
    controladorService: ControladorService;
    certificadoApremioService: CertificadoApremioService;
    cuentaService: CuentaService;
    vinculoCuentaService: VinculoCuentaService;
    localidadService: LocalidadService;
    provinciaService: ProvinciaService;
    direccionService: DireccionService;

    constructor(listaService: ListaService, tipoControladorService: TipoControladorService,
                tipoRelacionCertificadoApremioPersonaService: TipoRelacionCertificadoApremioPersonaService,
                controladorService: ControladorService, certificadoApremioService: CertificadoApremioService,
                cuentaService: CuentaService, vinculoCuentaService: VinculoCuentaService,
                localidadService: LocalidadService, provinciaService: ProvinciaService,
                direccionService: DireccionService) {
        this.listaService = listaService;
        this.tipoControladorService = tipoControladorService;
        this.tipoRelacionCertificadoApremioPersonaService = tipoRelacionCertificadoApremioPersonaService;
        this.controladorService = controladorService;
        this.certificadoApremioService = certificadoApremioService;
        this.cuentaService = cuentaService;
        this.vinculoCuentaService = vinculoCuentaService;
        this.localidadService = localidadService;
        this.provinciaService = provinciaService;
        this.direccionService = direccionService;
    }

    async generateReport(idCertificadoApremio:number) {
        return new Promise( async (resolve, reject) => {
            try {    
                
                const tiposControladores = await this.tipoControladorService.list() as Array<TipoControlador>;
                const tiposRelaciones = await this.tipoRelacionCertificadoApremioPersonaService.list() as Array<TipoRelacionCertificadoApremioPersona>;
                const controladores = await this.controladorService.list() as Array<Controlador>;
                const certificadoApremioDTO = await this.certificadoApremioService.findById(idCertificadoApremio) as CertificadoApremioDTO;
                const certificadoApremio = certificadoApremioDTO.certificadoApremio;
                const cuenta = await this.cuentaService.findById(certificadoApremio.idCuenta) as Cuenta;
                const vinculosCuenta = await this.vinculoCuentaService.listByTributo(cuenta.idTipoTributo, cuenta.idTributo) as Array<VinculoCuenta>;
                

                writtenNumber.defaults.lang = 'es';
                let montoLetra = writtenNumber(Math.floor(certificadoApremio.montoTotal)); 
                let montoDecimalLetra = getParseDecimalToString(certificadoApremio.montoTotal);

                let tipoVinculosTitulares = [51, 61, 71, 81, 91, 101];
                const titulares = vinculosCuenta.filter(f => tipoVinculosTitulares.includes(f.idTipoVinculoCuenta));
                if (titulares.length === 0) {
					reject(new ValidationError('No se puede generar el certificado porque no hay títulares vinculados'));
					return;
				}
                const primerTitular = titulares[0];
                
                const tiposControladoresAbogado = tiposControladores.filter(f => f.abogado).map(x => x.id);
                const controladoresAbogado = controladores.filter(f => tiposControladoresAbogado.includes(f.idTipoControlador));
                const tiposRelacionesAbogado = tiposRelaciones.filter(f => tiposControladoresAbogado.includes(f.idTipoControlador)).map(x => x.id);
                const abogados = certificadoApremioDTO.certificadoApremioPersonas.filter(f => tiposRelacionesAbogado.includes(f.idTipoRelacionCertificadoApremioPersona));
                if (abogados.length === 0) {
					reject(new ValidationError('No se puede generar el certificado porque no hay abogados'));
					return;
				}

                const primerAbogado = controladoresAbogado.find(f => f.idPersona === abogados[0].idPersona)
                if (!primerAbogado) {
					reject(new ValidationError('No se puede generar el certificado porque no hay abogados vinculados'));
					return;
				}

                const tiposControladoresOficialJusticia = tiposControladores.filter(f =>  f.oficialJusticia).map(x => x.id);
                const controladoresOficialJusticia = controladores.filter(f => tiposControladoresOficialJusticia.includes(f.idTipoControlador));
                if (controladoresOficialJusticia.length === 0) {
					reject(new ValidationError('No se puede generar el certificado porque no hay oficiales de justicia'));
					return;
				}

                let documento = "";
                const tiposDocumentos = await this.listaService.list("TipoDocumento") as Array<Lista>;
                let tipoDocumentoNombre = tiposDocumentos.find(f => f.id === primerAbogado.idTipoDocumento).nombre;
                documento = `${tipoDocumentoNombre} ${primerAbogado.numeroDocumento}`;  

                const entidadPersona = (primerTitular.idTipoPersona === 500) ? "PersonaFisica" : "PersonaJuridicaDomicilioLegal";
                let direccion: Direccion = null
                try {
                    const direcciones = (await this.direccionService.listByEntidadAdministracion(entidadPersona, primerTitular.idPersona)) as Array<Direccion>;
                    if (direcciones.length === 0) {
                        reject(new ValidationError('El titular no tiene domicilios asociados'));
                        return;
                    }
                    direccion = direcciones[0];
                }
                catch(error) {
                    reject(new ValidationError('No se pudo obtener el domicilio del titular'));
                    return;
                }

                const localidades = await this.localidadService.list() as Array<Localidad>;
                const localidad = localidades.find(f => f.id === direccion.idLocalidad).nombre;

                let controladorAbogadoSinPrimero = controladoresAbogado.filter(f => f.id !== primerAbogado.id);

                let datoAbogado = "";
                for (let i = 0; i < controladorAbogadoSinPrimero.length; i++) {
                    let dato = controladorAbogadoSinPrimero[i];

                    if (i === 0) {
                        datoAbogado += dato.nombrePersona;
                    }
                    else {
                        datoAbogado += " Y/O " + dato.nombrePersona;
                    }
                }   
                
                let datoOficialJusticia = "";
                for (let i = 0; i < controladoresOficialJusticia.length; i++) {
                    let dato = controladoresOficialJusticia[i];

                    if (i === 0) {
                        datoOficialJusticia += dato.nombrePersona;
                    }
                    else {
                        datoOficialJusticia += " Y/O " + dato.nombrePersona;
                    } 
                }    

                const data = {
                    numero: certificadoApremio.numero,
                    demandado: primerTitular.nombrePersona.toUpperCase(),
                    monto: getFormatNumber(certificadoApremio.montoTotal, 2),
                    montoLetra: montoLetra,
                    montoDecimalLetra: montoDecimalLetra,
                    nombreAbogado: primerAbogado.nombrePersona.toUpperCase(),
                    legajo: primerAbogado.legajo,
                    documento: documento,
                    calle: direccion.calle.toUpperCase(),
                    altura: direccion.altura.toUpperCase(),
                    piso: direccion.piso.toUpperCase(),
                    dpto: direccion.dpto.toUpperCase(),
                    localidad: localidad.toUpperCase(),
                    abogado: datoAbogado.toUpperCase(),
                    oficialJusticia: datoOficialJusticia.toUpperCase()
                };

                const optionsReport = {      
                };

                const pathBodyTemplate = 'src/domain/services/reports/report-certificado-apremio-juicio/index.ejs';
                ejs.renderFile(pathBodyTemplate, data, optionsReport, (error, buffer) => {
                    if (error) {
                        reject(new ProcessError('Error generando reporte', error));
                    }
                    else {
                        resolve(buffer);
                    }
                });
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }


}