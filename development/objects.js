function MovingObj(x, y, s){
	this.x = x;
	this.y = y;
	this.speed = s;
}

MovingObj.prototype.moveRight = function(){
        this.x += this.speed;
};
MovingObj.prototype.moveLeft = function(){
        this.x -= this.speed;
};
MovingObj.prototype.moveUp = function(){
        this.y -= this.speed;
};
MovingObj.prototype.moveDown = function(){
        this.y += this.speed;
};

function Enemy (spawnPoint){	
	MovingObj.call(this, spawnPoint[0], spawnPoint[1], 0.5);	
    this.index;
    this.hitpoints = 100;
    this.tileOffsetY = 0;
    this.texture = document.getElementById('enemy-1');
    this.width = this.texture.width;
    this.height = this.texture.height;  
    this.path = [];
    this.blocking = false;
    this.double = false;
    this.shootingRange = 2;
    this.lastTimeShoot = 0;
    this.readyToShoot = true;
    this.name = 'Enemy';
    this.tags = ['objects', 'movingObjects'];    
};

Enemy.prototype = Object.create(MovingObj.prototype);

function Mage (spawnPoint){
	this.tileOffsetY = 20; //sprite height is 60px vs 40px tile
	MovingObj.call(this, spawnPoint[0], spawnPoint[1] - this.tileOffsetY, 2);
    this.index;
    this.hitpoints = 300;    
    this.texture = document.getElementById('mage-1');
    this.width = this.texture.width;
    this.height = this.texture.height;
    this.waypoints = [];
    this.path = [];
    this.walkingMode = false;
    this.shootingMode = true;
    this.tags = ['objects', 'movingObjects', 'keepers'];
    this.blocking = true;
    this.double = false;
    this.lastTimeShoot = 0;
    this.readyToShoot = true;
    this.name = 'Mage';
    this.frags = 0;
    this.attacksWith = 'magic';
    this.availableAttacks = ['magic', 'blood'];        
};

Mage.prototype = Object.create(MovingObj.prototype);

function Orb(spawnPoint){
    this.index;
    this.hitpoints = 300;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1];
    this.tileOffsetY = 0;
    this.texture = document.getElementById('orb-1');
    this.width = this.texture.width;
    this.height = this.texture.height;
    this.blocking = true;
    this.shootingRange = 1;
    this.double = false;

    this.lastTimeShoot = 0;
    this.readyToShoot = true;
	this.animateShooting = false;

    this.name = 'The orb';
    this.tags = ['objects', 'autoShooters'];
    this.frags = 0;

    this.attacksWith = 'light';
    this.availableAttacks = ['light', 'dark'];
};

function Rune(spawnPoint){
    this.index;
    this.texture = document.getElementById('rune-1');
    this.tags = ['objects', 'runes'];
    this.tileOffsetY = 0;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;
    this.width = this.texture.width;
    this.height = this.texture.height;    
    this.name = 'Rune';
    this.blocking = true;
};

function Projectile(fromPos, toPos, shooter){
    this.name = 'Projectile';
    this.shooter = shooter;
    this.type = shooter.attacksWith || 'magic';    
    this.texture = document.getElementById('projectile-' + this.type);
    this.width = this.texture.width;
    this.height = this.texture.height;
    this.tags = ['objects', 'movingParticles'];    
    this.tileOffsetY = 0;
    this.blocking = false;
    this.double = false;

    this.x = fromPos[0];
    this.y = fromPos[1];
	
	this.prevX = this.x;
	this.prevY = this.y;

    this.goalX = toPos[0];
    this.goalY = toPos[1];

    //deltas
    this.dx = toPos[0] - fromPos[0];
    this.dy = toPos[1] - fromPos[1];
    //signs
    this.sx = this.dx >= 0 ? 1 : -1;
    this.sy = this.dy >= 0 ? 1 : -1;
    //coefficients
    this.coefX = Math.abs(this.dx / this.dy);    
    this.coefY = Math.abs(this.dy / this.dx);

    this.speed = 3;
    this.d = 0;    
};

Projectile.prototype.move = function(){
    if(this.coefX < this.coefY){
        this.x += this.speed * this.sx * this.coefX;
        this.y += this.speed * this.sy;
    }else if(this.coefX > this.coefY){
        this.x += this.speed * this.sx;
        this.y += this.speed * this.sy * this.coefY;
    }else{
        this.x += this.speed * this.sx;
        this.y += this.speed * this.sy;
    }

    this.d += this.speed;
};

function Explosion(spawnPoint){
	this.frameTime = Date.now();
	this.frame = 0;
	this.x = spawnPoint[0];
    this.y = spawnPoint[1];
	this.textures = [];
	for(var i = 1; i <=10; i++){
		this.textures.push(document.getElementById('explosion-' + i));
	}
	this.texture = this.textures[this.frame];
	this.width = this.texture.width;
    this.height = this.texture.height;
    this.tags = ['objects', 'explosions'];	
	
};

function Menhir(spawnPoint){
    this.index;
    this.texture = document.getElementById('menhir-1');
    this.tags = ['objects', 'staticObjects'];
    this.tileOffsetY = 40;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;
    this.width = this.texture.width;
    this.height = this.texture.height;    
    this.name = 'Menhir';
    this.sleeping = true;
    this.blocking = true;
    this.double = false;
    this.attacksWith = null;

    this.awakensWith = ['grass', 'mageblood'];
};

Menhir.prototype.awaken = function(awakeningSource){
        this.sleeping = false;
        //also make it autoshooter

        switch(awakeningSource){
            case 'mageblood':
                this.texture = document.getElementById('menhir-red');
                break;
            case 'grass':
                this.texture = document.getElementById('menhir-green');
                break;    
        }

    }

function Stone(spawnPoint){
    this.index;
    this.texture = document.getElementById('stone-' + (Math.floor(Math.random() * 3) + 1)); //multply by textures count
    this.tags = ['objects', 'staticObjects'];
    this.tileOffsetY = this.texture.height - 40;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;
    this.width = this.texture.width;
    this.height = this.texture.height;    
    this.name = 'Stone';
    this.blocking = true;
    this.double = this.texture.width > 80;
};


function Test(spawnPoint){
    this.index;
    this.texture = document.getElementById('test-1');
    this.tags = ['objects', 'staticObjects'];
    this.tileOffsetY = this.texture.height - 40;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;
    this.width = this.texture.width;
    this.height = this.texture.height;    
    this.name = 'Test';
    this.blocking = true;
    this.double = this.texture.width > 80;
};