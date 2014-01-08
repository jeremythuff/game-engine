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
    setCurrentMap: function(arg) {
        this.currentMap = arg;
    },
    getCurrentMap: function() {
        return this.currentMap;
    },
    loadMap: function(arg) {
        this.maps[arg].draw(this.ctx);
        this.setCurrentMap(arg);
    }
}

var Map = function () {
    this.name = 'untitled';
    this.size = {};
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
    build: function (name, cols, rows, w, h) {

        this.setName(name);
        this.setSize(cols, rows);

        var locx = 1;
        var locy = 1;
        var cursorXstart = (window.innerWidth/2)-(w/2);
        var cursorYstart = (h/2);
        cursorX = cursorXstart;
        cursorY = cursorYstart;

        for (i = 0; i < this.getSize('cols'); i++) {
            for (n = 0; n < this.getSize('rows'); n++) {
                var cube = new Cube(this);
                cube.setDimensions(w,h);
                cube.setGridCoord(locx, locy, 1);
                cube.setCartCoord(cursorX, cursorY);
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
    draw: function(ctx) {
         // for(i=0;i<this.cubes.length;i++) {
         //    var x = this.cubes[i].position.isoCoord.x;
         //    var y = this.cubes[i].position.isoCoord.y;
         //    var w = this.cubes[i].dimensions.w;
         //    var h = this.cubes[i].dimensions.h;
         //    var matrix = [
         //        [1,-0.5,1,0.5,x,y, "white"],
         //        [1,0.5,0,-1,x,y+h, "grey"],
         //        [1,-0.5,0,1,x+w,y+(h/2), "#afafaf"]
         //    ];
         //    for(n=0;n<matrix.length;i++) {
         //        ctx.save();
         //        ctx.setTransform(
         //            matrix[0],
         //            matrix[1],
         //            matrix[2],
         //            matrix[3],
         //            matrix[4],
         //            matrix[5]
         //        );
                
         //        ctx.fillStyle = matrix[6];
         //        ctx.fillRect(0, 0, w, h);
         //        ctx.restore();
         //    }
         // }
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

        // First, adjust for the offset:
        var adjScreenX = x;
        var adjScreenY = y;
        var w = this.dimensions.w;
        var h = this.dimensions.h;
        var adjScreenXW = adjScreenX+w;
        var adjScreenYH = adjScreenY-(h/2);
        // Now, retrieve the grid space:
        isoX = ((adjScreenY / (h/2)) + (adjScreenX / w)) / 2;
        isoY = ((adjScreenY / (h/2)) - (adjScreenX / w)) / 2;
        isoXW = isoX+1;
        isoYH = isoY-1;

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
    }
};

myGame = new Game('myGame');
myGame.makeMap('map1', 10, 10, 25, 25);
myGame.init();
myGame.loadMap('map1');

console.log(myGame);
