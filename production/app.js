function runGame(){var t=document.getElementById("game"),i=t.getContext("2d");t.width=window.innerWidth,t.height=window.innerHeight,new Tilemap(5,5,i).render()}function Tilemap(t,i,e){this.cols=t,this.rows=i,this.tsize=40,this.tiles=[];for(var s=0;s<this.cols*this.rows;s++)this.tiles.push(0);this.getTile=function(t,i){return this.tiles[i*this.cols+t]},this.render=function(){for(var t=0;t<this.cols;t++)for(var i=0;i<this.rows;i++){var s=this.getTile(t,i);0==s&&(e.fillRect(t*this.tsize,i*this.tsize,this.tsize,this.tsize),e.strokeStyle="white",e.strokeRect(t*this.tsize,i*this.tsize,this.tsize,this.tsize))}}}document.addEventListener("DOMContentLoaded",function(){runGame()});