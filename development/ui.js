function UI(map){
    this.width = 500;
    this.height = map.tsize;
    this.x = map.cols * map.tsize / 2 - this.width / 2;
    this.y = (map.rows - 2) * map.tsize;

    this.onObjectSelect = function(object){
        console.log(object.name);
    };

    this.render = function(context){
        context.fillStyle = 'magenta';   
        context.fillRect(this.x, this.y, this.width, this.height);
    }
};