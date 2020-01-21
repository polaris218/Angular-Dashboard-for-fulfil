import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from '../../../core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';
const helper = new JwtHelperService();

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  public toggleUI = true;
  title = 'Fulfil Dashboard';
  mobileQuery: MediaQueryList;
  sidenavOpen = 1;
  titleNav = 'Home';
  navLoading = true;
  routerEvent = null;

  fillerNav = [
    { title: 'Home', component: '/home', icon: 'home' },
    { title: 'Orders', component: '/orders', icon: 'reorder' },
    { title: 'Search', component: '/elastic-search', icon: 'search' },
    { title: 'Create Item', component: '/create-item', icon: 'add' },
    { title: 'Error Log', component: '/error-log', icon: 'build' },
    {
      title: 'Documentation',
      component: '/documentation',
      icon: 'library_books'
    },
    {
      title: 'Developer Portal',
      component: '/developer-portal',
      icon: 'library_books'
    },
    {
      title: 'Implementation',
      component: '/implementation',
      icon: 'menu_book'
    },
    { title: 'Demos', component: '/demos', icon: 'bookmark' },
    { title: 'Simulation', component: '/simulation', icon: 'schedule' },
    { title: 'Feeds', component: '/feeds', icon: 'cloud_upload' },
    {
      title: 'Image Annotations',
      component: '/image-annotations',
      icon: 'collections'
    },
    {
      title: 'Ground Truth Tool',
      component: '/ground-truth-tool',
      icon: 'done_all'
    },
    { title: 'Receiver', component: '/receiver', icon: 'explore' },
    { title: 'Customer Order', component: '/customer-order', icon: 'reorder' },
    { title: 'System Uptime', component: '/system-uptime', icon: 'trending_up' },
    { title: 'Manage User Permissions', component: '/manage-user-permissions', icon: 'vpn_key' }
  ];

  private mobileQueryListener: () => void;
  @ViewChild('snav') public snav;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private commonService: CommonService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.isMob();
  }

  /**
   *  code function on component load
   */
  ngOnInit(): void {
    const tokenData = helper.decodeToken(localStorage.getItem('token'));
    if (!!tokenData.data.api_key) {
      this.commonService.apiKey = tokenData.data.api_key;
    }
    if (tokenData.data.username !== 'dev') {
      this.commonService.getUserPermission().subscribe(
        (res: any) => {
          const data = res.data.map(i => i.pagePath);

          this.fillerNav = _.filter(
            this.fillerNav,
            i => data.indexOf(i.component) !== -1
          );

          this.commonService.permission = data;

          // Check url on page load and confirm permission exists or not
          if (localStorage.getItem('token')) {
            if (
              data.indexOf(this.router.url) === -1 &&
              this.router.url.toLowerCase() !== '/unauthorized'
            ) {
              this.router.navigate(['/unauthorized']);
            }
          }

          // Watch all ourter events and check permission all time when routes occured.
          this.routerEvent = this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((navigationEnd: NavigationEnd) => {
              // Check url on router change and confirm permission exists or not
              if (localStorage.getItem('token')) {
                if (
                  data.indexOf(navigationEnd.urlAfterRedirects) === -1 &&
                  navigationEnd.urlAfterRedirects.toLowerCase() !==
                    '/unauthorized'
                ) {
                  this.router.navigate(['/unauthorized']);
                }
              }
            });

          this.navLoading = false;
        },
        () => {
          this.navLoading = false;
        }
      );
    } else {
      this.navLoading = false;
    }
  }

  /**
   *  code function on component load
   */
  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this.mobileQueryListener);
    if (this.routerEvent) {
      this.routerEvent.unsubscribe();
    }
  }

  /**
   * Is Mobile
   */
  isMob() {
    if (this.mobileQuery.matches === true) {
      this.sidenavOpen = 0;
    }
  }

  /**
   * Menu Close Mobile
   * @param router router
   */
  menuCloseMob() {
    if (this.mobileQuery.matches === true) {
      this.sidenavOpen = 0;
      this.snav.close();
    }
  }

  /**
   * isActive
   * @param router router
   */
  isActive(router: string) {
    const onlyUrl = this.router.url.split(';');
    if (onlyUrl[0] === router) {
      if (router === '/home') {
        this.titleNav = 'Home';
      }
      if (router === '/orders') {
        this.titleNav = 'Orders';
      }
      if (router === '/elastic-search') {
        this.titleNav = 'Search';
      }
      if (router === '/create-item') {
        this.titleNav = 'Create Item';
      }
      if (router === '/error-log') {
        this.titleNav = 'Error Logs';
      }
      if (router === '/documentation') {
        this.titleNav = 'Documentation';
      }
      if (router === '/demos') {
        this.titleNav = 'Demos';
      }
      if (router === '/simulation') {
        this.titleNav = 'Simulation';
      }
      if (router === '/feeds') {
        this.titleNav = 'Feeds';
      }
      if (router === '/image-annotations') {
        this.titleNav = 'Image Annotation Tool';
      }
      if (router === '/ground-truth-tool') {
        this.titleNav = 'Ground Truth Tool';
      }
      if (router === '/receiver') {
        this.titleNav = 'Receiver';
      }
      if (router === '/customer-order') {
        this.titleNav = 'Customer Order Dashboard';
      }
      if (router === '/implementation') {
        this.titleNav = 'Implementation';
      }
      if (router === '/system-uptime') {
        this.titleNav = 'System Uptime';
      }
      if (router === '/manage-user-permissions') {
        this.titleNav = 'Manage User Permission';
      }
      return true;
    }
    if (onlyUrl[0] === '/add-meta-data' && router === '/create-item') {
      this.titleNav = 'Add Meta Data';
      return true;
    }
  }

  /**
   * toggle Nav
   */
  toggleNav() {
    this.snav.toggle();
    if (this.sidenavOpen === 1) {
      this.sidenavOpen = 0;
    } else {
      this.sidenavOpen = 1;
    }
  }

  /**
   * Logout
   */
  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
