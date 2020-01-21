import { AttrComponent } from './dialog/attr/attr.component';
import { RunsetComponent } from './dialog/runset/runset.component';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { MatDialog } from '@angular/material';
import { CommonService } from './../../core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {
  lineChartOptions: ChartOptions & { annotation: any };
  lineChartColors: Color[];
  lineChartLegend: any;
  lineChartType: any;
  attributes: any = [];
  finalAttributes: any[] = [];
  runsetList: any[] = [];
  conn = 0;
  finalSubAttr = [];
  getSelectedRunset: any;
  ordersPerHourTool: any[] = [];
  averageOrderTimeTool: any[] = [];
  numberOrdersTool: any[] = [];
  lineChartData1: ChartDataSets[];
  lineChartLabels1: Label[];
  lineChartData2: ChartDataSets[];
  lineChartLabels2: Label[];
  traysRefilledTool: any[] = [];
  lineChart1Datasets: any[] = [];
  lineChart2Datasets: any[] = [];
  lineChartOptions1: ChartOptions & { annotation: any };
  runsetDataArray: any[] = [];
  isLoading = false;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private commonService: CommonService
  ) {}

  /**
   *  call function on component load
   */
  ngOnInit() {
    this.setLineChart1();
    this.setLineChart2();
  }

  /**
   * Insert error log to db
   * @param error Error
   */
  createErrorLog(error) {
    this.commonService.createErrorLog(error).subscribe();
  }
  /**
   * open Runset Dialog
   */
  openRunsetDialog(): void {
    const dialogRef = this.dialog.open(RunsetComponent, {
      width: '800px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isLoading = true;
      if (this.route.snapshot.params.runset === undefined) {
        this.isLoading = false;
      } else {
        this.getSelectedRunset = this.route.snapshot.params.runset.split(',');
        this.commonService.getGraphData('').subscribe(
          data => {
            this.runsetDataArray = [];
            this.lineChart1Datasets = [];
            this.lineChart2Datasets = [];
            this.ordersPerHourTool = [];
            this.averageOrderTimeTool = [];
            this.numberOrdersTool = [];
            this.traysRefilledTool = [];
            this.runsetList = [];
            this.attributes = [];
            this.finalSubAttr = [];
            this.finalAttributes = [];
            this.runsetDataArray.push(data);
            let com = 0;

            for (const item of this.getSelectedRunset) {
              this.runsetList.push({ value: item });
              com = 0;
              for (const itemData of this.runsetDataArray[0]) {
                // New Simtool
                if (itemData.id === item) {
                  this.ordersPerHourTool = itemData.Parameters.OrdersPerHour;
                  for (const itemAhs of itemData.AvgHourlyStats) {
                    this.averageOrderTimeTool.push(itemAhs.AverageOrderTime);
                  }
                  for (const itemAhs of itemData.AvgHourlyStats) {
                    this.numberOrdersTool.push(itemAhs.NumberOrders);
                  }
                  for (const itemAhs of itemData.AvgHourlyStats) {
                    this.traysRefilledTool.push(itemAhs.TraysRefilled);
                  }

                  this.lineChart1Datasets.push(
                    {
                      data: this.ordersPerHourTool,
                      label: `OrdersPerHour-${item}`,
                      pointRadius: 5
                    },
                    {
                      data: this.averageOrderTimeTool,
                      label: `AverageOrderTime-${item}`,
                      pointRadius: 5
                    }
                  );

                  this.lineChart2Datasets.push(
                    {
                      data: this.numberOrdersTool,
                      label: `NumberOrders-${item}`,
                      pointRadius: 5
                    },
                    {
                      data: this.traysRefilledTool,
                      label: `TrayRefills-${item}`,
                      pointRadius: 5
                    }
                  );

                  if (com === 0) {
                    this.attributes.push(itemData.Parameters);
                    com = 1;
                  }
                }
              }
            }
            for (const key in this.attributes) {
              if (key) {
                for (const innerKey in this.attributes[key]) {
                  if (innerKey) {
                    this.finalAttributes.push({
                      key: innerKey,
                      value: this.attributes[key][innerKey]
                    });
                  }
                }
              }
            }
            this.conn = 1;
            this.setLineChart1();
            this.setLineChart2();
            const output = [];

            this.finalAttributes.forEach(item => {
              const existing = output.filter((v, i) => {
                return v.key === item.key;
              });
              if (existing.length) {
                const existingIndex = output.indexOf(existing[0]);
                output[existingIndex].value = output[
                  existingIndex
                ].value.concat(item.value);
              } else {
                if (typeof item.value === 'number') {
                  item.value = [item.value];
                }
                output.push(item);
              }
            });
            this.isLoading = false;
            this.finalSubAttr = output;
          },
          error => {
            this.createErrorLog(error.message);
          }
        );
      }
    });
  }

  /**
   *  Line Chart 1
   */
  setLineChart1() {
    this.isLoading = true;
    this.lineChartData1 = [];
    this.lineChartData1 = [
      {
        data: [],
        label: ''
      }
    ];
    if (this.conn === 1) {
      this.lineChartData1 = this.lineChart1Datasets;
    }
    this.lineChartLabels1 = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24'
    ];
    this.lineChartOptions1 = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Hour'
            }
          }
        ],
        yAxes: [{}]
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
      },
      {
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        pointBackgroundColor: 'rgba(255,99,132,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255,99,132,0.8)'
      },
      {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderColor: 'rgba(0,0,0,1)',
        pointBackgroundColor: 'rgba(0,0,0,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0,0,0,0.2)'
      },
      {
        backgroundColor: 'rgba(144,102,167,0.2)',
        borderColor: 'rgba(144,102,167,1)',
        pointBackgroundColor: 'rgba(144,102,167,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(144,102,167,0.8)'
      },
      {
        backgroundColor: 'rgba(56,105,177,0.2)',
        borderColor: 'rgba(56,105,177,1)',
        pointBackgroundColor: 'rgba(56,105,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(56,105,177,0.8)'
      },
      {
        backgroundColor: 'rgba(149,99,248,0.2)',
        borderColor: 'rgba(149,99,248,1)',
        pointBackgroundColor: 'rgba(149,99,248,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(149,99,248.2)'
      },
      {
        backgroundColor: 'rgba(204,36,40,0.2)',
        borderColor: 'rgba(204,36,40,1)',
        pointBackgroundColor: 'rgba(204,36,40,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(204,36,40,0.8)'
      },
      {
        backgroundColor: 'rgba(255,219,105,0.2)',
        borderColor: 'rgba(255,219,105,1)',
        pointBackgroundColor: 'rgba(255,219,105,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255,219,105,0.8)'
      },
      {
        backgroundColor: 'rgba(0,255,0,0.2)',
        borderColor: 'rgba(0,255,0,1)',
        pointBackgroundColor: 'rgba(0,255,0,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0,255,0,0.2)'
      }
    ];
    this.lineChartLegend = true;
    this.lineChartType = 'line';
    this.isLoading = false;
  }

  /**
   * Line Chart2
   */
  setLineChart2() {
    this.isLoading = true;
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
    this.lineChartLabels2 = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24'
    ];
    this.isLoading = false;
  }

  /**
   * Chart Clicked
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
   * Chart Hovered
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
   * show Array
   * @param value value
   * @param no no
   */
  showArray(value, no) {
    if (no === 1) {
      window.localStorage.setItem(
        'selectedArrt',
        JSON.stringify(this.attributes[value].CarouselTypeUsage)
      );
      window.localStorage.setItem('arrayno', '1');
    } else if (no === 2) {
      window.localStorage.setItem(
        'GroupParameters',
        JSON.stringify(this.attributes[value].GroupParameters)
      );
      window.localStorage.setItem('arrayno', '2');
    } else if (no === 3) {
      window.localStorage.setItem(
        'OrdersPerHour',
        JSON.stringify(this.attributes[value].OrdersPerHour)
      );
      window.localStorage.setItem('arrayno', '3');
    } else if (no === 4) {
      window.localStorage.setItem(
        'RefillsPerHour',
        JSON.stringify(this.attributes[value].RefillsPerHour)
      );
      window.localStorage.setItem('arrayno', '4');
    } else if (no === 5) {
      window.localStorage.setItem(
        'StorageTypeUsage',
        JSON.stringify(this.attributes[value].StorageTypeUsage)
      );
      window.localStorage.setItem('arrayno', '5');
    } else if (no === 6) {
      window.localStorage.setItem(
        'ItemCountProb',
        JSON.stringify(this.attributes[value].ItemCountProb)
      );
      window.localStorage.setItem('arrayno', '6');
    }
    const dialogRefAttr = this.dialog.open(AttrComponent, {
      width: '800px'
    });
  }
}
