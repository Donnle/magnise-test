import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private requestCount: number = 0;

  public get loading$() {
    return this.loading$$.asObservable();
  }

  public show() {
    this.requestCount++;

    if (this.requestCount === 1) {
      this.loading$$.next(true);
    }
  }

  public hide() {
    this.requestCount--;

    if (this.requestCount === 0) {
      this.loading$$.next(false);
    }
  }
}
