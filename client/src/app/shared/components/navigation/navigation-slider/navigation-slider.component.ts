import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { ViewportBreakpoints, ViewportService } from '../../../../services/viewport.service';

@Component({
  selector: 'app-navigation-slider',
  templateUrl: './navigation-slider.component.html',
  styleUrls: ['./navigation-slider.component.scss']
})
export class NavigationSliderComponent implements OnInit {
  
  @ViewChild('collapse') ngbCollapse: NgbCollapse;
  
  @Input() isCollapsed: boolean = true;
  @Output() isCollapsedChange = new EventEmitter<boolean>();
  
  public animationEnabled = false;

  constructor(private viewportService: ViewportService) {}
  
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
