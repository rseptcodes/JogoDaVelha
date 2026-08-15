import { ui, configHub, cellManager } from './ui.js';
import { eventBus } from './eventBus.js';
import { boardState } from './boardState.js';
import { gameRules } from './gameRules.js';
import { turnManager } from './turnManager.js';
import { decisionEngine } from './aiEngine.js';
import { difficultyManager } from './preferencesManager.js';
import { themeManager, languageManager } from './preferencesManager.js';
import { scoreManager } from './scoreManager.js';
import { helperFunctions } from './helperFunctions.js';

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
					  languageManager.init();
            ui.updateStatus(languageManager.getText("drawingStarter"));
            turnManager.startGame();
            ui.setBodyGradient();
        }, "init");

        // reset subs
        eventBus.subscribe(() => {
            this.reset();
        }, "reset");
        
        // finished subs
        eventBus.subscribe(() => {
            cellManager.disableLoserCells();
            turnManager.finishedGame();
            helperFunctions.manageClick(false, boardState.boardElement);
        }, "finished");
    
        // turn subs
        eventBus.subscribe(() => {
					ui.updateStatus(languageManager.getText("yourTurn"));            helperFunctions.manageClick(false, boardState.boardElement);
        }, "playerTurn");
    
        eventBus.subscribe(() => {
        ui.updateStatus(languageManager.getText("thinking"));
            helperFunctions.manageClick(true, boardState.boardElement);
            decisionEngine.makeDecision(difficultyManager.difficulty);
        }, "cpuTurn");
        
        // canWins
        eventBus.subscribe(() => {
            ui.updateStatus(languageManager.getText("cpuEasy"));
        }, "cpuCanWin");
        eventBus.subscribe(() => {
            ui.updateStatus(languageManager.getText("playerCanWin"));
        }, "playerCanWin");
        
        // playerWin subs
        eventBus.subscribe(() => {
            ui.updateStatus(languageManager.getText("playerWin"));
            scoreManager.incrementScore("player");
            ui.setBodyGradient("playerVictory");
        }, "playerWin");
          
        // cpuWin subs
        eventBus.subscribe(() => {
            ui.updateStatus(languageManager.getText("cpuWin"));
            ui.setBodyGradient("CPUVictory");
            scoreManager.incrementScore("cpu");
        }, "cpuWin");
          
        // tie subs
        eventBus.subscribe(() => {
            ui.updateStatus(languageManager.getText("draw"));
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
        boardState.boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        gameRules.lastWinPattern = null;
        eventBus.update("init");
    },
};

mainConfig.init();
