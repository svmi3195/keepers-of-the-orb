function Tile(index, cols, rows){
   this.index = index;
   this.terrain = 'grass';
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
   //might need later for combat
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
        return this.tiles[row * this.cols + col]
    };

    this.render = function(){
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                var tile = this.getTile(c, r);
                if (tile.terrain == 'grass') {
                    context.drawImage(this.textures[0], c * this.tsize, r * this.tsize);
                }else if (tile.terrain == 'wall'){
                    context.fillStyle = '#0d0d0d';   
                    context.fillRect(c * this.tsize, r * this.tsize, this.tsize, this.tsize);
                }else if (tile.terrain == 'path'){
                    context.fillStyle = 'blue';   
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

    this.update = function(col, row, strTerrain){
        this.tiles[row * this.cols + col].terrain = strTerrain;
        if(strTerrain == 'wall'){
          this.tiles[row * this.cols + col].blocked = true;
        }
    }

    //why do we even need cols and rows here? rewrite with tiles array!
    this.randomize = function(){
        for (var c = 0; c < this.cols; c++) {
            for (var r = 0; r < this.rows; r++) {
                if(Math.random() < 0.2){    
                    this.update(c, r, 'wall');
                }else{
                    this.update(c, r, 'grass');
                }
            }
        }
    };//end of randomize map

};//end of Tilemap

//PATHFINDER
//https://codepen.io/svmi3195/pen/gRrBBJ

//transforms index of 2d array to index of 1d array
function transIndex2to1(arr, map){
  //arr[0] - x
  //arr[1] - y
  return arr[1] * map.cols + arr[0];
}

//transforms index of 1d array to index of 2d array
function transIndex1to2(index, map){
  return [index % map.cols, Math.floor(index / map.cols)]
}

function removeFromArray(array, element){
  for(var i = array.length - 1; i >= 0; i--){
    if(array[i] == element){
      array.splice(i, 1);
    }
  }
}

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
        console.log('Done!');
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


