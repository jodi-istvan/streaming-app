import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navigation-logo',
  templateUrl: './navigation-logo.component.html',
  styleUrls: ['./navigation-logo.component.scss']
})
export class NavigationLogoComponent {

  @Input() ariaExpanded = false;
  @Output() onMenuBtnClick = new EventEmitter<void>();
}
