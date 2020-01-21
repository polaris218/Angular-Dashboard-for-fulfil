import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable()
export class CommonService {
  fulfilBaseProdUrl = 'http://api.fulfil.store/';
  fulfilBaseDevUrl = 'http://35.196.51.11/';
  fulfilBaseLocalUrl = 'http://localhost:1337/';
  fulfilBaseUrl = environment.API_URL;
  elasticBaseUrl = 'http://34.73.23.12/';
  errorTypes = 'DASHBOARD';
  apiKey = '';
  permission = [];

  constructor(private http: HttpClient) {}

  /**
   * Get Orders
   * @param from from
   * @param limit limit
   */
  getOrders(from, limit) {
    const configUrl = `${this.fulfilBaseUrl}order/getAllOrders?from=${from}&limit=${limit}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }
  /**
   * Get Variants
   */
  getVariants() {
    const configUrl = `${this.fulfilBaseUrl}variants`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }
  /**
   * Get Categories
   */
  getCategories() {
    const configUrl = `${this.fulfilBaseUrl}category`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * reOrder
   * @param productId productId
   * @param cartId cartId
   */
  reOrder(productId, cartId) {
    const url = `${this.fulfilBaseUrl}cart/additem`;
    const data = {
      product_id: productId,
      cart_id: cartId
    };
    return this.http
      .post(url, data, { headers: { key: this.apiKey } })
      .pipe(map(response => response));
  }

  /**
   * Search product
   * @param searchString searchString
   */
  getProductsService(searchString) {
    const configUrl = `${this.fulfilBaseUrl}product/search?name=${searchString}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Get error logs
   * @param searchString searchString
   * @param filterEnvironment filterEnvironment
   * @param filterTypes filterTypes
   */
  getErrorLog(searchString, filterEnvironment, filterTypes) {
    const configUrl =
      `${this.fulfilBaseUrl}log/getAllLog?filterTypes=${filterTypes}&filterEnvironment` +
      `=${filterEnvironment}&searchString=${searchString}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Add product
   * @param allValues allValues
   * @param pId productId
   */
  addProduct(allValues, pId) {
    let url = '';
    if (pId === undefined) {
      url = `${this.fulfilBaseUrl}product/`;
    } else {
      url = `${this.fulfilBaseUrl}product/${pId}`;
    }
    const allValue = allValues[0];
    const data = {
      name: allValue.name,
      variant_id: allValue.variant_id,
      sku: allValue.sku,
      upc: allValue.upc,
      price: allValue.price,
      sale_price: allValue.sale_price,
      long_description: allValue.long_description,
      short_description: allValue.short_description,
      category_id: allValue.category_id,
      brand: allValue.brand,
      thumb: allValue.thumb,
      image: allValue.image,
      label: allValue.label,
      alt_img_1: allValue.alt_img_1,
      alt_img_2: allValue.alt_img_2,
      alt_img_3: allValue.alt_img_3,
      is_selectable_meat: allValue.is_selectable_meat,
      is_selectable_produce: allValue.is_selectable_produce,
      nominal_size: allValue.nominal_size,
      unit_type: allValue.unit_type
    };
    if (pId === undefined) {
      return this.http.post(url, data, { headers: { key: this.apiKey } });
    } else {
      return this.http.put(url, data, { headers: { key: this.apiKey } });
    }
  }

  /**
   * Delete product
   * @param pId productId
   */
  deleteProduct(pId) {
    const url = `${this.fulfilBaseUrl}product/?id=${pId}`;
    return this.http.delete(url, { headers: { key: this.apiKey } });
  }

  /**
   * get Product data
   * @param pId productId
   */
  getProductData(pId) {
    const configUrl = `${this.fulfilBaseUrl}product?id=${pId}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * get metadata
   * @param pId pId
   */
  getMetaData(pId) {
    const configUrl = `${this.fulfilBaseUrl}metadata?product_id=${pId}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Add metadata
   * @param allValues allValues
   */
  addMetaData(allValues) {
    const url = `${this.fulfilBaseUrl}metadata/`;
    const data = this.getMetadataArray(allValues);
    return this.http.post(url, data, { headers: { key: this.apiKey } });
  }

  /**
   * Update metadata
   * @param allValues allValues
   * @param pId productId
   */
  updateMetadata(allValues, pId) {
    const url = `${this.fulfilBaseUrl}metadata/${pId}`;
    const data = this.getMetadataArray(allValues);
    return this.http.put(url, data, { headers: { key: this.apiKey } });
  }

  /**
   * Return array for insert or update data for metadata
   * @param allValues allValues
   */
  getMetadataArray(allValues) {
    const allValue = allValues[0];
    const data = {
      product_id: allValue.product_id,
      descriptor: allValue.descriptor,
      upc: allValue.upc,
      department: allValue.department,
      aisle: allValue.aisle,
      height: allValue.height,
      length: allValue.length,
      length_secondary: allValue.length_secondary,
      width: allValue.width,
      width_secondary: allValue.width_secondary,
      diameter: allValue.diameter,
      diameter_secondary: allValue.diameter_secondary,
      diameter_narrow: allValue.diameter_narrow,
      volume: allValue.volume,
      bounding_box_volume: allValue.bounding_box_volume,
      density: allValue.density,
      cog: allValue.cog,
      shape: allValue.shape,
      material: allValue.material,
      package_type: allValue.package_type,
      packaging_mods: allValue.packaging_mods,
      transparency: allValue.transparency,
      damageable: allValue.damageable,
      damaging: allValue.damaging,
      has_stem: allValue.has_stem,
      is_sharp: allValue.is_sharp,
      storage_temp: allValue.storage_temp,
      storage_humidity: allValue.storage_humidity,
      ethylene_sensitivity: allValue.ethylene_sensitivity,
      co2_sensitivity: allValue.co2_sensitivity,
      max_inventory: allValue.max_inventory,
      storage_config: allValue.storage_config,
      shelf_life: allValue.shelf_life
    };
    return data;
  }

  /**
   * Generate Fake order
   * @param minItemsPerOrder minItemsPerOrder
   * @param maxItemsPerOrder maxItemsPerOrder
   * @param orderNumber orderNumber
   * @param carrier carrier
   * @param category category
   */
  genFakeOrder(
    minItemsPerOrder,
    maxItemsPerOrder,
    orderNumber,
    carrier,
    category
  ) {
    const configUrl =
      `${this.fulfilBaseUrl}order/generateDemoOrders?min_items_per_order=` +
      `${minItemsPerOrder}&max_items_per_order=${maxItemsPerOrder}&num_orders=${orderNumber}` +
      `&carrier=${carrier}&category=${category}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Reset Inventory
   */
  resetInventory() {
    const configUrl = `${this.fulfilBaseUrl}inventory/reset?password=pineapple`;
    return this.http.get(configUrl, {
      responseType: 'text',
      headers: { key: this.apiKey }
    });
  }
  /**
   * Create Cart
   */
  createCart() {
    const configUrl =
      `${this.fulfilBaseUrl}cart/create?userKey=cf7749baf66cbef6b1ad5b418987681c99b8` +
      '2488cf9fc5b3cd35d03a995887e49de15450ccb7d7f6acfeb72ad209984e73e48b9044d9c8833777897b51f2e84a3c9779c5d7487095a833eccf31a2198f';
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Add item to cart
   * @param productId productId
   * @param cartId cartId
   */
  addItemsToCart(productId, cartId) {
    const url = `${this.fulfilBaseUrl}cart/additem`;
    const data = {
      product_id: productId,
      cart_id: cartId
    };
    return this.http.post(url, data, { headers: { key: this.apiKey } });
  }

  /**
   * Create Order
   * @param cartId cartId
   */
  createOrder(cartId) {
    const url = `${this.fulfilBaseUrl}order/createOrder`;
    const data = {
      user_id:
        'cf7749baf66cbef6b1ad5b418987681c99b82488cf9fc5b3cd35d03a995' +
        '887e49de15450ccb7d7f6acfeb72ad209984e73e48b9044d9c8833777897b51' +
        'f2e84a3c9779c5d7487095a833eccf31a2198f',
      cart_id: cartId,
      card_number: '4111474741114747',
      csv: '333',
      expiration: '11/2019',
      billing_name: 'John Smith',
      billing_address: '3501 Edison Way',
      billing_city: 'Menlo Park',
      billing_zipcode: '94025',
      billing_country: 'USA',
      delivery_address: '3501 Edison Way',
      delivery_city: 'Menlo Park',
      delivery_zipcode: '94025',
      delivery_time: 'ASAP'
    };
    return this.http.post(url, data, { headers: { key: this.apiKey } });
  }

  /**
   * Create curated Order
   * @param orderTitle orderTitle
   * @param orderItems orderItems
   */
  createCuratedOrder(orderTitle, orderItems) {
    const url = `${this.fulfilBaseUrl}curatedorder`;
    const data = {
      order_title: orderTitle,
      order_items: orderItems
    };
    return this.http.post(url, data, { headers: { key: this.apiKey } });
  }

  /**
   * Get cureated order service
   * @param dataLimit dataLimit
   * @param dataSkip dataSkip
   */
  getCuratedOrderService(dataLimit, dataSkip) {
    const configUrl = `${this.fulfilBaseUrl}curatedorder?limit=${dataLimit}&skip=${dataSkip}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }
  /**
   * get Curated Order Length Service
   */
  getCuratedOrderLengthService() {
    const configUrl = `${this.fulfilBaseUrl}curatedorder`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Delete Curated Order
   * @param id id
   */
  deleteCuratedOrder(id) {
    const url = `${this.fulfilBaseUrl}curatedorder/?id=${id}`;
    return this.http.delete(url, { headers: { key: this.apiKey } });
  }

  /**
   * Insert error log to db
   * @param error Error
   */
  createErrorLog(error) {
    const url =
      `${this.fulfilBaseUrl}log/logInsert?error_message=${error}&environment=${environment.name}&` +
      `types=${this.errorTypes}&logName=fulfil-dashboard`;
    const data = {};
    return this.http.post(url, data, { headers: { key: this.apiKey } });
  }

  /**
   * Get Graph Data
   * @param runsetId runsetId
   */
  getGraphData(runsetId) {
    let configUrl = '';
    if (runsetId === '') {
      configUrl = `${this.fulfilBaseUrl}simrunsets?limit=10000`;
    } else {
      configUrl = `${this.fulfilBaseUrl}simrunsets?limit=10000&id=${runsetId}`;
    }
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Get Core Commands
   */
  getCoreCommands() {
    const configUrl = `${this.fulfilBaseUrl}factorydata/corecommands`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * upload csv feed to server and get uploaded response.
   * @param body body
   */
  postFeeds(body) {
    const { env, key, type, table, file } = body;
    const form = new FormData();
    form.append('table', table);
    form.append('type', type);
    form.append('file', file);

    const url =
      env === 'prod'
        ? this.fulfilBaseProdUrl
        : env === 'dev'
        ? this.fulfilBaseDevUrl
        : this.fulfilBaseLocalUrl;
    const configUrl = `${url}inventory/uploadInventory?table=${table}&type=${type}`;
    return this.http.post(configUrl, form, {
      headers: { key: key || this.apiKey }
    });
  }

  /**
   * Download csv feed to from database.
   * @param body body
   */
  downloadFeeds(body) {
    const { env, key, table } = body;
    const url =
      env === 'prod'
        ? this.fulfilBaseProdUrl
        : env === 'dev'
        ? this.fulfilBaseDevUrl
        : this.fulfilBaseLocalUrl;
    const configUrl = `${url}inventory/inventoryDownload?table=${table}`;
    return this.http.get(configUrl, {
      headers: { key: key || this.apiKey },
      responseType: 'blob'
    });
  }

  /**
   * Get Search Images
   * @param product_id product_id
   * @param startDate startDate
   * @param endDate endDate
   * @param from from
   * @param imageType imageType
   * @param labelled labelled
   * @param unlabelled unlabelled
   */
  getSearchImages(
    productId,
    startDate,
    endDate,
    from,
    imageType,
    labelled,
    unlabelled
  ) {
    const configUrl =
      `${this.fulfilBaseUrl}images/unlabelledImages?product_id=${productId}` +
      `&startDate=${startDate}&endDate=${endDate}&from=${from}&image_type=${imageType}` +
      `&labelled=${labelled}&unlabelled=${unlabelled}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Get Grade Filter
   * @param gradeType gradeType
   * @param inventoryId inventoryId
   */
  getGradeFilter(gradeType, inventoryId) {
    const configUrl =
      `${this.fulfilBaseUrl}groundtruthgrades?where={"grade":${gradeType}` +
      `,"inventory_id":${inventoryId}}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Save Bounding Boxes
   * @param boxes boxes
   */
  saveBoundingBoxes(boxes) {
    const url = `${this.fulfilBaseUrl}boundingboxlabels`;
    const data = {
      image_id: boxes.image_id,
      label: boxes.label,
      x1: boxes.x1,
      y1: boxes.y1,
      x2: boxes.x2,
      y2: boxes.y2,
      version: boxes.version,
      date_created: boxes.date_created,
      source: boxes.source,
      labeler: boxes.labeler,
      job_id: boxes.job_id
    };
    return this.http.post(url, data, { headers: { key: this.apiKey } });
  }

  /**
   * Delete Existing Boxes
   * @param id id
   */
  deleteExistingBoxes(id) {
    const url = `${this.fulfilBaseUrl}boundingboxlabels?id=${id}`;
    return this.http.delete(url, { headers: { key: this.apiKey } });
  }
  /**
   * Get Products
   */
  getProducts() {
    const configUrl = `${this.fulfilBaseUrl}product/getAnnotationProducts`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Get Annotation Labels
   * @param groupId groupId
   * @param version version
   */
  getAnnotationLabels(groupId, version) {
    const configUrl =
      `${this.fulfilBaseUrl}annotationlabels?limit=10000&` +
      `group_id=${groupId}&version=${version}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Get AccessToken
   */
  getAccessToken() {
    const configUrl = 'https://www.googleapis.com/oauth2/v4/token';
    const data = {
      client_secret: 'SvMeG-XQUsMBz0pKP2OiAE1I',
      grant_type: 'refresh_token',
      refresh_token: '1/X3Vf3-T-4pP-3HwcCsQdlZJUzYaVmPnMMi_uhfkiI2E',
      client_id:
        '45591008103-alm6on1qu1apr5airh65rni0scf9qad8.apps.googleusercontent.com'
    };
    return this.http.post(configUrl, data);
  }

  /**
   * Get Bounding Boxes
   * @param imageId imageId
   * @param version version
   */
  getBoundingBoxes(imageId, version) {
    const configUrl =
      `${this.fulfilBaseUrl}boundingboxlabels?limit=10000&image_id=${imageId}` +
      `&version=${version}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Load GroundImages
   * @param pId ProductId
   * @param startDate startDate
   * @param endDate endDate
   * @param gradingType gradingType
   * @param pageNumber pageNumber
   * @param operator operator
   * @param randomize randomize
   */
  loadGroundImages(
    pId,
    startDate,
    endDate,
    gradingType: string,
    pageNumber = 0,
    operator,
    randomize
  ) {
    const configUrl =
      `${this.fulfilBaseUrl}images/unGradedImages?product_id=` +
      `${pId}&startDate=${startDate}&endDate=${endDate}&gradingType=` +
      `${gradingType}&pageNumber=${pageNumber}&operator=` +
      `${operator}&randomize=${randomize}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Insert Ground Truth Data
   * @param gradeArray gradeArray
   */
  insertGroundTruth(gradeArray) {
    const configUrl = `${this.fulfilBaseUrl}groundtruthgrades`;
    const gradeData = gradeArray[0];
    const data = {
      operator_id: gradeData.operator_id,
      inventory_id: gradeData.inventory_id,
      time_graded: gradeData.time_graded,
      grade: gradeData.grade,
      method: gradeData.method,
      guide_version: gradeData.guide_version,
      uncertain: gradeData.uncertain
    };
    return this.http.post(configUrl, data, { headers: { key: this.apiKey } });
  }

  /**
   * Update Ground Truth
   * @param gradeArray gradeArray
   */
  updateGroundTruth(gradeArray) {
    const configUrl = `${this.fulfilBaseUrl}groundtruthgrades/${+gradeArray[0]
      .grId}`;
    const gradeData = gradeArray[0];
    const data = {
      operator_id: gradeData.operator_id,
      inventory_id: gradeData.inventory_id,
      time_graded: gradeData.time_graded,
      grade: gradeData.grade,
      method: gradeData.method,
      guide_version: gradeData.guide_version,
      uncertain: gradeData.uncertain
    };
    return this.http.patch(configUrl, data, { headers: { key: this.apiKey } });
  }

  /**
   * Insert Operator Grade
   * @param groundTruthGradeId groundTruthGradeId
   * @param currentOperatorId currentOperatorId
   * @param operatorId operatorId
   * @param inventoryId inventoryId
   */
  insertOperatorGrade(
    groundTruthGradeId,
    currentOperatorId,
    operatorId,
    inventoryId
  ) {
    const configUrl = `${this.fulfilBaseUrl}operatorgrade`;
    const data = {
      groundtruthgrade_id: groundTruthGradeId,
      current_operator_id: currentOperatorId,
      operator_id: operatorId,
      inventory_id: inventoryId
    };
    return this.http.post(configUrl, data, { headers: { key: this.apiKey } });
  }

  /**
   * For admin login
   * @param username username
   * @param password password
   */
  login(username, password) {
    return this.http.post(this.fulfilBaseUrl + 'admin/login', {
      username,
      password
    });
  }
  /**
   * logout
   * @param logout logout
   */
  logout() {
    localStorage.removeItem('token');
  }

  /**
   * Retrive user permisson for check user is authorized or not for perticular routes.
   */
  getUserPermission() {
    return this.http.get(this.fulfilBaseUrl + 'admin/permission');
  }

  /**
   * Get deliveries
   */
  getSupplierDelivery() {
    const configUrl = `${this.fulfilBaseUrl}supplierdelivery`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Load Order
   * @param puchaseOrder puchaseOrder
   */
  loadOrder(puchaseOrder) {
    const configUrl = `${this.fulfilBaseUrl}deliveries/loadIncomingDeliveries?purchaseOrder=${puchaseOrder}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * get metadata by upc
   * @param upc upc
   */
  getMetaDataByUpc(upc) {
    const configUrl = `${this.fulfilBaseUrl}metadata?upc=${upc}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * get product by upc
   * @param upc upc
   */
  getProductByUpc(upc) {
    const configUrl = `${this.fulfilBaseUrl}product?upc=${upc}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Download customer order report in csv format
   */
  getReorderReportCSV() {
    const configUrl = `${this.fulfilBaseUrl}report/getStockToReorder`;
    return this.http.get(configUrl, {
      headers: { key: this.apiKey },
      responseType: 'blob'
    });
  }

  /**
   * Update receiver_qty and box_id in deliveris
   * @param qty qty
   * @param boxId boxId
   * @param deliveryId deliveryId
   */
  updateReceivedQty(qty, boxId, deliveryId) {
    const configUrl = `${this.fulfilBaseUrl}deliveries/${deliveryId}`;
    const data = {
      received_qty: qty,
      box_id: boxId
    };
    return this.http.patch(configUrl, data, { headers: { key: this.apiKey } });
  }

  /**
   * Register box id
   * @param boxId boxId
   * @param date date
   */
  registerBoxId(boxId, date) {
    const configUrl = `${this.fulfilBaseUrl}deliveriestemperature`;
    const data = {
      box_id: boxId,
      date_harvested: date,
      time_in_warehouse: date
    };
    return this.http.post(configUrl, data, { headers: { key: this.apiKey } });
  }

  /**
   * Get Users
   */
  getUsers() {
    const configUrl = `${this.fulfilBaseUrl}admin/users`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Get Permission Groups
   */
  getPermissionGroups() {
    const configUrl = `${this.fulfilBaseUrl}permissiongroup`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Get User Permission Group
   * @param permissionGroup permissionGroup
   * @param userId userId
   */
  updateGroup(permissionGroup, userId) {
    const configUrl = `${this.fulfilBaseUrl}adminuserpermission`;
    const data = {
      user_id: userId,
      api_key: this.apiKey,
      permission_group: permissionGroup
    };
    return this.http.patch(configUrl, data, { headers: { key: this.apiKey } });
  }

  /**
   * Create New Permission Group
   * @param groupName groupName
   */
  insertNewGroup(groupName) {
    const configUrl = `${this.fulfilBaseUrl}permissiongroup`;
    const data = {
      group: groupName
    };
    return this.http.post(configUrl, data, { headers: { key: this.apiKey } });
  }

  /**
   * Get All Routes
   */
  getAllRoutes() {
    const configUrl = `${this.fulfilBaseUrl}approutes`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Get Permitted Routes
   * @param groupId groupId
   */
  getPermittedRoutes(groupId) {
    const configUrl = `${this.fulfilBaseUrl}permissiongrouproutes?groupId=${groupId}`;
    return this.http.get(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Delete Permitted Routes
   * @param groupId groupId
   */
  deleteGroup(groupId) {
    const configUrl = `${this.fulfilBaseUrl}permissiongrouproutes?groupId=${groupId}`;
    return this.http.delete(configUrl, { headers: { key: this.apiKey } });
  }

  /**
   * Insert group Routes
   * @param groupId groupId
   * @param routeId routeId
   */
  insetGroupRoute(routeId, groupId) {
    const configUrl = `${this.fulfilBaseUrl}permissiongrouproutes`;
    const data = {
      group: groupId,
      route_Id: routeId
    };
    return this.http.post(configUrl, data, { headers: { key: this.apiKey } });
  }

}
