var assert = chai.assert;

describe('Keepers of the Orb', function() {

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;    

    describe('Tilemap', function(){

        var tilemap = new Tilemap(canvas, ctx);

        it('cols is positive integer', function(){
            assert.equal(tilemap.cols > 0 && Number.isInteger(tilemap.cols), true);
        });

        it('rows is positive integer', function(){
            assert.equal(tilemap.rows > 0 && Number.isInteger(tilemap.rows), true);
        });

        it('tiles is not an empty array', function(){
            assert.equal(tilemap.tiles.length > 0, true);
        });

        it('getTile returns an array of two', function(){
            assert.lengthOf(tilemap.getTile, 2);
        });

        tilemap.populate();

        it('for wall tiles tile property blocked is true', function(){
            for(var i = 0; i < tilemap.tiles.length; i++){
                    if(tilemap.tiles[i].terrain == 'wall'){
                        assert.equal(tilemap.tiles[i].blocked === true, true);
                    }
            }
        });

        it('for grass tiles tile property blocked is false', function(){
            for(var i = 0; i < tilemap.tiles.length; i++){
                    if(tilemap.tiles[i].terrain == 'grass'){
                        assert.equal(tilemap.tiles[i].blocked === false, true);
                    }
            }
        });

        it('entrance tile is not blocked', function(){
            assert.equal(tilemap.getTile(0, Math.floor(tilemap.rows/2)).blocked === false, true);
        });

        it('orb tile terrain is grass', function(){
            assert.equal(tilemap.getTile(tilemap.cols - 4, Math.floor(tilemap.rows/2)).terrain === 'grass', true);
        });

    });//end of Tilemap tests

    describe('Enemy', function(){

        var enemy = new Enemy(ctx, [0, 0]);

        it('enemy is not an empty object', function(){
            assert.equal(typeof enemy == 'object' && Object.getOwnPropertyNames(enemy).length > 0, true);
        });        

    });//end of Enemy tests

    describe('Pathfinder', function(){

        var tilemap = new Tilemap(canvas, ctx);
        tilemap.populate();
        findPath(tilemap);
        it('after pathfinder did run tiles properties are back to initial values', function(){
            for(var i = 0; i < tilemap.tiles.length; i++){
                assert.equal(
                    tilemap.tiles[i].f == 0 &&
                    tilemap.tiles[i].g == 0 &&
                    tilemap.tiles[i].h == 0 &&
                    tilemap.tiles[i].previous == undefined
                , true);
            }            
        });        
    });//end of pathfinder tests
  
});


