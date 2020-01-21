import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { of, Observable, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  /**
   * Preloading Strategy for lazy loaded modules.
   * @param Route route
   * @param Function load
   */
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const loadRoute = (delay, delayTime = 10000) =>
      delay ? timer(delayTime).pipe(flatMap(_ => load())) : load();
    return route.data && route.data.preload
      ? loadRoute(route.data.delay, route.data.delayTime)
      : of(null);
  }
}
