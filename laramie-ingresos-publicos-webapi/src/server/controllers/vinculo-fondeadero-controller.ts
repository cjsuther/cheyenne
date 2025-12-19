import VinculoFondeaderoService from '../../domain/services/vinculo-fondeadero-service';

export default class VinculoFondeaderoController {

	vinculoFondeaderoService: VinculoFondeaderoService;

	constructor(vinculoFondeaderoService: VinculoFondeaderoService) {
		this.vinculoFondeaderoService = vinculoFondeaderoService;
	}

	getByFondeadero = (req, res, next) => {
		const idFondeadero = req.params.idFondeadero;
		this.vinculoFondeaderoService.listByFondeadero(idFondeadero)
			.then(data => res.send(data))
			.catch(next)
	}

}
