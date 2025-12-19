import IVinculoInmuebleRepository from '../repositories/vinculo-inmueble-repository';
import IVinculoComercioRepository from '../repositories/vinculo-comercio-repository';
import IVinculoVehiculoRepository from '../repositories/vinculo-vehiculo-repository';
import IVinculoCementerioRepository from '../repositories/vinculo-cementerio-repository';
import IVinculoFondeaderoRepository from '../repositories/vinculo-fondeadero-repository';
import IVinculoEspecialRepository from '../repositories/vinculo-especial-repository';

import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import VinculoCuenta from '../entities/vinculo-cuenta';
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';


export default class VinculoCuentaService {

	vinculoInmuebleRepository: IVinculoInmuebleRepository;
	vinculoComercioRepository: IVinculoComercioRepository;
	vinculoVehiculoRepository: IVinculoVehiculoRepository;
	vinculoCementerioRepository: IVinculoCementerioRepository;
	vinculoFondeaderoRepository: IVinculoFondeaderoRepository;
	vinculoEspecialRepository: IVinculoEspecialRepository;

	constructor(vinculoInmuebleRepository: IVinculoInmuebleRepository,
				vinculoComercioRepository: IVinculoComercioRepository,
				vinculoVehiculoRepository: IVinculoVehiculoRepository,
				vinculoCementerioRepository: IVinculoCementerioRepository,
				vinculoFondeaderoRepository: IVinculoFondeaderoRepository,
				vinculoEspecialRepository: IVinculoEspecialRepository) {
		this.vinculoInmuebleRepository = vinculoInmuebleRepository;
		this.vinculoComercioRepository = vinculoComercioRepository;
		this.vinculoVehiculoRepository = vinculoVehiculoRepository;
		this.vinculoCementerioRepository = vinculoCementerioRepository;
		this.vinculoFondeaderoRepository = vinculoFondeaderoRepository;
		this.vinculoEspecialRepository = vinculoEspecialRepository;
	}

	async listByTributo(idTipoTributo: number, idTributo: number) {
		return new Promise( async (resolve, reject) => {
			try {
				let result: Array<VinculoCuenta> = [];
				switch(idTipoTributo) {
					case TRIBUTO_TYPE.INMUEBLES:
						result = await this.vinculoInmuebleRepository.listByInmueble(idTributo) as Array<VinculoCuenta>;
						break;
					case TRIBUTO_TYPE.COMERCIOS:
						result = await this.vinculoComercioRepository.listByComercio(idTributo) as Array<VinculoCuenta>;
						break;
					case TRIBUTO_TYPE.VEHICULOS:
						result = await this.vinculoVehiculoRepository.listByVehiculo(idTributo) as Array<VinculoCuenta>;
						break;
					case TRIBUTO_TYPE.CEMENTERIOS:
						result = await this.vinculoCementerioRepository.listByCementerio(idTributo) as Array<VinculoCuenta>;
						break;
					case TRIBUTO_TYPE.FONDEADEROS:
						result = await this.vinculoFondeaderoRepository.listByFondeadero(idTributo) as Array<VinculoCuenta>;
						break;
					case TRIBUTO_TYPE.CUENTAS_ESPECIALES:
						result = await this.vinculoEspecialRepository.listByEspecial(idTributo) as Array<VinculoCuenta>;
						break;
					default:
						result = [];
				}

				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(idTipoTributo: number, id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				let result: VinculoCuenta = null;
				switch(idTipoTributo) {
					case TRIBUTO_TYPE.INMUEBLES:
						result = await this.vinculoInmuebleRepository.findById(id) as VinculoCuenta;
						break;
					case TRIBUTO_TYPE.COMERCIOS:
						result = await this.vinculoComercioRepository.findById(id) as VinculoCuenta;
						break;
					case TRIBUTO_TYPE.VEHICULOS:
						result = await this.vinculoVehiculoRepository.findById(id) as VinculoCuenta;
						break;
					case TRIBUTO_TYPE.CEMENTERIOS:
						result = await this.vinculoCementerioRepository.findById(id) as VinculoCuenta;
						break;
					case TRIBUTO_TYPE.FONDEADEROS:
						result = await this.vinculoFondeaderoRepository.findById(id) as VinculoCuenta;
						break;
					case TRIBUTO_TYPE.CUENTAS_ESPECIALES:
						result = await this.vinculoEspecialRepository.findById(id) as VinculoCuenta;
						break;
					default:
						result = new VinculoCuenta();
				}

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
	}

}
