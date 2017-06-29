document.addEventListener('DOMContentLoaded', function () {
    runGame();
});

function runGame(){

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var map = new Tilemap(canvas, ctx);
    map.randomize();

    var entrance = [0, Math.floor(map.rows/2) * map.tsize];

    //var enemy = new Enemy([0, Math.floor(map.rows/2) * map.tsize]);

    var objectsManager = new ObjectsManager();

    var mage = new Mage(entrance);
    objectsManager.objects.push(mage);
    var magePath = [];

    var orb = new Orb([(map.cols - 4) * map.tsize, Math.floor(map.rows/2) * map.tsize]);    
    objectsManager.objects.push(orb);

    objectsManager.sortObjects();

    //keyboard shortcuts
    document.addEventListener('keypress', function(e){
        //console.log(e.which)
        
        switch (e.which){
            case 114: //r
                map.randomize();
                map.render();
                break;
            case 103: //g
                map.renderGrid();
                break;
        }
    });//keyboard shortcuts

    var clicked = [];
    //mouseclick event
    canvas.addEventListener("mousedown", getClickedTile, false);

    function getClickedTile(event){
        var x = event.clientX;
        var y = event.clientY;
        clicked.push(transIndex2to1([Math.floor(x/map.tsize), Math.floor(y/map.tsize)], map));         
    };//end of mouse getClickedTile

    gameLoop();

    function gameLoop(){

        if(clicked.length == 2){
            magePath = findPath(map, clicked[0], clicked[1]);
            magePath.shift();//prolly should not shift but fix pathfinder: wtf it returns start at head and tail
            clicked.shift();
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
               
        map.render();        

        if(magePath.length > 0){
            var mageStartX = transIndex1to2(magePath[magePath.length - 1], map)[0] * map.tsize;
            var mageStartY = transIndex1to2(magePath[magePath.length - 1], map)[1] * map.tsize;
            if(magePath[magePath.length - 1] == magePath[magePath.length - 2] + 1){
                if(mage.x > mageStartX - 40){
                    mage.moveLeft();
                }else{
                    magePath.pop();
                }  
            }else if(magePath[magePath.length - 1] == magePath[magePath.length - 2] - 1){
                if(mage.x < mageStartX + 40){
                    mage.moveRight();
                }else{
                    magePath.pop();
                }
            }else if(magePath[magePath.length - 1] == magePath[magePath.length - 2] - map.cols){
                if(mage.y < mageStartY + 40 - mage.tileOffsetY){
                    mage.moveDown();
                    objectsManager.sortObjects();
                }else{
                    magePath.pop();
                }
            }else if(magePath[magePath.length - 1] == magePath[magePath.length - 2] + map.cols){
                if(mage.y > mageStartY - 40 - mage.tileOffsetY){
                    mage.moveUp();
                    objectsManager.sortObjects();
                }else{
                    magePath.pop();
                }
            }
        };
        
        objectsManager.renderAll(ctx);

        requestAnimationFrame(gameLoop);
    };

};//end of runGame