function UI(tilemap){
    this.width = 500;
    this.height = tilemap.tsize;
    this.x = tilemap.cols * tilemap.tsize / 2 - this.width / 2;
    this.y = (tilemap.rows - 2) * tilemap.tsize;

    this.selected = null;

    this.select = function(obj){
        if(obj == this.selected){
            this.deselect();
        }else{
            this.selected = obj;
            console.log(this.selected);
        }        
    };

    this.deselect = function(){
        this.selected = null;
        console.log(this.selected);
    };

    this.render = function(context){
        context.fillStyle = 'magenta';   
        context.fillRect(this.x, this.y, this.width, this.height);
    }
};