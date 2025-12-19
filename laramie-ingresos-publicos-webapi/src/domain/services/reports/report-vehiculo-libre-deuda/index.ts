import PdfReport from '../../../../infraestructure/sdk/pdf-report';
import VehiculoService from "../../vehiculo-service";
import VehiculoDTO from '../../../dto/vehiculo-dto';
import Vehiculo from '../../../entities/vehiculo';
import TipoVehiculo from '../../../entities/tipo-vehiculo';
import TipoVehiculoService from '../../tipo-vehiculo-service';
import VinculoVehiculo from '../../../entities/vinculo-vehiculo';
import ConfiguracionService from '../../configuracion-service';
import NumeracionService from '../../numeracion-service';
import ListaService from '../../lista-service';
import Lista from '../../../entities/lista';
import EntidadService from '../../entidad-service';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { getDateNow, getDateToString } from '../../../../infraestructure/sdk/utils/convert';
import VinculoVehiculoService from '../../vinculo-vehiculo-service';
import LocalidadService from '../../localidad-service';
import ProvinciaService from '../../provincia-service';
import Localidad from '../../../entities/localidad';
import Provincia from '../../../entities/provincia';
import Direccion from '../../../entities/direccion';
import DireccionService from '../../direccion-service';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';

export default class ReportVehiculoLibreDeuda {

    listaService: ListaService;
    entidadService: EntidadService;
	configuracionService: ConfiguracionService;
    numeracionService: NumeracionService;
    vehiculoService: VehiculoService;
    tipoVehiculoService: TipoVehiculoService;
    vinculoVehiculoService: VinculoVehiculoService;
    localidadService: LocalidadService;
    provinciaService: ProvinciaService;
    direccionService: DireccionService;

	constructor(listaService: ListaService, entidadService: EntidadService, 
                configuracionService: ConfiguracionService, numeracionService: NumeracionService,
                vehiculoService: VehiculoService, tipoVehiculoService: TipoVehiculoService,
                vinculoVehiculoService: VinculoVehiculoService, localidadService: LocalidadService,
                provinciaService: ProvinciaService, direccionService: DireccionService) {
        this.listaService = listaService;
        this.entidadService = entidadService;
        this.configuracionService = configuracionService;
        this.numeracionService = numeracionService;
		this.vehiculoService = vehiculoService;
        this.tipoVehiculoService = tipoVehiculoService;
        this.vinculoVehiculoService = vinculoVehiculoService;
        this.localidadService = localidadService;
        this.provinciaService = provinciaService;
        this.direccionService = direccionService;
	}

    async generateReport(idVehiculo:number) {
        return new Promise( async (resolve, reject) => {
            try {

                const vehiculoDTO = await this.vehiculoService.findById(idVehiculo) as VehiculoDTO;
                const vehiculo = vehiculoDTO.vehiculo as Vehiculo;
                const vinculoVehiculoTitulares = vehiculoDTO.vinculosVehiculo.filter((f => f.idTipoVinculoVehiculo === 71)) as Array<VinculoVehiculo>;
                if (vinculoVehiculoTitulares.length === 0) {
                    reject(new ValidationError('El vinculo vehiculo no tiene titulares asociados'));
                    return;
                }
                const primerTitular = vinculoVehiculoTitulares[0];

                const motivosBajaVehiculos = await this.listaService.list() as Array<Lista>;
                const motivoBajaVehiculo = motivosBajaVehiculos.find(f => f.id === vehiculo.idMotivoBajaVehiculo)??{nombre: ""}.nombre;
                
                const tipoVehiculos = await this.tipoVehiculoService.list() as Array<TipoVehiculo>;                
                const tipo = tipoVehiculos.find(f => f.id === vehiculo.idTipoVehiculo).nombre;

                const tiposDocumentos = await this.listaService.list("TipoDocumento") as Array<Lista>;

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
                const provincias = await this.provinciaService.list() as Array<Provincia>;

                const localidad = localidades.find(f => f.id === direccion.idLocalidad).nombre;
                const provincia = provincias.find(f => f.id === direccion.idProvincia).nombre;

                let titulares = [];
                for (let i = 0; i < vinculoVehiculoTitulares.length; i++) {
                    const vinculo = vinculoVehiculoTitulares[i];
                    
                    let tipoDocumentoTitular = tiposDocumentos.find(f => f.id === vinculo.idTipoDocumento).nombre;
                    
                    let titular = 
                        {
                            nombre: vinculo.nombrePersona,
                            documento: `${tipoDocumentoTitular} ${vinculo.numeroDocumento}`,
                            domicilioFiscal: direccion,
                            calle: direccion.calle,
                            numero: direccion.altura,
                            piso: direccion.piso,
                            dpto: direccion.dpto,
                            codigoPostal: direccion.codigoPostal,
                            localidad: localidad,
                            provincia: provincia                            
                        }
                    titulares.push(titular); 
                }               
                
                const data = {
                    municipioNombre: "",
                    fechaSolicitud: "",
                    motivoBaja: motivoBajaVehiculo,

                    dominioActual: vehiculoDTO.vehiculo.dominio,
                    dominioAnterior: vehiculoDTO.vehiculo.dominioAnterior,
                    fechaVigencia: getDateToString(getDateNow(false), false),
                    codAutomor: "",
                    marca: vehiculo.marca,
                    modelo: vehiculo.modelo,
                    anioModelo: vehiculo.anioModelo,
                    tipoVehiculo: tipo,
                    numeroMotor: vehiculo.numeroMotor,
                    marcaMotor: vehiculo.marcaMotor,
                    numeroChasis: vehiculo.numeroChasis,
                    peso: vehiculo.peso,
                    carga: vehiculo.carga,

                    titulares: titulares,

                    fechaCertificado: getDateToString(getDateNow(false), false)
                };

                const optionsReport = {
                    title: 'Solicitud Vehiculo Libre Deuda',
                    margin: {
                      top: 100,
                      bottom: 25,
                      left: 25,
                      right: 25
                    },
                    pathBodyTemplate: 'src/domain/services/reports/report-vehiculo-libre-deuda/index.ejs',
                    pathHeaderTemplate: 'src/domain/services/reports/report-vehiculo-libre-deuda/header.ejs',
                    // pathFooterTemplate: '',
                    pathStyles: ['src/domain/services/reports/report-common/index.css'],
                    pathImages: [],
                    data: data
                };
              
                const pdfReport = new PdfReport("SolicitudVehiculoLibreDeuda.pdf", "src/infraestructure/sdk/pdf-report", optionsReport);
                const buffer = await pdfReport.generate() as Buffer;

                resolve(buffer);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }


}