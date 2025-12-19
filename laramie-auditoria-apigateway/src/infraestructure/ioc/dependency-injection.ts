import { InjectionMode, createContainer, asClass } from 'awilix';


import AlertaController from '../../server/controllers/alerta-controller';
import EventoController from '../../server/controllers/evento-controller';
import IncidenciaController from '../../server/controllers/incidencia-controller';

import SesionService from '../../domain/services/sesion-service';
import AlertaService from '../../domain/services/alerta-service';
import EventoService from '../../domain/services/evento-service';
import IncidenciaService from '../../domain/services/incidencia-service';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
})

container.register({
  
  alertaController: asClass(AlertaController),
  eventoController: asClass(EventoController),
  incidenciaController: asClass(IncidenciaController),  

  sesionService: asClass(SesionService),
  alertaService: asClass(AlertaService),
  eventoService: asClass(EventoService),
  incidenciaService: asClass(IncidenciaService),
});

export default container;