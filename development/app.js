document.addEventListener('DOMContentLoaded', function () {
    runGame();
});

function runGame(){

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var map = new Tilemap(5,5, ctx);
    map.render();

};//end of runGame

function Tilemap(cols, rows, contex) {
    this.cols = cols;
    this.rows = rows;
    this.tsize = 40; //tile size (40 x 40)
    this.tiles = [];
    for(var i = 0; i < this.cols * this.rows; i++){
        this.tiles.push(0);
    };
    this.getTile = function(col, row) {
        return this.tiles[row * this.cols + col]
    };
    this.render = function(){
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                var tile = this.getTile(c, r);
                if (tile == 0) {   
                    contex.fillRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);
                    contex.strokeStyle = 'white';
                    contex.strokeRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);        
                }
            }
        }
    }
};//end of Tilemap