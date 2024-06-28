import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { AsyncPipe, CurrencyPipe, DatePipe, JsonPipe } from "@angular/common";
import { map, Observable, skip, Subject, Subscription, takeUntil, tap } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CountBackService } from '../../../core/services/count-back.service';
import { AuthorizationTokensService } from "../../../core/services/authorization/authorization-tokens.service";
import { configureCharts, updateCharts } from '../../../core/utils/chart';
import { CountBack, CountBackConfiguration, } from '../../../core/interfaces/count-back';
import { LoadingService } from "../../../core/services/loading.service";
import { PERIODICITY } from "../../../core/enums/count-back";

interface CountBackMetadata {
	dates: string[];
	data: number[][];
}

@Component({
	selector: 'app-candlestick-chart',
	standalone: true,
  imports: [NgxEchartsDirective, JsonPipe, CurrencyPipe, DatePipe, AsyncPipe],
	templateUrl: './candlestick-chart.component.html',
	styleUrl: './candlestick-chart.component.scss',
})
export class CandlestickChartComponent implements OnInit, OnChanges, OnDestroy {
	private readonly COUNT_BACK_PERIODICITY: PERIODICITY = PERIODICITY.MINUTE;
	private readonly COUNT_BACK_INTERVAL: number = 1;
	private readonly COUNT_BACK_BARS: number = 200;

  private unsubscribe$: Subject<void> = new Subject<void>();
  private countBackSubscription?: Subscription;

	private isScrollLocked: boolean = false;

  public options!: EChartsOption;
  public updateOptions!: EChartsOption;

  /** Stores all data history */
  public dates: string[] = []
  public data: number[][] = [];


  @Input() provider!: string;
  @Input() instrumentId!: string

  public get lastStickData() {
    const lastDate: string = this.dates[this.dates.length - 1];
    const lastData: number[] = this.data[this.data.length - 1];

    if (lastDate == null || lastDate.length === 0) {
      return null
    }

    return {
      date: lastDate,
      data: {
        open: lastData[0],
        close: lastData[1],
        lowest: lastData[2],
        highest: lastData[3],
      },
    }
  }

	private get startDate() {
		return this.dates[0] || '';
	}

	constructor(
    private countBackService: CountBackService,
    private authorizationTokensService: AuthorizationTokensService,
    public loadingService: LoadingService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset data before request
    this.dates = []
    this.data = []
    this.options = {}
    this.updateOptions = {};

    this.isScrollLocked = false;

    this.countBackSubscription?.unsubscribe();
    this.countBackSubscription = this.updateCountBackMetadata().subscribe({
      next: () => {
        this.options = configureCharts(this.dates,  this.data);
      },
    });
  }

  ngOnInit() {
    this.webSocketListener()
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(skip(1))
      .subscribe({
        next: () => {
          this.updateCountForwardMetadata()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: () => {
                console.log('UPDATED!');
              }
            })
        }
      })
  }

  private webSocketListener(): Observable<any> {
    const url: string = 'wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=' + this.authorizationTokensService.accessToken;
    return webSocket({ url })
  }

  /**
   * Use this method when you need to check do you need to send request for data updating
   *
   * @param event Get scrolled width from this object
   *
   * @return void - As result - we have updated data
   */
  onChartDataZoomChange(event: any): void {
		const startWidth: number = event?.start || event?.batch?.[0]?.start || 0;
		const sendRequestWidth: number = (this.COUNT_BACK_BARS / this.data.length * 100) / 2

		if (startWidth < sendRequestWidth && !this.isScrollLocked) {
			this.isScrollLocked = true;

      this.countBackSubscription = this.updateCountBackMetadata().subscribe({
				next: () => {
          const startZoom: number = (this.COUNT_BACK_BARS / this.data.length * 100) / 2;

					this.updateOptions = updateCharts(this.dates, this.data, startZoom);
				},
			});
		}
	}

  /**
   * Use this method when you need to update count-forward metadata (pricing history update)
   *
   * @param instrumentId Instrument (required for request)
   * @param provider Provider (required for request)
   *
   * @return CountBackMetadata - Metadata for chars
   */
  private updateCountForwardMetadata(
    instrumentId: string = this.instrumentId,
    provider: string = this.provider,
  ): Observable<CountBackMetadata> {
    return this.getCountBackMetadata(instrumentId, provider, undefined).pipe(
      tap(({ dates, data }) => {
        const lastDate: string = this.dates[this.dates.length - 1];

        const updatedDataIndex: number = dates.findIndex(date => date === lastDate);

        this.dates = this.dates.slice(0, -1)
        this.data = this.data.slice(0, -1)

        this.dates.push(...dates.slice(updatedDataIndex));
        this.data.push(...data.slice(updatedDataIndex));

        this.updateOptions = updateCharts(this.dates, this.data);
      })
    )
  }

  /**
   * Use this method when you need to update count-back metadata (pricing history)
   *
   * @param instrumentId Instrument (required for request)
   * @param provider Provider (required for request)
   *
   * @return CountBackMetadata - Metadata for chars
   */
  private updateCountBackMetadata(
    instrumentId: string = this.instrumentId,
    provider: string = this.provider,
  ): Observable<CountBackMetadata> {
    return this.getCountBackMetadata(instrumentId, provider, this.startDate).pipe(
      tap(({ dates, data }) => {
        this.dates.unshift(...dates);
        this.data.unshift(...data);

        this.isScrollLocked = data.length < this.COUNT_BACK_BARS;
      })
    )
  }


  /**
   * Use this method when you need to get count-back metadata (pricing history)
   *
   * @param instrumentId Instrument (required for request)
   * @param provider Provider (required for request)
   * @param date We will take data from this date to unknown (required for request)
   *
   * @return CountBackMetadata - Metadata for chars
   */
	private getCountBackMetadata(
		instrumentId: string,
		provider: string,
    date?: string
	): Observable<CountBackMetadata> {
		const configuration: CountBackConfiguration = {
			instrumentId,
			provider,
			date,
			interval: this.COUNT_BACK_INTERVAL,
			periodicity: this.COUNT_BACK_PERIODICITY,
			barsCount: this.COUNT_BACK_BARS,
		};

		return this.countBackService.getCountBack(configuration).pipe(
      map((countBacks: CountBack[]) => {
        const dates: string[] = [];
        const data: number[][] = [];

        countBacks.reverse().forEach((cb: CountBack) => {
          dates.unshift(cb.t);
          data.unshift([cb.o, cb.c, cb.l, cb.h]);
        });

        return { dates, data };
      }),
    );
	}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.countBackSubscription?.unsubscribe();
  }
}
