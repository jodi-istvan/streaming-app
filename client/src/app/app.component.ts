import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { VideoService } from './services/video.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private videoService: VideoService
  ) {
    
    //
    // this.videoService.getById('656bd42d23884c9ba479a175').subscribe(video => {
    //   console.log(video);
    // });
    //
    // this.videoService.likeVideo('656bd42d23884c9ba479a175', 'REMOVE').subscribe(res => {
    //   console.log(res);
    // });
  }
  
  ngOnInit() {
  }
}
