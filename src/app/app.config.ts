import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      // Opcional: Habilitar el binding de parámetros de ruta a inputs de componentes
      withComponentInputBinding(),
      // Opcional: Otras características del router como withDebugTracing()
      // withDebugTracing()
    ),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())
  ]
};


