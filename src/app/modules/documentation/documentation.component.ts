import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  windowHeight: any;
  constructor() {
    this.windowHeight = window.innerHeight - 150 + 'px';
  }

  /**
   *  code function on component load
   */
  ngOnInit() {}
}
