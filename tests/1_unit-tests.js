const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('UnitTests', () => {
  test("testing", function(){
    solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
  })
});
