function UI(tilemap, context){
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

    this.render = function(){
        context.fillStyle = 'magenta';   
        context.fillRect(this.x, this.y, this.width, this.height);

        if(this.selected){
            this.drawText(this.selected.name);
        }
        
    };

    this.drawText = function(text){
        context.fillStyle = 'black';
        context.font = '16px serif';
        context.fillText(text, this.x + 10, this.y + 20);
    };
    
};