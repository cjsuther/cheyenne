import VinculoComercioService from '../../domain/services/vinculo-comercio-service';

export default class VinculoComercioController {

	vinculoComercioService: VinculoComercioService;

	constructor(vinculoComercioService: VinculoComercioService) {
		this.vinculoComercioService = vinculoComercioService;
	}

	getByComercio = (req, res, next) => {
		const idComercio = req.params.idComercio;
		this.vinculoComercioService.listByComercio(idComercio)
			.then(data => res.send(data))
			.catch(next)
	}

}
