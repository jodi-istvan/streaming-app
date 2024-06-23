import {
  AfterViewInit,
  Component,
  EventEmitter, inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { ViewportBreakpoints, ViewportService } from '../../../services/viewport.service';
import { combineLatest, first, merge, startWith } from 'rxjs';

@Component({
  selector: 'app-navigation-slider',
  templateUrl: './navigation-slider.component.html',
  styleUrls: ['./navigation-slider.component.scss']
})
export class NavigationSliderComponent implements OnInit, AfterViewInit {
  
  @ViewChild('collapse') ngbCollapse: NgbCollapse;
  
  @Input() isCollapsed: boolean = true;
  @Output() isCollapsedChange = new EventEmitter<boolean>();
  
  public animationEnabled = false;
  
  // public mainContentOffset = 0;

  constructor(private viewportService: ViewportService) {}
  
  ngOnInit() {
    this.viewportService.breakpoint$.pipe(first()).subscribe(br => {
      this.isCollapsed = br < ViewportBreakpoints.MD;
    }).unsubscribe();
    
    this.viewportService.breakpoint$.subscribe(br => {
      this.animationEnabled = br < ViewportBreakpoints.MD;
    });
  }
  
  ngAfterViewInit() {
    // const breakpointObs = this.viewportService.breakpoint$;
    // const collapseObs = this.ngbCollapse.ngbCollapseChange;
    // combineLatest([breakpointObs, collapseObs]).subscribe(([breakpoint, isCollapsed]) => {
    //   console.log(breakpoint, isCollapsed);
    //   if (breakpoint >= ViewportBreakpoints.MD) {
    //     this.mainContentOffset = isCollapsed ? 64 : 240;
    //   } else {
    //     this.mainContentOffset = 0;
    //   }
    // });
  }
  
  public toggle(): void {
    this.ngbCollapse.toggle();
  }
}
