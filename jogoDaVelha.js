const mainConfig = {
	init(){
		boardState.subscribe(cellManager.updateCells, "moveMade");
		boardState.subscribe(() => {
			gameRules.getWinner(boardState.boardArray);
		}, "moveMade");
		// boardState.subscribe(showGameOver, "win");
		boardState.subscribe(() => {
			turnManager.setNewTurn();
		}, "turnChanged");
		cellManager.initBoard();
    ui.setFunction();
	},
};

const ui = {
	statusElement: document.getElementById('status'),

	boardElement: document.getElementById('board'),

	scorePlayer: document.getElementById('score-player'),
	scoreTies: document.getElementById('score-ties'),
	scoreCpu: document.getElementById('score-cpu'),

	resetBtn: document.getElementById('reset-btn'),
	clearScoresBtn: document.getElementById('clear-scores-btn'),
	setFunction(){
		decisionEngine.subscribe(helperFunctions.manageClick, this.resetBtn);
		this.resetBtn.addEventListener("click", () => {
		cellManager.initBoard();
		boardState.boardArray =[0, 0, 0, 0, 0, 0, 0, 0, 0];
	});
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
const turnManager = {
	turn: 1,
	async setNewTurn(){
		if(this.turn === 1){
			this.turn = 2;
			await decisionEngine.makeDecision();
		}else if (this.turn === 2){
			this.turn = 1;
		}
	},
};
const boardState = {
  boardElement: document.getElementById('board'),
  boardArray: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 0 vazio, 1 player, 2 cpu
  currentTurn: 1,
  isPlaying: true,

  setMove(index, value) {
    if (this.boardArray[index] !== 0)
    return false;

    this.boardArray[index] = value;
    this.update("moveMade");
    this.update("turnChanged");
    return true;
  },
  subs: [],
  subscribe(funcao, listener){
  	this.subs.push({funcao, listener});
  },
  unsubscribe(funcao, listener){
  	this.subs = this.subs.filter(n => n.funcao !== funcao && n.listener !== listener);
  },
  update(listener){
  	this.subs.forEach((sub) => {
  		if (sub.listener === listener){
  			sub.funcao();
  		}
  		console.log(listener);
  		});
  		// moveMade
  		// turnChanged
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
  },

  initBoard() {
    boardState.boardElement.innerHTML = '';
    this.cellsArray = [];
    decisionEngine.subscribe(helperFunctions.manageClick,boardState.boardElement);
    for (let i = 0; i < 9; i++) {
      const newCell = this.createCell(i);
      this.cellsArray[i] = newCell;
      boardState.boardElement.appendChild(newCell);
    }
  },
  updateCells: () => {
    for(let i = 0; i < boardState.boardArray.length; i++){
  		const state = boardState.boardArray[i];
  		const cell = cellManager.cellsArray[i];
  		
  		if (!cell) return;
    if (state === 1) {
      cell.innerText = 'X';
    } else if (state === 2) {
      cell.innerText = 'O';
    }

    if (state !== 0) cell.setAttribute('moved', '');
  	}
  }
};
const gameRules = {
  WIN_PATTERNS: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],

  checkWinner(boardArray, player) {
    return this.WIN_PATTERNS.some(pattern =>
      pattern.every(index => boardArray[index] === player)
    );
  },

  getWinner(boardArray) {
    if (this.checkWinner(boardArray, 1)){
    boardState.update("win");
    return 1;
    } else if (this.checkWinner(boardArray, 2)) {
    boardState.update("win");
    return 2;
    }
    return 0;
  },

  isTie(boardArray) {
    return !boardArray.includes(0) && this.getWinner(boardArray) === 0;
  },
};

const decisionEngine = {
  subs: [],
  subscribe(funcao, element) {
  	this.subs.push({funcao, element});
  },
  
  notify(isThinking) {
    this.subs.forEach(sub => sub.funcao(isThinking, sub.element));
  },

  async makeDecision() {
    if (!boardState.boardArray.includes(0)) return;

    this.notify(true);
    await helperFunctions.delay(1000);
    this.makeRandomMove();
    this.notify(false);
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
manageClick(isThinking, element){
	if(isThinking){
		element.style.pointerEvents = "none";
	} else {
		element.style.pointerEvents = "auto";
}
},
};
mainConfig.init();
