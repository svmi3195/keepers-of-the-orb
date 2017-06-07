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

    });//end of Tilemap tests

    describe('Enemy', function(){

        var enemy = new Enemy(ctx, [0, 0]);

        it('enemy is not empty object', function(){
            assert.equal(typeof enemy == 'object' && Object.getOwnPropertyNames(enemy).length > 0, true);
        });

        it('x and y of enemy are positive integers or zero', function(){
            assert.equal(Math.floor(enemy.x) == enemy.x && Math.floor(enemy.y) == enemy.y && enemy.x >= 0 && enemy.y >= 0, true);
        });

    });//end of Enemy tests

  
});


