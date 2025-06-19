import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideNativeDateAdapter } from '@angular/material/core';
import localeEnBE from '@angular/common/locales/en-BE';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEnBE);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'en-BE' }
  ]
};
