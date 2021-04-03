import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  constructor(private location: Location, private router: Router) {}

  onBack() {
    // this.location.back();
    this.router.navigateByUrl('');
  }
}
