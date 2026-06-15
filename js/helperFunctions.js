export const helperFunctions = {
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