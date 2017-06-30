function ObjectsManager(){
    this.objects = [];

    this.renderObject = function(context, object){
        context.drawImage(object.texture, object.x, object.y);
    };

    this.renderAll = function(context){
        for(var i = 0; i < this.objects.length; i++){
            context.drawImage(this.objects[i].texture, this.objects[i].x, this.objects[i].y);
        }
    };

    this.sortObjects = function(){
        this.objects.sort(function(a,b){
            return (a.y + a.tileOffsetY) - (b.y + b.tileOffsetY);
        });
    };

    this.registerAll = function(map){
        var index;
        for(var i = 0; i < this.objects.length; i++){
            index = transIndex2to1([this.objects[i].x / map.tsize, (this.objects[i].y + this.objects[i].tileOffsetY) / map.tsize], map);
            map.tiles[index].object = this.objects[i];
        }
    };
};//end of ObjectsManager

function Enemy (spawnPoint){
    this.hitpoints = 100;
    this.tileOffsetY = 0;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1];
    this.texture = document.getElementById('enemy-1');

    this.name = 'Enemy';

    this.moveX = function(){
        this.x++;
    };
};

function Mage (spawnPoint){
    this.hitpoints = 300;
    this.tileOffsetY = 20; //sprite height is 60px vs 40px tile
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;    
    this.texture = document.getElementById('mage-1');
    this.speed = 2;
    this.path = [];

    this.name = 'Mage';

    this.moveRight = function(){
        this.x += this.speed;
    };

    this.moveLeft = function(){
        this.x -= this.speed;
    };

    this.moveUp = function(){
        this.y -= this.speed;
    };

    this.moveDown = function(){
        this.y += this.speed;
    };
};

function Orb(spawnPoint){
    this.hitpoints = 300;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1];
    this.tileOffsetY = 0;
    this.texture = document.getElementById('enemy-1');

    this.name = 'The orb';
};