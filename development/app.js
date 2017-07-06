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

    var ui = new UI(tilemap, ctx);

    var entrancePos = [0, Math.floor(tilemap.rows/2) * tilemap.tsize];
    var entranceIndex = transIndex2to1([entrancePos[0]  / tilemap.tsize, entrancePos[1] / tilemap.tsize], tilemap);
    var orbPos = [(tilemap.cols - 4) * tilemap.tsize, Math.floor(tilemap.rows/2) * tilemap.tsize];
    var orbIndex = transIndex2to1([orbPos[0]  / tilemap.tsize, orbPos[1] / tilemap.tsize], tilemap);

    objectsManager.spawnObject(Mage, [1 * tilemap.tsize, (Math.floor(tilemap.rows/2) - 1) * tilemap.tsize]);

    /*
    var mage = new Mage([1 * tilemap.tsize, (Math.floor(tilemap.rows/2) - 1) * tilemap.tsize]);
    for(var i = 0; i < mage.tags.length; i++){
        objectsManager[mage.tags[i]].push(mage);
    }
    */

    var orb = new Orb(orbPos);    
    objectsManager.objects.push(orb);

    objectsManager.sortObjects();
    objectsManager.registerAll();

    var projectile = new Projectile([0,0], [300, 300]);    

    //mouseclick event
    canvas.addEventListener("mousedown", getClickedTile, false);

    function getClickedTile(event){
        var x = event.clientX;
        var y = event.clientY;
        var clickedTile = transIndex2to1([Math.floor(x/tilemap.tsize), Math.floor(y/tilemap.tsize)], tilemap);
        console.log(tilemap.tiles[clickedTile]);

        if(event.ctrlKey){
            objectsManager.shoot(mage, [x,y]);
        }else{
            if(tilemap.tiles[clickedTile].object.length != 0){
                ui.select(tilemap.tiles[clickedTile].object[0]);
            }
            if(ui.selected.name == 'Mage'){//same code for other objects movable by player
                ui.selected.waypoints.push(clickedTile);
                if(ui.selected.waypoints.length == 2){
                    ui.selected.path = findPath(tilemap, ui.selected.waypoints[0], ui.selected.waypoints[1]);
                    ui.selected.path.shift();//prolly should not shift but fix pathfinder: wtf it returns start at head and tail
                    ui.selected.waypoints.shift();
                } 
            }
        } 
        
    };//end of mouse getClickedTile

    gameLoop();

    function gameLoop(){
        
        if(tilemap.tiles[entranceIndex].object.length == 0 && tilemap.tiles[entranceIndex + 1].object.length == 0 && Math.random() < 0.01){
            objectsManager.spawnEnemy();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
               
        tilemap.render();     

        objectsManager.moveAll();        
        objectsManager.renderAll();

        ui.render();

        requestAnimationFrame(gameLoop);
    };

};//end of runGame