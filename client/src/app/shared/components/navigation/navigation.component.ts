import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import IUser from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  user: WritableSignal<IUser> = signal(null);
  isUserLoading: WritableSignal<boolean> = signal(false);
  
  constructor(
    public authService: AuthService,
  ) {}
  
  ngOnInit(): void {
    this.authService.user.subscribe(user => this.user.set(user));
    this.authService.isUserLoading.subscribe(isLoading => this.isUserLoading.set(isLoading));
  }
}
