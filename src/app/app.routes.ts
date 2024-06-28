import { Routes } from '@angular/router';
import { LoginPageComponent } from './shared/pages/login-page/login-page.component';
import { ChartPageComponent } from './shared/pages/chart-page/chart-page.component';
import { authorizationGuard } from "./core/guards/authorization.guard";

export const routes: Routes = [
	{
		title: 'Login',
		path: 'login',
		component: LoginPageComponent,
	},
	{
		title: 'Chart',
		path: 'chart',
		component: ChartPageComponent,
    canActivate: [authorizationGuard]
	},
	{
		path: '**',
		redirectTo: 'login',
	},
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  }
];
