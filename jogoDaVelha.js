const ui = {
	statusElement: document.getElementById('status'),

	boardElement: document.getElementById('board'),

	scorePlayer: document.getElementById('score-player'),
	scoreTies: document.getElementById('score-ties'),
	scoreCpu: document.getElementById('score-cpu'),

	resetBtn: document.getElementById('reset-btn'),
	clearScoresBtn: document.getElementById('clear-scores-btn'),
	setFunction(){
		this.resetBtn.addEventListener("click", () => {
		cellManager.initBoard();
		boardState.boardArray =[0, 0, 0, 0, 0, 0, 0, 0, 0];
	});
	// é provisorio lol
	},
};

const scoreManager = {
	values: {
		player: 0,
		tie: 0,
		cpu: 0,
	},

	setNewScore(newValue) {
		// atualizar score
	},
};

const boardState = {
  boardElement: document.getElementById('board'),
  boardArray: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 0 vazio, 1 player, 2 cpu

  setMove(index, value) {
    if (this.boardArray[index] !== 0)
    return false;

    this.boardArray[index] = value;
    this.updateBoard();
    return true;
  },
  subs: [],
  subscribe(funcao){
  	this.subs.push(funcao);
  },
  updateBoard(){
  	for(let i = 0; i < this.boardArray.length; i++){
  		const state = this.boardArray[i];
  		const cell = cellManager.cellsArray[i];
  		
  		this.subs.forEach((funcao) => {
  			funcao(cell, state);
  		});
  	}
  },
};

const cellManager = {
  cellsArray: [],

  createCell(index) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;

    cell.addEventListener('click', this.handleCellClick.bind(this));

    return cell;
  },

  handleCellClick(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    const moved = boardState.setMove(index, 1); // 1 = player
    if (!moved) return;
    decisionEngine.makeDecision();
  },

  initBoard() {
    boardState.boardElement.innerHTML = '';
    this.cellsArray = [];
    boardState.subscribe(this.updateCells);
    for (let i = 0; i < 9; i++) {
      const newCell = this.createCell(i);
      this.cellsArray[i] = newCell;
      boardState.boardElement.appendChild(newCell);
    }
  },

  updateCells(cell, value) {
    if (!cell) return;

    if (value === 1) {
      cell.innerText = 'X';
    } else if (value === 2) {
      cell.innerText = 'O';
    }

    if (value !== 0) cell.setAttribute('moved', '');
  }
};

const decisionEngine = {
	async makeDecision() {
  await helperFunctions.delay(1000);
  this.makeRandomMove();
	},

	aiCanWin() {

	},

	playerCanWin() {

	},

	makeRandomMove() {
	let index;
  if (!boardState.boardArray.includes(0)) return;
  do {
  index = Math.floor(Math.random() * 9);
  } while (boardState.boardArray[index] !== 0);
  boardState.setMove(index, 2);
	},
};
const helperFunctions = {
delay(ms){
	return new Promise(resolve =>
	setTimeout(resolve, ms));
},
applyTempClass(element, className, callback){
	if(!element) return;
	const onEnd = () => {
		element.classList.remove(className);
		element.removeEventListener("animationend", onEnd);
		if(callback) callback();
	};
	element.addEventListener("animationend", onEnd);
	element.classList.add(className);
	void element.offsetWidth;
},
RNG(chance = 50){
return Math.random() * 100 < chance;
},
};
cellManager.initBoard();
ui.setFunction();
