import { EventEmitter, Inject, Injectable, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export enum ViewportBreakpoints {
  XS = 0,
  SM = 576,
  MD = 768,
  LG= 992,
  XL = 1200,
  XXL = 1400
}

@Injectable({
  providedIn: 'root'
})
export class ViewportService implements OnInit {
  
  public screenWidth$: EventEmitter<number> = new EventEmitter<number>();
  public screenHeight$: EventEmitter<number> = new EventEmitter<number>();
  public breakpoint$: EventEmitter<number> = new EventEmitter<number>();
  
  private window: Window;
  
  constructor(@Inject(DOCUMENT) private _document: Document) {
    this.window = _document.defaultView;
    this.window.addEventListener('resize', () => {
      this.setScreenWidth();
      this.setScreenHeight();
    })
  }
  
  ngOnInit() {
    this.setScreenWidth();
    this.setScreenHeight();
  }
  
  private setScreenWidth(): void {
    const width = this.window.innerWidth;
    this.screenWidth$.emit(width);
    
    if (width >= ViewportBreakpoints.XXL) {
      this.breakpoint$.emit(ViewportBreakpoints.XXL);
    } else if (width >= ViewportBreakpoints.XL) {
      this.breakpoint$.emit(ViewportBreakpoints.XL);
    } else if (width >= ViewportBreakpoints.LG) {
      this.breakpoint$.emit(ViewportBreakpoints.LG);
    } else if (width >= ViewportBreakpoints.MD) {
      this.breakpoint$.emit(ViewportBreakpoints.MD);
    } else if (width >= ViewportBreakpoints.SM) {
      this.breakpoint$.emit(ViewportBreakpoints.SM);
    } else {
      this.breakpoint$.emit(ViewportBreakpoints.XS);
    }
  }
  
  private setScreenHeight(): void {
    this.screenHeight$.emit(this.window.innerHeight);
  }
}
