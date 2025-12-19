import VinculoCementerioService from '../../domain/services/vinculo-cementerio-service';

export default class VinculoCementerioController {

	vinculoCementerioService: VinculoCementerioService;

	constructor(vinculoCementerioService: VinculoCementerioService) {
		this.vinculoCementerioService = vinculoCementerioService;
	}

	getByCementerio = (req, res, next) => {
		const idCementerio = req.params.idCementerio;
		this.vinculoCementerioService.listByCementerio(idCementerio)
			.then(data => res.send(data))
			.catch(next)
	}

}
