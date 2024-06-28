import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { HeadersService } from '../headers.service';
import { Response } from '../../interfaces/api';
import { Exchange } from '../../interfaces/exchange';

@Injectable({
	providedIn: 'root',
})
export class ExchangeService {
	constructor(
		private http: HttpClient,
		private headersService: HeadersService,
	) {}

  /**
   * Use this function when you need to get exchanges
   *
   * @return {Exchange} - Exchanges
   */
	public getExchanges(): Observable<Exchange> {
		return this.getExchangesRequest().pipe(
			map((response: Response<Exchange>) => response.data),
		);
	}

  /**
   * Use this function when you need to send exchanges request
   *
   * @return {Response<Exchange>} - Exchanges
   */
	private getExchangesRequest(): Observable<Response<Exchange>> {
		return this.http.get<Response<Exchange>>(`/api/instruments/v1/exchanges`, {
			headers: this.headersService.bearerHeaders,
		});
	}
}
