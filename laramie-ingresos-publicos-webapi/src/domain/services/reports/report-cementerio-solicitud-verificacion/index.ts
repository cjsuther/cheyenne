import PdfReport from '../../../../infraestructure/sdk/pdf-report';
import CementerioService from "../../cementerio-service";
import CementerioDTO from '../../../dto/cementerio-dto';
import Cementerio from '../../../entities/cementerio';
import Inhumado from '../../../entities/inhumado';
import VinculoCementerio from '../../../entities/vinculo-cementerio';
import ConfiguracionService from '../../configuracion-service';
import Configuracion from '../../../entities/configuracion';
import NumeracionService from '../../numeracion-service';
import ListaService from '../../lista-service';
import TipoConstruccionFunerariaService from '../../tipo-construccion-funeraria-service';
import TipoConstruccionFuneraria from '../../../entities/tipo-construccion-funeraria';
import Lista from '../../../entities/lista';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import { getDateNow, getDateToString } from '../../../../infraestructure/sdk/utils/convert';


export default class ReportCementerioSolicitudVerificacion {

    listaService: ListaService;
    tipoConstruccionFunerariaService: TipoConstruccionFunerariaService;
	configuracionService: ConfiguracionService;
    numeracionService: NumeracionService;
    cementerioService: CementerioService;

	constructor(listaService: ListaService, tipoConstruccionFunerariaService: TipoConstruccionFunerariaService,
                configuracionService: ConfiguracionService, numeracionService: NumeracionService,
                cementerioService: CementerioService) {
        this.listaService = listaService;
        this.tipoConstruccionFunerariaService = tipoConstruccionFunerariaService;
        this.configuracionService = configuracionService;
        this.numeracionService = numeracionService;
		this.cementerioService = cementerioService;
	}

    async generateReport(idCementerio:number, idInhumado: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const municipioNombre:string = (await this.configuracionService.findByNombre("MunicipioNombre") as Configuracion).valor;
                const municipioLocalidad:string = (await this.configuracionService.findByNombre("MunicipioLocalidad") as Configuracion).valor;

                const cementerioDTO = await this.cementerioService.findById(idCementerio) as CementerioDTO;
                const cementerio = cementerioDTO.cementerio as Cementerio;
                const inhumado = cementerioDTO.inhumados.find(f => f.id === idInhumado) as Inhumado;
                const vinculoCementerio = cementerioDTO.vinculosCementerio.find(f => [80, 81].includes(f.idTipoVinculoCementerio)) as VinculoCementerio;

                const tiposConstruccionFuneraria = await this.tipoConstruccionFunerariaService.list() as Array<TipoConstruccionFuneraria>;
                const tiposDocumentos = await this.listaService.list("TipoDocumento") as Array<Lista>;

                const ubicacion = tiposConstruccionFuneraria.find(f => f.id === cementerio.idTipoConstruccionFuneraria).nombre;
                let direccionZonaEntrega = "";
                if (cementerioDTO.zonasEntrega.length > 0) {
                    const direccion = cementerioDTO.zonasEntrega[0].direccion;
                    direccionZonaEntrega = `${direccion.calle} ${direccion.altura}, ${municipioLocalidad}`;
                }
                let tipoDocumentoTitular = tiposDocumentos.find(f => f.id === vinculoCementerio.idTipoDocumento).nombre;

                const data = {
                    municipioNombre: municipioNombre,
                    fechaSolicitud: getDateToString(getDateNow(false), false),
                    ubicacion: ubicacion,
                    circunscripcion: cementerio.circunscripcionCementerio,
                    seccion: cementerio.seccionCementerio,
                    manzana: cementerio.manzanaCementerio,
                    parcela: cementerio.parcelaCementerio,
                    frente: cementerio.frenteCementerio,
                    fila: cementerio.filaCementerio,
                    numero: cementerio.numeroCementerio,
                    nombreFallecido: `${inhumado.apellido} ${inhumado.nombre}`,
                    fechaDefuncion: getDateToString(inhumado.fechaDefuncion, false),
                    nombreTitular: vinculoCementerio.nombrePersona,
                    documentoTitular: `${tipoDocumentoTitular} ${vinculoCementerio.numeroDocumento}`,
                    domicilioTitular: direccionZonaEntrega
                };

                const optionsReport = {
                    title: 'Solicitud de Verificación',
                    margin: {
                      top: 50,
                      bottom: 25,
                      left: 25,
                      right: 25
                    },
                    pathBodyTemplate: 'src/domain/services/reports/report-cementerio-solicitud-verificacion/index.ejs',
                    pathHeaderTemplate: 'src/domain/services/reports/report-common/header.ejs',
                    // pathFooterTemplate: '',
                    pathStyles: ['src/domain/services/reports/report-common/index.css'],
                    pathImages: [],
                    data: data
                };
              
                const pdfReport = new PdfReport("SolicitudVerificacion.pdf", "src/infraestructure/sdk/pdf-report", optionsReport);
                const buffer = await pdfReport.generate() as Buffer;

                resolve(buffer);
            }
            catch(error) {
                reject(new ProcessError('Error generando reporte', error));
            }
        });
    }


}