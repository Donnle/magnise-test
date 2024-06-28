import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HeadersService } from './headers.service';
import { CountBack, CountBackConfiguration } from '../interfaces/count-back';
import { Response } from '../interfaces/api';

@Injectable({
	providedIn: 'root',
})
export class CountBackService {
	constructor(
		private http: HttpClient,
		private headersService: HeadersService,
	) {}

  /**
   * Use this function when you need to get count backs
   *
   * @param configuration Request configuration
   *
   * @return {CountBack[]} - CountBacks
   */
	public getCountBack(
		configuration: CountBackConfiguration,
	): Observable<CountBack[]> {
		return this.getCountBackRequest(configuration).pipe(
			map((response: Response<CountBack[]>) => response.data),
		);
	}

  /**
   * Use this function when you need to send count backs request
   *
   * @param configuration Request configuration
   *
   * @return {Response<CountBack[]>} - CountBacks
   */
	private getCountBackRequest(
		configuration: CountBackConfiguration,
	): Observable<Response<CountBack[]>> {
		return this.http.get<Response<CountBack[]>>(
			'/api/bars/v1/bars/count-back',
			{
				headers: this.headersService.bearerHeaders,
				params: {
					instrumentId: configuration.instrumentId,
					provider: configuration.provider,
					interval: configuration.interval,
					periodicity: configuration.periodicity,
					barsCount: configuration.barsCount,
					date: configuration?.date || '',
				},
			},
		);
	}
}
