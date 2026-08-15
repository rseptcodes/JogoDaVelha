export const difficultyManager = {
	// I'll refactor these magic numbers in the future
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
export const languageManager = {
    language: "en",
    translations: {
        pt: {
            drawingStarter: "Sorteando quem começa...",
            yourTurn: "Sua vez!",
            thinking: "Pensando...",
            cpuEasy: "KKKKK que fácil",
            playerCanWin: "@%$%@!",
            playerWin: "Você venceu!",
            cpuWin: "A CPU venceu!",
            draw: "Empate!"
        },

        en: {
            drawingStarter: "Choosing who goes first...",
            yourTurn: "Your turn!",
            thinking: "Thinking...",
            cpuEasy: "LOL, too easy",
            playerCanWin: "@%$%@!",
            playerWin: "You won!",
            cpuWin: "CPU won!",
            draw: "Draw!"
        }
    },

    init() {
        const browserLanguage = navigator.language.toLowerCase();

        this.language = browserLanguage.startsWith("pt")
            ? "pt"
            : "en";
    },

    getText(key) {
    return this.translations[this.language]?.[key]
        ?? this.translations.en[key]
        ?? key;
},
};
