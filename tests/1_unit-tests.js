const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

const PuzzleSolutions = require('../controllers/puzzle-strings.js');
let puzzleSolutions = PuzzleSolutions.puzzlesAndSolutions;

suite('UnitTests', () => {
  test("Test solve function against sample puzzle strings", function(){
    puzzleSolutions.forEach(puzzle => {
      assert.equal(solver.solve(puzzle[0]).solution, puzzle[1], 'solved puzzle does not match expected solved string')
    });
  });
});
