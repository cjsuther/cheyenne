import PlanPagoDefinicion from '../entities/plan-pago-definicion';
import IPlanPagoDefinicionRepository from '../repositories/plan-pago-definicion-repository';
import PlanPagoDefinicionFilter from '../dto/plan-pago-definicion-filter';
import PlanPagoDefinicionDTO from '../dto/plan-pago-definicion-dto';
import CuentaCorrienteItemService from './cuenta-corriente-item-service';
import { isValidInteger, isValidString, isValidDate, isValidBoolean, isValidFloat, isNull,  } from '../../infraestructure/sdk/utils/validator';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import CuentaCorrienteItemRecibo from '../dto/cuenta-corriente-item-recibo';
import CuentaCorrienteItemDeudaDTO from '../dto/cuenta-corriente-item-deuda-dto';
import CuentaCorrienteItemDeuda from '../dto/cuenta-corriente-item-deuda';
import Configuracion from '../entities/configuracion';
import ConfiguracionService from './configuracion-service';
import OpcionCuota from '../dto/opcion-cuota';
import PlanPagoDefinicionCuotas from '../dto/plan-pago-definicion-cuotas';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';

import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import PlanPagoDefinicionAlcanceTasa from '../entities/plan-pago-definicion-alcance-tasa';
import PlanPagoDefinicionAlcanceTasaService from './plan-pago-definicion-alcance-tasa-service';
import PlanPagoDefinicionAlcanceTasaState from '../dto/plan-pago-definicion-alcance-tasa-state';
import PlanPagoDefinicionAlcanceRubro from '../entities/plan-pago-definicion-alcance-rubro';
import PlanPagoDefinicionAlcanceRubroService from './plan-pago-definicion-alcance-rubro-service';
import PlanPagoDefinicionAlcanceRubroState from '../dto/plan-pago-definicion-alcance-rubro-state';
import PlanPagoDefinicionAlcanceGrupo from '../entities/plan-pago-definicion-alcance-grupo';
import PlanPagoDefinicionAlcanceGrupoService from './plan-pago-definicion-alcance-grupo-service';
import PlanPagoDefinicionAlcanceGrupoState from '../dto/plan-pago-definicion-alcance-grupo-state';
import PlanPagoDefinicionAlcanceZonaTarifaria from '../entities/plan-pago-definicion-alcance-zona-tarifaria';
import PlanPagoDefinicionAlcanceZonaTarifariaService from './plan-pago-definicion-alcance-zona-tarifaria-service';
import PlanPagoDefinicionAlcanceZonaTarifariaState from '../dto/plan-pago-definicion-alcance-zona-tarifaria-state';
import PlanPagoDefinicionAlcanceCondicionFiscalService from './plan-pago-definicion-alcance-condicion-fiscal-service';
import PlanPagoDefinicionAlcanceCondicionFiscalState from '../dto/plan-pago-definicion-alcance-condicion-fiscal-state';
import PlanPagoDefinicionAlcanceCondicionFiscal from '../entities/plan-pago-definicion-alcance-condicion-fiscal';
import PlanPagoDefinicionAlcanceRubroAfip from '../entities/plan-pago-definicion-alcance-rubro-afip';
import PlanPagoDefinicionAlcanceRubroAfipService from './plan-pago-definicion-alcance-rubro-afip-service';
import PlanPagoDefinicionAlcanceRubroAfipState from '../dto/plan-pago-definicion-alcance-rubro-afip-state';
import PlanPagoDefinicionAlcanceFormaJuridica from '../entities/plan-pago-definicion-alcance-forma-juridica';
import PlanPagoDefinicionAlcanceFormaJuridicaService from './plan-pago-definicion-alcance-forma-juridica-service';
import PlanPagoDefinicionAlcanceFormaJuridicaState from '../dto/plan-pago-definicion-alcance-forma-juridica-state';
import PlanPagoDefinicionQuitaCuota from '../entities/plan-pago-definicion-quita-cuota';
import PlanPagoDefinicionQuitaCuotaService from './plan-pago-definicion-quita-cuota-service';
import PlanPagoDefinicionQuitaCuotaState from '../dto/plan-pago-definicion-quita-cuota-state';
import PlanPagoDefinicionInteres from '../entities/plan-pago-definicion-interes';
import PlanPagoDefinicionInteresService from './plan-pago-definicion-interes-service';
import PlanPagoDefinicionInteresState from '../dto/plan-pago-definicion-interes-state';
import PlanPagoDefinicionTipoVinculoCuenta from '../entities/plan-pago-definicion-tipo-vinculo-cuenta';
import PlanPagoDefinicionTipoVinculoCuentaService from './plan-pago-definicion-tipo-vinculo-cuenta-service';
import PlanPagoDefinicionTipoVinculoCuentaState from '../dto/plan-pago-definicion-tipo-vinculo-cuenta-state';
import PlanPagoDefinicionValid from '../dto/plan-pago-definicion-valid';
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
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';
import { PLAN_PAGO_DEFINICION_STATE } from '../../infraestructure/sdk/consts/planPagoDefinicionState';
import { ALCANCE_TEMPORAL_TYPE } from '../../infraestructure/sdk/consts/alcanceTemporalType';
import { IMetodoInteres, MetodoSimple, MetodoFrances } from './tools/metodo-interes';
import { CALCULO_INTERES_TYPE } from '../../infraestructure/sdk/consts/calculoInteresType';


export default class PlanPagoDefinicionService {

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
	planPagoDefinicionRepository: IPlanPagoDefinicionRepository;
	planPagoDefinicionAlcanceTasaService: PlanPagoDefinicionAlcanceTasaService;
	planPagoDefinicionAlcanceRubroService: PlanPagoDefinicionAlcanceRubroService;
	planPagoDefinicionAlcanceGrupoService: PlanPagoDefinicionAlcanceGrupoService;
	planPagoDefinicionAlcanceZonaTarifariaService: PlanPagoDefinicionAlcanceZonaTarifariaService;
	planPagoDefinicionAlcanceCondicionFiscalService: PlanPagoDefinicionAlcanceCondicionFiscalService;
	planPagoDefinicionAlcanceRubroAfipService: PlanPagoDefinicionAlcanceRubroAfipService;
	planPagoDefinicionAlcanceFormaJuridicaService: PlanPagoDefinicionAlcanceFormaJuridicaService;
	planPagoDefinicionQuitaCuotaService: PlanPagoDefinicionQuitaCuotaService;
	planPagoDefinicionInteresService: PlanPagoDefinicionInteresService;
	planPagoDefinicionTipoVinculoCuentaService: PlanPagoDefinicionTipoVinculoCuentaService;

	constructor(configuracionService: ConfiguracionService, variableService: VariableService, vinculoCuentaService: VinculoCuentaService,
		grupoRepository: IGrupoRepository, zonaTarifariaRepository: IZonaTarifariaRepository,
		tasaRepository: ITasaRepository, categoriaTasaRepository: ICategoriaTasaRepository, comercioRepository: IComercioRepository,
		cuentaRepository: ICuentaRepository, cuentaCorrienteItemService: CuentaCorrienteItemService,
		archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
		planPagoDefinicionRepository: IPlanPagoDefinicionRepository,
		planPagoDefinicionAlcanceTasaService: PlanPagoDefinicionAlcanceTasaService,
		planPagoDefinicionAlcanceRubroService: PlanPagoDefinicionAlcanceRubroService,
		planPagoDefinicionAlcanceGrupoService: PlanPagoDefinicionAlcanceGrupoService,
		planPagoDefinicionAlcanceZonaTarifariaService: PlanPagoDefinicionAlcanceZonaTarifariaService,
		planPagoDefinicionAlcanceCondicionFiscalService: PlanPagoDefinicionAlcanceCondicionFiscalService,
		planPagoDefinicionAlcanceRubroAfipService: PlanPagoDefinicionAlcanceRubroAfipService,
		planPagoDefinicionAlcanceFormaJuridicaService: PlanPagoDefinicionAlcanceFormaJuridicaService,
		planPagoDefinicionQuitaCuotaService: PlanPagoDefinicionQuitaCuotaService,
		planPagoDefinicionInteresService: PlanPagoDefinicionInteresService,
		planPagoDefinicionTipoVinculoCuentaService: PlanPagoDefinicionTipoVinculoCuentaService)
	{
		this.configuracionService = configuracionService;
		this.variableService = variableService;
		this.vinculoCuentaService = vinculoCuentaService;
		this.grupoRepository = grupoRepository;
		this.zonaTarifariaRepository = zonaTarifariaRepository;
		this.tasaRepository = tasaRepository;
		this.categoriaTasaRepository = categoriaTasaRepository;
		this.comercioRepository = comercioRepository;
		this.cuentaRepository = cuentaRepository;
		this.cuentaCorrienteItemService = cuentaCorrienteItemService;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
		this.etiquetaService = etiquetaService;
		this.planPagoDefinicionRepository = planPagoDefinicionRepository;
		this.planPagoDefinicionAlcanceTasaService = planPagoDefinicionAlcanceTasaService;
		this.planPagoDefinicionAlcanceRubroService = planPagoDefinicionAlcanceRubroService;
		this.planPagoDefinicionAlcanceGrupoService = planPagoDefinicionAlcanceGrupoService;
		this.planPagoDefinicionAlcanceZonaTarifariaService = planPagoDefinicionAlcanceZonaTarifariaService;
		this.planPagoDefinicionAlcanceCondicionFiscalService = planPagoDefinicionAlcanceCondicionFiscalService;
		this.planPagoDefinicionAlcanceRubroAfipService = planPagoDefinicionAlcanceRubroAfipService;
		this.planPagoDefinicionAlcanceFormaJuridicaService = planPagoDefinicionAlcanceFormaJuridicaService;
		this.planPagoDefinicionQuitaCuotaService = planPagoDefinicionQuitaCuotaService;
		this.planPagoDefinicionInteresService = planPagoDefinicionInteresService;
		this.planPagoDefinicionTipoVinculoCuentaService = planPagoDefinicionTipoVinculoCuentaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoDefinicionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(planPagoDefinicionFilter: PlanPagoDefinicionFilter) {
		return new Promise( async (resolve, reject) => {
			try {
				let result = null;
                let data = (await this.planPagoDefinicionRepository.listByFilter(planPagoDefinicionFilter) as Array<PlanPagoDefinicion>).sort((a, b) => a.id - b.id);;
				if (planPagoDefinicionFilter.etiqueta.length > 0) {
					const etiquetas = (await this.etiquetaService.listByCodigo(planPagoDefinicionFilter.etiqueta) as Array<Etiqueta>).filter(f => f.entidad === "PlanPagoDefinicion");
					const ids = etiquetas.map(x => x.idEntidad);
					result = data.filter(f => ids.includes(f.id));
				}
				else {
					result = data;
				}
				result.sort((a, b) => b.id - a.id);
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
					const comercio = await this.comercioRepository.findById(cuenta.id) as Comercio;
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
				let filter = new PlanPagoDefinicionFilter();
				filter.idEstadoPlanPagoDefinicion = PLAN_PAGO_DEFINICION_STATE.ACTIVO;
				filter.fechaDesde = today;
				filter.fechaHasta = today;
				filter.idTipoTributo = cuenta.idTipoTributo;
				const planPagoDefiniciones = await this.planPagoDefinicionRepository.listByFilter(filter) as Array<PlanPagoDefinicion>;
				planPagoDefiniciones.sort((a, b) => a.descripcion.localeCompare(b.descripcion));

				for (let i=0; i < planPagoDefiniciones.length; i++)
				 {
					let sinRestricciones = true;
					let restricciones = [];
					const idPlanPagoDefinicion = planPagoDefiniciones[i].id;
					const dto = await this.findById(idPlanPagoDefinicion) as PlanPagoDefinicionDTO;
					const planPagoDefinicion = dto.planPagoDefinicion;

					//VALIDACION ALCANCE TEMPORAL
					let fechaDesdeAlcanceTemporal:Date = null;
					let fechaHastaAlcanceTemporal:Date = null;
					if (planPagoDefinicion.idTipoAlcanceTemporal === ALCANCE_TEMPORAL_TYPE.ESTATICO) {
						if (!isNull(planPagoDefinicion.fechaDesdeAlcanceTemporal)) fechaDesdeAlcanceTemporal = planPagoDefinicion.fechaDesdeAlcanceTemporal;
						if (!isNull(planPagoDefinicion.fechaHastaAlcanceTemporal)) fechaHastaAlcanceTemporal = planPagoDefinicion.fechaHastaAlcanceTemporal;
					}
					else if (planPagoDefinicion.idTipoAlcanceTemporal === ALCANCE_TEMPORAL_TYPE.DINAMICO) {
						if (planPagoDefinicion.mesDesdeAlcanceTemporal > 0) fechaDesdeAlcanceTemporal = new Date(today.getFullYear(), today.getMonth() + planPagoDefinicion.mesDesdeAlcanceTemporal, 1);
						if (planPagoDefinicion.mesHastaAlcanceTemporal > 0) fechaHastaAlcanceTemporal = new Date(today.getFullYear(), today.getMonth() + planPagoDefinicion.mesHastaAlcanceTemporal + 1, -1);
					}
					if (!isNull(planPagoDefinicion.fechaDesdeAlcanceTemporal) && fechaDeudaHasta.getTime() < fechaDesdeAlcanceTemporal.getTime()) {
						restricciones.push("Deuda fuera de alcance temporal: Fecha desde");
						sinRestricciones = false;
					}
					if (!isNull(planPagoDefinicion.fechaHastaAlcanceTemporal) && fechaDeudaDesde.getTime() > fechaHastaAlcanceTemporal.getTime()) {
						restricciones.push("Deuda fuera de alcance temporal: Fecha hasta");
						sinRestricciones = false;
					}

					//VALIDACION TASAS (Y DERECHOS ESPONTANEOS)
					for (let t=0; t < tasas.length; t++) {
						const idTasa = tasas[t].idTasa;
						if (!dto.planPagosDefinicionAlcanceTasa.find(f => f.idSubTasa === tasas[t].idSubTasa))
						{
							const tasa = await this.tasaRepository.findById(idTasa) as Tasa;
							if (planPagoDefinicion.aplicaDerechosEspontaneos) {
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
					if (planPagoDefinicion.aplicaTotalidadDeudaAdministrativa) {
						if (planPagoDefinicion.aplicaDeudaAdministrativa && !esTotalDeudaAdministrativaSinCertificado) {
							restricciones.push(`No está seleccionada la integridad de la deuda administrativa`);
							sinRestricciones = false;
						}
						if (planPagoDefinicion.aplicaDeudaLegal && !esTotalDeudaLegal) {
							restricciones.push(`No está seleccionada la integridad de la deuda legal`);
							sinRestricciones = false;
						}
					}
					if (!planPagoDefinicion.aplicaDeudaAdministrativa && importeTotalDeudaAdministrativaSinCertificado > 0) {
						restricciones.push("No aplica deuda administrativa");
						sinRestricciones = false;
					}
					if (!planPagoDefinicion.aplicaDeudaLegal &&  importeTotalDeudaLegal > 0) {
						restricciones.push("No applica deuda legal");
						sinRestricciones = false;
					}

					//(SOLO COMERCIO)
					if (cuenta.idTipoTributo === TRIBUTO_TYPE.COMERCIOS) {
						//VALIDACION POR TIPO DE CONTRIBUYENTE
						if (!planPagoDefinicion.aplicaGranContribuyente && esGranContribuyente ||
							!planPagoDefinicion.aplicaPequenioContribuyente && esPequenioContribuyente
						) {
							restricciones.push("No applica al tipo de contribuyente");
							sinRestricciones = false;
						}
						//VALIDACION POR RUBRO
						if (dto.planPagosDefinicionAlcanceRubro.length > 0 && 
							!dto.planPagosDefinicionAlcanceRubro.find(f => f.idRubro === idRubro)
						) {
							restricciones.push("No aplica el rubro del comercio");
							sinRestricciones = false;
						}
					}

					//(SOLO INMUEBLE)
					if (cuenta.idTipoTributo === TRIBUTO_TYPE.INMUEBLES) {
						//VALIDACION POR GRUPO
						if (dto.planPagosDefinicionAlcanceGrupo.length > 0 && 
							!grupos.find(f => f.codigo === grupo && dto.planPagosDefinicionAlcanceGrupo.find(x => x.idGrupo === f.id))
						) {
							restricciones.push("No aplica al grupo del inmueble");
							sinRestricciones = false;
						}
						//VALIDACION POR ZONA TARIFARIA
						if (dto.planPagosDefinicionAlcanceZonaTarifaria.length > 0 && 
							!zonasTarifarias.find(f => f.codigo === zonaTarifaria && dto.planPagosDefinicionAlcanceZonaTarifaria.find(x => x.idZonaTarifaria === f.id))
						) {
							restricciones.push("No aplica a la zona tarifaria del inmueble");
							sinRestricciones = false;
						}
					}

					//VALIDACION POR MONTO DE DEUDA
					if (planPagoDefinicion.montoDeudaAdministrativaDesde > 0 && planPagoDefinicion.montoDeudaAdministrativaDesde > importeTotalDeuda) {
						restricciones.push("Monto de deuda insuficiente");
						sinRestricciones = false;
					}
					if (planPagoDefinicion.montoDeudaAdministrativaHasta > 0 && planPagoDefinicion.montoDeudaAdministrativaHasta < importeTotalDeuda) {
						restricciones.push("Monto de deuda superado");
						sinRestricciones = false;
					}

					//VALIDACION POR VINCULO CUENTA
					let tipoVinculoValido = false
					for (let v=0; v < dto.planPagosDefinicionTipoVinculoCuenta.length; v++) {
						const tipoVinculo = dto.planPagosDefinicionTipoVinculoCuenta[v];
						if (vinculosCuenta.find(f => f.idTipoVinculoCuenta === tipoVinculo.idTipoVinculoCuenta)) {
							tipoVinculoValido = true;
						}
					}
					if (!tipoVinculoValido) {
						restricciones.push("La cuenta no tiene relaciones permitidas");
						sinRestricciones = false;
					}

					//TODO: VALIDACION POR RUBROS_AFIP, CONDICION FISCAL Y FORMA JURIDICA

					let definicion = new PlanPagoDefinicionValid();
					definicion.setFromObject(planPagoDefinicion);
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
				const dto = await this.findById(id) as PlanPagoDefinicionDTO;
				const definicion = dto.planPagoDefinicion;
				const quitas = dto.planPagosDefinicionQuitaCuota;
				const intereses = dto.planPagosDefinicionInteres;

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
				for(let cuotaProceso=definicion.cuotaDesde; cuotaProceso <= definicion.cuotaHasta; cuotaProceso++) {
					let quita = quitas.find(f => f.cuotaDesde <= cuotaProceso && f.cuotaHasta >= cuotaProceso);
					if (!quita) quita = new PlanPagoDefinicionQuitaCuotaState();
					const interes = intereses.find(f => f.cuotaDesde <= cuotaProceso && f.cuotaHasta >= cuotaProceso);

					let opcionCuota = await this.processOpcionCuota(valores, cuotaProceso, definicion, quita, interes) as OpcionCuota;

					if (definicion.montoCuotaDesde > 0 && opcionCuota.importeCuota < definicion.montoCuotaDesde) continue;
					if (definicion.montoCuotaHasta > 0 && opcionCuota.importeCuota > definicion.montoCuotaHasta) continue;

					const cuotaInit = (definicion.tieneAnticipo) ? 0 : 1
					for(let i=cuotaInit; i <= cuotaProceso; i++) {
						const cuota = await this.processCuota(i, opcionCuota, definicion, interes) as OpcionCuota;
						opcionCuota.cuotas.push(cuota);
					}

					opcionCuotas.push(opcionCuota);
				}

				const tiposVinculoCuenta = await this.planPagoDefinicionTipoVinculoCuentaService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionTipoVinculoCuenta>;
				let planPagoDefinicionCuotas = new PlanPagoDefinicionCuotas(definicion, opcionCuotas, tiposVinculoCuenta);

				resolve(planPagoDefinicionCuotas);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				let planPagoDefinicionDTO = new PlanPagoDefinicionDTO();    	   
				planPagoDefinicionDTO.planPagoDefinicion = await this.planPagoDefinicionRepository.findById(id) as PlanPagoDefinicion;
				if (!planPagoDefinicionDTO.planPagoDefinicion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				planPagoDefinicionDTO.archivos = await this.archivoService.listByEntidad('PlanPagoDefinicion', id) as Array<ArchivoState>;
                planPagoDefinicionDTO.observaciones = await this.observacionService.listByEntidad('PlanPagoDefinicion', id) as Array<ObservacionState>;
                planPagoDefinicionDTO.etiquetas = await this.etiquetaService.listByEntidad('PlanPagoDefinicion', id) as Array<EtiquetaState>;
				planPagoDefinicionDTO.planPagosDefinicionAlcanceTasa = await this.planPagoDefinicionAlcanceTasaService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionAlcanceTasaState>;
				planPagoDefinicionDTO.planPagosDefinicionAlcanceRubro = await this.planPagoDefinicionAlcanceRubroService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionAlcanceRubroState>;
				planPagoDefinicionDTO.planPagosDefinicionAlcanceGrupo = await this.planPagoDefinicionAlcanceGrupoService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionAlcanceGrupoState>;
				planPagoDefinicionDTO.planPagosDefinicionAlcanceZonaTarifaria = await this.planPagoDefinicionAlcanceZonaTarifariaService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionAlcanceZonaTarifariaState>;
				planPagoDefinicionDTO.planPagosDefinicionAlcanceCondicionFiscal = await this.planPagoDefinicionAlcanceCondicionFiscalService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionAlcanceCondicionFiscalState>;
				planPagoDefinicionDTO.planPagosDefinicionAlcanceRubroAfip = await this.planPagoDefinicionAlcanceRubroAfipService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionAlcanceRubroAfipState>;
				planPagoDefinicionDTO.planPagosDefinicionAlcanceFormaJuridica = await this.planPagoDefinicionAlcanceFormaJuridicaService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionAlcanceFormaJuridicaState>;
				planPagoDefinicionDTO.planPagosDefinicionQuitaCuota = await this.planPagoDefinicionQuitaCuotaService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionQuitaCuotaState>;
				planPagoDefinicionDTO.planPagosDefinicionInteres = await this.planPagoDefinicionInteresService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionInteresState>;
				planPagoDefinicionDTO.planPagosDefinicionTipoVinculoCuenta = await this.planPagoDefinicionTipoVinculoCuentaService.listByPlanPagoDefinicion(id) as Array<PlanPagoDefinicionTipoVinculoCuentaState>;

				resolve(planPagoDefinicionDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, planPagoDefinicionDTO: PlanPagoDefinicionDTO) {
		return new Promise( async (resolve, reject) => {
			let planPagoDefinicion = planPagoDefinicionDTO.planPagoDefinicion;
			try {
				if (
					!isValidInteger(planPagoDefinicion.idEstadoPlanPagoDefinicion, false) ||
					!isValidInteger(planPagoDefinicion.idTipoPlanPago, true) ||
					!isValidInteger(planPagoDefinicion.idTipoTributo, true) ||
					!isValidInteger(planPagoDefinicion.idTasaPlanPago, false) ||
					!isValidInteger(planPagoDefinicion.idSubTasaPlanPago, false) ||
					!isValidInteger(planPagoDefinicion.idTasaInteres, false) ||
					!isValidInteger(planPagoDefinicion.idSubTasaInteres, false) ||
					!isValidInteger(planPagoDefinicion.idTasaSellados, false) ||
					!isValidInteger(planPagoDefinicion.idSubTasaSellados, false) ||
					!isValidInteger(planPagoDefinicion.idTasaGastosCausidicos, false) ||
					!isValidInteger(planPagoDefinicion.idSubTasaGastosCausidicos, false) ||
					!isValidString(planPagoDefinicion.codigo, true) ||
					!isValidString(planPagoDefinicion.descripcion, true) ||
					!isValidDate(planPagoDefinicion.fechaDesde, false) ||
					!isValidDate(planPagoDefinicion.fechaHasta, false) ||
					!isValidBoolean(planPagoDefinicion.tieneAnticipo) ||
					!isValidInteger(planPagoDefinicion.cuotaDesde, false) ||
					!isValidInteger(planPagoDefinicion.cuotaHasta, false) ||
					!isValidInteger(planPagoDefinicion.peridiocidad, false) ||
					!isValidInteger(planPagoDefinicion.idTipoVencimientoAnticipo, false) ||
					!isValidInteger(planPagoDefinicion.idTipoVencimientoCuota1, false) ||
					!isValidInteger(planPagoDefinicion.idTipoVencimientoCuotas, false) ||
					!isValidFloat(planPagoDefinicion.porcentajeAnticipo, false) ||
					!isValidInteger(planPagoDefinicion.idTipoAlcanceTemporal, false) ||
					!isValidDate(planPagoDefinicion.fechaDesdeAlcanceTemporal, false) ||
					!isValidDate(planPagoDefinicion.fechaHastaAlcanceTemporal, false) ||
					!isValidInteger(planPagoDefinicion.mesDesdeAlcanceTemporal, false) ||
					!isValidInteger(planPagoDefinicion.mesHastaAlcanceTemporal, false) ||
					!isValidBoolean(planPagoDefinicion.aplicaDerechosEspontaneos) ||
					!isValidBoolean(planPagoDefinicion.aplicaCancelacionAnticipada) ||
					!isValidBoolean(planPagoDefinicion.aplicaTotalidadDeudaAdministrativa) ||
					!isValidBoolean(planPagoDefinicion.aplicaDeudaAdministrativa) ||
					!isValidBoolean(planPagoDefinicion.aplicaDeudaLegal) ||
					!isValidBoolean(planPagoDefinicion.aplicaGranContribuyente) ||
					!isValidBoolean(planPagoDefinicion.aplicaPequenioContribuyente) ||
					!isValidBoolean(planPagoDefinicion.caducidadAnticipoImpago) ||
					!isValidInteger(planPagoDefinicion.caducidadCantidadCuotasConsecutivas, false) ||
					!isValidInteger(planPagoDefinicion.caducidadCantidadCuotasNoConsecutivas, false) ||
					!isValidInteger(planPagoDefinicion.caducidadCantidadDiasVencimiento, false) ||
					!isValidInteger(planPagoDefinicion.caducidadCantidadDeclaracionesJuradas, false) ||
					!isValidFloat(planPagoDefinicion.montoDeudaAdministrativaDesde, false) ||
					!isValidFloat(planPagoDefinicion.montoDeudaAdministrativaHasta, false) ||
					!isValidFloat(planPagoDefinicion.montoCuotaDesde, false) ||
					!isValidFloat(planPagoDefinicion.montoCuotaHasta, false) ||
					!isValidInteger(planPagoDefinicion.idTipoCalculoInteres, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				planPagoDefinicion.id = null;
				planPagoDefinicion.idUsuarioCreacion = idUsuario;
				planPagoDefinicion.fechaCreacion = getDateNow(true);
				planPagoDefinicion.idEstadoPlanPagoDefinicion = 410;
				planPagoDefinicion.fechaDesde = getDateNow(false);
				planPagoDefinicion.aplicaDeudaAdministrativa = true;
				planPagoDefinicion.aplicaDeudaLegal = true;
				planPagoDefinicion.aplicaGranContribuyente = true;
				planPagoDefinicion.aplicaPequenioContribuyente = true;
				if (planPagoDefinicion.idTipoCalculoInteres === 0) planPagoDefinicion.idTipoCalculoInteres = null;
				if (planPagoDefinicion.idTipoAlcanceTemporal === 0) planPagoDefinicion.idTipoAlcanceTemporal = null;
				if (planPagoDefinicion.idTipoVencimientoCuota1 === 0) planPagoDefinicion.idTipoVencimientoCuota1 = null;
				if (planPagoDefinicion.idTipoVencimientoCuotas === 0) planPagoDefinicion.idTipoVencimientoCuotas = null;
				if (planPagoDefinicion.idTipoVencimientoAnticipo === 0) planPagoDefinicion.idTipoVencimientoAnticipo = null;
				if (planPagoDefinicion.idTasaPlanPago === 0) planPagoDefinicion.idTasaPlanPago = null;
				if (planPagoDefinicion.idSubTasaPlanPago === 0) planPagoDefinicion.idSubTasaPlanPago = null;
				if (planPagoDefinicion.idTasaInteres === 0) planPagoDefinicion.idTasaInteres = null;
				if (planPagoDefinicion.idSubTasaInteres === 0) planPagoDefinicion.idSubTasaInteres = null;
				if (planPagoDefinicion.idTasaSellados === 0) planPagoDefinicion.idTasaSellados = null;
				if (planPagoDefinicion.idSubTasaSellados === 0) planPagoDefinicion.idSubTasaSellados = null;
				if (planPagoDefinicion.idTasaGastosCausidicos === 0) planPagoDefinicion.idTasaGastosCausidicos = null;
				if (planPagoDefinicion.idSubTasaGastosCausidicos === 0) planPagoDefinicion.idSubTasaGastosCausidicos = null;
				planPagoDefinicionDTO.planPagoDefinicion = await this.planPagoDefinicionRepository.add(planPagoDefinicionDTO.planPagoDefinicion);
				resolve(planPagoDefinicionDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, idUsuario: number, planPagoDefinicionDTO: PlanPagoDefinicionDTO) {
		const resultTransaction = this.planPagoDefinicionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let planPagoDefinicion = planPagoDefinicionDTO.planPagoDefinicion;
					if (
						!isValidInteger(planPagoDefinicion.idEstadoPlanPagoDefinicion, true) ||
						!isValidInteger(planPagoDefinicion.idTipoPlanPago, true) ||
						!isValidInteger(planPagoDefinicion.idTipoTributo, true) ||
						!isValidInteger(planPagoDefinicion.idTasaPlanPago, true) ||
						!isValidInteger(planPagoDefinicion.idSubTasaPlanPago, true) ||
						!isValidInteger(planPagoDefinicion.idTasaInteres, false) ||
						!isValidInteger(planPagoDefinicion.idSubTasaInteres, false) ||
						!isValidInteger(planPagoDefinicion.idTasaSellados, false) ||
						!isValidInteger(planPagoDefinicion.idSubTasaSellados, false) ||
						!isValidInteger(planPagoDefinicion.idTasaGastosCausidicos, false) ||
						!isValidInteger(planPagoDefinicion.idSubTasaGastosCausidicos, false) ||
						!isValidString(planPagoDefinicion.codigo, true) ||
						!isValidString(planPagoDefinicion.descripcion, true) ||
						!isValidDate(planPagoDefinicion.fechaDesde, true) ||
						!isValidDate(planPagoDefinicion.fechaHasta, false) ||
						!isValidBoolean(planPagoDefinicion.tieneAnticipo) ||
						!isValidInteger(planPagoDefinicion.cuotaDesde, true) ||
						!isValidInteger(planPagoDefinicion.cuotaHasta, true) ||
						!isValidInteger(planPagoDefinicion.peridiocidad, true) ||
						!isValidInteger(planPagoDefinicion.idTipoVencimientoAnticipo, true) ||
						!isValidInteger(planPagoDefinicion.idTipoVencimientoCuota1, true) ||
						!isValidInteger(planPagoDefinicion.idTipoVencimientoCuotas, true) ||
						!isValidFloat(planPagoDefinicion.porcentajeAnticipo, false) ||
						!isValidInteger(planPagoDefinicion.idTipoAlcanceTemporal, true) ||
						!isValidDate(planPagoDefinicion.fechaDesdeAlcanceTemporal, false) ||
						!isValidDate(planPagoDefinicion.fechaHastaAlcanceTemporal, false) ||
						!isValidInteger(planPagoDefinicion.mesDesdeAlcanceTemporal, false) ||
						!isValidInteger(planPagoDefinicion.mesHastaAlcanceTemporal, false) ||
						!isValidBoolean(planPagoDefinicion.aplicaDerechosEspontaneos) ||
						!isValidBoolean(planPagoDefinicion.aplicaCancelacionAnticipada) ||
						!isValidBoolean(planPagoDefinicion.aplicaTotalidadDeudaAdministrativa) ||
						!isValidBoolean(planPagoDefinicion.aplicaDeudaAdministrativa) ||
						!isValidBoolean(planPagoDefinicion.aplicaDeudaLegal) ||
						!isValidBoolean(planPagoDefinicion.aplicaGranContribuyente) ||
						!isValidBoolean(planPagoDefinicion.aplicaPequenioContribuyente) ||
						!isValidBoolean(planPagoDefinicion.caducidadAnticipoImpago) ||
						!isValidInteger(planPagoDefinicion.caducidadCantidadCuotasConsecutivas, false) ||
						!isValidInteger(planPagoDefinicion.caducidadCantidadCuotasNoConsecutivas, false) ||
						!isValidInteger(planPagoDefinicion.caducidadCantidadDiasVencimiento, false) ||
						!isValidInteger(planPagoDefinicion.caducidadCantidadDeclaracionesJuradas, false) ||
						!isValidFloat(planPagoDefinicion.montoDeudaAdministrativaDesde, false) ||
						!isValidFloat(planPagoDefinicion.montoDeudaAdministrativaHasta, false) ||
						!isValidFloat(planPagoDefinicion.montoCuotaDesde, false) ||
						!isValidFloat(planPagoDefinicion.montoCuotaHasta, false) ||
						!isValidInteger(planPagoDefinicion.idTipoCalculoInteres, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					if (planPagoDefinicion.idTasaInteres === 0) planPagoDefinicion.idTasaInteres = null;
					if (planPagoDefinicion.idSubTasaInteres === 0) planPagoDefinicion.idSubTasaInteres = null;
					if (planPagoDefinicion.idTasaSellados === 0) planPagoDefinicion.idTasaSellados = null;
					if (planPagoDefinicion.idSubTasaSellados === 0) planPagoDefinicion.idSubTasaSellados = null;
					if (planPagoDefinicion.idTasaGastosCausidicos === 0) planPagoDefinicion.idTasaGastosCausidicos = null;
					if (planPagoDefinicion.idSubTasaGastosCausidicos === 0) planPagoDefinicion.idSubTasaGastosCausidicos = null;	
					
					planPagoDefinicionDTO.planPagoDefinicion = await this.planPagoDefinicionRepository.modify(id, planPagoDefinicionDTO.planPagoDefinicion);
					if (!planPagoDefinicionDTO) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executes = [];

					planPagoDefinicionDTO.planPagosDefinicionAlcanceTasa.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionAlcanceTasaService.add(row as PlanPagoDefinicionAlcanceTasa));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionAlcanceTasaService.modify(row.id, row as PlanPagoDefinicionAlcanceTasa));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionAlcanceTasaService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.planPagosDefinicionAlcanceRubro.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionAlcanceRubroService.add(row as PlanPagoDefinicionAlcanceRubro));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionAlcanceRubroService.modify(row.id, row as PlanPagoDefinicionAlcanceRubro));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionAlcanceRubroService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.planPagosDefinicionAlcanceGrupo.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionAlcanceGrupoService.add(row as PlanPagoDefinicionAlcanceGrupo));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionAlcanceGrupoService.modify(row.id, row as PlanPagoDefinicionAlcanceGrupo));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionAlcanceGrupoService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.planPagosDefinicionAlcanceZonaTarifaria.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionAlcanceZonaTarifariaService.add(row as PlanPagoDefinicionAlcanceZonaTarifaria));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionAlcanceZonaTarifariaService.modify(row.id, row as PlanPagoDefinicionAlcanceZonaTarifaria));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionAlcanceZonaTarifariaService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.planPagosDefinicionAlcanceCondicionFiscal.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionAlcanceCondicionFiscalService.add(row as PlanPagoDefinicionAlcanceCondicionFiscal));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionAlcanceCondicionFiscalService.modify(row.id, row as PlanPagoDefinicionAlcanceCondicionFiscal));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionAlcanceCondicionFiscalService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.planPagosDefinicionAlcanceRubroAfip.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionAlcanceRubroAfipService.add(row as PlanPagoDefinicionAlcanceRubroAfip));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionAlcanceRubroAfipService.modify(row.id, row as PlanPagoDefinicionAlcanceRubroAfip));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionAlcanceRubroAfipService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.planPagosDefinicionAlcanceFormaJuridica.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionAlcanceFormaJuridicaService.add(row as PlanPagoDefinicionAlcanceFormaJuridica));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionAlcanceFormaJuridicaService.modify(row.id, row as PlanPagoDefinicionAlcanceFormaJuridica));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionAlcanceFormaJuridicaService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.planPagosDefinicionQuitaCuota.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionQuitaCuotaService.add(row as PlanPagoDefinicionQuitaCuota));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionQuitaCuotaService.modify(row.id, row as PlanPagoDefinicionQuitaCuota));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionQuitaCuotaService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.planPagosDefinicionInteres.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionInteresService.add(row as PlanPagoDefinicionInteres));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionInteresService.modify(row.id, row as PlanPagoDefinicionInteres));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionInteresService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.planPagosDefinicionTipoVinculoCuenta.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.planPagoDefinicionTipoVinculoCuentaService.add(row as PlanPagoDefinicionTipoVinculoCuenta));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.planPagoDefinicionTipoVinculoCuentaService.modify(row.id, row as PlanPagoDefinicionTipoVinculoCuenta));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.planPagoDefinicionTipoVinculoCuentaService.remove(row.id));
                        }
                    });

					planPagoDefinicionDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = planPagoDefinicion.id;
							executes.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							executes.push(this.archivoService.remove(row.id));
						}
					});
					planPagoDefinicionDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = planPagoDefinicion.id;
							executes.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							executes.push(this.observacionService.remove(row.id));
						}
					});
					planPagoDefinicionDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = planPagoDefinicion.id;
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
        const resultTransaction = this.planPagoDefinicionRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    let planPagoDefinicionDTO = new PlanPagoDefinicionDTO();            
                    planPagoDefinicionDTO.planPagoDefinicion = await this.planPagoDefinicionRepository.findById(id) as PlanPagoDefinicion;
                    if (!planPagoDefinicionDTO.planPagoDefinicion) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }

                    await this.planPagoDefinicionAlcanceTasaService.removeByPlanPagoDefinicion(id);
					await this.planPagoDefinicionAlcanceRubroService.removeByPlanPagoDefinicion(id);
					await this.planPagoDefinicionAlcanceGrupoService.removeByPlanPagoDefinicion(id);
					await this.planPagoDefinicionAlcanceZonaTarifariaService.removeByPlanPagoDefinicion(id);
					await this.planPagoDefinicionAlcanceCondicionFiscalService.removeByPlanPagoDefinicion(id);
					await this.planPagoDefinicionAlcanceRubroAfipService.removeByPlanPagoDefinicion(id);
					await this.planPagoDefinicionAlcanceFormaJuridicaService.removeByPlanPagoDefinicion(id);
					await this.planPagoDefinicionQuitaCuotaService.removeByPlanPagoDefinicion(id);
					await this.planPagoDefinicionInteresService.removeByPlanPagoDefinicion(id);
					await this.planPagoDefinicionTipoVinculoCuentaService.removeByPlanPagoDefinicion(id);
					
					const result = await this.planPagoDefinicionRepository.remove(id);
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


	private async processOpcionCuota(valores: Valores, cantidadCuotas: number, planPagoDefinicion: PlanPagoDefinicion,
							 		 quita: PlanPagoDefinicionQuitaCuota, interes: PlanPagoDefinicionInteres) {
		
		let opcionCuota = new OpcionCuota();

		const sImporteSellados:string = (await this.configuracionService.findByNombre('CuentaCorrienteImporteSellados', true) as Configuracion).valor;
		opcionCuota.importeSellados = parseFloat(sImporteSellados);

		opcionCuota.cantidadCuotas = cantidadCuotas;
		opcionCuota.importeNominal = valores.importeNominal;
		opcionCuota.importeAccesorios = valores.importeAccesorios;
		opcionCuota.importeCapital = valores.importeCapital;
		
		opcionCuota.importeQuitaRecargos = (valores.importeRecargos * quita.porcentajeQuitaRecargos / 100);
		opcionCuota.importeQuitaMultaInfracciones = (valores.importeMultas * quita.porcentajeQuitaMultaInfracciones / 100);
		opcionCuota.importeQuitaHonorarios = (valores.importeHonorarios * quita.porcentajeQuitaHonorarios / 100);		
		opcionCuota.importeQuitaAportes = (valores.importeAportes * quita.porcentajeQuitaAportes / 100);
		opcionCuota.importeQuita = (opcionCuota.importeQuitaRecargos + opcionCuota.importeQuitaMultaInfracciones + opcionCuota.importeQuitaHonorarios + opcionCuota.importeQuitaAportes);
		
		opcionCuota.importeAnticipo = (planPagoDefinicion.tieneAnticipo) ? ((valores.importeCapital - opcionCuota.importeQuita) * planPagoDefinicion.porcentajeAnticipo / 100) : 0;

		const importeAFinanciar = (opcionCuota.importeCapital - opcionCuota.importeQuita - opcionCuota.importeAnticipo);
		const metodoInteres:IMetodoInteres = this.getIMetodoInteres(planPagoDefinicion.idTipoCalculoInteres, importeAFinanciar, interes.porcentajeInteres, cantidadCuotas);
		opcionCuota.importeIntereses = metodoInteres.getImporteInteresTotal();
		opcionCuota.importeCuota = metodoInteres.getImporteCuota();

		opcionCuota.importePlanPago = (opcionCuota.importeCapital - opcionCuota.importeQuita + opcionCuota.importeIntereses);

		return opcionCuota;
	}

	private async processCuota(numeroCuota: number, opcionCuota: OpcionCuota, planPagoDefinicion: PlanPagoDefinicion, interes: PlanPagoDefinicionInteres) {
		let cuota = new OpcionCuota();

		cuota.numeroCuota = numeroCuota;
		if (numeroCuota === 0) {
			cuota.importeCapital = opcionCuota.importeAnticipo;
			cuota.importeSellados = opcionCuota.importeSellados;
			cuota.importeCuota = (opcionCuota.importeAnticipo + opcionCuota.importeSellados);
		}
		else {
			const importeAFinanciar = (opcionCuota.importeCapital - opcionCuota.importeQuita - opcionCuota.importeAnticipo);
			const metodoInteres:IMetodoInteres = this.getIMetodoInteres(planPagoDefinicion.idTipoCalculoInteres, importeAFinanciar, interes.porcentajeInteres, opcionCuota.cantidadCuotas);

			cuota.importeCapital = metodoInteres.getImporteCapitalCuota(numeroCuota);
			cuota.importeIntereses = metodoInteres.getImporteInteresCuota(numeroCuota);
			cuota.importeCuota = opcionCuota.importeCuota;
		}

		return cuota;
	}

	private getIMetodoInteres(idTipoCalculoInteres, importeAFinanciar, porcentajeInteres, cantidadCuotas) {
		let metodoInteres:IMetodoInteres = null;
		switch(idTipoCalculoInteres) {
			case CALCULO_INTERES_TYPE.METODO_SIMPLE:
				metodoInteres = new MetodoSimple(importeAFinanciar, porcentajeInteres, cantidadCuotas);
				break;
			case CALCULO_INTERES_TYPE.METODO_FRANCES:
				metodoInteres = new MetodoFrances(importeAFinanciar, porcentajeInteres, cantidadCuotas);
				break;
			default:
				metodoInteres = new MetodoSimple(importeAFinanciar, porcentajeInteres, cantidadCuotas);
				break;
		}
		return metodoInteres;
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
