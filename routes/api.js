'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //Validate inputs exist and puzzle integrity
      if(!req.body.puzzle || !req.body.coordinate || !req.body.value){
        return res.json({error: 'Required field(s) missing'});
      }

      let puzzleValidation = solver.validate(req.body.puzzle);
      if (puzzleValidation.error){
        return res.json(puzzleValidation);
      }

      //Validate coordinate input
      let correctLength = req.body.coordinate.length === 2;
      let correctRow = /[a-iA-I]/.test(req.body.coordinate[0]);
      let correctCol = /[1-9]/.test(req.body.coordinate[1]);

      if(!correctLength || !correctRow || !correctCol){
        return res.json({error: 'Invalid coordinate'})
      }

      //Validate value input
      let correctValue = req.body.value.length === 1 && /[1-9]/.test(req.body.value);

      if(!correctValue){
        return res.json({error: 'Invalid value'});
      }

      //Check row, column and region for inputted data
      //First, convert row and column to range 0-8 for correct checking inputs
      let row = req.body.coordinate[0].toLowerCase().charCodeAt(0)-97;
      let column = req.body.coordinate[1]-1;
      let value = req.body.value;

      let rowValid = solver.checkRowPlacement(req.body.puzzle, row, column, value);
      let colValid = solver.checkColPlacement(req.body.puzzle, row, column, value);
      let regionValid = solver.checkRegionPlacement(req.body.puzzle, row, column, value);

      let resObj = {valid: true, conflict: []};

      if(!rowValid || !colValid || !regionValid){
        resObj.valid = false;
        if(!rowValid) resObj.conflict.push('row');
        if(!colValid) resObj.conflict.push('column');
        if(!regionValid) resObj.conflict.push('region');
      } 
    
      res.json(resObj);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let solved = solver.solve(puzzle);

      res.json(solved);
    });
};
