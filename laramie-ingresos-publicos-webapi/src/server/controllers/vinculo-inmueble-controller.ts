import VinculoInmuebleService from '../../domain/services/vinculo-inmueble-service';

export default class VinculoInmuebleController {

	vinculoInmuebleService: VinculoInmuebleService;

	constructor(vinculoInmuebleService: VinculoInmuebleService) {
		this.vinculoInmuebleService = vinculoInmuebleService;
	}

	getByInmueble = (req, res, next) => {
		const idInmueble = req.params.idInmueble;
		this.vinculoInmuebleService.listByInmueble(idInmueble)
			.then(data => res.send(data))
			.catch(next)
	}

}
