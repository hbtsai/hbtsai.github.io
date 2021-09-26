---
---
var colorPickerModule = (function() {
  'use strict';
  var colorArray = {{ site.data.colors | jsonify }};
  var cableArray = {{ site.data.state.cables | jsonify }};
  var selectedCable = cableArray[0].name;
  var selectedPanel = "{{ site.data.state.panelType }}";

  // Convert color array to single object
  var colorsByValue = colorArray.reduce(function (o, color) {
    var key = color.value;
    var value = color.name;
    o[key] = value;
    return o;
  }, {});

  // Convert color array to single object
  var colorsByName = colorArray.reduce(function (o, color) {
    var key = color.name;
    var value = color.value;
    o[key] = value;
    return o;
  }, {});

  // Convert cable array to single object
  var cables = cableArray.reduce(function (o, cable) {
    var key = cable.name;
    var value = colorsByName[cable.color];
    o[key] = value;
    return o;
  }, {});

  var updateSvgColor = function(color, cable, element) {
    var elements = element ? [element] : Array.prototype.slice.call(document.querySelectorAll('object[type="image/svg+xml"]'));
    if (!element) {
      [].forEach.call(document.querySelectorAll('.interactive iframe'), function(iframe) {
        var iframeDoc = iframe.contentDocument;
        if (iframeDoc) {
          var svgs = iframeDoc.querySelectorAll('object[type="image/svg+xml"]');
          if (svgs.length) {
            elements = elements.concat(Array.prototype.slice.call(svgs));
          }
        }
      });
    }
    elements.forEach(function(svgObject) {
      var svgDoc = svgObject.contentDocument;
      if(svgDoc) {
        svgDoc.querySelectorAll('[class="cable ' + cable + ' stroke"]').forEach(function(svgPath) {
          svgPath.setAttribute("stroke", color);
        });
        svgDoc.querySelectorAll('[class="cable ' + cable + ' fill"]').forEach(function(svgPath) {
          svgPath.setAttribute("fill", color);
        });
      }
    });
  };

  var updateSelectedCableColor = function(newSelection, oldSelection) {
    var oldElement = document.getElementById(oldSelection);
    if (oldElement) {
      oldElement.setAttribute('selected', false);
    }
    var newElement = document.getElementById(newSelection);
    if (newElement) {
      newElement.setAttribute('selected', true);
    }
  };

  var updateColor = function(newColor) {
    updateSvgColor(newColor, selectedCable);
    // Make cable C match cable A for split panels (for animation)
    if (selectedCable === "A" && selectedPanel === "split") {
      updateSvgColor(newColor, "C");
    }
    // Update cable color and highlighted color
    updateSelectedCableColor(colorsByValue[newColor], colorsByValue[cables[selectedCable]]);
    var colorElement = document.getElementById(selectedCable);
    if (colorElement) {
      colorElement.style.backgroundColor = newColor;
      if (newColor === "#FFF") {
        colorElement.classList.add('white');
      } else {
        colorElement.classList.remove('white');
      }
    }
    // Update copy for neutral cable
    if (selectedCable === "N") {
      var neutralElement = document.getElementById('neutral');
      if (neutralElement) {
        neutralElement.textContent = colorsByValue[newColor].toLowerCase();
      }
    }
    cables[selectedCable] = newColor;
    return cables; // for testing
  };

  var updateIFrameSvgColors = function(event) {
    for (var name in cables) {
      if(cables.hasOwnProperty(name)) {
        updateSvgColor(cables[name], name);
      }
    }
  };

  var updateSvgColors = function(event) {
    for (var name in cables) {
      if(cables.hasOwnProperty(name)) {
        updateSvgColor(cables[name], name, event.target);
      }
    }
  };

  var changeSelectedCable = function(newSelection) {
    // Update selected cable and highlighted color
    updateSelectedCableColor(newSelection, selectedCable);
    updateSelectedCableColor(colorsByValue[cables[newSelection]], colorsByValue[cables[selectedCable]]);
    selectedCable = newSelection;
    return selectedCable; // for testing
  };

  var addSvgListeners = function(event) {
    var element = event ? event.target.contentDocument : document;
    if (element) {
      element.querySelectorAll('object[type="image/svg+xml"]').forEach(function(svgObject) {
        svgObject.addEventListener('load', updateSvgColors);
      });
    }
  };

  var reset = function(object) {
    for (var key in object) {
      if(object.hasOwnProperty(key)) {
        changeSelectedCable(key);
        updateColor(colorsByName[object[key]]);
      }
    }
  };

  // Reset colors for 3-phase panel, 120/208V
  var resetThree120 = function() {
    selectedPanel = "three";
    var resets = {
      N: "White",
      C: "Blue",
      B: "Red",
      A: "Black"
    };
    reset(resets);
    return [resets, cables, selectedPanel]; // for testing
  };

  // Reset colors for 3-phase panel, 277/480V
  var resetThree277 = function() {
    selectedPanel = "three";
    var resets = {
      N: "White",
      C: "Yellow",
      B: "Orange",
      A: "Brown"
    };
    reset(resets);
    return [resets, cables, selectedPanel]; // for testing
  };

  // Reset colors for split panel
  var resetSplit = function() {
    selectedPanel = "split";
    var resets = {
      N: "White",
      C: "Black",
      B: "Red",
      A: "Black"
    };
    reset(resets);
    return [resets, cables, selectedPanel]; // for testing
  };

  // Reset colors for single phase
  var resetSingle = function() {
    selectedPanel = "split";
    var resets = {
      N: "White",
      C: "Black",
      B: "Red",
      A: "Black"
    };
    reset(resets);
    return [resets, cables, selectedPanel]; // for testing
  };

  return {
    addSvgListeners: addSvgListeners,
    resetThree120: resetThree120,
    resetThree277: resetThree277,
    resetSplit: resetSplit,
    resetSingle: resetSingle,
    changeSelectedCable: changeSelectedCable,
    updateColor: updateColor,
    updateIframeSvgColors: updateIFrameSvgColors
  };
}) ();

var initColorPicker = function() {
  'use strict';
  colorPickerModule.addSvgListeners();
  document.querySelectorAll('.interactive iframe').forEach(function(iframe) {
    iframe.addEventListener('load', colorPickerModule.updateIframeSvgColors);
  });
  colorPickerModule.resetThree277();
};

if (document.readyState !== "loading") {
  initColorPicker();
} else {
  document.addEventListener("DOMContentLoaded", initColorPicker);
}

document.addEventListener("three-panel-120", colorPickerModule.resetThree120);
document.addEventListener("three-panel-277", colorPickerModule.resetThree277);
document.addEventListener("split-panel", colorPickerModule.resetSplit);
document.addEventListener("single", colorPickerModule.resetSplit);
document.addEventListener("update-svg", colorPickerModule.addSvgListeners);
