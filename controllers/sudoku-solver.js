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
    let solvedString = puzzleString;
    let possibleNums = {};
    
    puzzleString.split('').forEach((num, i) => {
        if(num === '.') possibleNums[i] = ['1','2','3','4','5','6','7','8','9'];
      });

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
            console.log("found num: "+possibleNums[i][0]+" at index: "+i);
            solvedString = solvedString.substring(0, i) + possibleNums[i][0] + solvedString.substring(parseInt(i)+1);
            delete possibleNums[i];
          }
      });

      Object.keys(possibleNums).forEach((i) => {

      });
    }

    console.log(solvedString);
    return solvedString;
  }
}

module.exports = SudokuSolver;

