var assert = chai.assert;

describe('Keepers of the Orb', function() {

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;    

    describe('Tilemap', function(){

        var map = new Tilemap(canvas, ctx);

        it('cols is positive integer', function(){
            assert.equal(map.cols > 0 && Number.isInteger(map.cols), true);
        });

        it('rows is positive integer', function(){
            assert.equal(map.rows > 0 && Number.isInteger(map.rows), true);
        });

        it('tiles is not an empty array', function(){
            assert.equal(map.tiles.length > 0, true);
        });

        it('getTile returns an array of two', function(){
            assert.lengthOf(map.getTile, 2);
        });

        map.populate();

        it('for wall tiles tile property blocked is true', function(){
            for(var i = 0; i < map.tiles.length; i++){
                    if(map.tiles[i].terrain == 'wall'){
                        assert.equal(map.tiles[i].blocked === true, true);
                    }
            }
        });

        it('for grass tiles tile property blocked is false', function(){
            for(var i = 0; i < map.tiles.length; i++){
                    if(map.tiles[i].terrain == 'grass'){
                        assert.equal(map.tiles[i].blocked === false, true);
                    }
            }
        });

        it('entrance tile is not blocked', function(){
            assert.equal(map.getTile(0, Math.floor(map.rows/2)).blocked === false, true);
        });

        it('orb tile terrain is grass', function(){
            assert.equal(map.getTile(map.cols - 4, Math.floor(map.rows/2)).terrain === 'grass', true);
        });

    });//end of Tilemap tests

    describe('Enemy', function(){

        var enemy = new Enemy(ctx, [0, 0]);

        it('enemy is not an empty object', function(){
            assert.equal(typeof enemy == 'object' && Object.getOwnPropertyNames(enemy).length > 0, true);
        });        

    });//end of Enemy tests

    describe('Pathfinder', function(){

        var map = new Tilemap(canvas, ctx);
        map.populate();
        findPath(map);
        it('after pathfinder did run tiles properties are back to initial values', function(){
            for(var i = 0; i < map.tiles.length; i++){
                assert.equal(
                    map.tiles[i].f == 0 &&
                    map.tiles[i].g == 0 &&
                    map.tiles[i].h == 0 &&
                    map.tiles[i].previous == undefined
                , true);
            }            
        });        
    });//end of pathfinder tests
  
});


