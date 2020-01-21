import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../../../core';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  allValues: any;
  editMode = 0;
  itemName = new FormControl();
  variantId = new FormControl();
  sku = new FormControl();
  upc = new FormControl();
  itemPrice = new FormControl();
  salePrice = new FormControl();
  shortDescription = new FormControl();
  longDescription = new FormControl();
  categoryId = new FormControl();
  brand = new FormControl();
  itemImage = new FormControl();
  thumbImage = new FormControl();
  label = new FormControl();
  altImage1 = new FormControl();
  altImage2 = new FormControl();
  altImage3 = new FormControl();
  isMeat = new FormControl();
  isProduce = new FormControl();
  nominalSize = new FormControl();
  unitType = new FormControl();
  public variants = [];
  public categories = [];
  public editData = [];
  selectedItemImage = null;
  selectedThumbImage = null;
  generatedProductId: any;
  pId = '';
  fillItemName: any;
  fillSku: any;
  fillVariantId: any;
  fillUpc: any;
  fillUnitType: any;
  fillNominalSize: any;
  fillIsProduce: any;
  fillIsMeat: any;
  fillAltImage3: any;
  fillAltImage2: any;
  fillAltImage1: any;
  fillLabel: any;
  fillThumbImage: any;
  fillItemImage: any;
  fillBrand: any;
  fillCategoryId: any;
  fillLongDescription: any;
  fillShortDescription: any;
  fillSalePrice: any;
  fillItemPrice: any;
  onEdit: any;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    this.getVariants();
    this.getCategories();
    this.pId = this.route.snapshot.params.productId;
    this.onEdit = this.route.snapshot.params.onEdit;
    this.setData();
  }

  /**
   * Get Veriants
   */
  getVariants() {
    this.commonService.getVariants().subscribe(
      data => {
        this.variants.push(data);
      },
      error => {
        this.createErrorLog(error.message);
      }
    );
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
   * Set Data
   */
  setData() {
    if (this.pId !== undefined) {
      this.editMode = 1;
      this.commonService.getProductData(this.pId).subscribe(
        data => {
          this.editData.push(data);
          this.setEditFormData();
        },
        error => {
          this.createErrorLog(error.message);
        }
      );
    }
  }

  /**
   * Set data to form
   */
  setEditFormData() {
    this.fillItemName = this.editData[0][0].name;
    this.fillVariantId = this.editData[0][0].variant_id;
    this.fillSku = this.editData[0][0].sku;
    this.fillUpc = this.editData[0][0].upc;
    this.fillItemPrice = this.editData[0][0].price;
    this.fillSalePrice = this.editData[0][0].sale_price;
    this.fillShortDescription = this.editData[0][0].long_description;
    this.fillLongDescription = this.editData[0][0].short_description;
    this.fillCategoryId = this.editData[0][0].category_id;
    this.fillBrand = this.editData[0][0].brand;
    this.fillItemImage = this.editData[0][0].thumb;
    this.fillThumbImage = this.editData[0][0].image;
    this.fillLabel = this.editData[0][0].label;
    this.fillAltImage1 = this.editData[0][0].alt_img_1;
    this.fillAltImage2 = this.editData[0][0].alt_img_2;
    this.fillAltImage3 = this.editData[0][0].alt_img_3;
    this.fillIsMeat = this.editData[0][0].is_selectable_meat;
    this.fillIsProduce = this.editData[0][0].is_selectable_produce;
    this.fillNominalSize = this.editData[0][0].nominal_size;
    this.fillUnitType = this.editData[0][0].unit_type;
  }

  /**
   * on Submit handler
   * @param btnEvent btnEvent
   */
  onSubmit(btnEvent) {
    if (this.itemName.value == null || this.itemImage.value === '') {
      this.openSnackBar('Please Enter Item Name', 'Close');
    } else {
      this.allValues = [
        {
          name: this.itemName.value,
          variant_id: this.variantId.value,
          sku: this.sku.value,
          upc: this.upc.value,
          price: this.itemPrice.value,
          sale_price: this.salePrice.value,
          long_description: this.longDescription.value,
          short_description: this.shortDescription.value,
          category_id: this.categoryId.value,
          brand: this.brand.value,
          thumb: this.thumbImage.value,
          image: this.itemImage.value,
          label: this.label.value,
          alt_img_1: this.altImage1.value,
          alt_img_2: this.altImage2.value,
          alt_img_3: this.altImage3.value,
          is_selectable_meat: this.isMeat.value,
          is_selectable_produce: this.isProduce.value,
          nominal_size: this.nominalSize.value,
          unit_type: this.unitType.value
        }
      ];

      this.commonService.addProduct(this.allValues, this.pId).subscribe(
        res => {
          const data = [];
          data.push(res);
          this.generatedProductId = data[0].id;
          if (btnEvent === 'save') {
            this.router.navigate(['/elastic-search']);
          } else {
            this.router.navigate([
              '/add-meta-data',
              { productId: this.generatedProductId, onEdit: this.onEdit }
            ]);
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
