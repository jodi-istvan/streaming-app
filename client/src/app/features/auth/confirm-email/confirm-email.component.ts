import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  
  email: string;

  constructor(
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.email = this.location.getState()['email'];
  }
}
