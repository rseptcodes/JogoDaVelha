export const difficultyManager = {
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
export const themeManager = {
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
