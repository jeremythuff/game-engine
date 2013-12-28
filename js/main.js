
$(document).ready(function() {
    
    var numCols = 25
    ,   numRows = 25
    ,   region = []
    ,   hero = {
        "color": "rgba(250,250,250,.25)",
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
        canvas.width = canvas.width;//cleans the canvas
        var cursorX = (canvas.width-(w*numCols))/2;
        var cursorY = (canvas.height-(w*numRows))/2;
        var locX = 1;
        var locY = 1;
       
        makeIso();
        var texture = new Image();
        texture.src = "img/grass.jpg";
        texture.onload = function() {
            for(n=0;n<numRows;n++){

                for(i=0;i<numCols;i++){
                    var thisRegion = {
                        "coord": locX+"-"+locY,
                        "x": cursorX,
                        "y": cursorY,
                        "texture": "grass.jpg",
                        "opacity": 0
                    }
                    region.push(thisRegion);
                    //ctx.strokeRect(cursorX, cursorY, w, h);
                    
                        ctx.drawImage(texture, cursorX, cursorY, w, h);
                    
                    cursorX += w;
                    locX++
                }
                cursorX = (canvas.width-(w*numCols))/2;
                cursorY += h;
                locX = 1;
                locY++;
            }

            //unmakeIso()
            placeHero();
        }
        
            
    }


    ///////////////////
    //EVENT LISTENERS//
    ///////////////////


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
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        reDrawCanvas();
    }

    function reDrawCanvas() {
        hero.lastX = hero.x;
        hero.lastY = hero.y;
        canvas.width = $(window).width();
        canvas.height = $(window).height();
        w = canvas.width/numCols;
        if((w*numRows)>canvas.height)w = canvas.height/numRows;
        h = w;
        drawStuff(w,h);
    }

    function placeHero() {
        clearHero();
        drawHero();
        console.log(hero);
   }

    function drawHero() {
        var heroLoc = hero.x+"-"+hero.y;

        $(region).each(function() {
            if(this.coord == heroLoc) {
                var thisX = this.x;
                var thisY = this.y;
                // console.log(this);
                // ctx.fillStyle=hero.color;
                // ctx.fillRect(this.x, this.y, w, h);
                // ctx.fill();

                var texture = new Image();
                texture.src = "img/"+hero.texture;
                texture.onload = function() {
                    ctx.drawImage(texture, thisX, thisY, w, h);
                }
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
                texture.src = "img/"+this.texture;
                texture.onload = function() {
                    ctx.drawImage(texture, thisX, thisY, w, h);
                    ctx.fillStyle="rgba(250,250,99,"+thisOpacity+")";
                    ctx.fillRect(thisX, thisY, w, h);
                    ctx.fill();
                }
            }
        });
    
    }

    function makeIso() {
        ctx.translate(canvas.width/2, (canvas.height/2));
        ctx.scale(1, 0.5);
        ctx.rotate(45*Math.PI/180);
        ctx.translate(-(canvas.width/2), -(canvas.height/2));
    }

    function unmakeIso() {
        ctx.translate(canvas.width, canvas.height);
        ctx.scale(1.5, 1.5);
        ctx.rotate(45*Math.PI/4);
        ctx.translate(-(canvas.width/2), -(canvas.height/2));
    }


    var grassGrows = setInterval(function() {
        $(region).each(function() {
            if(this.opacity>=0){
                var thisX = this.x;
                var thisY = this.y;
                this.opacity -= .001;
                var thisOpacity = this.opacity;
                var texture = new Image();
                texture.src = "img/"+this.texture;
                texture.onload = function() {
                    ctx.drawImage(texture, thisX, thisY, w, h);
                    ctx.fillStyle="rgba(250,250,99,"+thisOpacity+")";
                    ctx.fillRect(thisX, thisY, w, h);
                    ctx.fill();
                    drawHero();
                }
            }
        });

        grassGrows;
    }, 500);

});