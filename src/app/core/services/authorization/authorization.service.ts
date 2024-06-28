import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { AuthorizationTokensService } from './authorization-tokens.service';
import { AuthorizationRequestsService } from './authorization-requests.service';
import {
	AuthorizationCredentials,
	AuthorizationResponse,
} from '../../interfaces/authorization';


@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private isLoggedIn$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    !!this.authorizationTokensService.accessToken,
  );

  public get isLoggedIn$() {
    return this.isLoggedIn$$.asObservable();
  }

	constructor(
		private authorizationTokensService: AuthorizationTokensService,
		private authorizationRequestsService: AuthorizationRequestsService,
	) {}

	/**
	 * Use this function when you need to authorize user
	 *
	 * @param {string} credentials User credentials, such as username and password
	 *
	 * @return {AuthorizationResponse} - user tokens and their expires
	 */
	public login(
		credentials: AuthorizationCredentials,
	): Observable<AuthorizationResponse> {
		return this.authorizationRequestsService.loginRequest(credentials).pipe(
			tap((response: AuthorizationResponse) => {
				this.authorizationTokensService.accessToken = response.access_token;
				this.authorizationTokensService.refreshToken = response.refresh_token;

				this.isLoggedIn$$.next(true);
			}),
      catchError((error) => {
        this.authorizationTokensService.accessToken = undefined;
        this.authorizationTokensService.refreshToken = undefined;

        this.isLoggedIn$$.next(false);

        return throwError(() => error)
      })
		);
	}

  /**
   * Use this function when you need to refresh user tokens
   *
   * @param {string} refreshToken User refresh token for refresh tokens
   *
   * @return {AuthorizationResponse} - user tokens and their expires
   */
  public refreshToken(
    refreshToken: string = this.authorizationTokensService.refreshToken
  ): Observable<AuthorizationResponse> {
    return this.authorizationRequestsService.refreshTokenRequest(refreshToken).pipe(
      tap((response: AuthorizationResponse) => {
        this.authorizationTokensService.accessToken = response.access_token;
        this.authorizationTokensService.refreshToken = response.refresh_token;

        this.isLoggedIn$$.next(true);
      }),
      catchError((error) => {
        this.authorizationTokensService.accessToken = undefined;
        this.authorizationTokensService.refreshToken = undefined;

        this.isLoggedIn$$.next(false);

        return throwError(() => error)
      })
    )
  }
}
