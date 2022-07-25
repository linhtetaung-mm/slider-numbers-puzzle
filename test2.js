var rows = 7, cols = 7, MAX = 1000;
var test_count = 0, steps_count = 0, total_steps_count = 0;
var minimum = 1000, maximum = 0;
var numbers;
var mirror_numbers = [
	[1, 2, 3, 4, 5, 30, 100],
	[6, 7, 8, 9, 10, 29, 101],
	[11, 12, 13, 14, 15, 28, 102],
	[16, 17, 18, 19, 20, 27, 103],
	[21, 22, 23, 24, 25, 26, 104],
	[31, 32, 33, 34, 35, 36, 105],
	[106, 107, 108, 109, 110, 111, 112],
];

var min_move = 15;
for(let i=min_move; i<MAX+min_move; i++){
	numbers = deepCopy(mirror_numbers);
	for(let j=0; j<i; j++){
		if(getRandomInt(2)%2 == 1)
			var first = 'row';
		else
			var first = 'column';
		var second = getRandomInt(7) - 1;
		var third = getRandomInt(7);
		actionCentre(first, second, third);
	}
	algorithm();
	if(testing(i))
		test_count++;
	// else
	// 	console.log(numbers);
}

console.log("rows: "+rows+", columns: "+cols);
console.log("test count(result): "+test_count+" of "+ MAX);
console.log("Total steps count: "+ total_steps_count);
console.log("Min: "+minimum+", Max: "+ maximum);
// console.log(numbers);

function testing(test){
	for(let i=0; i<rows; i++)
		for(let j=0; j<cols; j++)
			if(numbers[i][j] != mirror_numbers[i][j])
				return false;
	return true;
}

function deepCopy(arr){
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem))
      copy.push(deepCopy(elem));
    else
        copy.push(elem);
  });
  return copy;
}

function getRandomInt(max) {
  	var value = Math.ceil(Math.random() * max);
  	return value;
}

function moveRight(row_number, steps){
	//row_number => 0 to 4, steps < 3
	for(let i=0; i<steps; i++){
		let temp = numbers[row_number].pop();
		numbers[row_number].unshift(temp);
	}
	steps_count++;
}

function moveLeft(row_number, steps){
	//row_number => 0 to 4, steps < 3
	for(let i=0; i<steps; i++){
		let temp = numbers[row_number].shift();
		numbers[row_number].push(temp);
	}
	steps_count++;
}

function moveUp(col_number, steps){
	//col_number => 0 to 4, steps < 3
	for(let i=0; i<steps; i++){
		let temp = numbers[0][col_number];
		for(let j=0; j<rows-1; j++)
			numbers[j].splice(col_number, 1, numbers[j+1][col_number]);
		numbers[rows-1].splice(col_number, 1, temp);
	}
	steps_count++;
}

function moveDown(col_number, steps){
	//col_number => 0 to 4, steps < 3
	for(let i=0; i<steps; i++){
		let temp = numbers[rows-1][col_number];
		for(let j=rows-1; j>0; j--)
			numbers[j].splice(col_number, 1, numbers[j-1][col_number]);
		numbers[0].splice(col_number, 1, temp);
	}
	steps_count++;
}

function priorityCheck(arr, row_number){
	var priority = new Array(cols).fill(0); //Array displaying priority 
	//rotate one round
	for(let i=0; i<cols; i++){
		let temp = arr.pop();
		arr.unshift(temp);
		for(let j=0; j<cols; j++){
			if(arr[j] == mirror_numbers[row_number][j])
				priority[i]++;
		}
	}

	//Highest Priority
	return priority.indexOf(Math.max(...priority)) + 1;
}

function actionCentre(rc, number, steps) {

	if(rc === 'row'){
		if(steps != cols){
			const right = Math.floor(cols/2);
			if(steps <= right){
				moveRight(number, steps);
			}
			else{
				moveLeft(number, cols - steps);
			}
		}
	}
	else{
		if(steps != rows){
			const up = Math.floor(rows/2);
			if(steps <= up){
				moveUp(number, steps);
			}
			else{
				moveDown(number, rows - steps);
			}
		}
	}
}

function findRow(n, start){
	for(let i=start; i<rows; i++){
		if(numbers[i].includes(n))
			return i;
	}
}

function algorithm(){
	steps_count = 0;
	for(let i =0; i<rows; i++){
		var fix = priorityCheck(numbers[i], i);
		actionCentre("row", i, fix);
		for(let j=0; j<cols; j++){
			if(numbers[i][j] != mirror_numbers[i][j]){
				if(i == 0){
					firstRow(i, j);
				}
				else if(i == cols-1){
					lastRow(i, j);
					break;
				}
				else{
					middleRows(i, j);
				}
			}
		}
	}
	if(steps_count > maximum)
		maximum = steps_count;
	else if(steps_count < minimum)
		minimum = steps_count;

	total_steps_count += steps_count;
}

function firstRow(x, y){
	var number = mirror_numbers[x][y];
	var row = findRow(number, x);
	var col = numbers[row].indexOf(number);
	if(row == 0){
		moveDown(col, 1);
		row++;
	}
	if(y<col){
		actionCentre('row', row, cols - col + y);// cols -(col-y)
	}
	else if(y>col){
		actionCentre('row', row, y - col);
	}
	actionCentre('column', y, row);
}

function middleRows(x, y){
	var number = mirror_numbers[x][y];
	var row = findRow(number, x);
	var col = numbers[row].indexOf(number);
	if(row == x){
		moveDown(col, 1);
		moveDown(y, 1);
		row++;
		if(y<col){
			actionCentre('row', row, cols - col + y);// cols -(col-y)
		}
		else if(y>col){
			actionCentre('row', row, y - col);
		}
		moveUp(y, 1);
		moveUp(col, 1);
	}
	else{
		if(col == y){
			if(col != cols-1){
				moveRight(row, 1);
				col++;
			}
			else{
				moveLeft(row, 1);
				col--;
			}
		}
		var row_dif = row - x;
		actionCentre('column', y, rows - row_dif);
		if(y<col){
			actionCentre('row', row, cols - col + y);// cols -(col-y)
		}
		else if(y>col){
			actionCentre('row', row, y - col);
		}
		actionCentre('column', y, row_dif);
	}
}

function lastRow(x, y){
	var count = 0;
	for(let i=0; i<cols; i++){
		if(numbers[x][i] != mirror_numbers[x][i])
			count++;
	}

	for(let i=0; i<count; i++){

		if(i > 0){
			var fix = priorityCheck(numbers[x], x);
			actionCentre('row', x, fix);
		}
		else{
			moveDown(y, 1);
		}

		if(i%2 == 0){//Look first row
			var number = numbers[0][y];
			var place = mirror_numbers[x].indexOf(number);

			if(!mirror_numbers[x].includes(number)){
				count++;
				for(let k=0; k<cols; k++){
					if(numbers[x][k] != mirror_numbers[x][k]){
						actionCentre('row', x, cols - k + y);
						break;
					}
				}
			}

			if(place>y)
				actionCentre("row", x, cols - place + y);
			moveUp(y, 1);
		}
		else{
			var number = numbers[x-1][y];
			var place = mirror_numbers[x].indexOf(number);
			if(place > y)
				actionCentre('row', x, cols - place + y);
			moveDown(y, 1);
		}
	}

	var fix = priorityCheck(numbers[x], x);
	actionCentre('row', x, fix);
}

