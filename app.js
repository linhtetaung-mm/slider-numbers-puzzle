/*
	Slider Numbers Puzzle
	App: Brain Training - Logic Puzzles (not my app)
	My Name - Lin Htet Aung

	About Game: 5x5 frame, 25 numbers included, To arrange them successfully
				Movements - Right, Left, Up, Down (numbers in Row, Column will circulate)

	My Algorithm's Advantages => flexible, not overloading, Human-like plays
	God's Number 			  => 80 moves (just assuming);
	Disadvantages			  => In {function lastRow()} ,  one or two moves are reducible
								 And if you want to PLAY 6rows, 6cols or 7rows, 6cols, etc....
								 Need to fix that {function lastRow()}, that function is problematic
								 May be that problem is caused by me because I concentrated on solving 5x5
								 and thought it should be "OK" in 6x6 and 7x7 too, this program is thinking like myself. 

	Strong Point: still useful, perfectly executed in 5x5 games
*/

var rows = 5, cols = 5;
var steps_count = 0;
var initial_numbers = [
	[ 3 , 4 , 8 , 1 ,22 ],
	[ 9 , 7 ,13 ,12 ,17 ],
	[14 ,10 , 6 ,19 ,24 ],
	[18 ,15 ,11 ,16 , 2 ],
	[25 ,21 , 5 ,23 ,20 ]
];
var mirror_numbers = [
	[1 , 2 , 3 , 4 , 5 ],
	[6 , 7 , 8 , 9 , 10],
	[11, 12, 13, 14, 15],
	[16, 17, 18, 19, 20],
	[21, 22, 23, 24, 25]
];

var numbers = deepCopy(initial_numbers);
algorithm();
console.log('\nBefore>>>');
console.log(initial_numbers);
console.log('\nAfter>>>');
console.log(numbers);
console.log("Moves: "+ steps_count);

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

function moveRight(row_number, steps){
	//row_number => 0 to 4, steps < 3
	for(let i=0; i<steps; i++){
		let temp = numbers[row_number].pop();
		numbers[row_number].unshift(temp);
	}
	steps_count++;
	console.log('Row: '+row_number +", steps: "+ steps +'(R)');
}

function moveLeft(row_number, steps){
	//row_number => 0 to 4, steps < 3
	for(let i=0; i<steps; i++){
		let temp = numbers[row_number].shift();
		numbers[row_number].push(temp);
	}
	steps_count++;
	console.log('Row: '+row_number +", steps: "+ steps +'(L)');
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
	console.log('Column: '+col_number +", steps: "+ steps +'(Up)');
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
	console.log('Column: '+col_number +", steps: "+ steps +'(Dn)');
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
	for(let i =0; i<rows; i++){
		console.log("\nCurrent row: "+i);
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
}

function firstRow(x, y){
	var number = mirror_numbers[x][y];
	// console.log(number);
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
	// console.log("number: "+number+", xy: "+row+"."+col);
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
	//Find How many numbers are in wrong place
	for(let i=0; i<cols; i++){
		if(numbers[x][i] != mirror_numbers[x][i])
			count++;
	}

	//Then loop that count(Fixing) --- problematic
	for(let i=0; i<count; i++){
		if(i > 0){
			//To avoid worst case - where all the priority are equal standing
			//After one time move down, this one will cause trouble(in worst case)
			var fix = priorityCheck(numbers[x], x);
			actionCentre('row', x, fix);
		}
		else{
			//One Time Move Down
			moveDown(y, 1);
		}

		//Two possible moves
		if(i%2 == 0){
			//Stage 1 - After movedown, an element of last row will be on first-row
			//Then move last-row directly under that element and moveup(takes place)
			var number = numbers[0][y];
			var place = mirror_numbers[x].indexOf(number);

			if(!mirror_numbers[x].includes(number)){
				//This is the problem caused by worst case
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
			//Stage 2 - The number will be on secondlast-row
			//Then move last-row directly under that number and movedown(takes place)
			var number = numbers[x-1][y];
			var place = mirror_numbers[x].indexOf(number);
			if(place > y)
				actionCentre('row', x, cols - place + y);
			moveDown(y, 1);
		}
	}

	//Final Touch
	var fix = priorityCheck(numbers[x], x);
	actionCentre('row', x, fix);
}

//Worst Case is when we successfully arrange all rows except last row, and that last row is [25, 24, 23, 22, 21]
//where the prioritycheck function and movedown function meets then it will move again without noticing.

