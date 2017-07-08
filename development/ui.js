function UI(tilemap, context){
    this.width = 500;
    this.height = tilemap.tsize;
    this.x = tilemap.cols * tilemap.tsize / 2 - this.width / 2;
    this.y = (tilemap.rows - 2) * tilemap.tsize;

    this.selected = null;

    this.themes = [{id: 0, name: 'black-golden', colors: ['#1a1a00', '#D4AF37']}, 
                   {id: 1, name: 'black-silver', colors: ['#1a1a1a', '#c0c0c0']},
                   {id: 2, name: 'black-purple', colors: ['#1a0033', '#bb33ff']}];
    this.backgroundColor = this.themes[0].colors[0];
    this.mainColor = this.themes[0].colors[1];

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
        context.fillStyle = this.backgroundColor;   
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeStyle = this.mainColor;
        context.lineWidth = 3;
        context.strokeRect(this.x, this.y, this.width, this.height);

        if(this.selected){
            var text = this.selected.name;
            if(this.selected.hasOwnProperty('frags')){
                text += ', frags count: ' + this.selected.frags;
            }
            this.drawText(text);
        }
        
    };

    this.drawText = function(text){
        context.fillStyle = this.mainColor;
        context.font = '20px serif';
        context.fillText(text, this.x + 10, this.y + 25);
    };
    
};