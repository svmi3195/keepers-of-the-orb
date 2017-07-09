function ObjectsManager(context, tilemap){
    this.objects = [];
    this.keepers = [];
    this.movingObjects = [];
    this.staticObjects = [];
    this.movingParticles = [];
    this.autoShooters = [];

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

    this.registerObj = function(obj, index){
        tilemap.tiles[index].object.push(obj);
        obj.index = index;
        if(obj.blocking){
            tilemap.tiles[index].blocked = true;
        }
        if(obj.double){
            tilemap.tiles[index + 1].object.push(obj);
            if(obj.blocking){
                tilemap.tiles[index + 1].blocked = true;
            }
        }        
    };

    this.unregisterObj = function(obj, index){
        removeFromArray(tilemap.tiles[index].object, obj);
        if(obj.blocking){
            tilemap.tiles[index].blocked = false;
        }
        if(obj.double){
            removeFromArray(tilemap.tiles[index + 1].object, obj);
            if(obj.blocking){
                tilemap.tiles[index + 1].blocked = false;
            }
        }
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
                        //this.sortObjects();
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
                        //this.sortObjects();
                    }else{
                        obj.path.pop();
                    }
                }
                this.sortObjects();
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
            }else if(tilemap.tiles[tile].terrain == 'mountains'){
                //add explosions!
                removeFromArray(this.objects, this.movingParticles[j]);
                this.movingParticles.splice(j, 1);                
            }else if(tilemap.tiles[tile].object.length !=0 && (tilemap.tiles[tile].object[0].name == 'Menhir' || tilemap.tiles[tile].object[0].name == 'Stone')){
                //add explosions!
                removeFromArray(this.objects, this.movingParticles[j]);
                this.movingParticles.splice(j, 1);                
            }else if(tilemap.tiles[tile].object.length != 0){
                for(var i = 0; i < tilemap.tiles[tile].object.length; i++){
                    if(tilemap.tiles[tile].object[i].name == 'Enemy' && this.movingParticles[j].enemies.includes('Enemy')){
                        //add explosions!
                        //check sprite collision detection
                        removeFromArray(this.objects, tilemap.tiles[tile].object[i]);
                        removeFromArray(this.movingObjects, tilemap.tiles[tile].object[i]);
                        removeFromArray(tilemap.tiles[tile].object, tilemap.tiles[tile].object[i]);
                        removeFromArray(this.objects, this.movingParticles[j]);
                        this.movingParticles.splice(j, 1);

                        for(var i =0; i < this.keepers.length; i++){
                            if(this.keepers[i].name == 'Mage'){
                                this.keepers[i].frags++;
                            }
                        }
                    }
                }
                            
            }          
        }
    };    

    this.shoot = function(shooter, goal){
        this.spawnObject(Projectile, [shooter.x + 20, shooter.y + 20], goal, shooter);
    };

    this.processShooters = function(){
        if(this.autoShooters.length == 0){
            return -1;
        }

        for(var sIndex = 0; sIndex < this.autoShooters.length; sIndex++){
            var index = this.autoShooters[sIndex].index;
            var index2 = transIndex1to2(index, tilemap);
            var obj = this.autoShooters[sIndex];

            var enemyNames = [];
            if(obj.name == 'The orb'){
                enemyNames.push('Enemy');
            }else if(obj.name == 'Enemy'){
                enemyNames.push('The orb');
                enemyNames.push('Mage');
            }

            var target = function(){
                for(var range = 1; range <= obj.shootingRange; range++){
                    var arr = [];
                    var boxSize = range * 2 + 1; //cols and rows count of selection

                    //make array of tiles for checking
                    for(var y = -range; y <= range; y++){
                        for(var x = 0; x < boxSize; x++){
                            if(transIndex2to1([index2[0] - range + x, index2[1] + y], tilemap)){
                                arr.push(transIndex2to1([index2[0] - range + x, index2[1] + y], tilemap));
                            }
                        }
                    }

                    //check array
                    for(var i = 0; i < arr.length; i++){
                        if(tilemap.tiles[arr[i]].object.length != 0 && enemyNames.includes(tilemap.tiles[arr[i]].object[0].name)){
                            return arr[i];
                        }
                    }                               
                }
                return null;
            }();

            if(target){
                var targetIndex2 = transIndex1to2(target, tilemap);
                this.shoot(obj, [targetIndex2[0] * tilemap.tsize + tilemap.tsize/2, targetIndex2[1] * tilemap.tsize + tilemap.tsize/2]);
            }
        }        
    };

    this.spawnObject = function(Constructor, spawnPoint, goal, shooter){

        var entrancePos = [0, Math.floor(tilemap.rows/2) * tilemap.tsize];
        var magePos = [1 * tilemap.tsize, (Math.floor(tilemap.rows/2) - 1) * tilemap.tsize];
        var orbPos = [(tilemap.cols - 4) * tilemap.tsize, Math.floor(tilemap.rows/2) * tilemap.tsize];

        if(Constructor == Enemy){
            spawnPoint = [0, Math.floor(tilemap.rows/2) * tilemap.tsize];
        }
        var spawnIndex = transIndex2to1([spawnPoint[0]  / tilemap.tsize, spawnPoint[1] / tilemap.tsize], tilemap);

        var obj = new Constructor(spawnPoint, goal);

        //if obj takes two tiles, but 2nd tile is blocked, re-roll obj
        while(obj.double && tilemap.tiles[spawnIndex + 1].blocked){
            obj = new Constructor(spawnPoint);
        }

        for(var i = 0; i < obj.tags.length; i++){
            this[obj.tags[i]].push(obj);
        }

        if(Constructor == Enemy){
            //later may add paths to diagonals; maybe later rewrite using tilemap info
            var paths = [];
            //path to tile before orb
            paths.push(findPath(tilemap, transIndex2to1([entrancePos[0]  / tilemap.tsize, entrancePos[1] / tilemap.tsize], tilemap), transIndex2to1([orbPos[0]  / tilemap.tsize - 1, orbPos[1] / tilemap.tsize], tilemap)));
            //path to tile above orb
            paths.push(findPath(tilemap, transIndex2to1([entrancePos[0]  / tilemap.tsize, entrancePos[1] / tilemap.tsize], tilemap), transIndex2to1([orbPos[0]  / tilemap.tsize, orbPos[1] / tilemap.tsize - 1], tilemap)));
            //path to tile beneath orb
            paths.push(findPath(tilemap, transIndex2to1([entrancePos[0]  / tilemap.tsize, entrancePos[1] / tilemap.tsize], tilemap), transIndex2to1([orbPos[0]  / tilemap.tsize, orbPos[1] / tilemap.tsize + 1], tilemap)));
            //path to tile after orb
            paths.push(findPath(tilemap, transIndex2to1([entrancePos[0]  / tilemap.tsize, entrancePos[1] / tilemap.tsize], tilemap), transIndex2to1([orbPos[0]  / tilemap.tsize + 1, orbPos[1] / tilemap.tsize], tilemap)));

            paths.sort(function(a,b){
                return a.length - b.length
            })
            obj.path = paths[0];
            obj.path.shift();
        }

        if(Constructor == Projectile && (shooter.name == 'Mage' || shooter.name == 'The orb')){
            obj.enemies.push('Enemy');
        }else if(Constructor == Projectile && shooter.name == 'Enemy'){
            obj.enemies.push('Mage');
            obj.enemies.push('The orb');
        }

        if(Constructor != Projectile){
            this.registerObj(obj, spawnIndex);
        }

        this.sortObjects();
        
    };//end of spawnObject

    this.createMenhirs = function(){
        for(var i = 0; i < tilemap.tiles.length; i++){
            if(!tilemap.tiles[i].blocked){
                if(Math.random() < 0.05){
                    var spawnIndex = transIndex1to2(i, tilemap);                    
                    this.spawnObject(Menhir, [spawnIndex[0] * tilemap.tsize, spawnIndex[1] * tilemap.tsize]);
                }
            }
        }
    };

    this.createStones = function(){
        for(var i = 0; i < tilemap.tiles.length; i++){
            if(!tilemap.tiles[i].blocked){
                if(Math.random() < 0.05){
                    var spawnIndex = transIndex1to2(i, tilemap);
                    this.spawnObject(Stone, [spawnIndex[0] * tilemap.tsize, spawnIndex[1] * tilemap.tsize]);
                }
            }
        }
    };

    this.createTests = function(){
        for(var i = 0; i < tilemap.tiles.length; i++){
            if(!tilemap.tiles[i].blocked){
                if(Math.random() < 0.05){
                    var spawnIndex = transIndex1to2(i, tilemap);                    
                    this.spawnObject(Test, [spawnIndex[0] * tilemap.tsize, spawnIndex[1] * tilemap.tsize]);
                }
            }
        }
    };

};//end of ObjectsManager

function Enemy (spawnPoint){
    this.index;
    this.hitpoints = 100;
    this.tileOffsetY = 0;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1];
    this.texture = document.getElementById('enemy-1');
    this.speed = 1;
    this.path = [];
    this.blocking = false;
    this.double = false;
    this.shootingRange = 2;

    this.name = 'Enemy';
    this.tags = ['objects', 'movingObjects', 'autoShooters'];

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
    this.index;
    this.hitpoints = 300;
    this.tileOffsetY = 20; //sprite height is 60px vs 40px tile
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;    
    this.texture = document.getElementById('mage-1');
    this.speed = 2;
    this.waypoints = [];
    this.path = [];
    this.walkingMode = false;
    this.shootingMode = true;
    this.tags = ['objects', 'movingObjects', 'keepers'];
    this.blocking = true;
    this.double = false;

    this.name = 'Mage';
    this.frags = 0;

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
    this.index;
    this.hitpoints = 300;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1];
    this.tileOffsetY = 0;
    this.texture = document.getElementById('enemy-1');
    this.blocking = true;
    this.shootingRange = 2;
    this.double = false;

    this.name = 'The orb';
    this.tags = ['objects', 'autoShooters'];
};

function Projectile(fromPos, toPos){
    this.texture = document.getElementById('projectile-1');
    this.tags = ['objects', 'movingParticles'];
    this.enemies = [];
    this.tileOffsetY = 0;
    this.blocking = false;
    this.double = false;

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
    
};

function Menhir(spawnPoint){
    this.index;
    this.texture = document.getElementById('menhir-' + (Math.floor(Math.random() * 1) + 1)); //multply by textures count
    this.tags = ['objects', 'staticObjects'];
    this.tileOffsetY = 40;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;    
    this.name = 'Menhir';
    this.sleeping = true;
    this.blocking = true;
    this.double = false;
};

function Stone(spawnPoint){
    this.index;
    this.texture = document.getElementById('stone-' + (Math.floor(Math.random() * 3) + 1)); //multply by textures count
    this.tags = ['objects', 'staticObjects'];
    this.tileOffsetY = this.texture.height - 40;
    this.x = spawnPoint[0];
    this.y = spawnPoint[1] - this.tileOffsetY;    
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
    this.name = 'Test';
    this.blocking = true;
    this.double = this.texture.width > 80;
};