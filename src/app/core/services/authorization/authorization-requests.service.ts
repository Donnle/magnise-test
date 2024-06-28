import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import {
	AuthorizationCredentials,
	AuthorizationResponse,
} from '../../interfaces/authorization';

@Injectable({
	providedIn: 'root',
})
export class AuthorizationRequestsService {
	constructor(private http: HttpClient) {}

	/**
	 * Use this function when you need to make authorization request
	 *
	 * @param {string} credentials User credentials, such as username and password
	 *
	 * @return {AuthorizationResponse} - user tokens and their expires
	 */
	public loginRequest(
		credentials: AuthorizationCredentials,
	): Observable<AuthorizationResponse> {
		const headers: HttpHeaders = new HttpHeaders({
			'Content-Type': 'application/x-www-form-urlencoded',
		});

		const body: HttpParams = new HttpParams()
			.set('grant_type', 'password')
			.set('client_id', 'app-cli')
			.set('username', credentials.username)
			.set('password', credentials.password);

		return this.http.post<AuthorizationResponse>(
			`/identity/realms/fintatech/protocol/openid-connect/token`,
			body.toString(),
			{ headers },
		);
	}

  // TODO: I have not found endpoint for refreshing tokens, so I mock it up !!!!!!!
  public refreshTokenRequest(refreshToken: string): Observable<AuthorizationResponse> {
    return throwError(() => ({
      error: `Refresh token: ${refreshToken} expired`,
    }))
  }
}
