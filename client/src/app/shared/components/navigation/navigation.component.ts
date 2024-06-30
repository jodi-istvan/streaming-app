import { Component, OnInit, Signal } from '@angular/core';
import IUser from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  user: Signal<IUser> = toSignal(this.authService.user);
  isUserLoading: Signal<boolean> = toSignal(this.authService.isUserLoading);
  
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  
  ngOnInit(): void {}
  
  logout(): void {
    this.authService.logout();
    from(this.router.navigate(['/'])).subscribe();
  }
}
