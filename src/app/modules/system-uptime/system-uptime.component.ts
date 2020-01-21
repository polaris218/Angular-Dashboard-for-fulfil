import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-system-uptime',
  templateUrl: './system-uptime.component.html',
  styleUrls: ['./system-uptime.component.css']
})
export class SystemUptimeComponent implements OnInit {
  public responseBarChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          drawBorder: false
      }
      }],
      yAxes: [{
        display: false,
        gridLines: {
          display: false,
          drawBorder: false
      }
      }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public responseBarChartLegend = false;

  public responseBarChartColors: Color[] = [
    { backgroundColor: 'rgba(43,182,115,0.5)' }
  ];

  public responseBarChartLabels: Label[] = ['125ms', '250ms', '500ms', '1s', '2s', '4s', '8s', '8s+/err'];
  public responseBarChartData: ChartDataSets[] = [
    { data: [356, 710, 337, 10, 10, 0, 0, 0], label: 'Series A' }
  ];

  public days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  constructor() { }

  ngOnInit() {
  }

}
