import CategoriaUbicacion from '../../domain/entities/categoria-ubicacion';
import CategoriaUbicacionService from '../../domain/services/categoria-ubicacion-service';

export default class CategoriaUbicacionController {

	categoriaUbicacionService: CategoriaUbicacionService;

	constructor(categoriaUbicacionService: CategoriaUbicacionService) {
		this.categoriaUbicacionService = categoriaUbicacionService;
	}

	get = async (req, res, next) => {
		this.categoriaUbicacionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.categoriaUbicacionService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const categoriaUbicacion = new CategoriaUbicacion(); categoriaUbicacion.setFromObject(dataBody);
		this.categoriaUbicacionService.add(categoriaUbicacion)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const categoriaUbicacion = new CategoriaUbicacion(); categoriaUbicacion.setFromObject(dataBody);
		this.categoriaUbicacionService.modify(id, categoriaUbicacion)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.categoriaUbicacionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
