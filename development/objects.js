function Enemy (spawnPoint){
    this.hitpoints = 100;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1];
    this.texture = document.getElementById('enemy-1');

    this.render = function(context){
        context.drawImage(this.texture, this.x, this.y);
    };

    this.moveX = function(){
        this.x++;
    };
};

function Mage (spawnPoint){
    this.hitpoints = 300;
    this.tileOffsetY = 20; //sprite height is 60px vs 40px tile
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;
    this.speed = 2;
    this.texture = document.getElementById('mage-1');

    this.render = function(context){
        context.drawImage(this.texture, this.x, this.y);
    };

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
    this.texture = document.getElementById('enemy-1');

    this.render = function(context){
        context.drawImage(this.texture, this.x, this.y);
    };
}