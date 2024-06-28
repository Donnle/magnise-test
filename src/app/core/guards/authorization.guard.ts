import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { map } from "rxjs";
import { AuthorizationService } from "../services/authorization/authorization.service";

export const authorizationGuard: CanActivateFn = (route, state) => {
  const authorizationService: AuthorizationService = inject(AuthorizationService);
  const router: Router = inject(Router);

  return authorizationService.isLoggedIn$.pipe(
    map((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return true
      } else {
        router.createUrlTree(['/login']);
        return false;
      }
    }),
  );
};
