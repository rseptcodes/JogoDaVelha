import { eventBus } from './eventBus.js';

export const gameRules = {
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
