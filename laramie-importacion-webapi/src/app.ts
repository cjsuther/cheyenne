import container from './infraestructure/ioc/dependency-injection';
import moment from 'moment';
import express from 'express';
import cors from 'cors';
import routes from './server/routes';
import config from './server/configuration/config';
import useError from './server/middlewares/use-error';
import useNotFound from './server/middlewares/use-not-found';
import useLocalStorage from './server/middlewares/use-local-storage';
import { isOriginAllowed } from './infraestructure/sdk/utils/validator';
import UnauthorizedError from './infraestructure/sdk/error/unauthorized-error';
import SubscribeService from './domain/services/subscribe-service';
import { createNamespace } from 'cls-hooked';

process.env.TZ = config.TIME_ZONE;
moment.locale('es');

const port = config.PORT;
const corsAllowedOrigins = config.CORS_ALLOWED_ORIGINS;

const app = express();

const corsOptions = {
  origin: function(origin, callback) {
    if (isOriginAllowed(origin, corsAllowedOrigins)) { 
      callback(null, true);
    }
    else {
      callback(new UnauthorizedError(`${origin} blocked by CORS`));
    }
  }
};
app.use(cors(corsOptions));

app.use(useLocalStorage);

app.use(express.json());

app.use(routes);

app.use(useError);
app.use(useNotFound);

let localStorage = createNamespace('LocalStorage');
if (!localStorage) {
  console.log('No se pudo instanciar el Local Storage');
  process.exit(1);
}

const topics = ["RemovePermiso"];

const subscribeService = container.resolve("subscribeService") as SubscribeService;
subscribeService.connectQueue(topics)
.then(response => {

  process.on('SIGINT', function() {
    subscribeService.disonnectQueue()
    .then(response => process.exit(0))
    .catch(console.error);
  });

  app.listen(port, () => {
    console.log(`"laramie-importacion-webapi" listening on Port: ${port}`);
  });
})
.catch(console.error);
