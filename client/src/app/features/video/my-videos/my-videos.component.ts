import { Component, OnInit, Signal } from '@angular/core';
import IUser from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-video-upload',
  templateUrl: './my-videos.component.html',
  styleUrls: ['./my-videos.component.scss']
})
export class MyVideosComponent implements OnInit {
  
  user: Signal<IUser> = toSignal(this.authService.user);
  
  constructor(
    private authService: AuthService,
  ) {}
  
  ngOnInit() {
  
  }
}
