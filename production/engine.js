function Tile(t,i,s){this.index=t,this.terrain="grass",this.textureNum=Math.floor(6*Math.random()),this.object=[],this.f=0,this.g=0,this.h=0,this.previous=void 0,this.blocked=!1,this.neighbors=[t-1,t+1,t-i,t+i].filter(function(t){return t>=0&&t<i*s&&((this.index%i!=0||t!=this.index-1)&&((this.index+1)%i!=0||t!=this.index+1))},this),this.diagonalNeighbors=[t-i-1,t+i-1,t-i+1,t+i+1].filter(function(t){return t>=0&&t<i*s&&((this.index%i!=0||t!=this.index-1&&t!=this.index-i-1&&t!=this.index+i-1)&&((this.index+1)%i!=0||t!=this.index+1&&t!=this.index-i+1&&t!=this.index+i+1))},this)}function Tilemap(t,i){this.tsize=40,this.cols=Math.ceil(t.width/this.tsize),this.rows=Math.ceil(t.height/this.tsize),this.tiles=[];for(var s=0;s<this.cols*this.rows;s++)this.tiles.push(new Tile(s,this.cols,this.rows));this.grassTextures=[];for(var e=1;e<=6;e++)this.grassTextures.push(document.getElementById("grass-"+e));this.mountainsTextures=[];for(var e=1;e<=6;e++)this.mountainsTextures.push(document.getElementById("mountains-"+e));this.getTile=function(t,i){return this.tiles[i*this.cols+t]},this.render=function(){for(var t=0;t<this.cols;t++)for(var s=0;s<this.rows;s++){var e=this.getTile(t,s);"grass"==e.terrain?i.drawImage(this.grassTextures[e.textureNum],t*this.tsize,s*this.tsize):"path"==e.terrain?(i.fillStyle="blue",i.fillRect(t*this.tsize,s*this.tsize,this.tsize,this.tsize)):"mountains"==e.terrain&&i.drawImage(this.mountainsTextures[e.textureNum],t*this.tsize,s*this.tsize)}},this.renderGrid=function(){for(var t=0;t<this.cols;t++)for(var s=0;s<this.rows;s++)i.strokeStyle="white",i.strokeRect(t*this.tsize,s*this.tsize,this.tsize,this.tsize)},this.update=function(t,i){this.tiles[t].terrain=i,this.tiles[t].blocked="mountains"==i},this.populate=function(){for(var i=0;i<this.tiles.length;i++)this.update(i,"grass");for(var s=0;s<this.cols;s++)this.update(s,"mountains");for(var e=this.tiles.length-this.cols;e<this.tiles.length;e++)this.update(e,"mountains");for(var e=this.tiles.length-2*this.cols;e<this.tiles.length-this.cols;e++)this.update(e,"mountains");for(var h=0;h<this.tiles.length;h+=this.cols)this.update(h,"mountains");for(var r=this.cols-1;r<this.tiles.length-1;r+=this.cols)this.update(r,"mountains");if(this.cols-t.width/this.tsize>.5)for(var r=this.cols-2;r<this.tiles.length-2;r+=this.cols)this.update(r,"mountains");this.update(transIndex2to1([0,Math.floor(this.rows/2)],this),"grass"),this.update(transIndex2to1([this.cols-4,Math.floor(this.rows/2)],this),"grass")}}function heuristic(t,i){var s=t[0]-i[0],e=t[1]-i[1];return Math.abs(s)+Math.abs(e)}function findPath(t,i,s){var e=[],h=[],r=[];i||(i=0),s||(s=t.tiles.length-1),h.push(i);for(var n=!1,o=0;!n;){if(o++,!(h.length>0))return n=!0,void pathfinderCleanUp(t);for(var l=0,a=0;a<h.length;a++)t.tiles[h[a]].f<t.tiles[h[l]].f&&(l=a);var u=h[l];if(u==s){n=!0,e.push(i);var d=u;for(e.push(d);t.tiles[d].previous;)e.push(t.tiles[d].previous),d=t.tiles[d].previous}removeFromArray(h,u),r.push(u);for(var f=t.tiles[u].neighbors,c=0;c<f.length;c++){var g=f[c];if(!r.includes(g)&&!1===t.tiles[g].blocked){var p=t.tiles[u].g+1,v=!1;h.includes(g)?p<t.tiles[g].g&&(t.tiles[g].g=p,v=!0):(t.tiles[g].g=p,v=!0,h.push(g)),v&&(t.tiles[g].h=heuristic(transIndex1to2(g,t),transIndex1to2(s,t)),t.tiles[g].f=t.tiles[g].g+t.tiles[g].h,t.tiles[g].previous=u)}}}return pathfinderCleanUp(t),e}function pathfinderCleanUp(t){for(var i=0;i<t.tiles.length;i++)t.tiles[i].f=0,t.tiles[i].g=0,t.tiles[i].h=0,t.tiles[i].previous=void 0}function rectsCollision(t,i){return t.x+t.width>=i.x&&t.x<=i.x+i.width&&t.y+t.height>=i.y&&t.y<=i.y+i.height}function rectPointCollision(t,i){return i.x>t.x&&i.x<t.x+t.width&&i.y>t.y&&i.y<t.y+t.height}