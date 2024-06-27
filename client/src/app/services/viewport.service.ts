import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { WindowInjector } from '../shared/services/window-injector.service';

export enum ViewportBreakpoints {
  XS = 0,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1400
}

@Injectable({
  providedIn: 'root'
})
export class ViewportService extends WindowInjector {
  
  public screenWidth$: ReplaySubject<number> = new ReplaySubject<number>();
  public screenHeight$: ReplaySubject<number> = new ReplaySubject<number>();
  public breakpoint$: ReplaySubject<number> = new ReplaySubject<number>();
  
  constructor() {
    super();

    this.window.addEventListener('resize', () => {
      this.setScreenWidth(this.getWidth());
      this.setScreenHeight(this.getHeight());
    });
    
    this.setScreenWidth(this.getWidth());
    this.setScreenHeight(this.getHeight());
    this.setBreakpoint(this.getWidth());
  }
  
  private getWidth(): number {
    return this.window.innerWidth;
  }
  
  private getHeight(): number {
    return this.window.innerHeight;
  }
  
  private setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
    this.setBreakpoint(width);
  }
  
  private setScreenHeight(height: number): void {
    this.screenHeight$.next(height);
  }
  
  private setBreakpoint(width: number): void {
    if (width >= ViewportBreakpoints.XXL) {
      this.breakpoint$.next(ViewportBreakpoints.XXL);
    } else if (width >= ViewportBreakpoints.XL) {
      this.breakpoint$.next(ViewportBreakpoints.XL);
    } else if (width >= ViewportBreakpoints.LG) {
      this.breakpoint$.next(ViewportBreakpoints.LG);
    } else if (width >= ViewportBreakpoints.MD) {
      this.breakpoint$.next(ViewportBreakpoints.MD);
    } else if (width >= ViewportBreakpoints.SM) {
      this.breakpoint$.next(ViewportBreakpoints.SM);
    } else {
      this.breakpoint$.next(ViewportBreakpoints.XS);
    }
  }
}
