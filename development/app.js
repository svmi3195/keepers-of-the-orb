document.addEventListener('DOMContentLoaded', function () {
    runGame();
});

function runGame(){

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var map = new Tilemap(canvas, ctx);
    map.render();

    var enemy = new Enemy(ctx, [0, Math.floor(map.rows/2)]);
    enemy.render();

    document.addEventListener('keypress', function(e){
        //console.log(e.which)
        
        switch (e.which){
            case 114: //r
                map.randomizeMap();
                map.render();
                break;
            case 103: //g
                map.renderGrid();
                break;
        }
    });//keyboard shortcuts

};//end of runGame

function Tilemap(canvas, context) {    
    this.tsize = 40; //tile size (40 x 40)
    this.cols = Math.ceil(canvas.width / this.tsize);
    this.rows = Math.ceil(canvas.height / this.tsize);

    this.tiles = [];
    for(var i = 0; i < this.cols * this.rows; i++){
        this.tiles.push(2);
    };

    this.textures = [];         
    for(var j = 1; j <= 7; j++){ //change when have spritesheet
        this.textures.push(document.getElementById(('grass-' + j)));
    }

    this.getTile = function(col, row) {
        return this.tiles[row * this.cols + col]
    };

    this.render = function(){
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                var tile = this.getTile(c, r);
                if (tile == 1) {                    
                    context.fillStyle = 'green';   
                    context.fillRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);                    
                }else if (tile == 2){
                    context.drawImage(this.textures[Math.floor(Math.random() * this.textures.length)], c * this.tsize, r * this.tsize);
                }else if (tile == 3){
                    context.fillStyle = 'gray';   
                    context.fillRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);
                }
            }
        }
    };//end of Tilemap render

    this.renderGrid = function(){
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                context.strokeStyle = 'white';
                context.strokeRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);
            }
        }
    };// end of Tilemap render grid

    this.update = function(col, row, value){
        this.tiles[row * this.cols + col] = value;
    }

    this.randomizeMap = function(){
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                if(c == 0 && r == Math.floor(this.rows/2)){ //entrance
                    this.update(c, r, 1);
                }else if(c == this.cols - 3 && r == Math.floor(this.rows/2)){ //orb
                    this.update(c, r, 1);
                }else if(Math.random() < 0.1){
                    this.update(c, r, 3);
                }else{
                    this.update(c, r, 2);
                }
            }
        }
    };//end of randomize map

};//end of Tilemap

function Enemy (context, spawnTile){
    this.hitpoints = 100;
    this.x = spawnTile[0];
    this.y = spawnTile[1];

    this.render = function(){
        var radius = 20;
        context.fillStyle = 'red';
        context.arc((this.x + (40 / 2)), (this.y + (40 / 2)), radius, 0, 2 * Math.PI, true);
        context.fill();
    }
};