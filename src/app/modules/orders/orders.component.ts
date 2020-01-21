import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatTableDataSource,
  MatSnackBar
} from '@angular/material';
import { DatePipe } from '@angular/common';
import { CommonService, IOrderPeriodicElement } from '../../core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  ELEMENT_DATA: IOrderPeriodicElement[] = [];
  displayedColumns: string[] = [
    'position',
    'name',
    'orderNo',
    'orderPrice',
    'orderDate',
    'reOrderCol'
  ];
  @ViewChild('paginator', { read: MatPaginator })
  paginator: MatPaginator;
  dataSource: any;
  public orders = [];
  isLoading = true;
  pageSize = 100;
  dataLength = 0;
  fromData = 0;
  limitData = 100;
  pageIndex = 1;

  constructor(
    private commonService: CommonService,
    public datepipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    this.getOrdersCount();
    this.getOrdersService();
  }
 /**
  * get All Orders
  */
  getOrdersCount() {
    this.commonService.getOrders(0, 1000000).subscribe(
      result => {
        const results = [];
        results.push(result);
        this.dataLength = results[0].length;
    });
  }

  /**
   * Get Paginator  Data
   * @param event event
   */
  getPaginatorData(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex + 1;
    this.fromData = event.pageIndex * this.pageSize;
    this.limitData = event.pageSize;
    this.getOrdersService();
  }

  /**
   * Get Orders Service
   */
  getOrdersService() {
    this.orders = [];
    this.isLoading = true;
    this.commonService.getOrders(this.fromData, this.limitData).subscribe(
          data => {
            this.orders.push(data);
            this.setTable();
          },
          error => {
            this.createErrorLog(error.message);
            this.isLoading = false;
        });
  }

  /**
   * ReOrder
   * @param values values
   */
  reOrder(values) {
    const bothIds = values.split(',');
    const productId = bothIds[0];
    const cartId = bothIds[1];
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
          this.createErrorLog(error.message);
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
   * Set Table
   */
  setTable() {
    this.ELEMENT_DATA = [];
    let i = 0;
    const itemCount = this.fromData;
    for (const item of this.orders[0]) {
      i++;
      this.ELEMENT_DATA.push({
        position: itemCount + i,
        name: item.name,
        orderNo: item.order_id,
        orderPrice: item.price,
        orderDate: item.order_date,
        reOrderCol: `${item.product_id},${item.cart_id}`
      });
    }

    this.dataSource = new MatTableDataSource<IOrderPeriodicElement>(
      this.ELEMENT_DATA
    );
    this.isLoading = false;
  }

  /**
   * ApplyFilter
   * @param filterValue filterValue
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Insert error log to db
   * @param error Error
   */
  createErrorLog(error) {
    this.commonService.createErrorLog(error).subscribe();
  }
}
