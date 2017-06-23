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
    //findPath(map, transIndex2to1([0, Math.floor(map.rows/2) * map.cols], map), transIndex2to1([0, Math.floor(map.rows/2) * map.cols], map));
    //findPath(map, transIndex2to1([0,Math.floor(map.rows/2)], map), transIndex2to1([map.cols - 3, Math.floor(map.rows/2)], map));

    var entrance = [0, Math.floor(map.rows/2) * map.tsize];

    //var enemy = new Enemy([0, Math.floor(map.rows/2) * map.tsize]);

    var mage = new Mage(entrance);
    var magePath = [];

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
            magePath.shift();//prolly should not shift but fix pathfinder wtf it returns start at head and tail
            clicked.shift();
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        map.render();
        //enemy.render(ctx);
        //enemy.moveX();

        if(magePath.length > 0){
            var mageStartX = transIndex1to2(magePath[magePath.length - 1], map)[0] * map.tsize;
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
            }
        };

        mage.render(ctx);


        requestAnimationFrame(gameLoop);
    };

};//end of runGame







