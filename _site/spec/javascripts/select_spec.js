describe('The select module', function() {
  it('should be an object', function() {
    expect(typeof selectModule).toEqual("object");
  });

  it('should initialize correctly', function() {
    var expectedClasses = {
      'panels': [['.three'], ['.split']],
      'wires': [['.small', '.small-only'], ['.large', '.large-only']],
      'locations': [['.side', '.not-dry'], ['.dry', '.box']],
      'breakers': [['.spare'], ['.wired']],
      'chains': [['.two'], ['.one']],
      'inlineBlocks': [['.three-inline'], []]
    };
    var classes = selectModule.init();
    expect(classes).toEqual(expectedClasses);
  });

  it('should handle selectItem(panel-type, three) correctly', function() {
    var expectedPanels = [['.three'], ['.split']];
    var expectedInlineBlocks = [['.three-inline'], []];
    var classes = selectModule.selectItem('panel-type', 'three');
    expect(classes['panels']).toEqual(expectedPanels);
    expect(classes['inlineBlocks']).toEqual(expectedInlineBlocks);
  });

  it('should handle selectItem(panel-type, split) correctly', function() {
    var expectedPanels = [['.split'], ['.three']];
    var expectedInlineBlocks = [[], ['.three-inline']];
    var classes = selectModule.selectItem('panel-type', 'split');
    expect(classes['panels']).toEqual(expectedPanels);
    expect(classes['inlineBlocks']).toEqual(expectedInlineBlocks);
  });

  it('should throw an event from selectItem(panel-voltage, 277-480)', function() {
    var eventSpy277 = jasmine.createSpy();
    document.addEventListener('three-panel-277', eventSpy277);
    selectModule.selectItem('panel-voltage', '277-480');
    expect(eventSpy277).toHaveBeenCalled();
  });

  it('should throw an event from selectItem(panel-voltage, 120-208)', function() {
    var eventSpy120 = jasmine.createSpy();
    document.addEventListener('three-panel-120', eventSpy120);
    selectModule.selectItem('panel-voltage', '120-208');
    expect(eventSpy120).toHaveBeenCalled();
  });

  it('should handle checkItem(large-wires, false) correctly', function() {
    var expectedWires = [['.small', '.small-only'], ['.large', '.large-only']];
    var classes = selectModule.selectItem('large-wires', false);
    expect(classes['wires']).toEqual(expectedWires);
  });

  it('should handle selectItem(large-only, false) correctly', function() {
    var expectedWires = [['.small', '.small-only'], ['.large', '.large-only']];
    var classes = selectModule.selectItem('large-only', 'false');
    expect(classes['wires']).toEqual(expectedWires);
  });

  it('should handle checkItem(large-wires, true) correctly', function() {
    var expectedWires = [['.large', '.small'], ['.small-only', '.large-only']];
    var classes = selectModule.selectItem('large-wires', true);
    expect(classes['wires']).toEqual(expectedWires);
  });

  it('should handle selectItem(large-only, true) correctly', function() {
    var expectedWires = [['.large', '.large-only'], ['.small-only', '.small']];
    var classes = selectModule.selectItem('large-only', 'true');
    expect(classes['wires']).toEqual(expectedWires);
  });

  it('should handle selectItem(mounting-location, side) correctly', function() {
    var expectedLocations = [['.side', '.not-dry'], ['.dry', '.box']];
    var classes = selectModule.selectItem('mounting-location', 'side');
    expect(classes['locations']).toEqual(expectedLocations);
  });

  it('should handle selectItem(mounting-location, dry) correctly', function() {
    var expectedLocations = [['.dry'], ['.side', '.box', '.not-dry']];
    var classes = selectModule.selectItem('mounting-location', 'dry');
    expect(classes['locations']).toEqual(expectedLocations);
  });

  it('should handle selectItem(mounting-location, box) correctly', function() {
    var expectedLocations = [['.box', '.not-dry'], ['.side', '.dry']];
    var classes = selectModule.selectItem('mounting-location', 'box');
    expect(classes['locations']).toEqual(expectedLocations);
  });

  it('should handle selectItem(breakers, spare) correctly', function() {
    var expectedBreakers = [['.spare'], ['.wired']];
    var classes = selectModule.selectItem('breakers', 'spare');
    expect(classes['breakers']).toEqual(expectedBreakers);
  });

  it('should handle selectItem(breakers, wired) correctly', function() {
    var expectedBreakers = [['.wired'], ['.spare']];
    var classes = selectModule.selectItem('breakers', 'wired');
    expect(classes['breakers']).toEqual(expectedBreakers);
  });

  it('should handle selectItem(chains, two) correctly', function() {
    var expectedChains = [['.two'], ['.one']];
    var classes = selectModule.selectItem('chains', 'two');
    expect(classes['chains']).toEqual(expectedChains);
  });

  it('should handle selectItem(chains, one) correctly', function() {
    var expectedChains = [['.one'], ['.two']];
    var classes = selectModule.selectItem('chains', 'one');
    expect(classes['chains']).toEqual(expectedChains);
  });
});
