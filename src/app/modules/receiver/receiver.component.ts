import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { CommonService, IUser } from '../../core';

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css']
})
export class ReceiverComponent implements OnInit {
  isBarcodeDiv = false;
  isMetaFormShow = false;
  ordersLoad = false;
  isLoading = true;
  isScanned = false;
  purchaseOrders: any[] = [];
  ordersList: any[] = [];
  uniqueorders: any[] = [];
  filteredOptions: Observable<IUser[]>;
  options: IUser[] = [];
  orderInput = new FormControl();
  productId = new FormControl();
  descriptor = new FormControl();
  upc = new FormControl();
  department = new FormControl();
  aisle = new FormControl();
  height = new FormControl();
  length = new FormControl();
  lengthSecondary = new FormControl();
  width = new FormControl();
  widthSecondary = new FormControl();
  diameter = new FormControl();
  diameterSecondary = new FormControl();
  diameterNarrow = new FormControl();
  mass = new FormControl();
  volume = new FormControl();
  boundingBoxVolume = new FormControl();
  density = new FormControl();
  cog = new FormControl();
  shape = new FormControl();
  material = new FormControl();
  packageType = new FormControl();
  packagingMods = new FormControl();
  transparency = new FormControl();
  damageable = new FormControl();
  damaging = new FormControl();
  hasStem = new FormControl();
  isSharp = new FormControl();
  storageTemp = new FormControl();
  storageHumidity = new FormControl();
  ethyleneSensitivity = new FormControl();
  co2Sensitivity = new FormControl();
  maxInventory = new FormControl();
  storageConfig = new FormControl();
  shelfLife = new FormControl();
  scannerUpc = new FormControl();
  receivedQty = new FormControl();
  boxId = new FormControl();
  allValues: any;
  fillProductId: any;
  fillUpc: any;
  metaAvail = 0;
  deliveriesId: any;
  fillDescriptor: any;
  fillDepartment: any;
  fillAisle: any;
  fillHeight: any;
  fillLength: any;
  fillLengthSecondary: any;
  fillWidth: any;
  fillWidthSecondary: any;
  fillDiameter: any;
  fillDiameterSecondary: any;
  fillDiameterNarrow: any;
  fillMass: any;
  fillVolume: any;
  fillBoundingBoxVolume: any;
  fillDensity: any;
  fillCog: any;
  fillShape: any;
  fillMaterial: any;
  fillPackageType: any;
  fillPackagingMods: any;
  fillTransparency: any;
  fillDamageable: any;
  fillDamaging: any;
  fillHasStem: any;
  fillIsSharp: any;
  fillStorageTemp: any;
  fillStorageHumidity: any;
  fillEthyleneSensitivity: any;
  fillCo2Sensitivity: any;
  fillMaxInventory: any;
  fillStorageConfig: any;
  fillShelfLife: any;
  editedMetaId = 0;
  @ViewChild('scannerInput') scannerInput: ElementRef;
  @ViewChild('qtyFocus') qtyFocus: ElementRef;
  @ViewChild('descriptorFocus') descriptorFocus: ElementRef;
  @ViewChild('purchaseOrderInput') purchaseOrderInput: ElementRef;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Call the function on component load
   */
  ngOnInit() {
    this.getDeleveries();
    setTimeout(() => {
      this.purchaseOrderInput.nativeElement.focus();
    }, 200);
  }

  /**
   * Return checkbox checked true of false
   * @param val val
   */
  getCheckedValue(val) {
    if (val === 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Check product for barcode
   */
  checkProductForBarcodeForm() {
    const upc = this.scannerUpc.value;
    if (this.metaAvail === 1) {
      if (upc === null || upc === '') {
        this.openSnackBar('Please scan barcode', 'Close');
      } else {
        this.isLoading = true;
        this.commonService.getProductByUpc(upc).subscribe(
          data => {
            this.isLoading = false;
            const product = JSON.stringify(data);
            const productData = data;
            if (product === '[]') {
              this.openSnackBar(
                `There is no any product available for the Barcode:${upc}`,
                'Close'
              );
            } else {
              this.fillProductId = productData[0].id;
              this.fillUpc = this.scannerUpc.value;
            }
          },
          error => {
            this.createErrorLog(error.message);
            this.isLoading = false;
          }
        );
      }
    } else {
      this.openSnackBar(
        `Metadata is already filled up for the Barcode:${upc}`,
        'Close'
      );
    }
  }

  /**
   * Show metadata form
   */
  showMetaForm() {
    this.isMetaFormShow = true;
    setTimeout(() => {
      this.descriptorFocus.nativeElement.focus();
    }, 100);
  }

  /**
   * Get purchase Orders
   */
  getDeleveries() {
    this.isLoading = true;
    this.commonService.getSupplierDelivery().subscribe(
      data => {
        this.isLoading = false;
        const array = [];
        this.purchaseOrders.push(data);
        for (const item of this.purchaseOrders[0]) {
          array.push(item.purchase_order);
        }
        this.uniqueorders = Array.from(new Set(array));
        this.setAutoComplete();
      },
      error => {
        this.createErrorLog(error.message);
        this.isLoading = false;
      }
    );
  }

  /**
   * Get metadata by upc
   */
  getMetaDataByUpc() {
    const upc = this.scannerUpc.value;
    let isAvailBarcode = false;
    for (const item of this.ordersList) {
      if (this.scannerUpc.value === item.upc) {
        isAvailBarcode = true;
      }
    }
    if (upc === null || upc === '') {
      this.openSnackBar('Please enter barcode', 'Close');
    } else if (!isAvailBarcode) {
      this.openSnackBar('Barcode not found for this purchase order', 'Close');
    } else {
      this.isLoading = true;
      this.commonService.getMetaDataByUpc(upc).subscribe(
        data => {
          this.isLoading = false;
          this.isScanned = true;
          const metaData = JSON.stringify(data);
          if (metaData === '[]') {
            this.openSnackBar(
              `Metadata is not fill up yet for the Barcode:${upc}`,
              'Close'
            );
            this.metaAvail = 1;
            this.checkProductForBarcodeForm();
            setTimeout(() => {
              this.qtyFocus.nativeElement.focus();
            }, 100);
          } else {
            this.openSnackBar(
              `Metadata is already filled up for the Barcode:${upc}`,
              'Close'
            );
            const metaFilled = data;
            this.editedMetaId = metaFilled[0].id;
            this.fillProductId = metaFilled[0].product_id;
            this.fillUpc = metaFilled[0].upc;
            this.fillDescriptor = metaFilled[0].descriptor;
            this.fillDepartment = metaFilled[0].department;
            this.fillAisle = metaFilled[0].aisle;
            this.fillHeight = metaFilled[0].height;
            this.fillLength = metaFilled[0].length;
            this.fillLengthSecondary = metaFilled[0].length_secondary;
            this.fillWidth = metaFilled[0].width;
            this.fillWidthSecondary = metaFilled[0].width_secondary;
            this.fillDiameter = metaFilled[0].diameter;
            this.fillDiameterSecondary = metaFilled[0].diameter_secondary;
            this.fillDiameterNarrow = metaFilled[0].diameter_narrow;
            this.fillMass = metaFilled[0].mass;
            this.fillVolume = metaFilled[0].volume;
            this.fillBoundingBoxVolume = metaFilled[0].bounding_box_volume;
            this.fillDensity = metaFilled[0].density;
            this.fillCog = metaFilled[0].cog;
            this.fillShape = metaFilled[0].shape;
            this.fillMaterial = metaFilled[0].material;
            this.fillPackageType = metaFilled[0].package_type;
            this.fillPackagingMods = metaFilled[0].packaging_mods;
            this.fillTransparency = metaFilled[0].transparency;
            this.fillDamageable = metaFilled[0].damageable;
            this.fillDamaging = metaFilled[0].damaging;
            this.fillHasStem = metaFilled[0].has_stem;
            this.fillIsSharp = metaFilled[0].is_sharp;
            this.fillStorageTemp = metaFilled[0].storage_temp;
            this.fillStorageHumidity = metaFilled[0].storage_humidity;
            this.fillEthyleneSensitivity = metaFilled[0].ethylene_sensitivity;
            this.fillCo2Sensitivity = metaFilled[0].co2_sensitivity;
            this.fillMaxInventory = metaFilled[0].max_inventory;
            this.fillStorageConfig = metaFilled[0].storage_config;
            this.fillShelfLife = metaFilled[0].shelf_life;
            this.metaAvail = 1;
            setTimeout(() => {
              this.qtyFocus.nativeElement.focus();
            }, 100);
          }
        },
        error => {
          this.createErrorLog(error.message);
          this.isLoading = false;
        }
      );
    }
  }

  /**
   * Come back to it & scan another
   */
  refreshScan() {
    this.isScanned = false;
    this.isMetaFormShow = false;
    this.scannerUpc.setValue('');
    this.scannerInput.nativeElement.focus();
  }

  /**
   * Display with in autocomplete
   */
  displayFn(user?: IUser): string | undefined {
    return user ? user.name : undefined;
  }

  /**
   * Filter autocomplete
   */
  private _filter(name: string): IUser[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  /**
   * Set autocompete
   */
  setAutoComplete() {
    for (const item of this.uniqueorders) {
      this.options.push({
        name: item
      });
    }
    this.filteredOptions = this.orderInput.valueChanges.pipe(
      startWith<string | IUser>(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice()))
    );
  }

  /**
   * Load the orders
   */
  loadOrder() {
    this.isBarcodeDiv = false;
    this.isMetaFormShow = false;
    this.isScanned = false;
    let orderId = '';
    if (
      this.orderInput.value != null &&
      typeof this.orderInput.value === 'string'
    ) {
      orderId = this.orderInput.value;
    } else if (
      typeof this.orderInput.value === 'object' &&
      this.orderInput.value !== null
    ) {
      orderId = this.orderInput.value.name;
    } else {
      orderId = '';
    }
    if (orderId === '') {
      this.openSnackBar('Please Enter Order', 'Close');
    } else {
      this.ordersList = [];
      this.isLoading = true;
      this.commonService.loadOrder(orderId).subscribe(
        data => {
          this.isLoading = false;
          this.ordersLoad = true;
          this.isBarcodeDiv = true;
          this.ordersList.push(data);
          this.ordersList = this.ordersList[0];
          setTimeout(() => {
            this.scannerUpc.setValue('');
            this.receivedQty.setValue('');
            this.scannerInput.nativeElement.focus();
          }, 100);
        },
        error => {
          this.createErrorLog(error.message);
          this.isLoading = false;
        }
      );
    }
  }

  /**
   * Insert Metadata
   */
  submitMetaData() {
    if (this.metaAvail === 1) {
      this.registerMetaData();
      this.isLoading = true;
    } else {
      this.updateReceivedQty();
    }
  }

  /**
   * Register Metadata
   */
  registerMetaData() {
    this.allValues = [
      {
        product_id: this.isNullNum(this.productId.value),
        descriptor: this.isNullStr(this.descriptor.value),
        upc: this.isNullStr(this.scannerUpc.value),
        department: this.isNullStr(this.department.value),
        aisle: this.isNullStr(this.aisle.value),
        height: this.isNullNum(this.height.value),
        length: this.isNullNum(this.length.value),
        length_secondary: this.isNullNum(this.lengthSecondary.value),
        width: this.isNullNum(this.width.value),
        width_secondary: this.isNullNum(this.widthSecondary.value),
        diameter: this.isNullNum(this.diameter.value),
        diameter_secondary: this.isNullNum(this.diameterSecondary.value),
        diameter_narrow: this.isNullNum(this.diameterNarrow.value),
        mass: this.isNullNum(this.mass.value),
        volume: this.isNullNum(this.volume.value),
        bounding_box_volume: this.isNullNum(this.boundingBoxVolume.value),
        density: this.isNullNum(this.density.value),
        cog: this.isNullNum(this.cog.value),
        shape: this.isNullNum(this.shape.value),
        material: this.isNullStr(this.material.value),
        package_type: this.isNullStr(this.packageType.value),
        packaging_mods: this.isNullStr(this.packagingMods.value),
        transparency: this.isNullNum(this.transparency.value),
        damageable: this.isNullNum(this.damageable.value),
        damaging: this.isNullNum(this.damaging.value),
        has_stem: this.isNullNum(this.hasStem.value),
        is_sharp: this.isNullNum(this.isSharp.value),
        storage_temp: this.isNullNum(this.storageTemp.value),
        storage_humidity: this.isNullNum(this.storageHumidity.value),
        ethylene_sensitivity: this.isNullNum(this.ethyleneSensitivity.value),
        co2_sensitivity: this.isNullNum(this.co2Sensitivity.value),
        max_inventory: this.isNullNum(this.maxInventory.value),
        storage_config: this.isNullStr(this.storageConfig.value),
        shelf_life: this.isNullNum(this.shelfLife.value)
      }
    ];

    if (this.editedMetaId !== 0 && this.isMetaFormShow === true) {
      this.commonService
        .updateMetadata(this.allValues, this.editedMetaId)
        .subscribe(
          data => {
            this.openSnackBar('Metadata Updated Succesfully', 'Close');
            this.editedMetaId = 0;
            this.updateReceivedQty();
            this.isLoading = false;
          },
          error => {
            this.openSnackBar('Metadata Update Failed', 'Close');
            this.isLoading = false;
            this.createErrorLog(error.message);
          }
        );
    } else if (this.isMetaFormShow === true) {
      this.commonService.addMetaData(this.allValues).subscribe(
        res => {
          const data = [];
          data.push(res);
          if (data[0].id !== undefined) {
            this.openSnackBar('Metadata Added Succesfully', 'Close');
            this.isLoading = false;
            this.updateReceivedQty();
          }
        },
        error => {
          this.createErrorLog(error.message);
          this.openSnackBar('Metadata Added Failed', 'Close');
          this.isLoading = false;
        }
      );
    } else {
      this.updateReceivedQty();
    }
  }

  /**
   * Update Received Quantity and box id
   */
  updateReceivedQty() {
    if (this.receivedQty.value === '') {
      this.openSnackBar('Please enter quantity', 'Close');
    } else if (this.boxId.value === '') {
      this.openSnackBar('Please enter box id', 'Close');
    } else {
      this.isLoading = true;
      for (const item of this.ordersList) {
        if (item.upc === this.scannerUpc.value) {
          this.deliveriesId = item.id;
        }
      }
      this.commonService
        .updateReceivedQty(
          this.receivedQty.value,
          this.boxId.value,
          this.deliveriesId
        )
        .subscribe(
          res => {
            const data = [];
            data.push(res);
            if (data[0].id !== undefined) {
              this.openSnackBar(
                'Received Quantity updated successfully!',
                'Close'
              );
              this.isLoading = false;
              this.registerBoxId();
            }
          },
          error => {
            this.createErrorLog(error.message);
            this.openSnackBar('Received Quantity update failed!', 'Close');
            this.isLoading = false;
          }
        );
    }
  }

  /**
   * Register box id
   */
  registerBoxId() {
    this.isLoading = true;
    let finalDate = '';
    let date = '';
    let month = '';
    const datetime = new Date();
    const dd = datetime.getDate();
    const mm = datetime.getMonth() + 1;
    const yyyy = datetime.getFullYear();
    if (dd < 10) {
      date = `0${dd}`;
    }
    if (mm < 10) {
      month = `0${mm}`;
    }
    const time = `${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`;
    finalDate = `${yyyy}-${mm}-${dd} ${time}`;
    this.commonService.registerBoxId(this.boxId.value, finalDate).subscribe(
      data => {
        this.openSnackBar('Box id successfully placed!', 'Close');
        this.loadOrder();
      },
      error => {
        this.createErrorLog(error.message);
        this.openSnackBar('Box id placed failed!', 'Close');
        this.isLoading = false;
      }
    );
  }

  /**
   * Check string value null or not
   * @param val val
   */
  isNullStr(val) {
    if (val == null) {
      return '';
    } else {
      return val;
    }
  }

  /**
   * Check number value null or not
   * @param val val
   */
  isNullNum(val) {
    if (val == null || val === '') {
      return 0;
    } else if (val === 'False') {
      return 0;
    } else if (val === 'True') {
      return 1;
    } else {
      return val;
    }
  }

  /**
   * Create error log
   * @param error error
   */
  createErrorLog(error) {
    this.commonService.createErrorLog(error).subscribe();
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
}
