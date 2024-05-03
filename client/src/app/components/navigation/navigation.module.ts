import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { SharedModule } from '../../shared/shared.module';
import { NavigationSidebarComponent } from './navigation-sidebar/navigation-sidebar.component';
import { NavigationSliderComponent } from './navigation-slider/navigation-slider.component';
import { NavigationLogoComponent } from './navigation-logo/navigation-logo.component';

@NgModule({
  declarations: [
    NavigationComponent,
    NavigationSidebarComponent,
    NavigationSliderComponent,
    NavigationLogoComponent
  ],
  exports: [
    NavigationComponent,
    NavigationSidebarComponent,
    NavigationSliderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class NavigationModule { }
