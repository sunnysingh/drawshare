// Initializes the `drawings` service on path `/drawings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Drawings } from './drawings.class';
import createModel from '../../models/drawings.model';
import hooks from './drawings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    drawings: Drawings & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    whitelist: ['isPublic', 'userId'],
  };

  // Initialize our service with any options it requires
  app.use('/drawings', new Drawings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('drawings');

  service.hooks(hooks);
}
