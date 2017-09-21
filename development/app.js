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
    var magePos = [1 * tilemap.tsize, (Math.floor(tilemap.rows/2) - 1) * tilemap.tsize];
    var orbPos = [(tilemap.cols - 4) * tilemap.tsize, Math.floor(tilemap.rows/2) * tilemap.tsize];

    var orbIndex = transIndex2to1([orbPos[0]  / tilemap.tsize, orbPos[1] / tilemap.tsize], tilemap);
    var entranceIndex = transIndex2to1([entrancePos[0]  / tilemap.tsize, entrancePos[1] / tilemap.tsize], tilemap);

    objectsManager.spawnObject(Mage, magePos);
    objectsManager.spawnObject(Orb, orbPos);
    objectsManager.createStones();
    objectsManager.createMenhirs();
    //objectsManager.createTests();

    objectsManager.sortObjects();

    //mouseclick event
    canvas.addEventListener("mousedown", clickHandler, false);

    function clickHandler(event){
        var xClicked = event.clientX;
        var yClicked = event.clientY;
        var clickedTile = transIndex2to1([Math.floor(xClicked/tilemap.tsize), Math.floor(yClicked/tilemap.tsize)], tilemap);
        console.log(tilemap.tiles[clickedTile]);

        if(event.ctrlKey){//if ctrl pressed - shoot
            objectsManager.shoot(objectsManager.keepers[0], [xClicked,yClicked]); //can later change to selected keeper, if add more
        }else{//if object or button selected
            if(tilemap.tiles[clickedTile].object.length != 0){//check if static object selected
                ui.select(tilemap.tiles[clickedTile].object[0]);
            }else{
                if(ui.buttons.length > 0){//check if button pressed
                    for(var i = 0; i < ui.buttons.length; i++){
                        if (rectPointCollision(ui.buttons[i], {x: xClicked, y: yClicked})){
                            ui.btnPressed(ui.buttons[i]);
                        }
                    }
                }
                if(objectsManager.movingObjects.length !=0){//check if moving object selected
                    for(var i = 0; i < objectsManager.movingObjects.length; i++){
                        if(rectPointCollision(objectsManager.movingObjects[i], {x: xClicked, y: yClicked})){
                            ui.select(objectsManager.movingObjects[i]);
                        }
                    }
                }
            }            
        }
        
        //mage moving
        if(!event.ctrlKey && ui.selected && ui.selected.name == 'Mage' && !tilemap.tiles[clickedTile].blocked){//same code for other objects movable by player
                ui.selected.waypoints.push(clickedTile);
                if(ui.selected.waypoints.length == 2){
                    ui.selected.path = findPath(tilemap, ui.selected.waypoints[0], ui.selected.waypoints[1]);
					if(ui.selected.path){
						ui.selected.path.shift();//prolly should not shift but fix pathfinder: wtf it returns start at head and tail
						ui.selected.waypoints.shift();
					}                    
            } 
        }
        
    };//end of mouse clickHandler

    gameLoop();

    function gameLoop(){
        
        if(objectsManager.movingObjects[objectsManager.movingObjects.length - 1].x > 50 && Math.random() < 0.01){
            objectsManager.spawnObject(Enemy);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
               
        tilemap.render();
        objectsManager.processShooters();
		objectsManager.processExplosions();

        objectsManager.moveAll();        
        objectsManager.renderAll();

        ui.render();

        requestAnimationFrame(gameLoop);
    };

};//end of runGame