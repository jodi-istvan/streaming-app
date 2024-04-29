import { Component, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navigation-sidebar',
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.scss']
})
export class NavigationSidebarComponent {
  
  @ViewChild('collapse')
  private ngbCollapse: NgbCollapse;
  
  public isCollapsed = false;
  public overlayView = false;
  
  public toggle(): void {
    this.ngbCollapse.toggle()
  }
}
