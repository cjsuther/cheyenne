import PagoContadoDefinicion from '../entities/pago-contado-definicion';
import IPagoContadoDefinicionRepository from '../repositories/pago-contado-definicion-repository';
import PagoContadoDefinicionFilter from '../dto/pago-contado-definicion-filter';
import PagoContadoDefinicionDTO from '../dto/pago-contado-definicion-dto';
import CuentaCorrienteItemService from './cuenta-corriente-item-service';
import { isValidInteger, isValidString, isValidDate, isValidBoolean, isValidFloat, isNull,  } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import Observacion from '../entities/observacion';
import Archivo from '../entities/archivo';
import Etiqueta from '../entities/etiqueta';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import PagoContadoDefinicionAlcanceTasaState from '../dto/pago-contado-definicion-alcance-tasa-state';
import PagoContadoDefinicionAlcanceTasaService from './pago-contado-definicion-alcance-tasa-service';
import PagoContadoDefinicionAlcanceRubroService from './pago-contado-definicion-alcance-rubro-service';
import PagoContadoDefinicionAlcanceRubroState from '../dto/pago-contado-definicion-alcance-rubro-state';
import PagoContadoDefinicionAlcanceGrupoService from './pago-contado-definicion-alcance-grupo-service';
import PagoContadoDefinicionAlcanceGrupoState from '../dto/pago-contado-definicion-alcance-grupo-state';
import PagoContadoDefinicionAlcanceZonaTarifariaService from './pago-contado-definicion-alcance-zona-tarifaria-service';
import PagoContadoDefinicionAlcanceZonaTarifariaState from '../dto/pago-contado-definicion-alcance-zona-tarifaria-state';
import PagoContadoDefinicionAlcanceCondicionFiscalService from './pago-contado-definicion-alcance-condicion-fiscal-service';
import PagoContadoDefinicionAlcanceRubroAfipService from './pago-contado-definicion-alcance-rubro-afip-service';
import PagoContadoDefinicionAlcanceFormaJuridicaService from './pago-contado-definicion-alcance-forma-juridica-service';
import PagoContadoDefinicionTipoVinculoCuentaService from './pago-contado-definicion-tipo-vinculo-cuenta-service';
import PagoContadoDefinicionAlcanceCondicionFiscalState from '../dto/pago-contado-definicion-alcance-condicion-fiscal-state';
import PagoContadoDefinicionAlcanceRubroAfipState from '../dto/pago-contado-definicion-alcance-rubro-afip-state';
import PagoContadoDefinicionAlcanceFormaJuridicaState from '../dto/pago-contado-definicion-alcance-forma-juridica-state';
import PagoContadoDefinicionTipoVinculoCuentaState from '../dto/pago-contado-definicion-tipo-vinculo-cuenta-state';
import PagoContadoDefinicionAlcanceTasa from '../entities/pago-contado-definicion-alcance-tasa';
import PagoContadoDefinicionAlcanceRubro from '../entities/pago-contado-definicion-alcance-rubro';
import PagoContadoDefinicionAlcanceGrupo from '../entities/pago-contado-definicion-alcance-grupo';
import PagoContadoDefinicionAlcanceZonaTarifaria from '../entities/pago-contado-definicion-alcance-zona-tarifaria';
import PagoContadoDefinicionAlcanceCondicionFiscal from '../entities/pago-contado-definicion-alcance-condicion-fiscal';
import PagoContadoDefinicionAlcanceRubroAfip from '../entities/pago-contado-definicion-alcance-rubro-afip';
import PagoContadoDefinicionAlcanceFormaJuridica from '../entities/pago-contado-definicion-alcance-forma-juridica';
import PagoContadoDefinicionTipoVinculoCuenta from '../entities/pago-contado-definicion-tipo-vinculo-cuenta';
import PagoContadoDefinicionValid from '../dto/pago-contado-definicion-valid';
import Configuracion from '../entities/configuracion';
import ConfiguracionService from './configuracion-service';
import VariableService from './variable-service';
import VariableCuenta from '../entities/variable-cuenta';
import VinculoCuentaService from './vinculo-cuenta-service';
import VinculoCuenta from '../entities/vinculo-cuenta';
import IGrupoRepository from '../repositories/grupo-repository';
import Grupo from '../entities/grupo';
import IZonaTarifariaRepository from '../repositories/zona-tarifaria-repository';
import ZonaTarifaria from '../entities/zona-tarifaria';
import ITasaRepository from '../repositories/tasa-repository';
import Tasa from '../entities/tasa';
import ICategoriaTasaRepository from '../repositories/categoria-tasa-repository';
import CategoriaTasa from '../entities/categoria-tasa';
import IComercioRepository from '../repositories/comercio-repository';
import Comercio from '../entities/comercio';
import ICuentaRepository from '../repositories/cuenta-repository';
import Cuenta from '../entities/cuenta';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';
import { ALCANCE_TEMPORAL_TYPE } from '../../infraestructure/sdk/consts/alcanceTemporalType';
import { PAGO_CONTADO_DEFINICION_STATE } from '../../infraestructure/sdk/consts/pagoContadoDefinicionState';
import CuentaCorrienteItemDeudaDTO from '../dto/cuenta-corriente-item-deuda-dto';
import CuentaCorrienteItemDeuda from '../dto/cuenta-corriente-item-deuda';
import CuentaCorrienteItemRecibo from '../dto/cuenta-corriente-item-recibo';
import ValuacionRepositorySequelize from '../../infraestructure/data/repositories-sequelize/valuacion-repository';
import OpcionCuota from '../dto/opcion-cuota';

export default class PagoContadoDefinicionService {

	configuracionService: ConfiguracionService;
	variableService: VariableService;
	vinculoCuentaService: VinculoCuentaService;
	grupoRepository: IGrupoRepository;
	zonaTarifariaRepository: IZonaTarifariaRepository;
	tasaRepository: ITasaRepository;
	categoriaTasaRepository: ICategoriaTasaRepository;
	comercioRepository: IComercioRepository;
	cuentaRepository: ICuentaRepository;
	cuentaCorrienteItemService: CuentaCorrienteItemService;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
	etiquetaService: EtiquetaService;
	pagoContadoDefinicionRepository: IPagoContadoDefinicionRepository;
	pagoContadoDefinicionAlcanceTasaService: PagoContadoDefinicionAlcanceTasaService;
    pagoContadoDefinicionAlcanceRubroService: PagoContadoDefinicionAlcanceRubroService;
	pagoContadoDefinicionAlcanceGrupoService: PagoContadoDefinicionAlcanceGrupoService;
    pagoContadoDefinicionAlcanceZonaTarifariaService: PagoContadoDefinicionAlcanceZonaTarifariaService;
    pagoContadoDefinicionAlcanceCondicionFiscalService: PagoContadoDefinicionAlcanceCondicionFiscalService;
    pagoContadoDefinicionAlcanceRubroAfipService: PagoContadoDefinicionAlcanceRubroAfipService;
	pagoContadoDefinicionAlcanceFormaJuridicaService: PagoContadoDefinicionAlcanceFormaJuridicaService;
	pagoContadoDefinicionTipoVinculoCuentaService: PagoContadoDefinicionTipoVinculoCuentaService;

	constructor(configuracionService: ConfiguracionService, variableService: VariableService, vinculoCuentaService: VinculoCuentaService,
		grupoRepository: IGrupoRepository, zonaTarifariaRepository: IZonaTarifariaRepository,
		tasaRepository: ITasaRepository, categoriaTasaRepository: ICategoriaTasaRepository, comercioRepository: IComercioRepository,
		cuentaRepository: ICuentaRepository, cuentaCorrienteItemService: CuentaCorrienteItemService,
		archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
		pagoContadoDefinicionRepository: IPagoContadoDefinicionRepository,
		pagoContadoDefinicionAlcanceTasaService: PagoContadoDefinicionAlcanceTasaService,
		pagoContadoDefinicionAlcanceRubroService: PagoContadoDefinicionAlcanceRubroService,
		pagoContadoDefinicionAlcanceGrupoService: PagoContadoDefinicionAlcanceGrupoService,
		pagoContadoDefinicionAlcanceZonaTarifariaService: PagoContadoDefinicionAlcanceZonaTarifariaService,
		pagoContadoDefinicionAlcanceCondicionFiscalService: PagoContadoDefinicionAlcanceCondicionFiscalService,
		pagoContadoDefinicionAlcanceRubroAfipService: PagoContadoDefinicionAlcanceRubroAfipService,
		pagoContadoDefinicionAlcanceFormaJuridicaService: PagoContadoDefinicionAlcanceFormaJuridicaService,
		pagoContadoDefinicionTipoVinculoCuentaService: PagoContadoDefinicionTipoVinculoCuentaService) 
	{
		this.archivoService = archivoService;		this.configuracionService = configuracionService;
		this.variableService = variableService;
		this.vinculoCuentaService = vinculoCuentaService;
		this.grupoRepository = grupoRepository;
		this.zonaTarifariaRepository = zonaTarifariaRepository;
		this.tasaRepository = tasaRepository;
		this.categoriaTasaRepository = categoriaTasaRepository;
		this.comercioRepository = comercioRepository;
		this.cuentaRepository = cuentaRepository;
		this.cuentaCorrienteItemService = cuentaCorrienteItemService;
		this.observacionService = observacionService;
		this.etiquetaService = etiquetaService;
		this.pagoContadoDefinicionRepository = pagoContadoDefinicionRepository;
		this.pagoContadoDefinicionAlcanceTasaService = pagoContadoDefinicionAlcanceTasaService;
		this.pagoContadoDefinicionAlcanceRubroService = pagoContadoDefinicionAlcanceRubroService;
		this.pagoContadoDefinicionAlcanceGrupoService = pagoContadoDefinicionAlcanceGrupoService;
		this.pagoContadoDefinicionAlcanceZonaTarifariaService = pagoContadoDefinicionAlcanceZonaTarifariaService;
		this.pagoContadoDefinicionAlcanceCondicionFiscalService = pagoContadoDefinicionAlcanceCondicionFiscalService;
		this.pagoContadoDefinicionAlcanceRubroAfipService = pagoContadoDefinicionAlcanceRubroAfipService;
		this.pagoContadoDefinicionAlcanceFormaJuridicaService = pagoContadoDefinicionAlcanceFormaJuridicaService;
		this.pagoContadoDefinicionTipoVinculoCuentaService = pagoContadoDefinicionTipoVinculoCuentaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(pagoContadoDefinicionFilter: PagoContadoDefinicionFilter) {
		return new Promise( async (resolve, reject) => {
			try {
				let result = null;
                let data = (await this.pagoContadoDefinicionRepository.listByFilter(pagoContadoDefinicionFilter) as Array<PagoContadoDefinicion>).sort((a, b) => a.id - b.id);;
				if (pagoContadoDefinicionFilter.etiqueta.length > 0) {
					const etiquetas = (await this.etiquetaService.listByCodigo(pagoContadoDefinicionFilter.etiqueta) as Array<Etiqueta>).filter(f => f.entidad === "PagoContadoDefinicion");
					const ids = etiquetas.map(x => x.idEntidad);
					result = data.filter(f => ids.includes(f.id));
				}
				else {
					result = data;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCuenta(idCuenta: number, items: Array<CuentaCorrienteItemRecibo>) {
		return new Promise( async (resolve, reject) => {
			try {
				const today = getDateNow(false);

				const cuentaCorrienteItemDeudaDTO = await this.cuentaCorrienteItemService.listByDeuda(idCuenta, true) as CuentaCorrienteItemDeudaDTO;
				const cuentaCorrienteItems = cuentaCorrienteItemDeudaDTO.cuentaCorrienteItems as Array<CuentaCorrienteItemDeuda>;

				//CALCULO DE DATOS
				let tasas = [];
				let grupos = [];
				let zonasTarifarias = [];
				let importeTotalDeudaAdministrativa = 0; //con o sin certificado
				let importeTotalDeudaLegal = 0;
				let importeTotalDeudaAdministrativaSinCertificado = 0;
				let fechaDeudaDesde:Date = null;
				let fechaDeudaHasta:Date = null;
				let esTotalDeudaAdministrativa = true;
				let esTotalDeudaLegal = true;
				let esTotalDeudaAdministrativaSinCertificado = true;
				let partidas = distinctArray(items.map(x => x.numeroPartida)) as number[];
				for (let index=0; index < cuentaCorrienteItems.length; index++) {
					const item = cuentaCorrienteItems[index];
					const importeDeudaAdministrtiva = item.importeSaldo + item.importeRecargos + item.importeMultas;
					const importeDeudaLegal = item.importeHonorarios + item.importeAportes;
					const importeDeudaAdministrtivaSinCertificado = (importeDeudaLegal === 0) ? importeDeudaAdministrtiva : 0;

					if (partidas.includes(item.numeroPartida)) {
						if (isNull(fechaDeudaDesde) || fechaDeudaDesde.getTime() > item.fechaVencimiento2.getTime()) fechaDeudaDesde = item.fechaVencimiento2;
						if (isNull(fechaDeudaHasta) || fechaDeudaHasta.getTime() < item.fechaVencimiento2.getTime()) fechaDeudaHasta = item.fechaVencimiento2;
						//solo consideramos deuda administrativa a los casos donde no hay deuda legal
						importeTotalDeudaAdministrativa += importeDeudaAdministrtiva; 
						importeTotalDeudaLegal += importeDeudaLegal;
						importeTotalDeudaAdministrativaSinCertificado += importeDeudaAdministrtivaSinCertificado;
						const tasa = {
							idTasa: item.idTasa,
							idSubTasa: item.idSubTasa
						};
						if (!tasas.some(f => f.idTasa === tasa.idTasa && f.idSubTasa === tasa.idSubTasa)) {
							tasas.push(tasa);
						}
					}
					else {
						esTotalDeudaAdministrativa = false;
						if (importeDeudaLegal > 0) esTotalDeudaLegal = false;
						if (importeDeudaAdministrtivaSinCertificado > 0) esTotalDeudaAdministrativaSinCertificado = false;
					}
				}
				const importeTotalDeuda = importeTotalDeudaAdministrativa + importeTotalDeudaLegal;

				const cuenta = await this.cuentaRepository.findById(idCuenta) as Cuenta;
				let idRubro = null;
				let esGranContribuyente = false;
				let esPequenioContribuyente = false;
				if (cuenta.idTipoTributo === TRIBUTO_TYPE.COMERCIOS) {
					const comercio = await this.comercioRepository.findById(cuenta.idTipoTributo) as Comercio;
					idRubro = comercio.idRubro;
					esGranContribuyente = comercio.granContribuyente;
					esPequenioContribuyente = !comercio.granContribuyente;
				}
				let grupo = "";
				let zonaTarifaria = "";
				if (cuenta.idTipoTributo === TRIBUTO_TYPE.INMUEBLES) {
					grupos = await this.grupoRepository.list() as Array<Grupo>;
					zonasTarifarias = await this.zonaTarifariaRepository.list() as Array<ZonaTarifaria>;
					grupo = (await this.variableService.findVariableCuentaByCodigo("GRUPO", idCuenta) as VariableCuenta).valor;
					zonaTarifaria = (await this.variableService.findVariableCuentaByCodigo("ZONA_TARIFARIA", idCuenta) as VariableCuenta).valor;
				}
				const vinculosCuenta = await this.vinculoCuentaService.listByTributo(cuenta.idTipoTributo, cuenta.idTributo) as Array<VinculoCuenta>;


				let definiciones: Array<any> = [];
				//VALIDACION DE VIGENCIA Y TIPO DE TRIBUTO (CON EL FILTRO INICIAL)
				let filter = new PagoContadoDefinicionFilter();
				filter.idEstadoPagoContadoDefinicion = PAGO_CONTADO_DEFINICION_STATE.ACTIVO;
				filter.fechaDesde = today;
				filter.fechaHasta = today;
				filter.idTipoTributo = cuenta.idTipoTributo;
				const pagoContadoDefiniciones = await this.pagoContadoDefinicionRepository.listByFilter(filter) as Array<PagoContadoDefinicion>;
				pagoContadoDefiniciones.sort((a, b) => a.descripcion.localeCompare(b.descripcion));

				for (let i=0; i < pagoContadoDefiniciones.length; i++)
				 {
					let sinRestricciones = true;
					let restricciones = [];
					const idPagoContadoDefinicion = pagoContadoDefiniciones[i].id;
					const dto = await this.findById(idPagoContadoDefinicion) as PagoContadoDefinicionDTO;
					const pagoContadoDefinicion = dto.pagoContadoDefinicion;

					//VALIDACION ALCANCE TEMPORAL
					let fechaDesdeAlcanceTemporal:Date = null;
					let fechaHastaAlcanceTemporal:Date = null;
					if (pagoContadoDefinicion.idTipoAlcanceTemporal === ALCANCE_TEMPORAL_TYPE.ESTATICO) {
						if (!isNull(pagoContadoDefinicion.fechaDesdeAlcanceTemporal)) fechaDesdeAlcanceTemporal = pagoContadoDefinicion.fechaDesdeAlcanceTemporal;
						if (!isNull(pagoContadoDefinicion.fechaHastaAlcanceTemporal)) fechaHastaAlcanceTemporal = pagoContadoDefinicion.fechaHastaAlcanceTemporal;
					}
					else if (pagoContadoDefinicion.idTipoAlcanceTemporal === ALCANCE_TEMPORAL_TYPE.DINAMICO) {
						if (pagoContadoDefinicion.mesDesdeAlcanceTemporal > 0) fechaDesdeAlcanceTemporal = new Date(today.getFullYear(), today.getMonth() + pagoContadoDefinicion.mesDesdeAlcanceTemporal, 1);
						if (pagoContadoDefinicion.mesHastaAlcanceTemporal > 0) fechaHastaAlcanceTemporal = new Date(today.getFullYear(), today.getMonth() + pagoContadoDefinicion.mesHastaAlcanceTemporal + 1, -1);
					}
					if (!isNull(pagoContadoDefinicion.fechaDesdeAlcanceTemporal) && fechaDeudaHasta.getTime() < fechaDesdeAlcanceTemporal.getTime()) {
						restricciones.push("Deuda fuera de alcance temporal: Fecha desde");
						sinRestricciones = false;
					}
					if (!isNull(pagoContadoDefinicion.fechaHastaAlcanceTemporal) && fechaDeudaDesde.getTime() > fechaHastaAlcanceTemporal.getTime()) {
						restricciones.push("Deuda fuera de alcance temporal: Fecha hasta");
						sinRestricciones = false;
					}

					//VALIDACION TASAS (Y DERECHOS ESPONTANEOS)
					for (let t=0; t < tasas.length; t++) {
						const idTasa = tasas[t].idTasa;
						if (!dto.pagosContadoDefinicionAlcanceTasa.find(f => f.idSubTasa === tasas[t].idSubTasa))
						{
							const tasa = await this.tasaRepository.findById(idTasa) as Tasa;
							if (pagoContadoDefinicion.aplicaDerechosEspontaneos) {
								const categoria = await this.categoriaTasaRepository.findById(tasa.idCategoriaTasa) as CategoriaTasa;
								if (!categoria.esDerechoEspontaneo) {
									restricciones.push(`La tasa ${tasa.descripcion} no aplica`);
									sinRestricciones = false;
								}
							}
							else {
								restricciones.push(`La tasa ${tasa.descripcion} no aplica`);
								sinRestricciones = false;
							}
						}
					}

					//VALIDACION POR TIPO DE DEUDA
					if (pagoContadoDefinicion.aplicaTotalidadDeudaAdministrativa) {
						if (pagoContadoDefinicion.aplicaDeudaAdministrativa && !esTotalDeudaAdministrativaSinCertificado) {
							restricciones.push(`No está seleccionada la integridad de la deuda administrativa`);
							sinRestricciones = false;
						}
						if (pagoContadoDefinicion.aplicaDeudaLegal && !esTotalDeudaLegal) {
							restricciones.push(`No está seleccionada la integridad de la deuda legal`);
							sinRestricciones = false;
						}
					}
					if (!pagoContadoDefinicion.aplicaDeudaAdministrativa && importeTotalDeudaAdministrativaSinCertificado > 0) {
						restricciones.push("No aplica deuda administrativa");
						sinRestricciones = false;
					}
					if (!pagoContadoDefinicion.aplicaDeudaLegal &&  importeTotalDeudaLegal > 0) {
						restricciones.push("No applica deuda legal");
						sinRestricciones = false;
					}

					//(SOLO COMERCIO)
					if (cuenta.idTipoTributo === TRIBUTO_TYPE.COMERCIOS) {
						//VALIDACION POR TIPO DE CONTRIBUYENTE
						if (!pagoContadoDefinicion.aplicaGranContribuyente && esGranContribuyente ||
							!pagoContadoDefinicion.aplicaPequenioContribuyente && esPequenioContribuyente
						) {
							restricciones.push("No applica al tipo de contribuyente");
							sinRestricciones = false;
						}
						//VALIDACION POR RUBRO
						if (dto.pagosContadoDefinicionAlcanceRubro.length > 0 && 
							!dto.pagosContadoDefinicionAlcanceRubro.find(f => f.idRubro === idRubro)
						) {
							restricciones.push("No aplica el rubro del comercio");
							sinRestricciones = false;
						}
					}

					//(SOLO INMUEBLE)
					if (cuenta.idTipoTributo === TRIBUTO_TYPE.INMUEBLES) {
						//VALIDACION POR GRUPO
						if (dto.pagosContadoDefinicionAlcanceGrupo.length > 0 && 
							!grupos.find(f => f.codigo === grupo && dto.pagosContadoDefinicionAlcanceGrupo.find(x => x.idGrupo === f.id))
						) {
							restricciones.push("No aplica al grupo del inmueble");
							sinRestricciones = false;
						}
						//VALIDACION POR ZONA TARIFARIA
						if (dto.pagosContadoDefinicionAlcanceZonaTarifaria.length > 0 && 
							!zonasTarifarias.find(f => f.codigo === zonaTarifaria && dto.pagosContadoDefinicionAlcanceZonaTarifaria.find(x => x.idZonaTarifaria === f.id))
						) {
							restricciones.push("No aplica a la zona tarifaria del inmueble");
							sinRestricciones = false;
						}
					}

					//VALIDACION POR MONTO DE DEUDA
					if (pagoContadoDefinicion.montoDeudaAdministrativaDesde > 0 && pagoContadoDefinicion.montoDeudaAdministrativaDesde > importeTotalDeuda) {
						restricciones.push("Monto de deuda insuficiente");
						sinRestricciones = false;
					}
					if (pagoContadoDefinicion.montoDeudaAdministrativaHasta > 0 && pagoContadoDefinicion.montoDeudaAdministrativaHasta < importeTotalDeuda) {
						restricciones.push("Monto de deuda superado");
						sinRestricciones = false;
					}

					//TODO: VALIDACION POR RUBROS_AFIP, CONDICION FISCAL Y FORMA JURIDICA

					let definicion = new PagoContadoDefinicionValid();
					definicion.setFromObject(pagoContadoDefinicion);
					definicion.observaciones = restricciones;
					definicion.valid = sinRestricciones;
					definiciones.push(definicion);
				}

				resolve(definiciones);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCuotas(id: number, idCuenta: number, items: Array<CuentaCorrienteItemRecibo>) {
		return new Promise( async (resolve, reject) => {
			try {
				const dto = await this.findById(id) as PagoContadoDefinicionDTO;
				const definicion = dto.pagoContadoDefinicion;

				const cuentaCorrienteItemDeudaDTO = await this.cuentaCorrienteItemService.listByDeuda(idCuenta, true) as CuentaCorrienteItemDeudaDTO;
				const cuentaCorrienteItems = cuentaCorrienteItemDeudaDTO.cuentaCorrienteItems as Array<CuentaCorrienteItemDeuda>;

				let valores = new Valores();

				let partidas = distinctArray(items.map(x => x.numeroPartida)) as number[];
				for (let index=0; index < cuentaCorrienteItems.length; index++) {
					const item = cuentaCorrienteItems[index];
					if (partidas.includes(item.numeroPartida)) {
						valores.importeCapital += item.importeTotal;
						valores.importeNominal += item.importeSaldo;
						valores.importeAccesorios += item.importeAccesorios;
						valores.importeRecargos += item.importeRecargos;
						valores.importeMultas += item.importeMultas;
						valores.importeHonorarios += item.importeHonorarios;
						valores.importeAportes += item.importeAportes;
					}
				}

				const opcionCuotas: Array<OpcionCuota> = [];
				const opcionCuota:OpcionCuota  = await this.processOpcionCuota(valores, definicion) as OpcionCuota;
				opcionCuotas.push(opcionCuota);

				resolve(opcionCuotas);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				let pagoContadoDefinicionDTO = new PagoContadoDefinicionDTO();    	   
				pagoContadoDefinicionDTO.pagoContadoDefinicion = await this.pagoContadoDefinicionRepository.findById(id) as PagoContadoDefinicion;
				if (!pagoContadoDefinicionDTO.pagoContadoDefinicion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				pagoContadoDefinicionDTO.archivos = await this.archivoService.listByEntidad('PagoContadoDefinicion', id) as Array<ArchivoState>;
                pagoContadoDefinicionDTO.observaciones = await this.observacionService.listByEntidad('PagoContadoDefinicion', id) as Array<ObservacionState>;
                pagoContadoDefinicionDTO.etiquetas = await this.etiquetaService.listByEntidad('PagoContadoDefinicion', id) as Array<EtiquetaState>;
				pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceTasa = await this.pagoContadoDefinicionAlcanceTasaService.listByPagoContadoDefinicion(id) as Array<PagoContadoDefinicionAlcanceTasaState>;
				pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceRubro = await this.pagoContadoDefinicionAlcanceRubroService.listByPagoContadoDefinicion(id) as Array<PagoContadoDefinicionAlcanceRubroState>;
				pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceGrupo = await this.pagoContadoDefinicionAlcanceGrupoService.listByPagoContadoDefinicion(id) as Array<PagoContadoDefinicionAlcanceGrupoState>;
				pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceZonaTarifaria = await this.pagoContadoDefinicionAlcanceZonaTarifariaService.listByPagoContadoDefinicion(id) as Array<PagoContadoDefinicionAlcanceZonaTarifariaState>;
				pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceCondicionFiscal = await this.pagoContadoDefinicionAlcanceCondicionFiscalService.listByPagoContadoDefinicion(id) as Array<PagoContadoDefinicionAlcanceCondicionFiscalState>;
				pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceRubroAfip = await this.pagoContadoDefinicionAlcanceRubroAfipService.listByPagoContadoDefinicion(id) as Array<PagoContadoDefinicionAlcanceRubroAfipState>;
				pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceFormaJuridica = await this.pagoContadoDefinicionAlcanceFormaJuridicaService.listByPagoContadoDefinicion(id) as Array<PagoContadoDefinicionAlcanceFormaJuridicaState>;
				pagoContadoDefinicionDTO.pagosContadoDefinicionTipoVinculoCuenta = await this.pagoContadoDefinicionTipoVinculoCuentaService.listByPagoContadoDefinicion(id) as Array<PagoContadoDefinicionTipoVinculoCuentaState>;

				resolve(pagoContadoDefinicionDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, pagoContadoDefinicionDTO: PagoContadoDefinicionDTO) {
		return new Promise( async (resolve, reject) => {
			let pagoContadoDefinicion = pagoContadoDefinicionDTO.pagoContadoDefinicion;
			try {
				if (
					!isValidInteger(pagoContadoDefinicion.idEstadoPagoContadoDefinicion, false) ||
					!isValidInteger(pagoContadoDefinicion.idTipoPlanPago, true) ||
					!isValidInteger(pagoContadoDefinicion.idTipoTributo, true) ||
					!isValidInteger(pagoContadoDefinicion.idTasaPagoContado, false) ||
					!isValidInteger(pagoContadoDefinicion.idSubTasaPagoContado, false) ||
					!isValidInteger(pagoContadoDefinicion.idTasaSellados, false) ||
					!isValidInteger(pagoContadoDefinicion.idSubTasaSellados, false) ||
					!isValidInteger(pagoContadoDefinicion.idTasaGastosCausidicos, false) ||
					!isValidInteger(pagoContadoDefinicion.idSubTasaGastosCausidicos, false) ||
					!isValidString(pagoContadoDefinicion.codigo, true) ||
					!isValidString(pagoContadoDefinicion.descripcion, true) ||
					!isValidDate(pagoContadoDefinicion.fechaDesde, false) ||
					!isValidDate(pagoContadoDefinicion.fechaHasta, false) ||
					!isValidInteger(pagoContadoDefinicion.idTipoAlcanceTemporal, false) ||
					!isValidDate(pagoContadoDefinicion.fechaDesdeAlcanceTemporal, false) ||
					!isValidDate(pagoContadoDefinicion.fechaHastaAlcanceTemporal, false) ||
					!isValidInteger(pagoContadoDefinicion.mesDesdeAlcanceTemporal, false) ||
					!isValidInteger(pagoContadoDefinicion.mesHastaAlcanceTemporal, false) ||
					!isValidBoolean(pagoContadoDefinicion.aplicaDerechosEspontaneos) ||
					!isValidBoolean(pagoContadoDefinicion.aplicaTotalidadDeudaAdministrativa) ||
					!isValidBoolean(pagoContadoDefinicion.aplicaDeudaAdministrativa) ||
					!isValidBoolean(pagoContadoDefinicion.aplicaDeudaLegal) ||
					!isValidBoolean(pagoContadoDefinicion.aplicaGranContribuyente) ||
					!isValidBoolean(pagoContadoDefinicion.aplicaPequenioContribuyente) ||
					!isValidFloat(pagoContadoDefinicion.montoDeudaAdministrativaDesde, false) ||
					!isValidFloat(pagoContadoDefinicion.montoDeudaAdministrativaHasta, false) ||
					!isValidInteger(pagoContadoDefinicion.idViaConsolidacion, false) ||
					!isValidFloat(pagoContadoDefinicion.porcentajeQuitaRecargos, false) ||
					!isValidFloat(pagoContadoDefinicion.porcentajeQuitaMultaInfracciones, false) ||
					!isValidFloat(pagoContadoDefinicion.porcentajeQuitaHonorarios, false) ||
					!isValidFloat(pagoContadoDefinicion.porcentajeQuitaAportes, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoContadoDefinicion.id = null;
				pagoContadoDefinicion.idUsuarioCreacion = idUsuario;
				pagoContadoDefinicion.fechaCreacion = getDateNow(true);
				pagoContadoDefinicion.idEstadoPagoContadoDefinicion = 460;
				pagoContadoDefinicion.fechaDesde = getDateNow(false);
				pagoContadoDefinicion.aplicaDeudaAdministrativa = true;
				pagoContadoDefinicion.aplicaDeudaLegal = true;
				pagoContadoDefinicion.aplicaGranContribuyente = true;
				pagoContadoDefinicion.aplicaPequenioContribuyente = true;
				if (pagoContadoDefinicion.idTipoAlcanceTemporal === 0) pagoContadoDefinicion.idTipoAlcanceTemporal = null;
				if (pagoContadoDefinicion.idTasaPagoContado === 0) pagoContadoDefinicion.idTasaPagoContado = null;
				if (pagoContadoDefinicion.idSubTasaPagoContado === 0) pagoContadoDefinicion.idSubTasaPagoContado = null;
				if (pagoContadoDefinicion.idTasaSellados === 0) pagoContadoDefinicion.idTasaSellados = null;
				if (pagoContadoDefinicion.idSubTasaSellados === 0) pagoContadoDefinicion.idSubTasaSellados = null;
				if (pagoContadoDefinicion.idTasaGastosCausidicos === 0) pagoContadoDefinicion.idTasaGastosCausidicos = null;
				if (pagoContadoDefinicion.idSubTasaGastosCausidicos === 0) pagoContadoDefinicion.idSubTasaGastosCausidicos = null;
				
				pagoContadoDefinicionDTO.pagoContadoDefinicion = await this.pagoContadoDefinicionRepository.add(pagoContadoDefinicionDTO.pagoContadoDefinicion);
				resolve(pagoContadoDefinicionDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, idUsuario: number, pagoContadoDefinicionDTO: PagoContadoDefinicionDTO) {
		const resultTransaction = this.pagoContadoDefinicionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let pagoContadoDefinicion = pagoContadoDefinicionDTO.pagoContadoDefinicion;
					if (
						!isValidInteger(pagoContadoDefinicion.idEstadoPagoContadoDefinicion, true) ||
						!isValidInteger(pagoContadoDefinicion.idTipoPlanPago, true) ||
						!isValidInteger(pagoContadoDefinicion.idTipoTributo, true) ||
						!isValidInteger(pagoContadoDefinicion.idTasaPagoContado, true) ||
						!isValidInteger(pagoContadoDefinicion.idSubTasaPagoContado, true) ||
						!isValidInteger(pagoContadoDefinicion.idTasaSellados, false) ||
						!isValidInteger(pagoContadoDefinicion.idSubTasaSellados, false) ||
						!isValidInteger(pagoContadoDefinicion.idTasaGastosCausidicos, false) ||
						!isValidInteger(pagoContadoDefinicion.idSubTasaGastosCausidicos, false) ||
						!isValidString(pagoContadoDefinicion.codigo, true) ||
						!isValidString(pagoContadoDefinicion.descripcion, true) ||
						!isValidDate(pagoContadoDefinicion.fechaDesde, true) ||
						!isValidDate(pagoContadoDefinicion.fechaHasta, false) ||
						!isValidInteger(pagoContadoDefinicion.idTipoAlcanceTemporal, true) ||
						!isValidDate(pagoContadoDefinicion.fechaDesdeAlcanceTemporal, false) ||
						!isValidDate(pagoContadoDefinicion.fechaHastaAlcanceTemporal, false) ||
						!isValidInteger(pagoContadoDefinicion.mesDesdeAlcanceTemporal, false) ||
						!isValidInteger(pagoContadoDefinicion.mesHastaAlcanceTemporal, false) ||
						!isValidBoolean(pagoContadoDefinicion.aplicaDerechosEspontaneos) ||
						!isValidBoolean(pagoContadoDefinicion.aplicaTotalidadDeudaAdministrativa) ||
						!isValidBoolean(pagoContadoDefinicion.aplicaDeudaAdministrativa) ||
						!isValidBoolean(pagoContadoDefinicion.aplicaDeudaLegal) ||
						!isValidBoolean(pagoContadoDefinicion.aplicaGranContribuyente) ||
						!isValidBoolean(pagoContadoDefinicion.aplicaPequenioContribuyente) ||
						!isValidFloat(pagoContadoDefinicion.montoDeudaAdministrativaDesde, false) ||
						!isValidFloat(pagoContadoDefinicion.montoDeudaAdministrativaHasta, false) ||
						!isValidInteger(pagoContadoDefinicion.idViaConsolidacion, true) ||
						!isValidFloat(pagoContadoDefinicion.porcentajeQuitaRecargos, false) ||
						!isValidFloat(pagoContadoDefinicion.porcentajeQuitaMultaInfracciones, false) ||
						!isValidFloat(pagoContadoDefinicion.porcentajeQuitaHonorarios, false) ||
						!isValidFloat(pagoContadoDefinicion.porcentajeQuitaAportes, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					if (pagoContadoDefinicion.idTasaSellados === 0) pagoContadoDefinicion.idTasaSellados = null;
					if (pagoContadoDefinicion.idSubTasaSellados === 0) pagoContadoDefinicion.idSubTasaSellados = null;
					if (pagoContadoDefinicion.idTasaGastosCausidicos === 0) pagoContadoDefinicion.idTasaGastosCausidicos = null;
					if (pagoContadoDefinicion.idSubTasaGastosCausidicos === 0) pagoContadoDefinicion.idSubTasaGastosCausidicos = null;	
					
					pagoContadoDefinicionDTO.pagoContadoDefinicion = await this.pagoContadoDefinicionRepository.modify(id, pagoContadoDefinicionDTO.pagoContadoDefinicion);
					if (!pagoContadoDefinicionDTO) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executes = [];

					pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceTasa.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.pagoContadoDefinicionAlcanceTasaService.add(row as PagoContadoDefinicionAlcanceTasa));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.pagoContadoDefinicionAlcanceTasaService.modify(row.id, row as PagoContadoDefinicionAlcanceTasa));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.pagoContadoDefinicionAlcanceTasaService.remove(row.id));
                        }
                    });

					pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceRubro.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.pagoContadoDefinicionAlcanceRubroService.add(row as PagoContadoDefinicionAlcanceRubro));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.pagoContadoDefinicionAlcanceRubroService.modify(row.id, row as PagoContadoDefinicionAlcanceRubro));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.pagoContadoDefinicionAlcanceRubroService.remove(row.id));
                        }
                    });

					pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceGrupo.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.pagoContadoDefinicionAlcanceGrupoService.add(row as PagoContadoDefinicionAlcanceGrupo));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.pagoContadoDefinicionAlcanceGrupoService.modify(row.id, row as PagoContadoDefinicionAlcanceGrupo));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.pagoContadoDefinicionAlcanceGrupoService.remove(row.id));
                        }
                    });

					pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceZonaTarifaria.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.pagoContadoDefinicionAlcanceZonaTarifariaService.add(row as PagoContadoDefinicionAlcanceZonaTarifaria));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.pagoContadoDefinicionAlcanceZonaTarifariaService.modify(row.id, row as PagoContadoDefinicionAlcanceZonaTarifaria));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.pagoContadoDefinicionAlcanceZonaTarifariaService.remove(row.id));
                        }
                    });

					pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceCondicionFiscal.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.pagoContadoDefinicionAlcanceCondicionFiscalService.add(row as PagoContadoDefinicionAlcanceCondicionFiscal));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.pagoContadoDefinicionAlcanceCondicionFiscalService.modify(row.id, row as PagoContadoDefinicionAlcanceCondicionFiscal));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.pagoContadoDefinicionAlcanceCondicionFiscalService.remove(row.id));
                        }
                    });

					pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceRubroAfip.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.pagoContadoDefinicionAlcanceRubroAfipService.add(row as PagoContadoDefinicionAlcanceRubroAfip));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.pagoContadoDefinicionAlcanceRubroAfipService.modify(row.id, row as PagoContadoDefinicionAlcanceRubroAfip));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.pagoContadoDefinicionAlcanceRubroAfipService.remove(row.id));
                        }
                    });

					pagoContadoDefinicionDTO.pagosContadoDefinicionAlcanceFormaJuridica.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.pagoContadoDefinicionAlcanceFormaJuridicaService.add(row as PagoContadoDefinicionAlcanceFormaJuridica));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.pagoContadoDefinicionAlcanceFormaJuridicaService.modify(row.id, row as PagoContadoDefinicionAlcanceFormaJuridica));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.pagoContadoDefinicionAlcanceFormaJuridicaService.remove(row.id));
                        }
                    });

					pagoContadoDefinicionDTO.pagosContadoDefinicionTipoVinculoCuenta.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.pagoContadoDefinicionTipoVinculoCuentaService.add(row as PagoContadoDefinicionTipoVinculoCuenta));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.pagoContadoDefinicionTipoVinculoCuentaService.modify(row.id, row as PagoContadoDefinicionTipoVinculoCuenta));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.pagoContadoDefinicionTipoVinculoCuentaService.remove(row.id));
                        }
                    });

					pagoContadoDefinicionDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = pagoContadoDefinicion.id;
							executes.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							executes.push(this.archivoService.remove(row.id));
						}
					});
					pagoContadoDefinicionDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = pagoContadoDefinicion.id;
							executes.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							executes.push(this.observacionService.remove(row.id));
						}
					});
					pagoContadoDefinicionDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = pagoContadoDefinicion.id;
							executes.push(this.etiquetaService.add(row as Etiqueta));
						}
						else if (row.state === 'r') {
							executes.push(this.etiquetaService.remove(row.id));
						}
					});

					Promise.all(executes)
					.then(responses => {
						this.findById(id).then(resolve).catch(reject);
					})
					.catch((error) => {
						reject(error);
					});

				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async remove(id: number) {
        const resultTransaction = this.pagoContadoDefinicionRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let pagoContadoDefinicionDTO = new PagoContadoDefinicionDTO();            
                    pagoContadoDefinicionDTO.pagoContadoDefinicion = await this.pagoContadoDefinicionRepository.findById(id) as PagoContadoDefinicion;
                    if (!pagoContadoDefinicionDTO.pagoContadoDefinicion) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }

                    await this.pagoContadoDefinicionAlcanceTasaService.removeByPagoContadoDefinicion(id);
					await this.pagoContadoDefinicionAlcanceRubroService.removeByPagoContadoDefinicion(id);
					await this.pagoContadoDefinicionAlcanceGrupoService.removeByPagoContadoDefinicion(id);
					await this.pagoContadoDefinicionAlcanceZonaTarifariaService.removeByPagoContadoDefinicion(id);
					await this.pagoContadoDefinicionAlcanceCondicionFiscalService.removeByPagoContadoDefinicion(id);
					await this.pagoContadoDefinicionAlcanceRubroAfipService.removeByPagoContadoDefinicion(id);
					await this.pagoContadoDefinicionAlcanceFormaJuridicaService.removeByPagoContadoDefinicion(id);
					await this.pagoContadoDefinicionTipoVinculoCuentaService.removeByPagoContadoDefinicion(id);
					
					const result = await this.pagoContadoDefinicionRepository.remove(id);
					if (!result) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}
					resolve(result);
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}
	

	private async processOpcionCuota(valores: Valores, pagoContadoDefinicion: PagoContadoDefinicion) {
		
		let opcionCuota = new OpcionCuota();

		opcionCuota.importeNominal = valores.importeNominal;
		opcionCuota.importeAccesorios = valores.importeAccesorios;
		opcionCuota.importeCapital = valores.importeCapital;
		
		opcionCuota.importeQuitaRecargos = (valores.importeRecargos * pagoContadoDefinicion.porcentajeQuitaRecargos / 100);
		opcionCuota.importeQuitaMultaInfracciones = (valores.importeMultas * pagoContadoDefinicion.porcentajeQuitaMultaInfracciones / 100);
		opcionCuota.importeQuitaHonorarios = (valores.importeHonorarios * pagoContadoDefinicion.porcentajeQuitaHonorarios / 100);		
		opcionCuota.importeQuitaAportes = (valores.importeAportes * pagoContadoDefinicion.porcentajeQuitaAportes / 100);
		opcionCuota.importeQuita = (opcionCuota.importeQuitaRecargos + opcionCuota.importeQuitaMultaInfracciones + opcionCuota.importeQuitaHonorarios + opcionCuota.importeQuitaAportes);
		
		opcionCuota.importePlanPago = (opcionCuota.importeCapital - opcionCuota.importeQuita);

		return opcionCuota;
	}

}

class Valores {

	importeCapital = 0;
	importeNominal = 0;
	importeAccesorios = 0;
	importeRecargos = 0;
	importeHonorarios = 0;
	importeMultas = 0;
	importeAportes = 0;

}
