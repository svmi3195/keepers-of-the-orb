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