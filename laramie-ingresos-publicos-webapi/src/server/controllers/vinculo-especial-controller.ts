import VinculoEspecialService from '../../domain/services/vinculo-especial-service';

export default class VinculoEspecialController {

	vinculoEspecialService: VinculoEspecialService;

	constructor(vinculoEspecialService: VinculoEspecialService) {
		this.vinculoEspecialService = vinculoEspecialService;
	}

	getByEspecial = (req, res, next) => {
		const idEspecial = req.params.idEspecial;
		this.vinculoEspecialService.listByEspecial(idEspecial)
			.then(data => res.send(data))
			.catch(next)
	}

}
