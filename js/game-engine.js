var Game = function(name) {
    if(typeof name === 'undefined') name = 'untitled';
    this.name = name;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.scenes = {};
    this.currentScene = "undefined";
    return this;
}

Game.prototype = {
    init: function() {
        document.body.appendChild(this.canvas);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    makeScene: function(name) {            
        if(typeof name === 'undefined') name = 'untitled';
        this.scenes[name] = new Scene(name); 
    },
    loadScene: function(name) {
        this.currentScene = this.scenes[name];
    },
    loadMap: function(name) {
        
        request = new XMLHttpRequest;
        request.open('GET', "maps/"+name+".json", true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400){
            var data = JSON.parse(request.responseText);
            console.log(data);
          } else {
            console.log("We reached our target server, but it returned an error");
          }
        };

        request.onerror = function() {
          console.log("There was a connection error of some sort");
        };

        request.send();
    }
}

var Scene = function(name) {
    if(typeof name === 'undefined') name = 'untitled';
    this.name = name;
    this.element = {};
    return this;    
}

Scene.prototype = {
    setGrid: function(rows, cols) {
        if(typeof name === 'undefined') name = 'untitled';
        this.element.displayGrid = new DisplayGrid(rows, cols); 
    }
}

var DisplayGrid  = function(rows, cols) {
    this.dimensions = {
        rows: rows,
        cols: cols
    }
    this.regions = {};
    Xcounter = 1;
    Ycounter = 1;
    for(i=0;i<cols;i++){
        for(ii=0;ii<rows;ii++) {
            this.regions[Xcounter+"-"+Ycounter] = new Region(Xcounter+"-"+Ycounter);
            Xcounter++;
        }
        Xcounter = 1;
        Ycounter++;
    }
    return this;
}

var Region  = function(name) {
    this.name = name
    return this;
}

var Map  = function() {
    return this;
}

var Cube  = function() {
    return this;
}

var Character  = function() {
    return this;
}


    
var myGame = new Game('myGame');
myGame.init();
myGame.makeScene("scene one");
myGame.loadScene("scene one");
myGame.loadMap("mapOne");
myGame.currentScene.setGrid(10, 10);

console.log(myGame);
console.log(myGame.currentScene.element);