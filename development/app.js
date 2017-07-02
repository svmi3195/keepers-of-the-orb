document.addEventListener('DOMContentLoaded', function () {
    runGame();
});

function runGame(){

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var map = new Tilemap(canvas, ctx);
    map.populate();

    var ui = new UI(map);

    var entrance = [0, Math.floor(map.rows/2) * map.tsize];

    //var enemy = new Enemy([0, Math.floor(map.rows/2) * map.tsize]);

    var objectsManager = new ObjectsManager(ctx, map);

    var mage = new Mage(entrance);
    objectsManager.objects.push(mage);
    objectsManager.movingObjects.push(mage);

    var orb = new Orb([(map.cols - 4) * map.tsize, Math.floor(map.rows/2) * map.tsize]);    
    objectsManager.objects.push(orb);

    objectsManager.sortObjects();
    objectsManager.registerAll();

    //keyboard shortcuts
    document.addEventListener('keypress', function(e){
        //console.log(e.which)
        
        switch (e.which){
            case 114: //r
                map.populate();
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
        var clickedTile = transIndex2to1([Math.floor(x/map.tsize), Math.floor(y/map.tsize)], map);
        if(map.tiles[clickedTile].object){
            ui.onObjectSelect(map.tiles[clickedTile].object);
        }
        clicked.push(clickedTile);         
    };//end of mouse getClickedTile

    gameLoop();

    function gameLoop(){

        if(clicked.length == 2){
            mage.path = findPath(map, clicked[0], clicked[1]);
            mage.path.shift();//prolly should not shift but fix pathfinder: wtf it returns start at head and tail
            clicked.shift();
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
               
        map.render();        
/*
        if(mage.path.length > 0){
            objectsManager.moveObj(mage);
        };*/

        objectsManager.moveAll();
        
        objectsManager.renderAll();
        ui.render(ctx);

        requestAnimationFrame(gameLoop);
    };

};//end of runGame