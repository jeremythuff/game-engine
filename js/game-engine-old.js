var Game = function(name) {
    if(typeof name === 'undefined') name = 'untitled';
    this.name = name;
    this.maps = {};
    this.currentMap = 'undefined'; 
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    return this;
}

Game.prototype = {
    init: function() {
        document.body.appendChild(this.canvas);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

    },
    setName: function(arg) {
        this.name = arg;
    },
    getName: function() {
        return this.name;
    },
    makeMap: function(name, cols, rows, w, h) {
        var map = new Map();
        map.build(name, cols, rows, w, h);
        this.addMap(map);
    },
    addMap: function(obj) {
        this.maps[obj.getName()] = obj;
    },
    getMaps: function(arg) {
        var maps = this.maps;
        if(typeof arg != 'undefined') {
            maps = this.maps[arg];
        }
        return maps
    },
    loadMap: function(arg) {
        var map = this.maps[arg];
        this.setCurrentMap(map);
        this.drawMap();
    },
    setCurrentMap: function(arg) {
        this.currentMap = arg;
    },
    getCurrentMap: function() {
        return this.currentMap;
    },
    drawMap: function() {
        this.canvas.width = this.canvas.width;
        var ctx = this.ctx;
        var map = this.getCurrentMap();
        var cubes = map.getCubes();

         for(i=0;i<cubes.length;i++) {
            var cube = cubes[i];
            var x = cube.position.cartCoord.x;
            var y = cube.position.cartCoord.y;
            var w = cube.dimensions.w;
            var h = cube.dimensions.h;
            var faces = cube.faces;
            
            for(n=0;n<faces.length;n++) {
                ctx.save();
                var face = faces[n];
                ctx.setTransform(
                    face[0],
                    face[1],
                    face[2],
                    face[3],
                    face[4],
                    face[5]
                );

                ctx.fillStyle = face[6];
                ctx.fillRect(0, 0, w, h);
                ctx.restore();
            }
        }
    }
}

var Map = function () {
    this.name = 'untitled';
    this.size = {};
    this.cellSize = {};
    this.cubes = [];
    
    return this;
};

Map.prototype = {
    setName: function (arg) {
        this.name = arg;
    },
    getName: function () {
        return this.name;
    },
    getCubes: function() {
        return this.cubes;
    },
    setCols: function (arg) {
        this.size.cols = arg;
    },
    setRows: function (arg) {
        this.size.rows = arg;
    },
    setSize: function (cols, rows) {
        this.size.cols = cols;
        this.size.rows = rows;
    },
    getSize: function (arg) {
        var size = this.size;
        if (arg === "cols") size = this.size.cols;
        if (arg === "rows") size = this.size.rows;
        return size;
    },
    setCellSize: function(w,h) {
        this.cellSize.w = w;
        this.cellSize.h = h;
    },
    getCellSize: function(arg) {
        var cellSize = this.cellSize;
        if(arg === "w") cellSize = this.cellSize.w;
        if(arg === "h") cellSize = this.cellSize.h;
        return cellSize;
    },
    build: function (name, cols, rows, w, h) {

        this.setName(name);
        this.setSize(cols, rows);
        this.setCellSize(w, h);

        var locx = 1;
        var locy = 1;
        var cursorXstart = (window.innerWidth/2)-(w/2);
        var cursorYstart = (h/2);
        var cursorX = cursorXstart;
        var cursorY = cursorYstart;

        for (i = 0; i < this.getSize('rows'); i++) {
            for (n = 0; n < this.getSize('cols'); n++) {
                var cube = new Cube(this);
                cube.setDimensions(w,h);
                cube.setGridCoord(locx, locy, 1);
                cube.setCartCoord(cursorX, cursorY);
                cube.setFaces(cursorX, cursorY);
                cube.setIsoCoord(cursorX, cursorY);

                locx++;
                cursorX += w;
                cursorY += h/2;
            }
            locx = 1;
            locy++;
            cursorXstart -= w;
            cursorYstart += h/2;
            cursorX = cursorXstart;
            cursorY = cursorYstart;
        }
    },
    addCube: function(x,y,z) {
        var cube = new Cube(this);
        cube.setGridCoord(x,y,z);
        cube.setCartCoord(x,y);
        cube.setIsoCoord(x,y);
        cube.setDimensions(this.cellSize.w, this.cellSize.h);
        map.cubes.push();
    },
    removeCube: function(x,y,z,map) {

    }
};

var Cube = function (map) {
    this.flags = [];
    this.position = {
        cartCoord: {},
        isoCoord: {},
        gridCoord: {}
    };
    this.dimensions = {};
    this.texture = {};
    this.faces = [
        [1,-0.5,1,0.5,0,0, "white"],
        [1,0.5,0,-1,0,0, "grey"],
        [1,-0.5,0,1,0,0, "afafaf"]
    ];
 
    map.cubes.push(this);

    return this;
};

Cube.prototype = {
    setDimensions: function(w,h) {
        this.dimensions.w = w;
        this.dimensions.h = h;
    },
    getDimensions: function(arg) {
        var dimensions = {
            w: this.dimensions.w,
            h: this.dimensions.h
        }
        if(arg === 'w') dimensions = this.dimensions.w;
        if(arg === 'h') dimensions = this.dimensions.h;
        return dimensions;
    },
    getCartCoord: function (arg) {
        var coords = [];
        coords.push(this.position.cartCoord.x);
        coords.push(this.position.cartCoord.y);
        if (arg === "x") coords = this.position.cartCoord.x;
        if (arg === "y") coords = this.position.cartCoord.y;

        return coords;
    },
    setIsoCoord: function (x, y) {

        var adjScreenX = x;
        var adjScreenY = y;
        var w = this.dimensions.w;
        var h = this.dimensions.h;
        var adjScreenXW = adjScreenX+w;
        var adjScreenYH = adjScreenY-(h/2);
        var isoX = ((adjScreenY / (h/2)) + (adjScreenX / w)) / 2;
        var isoY = ((adjScreenY / (h/2)) - (adjScreenX / w)) / 2;
        var isoXW = isoX+1;
        var isoYH = isoY-1;

        this.position.isoCoord.x = isoX;
        this.position.isoCoord.y = isoY;
        this.position.isoCoord.xw = isoXW;
        this.position.isoCoord.yh = isoYH;
    },
    getIsoCoord: function (arg) {
        var coords = [];
        coords.push(this.position.isoCoord.x);
        coords.push(this.position.isoCoordy.y);
        coords.push(this.position.isoCoordy.xw);
        coords.push(this.position.isoCoordy.yh);
        if (arg === "x") coords = this.position.isoCoord.x;
        if (arg === "y") coords = this.position.isoCoord.y;

        return coords;
    },
    setGridCoord: function (x, y, z) {
        this.position.gridCoord.x = x;
        this.position.gridCoord.y = y;
        this.position.gridCoord.z = z;
    },
    getGridCoord: function (arg) {
        var coords = [];
        coords.push(this.position.gridCoord.x);
        coords.push(this.position.gridCoord.y);
        coords.push(this.position.gridCoord.z);
        if (arg === "x") coords = this.position.isoCoord.x;
        if (arg === "y") coords = this.position.isoCoord.y;
        if (arg === "z") coords = this.position.isoCoord.z;

        return coords;
    },
    setFlag: function (flag) {
        this.flags.push(flag);
    },
    hasFlag: function (flag) {
        var flags = this.flags;
        var found = false;
        for (i = 0; i < flags.length && !found; i++) {
            if (flags[i] === flag) {
                found = true;
            }
        }
        return found;
    },
    getFlags: function () {
        return this.flags;
    },
    setCartCoord: function (x, y) {
        this.position.cartCoord.x = x;
        this.position.cartCoord.y = y;
    },
    setFaces: function (x, y) {
        this.faces[0][4] = x;
        this.faces[1][4] = x;
        this.faces[2][4] = x+this.dimensions.w;
        this.faces[0][5] = y;
        this.faces[1][5] = y+this.dimensions.h;
        this.faces[2][5] = (y)+(this.dimensions.h/2);
    }
};

var myGame = new Game('myGame');
myGame.makeMap('mapOne', 10, 10, 25, 25);
myGame.init();
myGame.loadMap('mapOne');

var map = myGame.getCurrentMap();
//console.log(map);
map.addCube(11,11,0); 


console.log(myGame);
