var assert = chai.assert;

describe('Keepers of the Orb', function() {

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var map = new Tilemap(canvas, ctx);

    describe('Tilemap', function(){

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

  
});


