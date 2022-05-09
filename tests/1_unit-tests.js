const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

const PuzzleSolutions = require('../controllers/puzzle-strings.js');
let puzzleSolutions = PuzzleSolutions.puzzlesAndSolutions;

suite('UnitTests', () => {
  const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  const invalidPuzzle = '125452.84.163.12.7....5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const badCharPuzzle = 'alsiekdiwodkflwieskdoqkdifieoakfksla;aowrkflsjfskdowkelfa;sofiwekfjsidof;alsifaia';
  const not81Puzzle = '123456789';
  const incompletePuzzle = '1................................................................................';

  test('Logic handles a puzzle string of 81 characters', function(){
    assert.isObject(solver.validate(validPuzzle), 'validate should return an object');
    assert.deepEqual(solver.validate(validPuzzle), {}, 'validate return object should be empty');
    assert.notProperty(solver.validate(validPuzzle), 'error', 'validate return object should not have an error property');
  });
  
  test('Logic handles a puzzle string with invalid characters (not 1-9 or "."', function(){
    assert.isObject(solver.validate(badCharPuzzle));
    assert.property(solver.validate(badCharPuzzle), 'error', 'return object should contain error property');
    assert.propertyVal(solver.validate(badCharPuzzle), 'error', 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function(){
    assert.isObject(solver.validate(not81Puzzle));
    assert.property(solver.validate(not81Puzzle), 'error', 'return object should contain error property');
    assert.propertyVal(solver.validate(not81Puzzle), 'error', 'Expected puzzle to be 81 characters long');
  });
  
  test('Logic handles a valid row placement', function(){
    assert.isBoolean(solver.checkRowPlacement(validPuzzle, 6, 3, 2), 'check row placement should return a boolean');
    assert.equal(solver.checkRowPlacement(validPuzzle, 6, 3, 2), true, 'valid check row placement should return true');
  });

  test('Logic handles an  invalid row placement', function(){
    assert.isBoolean(solver.checkRowPlacement(validPuzzle, 0, 6, 1), 'check row placement should return a boolean');
    assert.equal(solver.checkRowPlacement(validPuzzle, 0, 6, 1), false, 'invalid check row placement should return false');
  });

  test('Logic handles a valid column placement', function(){
    assert.isBoolean(solver.checkColPlacement(validPuzzle, 6, 3, 2), 'check column placement should return a boolean');
    assert.equal(solver.checkColPlacement(validPuzzle, 6, 3, 2), true, 'valid check column placement should return true');
  });

  test('Logic handles an invalid column placement', function(){
    assert.isBoolean(solver.checkColPlacement(validPuzzle, 1, 0, 1), 'check column placement should return a boolean');
    assert.equal(solver.checkColPlacement(validPuzzle, 1, 0, 1), false, 'invalid check column placement should return false');
  });

  test('Logic handles a valid region (3x3) placement', function(){
    assert.isBoolean(solver.checkRegionPlacement(validPuzzle, 6, 3, 2), 'check region placement should return a boolean');
    assert.equal(solver.checkRegionPlacement(validPuzzle, 6, 3, 2), true, 'valid check region placement should return true');
  });

  test('Logic handles an invalid region (3x3) placement', function(){
    assert.isBoolean(solver.checkRegionPlacement(validPuzzle, 1, 0, 1), 'check region placement should return a boolean');
    assert.equal(solver.checkRegionPlacement(validPuzzle, 1, 0, 1), false, 'invalid check region placement should return false');
  });

  test('Valid puzzle strings pass the solver', function(){
    assert.isObject(solver.solve(validPuzzle), 'valid solve puzzle should return an object');
    assert.property(solver.solve(validPuzzle), 'solution', 'valid solve puzzle should have a solution property');
    assert.notProperty(solver.solve(validPuzzle), 'error', 'valid solve puzzle should not have an error property');
    assert.equal(solver.solve(validPuzzle).solution, validSolution, 'valid solve puzzle should return valid solution')
  });

  test('Invalid puzzle strings fail the solver', function(){
    assert.isObject(solver.solve(invalidPuzzle), 'invalid solve puzzle should return an object');
    assert.property(solver.solve(invalidPuzzle), 'error', 'invalid solve puzzle should have an error property');
    assert.notProperty(solver.solve(invalidPuzzle), 'solution', 'invalid solve puzzle should not have a solution property');
    assert.equal(solver.solve(invalidPuzzle).error, 'Puzzle cannot be solved', 'invalid solve puzzle should return "Puzzle cannot be solved"');
  });

  test('Solver returns the expected solution for an incomplete puzzle', function(){
    assert.isObject(solver.solve(incompletePuzzle), 'incomplete puzzle solve puzzle should return an object');
    assert.property(solver.solve(incompletePuzzle), 'error', 'incomplete puzzle solve puzzle should have an error property');
    assert.notProperty(solver.solve(incompletePuzzle), 'solution', 'incomplete puzzle solve puzzle should not have a solution property');
    assert.equal(solver.solve(incompletePuzzle).error, 'Puzzle cannot be solved', 'incomplete puzzle solve puzzle should return "Puzzle cannot be solved"');
  });

});
