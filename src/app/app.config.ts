import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEcharts } from 'ngx-echarts';

import { routes } from './app.routes';
import { authorizationInterceptor } from './core/interceptors/authorization.interceptor';
import { loadingInterceptor } from "./core/interceptors/loading.interceptor";

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideClientHydration(),
		provideHttpClient(withInterceptors([authorizationInterceptor, loadingInterceptor])),
		provideEcharts(), provideAnimationsAsync('noop'),
	],
};
