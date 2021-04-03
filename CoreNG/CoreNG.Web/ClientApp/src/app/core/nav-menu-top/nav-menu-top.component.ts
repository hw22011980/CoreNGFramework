import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-menu-top',
  templateUrl: './nav-menu-top.component.html',
  styleUrls: ['./nav-menu-top.component.css']
})
export class NavMenuTopComponent {
  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
