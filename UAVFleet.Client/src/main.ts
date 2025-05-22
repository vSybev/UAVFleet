import { bootstrapApplication }     from '@angular/platform-browser';
import { importProvidersFrom }       from '@angular/core';
import { FontAwesomeModule }         from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule }       from '@angular/forms';
import { provideRouter }             from '@angular/router';

import { AppComponent }              from './app/app.component';
import { appRoutes }                 from './app/app.routes';
import { JwtInterceptor }            from './app/interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
      HttpClientModule,
      ReactiveFormsModule,
      FontAwesomeModule
    ),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
})
  .catch(err => console.error(err));
