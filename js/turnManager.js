import { eventBus } from './eventBus.js';
import { helperFunctions } from './helperFunctions.js';
import { boardState } from './boardState.js';

export const turnManager = {
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
