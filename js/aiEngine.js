import { helperFunctions } from './helperFunctions.js';
import { boardState } from './boardState.js';
import { gameRules } from './gameRules.js';
import { eventBus } from './eventBus.js';
import { difficultyManager } from './preferencesManager.js';

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
export const decisionEngine = {
 
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
