import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import {
  MultiDataSet,
  Label,
  Color,
  PluginServiceGlobalRegistrationAndOptions
} from 'ng2-charts';
import { DatePipe } from '@angular/common';
import {
  MatSnackBar,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { CommonService, IHomePeriodicElement } from '../../core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public orders = [];
  public pagedList = [];
  public pageEvent: any;
  length = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 50, 100];
  ELEMENT_DATA: IHomePeriodicElement[] = [];
  displayedColumns: string[] = ['startTime', 'endTime', 'distance', 'speed'];
  dataSource: any;
  @ViewChild('paginatorCoreCommands', { read: MatPaginator })
  paginatorCoreCommands: MatPaginator;
  totalOrders: any;
  totalFilterdOrders = 0;
  lineChartJanOrders = 0;
  lineChartFebOrders = 0;
  lineChartMarOrders = 0;
  lineChartAprOrders = 0;
  lineChartMayOrders = 0;
  lineChartJunOrders = 0;
  lineChartJulOrders = 0;
  lineChartAugOrders = 0;
  lineChartSepOrders = 0;
  lineChartOctOrders = 0;
  lineChartNovOrders = 0;
  lineChartDecOrders = 0;
  currentYearStr: any;
  currentYear: any;
  lastYear: any;
  filterYear: any;
  lineChartData: ChartDataSets[];
  lineChartLabels: Label[];
  lineChartOptions: ChartOptions & { annotation: any };
  lineChartColors: Color[];
  lineChartLegend: any;
  lineChartType: any;
  lineChartType2: any;
  doughnutChartJanOrders = 0;
  doughnutChartFebOrders = 0;
  doughnutChartMarOrders = 0;
  doughnutChartAprOrders = 0;
  doughnutChartMayOrders = 0;
  doughnutChartJunOrders = 0;
  doughnutChartJulOrders = 0;
  doughnutChartAugOrders = 0;
  doughnutChartSepOrders = 0;
  doughnutChartOctOrders = 0;
  doughnutChartNovOrders = 0;
  doughnutChartDecOrders = 0;
  doughnutChartLabels: Label[];
  doughnutChartData: MultiDataSet;
  doughnutChartType: ChartType;
  doughnutColors: any[];
  doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[];
  minItemsPerOrder = new FormControl();
  maxItemsPerOrder = new FormControl();
  orderNumber = new FormControl();
  carrier = new FormControl();
  categoryId = new FormControl();
  public categories = [];
  public coreCommands = [];
  lineChartData2: ChartDataSets[];
  lineChart2Datasets: any[] = [];
  averageStartTime: any[] = [];
  averageEndTime: any[] = [];
  averageDistance: any[] = [];
  lineChartLabels2: Date[] = [];
  conn = 0;
  lineChartLegend2: any;
  lineChartOptions2: ChartOptions & { annotation: any };

  constructor(
    private commonService: CommonService,
    public datepipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  /**
   * call function on component load
   */
  ngOnInit() {
    this.getOrdersService();
    const currentDate = new Date();
    this.currentYear = this.datepipe.transform(currentDate, 'yyyy');
    this.lastYear = this.currentYear - 1;
    this.setLineChart();
    this.setDoughnutChart();
    this.getCategories();
    this.getCoreCommands();
    this.setLineChart2();
  }
  /**
   * Get Core Commands
   */
  getCoreCommands() {
    this.commonService.getCoreCommands().subscribe(
      data => {
        this.coreCommands.push(data);
        this.setTable();
        this.setChartData();
        this.lineChart2Datasets = [];
      },
      error => {
        this.createErrorLog(error.message);
      }
    );
  }
  /**
   * Set Chart Data
   */
  setChartData() {
    let convertedStartTime: any;
    let convertedEndTime: any;
    let newStartTime: any;
    let newEndTime: any;
    for (const item of this.coreCommands[0]) {
      newStartTime = new Date(item.StartTime);
      convertedStartTime = this.datepipe.transform(newStartTime, 'hh:mm:ss');
      newEndTime = new Date(item.FinishTime);
      convertedEndTime = this.datepipe.transform(newEndTime, 'hh:mm:ss');
      this.averageStartTime.push(newStartTime);
      this.averageEndTime.push(newEndTime);
      this.averageDistance.push(item.Distance);
    }

    const averageStartTimeData = [];
    const averageEndTimeData = [];
    for (let c = 0; c < this.averageStartTime.length; c++) {
      averageStartTimeData.push({
        x: new Date(this.averageStartTime[c]),
        y: this.averageDistance[c]
      });
    }
    for (let c = 0; c < this.averageEndTime.length; c++) {
      averageEndTimeData.push({
        x: new Date(this.averageEndTime[c]),
        y: this.averageDistance[c]
      });
    }

    this.lineChart2Datasets.push(
      {
        data: averageStartTimeData,
        label: 'Start Time vs Distance',
        pointRadius: 5
      },
      {
        data: averageEndTimeData,
        label: 'Finish Time vs Distance',
        pointRadius: 5
      }
    );
    this.conn = 1;
    this.setLineChart2();
  }
  /**
   * Set Table
   */
  setTable() {
    this.ELEMENT_DATA = [];
    let convertedStartTime: any;
    let convertedEndTime: any;
    let newStartTime: any;
    let newEndTime: any;
    for (const item of this.coreCommands[0]) {
      newStartTime = new Date(item.StartTime);
      convertedStartTime = this.datepipe.transform(newStartTime, 'hh:mm:ss');
      newEndTime = new Date(item.FinishTime);
      convertedEndTime = this.datepipe.transform(newEndTime, 'hh:mm:ss');
      this.ELEMENT_DATA.push({
        startTime: convertedStartTime,
        endTime: convertedEndTime,
        distance: item.Distance,
        speed: item.Speed
      });
    }
    this.dataSource = new MatTableDataSource<IHomePeriodicElement>(
      this.ELEMENT_DATA
    );
    this.dataSource.paginator = this.paginatorCoreCommands;
  }

  /**
   * Set Line Chart2
   */
  setLineChart2() {
    this.lineChartData2 = [];
    this.lineChartData2 = [
      {
        data: [],
        label: ''
      }
    ];
    if (this.conn === 1) {
      this.lineChartData2 = this.lineChart2Datasets;
    }
    this.lineChartOptions2 = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            type: 'time',
            position: 'bottom',
            time: {
              displayFormats: {
                second: 'HH:mm:ss'
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Distance'
            }
          }
        ]
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              enabled: true,
              fontColor: 'orange',
              content: 'LineAnno'
            }
          }
        ]
      }
    };
    this.lineChartLegend2 = true;
    this.lineChartType2 = 'line';
  }

  /**
   * Get Categories
   */
  getCategories() {
    this.commonService.getCategories().subscribe(
      data => {
        this.categories.push(data);
      },
      error => {
        this.createErrorLog(error.message);
      }
    );
  }
  /**
   * Get Orders
   */
  getOrdersService() {
    this.commonService.getOrders(0, 100000).subscribe(
      data => {
        if (data !== 'This feature is not available') {
          this.orders.push(data);
          this.totalOrders = this.orders[0].length;
          this.pagedList = this.orders[0].slice(0, 5);
          this.length = this.orders[0].length;
          this.getLineChartData(this.currentYear);
          this.getDoughnutChartData(this.currentYear);
        }
      },
      error => {
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * on Page Change
   * @param event event
   */
  OnPageChange(event) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.length) {
      endIndex = this.length;
    }
    this.pagedList = this.orders[0].slice(startIndex, endIndex);
  }

  /**
   * Re Order
   * @param productId productId
   * @param cartId cartId
   */
  reOrder(productId, cartId) {
    if (!productId) {
      this.createErrorLog('productId required');
    } else if (!cartId) {
      this.createErrorLog('cartId required');
    } else {
      this.commonService.reOrder(productId, cartId).subscribe(
        data => {
          this.openSnackBar('Reorder Placed Successfully!!!', 'Close');
        },
        error => {
          this.openSnackBar('Reorder Placed Failed!!!', 'Close');
          this.createErrorLog(error._body);
        }
      );
    }
  }

  /**
   * Open the snackbar
   * @param message message
   * @param action action
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }

  /**
   * Get Line Chart Data
   * @param event event
   */
  getLineChartData(event) {
    this.filterYear = event;
    this.countLineChartSummary(this.filterYear);
  }

  /**
   * Doughnut Chart Data
   * @param event event
   */
  getDoughnutChartData(event) {
    this.filterYear = event;
    this.countDoughnutChartSummary(this.filterYear);
  }

  /**
   * Line Chart Summary
   * @param lineChartFilteredYear lineChartFilteredYear
   */
  countLineChartSummary(lineChartFilteredYear) {
    this.lineChartJanOrders = 0;
    this.lineChartFebOrders = 0;
    this.lineChartMarOrders = 0;
    this.lineChartAprOrders = 0;
    this.lineChartMayOrders = 0;
    this.lineChartJunOrders = 0;
    this.lineChartJulOrders = 0;
    this.lineChartAugOrders = 0;
    this.lineChartSepOrders = 0;
    this.lineChartOctOrders = 0;
    this.lineChartNovOrders = 0;
    this.lineChartDecOrders = 0;
    for (const item of this.orders[0]) {
      const newDate = new Date(item.order_date);
      const orderMonth = this.datepipe.transform(newDate, 'MM');
      const orderYear = this.datepipe.transform(newDate, 'yyyy');

      if (orderMonth === '01' && orderYear === lineChartFilteredYear) {
        this.lineChartJanOrders += 1;
      }
      if (orderMonth === '02' && orderYear === lineChartFilteredYear) {
        this.lineChartFebOrders += 1;
      }
      if (orderMonth === '03' && orderYear === lineChartFilteredYear) {
        this.lineChartMarOrders += 1;
      }
      if (orderMonth === '04' && orderYear === lineChartFilteredYear) {
        this.lineChartAprOrders += 1;
      }
      if (orderMonth === '05' && orderYear === lineChartFilteredYear) {
        this.lineChartMayOrders += 1;
      }
      if (orderMonth === '06' && orderYear === lineChartFilteredYear) {
        this.lineChartJunOrders += 1;
      }
      if (orderMonth === '07' && orderYear === lineChartFilteredYear) {
        this.lineChartJulOrders += 1;
      }
      if (orderMonth === '08' && orderYear === lineChartFilteredYear) {
        this.lineChartAugOrders += 1;
      }
      if (orderMonth === '09' && orderYear === lineChartFilteredYear) {
        this.lineChartSepOrders += 1;
      }
      if (orderMonth === '10' && orderYear === lineChartFilteredYear) {
        this.lineChartOctOrders += 1;
      }
      if (orderMonth === '11' && orderYear === lineChartFilteredYear) {
        this.lineChartNovOrders += 1;
      }
      if (orderMonth === '12' && orderYear === lineChartFilteredYear) {
        this.lineChartDecOrders += 1;
      }
    }
    this.setLineChart();
  }

  /**
   * Doughnut Chart Summary
   * @param doughnutChartFilteredYear doughnutChartFilteredYear
   */
  countDoughnutChartSummary(doughnutChartFilteredYear) {
    this.totalFilterdOrders = 0;
    this.doughnutChartJanOrders = 0;
    this.doughnutChartFebOrders = 0;
    this.doughnutChartMarOrders = 0;
    this.doughnutChartAprOrders = 0;
    this.doughnutChartMayOrders = 0;
    this.doughnutChartJunOrders = 0;
    this.doughnutChartJulOrders = 0;
    this.doughnutChartAugOrders = 0;
    this.doughnutChartSepOrders = 0;
    this.doughnutChartOctOrders = 0;
    this.doughnutChartNovOrders = 0;
    this.doughnutChartDecOrders = 0;
    for (const item of this.orders[0]) {
      const newDate = new Date(item.order_date);
      const orderMonth = this.datepipe.transform(newDate, 'MM');
      const orderYear = this.datepipe.transform(newDate, 'yyyy');

      if (orderMonth === '01' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartJanOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '02' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartFebOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '03' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartMarOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '04' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartAprOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '05' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartMayOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '06' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartJunOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '07' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartJulOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '08' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartAugOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '09' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartSepOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '10' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartOctOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '11' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartNovOrders += 1;
        this.totalFilterdOrders += 1;
      }
      if (orderMonth === '12' && orderYear === doughnutChartFilteredYear) {
        this.doughnutChartDecOrders += 1;
        this.totalFilterdOrders += 1;
      }
    }
    this.setDoughnutChart();
  }

  /**
   * Set Doughnut Chart
   */
  setDoughnutChart() {
    this.doughnutChartLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    this.doughnutChartData = [
      [
        this.doughnutChartJanOrders,
        this.doughnutChartFebOrders,
        this.doughnutChartMarOrders,
        this.doughnutChartAprOrders,
        this.doughnutChartMayOrders,
        this.doughnutChartJunOrders,
        this.doughnutChartJulOrders,
        this.doughnutChartAugOrders,
        this.doughnutChartSepOrders,
        this.doughnutChartOctOrders,
        this.doughnutChartNovOrders,
        this.doughnutChartDecOrders
      ]
    ];
    this.doughnutChartType = 'doughnut';
    this.doughnutColors = [
      {
        backgroundColor: [
          '#11482e',
          '#155b39',
          '#196d45',
          '#1e7f50',
          '#22915c',
          '#26a367',
          '#2bb673',
          '#40bd81',
          '#55c48f',
          '#6acb9d',
          '#7fd3ab',
          '#95dab9',
          '#aae1c7'
        ]
      }
    ];
  }
  /**
   * Set Line Chart
   */
  setLineChart() {
    this.lineChartData = [
      {
        data: [
          this.lineChartJanOrders,
          this.lineChartFebOrders,
          this.lineChartMarOrders,
          this.lineChartAprOrders,
          this.lineChartMayOrders,
          this.lineChartJunOrders,
          this.lineChartJulOrders,
          this.lineChartAugOrders,
          this.lineChartSepOrders,
          this.lineChartOctOrders,
          this.lineChartNovOrders,
          this.lineChartDecOrders
        ],
        label: 'Orders'
      }
    ];
    this.lineChartLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{}]
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              enabled: true,
              fontColor: 'orange',
              content: 'LineAnno'
            }
          }
        ]
      }
    };
    this.lineChartColors = [
      {
        backgroundColor: 'rgba(43,182,115,0.2)',
        borderColor: 'rgba(43,182,115,1)',
        pointBackgroundColor: 'rgba(43,182,115,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(43,182,115,0.8)'
      }
    ];
    this.lineChartLegend = true;
    this.lineChartType = 'line';
  }

  /**
   * On chart Clicked
   * @param event event
   * @param active active
   */
  public chartClicked({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {}

  /**
   * On chart Hovered
   * @param event event
   * @param active active
   */
  public chartHovered({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {}

  /**
   * Generate Fake Order
   */
  generateFakeOrder() {
    if (
      this.minItemsPerOrder.value == null ||
      this.minItemsPerOrder.value === '' ||
      (this.maxItemsPerOrder.value == null ||
        this.maxItemsPerOrder.value === '') ||
      (this.orderNumber.value == null || this.orderNumber.value === '') ||
      (this.carrier.value == null || this.carrier.value === '') ||
      (this.categoryId.value == null || this.categoryId.value === '')
    ) {
      this.openSnackBar(
        'Please Fill Above All Field To Generate Fake Order',
        'Close'
      );
      this.createErrorLog('Please Fill All Field To Generate Fake Order');
    } else {
      this.commonService
        .genFakeOrder(
          this.minItemsPerOrder.value,
          this.maxItemsPerOrder.value,
          this.orderNumber.value,
          this.carrier.value,
          this.categoryId.value
        )
        .subscribe(
          data => {
            this.openSnackBar('Generate Fake Order Successfully!!!', 'Close');
            this.minItemsPerOrder.setValue('');
            this.maxItemsPerOrder.setValue('');
            this.orderNumber.setValue('');
            this.carrier.setValue('');
            this.categoryId.setValue('');
          },
          error => {
            this.openSnackBar('Generate Fake Order Failed!!!', 'Close');
            this.createErrorLog(error.message);
          }
        );
    }
  }

  /**
   * Place Order
   * @param items items
   */
  resetInventory() {
    this.commonService.resetInventory().subscribe(
      data => {
        this.openSnackBar('Inventory Reset Successfully!!!', 'Close');
      },
      error => {
        this.openSnackBar('Inventory Reset Failed!!!', 'Close');
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * Insert error log to db
   * @param error Error
   */
  createErrorLog(error) {
    this.commonService.createErrorLog(error).subscribe();
  }
}
