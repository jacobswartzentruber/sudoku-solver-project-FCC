class SudokuSolver {

  //Validates puzzle string has 81 characters and all are digits or '.'
  validate(puzzleString) {
    let has81Chars = puzzleString.length === 81;
    let validChars = /^[1-9.]*$/.test(puzzleString);

    if(!validChars) return {error: 'Invalid characters in puzzle'};
    if(!has81Chars) return {error: 'Expected puzzle to be 81 characters long'};

    return {};
  }

  //Checks if value at location is unique in row
  //Does not check square at specified input location
  //Row and Column should be input from 0-8
  checkRowPlacement(puzzleString, row, column, value) {
    let r = puzzleString.slice(row*9, row*9 + 9);

    r = r.slice(0,column) + r.slice(column+1);

    return !r.includes(value);
  }

  //Checks if value at location is unique in column
  //Does not check square at specified input location
  //Row and Column should be input from 0-8
  checkColPlacement(puzzleString, row, column, value) {
    let c = puzzleString
              .split('')
              .filter((v, i) => i % 9 === column)
              .join('');

    c = c.slice(0,row) + c.slice(row+1);
    
    return !c.includes(value);
  }

  //Checks if value at location is unique in region
  //Does not check square at specified input location
  //Row and Column should be input from 0-8
  checkRegionPlacement(puzzleString, row, column, value) {
    let valueRegion = Math.floor(row/3)*3 + Math.floor(column/3);
    
    let region = puzzleString
                  .split('')
                  .filter((v, i) => {
                    let r = Math.floor(i/9);
                    let c = i%9;
                    if(r === row && c === column) return false;
                    return Math.floor(r/3)*3 + Math.floor(c/3) === valueRegion;
                  })
                  .join('');

    return !region.includes(value);
  }

  //Solves and returns completed puzzle string from incomplete puzzle string
  solve(puzzleString) {
    let solvedString = puzzleString;
    let possibleNums = {};

    //Check input for quick validations: missing field, incorrect chars, incorrect number of chars
    if(!puzzleString) return {error: 'Required field missing'};

    let puzzleValidation = this.validate(puzzleString);
    if (puzzleValidation.error) return puzzleValidation;
    
    //Populate possible number array and validate input to confirm no collisions
    let inputCollisions = false;

    puzzleString.split('').forEach((num, i) => {
      if(num === '.'){
        possibleNums[i] = ['1','2','3','4','5','6','7','8','9'];
      }else{
        let r = Math.floor(i/9);
        let c = i%9;
        let rowFree = this.checkRowPlacement(puzzleString, r, c, num);
        let colFree = this.checkColPlacement(puzzleString, r, c, num);
        let regionFree = this.checkRegionPlacement(puzzleString, r, c, num);

        if(!rowFree || !colFree || !regionFree) inputCollisions = true;
      }
    });

    if(inputCollisions) return {error: 'Puzzle cannot be solved'};
    
    //Start cycling through possibleNums array to rule out copied numbers
    let madeChange = true;

    while(madeChange){
      madeChange = false;

      Object.keys(possibleNums).forEach((i) => {
          let r = Math.floor(i/9);
          let c = i%9;

          for(let j=0; j < possibleNums[i].length; j++){
            let num = possibleNums[i][j];
            let rowFree = this.checkRowPlacement(solvedString, r, c, num);
            let colFree = this.checkColPlacement(solvedString, r, c, num);
            let regionFree = this.checkRegionPlacement(solvedString, r, c, num);

            if(!rowFree || !colFree || !regionFree){
              madeChange = true;
              possibleNums[i].splice(j, 1);
            }
          };

          if(possibleNums[i].length === 1){
            solvedString = solvedString.substring(0, i) + possibleNums[i][0] + solvedString.substring(parseInt(i)+1);
            delete possibleNums[i];
          }
      });
    }

    if(solvedString.includes('.')) return {error: 'Puzzle cannot be solved'};

    return {solution: solvedString};
  }
}

module.exports = SudokuSolver;

