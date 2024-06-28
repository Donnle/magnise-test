import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEY } from '../../enums/localStorage';

@Injectable({
	providedIn: 'root',
})
export class AuthorizationTokensService {
  /** access token - for authorization */
	public get accessToken(): string {
		return localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) || '';
	}

	public set accessToken(accessToken: string | undefined) {
    if (accessToken) {
      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    }
	}

  /** refresh token - for refreshing tokens*/
	public get refreshToken(): string {
		return localStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN) || '';
	}

	public set refreshToken(refreshToken: string | undefined) {
    if (refreshToken) {
      localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, refreshToken);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
    }
	}
}
