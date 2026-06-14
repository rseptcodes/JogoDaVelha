const mainConfig = {
	init(){
		// moveMade subs
		eventBus.subscribe(() => {
			cellManager.updateCells();
			gameRules.getWinner(boardState.boardArray, true);
		}, "moveMade");
		
		// turnChanged subs
		eventBus.subscribe(() => {
			turnManager.setNewTurn();
		}, "turnChanged");
		
		// init subs
		eventBus.subscribe(() => {
			cellManager.initBoard();
			//configHub.init();
			ui.updateStatus("Sorteando quem começa...");
			turnManager.startGame();
			ui.setBodyGradient();
		}, "init");
		
		// finished subs
		eventBus.subscribe(() => {
			cellManager.disableLoserCells();
			turnManager.finishedGame();
	   	helperFunctions.manageClick(false, boardState.boardElement);
		}, "finished");
	
    
	  // turn subs
	  	eventBus.subscribe(() => {
	   	ui.updateStatus("Sua vez!");
	   	helperFunctions.manageClick(false, boardState.boardElement);
	}, "playerTurn");
	
			eventBus.subscribe(() => {
			ui.updateStatus("Pensando...");
			helperFunctions.manageClick(true, boardState.boardElement);
				decisionEngine.makeDecision(difficultyManager.difficulty);
		}, "cpuTurn");
		
    // canWins
    eventBus.subscribe(() => {
			ui.updateStatus("KKKKK que facil");
		}, "cpuCanWin");
    eventBus.subscribe(() => {
			ui.updateStatus("@%$%@!");
		}, "playerCanWin");
		
	  // playerWin subs
		eventBus.subscribe(() => {
		ui.updateStatus("Você venceu!");
		scoreManager.incrementScore("player");
		ui.setBodyGradient("playerVictory");
	}, "playerWin");
	  
	  // cpuWin subs
		eventBus.subscribe(() => {
		ui.updateStatus("A CPU venceu!");
		ui.setBodyGradient("CPUVictory");
		scoreManager.incrementScore("cpu");
	}, "cpuWin");
	  
	  // tie subs
		eventBus.subscribe(() => {
		ui.updateStatus("Empate!");
		ui.setBodyGradient("draw");
		scoreManager.incrementScore("tie");
	}, "tie");
	  
	  // themeChanged subs
	  eventBus.subscribe((data) => {
		themeManager.changeTheme(data);
	}, "themeChanged");
	
	  // difficultyChanged subs
	  eventBus.subscribe((data) => {
    difficultyManager.setDifficulty(data);
    ui.updateDifficultyIcon(Number(data));
    this.reset();
}, "difficultyChanged");
	
	  themeManager.init();
	  difficultyManager.init();
	  ui.setListener();
	  ui.updateDifficultyIcon(difficultyManager.difficulty);
	  configHub.init();
	  configHub.syncUI();
	  eventBus.update("init");
	},
	reset(){
		boardState.resetCounter++;
		boardState.boardArray =[0, 0, 0, 0, 0, 0, 0, 0, 0];
		gameRules.lastWinPattern = null;
		eventBus.update("init");
	},
};
const eventBus = {
	subs: [],
  subscribe(funcao, listener, data){
  	this.subs.push({funcao, listener, data});
  },
  unsubscribe(funcao, listener){
   this.subs = this.subs.filter(
    n => !(n.funcao === funcao && n.listener === listener)
  );
},
  update(listener, data){
  	this.subs.forEach((sub) => {
  		if (sub.listener === listener){
  				sub.funcao(data);
  		}
  		});
  },
};

const ui = {
	statusElement: document.getElementById('status'),

	boardElement: document.getElementById('board'),

	scorePlayer: document.getElementById('score-player'),
	scoreTies: document.getElementById('score-ties'),
	scoreCpu: document.getElementById('score-cpu'),

	resetBtn: document.getElementById('resetBtn'),
	icon: document.getElementById("difficultyIcon"),
	configBtn: document.getElementById('configBtn'),
	
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
		this.configBtn.addEventListener("click", () => {
		configHub.toggleVisibility();
	});
	},
	updateDifficultyIcon(level){
  const icons = {
    0: ["fa-solid", "fa-dice"],
    1: ["fa-solid", "fa-brain"],
    2: ["fa-solid", "fa-chess-queen"]
  };

  this.icon.className = "controls-icn";

  if(icons[level]){
    this.icon.classList.add(...icons[level]);
  }
}
};
const configHub = {
    isVisible: false,
    dom: {},

    init() {
        this.dom.overlay = document.getElementById('settings-overlay');
        this.dom.closeBtn = document.getElementById('close-settings');
        this.dom.themeRadios = document.querySelectorAll('input[name="theme"]');
        this.dom.difficultyRadios = document.querySelectorAll('input[name="difficulty"]');

        this.bindEvents();
    },

    bindEvents() {
        this.dom.closeBtn.addEventListener('click', () => this.toggleVisibility());

        this.dom.overlay.addEventListener('click', (e) => {
            if (e.target === this.dom.overlay) this.toggleVisibility();
        });

        this.dom.themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => eventBus.update("themeChanged",e.target.value));
        });

        this.dom.difficultyRadios.forEach(radio => {
            radio.addEventListener('change', (e) => eventBus.update("difficultyChanged",e.target.value));
        });
    },

    toggleVisibility() {
        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            this.dom.overlay.classList.remove('hidden');
        } else {
            this.dom.overlay.classList.add('hidden');
        }
    },
    syncUI() {
    const theme = localStorage.getItem("pref-theme");
    const difficulty = localStorage.getItem("pref-difficulty");

    const themeRadio = document.querySelector(
    `input[name="theme"][value="${theme}"]`
  );

    const difficultyRadio = document.querySelector(
    `input[name="difficulty"][value="${difficulty}"]`
  );

    if (themeRadio) themeRadio.checked = true;
    if (difficultyRadio) difficultyRadio.checked = true;
}
};


const difficultyManager = {
	difficulty: 2, // 0: random, 1: decisionEngine, 2: miniMaxEngine
	init(){
		const saved = (localStorage.getItem("pref-difficulty"));
		if(saved){
			this.setDifficulty(saved);
		}
	},
	setDifficulty(newValue){
		newValue = Number(newValue);
		if(newValue >= 3) return;
		this.difficulty = newValue;
		localStorage.setItem('pref-difficulty', newValue);
	},
};
const themeManager = {
	init() {
		const saved = localStorage.getItem("pref-theme");
		if(saved){
			this.changeTheme(saved);
		}
	},
		changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        console.log(theme);
        localStorage.setItem('pref-theme', theme);
	},
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
		eventBus.update("cpuTurn");
	}else if (this.activeTurn === 2){
		this.activeTurn = 1;
		eventBus.update("playerTurn");
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
		eventBus.update("playerTurn");
	}else{
		eventBus.update("cpuTurn");
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
    eventBus.update("moveMade");
    eventBus.update("turnChanged");
    return true;
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

  getWinner(boardArray, isUpdating) {
	if (this.checkWinner(boardArray, 1)){
		if(isUpdating){
		eventBus.update("playerWin");
		eventBus.update("finished");
		}
		return 1;

	} else if (this.checkWinner(boardArray, 2)) {
		if(isUpdating){
		eventBus.update("cpuWin");
		eventBus.update("finished");
		}
		return 2;

	} else if (this.isTie(boardArray)) {
		if(isUpdating){
		eventBus.update("tie");
		eventBus.update("finished");
		}
		return 0;
	}
	return null;
},

  isTie(boardArray) {
    return !boardArray.includes(0);
  },
};


// CPUManager
const miniMaxEngine = {
	scoreTable: {
		2: 10, // cpu
		1: -10, // player
		0: 0, // tie
	},
	getTerminalState(board) {
  const WIN_PATTERNS = gameRules.WIN_PATTERNS;
  for (const pattern of WIN_PATTERNS) {
    const a = pattern[0];
    const b = pattern[1];
    const c = pattern[2];

    if (board[a] !== 0 &&
        board[a] === board[b] &&
        board[b] === board[c]) {
      return board[a]; // 1 ou 2
    }
  }
    if (!board.includes(0)) return 0;
  return null; // jogo continua
},
  miniMax(boardCopy, isMaximizing, depth){
  	let result = this.getTerminalState(boardCopy);
  	if (result === 2) return this.scoreTable[result] - depth; 
		if (result === 1) return this.scoreTable[result] + depth;
		if (result === 0) return 0;
		
  	if (result !== null) return this.scoreTable[result];
  	
    if (isMaximizing){
    	let bestScore = -Infinity;
    	for(let i = 0; i < boardCopy.length; i++){
    		if(boardCopy[i] === 0){
    			boardCopy[i] = 2;
    			let score = miniMaxEngine.miniMax(boardCopy, false, depth + 1);
    			boardCopy[i] = 0;
    			bestScore = Math.max(score, bestScore);
    		} // verifica se ta vazio
    	} // loop central do for
    		return bestScore;
    } else {
    	let bestScore = Infinity;
    	for(let i = 0; i < boardCopy.length; i++){
    		if(boardCopy[i] === 0){
    			boardCopy[i] = 1;
    			let score = miniMaxEngine.miniMax(boardCopy, true, depth + 1);
    			boardCopy[i] = 0;
    			bestScore = Math.min(score, bestScore);
    			}
    }
    return bestScore;
  }
  },
  getBestMove(board, depth){
  	let bestScore = -Infinity
  	let boardCopy = [...board];
  	let bestMove;
  	for(let i = 0; i < boardCopy.length; i++){
  		if(boardCopy[i] === 0){
    			boardCopy[i] = 2;
    			let score = miniMaxEngine.miniMax(boardCopy, false, depth + 1);
    			boardCopy[i] = 0;
  		if(score > bestScore){
    				bestScore = score;
    				bestMove = i;
    			}
  	}
  }
  return bestMove;
  }
};

const decisionEngine = {
 
  async makeDecision(difficulty) {
    if (!boardState.boardArray.includes(0)) return;
    const currentReset = boardState.resetCounter;
    
    let move = this.aiCanWin();
    let attack = move !== -1;
    let defense = false;
    
    if (move === -1) {
      move = this.playerCanWin();
      defense = move !== -1;
    }
    if (move === -1){
    	move = this.getPriorityMove();
    }
    if (attack) {
      eventBus.update("cpuCanWin");
    } else if (defense) {
      eventBus.update("playerCanWin");
    }
    
    await helperFunctions.delay(1000);
    if(currentReset !== boardState.resetCounter) return;
    
    if (move === -1 || difficulty === 0) {
      this.makeRandomMove();
    } else if(difficulty === 1){
      boardState.setMove(move, 2);
    } else {
    	move = miniMaxEngine.getBestMove(boardState.boardArray, 0);
    	boardState.setMove(move, 2);
    }
  },

  findWinningMove(playerValue) {
    for (let pattern of gameRules.WIN_PATTERNS) {
      const cells = pattern.map(index => boardState.boardArray[index]);
      const playerCount = cells.filter(val => val === playerValue).length;
      const emptyCount = cells.filter(val => val === 0).length;
      
      if (playerCount === 2 && emptyCount === 1) {
        const emptyIndexOnPattern = cells.indexOf(0);
        return pattern[emptyIndexOnPattern];
      }
    }
    return -1;
  },
  aiCanWin() {
    return this.findWinningMove(2);
  },
  playerCanWin() {
    return this.findWinningMove(1);
  },
  
  getPriorityMove() {
    if (boardState.boardArray[4] === 0) return 4;

    const corners = [0, 2, 6, 8];
    const cornersEmpty = [];

    for (let i = 0; i < corners.length; i++) {
        const value = corners[i];

        if (boardState.boardArray[value] === 0) {
            cornersEmpty.push(value);
        }
    }

    if (cornersEmpty.length === 0) return -1;

    const randomIndex = Math.floor(Math.random() * cornersEmpty.length);

    return cornersEmpty[randomIndex];
},
  makeRandomMove() {
    let index;
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
manageClick(blockClick, element){
	if(blockClick){
		element.style.pointerEvents = "none";
	} else if (!blockClick) {
		element.style.pointerEvents = "auto";
}
},
};
mainConfig.init();
