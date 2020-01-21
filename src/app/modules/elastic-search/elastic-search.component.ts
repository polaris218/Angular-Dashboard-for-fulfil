import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatTableDataSource,
  MatSnackBar
} from '@angular/material';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService, IElasticPeriodicElement } from './../../core';

@Component({
  selector: 'app-elastic-search',
  templateUrl: './elastic-search.component.html',
  styleUrls: ['./elastic-search.component.css']
})
export class ElasticSearchComponent implements OnInit {
  ELEMENT_DATA: IElasticPeriodicElement[] = [];
  displayedColumns: string[] = [
    'position',
    'productImage',
    'name',
    'price',
    'action'
  ];
  dataSource: any;
  public products = [];
  isLoading = true;
  searchString = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    public router: Router,
    public datepipe: DatePipe
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    this.getProductsService();
    this.isLoading = true;
  }

  /**
   * search
   * @param searchValue searchValue
   */
  search(searchValue) {
    this.searchString = searchValue;
    this.getProductsService();
  }

  /**
   * Get products
   */
  getProductsService() {
    this.commonService.getProductsService(this.searchString).subscribe(
      data => {
        this.products = [];
        this.products.push(data);
        this.setTable();
      },
      error => {
        this.createErrorLog(error.message);
        this.isLoading = false;
      }
    );
  }

  /**
   * Set Table
   */
  setTable() {
    this.ELEMENT_DATA = [];
    for (let i = 0; i < this.products[0].length; i++) {
      this.ELEMENT_DATA.push({
        position: i + 1,
        productImage: this.products[0][i].thumb,
        name: this.products[0][i].name,
        price: this.products[0][i].price,
        action: this.products[0][i].id
      });
    }
    this.dataSource = new MatTableDataSource<IElasticPeriodicElement>(
      this.ELEMENT_DATA
    );
    this.dataSource.paginator = this.paginator;
    this.isLoading = false;
  }

  /**
   * on Edit
   * @param productId productId
   */
  onEdit(productId) {
    this.router.navigate(['/create-item', { productId, onEdit: true }]);
  }

  /**
   * on Delete
   * @param productId productId
   */
  onDelete(productId) {
    if (!productId) {
      this.createErrorLog('productId required');
    } else {
      this.commonService.deleteProduct(productId).subscribe(
        res => {
          const data = [];
          data.push(res);
          if (data[0].id) {
            this.openSnackBar('Product Deleted Succesfully', 'Close');
          }
        },
        error => {
          this.createErrorLog(error._body);
        }
      );
    }
  }

  /**
   * Insert error log to db
   * @param error Error
   */
  createErrorLog(error) {
    this.commonService.createErrorLog(error).subscribe();
  }

  /**
   * Open snackbar
   * @param message message
   * @param action Action
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }
}
