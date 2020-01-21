import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-developer-portal',
  templateUrl: './developer-portal.component.html',
  styleUrls: ['./developer-portal.component.css']
})
export class DeveloperPortalComponent implements OnInit {
  public swaggerPath: any;
  public windowHeight: any;
  constructor(public sanitizer: DomSanitizer) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    this.windowHeight = window.innerHeight - 150 + 'px';
    this.swaggerPath = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.API_URL + 'portal'
    );
  }
}
