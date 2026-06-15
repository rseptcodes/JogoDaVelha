import { eventBus } from'./eventBus.js';

export const boardState = {
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
