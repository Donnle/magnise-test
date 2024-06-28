import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HeadersService } from '../headers.service';
import { Response } from '../../interfaces/api';
import { Providers } from '../../interfaces/providers';

@Injectable({
	providedIn: 'root',
})
export class ProviderService {
	constructor(
		private http: HttpClient,
		private headersService: HeadersService,
	) {}

  /**
   * Use this function when you need to get providers
   *
   * @return {Providers} - Providers
   */
	public getProviders(): Observable<Providers> {
		return this.getProvidersRequest().pipe(
			map((response: Response<Providers>) => response.data),
		);
	}

  /**
   * Use this function when you need to send providers request
   *
   * @return {Response<Providers>} - Providers
   */
	private getProvidersRequest(): Observable<Response<Providers>> {
		return this.http.get<Response<Providers>>(`/api/instruments/v1/providers`, {
			headers: this.headersService.bearerHeaders,
		});
	}
}
