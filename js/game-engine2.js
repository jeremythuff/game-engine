var Game = function(name) {
    if(typeof name === 'undefined') name = 'untitled';
    this.name = name;
    this.maps = {};
    this.currentMap = 'undefined'; 
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.displayGrid = {};
    return this;
}

Game.prototype = {
    init: function() {
        var game = this;
        document.body.appendChild(this.canvas);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        game.setEventListener("window", "resize", function() {
        	game.setCanvasSize();
        });
    },
    setName: function(arg) {
        this.name = arg;
    },
    getName: function() {
        return this.name;
    },
    setCanvasSize: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    attachDisplayGrid: function() {
    	
    },
    setEventListener: function(target, listenFor, functionToCall) {
    	if(typeof functionToCall === 'function') {
    		if(target === 'window') {
    			window[target].addEventListener(listenFor, functionToCall);
    		} else if(target.substr(0, 1) != "#") {
    			document[target].addEventListener(listenFor, functionToCall);
    		}

    		//add case for class and id 
    	}
    }

}


var myGame = new Game('myGame');
myGame.init();
console.log(myGame);
