import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from "@angular/router";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthorizationService } from '../services/authorization/authorization.service';

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const authorizationService: AuthorizationService =
    inject(AuthorizationService);

  const router: Router = inject(Router);

	return next(req).pipe(
		catchError(error => {
			if (error.status === 401) {
        return authorizationService.refreshToken().pipe(
          switchMap(() => next(req)),
          catchError(() => {
            router.navigate(['/login'])
            return throwError(() => error)
          }),
        )
			}

			return throwError(() => error);
		}),
	);
};
