import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../core';

@Component({
  selector: 'app-add-meta-data',
  templateUrl: './add-meta-data.component.html',
  styleUrls: ['./add-meta-data.component.css']
})
export class AddMetaDataComponent implements OnInit {
  fillProductId: any;
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
  allValues: any;
  createItemActive = 0;
  public editData = [];
  editMode = 0;
  onEdit: any;
  fillDescriptor: any;
  fillUpc: any;
  fillDepartment: any;
  fillAisle: any;
  fillHeight: any;
  fillWidth: any;
  fillLength: any;
  fillLengthSecondary: any;
  Width: any;
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

  constructor(
    public route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private commonService: CommonService,
    public router: Router
  ) {}

  /**
   *  code function on component load
   */
  ngOnInit() {
    this.fillProductId = this.route.snapshot.params.productId;
    this.onEdit = this.route.snapshot.params.onEdit;
    this.setData();
  }

  /**
   * Get Metadata by Product id
   */
  setData() {
    if (this.fillProductId !== undefined) {
      this.editMode = 1;
      this.commonService.getMetaData(this.fillProductId).subscribe(
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
   * Fill up data for update
   */
  setEditFormData() {
    this.fillProductId = this.editData[0][0].product_id;
    this.fillDescriptor = this.editData[0][0].descriptor;
    this.fillUpc = this.editData[0][0].upc;
    this.fillDepartment = this.editData[0][0].department;
    this.fillAisle = this.editData[0][0].aisle;
    this.fillHeight = this.editData[0][0].height;
    this.fillLength = this.editData[0][0].length;
    this.fillLengthSecondary = this.editData[0][0].length_secondary;
    this.Width = this.editData[0][0].width;
    this.fillWidthSecondary = this.editData[0][0].width_secondary;
    this.fillDiameter = this.editData[0][0].diameter;
    this.fillDiameterSecondary = this.editData[0][0].diameter_secondary;
    this.fillDiameterNarrow = this.editData[0][0].diameter_narrow;
    this.fillMass = this.editData[0][0].mass;
    this.fillVolume = this.editData[0][0].volume;
    this.fillBoundingBoxVolume = this.editData[0][0].bounding_box_volume;
    this.fillDensity = this.editData[0][0].density;
    this.fillCog = this.editData[0][0].cog;
    this.fillShape = this.editData[0][0].shape;
    this.fillMaterial = this.editData[0][0].material;
    this.fillPackageType = this.editData[0][0].package_type;
    this.fillPackagingMods = this.editData[0][0].packaging_mods;
    this.fillTransparency = this.editData[0][0].transparency;
    this.fillDamageable = this.editData[0][0].damageable;
    this.fillDamaging = this.editData[0][0].damaging;
    this.fillHasStem = this.editData[0][0].has_stem;
    this.fillIsSharp = this.editData[0][0].is_sharp;
    this.fillStorageTemp = this.editData[0][0].storage_temp;
    this.fillStorageHumidity = this.editData[0][0].storage_humidity;
    this.fillEthyleneSensitivity = this.editData[0][0].ethylene_sensitivity;
    this.fillCo2Sensitivity = this.editData[0][0].co2_sensitivity;
    this.fillMaxInventory = this.editData[0][0].max_inventory;
    this.fillStorageConfig = this.editData[0][0].storage_config;
    this.fillShelfLife = this.editData[0][0].shelf_life;
  }

  /**
   * Sumbit metadata
   */
  onSubmit() {
    this.allValues = [
      {
        product_id: this.productId.value,
        descriptor: this.descriptor.value,
        upc: this.upc.value,
        department: this.department.value,
        aisle: this.aisle.value,
        height: this.height.value,
        length: this.length.value,
        length_secondary: this.lengthSecondary.value,
        width: this.width.value,
        width_secondary: this.widthSecondary.value,
        diameter: this.diameter.value,
        diameter_secondary: this.diameterSecondary.value,
        diameter_narrow: this.diameterNarrow.value,
        mass: this.mass.value,
        volume: this.volume.value,
        bounding_box_volume: this.boundingBoxVolume.value,
        density: this.density.value,
        cog: this.cog.value,
        shape: this.shape.value,
        material: this.material.value,
        package_type: this.packageType.value,
        packaging_mods: this.packagingMods.value,
        transparency: this.transparency.value,
        damageable: this.damageable.value,
        damaging: this.damaging.value,
        has_stem: this.hasStem.value,
        is_sharp: this.isSharp.value,
        storage_temp: this.storageTemp.value,
        storage_humidity: this.storageHumidity.value,
        ethylene_sensitivity: this.ethyleneSensitivity.value,
        co2_sensitivity: this.co2Sensitivity.value,
        max_inventory: this.maxInventory.value,
        storage_config: this.storageConfig.value,
        shelf_life: this.shelfLife.value
      }
    ];

    if (this.onEdit === 'true') {
      this.commonService
        .updateMetadata(this.allValues, this.editData[0][0].id)
        .subscribe(
          data => {
            this.openSnackBar('Item Updated Succesfully', 'Close');
          },
          error => {
            this.createErrorLog(error._body);
          }
        );
      this.router.navigate(['/create-item']);
    } else {
      this.commonService.addMetaData(this.allValues).subscribe(
        res => {
          const data = [];
          data.push(res);
          if (data[0].id !== undefined && this.fillProductId !== undefined) {
            this.openSnackBar('Item Added Succesfully', 'Close');
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
