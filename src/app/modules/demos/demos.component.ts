import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  MatPaginator,
  MatTableDataSource,
  MatSnackBar,
  MatAutocompleteSelectedEvent
} from '@angular/material';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonService, IDemoPeriodicElement, IProduct } from '../../core';

@Component({
  selector: 'app-demos',
  templateUrl: './demos.component.html',
  styleUrls: ['./demos.component.css']
})
export class DemosComponent implements OnInit {
  ELEMENT_DATA: IDemoPeriodicElement[] = [];
  displayedColumns: string[] = ['position', 'title', 'items', 'action'];
  dataSource: any;
  public products = [];
  isLoading = true;
  tableView = 1;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [];
  itemCtrl = new FormControl();
  itemTitleCtrl = new FormControl();
  filteredProducts: Observable<string[]>;
  itemProducts: IProduct[] = [];
  allItems: string[] = [];
  curatedOrders: any[] = [];
  curatedOrdersLength: any[] = [];
  orderItemsList: any;
  generatedCartId: number;
  pageIndex = 1;
  pageSize = 100;
  lowValue = 0;
  highValue = 100;
  dataSkip = 0;
  dataLimit = 100;
  searchString = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('productInput') productInput: ElementRef;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    public router: Router,
    public datepipe: DatePipe
  ) {
    this.filteredProducts = this.itemCtrl.valueChanges.pipe(
      startWith(null),
      map((itemProduct: string | null) =>
        itemProduct ? this._filter(itemProduct) : this.allItems.slice()
      )
    );
  }

  /**
   *  call function on component load
   */
  ngOnInit() {
    this.getProductsService();
    this.getCuratedOrderService(this.dataLimit, this.dataSkip);
    this.getCuratedOrderLengthService();
  }

  /**
   * Get Paginator Data
   * @param event event
   */
  getPaginatorData(event) {
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
    this.dataSkip = event.pageSize * event.pageIndex;
    this.dataLimit = event.pageSize;
    this.getCuratedOrderService(this.dataLimit, this.dataSkip);
  }

  /**
   * add
   * @param event event
   */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.itemProducts.push({ productName: value.trim() });
    }

    if (input) {
      input.value = '';
    }
  }

  /**
   * remove
   * @param itemProduct Product
   */
  remove(itemProduct: IProduct): void {
    const index = this.itemProducts.indexOf(itemProduct);
    if (index >= 0) {
      this.itemProducts.splice(index, 1);
    }
  }

  /**
   * selected
   * @param event Material Auto complete Selected Event
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.itemProducts.push({ productName: event.option.viewValue });
    this.productInput.nativeElement.value = '';
    this.itemCtrl.setValue(null);
  }

  /**
   * _filter
   * @param value string
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allItems.filter(
      itemProduct => itemProduct.toLowerCase().indexOf(filterValue) === 0
    );
  }

  /**
   * Get Products
   */
  getProductsService() {
    this.isLoading = true;
    this.commonService.getProductsService(this.searchString).subscribe(
      data => {
        this.products = [];
        this.products.push(data);
        this.setAutocomplete();
      },
      error => {
        this.createErrorLog(error.message);
        this.isLoading = false;
      }
    );
  }

  /**
   * Get Curated Order Service
   * @param dataLimit dataLimit
   * @param dataSkip dataLimit
   */
  getCuratedOrderService(dataLimit, dataSkip) {
    this.isLoading = true;
    this.commonService.getCuratedOrderService(dataLimit, dataSkip).subscribe(
      data => {
        this.curatedOrders = [];
        this.curatedOrders.push(data);
        this.setTable();
      },
      error => {
        this.createErrorLog(error.message);
        this.isLoading = false;
      }
    );
  }

  /**
   * Get Curated Order Length Service
   */
  getCuratedOrderLengthService() {
    this.isLoading = true;
    this.commonService.getCuratedOrderLengthService().subscribe(
      data => {
        this.curatedOrdersLength = [];
        this.curatedOrdersLength.push(data);
      },
      error => {
        this.createErrorLog(error.message);
        this.isLoading = false;
      }
    );
  }

  /**
   * Set Auto Complete
   */
  setAutocomplete() {
    for (const item of this.products[0]) {
      this.allItems.push(item.name);
    }
  }

  /**
   * Set Table
   */
  setTable() {
    this.ELEMENT_DATA = [];
    for (let i = 0; i < this.curatedOrders[0].length; i++) {
      this.ELEMENT_DATA.push({
        position: i + 1,
        title: this.curatedOrders[0][i].order_title,
        items: this.curatedOrders[0][i].order_items,
        action: this.curatedOrders[0][i].id
      });
    }
    this.dataSource = new MatTableDataSource<IDemoPeriodicElement>(
      this.ELEMENT_DATA
    );
    this.isLoading = false;
  }

  /**
   * Apply Filter
   * @param filterValue filterValue
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Delete Curated Order
   * @param id id
   */
  onDelete(id) {
    this.commonService.deleteCuratedOrder(id).subscribe(
      data => {
        this.getCuratedOrderService(this.dataLimit, this.dataSkip);
        this.getCuratedOrderLengthService();
        this.openSnackBar('Delete Curated Order Successfully!!!!', 'Close');
      },
      error => {
        this.openSnackBar('Delete Curated Order Failed!!!!', 'Close');
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * Create Curated
   */
  createCurated() {
    this.tableView = 0;
  }

  /**
   * Submit Order
   */
  onSubmitOrder() {
    let productString = '';
    for (let i = 0; i < this.itemProducts.length; i++) {
      if (i === 0) {
        productString += this.itemProducts[i].productName;
      } else {
        productString += `, ${this.itemProducts[i].productName}`;
      }
    }
    const newlyCreated = [
      { orderTitle: this.itemTitleCtrl.value },
      { orderItems: productString }
    ];
    this.commonService
      .createCuratedOrder(this.itemTitleCtrl.value, productString)
      .subscribe(
        data => {
          this.getCuratedOrderService(this.dataLimit, this.dataSkip);
          this.getCuratedOrderLengthService();
          this.openSnackBar('Curated Order Create Successfully!!!!', 'Close');
        },
        error => {
          this.openSnackBar('Curated Order Create Failed!!!!', 'Close');
          this.createErrorLog(error.message);
        }
      );
    this.tableView = 1;
    this.itemTitleCtrl.setValue('');
    this.itemProducts = [];
    setTimeout(() => {
      this.setTable();
    }, 100);
  }

  /**
   * Place Order
   * @param items items
   */
  orderPlace(items) {
    this.orderItemsList = items.split(', ');
    this.createCart();
  }

  /**
   * Create Cart
   */
  createCart() {
    this.commonService.createCart().subscribe(
      data => {
        this.generatedCartId = data[0].id;
        this.addItemsToCart();
      },
      error => {
        this.createErrorLog(error.message);
      }
    );
  }

  /**
   * Add Items To Cart
   */
  addItemsToCart() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.orderItemsList.length; i++) {
      for (const item of this.products[0]) {
        if (this.orderItemsList[i] === item.name) {
          this.commonService
            .addItemsToCart(item.id, this.generatedCartId)
            .subscribe(
              data => {},
              error => {
                this.createErrorLog(error._body);
              }
            );
        }
      }
    }
    this.createOrder();
  }

  /**
   * Create Order
   */
  createOrder() {
    if (this.generatedCartId == null || this.generatedCartId === undefined) {
      this.createErrorLog('Invalid cartId');
    } else {
      this.commonService.createOrder(this.generatedCartId).subscribe(
        data => {
          this.openSnackBar('Order Placed Successfully!!!', 'Close');
        },
        error => {
          this.openSnackBar('Order Placed Failed!!!', 'Close');
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
   * @param message Message
   * @param action Action
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000
    });
  }
}
