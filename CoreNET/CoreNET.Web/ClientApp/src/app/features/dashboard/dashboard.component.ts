import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  displayData: any[];
  orderColumns = [
    {
      key: 'test',
      title: 'Test',
    },
    {
      key: 'title',
      title: 'Test 2',
    },
    {
      key: 'title2',
      title: 'Test 3',
    },
    {
      key: 'title3',
      title: 'Test 4',
    },
    {
      key: 'title4',
      title: 'Test 5',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.displayData = [
      {
        test: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        title2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        title3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        title4: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    ];
  }
}
