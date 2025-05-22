import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import * as routes from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes.appRoutes)]
};
