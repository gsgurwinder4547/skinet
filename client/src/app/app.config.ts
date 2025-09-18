import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { InitService } from './core/services/init.service';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { of, lastValueFrom, catchError } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor])),
    // provideAppInitializer(async () => {
    //   const initService = inject(InitService);
    //   return lastValueFrom(initService.init()).finally(() => {
    //     const splash = document.getElementById('initial-splash');
    //     if (splash) {
    //       splash.remove();
    //     }
    //   })
    // }),
    provideAppInitializer(() => {
      const initService = inject(InitService);
      return lastValueFrom(
        initService.init().pipe(
          catchError(err => {
            console.error('App init failed', err);
            return of(null); // <-- never reject boot
          })
        )
      ).finally(() => {
        document.getElementById('initial-splash')?.remove();
      });
    }),
    {
       provide: MAT_DIALOG_DEFAULT_OPTIONS,
       useValue: { autoFocus: 'dialog', restoreFocus: true }
    }
  ]
};
