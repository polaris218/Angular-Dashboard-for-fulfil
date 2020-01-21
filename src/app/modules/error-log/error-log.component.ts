import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
import {
  CommonService,
  IBackEndElement,
  IFactoryElement,
  IDashboardElement,
  IInventoryElement,
  IAutomationElement
} from './../../core';

@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.css']
})
export class ErrorLogComponent implements OnInit {
  ELEMENT_DATA_BACKEND: IBackEndElement[] = [];
  ELEMENT_DATA_FACTORY: IFactoryElement[] = [];
  ELEMENT_DATA_DASHBOARD: IDashboardElement[] = [];
  ELEMENT_DATA_AUTOMATION: IAutomationElement[] = [];
  ELEMENT_DATA_INVENTORY: IInventoryElement[] = [];
  displayedBackEndColumns: string[] = ['date', 'time', 'errorMsg'];
  displayedFactoryColumns: string[] = ['date', 'time', 'errorMsg'];
  displayedDashboardColumns: string[] = ['date', 'time', 'errorMsg'];
  displayedAutomationColumns: string[] = ['date', 'time', 'errorMsg'];
  displayedInventoryColumns: string[] = ['date', 'time', 'errorMsg'];
  backEndDataSource: any;
  factoryDataSource: any;
  dashboardDataSource: any;
  automationDataSource: any;
  inventoryDataSource: any;
  public backEnd = [];
  public backEndLength = [];
  public factory = [];
  public factoryLength = [];
  public dashboard = [];
  public dashboardLength = [];
  public automation = [];
  public automationLength = [];
  public inventory = [];
  public inventoryLength = [];
  @ViewChild('paginatorBackEnd', { read: MatPaginator })
  paginatorBackEnd: MatPaginator;
  @ViewChild('paginatorFactory', { read: MatPaginator })
  paginatorFactory: MatPaginator;
  @ViewChild('paginatorDashboard', { read: MatPaginator })
  paginatorDashboard: MatPaginator;
  @ViewChild('paginatorAutomation', { read: MatPaginator })
  paginatorAutomation: MatPaginator;
  @ViewChild('paginatorInventory', { read: MatPaginator })
  paginatorInventory: MatPaginator;
  backEndFilterType = 'all';
  backEndSearch = '';
  factoryFilterType = 'all';
  factorySearch = '';
  dashboardFilterType = 'all';
  dashboardSearch = '';
  automationFilterType = 'all';
  automationSearch = '';
  inventoryFilterType = 'all';
  inventorySearch = '';
  isLoading = true;

  pageIndexBackEnd = 1;
  pageSizeBackEnd = 100;
  lowValueBackEnd = 0;
  highValueBackEnd = 100;
  dataSkipBackEnd = 0;
  dataLimitBackEnd = 100;
  dataLengthBackEnd: any;

  pageIndexFactory = 1;
  pageSizeFactory = 100;
  lowValueFactory = 0;
  highValueFactory = 100;
  dataSkipFactory = 0;
  dataLimitFactory = 100;
  dataLengthFactory: any;

  pageIndexDashboard = 1;
  pageSizeDashboard = 100;
  lowValueDashboard = 0;
  highValueDashboard = 100;
  dataSkipDashboard = 0;
  dataLimitDashboard = 100;
  dataLengthDashboard: any;

  pageIndexAutomation = 1;
  pageSizeAutomation = 100;
  lowValueAutomation = 0;
  highValueAutomation = 100;
  dataSkipAutomation = 0;
  dataLimitAutomation = 100;
  dataLengthAutomation: any;

  pageIndexInventory = 1;
  pageSizeInventory = 100;
  lowValueInventory = 0;
  highValueInventory = 100;
  dataSkipInventory = 0;
  dataLimitInventory = 100;
  dataLengthInventory: any;

  constructor(
    private commonService: CommonService,
    public datepipe: DatePipe
  ) {}

  /**
   *  call function on component load
   */
  ngOnInit() {
    this.getBackEnd(this.backEndSearch, this.backEndFilterType, 'backend');
    this.getFactory(this.factorySearch, this.factoryFilterType, 'factory');
    this.getDashboard(
      this.dashboardSearch,
      this.dashboardFilterType,
      'dashboard'
    );
    this.getAutomation(
      this.automationSearch,
      this.automationFilterType,
      'automation'
    );
    this.getInventory(
      this.inventorySearch,
      this.inventoryFilterType,
      'inventory'
    );
  }

  /**
   * Get Paginator BackEnd Data
   * @param event event
   */
  getPaginatorDataBackEnd(event) {
    if (event.pageIndex === this.pageIndexBackEnd + 1) {
      this.lowValueBackEnd = this.lowValueBackEnd + this.pageSizeBackEnd;
      this.highValueBackEnd = this.highValueBackEnd + this.pageSizeBackEnd;
    } else if (event.pageIndex === this.pageIndexBackEnd - 1) {
      this.lowValueBackEnd = this.lowValueBackEnd - this.pageSizeBackEnd;
      this.highValueBackEnd = this.highValueBackEnd - this.pageSizeBackEnd;
    }
    this.pageIndexBackEnd = event.pageIndex;
    this.dataSkipBackEnd = event.pageSize * event.pageIndex;
    this.dataLimitBackEnd = event.pageSize;
  }

  /**
   * Get Paginator Factory Data
   * @param event event
   */
  getPaginatorDataFactory(event) {
    if (event.pageIndex === this.pageIndexFactory + 1) {
      this.lowValueFactory = this.lowValueFactory + this.pageSizeFactory;
      this.highValueFactory = this.highValueFactory + this.pageSizeFactory;
    } else if (event.pageIndex === this.pageIndexFactory - 1) {
      this.lowValueFactory = this.lowValueFactory - this.pageSizeFactory;
      this.highValueFactory = this.highValueFactory - this.pageSizeFactory;
    }
    this.pageIndexFactory = event.pageIndex;
    this.dataSkipFactory = event.pageSize * event.pageIndex;
    this.dataLimitFactory = event.pageSize;
  }

  /**
   * Get Paginator Dashboard Data
   * @param event event
   */
  getPaginatorDataDashboard(event) {
    if (event.pageIndex === this.pageIndexDashboard + 1) {
      this.lowValueDashboard = this.lowValueDashboard + this.pageSizeDashboard;
      this.highValueDashboard =
        this.highValueDashboard + this.pageSizeDashboard;
    } else if (event.pageIndex === this.pageIndexDashboard - 1) {
      this.lowValueDashboard = this.lowValueDashboard - this.pageSizeDashboard;
      this.highValueDashboard =
        this.highValueDashboard - this.pageSizeDashboard;
    }
    this.pageIndexDashboard = event.pageIndex;
    this.dataSkipDashboard = event.pageSize * event.pageIndex;
    this.dataLimitDashboard = event.pageSize;
  }

  /**
   * Get Paginator Automation Data
   * @param event event
   */
  getPaginatorDataAutomation(event) {
    if (event.pageIndex === this.pageIndexAutomation + 1) {
      this.lowValueAutomation =
        this.lowValueAutomation + this.pageSizeAutomation;
      this.highValueAutomation =
        this.highValueAutomation + this.pageSizeAutomation;
    } else if (event.pageIndex === this.pageIndexAutomation - 1) {
      this.lowValueAutomation =
        this.lowValueAutomation - this.pageSizeAutomation;
      this.highValueAutomation =
        this.highValueAutomation - this.pageSizeAutomation;
    }
    this.pageIndexAutomation = event.pageIndex;
    this.dataSkipAutomation = event.pageSize * event.pageIndex;
    this.dataLimitAutomation = event.pageSize;
  }

  /**
   * Get Paginator Inventory Data
   * @param event event
   */
  getPaginatorDataInventory(event) {
    if (event.pageIndex === this.pageIndexInventory + 1) {
      this.lowValueInventory = this.lowValueInventory + this.pageSizeInventory;
      this.highValueInventory =
        this.highValueInventory + this.pageSizeInventory;
    } else if (event.pageIndex === this.pageIndexInventory - 1) {
      this.lowValueInventory = this.lowValueInventory - this.pageSizeInventory;
      this.highValueInventory =
        this.highValueInventory - this.pageSizeInventory;
    }
    this.pageIndexInventory = event.pageIndex;
    this.dataSkipInventory = event.pageSize * event.pageIndex;
    this.dataLimitInventory = event.pageSize;
    this.getInventory(
      this.inventorySearch,
      this.inventoryFilterType,
      'inventory'
    );
  }

  /**
   * Search BackEnd
   * @param searchValue searchValue
   */
  onSearchBackEnd(searchValue: string) {
    this.getBackEnd(searchValue, this.backEndFilterType, 'backend');
    this.backEndSearch = searchValue;
    this.dataSkipBackEnd = 0;
    this.dataLimitBackEnd = 100;
  }

  /**
   * Get BackEnd Filter
   * @param event event
   */
  getBackEndFilter(event) {
    this.getBackEnd(this.backEndSearch, event, 'backend');
    this.backEndFilterType = event;
    this.dataSkipBackEnd = 0;
    this.dataLimitBackEnd = 100;
  }

  /**
   * Get BackEnd
   * @param searchString searchString
   * @param filterEnvironment filterEnvironment
   * @param filterTypes filterTypes
   */
  getBackEnd(searchString, filterEnvironment, filterTypes) {
    this.isLoading = true;
    if (filterEnvironment == null || filterEnvironment === undefined) {
      this.createErrorLog('Invalid Environment');
    } else if (filterTypes == null || filterTypes === undefined) {
      this.createErrorLog('Invalid Type');
    } else {
      this.commonService
        .getErrorLog(searchString, filterEnvironment, filterTypes)
        .subscribe(
          data => {
            this.backEnd = [];
            this.backEnd.push(data);
            if (this.backEnd[0].entries !== undefined) {
              this.dataLengthBackEnd = this.backEnd[0].entries.length;
            } else {
              this.dataLengthBackEnd = 0;
            }
            this.setTableBackEnd();
          },
          error => {
            this.createErrorLog(error.message);
          }
        );
    }
  }

  /**
   * Set Table BackEnd
   */
  setTableBackEnd() {
    this.ELEMENT_DATA_BACKEND = [];
    if (this.backEnd[0].entries !== undefined) {
      for (const item of this.backEnd[0].entries) {
        const newDate = new Date(item.timestamp);
        const latestDate = this.datepipe.transform(newDate, 'MM-dd-yyyy');
        const latestTime = this.datepipe.transform(newDate, 'hh:mm a');
        this.ELEMENT_DATA_BACKEND.push({
          date: latestDate,
          time: latestTime,
          errorMsg: item.jsonPayload.error_message || item.jsonPayload.message
        });
      }
    }
    this.backEndDataSource = new MatTableDataSource<IBackEndElement>(
      this.ELEMENT_DATA_BACKEND
    );
    this.isLoading = false;
  }

  /**
   * Search Factory
   * @param searchValue searchValue
   */
  onSearchFactory(searchValue: string) {
    this.getFactory(searchValue, this.factoryFilterType, 'factory');
    this.factorySearch = searchValue;
    this.dataSkipFactory = 0;
    this.dataLimitFactory = 100;
  }

  /**
   * Get FactoryFilter
   * @param event event
   */
  getFactoryFilter(event) {
    this.getFactory(this.factorySearch, event, 'factory');
    this.factoryFilterType = event;
    this.dataSkipFactory = 0;
    this.dataLimitFactory = 100;
  }

  /**
   * Get Factory
   * @param searchString searchString
   * @param filterEnvironment filterEnvironment
   * @param filterTypes filterTypes
   */
  getFactory(searchString, filterEnvironment, filterTypes) {
    this.isLoading = true;
    if (filterEnvironment == null || filterEnvironment === undefined) {
      this.createErrorLog('Invalid Environment');
    } else if (filterTypes == null || filterTypes === undefined) {
      this.createErrorLog('Invalid Type');
    } else {
      this.commonService
        .getErrorLog(searchString, filterEnvironment, filterTypes)
        .subscribe(
          data => {
            this.factory = [];
            this.factory.push(data);
            if (this.factory[0].entries !== undefined) {
              this.dataLengthFactory = this.factory[0].entries.length;
            } else {
              this.dataLengthFactory = 0;
            }
            this.setTableFactory();
          },
          error => {
            this.createErrorLog(error.message);
          }
        );
    }
  }

  /**
   * Set Table Factory
   */
  setTableFactory() {
    this.ELEMENT_DATA_FACTORY = [];
    if (this.factory[0].entries !== undefined) {
      for (const item of this.factory[0].entries) {
        const newDate = new Date(item.timestamp);
        const latestDate = this.datepipe.transform(newDate, 'MM-dd-yyyy');
        const latestTime = this.datepipe.transform(newDate, 'hh:mm a');
        this.ELEMENT_DATA_FACTORY.push({
          date: latestDate,
          time: latestTime,
          errorMsg: item.jsonPayload.error_message || item.jsonPayload.message
        });
      }
    }
    this.factoryDataSource = new MatTableDataSource<IFactoryElement>(
      this.ELEMENT_DATA_FACTORY
    );
    this.isLoading = false;
  }

  /**
   * Search Dashboard
   * @param searchValue searchValue
   */
  onSearchDashboard(searchValue: string) {
    this.getDashboard(searchValue, this.dashboardFilterType, 'dashboard');
    this.dashboardSearch = searchValue;
    this.dataSkipDashboard = 0;
    this.dataLimitDashboard = 100;
  }

  /**
   * Get DashboardFilter
   * @param event event
   */
  getDashboardFilter(event) {
    this.getDashboard(this.dashboardSearch, event, 'dashboard');
    this.dashboardFilterType = event;
    this.dataSkipDashboard = 0;
    this.dataLimitDashboard = 100;
  }

  /**
   * Get Dashboard
   * @param searchString searchString
   * @param filterEnvironment filterEnvironment
   * @param filterTypes filterTypes
   */
  getDashboard(searchString, filterEnvironment, filterTypes) {
    this.isLoading = true;
    if (filterEnvironment == null || filterEnvironment === undefined) {
      this.createErrorLog('Invalid Environment');
    } else if (filterTypes == null || filterTypes === undefined) {
      this.createErrorLog('Invalid Type');
    } else {
      this.commonService
        .getErrorLog(searchString, filterEnvironment, filterTypes)
        .subscribe(
          data => {
            this.dashboard = [];
            this.dashboard.push(data);
            if (this.dashboard[0].entries !== undefined) {
              this.dataLengthDashboard = this.dashboard[0].entries.length;
            } else {
              this.dataLengthDashboard = 0;
            }
            this.setTableDashboard();
          },
          error => {
            this.createErrorLog(error.message);
          }
        );
    }
  }

  /**
   * Set Table Dashboard
   */
  setTableDashboard() {
    this.ELEMENT_DATA_DASHBOARD = [];
    if (this.dashboard[0].entries !== undefined) {
      for (const item of this.dashboard[0].entries) {
        const newDate = new Date(item.timestamp);
        const latestDate = this.datepipe.transform(newDate, 'MM-dd-yyyy');
        const latestTime = this.datepipe.transform(newDate, 'hh:mm a');
        this.ELEMENT_DATA_DASHBOARD.push({
          date: latestDate,
          time: latestTime,
          errorMsg: item.jsonPayload.error_message || item.jsonPayload.message
        });
      }
    }
    this.dashboardDataSource = new MatTableDataSource<IDashboardElement>(
      this.ELEMENT_DATA_DASHBOARD
    );
    this.dashboardDataSource.paginator = this.paginatorDashboard;
    this.isLoading = false;
  }

  /**
   * SearchAutomation
   * @param searchValue searchValue
   */
  onSearchAutomation(searchValue: string) {
    this.getAutomation(searchValue, this.automationFilterType, 'automation');
    this.automationSearch = searchValue;
    this.dataSkipAutomation = 0;
    this.dataLimitAutomation = 100;
  }

  /**
   * Get Automation Filter
   * @param event event
   */
  getAutomationFilter(event) {
    this.getAutomation(this.automationSearch, event, 'automation');
    this.automationFilterType = event;
    this.dataSkipAutomation = 0;
    this.dataLimitAutomation = 100;
  }

  /**
   * Get Automation
   * @param searchString searchString
   * @param filterEnvironment filterEnvironment
   * @param filterTypes filterTypes
   */
  getAutomation(searchString, filterEnvironment, filterTypes) {
    this.isLoading = true;
    if (filterEnvironment == null || filterEnvironment === undefined) {
      this.createErrorLog('Invalid Environment');
    } else if (filterTypes == null || filterTypes === undefined) {
      this.createErrorLog('Invalid Type');
    } else {
      this.commonService
        .getErrorLog(searchString, filterEnvironment, filterTypes)
        .subscribe(
          data => {
            this.automation = [];
            this.automation.push(data);
            if (this.automation[0].entries !== undefined) {
              this.dataLengthAutomation = this.automation[0].entries.length;
            } else {
              this.dataLengthAutomation = 0;
            }
            this.setTableAutomation();
          },
          error => {
            this.createErrorLog(error.message);
          }
        );
    }
  }

  /**
   * Set Table Automation
   */
  setTableAutomation() {
    this.ELEMENT_DATA_AUTOMATION = [];
    if (this.automation[0].entries !== undefined) {
      for (const item of this.automation[0].entries) {
        const newDate = new Date(item.timestamp);
        const latestDate = this.datepipe.transform(newDate, 'MM-dd-yyyy');
        const latestTime = this.datepipe.transform(newDate, 'hh:mm a');
        this.ELEMENT_DATA_AUTOMATION.push({
          date: latestDate,
          time: latestTime,
          errorMsg: item.jsonPayload.error_message || item.jsonPayload.message
        });
      }
    }
    this.automationDataSource = new MatTableDataSource<IAutomationElement>(
      this.ELEMENT_DATA_AUTOMATION
    );
    this.isLoading = false;
  }

  /**
   * Set Table Automation
   * @param searchValue searchValue
   */
  onSearchInventory(searchValue: string) {
    this.getInventory(searchValue, this.inventoryFilterType, 'inventory');
    this.inventorySearch = searchValue;
    this.dataSkipInventory = 0;
    this.dataLimitInventory = 100;
  }

  /**
   * Get Inventory Filter
   * @param event event
   */
  getInventoryFilter(event) {
    this.getInventory(this.inventorySearch, event, 'inventory');
    this.inventoryFilterType = event;
    this.dataSkipInventory = 0;
    this.dataLimitInventory = 100;
  }

  /**
   * Get Inventory
   * @param searchString searchString
   * @param filterEnvironment filterEnvironment
   * @param filterTypes filterTypes
   */
  getInventory(searchString, filterEnvironment, filterTypes) {
    this.isLoading = true;
    if (filterEnvironment == null || filterEnvironment === undefined) {
      this.createErrorLog('Invalid Environment');
    } else if (filterTypes == null || filterTypes === undefined) {
      this.createErrorLog('Invalid Type');
    } else {
      this.commonService
        .getErrorLog(searchString, filterEnvironment, filterTypes)
        .subscribe(
          data => {
            this.inventory = [];
            this.inventory.push(data);
            if (this.inventory[0].entries !== undefined) {
              this.dataLengthInventory = this.inventory[0].entries.length;
            } else {
              this.dataLengthInventory = 0;
            }
            this.setTableInventory();
          },
          error => {
            this.createErrorLog(error.message);
            this.isLoading = false;
          }
        );
    }
  }

  /**
   * Set Table Inventory
   */
  setTableInventory() {
    this.ELEMENT_DATA_INVENTORY = [];
    if (this.inventory[0].entries !== undefined) {
      for (const item of this.inventory[0].entries) {
        const newDate = new Date(item.timestamp);
        const latestDate = this.datepipe.transform(newDate, 'MM-dd-yyyy');
        const latestTime = this.datepipe.transform(newDate, 'hh:mm a');
        this.ELEMENT_DATA_INVENTORY.push({
          date: latestDate,
          time: latestTime,
          errorMsg: item.jsonPayload.error_message || item.jsonPayload.message
        });
      }
    }
    this.inventoryDataSource = new MatTableDataSource<IInventoryElement>(
      this.ELEMENT_DATA_INVENTORY
    );
    this.isLoading = false;
  }
  /**
   * Insert error log to db
   * @param error Error
   */
  createErrorLog(error) {
    this.commonService.createErrorLog(error).subscribe();
  }
}
