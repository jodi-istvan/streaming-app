import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  
  public isCollapsed = true;
  public navbarHeight = 0;
  
  @ViewChild('navbar', { static: true }) navbar: ElementRef;
  
  ngOnInit() {
    this.navbarHeight = this.navbar.nativeElement.offsetHeight;
  }
}
