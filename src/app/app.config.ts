import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';

import { routes } from './app.routes';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),

    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(
      withInterceptors([credentialsInterceptor]),

      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
  ],
};

// import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
// import { provideRouter, withComponentInputBinding } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';
// import { routes } from './app.routes';
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZonelessChangeDetection(),
//     provideRouter(routes, withComponentInputBinding()),
//     provideHttpClient(),
//   ],
// };
