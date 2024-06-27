import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output, signal,
  ViewChild, WritableSignal
} from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { ViewportBreakpoints, ViewportService } from '../../../../services/viewport.service';
import { AuthService } from '../../../../services/auth.service';
import IUser from '../../../../models/user.model';

@Component({
  selector: 'app-navigation-slider',
  templateUrl: './navigation-slider.component.html',
  styleUrls: ['./navigation-slider.component.scss']
})
export class NavigationSliderComponent implements OnInit {
  
  @ViewChild('collapse') ngbCollapse: NgbCollapse;
  
  @Input() isCollapsed: boolean = true;
  @Output() isCollapsedChange = new EventEmitter<boolean>();
  
  user: WritableSignal<IUser> = signal(null);
  
  public animationEnabled = false;

  constructor(
    private viewportService: ViewportService,
    private authService: AuthService,
  ) {}
  
  ngOnInit() {
    this.authService.user.subscribe(user => this.user.set(user));
    
    this.viewportService.breakpoint$.pipe(first()).subscribe(br => {
      this.isCollapsed = br < ViewportBreakpoints.MD;
    }).unsubscribe();
    
    this.viewportService.breakpoint$.subscribe(br => {
      this.animationEnabled = br < ViewportBreakpoints.MD;
    });
  }
  
  public toggle(): void {
    this.ngbCollapse.toggle();
  }
}
