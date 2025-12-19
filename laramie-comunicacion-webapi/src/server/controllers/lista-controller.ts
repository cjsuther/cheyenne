import Lista from '../../domain/entities/lista';
import ListaService from '../../domain/services/lista-service';

export default class ListaController {

	listaService: ListaService;

	constructor(listaService: ListaService) {
		this.listaService = listaService;
	}

	get = async (req, res, next) => {
		this.listaService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.listaService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const lista = new Lista(); lista.setFromObject(dataBody);
		this.listaService.add(lista)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const lista = new Lista(); lista.setFromObject(dataBody);
		this.listaService.modify(id, lista)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.listaService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
