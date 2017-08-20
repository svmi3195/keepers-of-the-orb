function ObjectsManager(t,e){this.objects=[],this.keepers=[],this.movingObjects=[],this.staticObjects=[],this.movingParticles=[],this.autoShooters=[],this.renderObject=function(e){t.drawImage(e.texture,e.x,e.y)},this.renderAll=function(){for(var e=0;e<this.objects.length;e++)t.drawImage(this.objects[e].texture,this.objects[e].x,this.objects[e].y)},this.sortObjects=function(){this.objects.sort(function(t,e){return t.y+t.tileOffsetY-(e.y+e.tileOffsetY)!=0?t.y+t.tileOffsetY-(e.y+e.tileOffsetY):t.x-e.x})},this.registerObj=function(t,s){if(e.tiles[s].object.includes(t))return 0;e.tiles[s].object.push(t),t.index=s,t.blocking&&(e.tiles[s].blocked=!0),t.double&&(e.tiles[s+1].object.push(t),t.blocking&&(e.tiles[s+1].blocked=!0))},this.unregisterObj=function(t,s){removeFromArray(e.tiles[s].object,t),t.blocking&&(e.tiles[s].blocked=!1),t.double&&(removeFromArray(e.tiles[s+1].object,t),t.blocking&&(e.tiles[s+1].blocked=!1))},this.moveObj=function(t){var s=transIndex1to2(t.path[t.path.length-1],e)[0]*e.tsize,i=transIndex1to2(t.path[t.path.length-1],e)[1]*e.tsize;t.path[t.path.length-1]==t.path[t.path.length-2]+1?t.x>s-40?t.moveLeft():t.path.pop():t.path[t.path.length-1]==t.path[t.path.length-2]-1?t.x<s+40?t.moveRight():t.path.pop():t.path[t.path.length-1]==t.path[t.path.length-2]-e.cols?t.y<i+40-t.tileOffsetY?t.moveDown():t.path.pop():t.path[t.path.length-1]==t.path[t.path.length-2]+e.cols&&(t.y>i-40-t.tileOffsetY?t.moveUp():t.path.pop()),this.sortObjects()},this.moveAll=function(){for(var t=0;t<this.movingObjects.length;t++)this.movingObjects[t].path.length>0&&this.moveObj(this.movingObjects[t]);for(var s=this.movingParticles.length-1;s>=0;s--){var i=transIndex2to1([Math.floor(this.movingParticles[s].x/e.tsize),Math.floor(this.movingParticles[s].y/e.tsize)],e);if(this.movingParticles[s].x<=5?(removeFromArray(this.objects,this.movingParticles[s]),this.movingParticles.splice(s,1)):"mountains"==e.tiles[i].terrain?(removeFromArray(this.objects,this.movingParticles[s]),this.movingParticles.splice(s,1)):0==e.tiles[i].object.length||"Menhir"!=e.tiles[i].object[0].name&&"Stone"!=e.tiles[i].object[0].name?Math.abs(this.movingParticles[s].x-this.movingParticles[s].goalX)<3&&Math.abs(this.movingParticles[s].y-this.movingParticles[s].goalY)<3&&(removeFromArray(this.objects,this.movingParticles[s]),this.movingParticles.splice(s,1)):(removeFromArray(this.objects,this.movingParticles[s]),this.movingParticles.splice(s,1)),0!=this.movingObjects.length)for(var t=this.movingObjects.length-1;t>=0;t--){var o=this.movingObjects[t];"Enemy"==o.name&&rectsCollision(o,this.movingParticles[s])&&(this.movingParticles[s].shooter.frags++,removeFromArray(this.objects,o),removeFromArray(this.movingObjects,o),removeFromArray(this.objects,this.movingParticles[s]),this.movingParticles.splice(s,1))}this.movingParticles[s]&&this.movingParticles[s].move()}},this.shoot=function(t,e){this.spawnObject(Projectile,[t.x+20,t.y+20],e,t)},this.processShooters=function(){if(0==this.autoShooters.length)return-1;for(var t=0;t<this.autoShooters.length;t++){var s=this.autoShooters[t].index,i=transIndex1to2(s,e),o=this.autoShooters[t],n=[];"The orb"==o.name?n.push("Enemy"):"Enemy"==o.name&&(n.push("The orb"),n.push("Mage"));var r=function(){for(var t=1;t<=o.shootingRange;t++){for(var s=[],r=2*t+1,h=-t;h<=t;h++)for(var a=0;a<r;a++)transIndex2to1([i[0]-t+a,i[1]+h],e)&&s.push(transIndex2to1([i[0]-t+a,i[1]+h],e));for(var l=0;l<s.length;l++)if(0!=e.tiles[s[l]].object.length&&n.includes(e.tiles[s[l]].object[0].name))return s[l]}return null}();if(r){var h=transIndex1to2(r,e);this.shoot(o,[h[0]*e.tsize+e.tsize/2,h[1]*e.tsize+e.tsize/2])}}},this.spawnObject=function(t,s,i,o){var n=[0,Math.floor(e.rows/2)*e.tsize],r=(e.tsize,Math.floor(e.rows/2),e.tsize,[(e.cols-4)*e.tsize,Math.floor(e.rows/2)*e.tsize]);t==Enemy&&(s=[0,Math.floor(e.rows/2)*e.tsize]);for(var h=transIndex2to1([s[0]/e.tsize,s[1]/e.tsize],e),a=new t(s,i);a.double&&e.tiles[h+1].blocked;)a=new t(s);for(var l=0;l<a.tags.length;l++)this[a.tags[l]].push(a);if(t==Enemy){var c=[];c.push(findPath(e,transIndex2to1([n[0]/e.tsize,n[1]/e.tsize],e),transIndex2to1([r[0]/e.tsize-1,r[1]/e.tsize],e))),c.push(findPath(e,transIndex2to1([n[0]/e.tsize,n[1]/e.tsize],e),transIndex2to1([r[0]/e.tsize,r[1]/e.tsize-1],e))),c.push(findPath(e,transIndex2to1([n[0]/e.tsize,n[1]/e.tsize],e),transIndex2to1([r[0]/e.tsize,r[1]/e.tsize+1],e))),c.push(findPath(e,transIndex2to1([n[0]/e.tsize,n[1]/e.tsize],e),transIndex2to1([r[0]/e.tsize+1,r[1]/e.tsize],e))),c.sort(function(t,e){return t.length-e.length}),a.path=c[0],a.path.shift()}t==Projectile&&(a.shooter=o),t!=Projectile&&this.registerObj(a,h),this.sortObjects()},this.createMenhirs=function(){for(var t=0;t<e.tiles.length;t++)if(!e.tiles[t].blocked&&Math.random()<.05){var s=transIndex1to2(t,e);this.spawnObject(Menhir,[s[0]*e.tsize,s[1]*e.tsize])}},this.createStones=function(){for(var t=0;t<e.tiles.length;t++)if(!e.tiles[t].blocked&&Math.random()<.05){var s=transIndex1to2(t,e);this.spawnObject(Stone,[s[0]*e.tsize,s[1]*e.tsize])}},this.createTests=function(){for(var t=0;t<e.tiles.length;t++)if(!e.tiles[t].blocked&&Math.random()<.05){var s=transIndex1to2(t,e);this.spawnObject(Test,[s[0]*e.tsize,s[1]*e.tsize])}}}