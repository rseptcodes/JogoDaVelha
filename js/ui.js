import { eventBus } from './eventBus.js';
import { boardState } from './boardState.js';
import { helperFunctions } from './helperFunctions.js';
import { turnManager } from './turnManager.js';
import { gameRules } from './gameRules.js';

export const ui = {
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
		eventBus.update("reset");
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
export const configHub = {
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
export const cellManager = {
  cellsArray: [],

  createCell(index) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    helperFunctions.applyTempClass(cell, "cell--fadein");
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
