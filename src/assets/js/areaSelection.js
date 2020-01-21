let defaultBoxes = [];
export function selection() {
  $('img#example').selectAreas({
    minSize: [10, 10],
    onChanged: debugQtyAreas,
    areas: []
  });
}

export function existingSelection() {
  defaultBoxes = [];
  let array = JSON.parse(window.localStorage.getItem('boxAreaArray'));
  for (let i = 0; i < array.length; i++) {
    setTimeout(() => {
      actType = 'create';
      $('img#example').selectAreas('add', array[i]);
      defaultBoxes.push({
                         'id': array[i].id, 
                         'height': array[i].height,
                         'width': array[i].width,
                         'x': array[i].x,
                         'y': array[i].y,
                         'defectName': `${array[i].defect}`,
                         'boxName': `box${array[i].id}`
                        });
    }, 500 * i);
  }
}


let selectedArray = [];
let idArray = [];
let defects = [];
let undoArray = [];
let undoDefectsAr = [];
let finalizeAreas = [];
let finalizeDefects = [];
let cz = 0;
let cy = 0;
let pointer = 0;
let undoFromIndex = 0;
let prevLength = 0;
let zCounter = 0;
let yCounter = 0;
let redoIndexAr = [];
let curMode = '';
let colorsArray = ['#F60000', '#FF1493', '#FF8C00', '#3783FF', '#4815AA', '#A52A2A', '#4DE94C', '#808000',
  '#66CDAA', '#8FBC8F', '#20B2AA', '#5F9EA0', '#87CEFA', '#1E90FF', '#0000CD', '#191970',
  '#2F4F4F', '#778899', '#FFC0CB', '#D2691E', '#3CB371'];

function debugQtyAreas (event, id, areas) {
  window.localStorage.setItem('curBoxId', id);
  if (actType == 'pick') {
    window.localStorage.setItem('picked', '1');
  } else {
    window.localStorage.setItem('picked', '0'); 
  }
  selectedArray = [];
  idArray = [];
  if (newAct == true) {
    cy = 0;
    cz = 0;
    undoFromIndex = 0;
    prevLength = 0;
    zCounter = 0;
    yCounter = 0;
    redoIndexAr = [];
  }
  setTimeout(() => {
    highlightLabel(id);
  }, 200);
  if (removeLabel == 1) {
    removeLabel = 0;
    removeLabeling(id);
    activityType('');
  } else {
  activityType(areas);
  for (let i = 0; i < arguments[2].length; i++) {
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    let id = 0;
    id = arguments[2][i].id;
    x1 = arguments[2][i].x;
    y1 = arguments[2][i].y;
    x2 = arguments[2][i].x + arguments[2][i].width;
    y2 = arguments[2][i].y + arguments[2][i].height;
    let datetime = new Date();
    let dd = datetime.getDate();
    let mm = datetime.getMonth() + 1; 
    let yyyy = datetime.getFullYear();
    if (dd < 10) {
        dd = `0${dd}`;
    } 
    if (mm < 10) {
        mm = `0${mm}`;
    } 
    let time = `${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`;
    datetime = `${yyyy}-${mm}-${dd} ${time}`;
    let selectedVersion = window.localStorage.getItem('dialogVersion');
    let imageId = window.localStorage.getItem('imageId');
    idArray.push(id);
    selectedArray.push({
                      'image_id': imageId,
                      'x1': x1,
                      'y1': y1,
                      'x2': x2,
                      'y2': y2,
                      'selectedVersion': selectedVersion,
                      'date_created': datetime,
                      'source': 'source',
                      'labeler': 'labeler',
                      'job_id': 1
                    });
    setCurBoxSel();
  }
  let editMode = window.localStorage.getItem('editMode');
  if (editMode == '1') {
    window.localStorage.setItem('selectedArea', JSON.stringify(selectedArray));
    let defectName = JSON.parse(window.localStorage.getItem('editModeLabels'));
    let defectList = JSON.parse(window.localStorage.getItem('defectList'));
    defectName = defectName[id].defect;
    let objIndex = defectList.findIndex((obj => obj.label_name == `${defectName}`));
    let defectColor = colorsArray[objIndex]; 
    if (selectBox == 0) {
      defects.push({
                  'id': id,
                  'defect': defectName,
                  'color': defectColor
                });
      window.ImageAnnotationsComponent.setSelLabelList(defectName, id, defectColor);
      setLabelToArea(defectName, defectColor);
    }
  } else {
    window.localStorage.setItem('selectedArea', JSON.stringify(selectedArray));
    let defectName = window.localStorage.getItem('defectName');
    let defectColor = window.localStorage.getItem('defectColor'); 
    if(selectBox == 0){
      defects.push({
                  'id': id,
                  'defect': defectName,
                  'color': defectColor
                });
      window.ImageAnnotationsComponent.setSelLabelList(defectName, id, defectColor);
      setLabelToArea(defectName, defectColor);
    }
  }
 }
};

export function deleteSelection() {
  $('img#example').selectAreas('reset');
}

export function resetVar() {
  selectBox = 0;
  setTimeout(() => {
    cz = 0;
    cy = 0;
    undoArray = [];
    pointer = 0;
    undoFromIndex = 0;
    prevLength = 0;
    zCounter = 0;
    yCounter = 0;
    redoIndexAr = [];
    undoDefectsAr = [];
  }, 500);
}

/**
 *
 * @param {Number} id
 */
function highlightLabel(id) {
  $(`.allDef`).css({'border':'none'});
  $(`.selDef${id}`).css({'border':'1px dashed #000'});
}

/**
 *
 * @param {Number} id
 */
function removeLabeling(id) {
  window.ImageAnnotationsComponent.removeLabeling(id);
}

/**
 *
 * @param {String} defect
 * @param {String} color
 */
export function setLabelToArea(defect, color) {
  let id = window.localStorage.getItem('curBoxId');
  $(`.sectionArea${id}`).html('<pre>'+defect+'</pre>');
  $(`.sectionArea${id} > pre`).css({'color':'#fff', 'display':'none', 'font-size': '14px',
     'position':'absolute',
     'top':'-19px','background-color':''+color+'','padding':'0 5px','border-radius':'5px',
     'min-width':'97%','margin':'0','text-align':'center'}); 
  $(`.boxColoring${id}`).css({'background':'none', 'border':'1px solid '+color+''});
  $(`.handlerCol${id}`).css({'background-color': color});
  $(`.delArea${id}`).css({'opacity':'0'});
} 

/**
 *
 * @param {Number} id
 */
export function removeBox(id) {
  $('img#example').selectAreas('remove', id);
}

/**
 *
 * @param {Number} id
 */
export function selectSelection(id) {
  $(`.select-areas-resize-handler`).css({'display':'none'});
  $(`.delete-area`).css({'display':'none'});
  $(`.fullArea${id}`).css({'display':'block'});
  $(`.boxColoring${id}`).click();    
  $(`.boxColoring${id}`).css({'z-index':'999'});  
  highlightLabel(id);
  window.localStorage.setItem('curBoxId', id);
}

export function hideSelection() {
  for (let i = 0; i < idArray.length; i++) {
    $(`.fullArea${idArray[i]}`).hide();
  }
}

/**
 *
 * @param {Number} id
 */
export function hideSingleSelection(id) {
  $(`.fullArea${id}`).hide();
  $(`.selDef${id}`).css({'display':'none'});
}

export function showSelection() {
  for (let i = 0; i < idArray.length; i++) {
    $(`.fullArea${idArray[i]}`).show();
  }
}

function setCurBoxSel() {
  let index = window.localStorage.getItem('curBoxId');
  for (let i = 0; i < selectedArray.length; i++) {
    window.localStorage.setItem('curBoxCordinates', JSON.stringify(selectedArray[index]));
  }
}


/**
 *
 * @param {Array} defects
 */
export function undoDefects(defects) {
  undoDefectsAr = defects;
  actType = 'labelChange';
  activityType('');
}

/**
 *
 * @param {Array} areas
 */
function activityType(areas) {
  changeDraw();
  setTimeout(() => {
  let defectName = window.localStorage.getItem('defectName');
  let defectColor = window.localStorage.getItem('defectColor');
  let id = window.localStorage.getItem('curBoxId'); 
  if (actType != '' && actType != 'pick') {
    if (areas.length != 0) {
      finalizeAreas = areas;
      finalizeDefects = defects;
    }
    for (let c = 0; c < undoDefectsAr.length; c++) {
      if (undoDefectsAr[c].id == id) {
        defectName = undoDefectsAr[c].defect;
        defectColor = undoDefectsAr[c].color;
      }
    }  
    for (let z = 0; z < finalizeDefects.length; z++) {
      if (finalizeDefects[z].id == id) {
        defectName = finalizeDefects[z].defect;
        defectColor = finalizeDefects[z].color;
      }
    }
    for (let i = 0; i < finalizeAreas.length; i++) {
      if (finalizeAreas[i].id == id) {
        undoArray.push({
                      'id': finalizeAreas[i].id, 
                      'height': finalizeAreas[i].height,
                      'width': finalizeAreas[i].width,
                      'x': finalizeAreas[i].x,
                      'y': finalizeAreas[i].y,
                      'defectName': defectName,
                      'defectColor': defectColor,
                      'actType': actType,
                      'boxName': `box${id}`
                    });
        actType = '';
      }
    }
  }
}, 300);
}

export function changeDraw() {
  curMode = window.localStorage.getItem('drawMode');
  if (curMode == 'Edit Mode') {
    $(`.pointerEve`).css({'pointer-events':'none'});
    $(`.editMode`).css({'pointer-events':'inherit'});
  } else {
    $(`.pointerEve`).css({'pointer-events':'inherit'});
    $(`.editMode`).css({'pointer-events':'none'});
  }
}

$(document).keyup(function(evt) {
  selectBox = 0;
  window.localStorage.setItem('editMode', '0');
  /*key = CTRL + Q*/
  if (evt.keyCode === 81 && evt.ctrlKey) {
    let curBoxCordinates = JSON.parse(window.localStorage.getItem('curBoxCordinates'));
    let height = curBoxCordinates.y2 - curBoxCordinates.y1;
    let width = curBoxCordinates.x2 - curBoxCordinates.x1;
    let areaOption1 = {
      x: curBoxCordinates.x1 + 10,
      y: curBoxCordinates.y1,
      width: width,
      height: height
    };
    $('img#example').selectAreas('add', areaOption1);
    actType = 'create';
  }
  /*key = CTRL + Z*/
  if (evt.keyCode === 90 && evt.ctrlKey) {
    doUndoAct();
  }

  /*CTRL + Y*/
  if (evt.keyCode === 89 && evt.ctrlKey) {
    doRedoAct();
  }
});

export function doUndoAct() {
  newAct = false;
  cz++;
  zCounter++;
  undoFromIndex = prevLength;
  $('img#example').selectAreas('reset');
  actType = '';
  let flags = [];
  let oldFlags = [];
  let uniqueBoxes = [];
  let oldUniqueBoxes = [];
  for (let i = 0; i < defaultBoxes.length; i++) {
    if ( oldFlags[defaultBoxes[i].boxName]) continue;
    oldFlags[defaultBoxes[i].boxName] = true;
    oldUniqueBoxes.push(defaultBoxes[i].boxName);
  }
  for (let i = pointer; i < undoArray.length; i++) {
    if ( flags[undoArray[i].boxName]) continue;
    flags[undoArray[i].boxName] = true;
    uniqueBoxes.push(undoArray[i].boxName);
  }
  ///// old items
  for (let c = 0; c < oldUniqueBoxes.length; c++) {
    let temp = oldUniqueBoxes[c]; 
    let exist = 0;
    for (let z = 0; z < uniqueBoxes.length; z++) {
      if (uniqueBoxes[z] == oldUniqueBoxes[c]) {
        exist = 1;
      }
    }
    if (exist == 0) {
      for (let i = defaultBoxes.length - 1; i >= 0; i--) {
        if (temp == defaultBoxes[i].boxName) {
          setTimeout(() => {
            let areaOption1 = {
                x: defaultBoxes[i].x,
                y: defaultBoxes[i].y,
                width: defaultBoxes[i].width,
                height: defaultBoxes[i].height
            };
            let defectList = JSON.parse(window.localStorage.getItem('defectList'));
            let defectName = defaultBoxes[i].defectName;
            let objIndex = defectList.findIndex((obj => obj.label_name == `${defectName}`));
            let defectColor = colorsArray[objIndex];
            window.localStorage.setItem('defectName', defaultBoxes[i].defectName);
            window.localStorage.setItem('defectColor', defectColor);
            $('img#example').selectAreas('add', areaOption1);
            actType = 'create';
            cz++;
          }, 450 * i); 
          break;
        }
      }
  }
}
  setTimeout(() => {
    ///// new items
      for (let c = 0; c < uniqueBoxes.length; c++) {
        let temp = uniqueBoxes[c]; 
        for (let i = undoArray.length - (cz + 1); i >= 0; i--) {
          if (temp == undoArray[i].boxName) {
            setTimeout(() => {
              let areaOption1 = {
                  x: undoArray[i].x,
                  y: undoArray[i].y,
                  width: undoArray[i].width,
                  height: undoArray[i].height
              };
              window.localStorage.setItem('defectName', undoArray[i].defectName);
              window.localStorage.setItem('defectColor', undoArray[i].defectColor);
              $('img#example').selectAreas('add', areaOption1);
              actType = 'create';
              cz++;
            }, 450 * i);
            break;
          }
        }
      }
  }, 1000);
  pointer = undoArray.length;
  prevLength = undoArray.length;
  redoIndexAr.push({
                  'count': zCounter,
                  'startIndex': undoFromIndex,
                  'endIndex': prevLength - 1
                });
}

export function doRedoAct() {
  yCounter++;
  if (zCounter >= yCounter) {
    newAct = false;
    cy++;
    $('img#example').selectAreas('reset');
    let flags = [];
    let uniqueBoxes = [];
    let redoIndex = zCounter-yCounter;
    for (let i = redoIndexAr[redoIndex].startIndex; i <= redoIndexAr[redoIndex].endIndex; i++) {
      if (flags[undoArray[i].boxName]) continue;
      flags[undoArray[i].boxName] = true;
      uniqueBoxes.push(undoArray[i].boxName);
    }
    for (let c = 0; c < uniqueBoxes.length; c++) {
      let temp = uniqueBoxes[c];
      for (let i = redoIndexAr[redoIndex].endIndex; i >= 0; i--) {
          if (temp == undoArray[i].boxName) {
            setTimeout(() => {
              if (undoArray[i].actType != 'delete') {
              let areaOption1 = {
                  x: undoArray[i].x,
                  y: undoArray[i].y,
                  width: undoArray[i].width,
                  height: undoArray[i].height
                }; 
              window.localStorage.setItem('defectName', undoArray[i].defectName);
              window.localStorage.setItem('defectColor', undoArray[i].defectColor);
              $('img#example').selectAreas('add', areaOption1);
              actType = 'create';
              cy++;
              }
            }, 450 * i);
            break;
        }
      }
    }
  }
}
