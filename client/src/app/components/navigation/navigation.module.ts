import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { SharedModule } from '../../shared/shared.module';
import { NavigationSidebarComponent } from './navigation-sidebar/navigation-sidebar.component';

@NgModule({
  declarations: [
    NavigationComponent,
    NavigationSidebarComponent
  ],
  exports: [
    NavigationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class NavigationModule { }
