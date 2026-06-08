const mainConfig = {
	init(){
		// moveMade subs
		boardState.subscribe(() => {
			gameRules.getWinner(boardState.boardArray);
			cellManager.updateCells();
		}, "moveMade");
		
		// turnChanged subs
		boardState.subscribe(() => {
			turnManager.setNewTurn();
		}, "turnChanged");
		
		// init subs
		boardState.subscribe(() => {
			cellManager.initBoard();
			ui.updateStatus("Sorteando quem começa...");
			turnManager.startGame();
			ui.setBodyGradient();
		}, "init");
		
		// finished subs
		boardState.subscribe(() => {
			cellManager.disableLoserCells();
			turnManager.finishedGame();
		}, "finished");
	
    
	  // turn subs
	  	boardState.subscribe(() => {
	   	ui.updateStatus("Sua vez!");
	   	helperFunctions.manageClick("PlayerTurn", boardState.boardElement);
	   	helperFunctions.manageClick("PlayerTurn", ui.resetBtn);
	}, "playerTurn");
	
			boardState.subscribe(() => {
			ui.updateStatus("Pensando...");
			helperFunctions.manageClick("cpuTurn", boardState.boardElement);
			helperFunctions.manageClick("cpuTurn", ui.resetBtn);
		}, "cpuTurn");
    
	  // playerWin subs
		boardState.subscribe(() => {
		ui.updateStatus("Você venceu!");
		scoreManager.incrementScore("player");
		ui.setBodyGradient("playerVictory");
	}, "playerWin");
	  
	  // cpuWin subs
		boardState.subscribe(() => {
		ui.updateStatus("A CPU venceu!");
		ui.setBodyGradient("CPUVictory");
		scoreManager.incrementScore("cpu");
	}, "cpuWin");
	  
	  // tie subs
		boardState.subscribe(() => {
		ui.updateStatus("Empate!");
		ui.setBodyGradient("draw");
		scoreManager.incrementScore("tie");
	}, "tie");
	  
	  themeManager.init();
	  ui.setListener();
	  boardState.update("init");
	},
	reset(){
		boardState.resetCounter++;
		boardState.boardArray =[0, 0, 0, 0, 0, 0, 0, 0, 0];
		gameRules.lastWinPattern = null;
		boardState.update("init");
	},
};

const ui = {
	statusElement: document.getElementById('status'),

	boardElement: document.getElementById('board'),

	scorePlayer: document.getElementById('score-player'),
	scoreTies: document.getElementById('score-ties'),
	scoreCpu: document.getElementById('score-cpu'),

	resetBtn: document.getElementById('reset-btn'),
	themeBtn: document.getElementById('theme-btn'),
	updateStatus(message){
	this.statusElement.innerText = message;
},
  setBodyGradient(classe){
  	document.body.className = classe;
  },
	setListener(){
		this.resetBtn.addEventListener("click", () => {
		mainConfig.reset();
	});
	},
};

const themeManager = {
	themes: ["default", "amoled", "light"],
	index: 0,

	init() {
		const saved = localStorage.getItem("theme");

		if(saved){
			this.index = this.themes.indexOf(saved);
			if(this.index === -1) this.index = 0;
			this.apply();
		}

		ui.themeBtn.addEventListener("click", () => {
				this.nextTheme();
			});
	},

	nextTheme() {
		this.index++;

		if(this.index >= this.themes.length){
			this.index = 0;
		}

		this.apply();
	},

	apply() {
		const theme = this.themes[this.index];
		if(theme === "default"){
			document.documentElement.removeAttribute("data-theme");
		}else{
			document.documentElement.setAttribute("data-theme", theme);
		}
		localStorage.setItem("theme", theme);
	}
};

const scoreManager = {
	values: {
		player: 0,
		tie: 0,
		cpu: 0,
	},

	incrementScore(type) {
		this.values[type]++;
		
		if (type === "player") ui.scorePlayer.innerText = this.values.player;
		if (type === "cpu") ui.scoreCpu.innerText = this.values.cpu;
		if (type === "tie") ui.scoreTies.innerText = this.values.tie;
	},
};

const turnManager = {
	activeTurn: 0,
	async setNewTurn(){
	if(this.activeTurn === 1){
		this.activeTurn = 2;
		boardState.update("cpuTurn");
		await decisionEngine.makeDecision();
	}else if (this.activeTurn === 2){
		this.activeTurn = 1;
		boardState.update("playerTurn");
	}
},
	finishedGame: () => {
		turnManager.activeTurn = 0;
	},
	startGame : async () => {
	turnManager.activeTurn = Math.random() < 0.5 ? 1 : 2;
	const currentReset = boardState.resetCounter;
  await helperFunctions.delay(400);
  if(currentReset !== boardState.resetCounter) return;
  //obs: sei que nao é top 10 melhores correcoes, isso é provisorio
	if(turnManager.activeTurn === 1){
		boardState.update("playerTurn");
	}else{
		boardState.update("cpuTurn");
		await decisionEngine.makeDecision();
	}
},
};
const boardState = {
  boardElement: document.getElementById('board'),
  boardArray: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 0 vazio, 1 player, 2 cpu
  currentTurn: 1,
  resetCounter: 0,

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
  		});
  		// init
  		// moveMade
  		// turnChanged
  		// finished
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
  	if(turnManager.activeTurn !== 1) return;
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    const moved = boardState.setMove(index, 1); // 1 = player
    if (!moved) return;
  },

  initBoard() {
    boardState.boardElement.innerHTML = '';
    this.cellsArray = [];
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
      cell.classList.add("fas", "fa-xmark");
    } else if (state === 2) {
      cell.classList.add("fas", "fa-robot");
    }

    if (state !== 0) cell.setAttribute('moved', '');
  	}
  },
  disableLoserCells(){
  	for(let i = 0; i < this.cellsArray.length; i++){
  		const cell = this.cellsArray[i];
  		if(gameRules.lastWinPattern !== null){
  		if(!gameRules.lastWinPattern.includes(i)) cell.classList.add("disabled");
  		} else {
  			cell.classList.add("disabled");
  		}
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
  lastWinPattern: null,

  checkWinner(boardArray, player) {
    this.lastWinPattern = this.WIN_PATTERNS.find(pattern =>
	  pattern.every(index => boardArray[index] === player)
	);
    return this.lastWinPattern ? 1 : 0;
  },

  getWinner(boardArray) {
	if (this.checkWinner(boardArray, 1)){
		boardState.update("playerWin");
		boardState.update("finished");
		return 1;

	} else if (this.checkWinner(boardArray, 2)) {
		boardState.update("cpuWin");
		boardState.update("finished");
		return 2;

	} else if (this.isTie(boardArray)) {
		boardState.update("tie");
		boardState.update("finished");
		return 0;
	}
},

  isTie(boardArray) {
    return !boardArray.includes(0);
  },
};

const decisionEngine = {
 
  async makeDecision() {
    if (!boardState.boardArray.includes(0)) return;
    const currentReset = boardState.resetCounter;
    await helperFunctions.delay(1000);
    if(currentReset !== boardState.resetCounter) return;
      //obs: sei que nao é top 10 melhores correcoes, isso é provisorio
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
manageClick(activeTurn, element){
	if(activeTurn === "cpuTurn"){
		element.style.pointerEvents = "none";
	} else {
		element.style.pointerEvents = "auto";
}
},
};
mainConfig.init();
