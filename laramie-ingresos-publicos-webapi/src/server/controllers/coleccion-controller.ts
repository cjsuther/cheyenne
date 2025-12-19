import Coleccion from '../../domain/entities/coleccion';
import ColeccionService from '../../domain/services/coleccion-service';

export default class ColeccionController {

	coleccionService: ColeccionService;

	constructor(coleccionService: ColeccionService) {
		this.coleccionService = coleccionService;
	}

	get = async (req, res, next) => {
		const idTipoTributo = parseInt(req.params.idTipoTributo);
		this.coleccionService.list(idTipoTributo)
			.then((colecciones: Array<Coleccion>) => {
				colecciones.forEach(coleccion => {
					coleccion.ejecucion = "";
					coleccion.coleccionesCampo.forEach(campo => {
						campo.campo = "";
					});
				});
				res.send(colecciones);
			})
			.catch(next)
	}

	getById = async (req, res, next) => {
		const id = req.params.id;
		this.coleccionService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const dataBody = {...req.body};
		const coleccion = new Coleccion(); coleccion.setFromObject(dataBody);
		this.coleccionService.add(coleccion)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const coleccion = new Coleccion(); coleccion.setFromObject(dataBody);
		this.coleccionService.modify(id, coleccion)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const id = req.params.id;
		this.coleccionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
