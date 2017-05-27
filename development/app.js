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

    document.addEventListener('keypress', function(e){
        //console.log(e.which)
        
        switch (e.which){
            case 114: //r
                map.render();
                break;
            case 103: //g
                map.renderGrid();
                break;
            case 116: //t
                map.renderTexture('grass-');
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
                    context.fillStyle = 'green';   
                    context.fillRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);                    
                }
            }
        }
    };//end of Tilemap render
    this.renderGrid = function(){
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                var tile = this.getTile(c, r);
                if (tile == 0) {
                    context.strokeStyle = 'white';
                    context.strokeRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);        
                }
            }
        }
    };// end of Tilemap render grid
    this.renderTexture = function(t){

        var textures = [];

        if(t == 'grass-'){            
            for(var i = 1; i <= 7; i++){
                textures.push(document.getElementById((t + i)));
            }
        } 
     

        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                var tile = this.getTile(c, r);
                if (tile == 0) {
                    context.drawImage(textures[Math.floor(Math.random() * textures.length)], c * this.tsize, r * this.tsize);
                }
            }
        }
    };//end of Tilemap render texture

};//end of Tilemap