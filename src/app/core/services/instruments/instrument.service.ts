import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeadersService } from '../headers.service';
import {
	Instruments,
	InstrumentsConfiguration,
} from '../../interfaces/instrument';
import { Response } from '../../interfaces/api';

@Injectable({
	providedIn: 'root',
})
export class InstrumentService {
	constructor(
		private http: HttpClient,
		private headersService: HeadersService,
	) {}

  /**
   * Use this function when you need to send instruments request
   * (There are strange logic if I need to select many providers. Why I should not give arguments joined by comma?)
   *
   * @param configuration Request configuration
   *
   * @return {Instruments} - Instruments
   */
	public getInstrumentsRequest(
		configuration: InstrumentsConfiguration,
	): Observable<Response<Instruments>> {
		const providersQueries: string =
			configuration.providers?.map((p) => `provider=${p}`).join('&') || '';
		const exchangeQueries: string =
			configuration.exchanges?.map((e) => `exchange=${e}`).join('&') || '';

		const queries: string = `?${providersQueries}&${exchangeQueries}&page=${configuration.page}&size=${configuration.size}`;

		return this.http.get<Response<Instruments>>(
			`/api/instruments/v1/instruments` + queries,
			{
				headers: this.headersService.bearerHeaders,
			},
		);
	}
}
