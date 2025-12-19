import PdfReport from '../../../../infraestructure/sdk/pdf-report';
import ApremioDTO from '../../../dto/apremio-dto';
import Apremio from '../../../entities/apremio';
import ApremioService from '../../apremio-service';
import OrganoJudicial from '../../../entities/organo-judicial';
import OrganoJudicialService from '../../organo-judicial-service';
import Cuenta from '../../../entities/cuenta';
import CuentaService from '../../cuenta-service';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import TipoControlador from '../../../entities/tipo-controlador';
import TipoRelacionCertificadoApremioPersona from '../../../entities/tipo-relacion-certificado-apremio-persona';
import Controlador from '../../../entities/controlador';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import TipoControladorService from '../../tipo-controlador-service';
import TipoRelacionCertificadoApremioPersonaService from '../../tipo-relacion-certificado-apremio-persona-service';
import CertificadoApremioService from '../../certificado-apremio-service';
import ControladorService from '../../controlador-service';
import CertificadoApremioDTO from '../../../dto/certificado-apremio-dto';
import CertificadoApremio from '../../../entities/certificado-apremio';
import CertificadoApremioPersonaState from '../../../dto/certificado-apremio-persona-state';

export default class ReportApremioCaratula {

    apremioService: ApremioService;
    organoJudicialService: OrganoJudicialService;
    tipoControladorService: TipoControladorService;
    tipoRelacionCertificadoApremioPersonaService: TipoRelacionCertificadoApremioPersonaService;
    controladorService: ControladorService;
    certificadoApremioService: CertificadoApremioService;
    cuentaService: CuentaService;

	constructor(apremioService: ApremioService, organoJudicialService: OrganoJudicialService,
        cuentaService: CuentaService, tipoControladorService: TipoControladorService,
        tipoRelacionCertificadoApremioPersonaService: TipoRelacionCertificadoApremioPersonaService,
        controladorService: ControladorService, certificadoApremioService: CertificadoApremioService, ) {
        this.apremioService = apremioService;
        this.organoJudicialService = organoJudicialService;
        this.tipoControladorService = tipoControladorService;
        this.tipoRelacionCertificadoApremioPersonaService = tipoRelacionCertificadoApremioPersonaService;
        this.controladorService = controladorService;
        this.certificadoApremioService = certificadoApremioService;
        this.cuentaService = cuentaService;
	}

    async generateReport(idApremio:number) {
        return new Promise( async (resolve, reject) => {
            try {
                const apremioDTO = await this.apremioService.findById(idApremio) as ApremioDTO;
                const apremio = apremioDTO.apremio as Apremio;

                const juzgados = await this.organoJudicialService.list() as Array<OrganoJudicial>;
                const juzgado = juzgados.find(f => f.id === apremio.idOrganismoJudicial).departamentoJudicial;

                const certificadosApremio = await this.certificadoApremioService.listByApremio(idApremio) as Array<CertificadoApremio>;
                if (certificadosApremio.length === 0) {
					reject(new ValidationError('No se puede generar la caratula porque no hay certificados apremio'));
					return;
				}
                const idCertificadoApremio = certificadosApremio[0].id;
                const certificadosApremioDTO = await this.certificadoApremioService.findById(idCertificadoApremio) as CertificadoApremioDTO;

                const tiposControladores = await this.tipoControladorService.list() as Array<TipoControlador>;
                const tiposRelaciones = await this.tipoRelacionCertificadoApremioPersonaService.list() as Array<TipoRelacionCertificadoApremioPersona>;
                const controladores = await this.controladorService.list() as Array<Controlador>;

                const tiposControladoresAbogado = tiposControladores.filter(f => f.abogado).map(x => x.id);
                const controladoresAbogado = controladores.filter(f => tiposControladoresAbogado.includes(f.idTipoControlador));
                const tiposRelacionesAbogado = tiposRelaciones.filter(f => tiposControladoresAbogado.includes(f.idTipoControlador)).map(x => x.id);
                const abogados = certificadosApremioDTO.certificadoApremioPersonas.filter(f => tiposRelacionesAbogado.includes(f.idTipoRelacionCertificadoApremioPersona));
                if (abogados.length === 0) {
					reject(new ValidationError('No se puede generar la caratula porque no hay abogados'));
					return;
				}

                const primerAbogado = controladoresAbogado.find(f => f.idPersona === abogados[0].idPersona)
                if (!primerAbogado) {
					reject(new ValidationError('No se puede generar la caratula porque no hay un abogado vinculado'));
					return;
				}

               

                let cuentaApremio = "";
                if (apremioDTO.certificadosApremio.length > 0) {
                    const cuentas = await this.cuentaService.list() as Array<Cuenta>;

                    let cuenta = apremioDTO.certificadosApremio[0];
                    let nombreCuenta = cuentas.find(f => f.id === cuenta.idCuenta).numeroCuenta;
                    
                    cuentaApremio = nombreCuenta;
                }
                
                const data = {
                    municipioNombre: "",
                    fechaSolicitud: "",

                    numero: apremio.numero,
                    nombre: apremio.caratula,
                    juzgado: juzgado,
                    abogado: primerAbogado.nombrePersona,
                    cuenta: cuentaApremio,
                };

                const optionsReport = {
                    title: 'Solicitud Apremio Caratula',
                    margin: {
                      top: 50,
                      bottom: 25,
                      left: 25,
                      right: 25
                    },
                    pathBodyTemplate: 'src/domain/services/reports/report-apremio-caratula/index.ejs',
                    // pathHeaderTemplate: '',
                    // pathFooterTemplate: '',
                    pathStyles: ['src/domain/services/reports/report-common/index.css'],
                    pathImages: [],
                    data: data
                };
              
                const pdfReport = new PdfReport("SolicitudApremioCaratula.pdf", "src/infraestructure/sdk/pdf-report", optionsReport);
                const buffer = await pdfReport.generate() as Buffer;

                resolve(buffer);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }


}