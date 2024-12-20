import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbCollapseModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputComponent } from './components/input/input.component';
import { RouterLink, RouterOutlet } from '@angular/router';

const declarations = [
  InputComponent,
];

@NgModule({
  declarations: declarations,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    NgbModule,
    RouterOutlet,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDropdownModule,
    NgbCollapseModule,
    RouterLink,
    RouterOutlet,
    ...declarations
  ]
})
export class SharedModule { }
