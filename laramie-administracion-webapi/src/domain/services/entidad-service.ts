import IEntidadRepository from '../repositories/entidad-repository';
import IEntidadDefinicionRepository from '../repositories/entidad-definicion-repository';
import Entidad from '../entities/entidad';
import EntidadDefinicion from '../entities/entidad-definicion';
import ProcessError from '../../infraestructure/sdk/error/process-error';


export default class EntidadService {

    entidadRepository: IEntidadRepository;
    entidadDefinicionRepository: IEntidadDefinicionRepository;

    constructor(entidadRepository: IEntidadRepository, entidadDefinicionRepository:IEntidadDefinicionRepository) {
        this.entidadRepository = entidadRepository;
        this.entidadDefinicionRepository = entidadDefinicionRepository;
    }

    async list(tipo:string) {
        return new Promise( async (resolve, reject) => {
            try {
                const entidad = await this.entidadRepository.list(tipo) as Array<Entidad>;
                const definicion = await this.entidadDefinicionRepository.getByTipo(tipo) as EntidadDefinicion;

                const result = entidad.map(e => {
                    let row = {
                        id: e.id,
                        codigo: e.codigo,
                        nombre: e.nombre,
                        tipo: e.tipo,
                        orden: e.orden,
                    }

                    for (let i = 1; i <= 10; i++) {
                        const nombre = "nombre" + i.toString();
                        const campo = definicion[nombre].toString();

                        if (campo !== '') {
                            const tipoDato = definicion["tipoDato" + i.toString()].toString();
                            const dato = e["dato" + i.toString()].toString();

                            switch(tipoDato) {
                                case "string":
                                    row[campo] = dato;
                                    break;
                                case "number":
                                    row[campo] = (dato !== '') ? parseInt(dato) : 0;
                                    break;
                                case "decimal":
                                    row[campo] = (dato !== '') ? parseFloat(dato) : 0;
                                    break;
                                case "boolean":
                                    row[campo] = (dato === 'true');
                                    break;
                                case "date":
                                    row[campo] = (dato !== '') ? new Date(dato) : null;
                                    break;
                                default:
                                    row[campo] = dato;
                                    break;
                            }
                        }
                    }

                    return row;
                }).sort((a, b) => a.orden - b.orden);

                resolve(result);
            }
            catch(error) {
                reject(new ProcessError('Error procesando datos', error));
            }
        });
    }
    
}
