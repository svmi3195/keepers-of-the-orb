document.addEventListener('DOMContentLoaded', function () {
    runGame();
});

function runGame(){

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var tilemap = new Tilemap(canvas, ctx);
    tilemap.populate();

    var ui = new UI(tilemap);

    var entrance = [0, Math.floor(tilemap.rows/2) * tilemap.tsize];

    //var enemy = new Enemy([0, Math.floor(tilemap.rows/2) * tilemap.tsize]);

    var objectsManager = new ObjectsManager(ctx, tilemap);

    var mage = new Mage([1 * tilemap.tsize, (Math.floor(tilemap.rows/2) - 1) * tilemap.tsize]);
    objectsManager.objects.push(mage);
    objectsManager.movingObjects.push(mage);

    var orb = new Orb([(tilemap.cols - 4) * tilemap.tsize, Math.floor(tilemap.rows/2) * tilemap.tsize]);    
    objectsManager.objects.push(orb);

    objectsManager.sortObjects();
    objectsManager.registerAll();

    //keyboard shortcuts
    document.addEventListener('keypress', function(e){
        //console.log(e.which)
        
        switch (e.which){
            case 114: //r
                tilemap.populate();
                tilemap.render();
                break;
            case 103: //g
                tilemap.renderGrid();
                break;
        }
    });//keyboard shortcuts

    var clicked = [];
    //mouseclick event
    canvas.addEventListener("mousedown", getClickedTile, false);

    function getClickedTile(event){
        var x = event.clientX;
        var y = event.clientY;
        var clickedTile = transIndex2to1([Math.floor(x/tilemap.tsize), Math.floor(y/tilemap.tsize)], tilemap);
        if(tilemap.tiles[clickedTile].object){
            ui.onObjectSelect(tilemap.tiles[clickedTile].object);
        }
        clicked.push(clickedTile);         
    };//end of mouse getClickedTile

    gameLoop();

    function gameLoop(){

        if(clicked.length == 2){
            mage.path = findPath(tilemap, clicked[0], clicked[1]);
            mage.path.shift();//prolly should not shift but fix pathfinder: wtf it returns start at head and tail
            clicked.shift();
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
               
        tilemap.render();     

        objectsManager.moveAll();        
        objectsManager.renderAll();

        ui.render(ctx);

        requestAnimationFrame(gameLoop);
    };

};//end of runGame