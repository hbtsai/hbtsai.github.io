var selectModule = (function() {
  'use strict';
  var selections = {
    "panel-type": "three",
    "panel-voltage": "277-480",
    "small-ct": "true",
    "large-ct": "false",
    "mounting-location": "side",
    "breakers": "spare",
    "chains": "two",  
    "confirmation": "false", 
    "errorType": "false",
    "error-light": "no-error-light", 
    "error-light-selector": "false", 
    "error-fix-selector": "false"
  };

  var THREE_PANEL_120 = new Event('three-panel-120');
  var THREE_PANEL_277 = new Event('three-panel-277');
  var SPLIT_PANEL = new Event('split-panel');
  var SINGLE = new Event('single');
  var UPDATE_SVG = new Event('update-svg');

  var PANEL_LIST = ['.three', '.split', '.single'];
  // var CTSIZE_LIST = ['.both', '.large-only','.small-only'];
  var LOCATION_LIST = ['.side', '.dry', '.box'];
  var BREAKER_LIST = ['.spare', '.wired', '.wall'];
  var CHAIN_LIST = ['.two', '.one'];
  var CONFIRMATION_LIST = ['.confirmationSuccess', '.confirmationError'];
  var ERRORTYPE_LIST = ['.ct', '.connectivity', '.voltage', '.multiple'];
  var ERRORLIGHT_LIST = ['.no-error-light','.ct-solid-red','.ct-blinking-red','.ct-blinking-white','.voltage-solid-red','.voltage-blinking-white','.voltage-solid-green','.voltage-blinking-green','.connectivity-solid-red','.connectivity-blinking-red','.connectivity-blinking-white'];
  var ERRORLIGHTSELECTOR_LIST = ['.error-light-selector'];
  var ERRORFIXSELECTOR_LIST = ['.error-fix','.fix-no'];

  var selectItem;

  var hideOrShowBySelector = function(selector, display) {
    [].forEach.call(document.querySelectorAll(selector), function(element) {
      if (display === "none") {
        element.classList.add('hidden');
      } else {
        element.classList.remove('hidden');
      }
    });
  };

  var hideBySelector = function(selector, display) {
    var display = display || 'none';
    hideOrShowBySelector(selector, display);
  };

  var showBySelector = function(selector, display) {
    var display = display || 'block';
    hideOrShowBySelector(selector, display);
  };

  // Splits array of classes into sublists for shown and hidden classes
  var splitArrayBySelection = function(array, selection) {
    var shown = [];
    var hidden = array.filter(function(e) {
      if (e === '.' + selections[selection]) {
        shown.push(e);
      } else {
        return true;
      }
    });
    console.log([shown, hidden])
    return [shown, hidden];
  };

  var classes = {
    'panels': [[], []],
    'wires': [[], []],
    'locations': [[], []],
    'breakers': [[], []],
    'chains': [[], []],
    'inlineBlocks': [[], []],
    'confirmation': [[], []],
    'errorType': [[], []],
    'error-light': [[], []],
    'error-light-selector': [[], []],
    'error-fix-selector': [[], []]
  };

  var updateClassVisibility = function(selection) {
    if (!selection || selection === "panel-type") {
      classes['inlineBlocks'] = [[], []];
      classes['panels'] = splitArrayBySelection(PANEL_LIST, "panel-type");
      if (selections["panel-type"] === "split") {
        classes['inlineBlocks'][1].push('.three-inline');
        classes['inlineBlocks'][0].push('.single-phase');
      } else if (selections["panel-type"] === "single"){
        classes['inlineBlocks'][1].push('.single-phase');
        classes['inlineBlocks'][1].push('.three-inline');
      } else {
        classes['inlineBlocks'][0].push('.three-inline');
        classes['inlineBlocks'][0].push('.single-phase');
      }
    }

    if (!selection || selection === "large-ct" || selection === "small-ct") {
      classes['wires'] = [[], []];
      
      var smallCT = (selections["small-ct"] === true || selections["small-ct"] === 'true')
      var largeCT = (selections["large-ct"] === true || selections["large-ct"] === 'true')
      
      console.log(smallCT)
      console.log(largeCT)

      if (!smallCT && !largeCT){
        console.log('e')
        //choose the opposite
        if(selection === "small-ct"){
          largeCT = !largeCT;
          selections["large-ct"] = true;
        }
        if(selection === "large-ct"){
          smallCT = !smallCT;
          selections["small-ct"] = true;
        }
      }

      if (smallCT && largeCT) {
        classes['wires'][0].push('.large');
        classes['wires'][0].push('.small');
        classes['wires'][1].push('.small-only');
        classes['wires'][1].push('.large-only');
      } else {
        if (smallCT) {
          classes['wires'][1].push('.large');
          classes['wires'][0].push('.small');
          classes['wires'][0].push('.small-only');
          classes['wires'][1].push('.large-only');
        }
        if (largeCT) {
          classes['wires'][0].push('.large');
          classes['wires'][1].push('.small');
          classes['wires'][1].push('.small-only');
          classes['wires'][0].push('.large-only');
        }
      }

      console.log(smallCT)
      console.log(largeCT)

      document.getElementById('small-ct').checked = smallCT
      document.getElementById('large-ct').checked = largeCT

      // if (selections["large-wires"]) {
      //   classes['wires'][0].push('.large');
      //   classes['wires'][1].push('.small-only');
      //   if (selections["large-only"] === "true") {
      //     classes['wires'][0].push('.large-only');
      //     classes['wires'][1].push('.small');
      //   } else {
      //     classes['wires'][1].push('.large-only');
      //     classes['wires'][0].push('.small');
      //   }
      // } else {
      //   classes['wires'][0].push('.small');
      //   classes['wires'][0].push('.small-only');
      //   classes['wires'][1].push('.large');
      //   classes['wires'][1].push('.large-only');
      // }
      // classes['wires'] = splitArrayBySelection(CTSIZE_LIST, "wires");
    }

    if (!selection || selection === "mounting-location") {
      classes['locations'] = splitArrayBySelection(LOCATION_LIST, "mounting-location");
      if (selections["mounting-location"] === "dry") {
        classes['locations'][1].push('.not-dry');
      } else {
        classes['locations'][0].push('.not-dry');
      }
    }
    if (!selection || selection === "breakers") {
      classes['breakers'] = splitArrayBySelection(BREAKER_LIST, "breakers");
    }
    if (!selection || selection === "chains") {
      classes['chains'] = splitArrayBySelection(CHAIN_LIST, "chains");
    }

    if (!selection || selection === "confirmation") {
      classes['confirmation'] = splitArrayBySelection(CONFIRMATION_LIST, "confirmation");
      if(selection){
        selections['error-light-selector'] = false;
        classes['error-light-selector'] = splitArrayBySelection(ERRORLIGHTSELECTOR_LIST, "error-light-selector");
      }
    }

    if (!selection || selection === "errorType") {
      classes['errorType'] = splitArrayBySelection(ERRORTYPE_LIST, "errorType");
      
      if (selection){
        if (document.getElementById(selections['error-light'])){
          document.getElementById(selections['error-light']).setAttribute('selected',false)
        }
        selections['error-light'] = 'no-error-light'
        classes['error-light'] = splitArrayBySelection(ERRORLIGHT_LIST, "error-light");
        
        if (selections['errorType'] != "multiple"){
          selections['error-light-selector'] = 'error-light-selector';
          selections['error-fix-selector'] = false;
        } else {
          selections['error-light-selector'] = false  
          selections['error-fix-selector'] = 'error-fix'  
        }

        classes['error-light-selector'] = splitArrayBySelection(ERRORLIGHTSELECTOR_LIST, "error-light-selector");
        classes['error-fix-selector'] = splitArrayBySelection(ERRORFIXSELECTOR_LIST, "error-fix-selector");
      }
      console.log(selections)
      
    }
    
    if (!selection || selection === "error-light") {
      classes['error-light-selector'] = splitArrayBySelection(ERRORLIGHTSELECTOR_LIST, "error-light-selector");
    }

    if (!selection || selection === "error-light") {
      classes['error-light'] = splitArrayBySelection(ERRORLIGHT_LIST, "error-light");

      if (selection){
        selections['error-fix-selector'] = 'error-fix'  
        classes['error-fix-selector'] = splitArrayBySelection(ERRORFIXSELECTOR_LIST, "error-fix-selector");
      }
    }

    if (!selection || selection === "error-fix-selector") {

      if (document.getElementById(selections['confirmation'])){
        document.getElementById(selections['confirmation']).setAttribute('selected',false)
      }

      if (selections['error-fix-selector'] === 'fix-yes'){
        selections['confirmation'] = false
        selections['errorType'] = false
        selections['error-light'] = 'no-error-light'
        selections['error-light-selector'] = false
        selections['error-fix-selector'] = false

        classes['confirmation'] = splitArrayBySelection(CONFIRMATION_LIST, "confirmation")
        classes['errorType'] = splitArrayBySelection(ERRORTYPE_LIST, "errorType")
        classes['error-light'] = splitArrayBySelection(ERRORLIGHT_LIST, "error-light")
        classes['error-light-selector'] = splitArrayBySelection(ERRORLIGHTSELECTOR_LIST, "error-light-selector")
      }

      classes['error-fix-selector'] = splitArrayBySelection(ERRORFIXSELECTOR_LIST, "error-fix-selector");
    }

  };

  var handleUpdates = function(updatedGroup) {
    updateClassVisibility(updatedGroup);

    // var checked_mapping = {
    //   '.large':'has-large-ct',
    //   '.small':'has-small-ct',
    //   '.small-only': 'has-small-ct',
    //   '.large-only':'has-large-ct'
    // }

console.log(selections)
    // Show and hide elements by class name
    // Show THEN hide in case of elements with multiple classes
    for (var className in classes) {
      if (classes[className][0].length) {
        if (className === 'inlineBlocks') {
          showBySelector(classes[className][0].join(", "), 'inline-block');
        } else {
          showBySelector(classes[className][0].join(", "));
        }
      }
    };
    for (var className in classes) {
      if (classes[className][1].length) {
        hideBySelector(classes[className][1].join(", "));
      }
    };

    // Dispatch event if panel type change to recolour SVGs
    switch (updatedGroup) {
      case "panel-type":

        if (selections["panel-type"] === "split") {
          document.dispatchEvent(SPLIT_PANEL);
        } 
        else if (selections["panel-type"] === "single"){
          document.dispatchEvent(SINGLE);
        }
        else {
          selectItem("panel-voltage", "277-480");
        }
        break;
      case "panel-voltage":
        if (selections["panel-voltage"] === "120-208") {
          document.dispatchEvent(THREE_PANEL_120);
        } else {
          document.dispatchEvent(THREE_PANEL_277);
        }
        break;
      case "mounting-location":
        break;
      default:
        document.dispatchEvent(UPDATE_SVG);
    }

    return classes; // for testing
  };

  var init = function() {
    return handleUpdates(); // for testing
  };

  var checkItem = function(groupId, checked, e) {
    
    console.log(groupId)
    console.log(checked)
    if (e) {
      e.stopPropagation();
    }
    checked = checked ? checked : document.getElementById(groupId).checked
    document.getElementById(groupId).checked = checked;
    selections[groupId] = checked;
    console.log('selections')
    console.log(selections)
    return handleUpdates(groupId); // for testing
  };

  selectItem = function(groupId, rowId, e) {
    if (e) {
      e.stopPropagation();
    }
    selections[groupId] = rowId;
    var groupElement = document.getElementById(groupId);
    if (groupElement) {
      [].forEach.call(groupElement.children, function(element) {
        element.setAttribute('selected', false);
      });
    }
    var rowElement = document.getElementById(rowId);
    if (rowElement) {
      rowElement.setAttribute('selected', true);
    }
    return handleUpdates(groupId); // for testing
  };

  return {
    init: init,
    checkItem: checkItem,
    selectItem: selectItem
  }
}) ();


var initSelect = function() {
  'use strict';
  selectModule.init();
};

if (document.readyState !== "loading") {
  initSelect();
} else {
  document.addEventListener("DOMContentLoaded", initSelect);
}
