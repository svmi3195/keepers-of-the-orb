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
    this.x = spawnPoint[0];
    this.y = spawnPoint[1];
    this.texture = document.getElementById('mage-1');

    this.render = function(context){
        context.drawImage(this.texture, this.x, this.y);
    };

    this.moveX = function(){
        this.x++;
    };
    this.moveY = function(){
        this.y++;
    };
};