class SudokuSolver {

  //Validates puzzle string has 81 characters and all are digits or '.'
  validate(puzzleString) {
    let has81Chars = puzzleString.length() === 81;
    let validChars = puzzleString.test(/^[1-9.]*$/);

    return has81Chars && validChars;
  }

  //Checks if value at location is unique in row
  checkRowPlacement(puzzleString, row, column, value) {
    let r = puzzleString.slice(row*9, row*9 + 9);

    return !r.includes(value);
  }

  //Checks if value at location is unique in column
  checkColPlacement(puzzleString, row, column, value) {
    let c = puzzleString
              .split('')
              .filter((v, i) => i % 9 === column)
              .join('');
    
    return !c.includes(value);
  }

  //Checks if value at location is unique in region
  checkRegionPlacement(puzzleString, row, column, value) {
    let valueRegion = Math.floor(row/3)*3 + Math.floor(column/3);
    
    let region = puzzleString
                  .split('')
                  .filter((v, i) => {
                    let r = Math.floor(i/9);
                    let c = i%9;
                    return Math.floor(r/3)*3 + Math.floor(c/3) === valueRegion;
                  })
                  .join('');

    return !region.includes(value);
  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

