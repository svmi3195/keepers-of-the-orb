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

    var objectsManager = new ObjectsManager(ctx, tilemap);

    var ui = new UI(tilemap);

    var entrancePos = [0, Math.floor(tilemap.rows/2) * tilemap.tsize];
    var entranceIndex = transIndex2to1([entrancePos[0]  / tilemap.tsize, entrancePos[1] / tilemap.tsize], tilemap);
    var orbPos = [(tilemap.cols - 4) * tilemap.tsize, Math.floor(tilemap.rows/2) * tilemap.tsize];
    var orbIndex = transIndex2to1([orbPos[0]  / tilemap.tsize, orbPos[1] / tilemap.tsize], tilemap);

    var mage = new Mage([1 * tilemap.tsize, (Math.floor(tilemap.rows/2) - 1) * tilemap.tsize]);
    objectsManager.objects.push(mage);
    objectsManager.movingObjects.push(mage);

    var orb = new Orb(orbPos);    
    objectsManager.objects.push(orb);

    objectsManager.sortObjects();
    objectsManager.registerAll();    

    var clicked = [];
    //mouseclick event
    canvas.addEventListener("mousedown", getClickedTile, false);

    function getClickedTile(event){
        var x = event.clientX;
        var y = event.clientY;
        var clickedTile = transIndex2to1([Math.floor(x/tilemap.tsize), Math.floor(y/tilemap.tsize)], tilemap);
        console.log(tilemap.tiles[clickedTile])
        if(tilemap.tiles[clickedTile].object){
            ui.select(tilemap.tiles[clickedTile].object);
        }
        if(ui.selected == mage){
            clicked.push(clickedTile); 
        }
        
    };//end of mouse getClickedTile

    gameLoop();

    function gameLoop(){

        if(clicked.length == 2){
            mage.path = findPath(tilemap, clicked[0], clicked[1]);
            mage.path.shift();//prolly should not shift but fix pathfinder: wtf it returns start at head and tail
            clicked.shift();
        }

        if(tilemap.tiles[entranceIndex].object == null && tilemap.tiles[entranceIndex + 1].object == null && Math.random() < 0.01){
            objectsManager.spawnEnemy();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
               
        tilemap.render();     

        objectsManager.moveAll();        
        objectsManager.renderAll();

        ui.render(ctx);

        requestAnimationFrame(gameLoop);
    };

};//end of runGame