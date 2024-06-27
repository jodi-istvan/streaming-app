import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import IUser from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  user: WritableSignal<IUser> = signal(null);
  isUserLoading: WritableSignal<boolean> = signal(false);
  
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  
  ngOnInit(): void {
    this.authService.user.subscribe(user => this.user.set(user));
    this.authService.isUserLoading.subscribe(isLoading => this.isUserLoading.set(isLoading));
  }
  
  logout(): void {
    this.authService.logout();
    from(this.router.navigate(['/'])).subscribe();
  }
}
