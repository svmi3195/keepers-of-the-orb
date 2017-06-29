function Tile(index, cols, rows){
   this.index = index;
   this.terrain = 'grass';
   this.textureNum = Math.floor(Math.random() * 6);
   this.f = 0;
   this.g = 0;
   this.h = 0;
   this.previous = undefined;
   this.blocked = false;
   //[index - 1, index + 1, index - cols , index + cols] - without diagonals
   //[index - cols - 1, index + cols - 1, index - cols + 1, index + cols + 1] - diagonals
   //[index - 1, index + 1, index - cols, index + cols, index - cols - 1, index + cols - 1, index - cols + 1, index + cols + 1] - all
   this.neighbors = [index - 1, index + 1, index - cols, index + cols].filter(function(x){
     //start and end checker
     if(x >= 0 && x < cols * rows){ 
       //left edge checker
	   //diagonals: if(this.index % cols == 0 && (x == this.index - 1 || x == this.index - cols - 1 || x == this.index + cols - 1))
       if(this.index % cols == 0 && x == this.index - 1){ 
          return false;
       }
       //right edge checker
	   //diagonals: if((this.index + 1) % cols == 0 && (x == this.index + 1 || x == this.index - cols + 1 || x == this.index + cols + 1))
       if((this.index + 1) % cols == 0 && x == this.index + 1){ 
          return false;
       }       
       return true;
     }
     return false;  
   }, this);
   //might need later for combat/interaction
   this.diagonalNeighbors = [index - cols - 1, index + cols - 1, index - cols + 1, index + cols + 1].filter(function(x){
     if(x >= 0 && x < cols * rows){ 
       //left edge checker
	   if(this.index % cols == 0 && (x == this.index - 1 || x == this.index - cols - 1 || x == this.index + cols - 1)){ 
          return false;
       }
       //right edge checker
     if((this.index + 1) % cols == 0 && (x == this.index + 1 || x == this.index - cols + 1 || x == this.index + cols + 1)){
          return false;
       }       
       return true;
     }
     return false;
   }, this);
};

function Tilemap(canvas, context) {    
    this.tsize = 40; //tile size (40 x 40)
    this.cols = Math.ceil(canvas.width / this.tsize);
    this.rows = Math.ceil(canvas.height / this.tsize);

    this.tiles = [];
    for(var i = 0; i < this.cols * this.rows; i++){
        this.tiles.push(new Tile(i, this.cols, this.rows));
    };

    this.textures = [];         
    for(var j = 1; j <= 7; j++){ //change when have spritesheet
        this.textures.push(document.getElementById(('grass-' + j)));
    }

    this.getTile = function(col, row) {
        return this.tiles[row * this.cols + col];
    };

    this.render = function(){
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                var tile = this.getTile(c, r);
                if (tile.terrain == 'grass') {
                    context.drawImage(this.textures[tile.textureNum], c * this.tsize, r * this.tsize);
                }else if (tile.terrain == 'wall'){
                    context.fillStyle = '#0d0d0d';   
                    context.fillRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);
                }else if (tile.terrain == 'path'){
                    context.fillStyle = 'blue';   
                    context.fillRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);
                }else if (tile.terrain == 'mountains'){
                    context.fillStyle = 'red';   
                    context.fillRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);
                }
            }
        }
    };//end of Tilemap render

    this.renderGrid = function(){
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                context.strokeStyle = 'white';
                context.strokeRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);
            }
        }
    };// end of Tilemap render grid

    this.update = function(index, strTerrain){
        this.tiles[index].terrain = strTerrain;
        if(strTerrain == 'wall' || strTerrain == 'mountains'){
          this.tiles[index].blocked = true;
        }else{
          this.tiles[index].blocked = false;
        }
    }

    this.populate = function(){

      for(var i = 0; i < this.tiles.length; i++){
        if(Math.random() < 0.15){
          this.update(i, 'wall');
        }else{
          this.update(i, 'grass');
        }
      }

      for(var iTop = 0; iTop < this.cols; iTop++){
        this.update(iTop, 'mountains');
      }

      for(var iBottom = this.tiles.length - this.cols; iBottom < this.tiles.length; iBottom++){
        this.update(iBottom, 'mountains');
      }

     for(var iBottom = this.tiles.length - this.cols * 2; iBottom < this.tiles.length - this.cols; iBottom++){
        this.update(iBottom, 'mountains');
     }

      for(var iLeft = 0; iLeft < this.tiles.length; iLeft += this.cols){
        this.update(iLeft, 'mountains');
      }      

      for(var iRight = this.cols - 1; iRight < this.tiles.length - 1; iRight += this.cols){
        this.update(iRight, 'mountains');
      }

      if(this.cols - canvas.width / this.tsize > 0.5){
        for(var iRight = this.cols - 2; iRight < this.tiles.length - 2; iRight += this.cols){
          this.update(iRight, 'mountains');
        }
      }

      
        
      this.update(transIndex2to1([0, Math.floor(this.rows/2)], this), 'grass'); //entrance
      this.update(transIndex2to1([this.cols - 4, Math.floor(this.rows/2)], this), 'grass'); //orb
        
    };//end of populate map

};//end of Tilemap

//PATHFINDER
//https://codepen.io/svmi3195/pen/gRrBBJ


function heuristic(point1, point2){
  var a = point1[0] - point2[0];
  var b = point1[1] - point2[1];
  
  //euclidian distance
  //var distance = Math.sqrt( a*a + b*b );
  //manhattan distance
  var distance = Math.abs(a) + Math.abs(b);
  return distance; 
}

function findPath(map, start, goal){
  var path = [];
  var openList = [];
  var closedList = [];
  if(!start){start = 0}
  if(!goal){goal = map.tiles.length -1}
    
  openList.push(start);
  
  var done = false;
  var iteration = 0;
  
  while(!done){
    iteration++;
    if(openList.length > 0){
      var winner = 0;
      for(var i = 0; i < openList.length; i++){
        if(map.tiles[openList[i]].f < map.tiles[openList[winner]].f){
          winner = i;
        }
      }
      var current = openList[winner];
      
      if(current == goal){
        done = true;
        path.push(start);
        var temp = current;
        path.push(temp);
        while(map.tiles[temp].previous){
          path.push(map.tiles[temp].previous);
          temp = map.tiles[temp].previous;
        }
      }

      removeFromArray(openList, current);
      closedList.push(current);

      var neighbors = map.tiles[current].neighbors;
      for(var nb = 0; nb < neighbors.length; nb++){
        var neighbor = neighbors[nb];

        if(!closedList.includes(neighbor) && map.tiles[neighbor].blocked === false){
           var tempG = map.tiles[current].g + 1;
          
          var newPath = false;
          if(openList.includes(neighbor)){
            if(tempG < map.tiles[neighbor].g){
              map.tiles[neighbor].g = tempG;
              newPath = true;
            }          
          }else{
            map.tiles[neighbor].g = tempG;
            newPath = true;
            openList.push(neighbor);
          }
          
          if(newPath){
            map.tiles[neighbor].h = heuristic(transIndex1to2(neighbor, map), transIndex1to2(goal, map));
            map.tiles[neighbor].f = map.tiles[neighbor].g + map.tiles[neighbor].h;
            map.tiles[neighbor].previous = current;
          }
        }
      }
    
  }else{
    //no solution
    done = true;
    pathfinderCleanUp(map);
    return undefined;
  }

    
  //visualize path with blue rects:  
  for(var p = 0; p < path.length; p++){
      map.tiles[path[p]].terrain = 'path';
  }
  
  }
  
  pathfinderCleanUp(map);
  return path;
};//end of findPath

function pathfinderCleanUp(map){
  for(var i = 0; i < map.tiles.length; i++){    
    map.tiles[i].f = 0;
    map.tiles[i].g = 0;
    map.tiles[i].h = 0;
    map.tiles[i].previous = undefined;
  }
}


