import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  MatFormField,
  MatLabel, MatOptgroup,
  MatOption,
  MatSelect
} from "@angular/material/select";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, KeyValuePipe, UpperCasePipe } from "@angular/common";
import { Subject, takeUntil} from "rxjs";
import { NgxEchartsDirective } from 'ngx-echarts';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { CandlestickChartComponent } from '../../components/candlestick-chart/candlestick-chart.component';
import { ProviderService } from '../../../core/services/instruments/provider.service';
import { ExchangeService } from '../../../core/services/instruments/exchange.service';
import { InstrumentService } from '../../../core/services/instruments/instrument.service';
import { Exchange, Exchanges } from '../../../core/interfaces/exchange';
import { Providers } from '../../../core/interfaces/providers';
import {
	Instruments,
	InstrumentsConfiguration,
} from '../../../core/interfaces/instrument';
import { Paging, Response } from '../../../core/interfaces/api';

interface InstrumentsData {
	instruments: Instruments;
	pagination: Partial<Paging>;
}

@Component({
	selector: 'app-chart-page',
	standalone: true,
  imports: [
    NgxEchartsDirective,
    CandlestickChartComponent,
    ReactiveFormsModule,
    UpperCasePipe,
    MatOptgroup,
    KeyValuePipe,
    JsonPipe,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatSelectInfiniteScrollModule
  ],
	templateUrl: './chart-page.component.html',
	styleUrl: './chart-page.component.scss',
})
export class ChartPageComponent implements OnInit, OnDestroy {
	private readonly COUNT_INSTRUMENTS_PER_REQUEST: number = 20;
	private unsubscribe$: Subject<void> = new Subject<void>();

	public exchanges: Exchanges = [];
	public providers: Providers = [];
	public instrumentsData: InstrumentsData = {
		instruments: [],
		pagination: {},
	};

	public marketplaceForm: FormGroup = new FormGroup({
		providers: new FormControl(''),
		exchanges: new FormControl(''),
	});

  public instrumentForm: FormGroup = new FormGroup({
    instrumentId: new FormControl(''),
    provider: new FormControl('')
  });

  get selectedInstrumentId() {
    return this.instrumentForm.get('instrumentId')?.value
  }

  get selectedProvider() {
    return this.instrumentForm.get('provider')?.value
  }

  constructor(
    private providerService: ProviderService,
    private exchangeService: ExchangeService,
    private instrumentsService: InstrumentService,
  ) {}

  ngOnInit(): void {
    this.updateInstruments();

    this.providerService
      .getProviders()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (providers: Providers) => {
          this.providers = providers;

          this.exchangeService
            .getExchanges()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (exchanges: Exchange) => {
                // Object to Array and leave only unique exchanges
                this.exchanges = providers.reduce(
                  (acc: Exchanges, provider: string) => {
                    acc.push(...exchanges[provider].filter((e) => e !== ''));
                    return [...new Set(acc)];
                  },
                  [],
                );
              },
            });
        },
      });

    this.marketplaceForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.instrumentsData.instruments = [];
        this.instrumentsData.pagination = {};

        this.getInstruments(1).subscribe({
          next: (response: Response<Instruments>) => {
            this.instrumentsData.instruments.push(...response.data);
            this.instrumentsData.pagination = response.paging!;
          },
        });
      },
    });
  }

  onInstrumentChange(instrumentId: string, provider: string) {
    this.instrumentForm.setValue({ instrumentId, provider })
  }

	updateInstruments() {
		const page: number = (this.instrumentsData.pagination.page! || 0) + 1;

		this.getInstruments(page).subscribe({
			next: (response: Response<Instruments>) => {
				this.instrumentsData.instruments.push(...response.data);
				this.instrumentsData.pagination = response.paging!;
			},
		});
	}

	private getInstruments(
		page: number,
		providers: string[] = this.marketplaceForm.value.providers || [],
		exchanges: string[] = this.marketplaceForm.value.exchanges || [],
		size: number = this.COUNT_INSTRUMENTS_PER_REQUEST,
	) {
		const configuration: InstrumentsConfiguration = {
			page,
			size,
			providers,
			exchanges,
		};

		return this.instrumentsService.getInstrumentsRequest(configuration);
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
