function ObjectsManager(context, tilemap){
    this.objects = [];
    this.movingObjects = [];
    this.movingParticles = [];

    this.renderObject = function(object){
        context.drawImage(object.texture, object.x, object.y);
    };

    this.renderAll = function(){
        for(var i = 0; i < this.objects.length; i++){
            context.drawImage(this.objects[i].texture, this.objects[i].x, this.objects[i].y);
        }
    };

    this.sortObjects = function(){
        this.objects.sort(function(a,b){
            return (a.y + a.tileOffsetY) - (b.y + b.tileOffsetY) != 0 ? (a.y + a.tileOffsetY) - (b.y + b.tileOffsetY) : (a.x) - (b.x) ;
        });
    };

    this.registerAll = function(){
        var index;
        for(var i = 0; i < this.objects.length; i++){
            index = transIndex2to1([this.objects[i].x / tilemap.tsize, (this.objects[i].y + this.objects[i].tileOffsetY) / tilemap.tsize], tilemap);
            tilemap.tiles[index].object = this.objects[i];
        }
    };

    this.registerObj = function(obj, index){
        tilemap.tiles[index].object = obj;
    };

    this.unregisterObj = function(obj, index){
        tilemap.tiles[index].object = null;
    };

    this.moveObj = function (obj){
        var startX = transIndex1to2(obj.path[obj.path.length - 1], tilemap)[0] * tilemap.tsize;
        var startY = transIndex1to2(obj.path[obj.path.length - 1], tilemap)[1] * tilemap.tsize;

                if(obj.path[obj.path.length - 1] == obj.path[obj.path.length - 2] + 1){
                    if(obj.x > startX - 40){
                        obj.moveLeft();
                        if(obj.x % tilemap.tsize >= 0.5){
                            this.unregisterObj(obj, transIndex2to1([Math.ceil(obj.x / tilemap.tsize), (obj.y + obj.tileOffsetY) / tilemap.tsize], tilemap));
                            this.registerObj(obj, transIndex2to1([Math.floor(obj.x / tilemap.tsize), (obj.y + obj.tileOffsetY) / tilemap.tsize], tilemap));
                        }
                    }else{
                        obj.path.pop();
                    }  
                }else if(obj.path[obj.path.length - 1] == obj.path[obj.path.length - 2] - 1){
                    if(obj.x < startX + 40){
                        obj.moveRight();
                        if(obj.x % tilemap.tsize >= 0.5){
                            this.unregisterObj(obj, transIndex2to1([Math.floor(obj.x / tilemap.tsize), (obj.y + obj.tileOffsetY) / tilemap.tsize], tilemap));
                            this.registerObj(obj, transIndex2to1([Math.ceil(obj.x / tilemap.tsize), (obj.y + obj.tileOffsetY) / tilemap.tsize], tilemap));
                        }
                    }else{
                        obj.path.pop();
                    }
                }else if(obj.path[obj.path.length - 1] == obj.path[obj.path.length - 2] - tilemap.cols){
                    if(obj.y < startY + 40 - obj.tileOffsetY){
                        obj.moveDown();
                        if(obj.y % tilemap.tsize >= 0.5){
                            this.unregisterObj(obj, transIndex2to1([obj.x / tilemap.tsize, Math.floor((obj.y + obj.tileOffsetY) / tilemap.tsize)], tilemap));
                            this.registerObj(obj, transIndex2to1([obj.x / tilemap.tsize, Math.ceil((obj.y + obj.tileOffsetY) / tilemap.tsize)], tilemap));
                        }
                        this.sortObjects();
                    }else{
                        obj.path.pop();
                    }
                }else if(obj.path[obj.path.length - 1] == obj.path[obj.path.length - 2] + tilemap.cols){
                    if(obj.y > startY - 40 - obj.tileOffsetY){
                        obj.moveUp();
                        if(obj.y % tilemap.tsize >= 0.5){
                            this.unregisterObj(obj, transIndex2to1([obj.x / tilemap.tsize, Math.ceil((obj.y + obj.tileOffsetY) / tilemap.tsize)], tilemap));
                            this.registerObj(obj, transIndex2to1([obj.x / tilemap.tsize, Math.floor((obj.y + obj.tileOffsetY) / tilemap.tsize)], tilemap));
                        }
                        this.sortObjects();
                    }else{
                        obj.path.pop();
                    }
                }
    };//end of moveObj

    this.moveAll = function(){        
        for(var i = 0; i < this.movingObjects.length; i++){
            if(this.movingObjects[i].path.length > 0){
                this.moveObj(this.movingObjects[i]);
            }
        }

        for(var j = this.movingParticles.length - 1; j >=0 ; j--){

            this.movingParticles[j].move();

            var tile = transIndex2to1([Math.floor(this.movingParticles[j].x / tilemap.tsize), Math.floor(this.movingParticles[j].y / tilemap.tsize)], tilemap);

            if(this.movingParticles[j].x <= 5){
                removeFromArray(this.objects, this.movingParticles[j]);
                this.movingParticles.splice(j, 1);                
            }else if(tilemap.tiles[tile].terrain == 'wall' || tilemap.tiles[tile].terrain == 'mountains'){
                //add explosions!
                removeFromArray(this.objects, this.movingParticles[j]);
                this.movingParticles.splice(j, 1);                
            }else if(tilemap.tiles[tile].object && tilemap.tiles[tile].object.name == 'Enemy'){
                //add explosions!
                removeFromArray(this.objects, tilemap.tiles[tile].object);
                removeFromArray(this.movingObjects, tilemap.tiles[tile].object);
                tilemap.tiles[tile].object = null;
                removeFromArray(this.objects, this.movingParticles[j]);
                this.movingParticles.splice(j, 1);                
            }

            /*

            if(this.movingParticles[j].d > 100){
                this.movingParticles.splice(j, 1);
            }else{
                this.movingParticles[j].move();
        }

                var tile = transIndex2to1([Math.floor(this.movingParticles[j].x / tilemap.tsize), Math.floor(this.movingParticles[j].y / tilemap.tsize)], tilemap);

                if(tilemap.tiles[tile].object && tilemap.tiles[tile].object.name == 'Enemy'){
                    this.movingParticles.splice(j, 1);
                }
        }*/            
        }
    };

    this.spawnEnemy = function(){

        var entrancePos = [0, Math.floor(tilemap.rows/2) * tilemap.tsize];
        var entranceIndex = transIndex2to1([entrancePos[0]  / tilemap.tsize, entrancePos[1] / tilemap.tsize], tilemap);
        var orbPos = [(tilemap.cols - 4) * tilemap.tsize, Math.floor(tilemap.rows/2) * tilemap.tsize];
        var orbIndex = transIndex2to1([orbPos[0]  / tilemap.tsize, orbPos[1] / tilemap.tsize], tilemap);

        var enemy = new Enemy(entrancePos);
        this.objects.push(enemy);
        this.movingObjects.push(enemy);
        enemy.path = findPath(tilemap, transIndex2to1([entrancePos[0]  / tilemap.tsize, entrancePos[1] / tilemap.tsize], tilemap), transIndex2to1([orbPos[0]  / tilemap.tsize, orbPos[1] / tilemap.tsize], tilemap));
        enemy.path.shift();

        this.registerObj(enemy, entranceIndex);
    };//end of spawn enemy

    this.shoot = function(shooter, goal){
        var projectile = new Projectile([shooter.x + 20, shooter.y + 20], goal);
        this.objects.push(projectile);
        this.movingParticles.push(projectile);
    };

};//end of ObjectsManager

function Enemy (spawnPoint){
    this.hitpoints = 100;
    this.tileOffsetY = 0;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1];
    this.texture = document.getElementById('enemy-1');
    this.speed = 1;
    this.path = [];

    this.name = 'Enemy';

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

function Mage (spawnPoint){
    this.hitpoints = 300;
    this.tileOffsetY = 20; //sprite height is 60px vs 40px tile
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;    
    this.texture = document.getElementById('mage-1');
    this.speed = 2;
    this.path = [];
    this.walkingMode = false;
    this.shootingMode = true;

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

function Projectile(fromPos, toPos){
    this.texture = document.getElementById('projectile-1');

    this.x = fromPos[0];
    this.y = fromPos[1];
    //deltas
    this.dx = toPos[0] - fromPos[0];
    this.dy = toPos[1] - fromPos[1];
    //signs
    this.sx = this.dx >= 0 ? 1 : -1;
    this.sy = this.dy >= 0 ? 1 : -1;
    //coefficients
    this.coefX = Math.abs(this.dx / this.dy);    
    this.coefY = Math.abs(this.dy / this.dx);

    this.speed = 5;
    this.d = 0;

    this.move = function(){
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
    }
    
}