function ObjectsManager(context, tilemap){
    this.objects = [];
    this.keepers = [];
    this.movingObjects = [];
    this.staticObjects = [];
    this.movingParticles = [];
    this.autoShooters = [];
    this.explosions = [];
    
    this.entrancePos = [0, Math.floor(tilemap.rows/2) * tilemap.tsize];
    this.magePos = [1 * tilemap.tsize, (Math.floor(tilemap.rows/2) - 1) * tilemap.tsize];
    this.orbPos = [(tilemap.cols - 4) * tilemap.tsize, Math.floor(tilemap.rows/2) * tilemap.tsize];

    this.entranceIndex = transIndex2to1([this.entrancePos[0]  / tilemap.tsize, this.entrancePos[1] / tilemap.tsize], tilemap);
    this.orbIndex = transIndex2to1([this.orbPos[0]  / tilemap.tsize, this.orbPos[1] / tilemap.tsize], tilemap);
    this.mageIndex = transIndex2to1([this.magePos[0]  / tilemap.tsize, this.magePos[1] / tilemap.tsize], tilemap);

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
        //prevent from registering multiple times for same tile
        if(tilemap.tiles[index].object.includes(obj)){
            return 0;
        }
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
                    }else{
                        obj.path.pop();
                    }  
                }else if(obj.path[obj.path.length - 1] == obj.path[obj.path.length - 2] - 1){
                    if(obj.x < startX + 40){
                        obj.moveRight();                        
                    }else{
                        obj.path.pop();
                    }
                }else if(obj.path[obj.path.length - 1] == obj.path[obj.path.length - 2] - tilemap.cols){
                    if(obj.y < startY + 40 - obj.tileOffsetY){
                        obj.moveDown();                        
                    }else{
                        obj.path.pop();
                    }
                }else if(obj.path[obj.path.length - 1] == obj.path[obj.path.length - 2] + tilemap.cols){
                    if(obj.y > startY - 40 - obj.tileOffsetY){
                        obj.moveUp();
                    }else{
                        obj.path.pop();
                    }
                }
                this.sortObjects();
    };//end of moveObj

    this.moveAll = function(){        
        for(var i = 0; i < this.movingObjects.length; i++){
            if(this.movingObjects[i].path && this.movingObjects[i].path.length > 0){
                this.moveObj(this.movingObjects[i]);
            }
        }

        for(var j = this.movingParticles.length - 1; j >=0 ; j--){

            var particle = this.movingParticles[j];
            var tile = transIndex2to1([Math.floor(particle.x / tilemap.tsize), Math.floor(particle.y / tilemap.tsize)], tilemap);

            if(particle.x <= 5){
                removeFromArray(this.objects, particle);
                this.movingParticles.splice(j, 1);                
            }else if(tilemap.tiles[tile].terrain == 'mountains'){
                this.spawnObject(Explosion, [particle.x - 20 - 4, particle.y - 20 - 4]);
				
                removeFromArray(this.objects, particle);
                this.movingParticles.splice(j, 1);                
            }else if(tilemap.tiles[tile].object.length !=0 && (tilemap.tiles[tile].object[0].name == 'Menhir' || tilemap.tiles[tile].object[0].name == 'Stone')){
                this.spawnObject(Explosion, [particle.x - 20 - 4, particle.y - 20 - 4]);
                removeFromArray(this.objects, particle);
                this.movingParticles.splice(j, 1);                
            }else if(Math.abs(particle.x - particle.goalX) < 3 &&
                     Math.abs(particle.y - particle.goalY) < 3){
                        removeFromArray(this.objects, particle);
                        this.movingParticles.splice(j, 1);
            }else if(this.movingObjects.length != 0){
                for(var i = this.movingObjects.length - 1; i >= 0; i--){
                    var obj = this.movingObjects[i];
                    if(obj.name == 'Enemy' && rectsCollision(obj, particle)){
						this.spawnObject(Explosion, [particle.x - 20 - 4, particle.y - 20 - 4]);
                        particle.shooter.frags++;
                        removeFromArray(this.objects, obj);
                        removeFromArray(this.movingObjects, obj);
                        removeFromArray(this.objects, particle);
                        this.movingParticles.splice(j, 1);
                    }
                }
            }
            if(particle){
                particle.move(); 
            }
                     
        }
    };    

    this.shoot = function(shooter, goal){
        if(shooter.readyToShoot){
            this.spawnObject(Projectile, [shooter.x + 20, shooter.y + 20], goal, shooter);

            if(shooter.name != 'Mage'){
                shooter.readyToShoot = false;
                shooter.lastTimeShoot = Date.now();
            }            
        }
    };

    this.processShooters = function(){
        
        for(var i = 0; i < this.autoShooters.length; i++){

            var obj = this.autoShooters[i];

            //check readyness
            if(!obj.readyToShoot && Date.now() - obj.lastTimeShoot > 3000){
                obj.readyToShoot = true;                
            };
			
			//shooting
			if(obj.readyToShoot == true){
				var enemyNames = [];
				if(obj.name == 'The orb'){
					enemyNames.push('Enemy');
				}else if(obj.name == 'Enemy'){
					enemyNames.push('The orb');
					enemyNames.push('Mage');
				};

				var objSightField = {
					x: obj.x - obj.shootingRange,
					y: obj.y - obj.shootingRange,
					width: obj.width + obj.shootingRange,
					height: obj.height + obj.shootingRange,
				};

				var target = null;

				for(var j = this.movingObjects.length - 1; j >= 0; j--){
					var moving = this.movingObjects[j];
					if(rectsCollision(moving, objSightField) && enemyNames.includes(moving.name)){
						target = moving;    
					}
				}

				if(target){
					this.shoot(obj, [target.x + Math.floor(target.width / 2), target.y + Math.floor(target.height / 2)]);
					
					//start shooting animations
					obj.animateShooting = true;
					obj.texture = document.getElementById(obj.texture.id + '-shooting');
				}
			}//end of shooting block
			
			//process shooting animations
			if(obj.animateShooting && Date.now() - obj.lastTimeShoot > 200){
				obj.animateShooting = false;
				obj.texture = document.getElementById(obj.texture.id.slice(0, obj.texture.id.indexOf('-shooting')));
			}//end of process animations
        }                
    };
	
	this.processExplosions = function(){
		if(this.explosions.length == 0){
			return 0;
		}
		
		for(var i = 0; i < this.explosions.length; i++){
			var explosion = this.explosions[i];
			if(Date.now() - explosion.frameTime > 50 && explosion.frame == explosion.textures.length){
				//delete finished explosion
				removeFromArray(this.objects, explosion);
				this.explosions.splice(i, 1);
			}else if(Date.now() - explosion.frameTime > 50){
				explosion.texture = explosion.textures[explosion.frame];
				explosion.frame++;
				explosion.frameTime = Date.now();
			}
		}
	};

    this.spawnObject = function(Constructor, spawnPoint, goal, shooter){

        if(Constructor == Mage){
            spawnPoint = this.magePos;
        }else if(Constructor == Orb){
            spawnPoint = this.orbPos;
        }else if(Constructor == Enemy){
            spawnPoint = this.entrancePos;
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
            paths.push(findPath(tilemap, transIndex2to1([this.entrancePos[0]  / tilemap.tsize, this.entrancePos[1] / tilemap.tsize], tilemap), transIndex2to1([this.orbPos[0]  / tilemap.tsize - 1, this.orbPos[1] / tilemap.tsize], tilemap)));
            //path to tile above orb
            paths.push(findPath(tilemap, transIndex2to1([this.entrancePos[0]  / tilemap.tsize, this.entrancePos[1] / tilemap.tsize], tilemap), transIndex2to1([this.orbPos[0]  / tilemap.tsize, this.orbPos[1] / tilemap.tsize - 1], tilemap)));
            //path to tile beneath orb
            paths.push(findPath(tilemap, transIndex2to1([this.entrancePos[0]  / tilemap.tsize, this.entrancePos[1] / tilemap.tsize], tilemap), transIndex2to1([this.orbPos[0]  / tilemap.tsize, this.orbPos[1] / tilemap.tsize + 1], tilemap)));
            //path to tile after orb
            paths.push(findPath(tilemap, transIndex2to1([this.entrancePos[0]  / tilemap.tsize, this.entrancePos[1] / tilemap.tsize], tilemap), transIndex2to1([this.orbPos[0]  / tilemap.tsize + 1, this.orbPos[1] / tilemap.tsize], tilemap)));

            paths.sort(function(a,b){
                return a.length - b.length
            })
            obj.path = paths[0];
            obj.path.shift();
        }

        if(Constructor == Projectile){
            obj.shooter = shooter;
        }

        if(Constructor == Menhir || Constructor == Stone || Constructor == Orb){
            this.registerObj(obj, spawnIndex);
        }

        this.sortObjects();
        
    };//end of spawnObject

    this.checkMap = function(i){
        tilemap.tiles[this.orbIndex].blocked = false;
        tilemap.tiles[i].blocked = true;

        var clear = true;
        if(i == this.entranceIndex){
            clear = false;
        }else if(i == this.orbIndex){
            clear = false;
        }else if(i == this.mageIndex){
            clear = false;
        }else if(!findPath(tilemap, this.entranceIndex, this.orbIndex)){
            clear = false;
        }        

        tilemap.tiles[this.orbIndex].blocked = true;
        tilemap.tiles[i].blocked = false;
        return clear;
    };//end of checkpath

    this.createMenhirs = function(){
        for(var i = 0; i < tilemap.tiles.length; i++){
            if(!tilemap.tiles[i].blocked){
                if(Math.random() < 0.05){                    
                    if(this.checkMap(i)){
                        var spawnIndex = transIndex1to2(i, tilemap);
                        this.spawnObject(Menhir, [spawnIndex[0] * tilemap.tsize, spawnIndex[1] * tilemap.tsize]); 
                    }                  
                }
            }
        }
    };

    this.createStones = function(){
        for(var i = 0; i < tilemap.tiles.length; i++){
            if(!tilemap.tiles[i].blocked){
                if(Math.random() < 0.05){                    
                    if(this.checkMap(i)){
                        var spawnIndex = transIndex1to2(i, tilemap);
                        this.spawnObject(Stone, [spawnIndex[0] * tilemap.tsize, spawnIndex[1] * tilemap.tsize]); 
                    }
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