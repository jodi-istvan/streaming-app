import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Signal,
  ViewChild,
} from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { ViewportBreakpoints, ViewportService } from '../../../../services/viewport.service';
import { AuthService } from '../../../../services/auth.service';
import IUser from '../../../../models/user.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navigation-slider',
  templateUrl: './navigation-slider.component.html',
  styleUrls: ['./navigation-slider.component.scss']
})
export class NavigationSliderComponent implements OnInit {
  
  @ViewChild('collapse') ngbCollapse: NgbCollapse;
  
  @Input() isCollapsed: boolean = true;
  @Output() isCollapsedChange = new EventEmitter<boolean>();
  
  user: Signal<IUser> = toSignal(this.authService.user);
  
  public animationEnabled = false;

  constructor(
    private viewportService: ViewportService,
    private authService: AuthService,
  ) {}
  
  ngOnInit() {
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
