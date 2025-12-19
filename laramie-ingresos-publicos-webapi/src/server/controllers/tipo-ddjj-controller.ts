import TipoDDJJ from '../../domain/entities/tipo-ddjj';
import TipoDDJJService from '../../domain/services/tipo-ddjj-service';

export default class TipoDDJJController {

	tipoDDJJService: TipoDDJJService;

	constructor(tipoDDJJService: TipoDDJJService) {
		this.tipoDDJJService = tipoDDJJService;
	}

	get = async (req, res, next) => {
		this.tipoDDJJService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.tipoDDJJService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const tipoDDJJ = new TipoDDJJ(); tipoDDJJ.setFromObject(dataBody);
		this.tipoDDJJService.add(tipoDDJJ)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const tipoDDJJ = new TipoDDJJ(); tipoDDJJ.setFromObject(dataBody);
		this.tipoDDJJService.modify(id, tipoDDJJ)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.tipoDDJJService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
