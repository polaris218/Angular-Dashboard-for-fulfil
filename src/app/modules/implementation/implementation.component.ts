import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-implementation',
  templateUrl: './implementation.component.html',
  styleUrls: ['./implementation.component.css']
})
export class ImplementationComponent implements OnInit {
  windowHeight: any;
  constructor() {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    this.windowHeight = window.innerHeight - 150 + 'px';
  }
}
