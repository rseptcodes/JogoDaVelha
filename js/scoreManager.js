import { ui } from './ui.js';
export const scoreManager = {
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
