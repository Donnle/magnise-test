import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthorizationTokensService } from './authorization/authorization-tokens.service';

@Injectable({
	providedIn: 'root',
})
export class HeadersService {
	constructor(private authorizationTokensService: AuthorizationTokensService) {}

  /** Use this getter when you need to put authorization headers to request */
	public get bearerHeaders() {
		return new HttpHeaders().set(
			'authorization',
			'Bearer ' + this.authorizationTokensService.accessToken,
		);
	}
}
