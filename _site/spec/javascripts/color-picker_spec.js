describe('The color picker module', function() {
  it('should be an object', function() {
    expect(typeof colorPickerModule).toEqual("object");
  });

  it('should use the correct reset values for resetThree120', function() {
    var expectedResets = {
      N: "White",
      C: "Blue",
      B: "Red",
      A: "Black"
    };
    var expectedCables = {
      N: "#FFF",
      C: "#0000FF",
      B: "#D0021B",
      A: "#4A4A4A"
    };
    var expectedPanel = 'three';
    var results = colorPickerModule.resetThree120();
    expect(results[0]).toEqual(expectedResets);
    expect(results[1]).toEqual(expectedCables);
    expect(results[2]).toEqual(expectedPanel);
  });

  it('should use the correct reset values for resetThree277', function() {
    var expectedResets = {
      N: "White",
      C: "Yellow",
      B: "Orange",
      A: "Brown"
    };
    var expectedCables = {
      N: "#FFF",
      C: "#F8E71C",
      B: "#F5A623",
      A: "#B47239"
    };
    var expectedPanel = 'three';
    var results = colorPickerModule.resetThree277();
    expect(results[0]).toEqual(expectedResets);
    expect(results[1]).toEqual(expectedCables);
    expect(results[2]).toEqual(expectedPanel);
  });

  it('should use the correct reset values for resetSplit', function() {
    var expectedResets = {
      N: "White",
      C: "Black",
      B: "Red",
      A: "Black"
    };
    var expectedCables = {
      N: "#FFF",
      C: "#4A4A4A",
      B: "#D0021B",
      A: "#4A4A4A"
    };
    var expectedPanel = 'split';
    var results = colorPickerModule.resetSplit();
    expect(results[0]).toEqual(expectedResets);
    expect(results[1]).toEqual(expectedCables);
    expect(results[2]).toEqual(expectedPanel);
  });

  it('should set selectedCable correctly for changeSelectedCable', function() {
    var expectedCable = 'C';
    var cable = colorPickerModule.changeSelectedCable('C');
    expect(cable).toEqual(expectedCable);
  });

  it('should update the color for the selected cable for updateColor', function() {
    var expectedCables = {
      N: "#FFF",
      C: "#FFF",
      B: "#D0021B",
      A: "#4A4A4A"
    };
    var cables = colorPickerModule.updateColor('#FFF');
    expect(cables).toEqual(expectedCables);
  });
});
