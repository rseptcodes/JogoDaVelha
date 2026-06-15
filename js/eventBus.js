export const eventBus = {
	subs: [],
  subscribe(funcao, listener, data){
  	this.subs.push({funcao, listener, data});
  },
  unsubscribe(funcao, listener){
   this.subs = this.subs.filter(
    n => !(n.funcao === funcao && n.listener === listener)
  );
},
  update(listener, data){
  	this.subs.forEach((sub) => {
  		if (sub.listener === listener){
  				sub.funcao(data);
  		}
  		});
  },
};
