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

    var enemy = new Enemy([0, Math.floor(map.rows/2) * map.tsize]);

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
        //console.log(transIndex2to1([Math.floor(x/map.tsize), Math.floor(y/map.tsize)], map));
        clicked.push(transIndex2to1([Math.floor(x/map.tsize), Math.floor(y/map.tsize)], map));
        console.log(map); 
    };//end of mouse getClickedTile

    gameLoop();

    function gameLoop(){

        if(clicked.length == 2){
            findPath(map, clicked[0], clicked[1]);
            clicked.shift();
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        map.render();
        enemy.render(ctx);
        enemy.moveX();

        requestAnimationFrame(gameLoop);
    };

};//end of runGame







