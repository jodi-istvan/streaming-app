import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export class WindowInjector {
  
  protected window: Window;
  
  constructor() {
    const document = inject(DOCUMENT)
    this.window = document.defaultView;
  }
}
