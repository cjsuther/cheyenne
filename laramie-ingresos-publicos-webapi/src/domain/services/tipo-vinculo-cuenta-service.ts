import IListaRepository from '../repositories/lista-repository';

import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import Lista from '../entities/lista';
import { TRIBUTO_TYPE } from '../../infraestructure/sdk/consts/tributoType';


export default class TipoVinculoCuentaService {

	listaRepository: IListaRepository;

	constructor(listaRepository: IListaRepository) {
		this.listaRepository = listaRepository;
	}

	async listByTipoTributo(idTipoTributo: number) {
		return new Promise( async (resolve, reject) => {
			try {
				let result = [];
				switch(idTipoTributo) {
					case TRIBUTO_TYPE.INMUEBLES:
						result = await this.listaRepository.listTipo('TipoVinculoInmueble');
						result.forEach(x => x.idTipoTributo = 10);
						break;
					case TRIBUTO_TYPE.COMERCIOS:
						result = await this.listaRepository.listTipo('TipoVinculoComercio');
						result.forEach(x => x.idTipoTributo = 11);
						break;
					case TRIBUTO_TYPE.VEHICULOS:
						result = await this.listaRepository.listTipo('TipoVinculoVehiculo');
						result.forEach(x => x.idTipoTributo = 12);
						break;
					case TRIBUTO_TYPE.CEMENTERIOS:
						result = await this.listaRepository.listTipo('TipoVinculoCementerio');
						result.forEach(x => x.idTipoTributo = 13);
						break;
					case TRIBUTO_TYPE.FONDEADEROS:
						result = await this.listaRepository.listTipo('TipoVinculoFondeadero');
						result.forEach(x => x.idTipoTributo = 14);
						break;
					case TRIBUTO_TYPE.CUENTAS_ESPECIALES:
						result = await this.listaRepository.listTipo('TipoVinculoEspecial');
						result.forEach(x => x.idTipoTributo = 15);
						break;
					default:
						let result10 = await this.listaRepository.listTipo('TipoVinculoInmueble');
						result10.forEach(x => x.idTipoTributo = 10);
						let result11 = await this.listaRepository.listTipo('TipoVinculoComercio');
						result11.forEach(x => x.idTipoTributo = 11);
						let result12 = await this.listaRepository.listTipo('TipoVinculoVehiculo');
						result12.forEach(x => x.idTipoTributo = 12);
						let result13 = await this.listaRepository.listTipo('TipoVinculoCementerio');
						result13.forEach(x => x.idTipoTributo = 13);
						let result14 = await this.listaRepository.listTipo('TipoVinculoFondeadero');
						result14.forEach(x => x.idTipoTributo = 14);
						let result15 = await this.listaRepository.listTipo('TipoVinculoEspecial');
						result15.forEach(x => x.idTipoTributo = 15);
						result = [].concat(result10, result11, result12, result13, result14, result15);
						break;
				}

				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
