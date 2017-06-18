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
    //findPath(map, transIndex([0, Math.floor(map.rows/2) * map.cols], map), transIndex([0, Math.floor(map.rows/2) * map.cols], map));
    findPath(map, transIndex([0,Math.floor(map.rows/2)], map), transIndex([map.cols - 3, Math.floor(map.rows/2)], map));

    var enemy = new Enemy([0, Math.floor(map.rows/2) * map.tsize]);

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

    gameLoop();

    function gameLoop(){
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        map.render();
        enemy.render(ctx);
        enemy.moveX();

        requestAnimationFrame(gameLoop);
    };

};//end of runGame







