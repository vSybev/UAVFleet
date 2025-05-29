// src/main.ts

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication }                from '@angular/platform-browser';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi }          from '@angular/common/http';
import { HTTP_INTERCEPTORS }                from '@angular/common/http';
import { provideAnimations }                from '@angular/platform-browser/animations';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas }                              from '@fortawesome/free-solid-svg-icons';

import { AppComponent }      from './app/app.component';
import { appRoutes }         from './app/app.routes';
import { JwtInterceptor }    from './app/interceptors/jwt.interceptor';
import { environment }       from './app/environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // 1) Router with blocking initial navigation
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),

    // 2) New HttpClient provider + allow DI-registered interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // 3) Register your JWT interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },

    // 4) Browser animations (optional)
    provideAnimations(),

    // 5) FontAwesome setup (if used)
    importProvidersFrom(FontAwesomeModule),
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const lib = new FaIconLibrary();
        lib.addIconPacks(fas);
        return lib;
      }
    }
  ]
})
  .catch(err => console.error(err));
