
$(document).ready(function() {
    
    var numCols = 10
    ,   numRows = 10
    ,   region = []
    ,   hero = {
        "color": "rgba(250,250,250,0)",
        "texture": "goatTiny2.jpg",
        "x": 4,
        "y": 3,
        "lastX": 4,
        "lastY": 3
    }

    init();
    

    //////////////////////
    //main draw function//
    //////////////////////
    function drawStuff(w,h) {
        canvas1.width = canvas1.width;//cleans the canvas1
        // var cursorX = (canvas1.width-(w*numCols))/2;
        // var cursorY = (canvas1.height-(w*numRows))/2;
        // var locX = 1;
        // var locY = 1;
        
        // makeIso();
        // var texture = new Image();
        // texture.src = "img/grass.jpg";
        // texture.onload = function() {
        //     for(n=0;n<numRows;n++){

        //         for(i=0;i<numCols;i++){
        //             var thisRegion = {
        //                 "coord": locX+"-"+locY,
        //                 "x": cursorX,
        //                 "y": cursorY,
        //                 "texture": "grass.jpg",
        //                 "opacity": 0
        //             }
        //             region.push(thisRegion);
        //             //cube(cursorX,cursorY);
        //             ctx1.strokeRect(cursorX, cursorY, w, h);
                    
        //             //ctx1.drawImage(texture, cursorX, cursorY, w, h);
                    
        //             cursorX += w;
        //             locX++
        //         }
        //         cursorX = (canvas1.width-(w*numCols))/2;
        //         cursorY += h;
        //         locX = 1;
        //         locY++;
        //     }


            
            //unmakeIso()
            //placeHero();
            
        //}

        cursorXstart = (canvas1.width/2)-(w/2);
        cursorYstart = (h/2);
        cursorX = cursorXstart;
        cursorY = cursorYstart;
        locX = 1;
        locY = 1;

        for(n=0;n<numRows;n++){

            for(i=0;i<numRows;i++){
                
                cube(cursorX, cursorY);
                var iso = isoCoord(cursorX, cursorY);
                var thisRegion = {
                    "coord": locX+"-"+locY,
                    "x": iso.x,
                    "y": iso.y,
                    "xw": iso.xw,
                    "yh": iso.yh
                }
                region.push(thisRegion);
                //x+1
                cursorX += w;
                cursorY += h/2;
                //y-1
                // cursorX -= w;
                // cursorY += h/2;
                //z+1
                //cursorY -= h;
                locX++;
            }
            
            cursorXstart -= w;
            cursorYstart += h/2;
            cursorX = cursorXstart
            cursorY = cursorYstart
            locX = 1;
            locY++;
        }

    }

    console.log(region);

    //z+1
    // $(region).each(function() {
    //     if(this.coord == "10-10") {
    //         cube(this.x, this.y-h);
    //         cube(this.x, this.y-(h*2));       
    //     }
    // });
    
    ///////////////////
    //EVENT LISTENERS//
    ///////////////////

    canvas1.addEventListener('click', function(evt) {
        var mousePos = getMousePos(canvas1, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(canvas1, message);

        $(region).each(function() {
           
            var iso = isoCoord(mousePos.x, mousePos.y);
            //(iso.x>this.x)&&(iso.x<this.xw)&&
            if((iso.x>this.x)&&(iso.x<this.xw)&&(iso.y>this.y)&&(iso.y<this.yh)) 
            {
                console.log(this.coord);
            }       
            

            // console.log((iso.x +" > "+ this.x) +  " " + (iso.x>this.x));
            // console.log((iso.x +" < "+ this.xw) +  " " + (iso.x<this.xw));
            // console.log((iso.y +" < "+ this.y) +  " " + (iso.y<this.y));
            // console.log((iso.y +" < "+ this.yh) + " " + (iso.y>this.yh));
        });

      }, false);
            

    $(window).on("resize", function() {
        console.log(hero);
        console.log(region)
        clearHero();
        reDrawCanvas();
    });

    $(document).on("keydown", function(e) {
        console.log(hero);
        var key = e.keyCode;
        hero.lastX = hero.x;
        hero.lastY = hero.y;
        if(key===37)hero.x--;
        if(key===38)hero.y--;
        if(key===39)hero.x++;
        if(key===40)hero.y++;
        placeHero();
    });

    /////////////
    //Functions//
    /////////////

    function init() {
        canvas1 = document.getElementById('canvas1');
        ctx1 = canvas1.getContext('2d');
        reDrawCanvas();
    }

    function reDrawCanvas() {
        hero.lastX = hero.x;
        hero.lastY = hero.y;
        canvas1.width = $(window).width();
        canvas1.height = $(window).height();
        // w = canvas1.width/numCols;
        // if((w*numRows)>canvas1.height)w = canvas1.height/numRows;
        w=25;
        h = w;

        drawStuff(w,h);
    }

    function placeHero() {
        clearHero();
        drawHero();
   }

    function drawHero() {
        var heroLoc = hero.x+"-"+hero.y;

        $(region).each(function() {
            if(this.coord == heroLoc) {
                var thisX = this.x;
                var thisY = this.y;
                // ctx1.fillStyle=hero.color;
                // ctx1.fillRect(this.x, this.y, w, h);
                // ctx1.fill();

                // var texture = new Image();
                // texture.src = "img/"+hero.texture;
                // texture.onload = function() {
                //     ctx1.drawImage(texture, thisX, thisY, w, h);
                // }
            }
        });
    }


    function clearHero() {
        var heroLastLoc = hero.lastX+"-"+hero.lastY;

        $(region).each(function() {
            if(this.coord == heroLastLoc) {
                var thisX = this.x;
                var thisY = this.y;
                
                if(this.opacity<=1){this.opacity += .1};
                
                var thisOpacity = this.opacity;
                var texture = new Image();
                //texture.src = "img/"+this.texture;
                //texture.onload = function() {
                    //ctx1.drawImage(texture, thisX, thisY, w, h);
                    ctx1.fillStyle="rgba(250,250,99,"+thisOpacity+")";
                    ctx1.fillRect(thisX, thisY, w, h);
                    ctx1.fill();
                //}
            }
        });
    
    }

    function makeIso() {
        ctx1.translate(canvas1.width/2, (canvas1.height/2));
        ctx1.scale(1, 0.5);
        ctx1.rotate(45*Math.PI/180);
        ctx1.translate(-(canvas1.width/2), -(canvas1.height/2));
    }

    function unmakeIso() {
        ctx1.translate(canvas1.width, canvas1.height);
        ctx1.scale(1.5, 1.5);
        ctx1.rotate(45*Math.PI/4);
        ctx1.translate(-(canvas1.width/2), -(canvas1.height/2));
    }

    function cube(x,y){
    var faces = [
        [1,-0.5,1,0.5,x,y, "white"],
        [1,-0.5,0,1,x+w,y+(h/2), "afafaf"],
        [1,0.5,0,-1,x,y+h, "grey"]
    ];
   
    $(faces).each(function() {
        var matrix = this;
        ctx1.save();
        ctx1.setTransform(
            matrix[0],
            matrix[1],
            matrix[2],
            matrix[3],
            matrix[4],
            matrix[5]
        );
        
        //ctx1.strokeRect(0, 0, w, h);
        ctx1.fillStyle = matrix[6];
        ctx1.fillRect(0, 0, w, h);
        ctx1.restore();

    });
     
}

function writeMessage(canvas1, message) {
        var hud = canvas2.getContext('2d');
        hud.clearRect(0, 0, canvas2.width, canvas2.height);
        hud.font = '18pt Calibri';
        hud.fillStyle = 'black';
        hud.fillText(message, 10, 25);
      }

function getMousePos(canvas1, evt) {
    var rect = canvas1.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function isoX(x,y) {
    var screenOriginOffsetX = 0;
    var screenOriginOffsetY = 0;
    var adjScreenX = x - screenOriginOffsetX;
    var adjScreenY = y - screenOriginOffsetY;
    var isoX = ((adjScreenY / h/2) + (adjScreenX / w/2)) / 2;
    return isoX;
}

function isoY(x,y) {
    var screenOriginOffsetX = 0;
    var screenOriginOffsetY = 0;
    var adjScreenX = x - screenOriginOffsetX;
    var adjScreenY = y - screenOriginOffsetY;
    var isoY = ((adjScreenY / h/2) - (adjScreenX / w/2)) / 2;
    return isoY; 
}

function isoCoord(x,y) {
    // First, adjust for the offset:
    var adjScreenX = x - 0;
    var adjScreenY = y - 0;
    var adjScreenXW = (x - 0)+w;
    var adjScreenYH = (y - 0)+h;
     
    // Now, retrieve the grid space:
    isoX = ((adjScreenY / (h/2)) + (adjScreenX / (w/2))) / 2;
    isoY = ((adjScreenY / (h/2)) - (adjScreenX / (w/2))) / 2;
    isoXW = ((adjScreenYH / (h/2)) + (adjScreenXW / (w/2))) / 2;
    isoYH = ((adjScreenYH / (h/2)) + (adjScreenXW / (w/2))) / 2;
    var iso = {};
    iso["x"] = isoX;
    iso["y"] = isoY;
    iso["xw"] = isoXW;
    iso["yh"] = isoYH;

    return iso;
}

});